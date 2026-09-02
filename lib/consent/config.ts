/**
 * Consent configuration — the single place that defines the consent policy
 * version, the storage key, retention, and the human-readable category
 * descriptions shown in the UI and mirrored in /privacy.
 */
import type { ConsentState } from '@/lib/consent/types';

/**
 * Consent policy version. Increment ONLY when purposes, vendors, or material
 * processing details change — never for minor copy edits. A stored decision
 * whose version does not match this is treated as undecided (fail closed), so
 * the banner re-appears and analytics stays off until a fresh opt-in.
 */
export const CONSENT_VERSION = 1;

/** First-party storage key for the single consent preference record. */
export const CONSENT_STORAGE_KEY = 'agricultureid_consent';

/**
 * How long a stored decision is honoured before we ask again: ~6 months.
 * Enforced in code because the record lives in localStorage, which has no
 * built-in expiry.
 */
export const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 183; // ≈ 6 months

/**
 * How far in the future a stored `decidedAt` may be before we distrust it (clock
 * skew tolerance, ~1 day). A record dated further ahead is treated as invalid
 * and re-asked, so a mis-set device clock cannot mint a decision that outlives
 * the retention window.
 */
export const CONSENT_FUTURE_SKEW_MS = 1000 * 60 * 60 * 24; // 1 day

/** The default state for anyone without a valid stored decision: fail closed. */
export const UNDECIDED_STATE: ConsentState = {
  status: 'undecided',
  necessary: true,
  analytics: false,
  decidedAt: null,
};

/** UI/policy copy for each category. Necessary cannot be toggled. */
export interface CategoryInfo {
  key: 'necessary' | 'analytics';
  label: string;
  description: string;
  required: boolean;
}

export const CONSENT_CATEGORIES: readonly CategoryInfo[] = [
  {
    key: 'necessary',
    label: 'Necessary',
    description:
      'Required for core website operation and saving your privacy choices.',
    required: true,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description:
      'Allows WebmasterID to measure website usage and performance. Off unless you turn it on.',
    required: false,
  },
] as const;
