'use client';

import { useEffect } from 'react';
import { useConsent } from '@/components/consent/context';
import { syncWebmasterID } from '@/lib/analytics/webmasterid';

/**
 * Consent-gated WebmasterID loader. Renders NOTHING — it injects the tracker
 * imperatively so the script never appears in the server-rendered HTML and is
 * requested only after an explicit analytics opt-in.
 *
 * - undecided or analytics=false → no script is present;
 * - analytics=true → the tracker is injected exactly once
 *   ({@link syncWebmasterID} is idempotent, so re-renders and client-side
 *   navigation never duplicate it);
 * - the effect re-runs only when the analytics flag flips, not on navigation
 *   (the root layout — and this component — persist across route changes).
 *
 * Withdrawal from an active tracker is handled by ConsentProvider with a page
 * reload; this component simply reflects the current flag.
 */
export function Analytics() {
  const { hydrated, state } = useConsent();

  useEffect(() => {
    if (!hydrated) return; // do nothing until the stored decision is known
    syncWebmasterID(document, state.analytics);
  }, [hydrated, state.analytics]);

  return null;
}
