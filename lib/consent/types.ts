/**
 * Consent domain types (Phase: GDPR/ePrivacy analytics consent).
 *
 * One canonical consent shape used by storage, the provider, and the UI. There
 * is no bundled "accept everything" state — each non-necessary purpose is a
 * distinct, explicit boolean.
 */

/** The consent purposes the site recognises. `necessary` is always true. */
export type ConsentCategory = 'necessary' | 'analytics';

/** Whether the visitor has made an affirmative choice yet. */
export type ConsentStatus = 'undecided' | 'decided';

/**
 * The persisted record (see lib/consent/storage.ts). `necessary` is always
 * `true`; it exists in the record for transparency, not because it can be
 * turned off. `analytics` is the only meaningful stored decision.
 */
export interface ConsentRecord {
  /** Consent policy version — see lib/consent/config.ts. */
  version: number;
  /** Always true; strictly-necessary operation cannot be declined. */
  necessary: true;
  /** True only after an explicit analytics opt-in. */
  analytics: boolean;
  /** ISO-8601 timestamp of the decision. */
  decidedAt: string;
}

/**
 * The in-memory state the app reasons about. Distinct from `ConsentRecord`
 * because it also expresses the pre-decision (`undecided`) condition, which is
 * never persisted — an undecided visitor has nothing stored.
 */
export interface ConsentState {
  status: ConsentStatus;
  /** Always true. */
  necessary: true;
  /** Undecided visitors are analytics=false (default-denied). */
  analytics: boolean;
  /** ISO-8601 timestamp, or null when undecided. */
  decidedAt: string | null;
}
