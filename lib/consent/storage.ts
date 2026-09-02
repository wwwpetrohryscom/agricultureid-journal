/**
 * Consent persistence — one first-party record, read/written defensively.
 *
 * ## Storage choice: localStorage (documented)
 *
 * The site is fully static (SSG on a CDN); no server ever needs to read the
 * visitor's choice, so a cookie — which would be sent on every request — buys
 * nothing. The decision is stored as a single first-party `localStorage` entry
 * (`agricultureid_consent`). This keeps the preference on the device, out of
 * request headers, and off the network entirely. Retention is enforced in code
 * (localStorage has no expiry).
 *
 * ## Fail closed
 *
 * Any problem — nothing stored, malformed JSON, wrong shape, unknown version,
 * expired, or storage access denied (private mode) — resolves to the UNDECIDED
 * state (analytics OFF, banner shown). Analytics is never enabled by accident.
 */
import {
  CONSENT_FUTURE_SKEW_MS,
  CONSENT_MAX_AGE_MS,
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  UNDECIDED_STATE,
} from '@/lib/consent/config';
import type { ConsentRecord, ConsentState } from '@/lib/consent/types';

/** Build the persisted record for an explicit choice. */
export function makeRecord(analytics: boolean, nowMs: number): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics,
    decidedAt: new Date(nowMs).toISOString(),
  };
}

export function serializeConsent(record: ConsentRecord): string {
  return JSON.stringify(record);
}

/**
 * Parse a raw stored value into a ConsentState, failing CLOSED on anything
 * unexpected. Pure — no I/O — so the whole decision table is unit-testable.
 */
export function parseConsent(raw: string | null, nowMs: number): ConsentState {
  if (raw == null) return UNDECIDED_STATE;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return UNDECIDED_STATE; // malformed JSON
  }

  if (typeof parsed !== 'object' || parsed === null) return UNDECIDED_STATE;
  const rec = parsed as Record<string, unknown>;

  // Unknown / superseded policy version → re-ask.
  if (rec.version !== CONSENT_VERSION) return UNDECIDED_STATE;
  // A record that does not affirm necessary=true is malformed.
  if (rec.necessary !== true) return UNDECIDED_STATE;
  // analytics must be an explicit boolean.
  if (typeof rec.analytics !== 'boolean') return UNDECIDED_STATE;
  // decidedAt must be a valid, non-future-broken timestamp.
  if (typeof rec.decidedAt !== 'string') return UNDECIDED_STATE;
  const decidedMs = Date.parse(rec.decidedAt);
  if (Number.isNaN(decidedMs)) return UNDECIDED_STATE;
  // Implausibly future timestamps (mis-set clock) are distrusted and re-asked —
  // otherwise a future date would never satisfy the expiry check below and the
  // decision would outlive the retention window.
  if (decidedMs - nowMs > CONSENT_FUTURE_SKEW_MS) return UNDECIDED_STATE;
  // Expired decisions are re-asked (age computed against MAX_AGE).
  if (nowMs - decidedMs > CONSENT_MAX_AGE_MS) return UNDECIDED_STATE;

  return {
    status: 'decided',
    necessary: true,
    analytics: rec.analytics,
    decidedAt: rec.decidedAt,
  };
}

/**
 * Resolve a Storage, never throwing. Returns null when storage is unavailable
 * (SSR, or a browser that denies access) so callers fail closed.
 */
function safeStorage(store?: Storage): Storage | null {
  if (store) return store;
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Read the current decision, failing closed on any error. */
export function readConsent(nowMs: number, store?: Storage): ConsentState {
  const s = safeStorage(store);
  if (!s) return UNDECIDED_STATE;
  let raw: string | null;
  try {
    raw = s.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return UNDECIDED_STATE; // access denied
  }
  return parseConsent(raw, nowMs);
}

/**
 * Persist an explicit choice. Returns the resulting state (decided), or the
 * UNDECIDED state if the write could not be performed (so the UI does not claim
 * a decision was saved when it was not).
 */
export function writeConsent(
  analytics: boolean,
  nowMs: number,
  store?: Storage,
): ConsentState {
  const record = makeRecord(analytics, nowMs);
  const s = safeStorage(store);
  if (!s) return UNDECIDED_STATE;
  try {
    s.setItem(CONSENT_STORAGE_KEY, serializeConsent(record));
  } catch {
    return UNDECIDED_STATE; // write failed → still undecided
  }
  return {
    status: 'decided',
    necessary: true,
    analytics: record.analytics,
    decidedAt: record.decidedAt,
  };
}

/** Remove the stored decision (used only by explicit tooling/tests). */
export function clearConsent(store?: Storage): void {
  const s = safeStorage(store);
  if (!s) return;
  try {
    s.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
