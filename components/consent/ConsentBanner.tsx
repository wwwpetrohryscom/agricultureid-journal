'use client';

import { useConsent } from './context';
import { platformUrl } from '@/lib/site';

/**
 * NOTE — copied from the main AgricultureID platform and adjusted in exactly
 * one place: the privacy-policy link is built with `platformUrl()` rather than
 * left as a root-relative path.
 *
 * The Journal runs under basePath "/journal", so a root-relative href here
 * would still resolve to agricultureid.com/privacy and work — but only by
 * accident, and the routing gate cannot then tell a deliberate link to the
 * knowledge platform apart from a URL that escaped the namespace by mistake.
 * Making it absolute makes the intent checkable.
 */

/**
 * First-layer consent banner for undecided visitors.
 *
 * Non-modal (a `region` landmark, not a dialog): it never blocks content and is
 * not a cookie wall. The three actions carry equal visual weight — Reject is not
 * hidden, recoloured, or de-emphasised relative to Accept — and consent is given
 * only by pressing Accept; scrolling, closing, or ignoring the banner does not
 * grant it. Native `<button>`s make it fully keyboard operable. Focus is not
 * stolen, so normal tab order is undisturbed.
 */
/**
 * One shared style for all three first-layer actions, so Accept and Reject (and
 * Manage) carry EQUAL visual weight — no filled-vs-outline hierarchy that would
 * make accepting more prominent than refusing (EDPB 03/2022 deceptive-design).
 */
const BANNER_BTN =
  'inline-flex items-center justify-center rounded-md border border-olive-700 bg-white px-4 py-2 text-sm font-semibold text-olive-800 hover:bg-olive-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-700';

export function ConsentBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useConsent();

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-labelledby="consent-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white/95 shadow-[0_-2px_16px_rgba(0,0,0,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div>
          <h2
            id="consent-banner-title"
            className="font-serif text-base font-bold text-ink-900"
          >
            Privacy choices
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-700">
            We use necessary technologies to operate this website. With your
            permission, we also use WebmasterID analytics to understand website
            usage and improve AgricultureID. Analytics is optional and remains
            disabled unless you accept it. See our{' '}
            <a
              href={platformUrl('/privacy')}
              className="font-medium text-olive-800 underline hover:text-olive-900"
            >
              privacy policy
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button type="button" onClick={acceptAll} className={BANNER_BTN}>
            Accept analytics
          </button>
          <button type="button" onClick={rejectAll} className={BANNER_BTN}>
            Reject analytics
          </button>
          <button
            type="button"
            onClick={openPreferences}
            className={BANNER_BTN}
          >
            Manage preferences
          </button>
        </div>
      </div>
    </div>
  );
}
