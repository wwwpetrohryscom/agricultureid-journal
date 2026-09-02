'use client';

import { useEffect, useRef, useState } from 'react';
import { CONSENT_CATEGORIES } from '@/lib/consent/config';
import { useConsent } from './context';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Shared style so "Accept all" and "Reject all" have identical prominence. */
const PREFS_SECONDARY_BTN =
  'inline-flex items-center justify-center rounded-md border border-olive-700 bg-white px-4 py-2 text-sm font-semibold text-olive-800 hover:bg-olive-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-700';

/**
 * Preferences dialog (second layer). A real modal: `role="dialog"` +
 * `aria-modal`, focus is moved in on open and trapped, Escape / Cancel / the
 * backdrop actively cancel (close WITHOUT applying), and focus returns to
 * whatever opened it. The analytics control is a plain checkbox that starts from
 * the current decision — OFF for anyone who has not opted in — and only an
 * explicit Save / Accept all / Reject all writes a decision.
 */
export function ConsentPreferences() {
  const { preferencesOpen, state, savePreferences, closePreferences } =
    useConsent();
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  // On open: remember the opener, seed the toggle from the current decision,
  // and move focus into the dialog.
  useEffect(() => {
    if (!preferencesOpen) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    setAnalytics(state.analytics);
    const raf = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? dialogRef.current)?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [preferencesOpen, state.analytics]);

  // On close: restore focus to the opener (unless a reload is taking over).
  useEffect(() => {
    if (preferencesOpen || !openerRef.current) return;
    const opener = openerRef.current;
    openerRef.current = null;
    if (document.contains(opener) && typeof opener.focus === 'function')
      opener.focus();
  }, [preferencesOpen]);

  if (!preferencesOpen) return null;

  const cancel = () => closePreferences();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      cancel();
      return;
    }
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const necessary = CONSENT_CATEGORIES.find((c) => c.key === 'necessary')!;
  const analyticsCat = CONSENT_CATEGORIES.find((c) => c.key === 'analytics')!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={cancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-prefs-title"
        aria-describedby="consent-prefs-desc"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="consent-prefs-title"
            className="font-serif text-lg font-bold text-ink-900"
          >
            Privacy preferences
          </h2>
          <button
            type="button"
            onClick={cancel}
            aria-label="Close without saving"
            className="rounded p-1 text-ink-500 hover:bg-ink-50 hover:text-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-400"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p id="consent-prefs-desc" className="mt-1 text-sm text-ink-600">
          Choose which optional technologies you allow. Necessary technologies
          are always on. Your choice is saved on this device and can be changed
          any time from “Privacy settings” in the footer.
        </p>

        <ul className="mt-5 space-y-4">
          <li className="rounded-lg border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-ink-900">
                  {necessary.label}
                </span>
                <p className="mt-1 text-sm text-ink-600">
                  {necessary.description}
                </p>
              </div>
              <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-ink-500">
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Necessary — always active"
                  className="h-4 w-4"
                />
                Always active
              </label>
            </div>
          </li>

          <li className="rounded-lg border border-ink-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <label
                  htmlFor="consent-analytics-toggle"
                  className="text-sm font-semibold text-ink-900"
                >
                  {analyticsCat.label}
                </label>
                <p className="mt-1 text-sm text-ink-600">
                  {analyticsCat.description}
                </p>
              </div>
              <input
                id="consent-analytics-toggle"
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0"
              />
            </div>
          </li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {/* Accept all / Reject all carry EQUAL weight (same style); Save is the
              primary because it applies the toggle above, which may be OFF. */}
          <button
            type="button"
            onClick={() => savePreferences(false)}
            className={PREFS_SECONDARY_BTN}
          >
            Reject all
          </button>
          <button
            type="button"
            onClick={() => savePreferences(true)}
            className={PREFS_SECONDARY_BTN}
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => savePreferences(analytics)}
            className="inline-flex items-center justify-center rounded-md border border-olive-700 bg-olive-700 px-4 py-2 text-sm font-semibold text-white hover:bg-olive-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-700"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
