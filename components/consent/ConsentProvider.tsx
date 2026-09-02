'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CONSENT_STORAGE_KEY, UNDECIDED_STATE } from '@/lib/consent/config';
import { readConsent, writeConsent } from '@/lib/consent/storage';
import { reloadPage } from '@/lib/consent/reload';
import { removeWebmasterID } from '@/lib/analytics/webmasterid';
import type { ConsentState } from '@/lib/consent/types';
import { ConsentContext, type ConsentContextValue } from './context';
import { ConsentBanner } from './ConsentBanner';
import { ConsentPreferences } from './ConsentPreferences';
import { Analytics } from '@/components/analytics/Analytics';

/**
 * The single source of consent truth for the app.
 *
 * SSR and the first client paint both start UNDECIDED with `hydrated = false`,
 * so nothing consent-dependent (banner, tracker) renders on the server — no
 * hydration mismatch, and no analytics in the initial HTML. After mount we read
 * the stored decision once and settle the real state.
 *
 * Analytics injection lives in <Analytics/> (keyed on the analytics flag).
 * Withdrawal from an *active* tracker additionally reloads the page, because
 * removing the script element cannot undo whatever a running IIFE already
 * started — a reload is the only reliable teardown without a verified vendor API.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>(UNDECIDED_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Latest state for use inside callbacks without stale closures.
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState(readConsent(Date.now()));
    setHydrated(true);
  }, []);

  // Cross-tab consent: if the decision changes in ANOTHER tab (localStorage
  // `storage` events fire only in other documents), mirror it here. A withdrawal
  // that happened elsewhere (analytics true → false) tears this tab's tracker
  // down too, so withdrawal actually stops processing in every open tab.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== null && e.key !== CONSENT_STORAGE_KEY) return;
      const prevAnalytics = stateRef.current.analytics;
      const next = readConsent(Date.now());
      setState(next);
      if (prevAnalytics && !next.analytics) {
        if (typeof document !== 'undefined') removeWebmasterID(document);
        reloadPage();
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const applyChoice = useCallback((nextAnalytics: boolean) => {
    const prevAnalytics = stateRef.current.analytics;
    const now = Date.now();
    // Best-effort persist; a denied write means we ask again next visit (fail
    // closed on the next read), never that analytics turns on silently.
    const persisted = writeConsent(nextAnalytics, now).status === 'decided';
    setState({
      status: 'decided',
      necessary: true,
      analytics: nextAnalytics,
      decidedAt: new Date(now).toISOString(),
    });
    setPreferencesOpen(false);
    // Withdrawal from an already-running tracker: remove the script now, and
    // reload for a clean teardown — but ONLY if the refusal actually persisted,
    // so we never reload back into a stale, still-stored analytics=true record.
    if (prevAnalytics && !nextAnalytics) {
      if (typeof document !== 'undefined') removeWebmasterID(document);
      if (persisted) reloadPage();
    }
  }, []);

  const acceptAll = useCallback(() => applyChoice(true), [applyChoice]);
  const rejectAll = useCallback(() => applyChoice(false), [applyChoice]);
  const savePreferences = useCallback(
    (analytics: boolean) => applyChoice(analytics),
    [applyChoice],
  );
  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      hydrated,
      showBanner: hydrated && state.status === 'undecided',
      preferencesOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
    }),
    [
      state,
      hydrated,
      preferencesOpen,
      acceptAll,
      rejectAll,
      savePreferences,
      openPreferences,
      closePreferences,
    ],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      <ConsentBanner />
      <ConsentPreferences />
      <Analytics />
    </ConsentContext.Provider>
  );
}
