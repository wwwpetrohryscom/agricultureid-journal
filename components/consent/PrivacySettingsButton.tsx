'use client';

import { useConsent } from './context';

/**
 * Persistent footer control to (re)open the preferences dialog at any time —
 * the withdrawal/revocation entry point required so changing consent is as easy
 * as giving it. A real `<button>`; it opens the same dialog the banner does.
 *
 * `className` lets the footer style it identically to its adjacent legal links.
 */
export function PrivacySettingsButton({ className }: { className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Privacy settings
    </button>
  );
}
