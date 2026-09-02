/**
 * The WebmasterID tracker contract and its DOM injection/teardown.
 *
 * This is the ONLY place the WebmasterID script is described or injected. The
 * functions take a `Document` explicitly so the singleton and teardown logic is
 * unit-testable against a fake document, and so there is a single, auditable
 * loading path (see the consent audit and the repo search in the PR).
 *
 * Values are PUBLIC, client-side identifiers supplied by the site owner, not
 * secrets. Do NOT revert `data-wmid`/`data-endpoint` to the earlier guessed
 * `data-site-id`, and do NOT add `@webmasterid/sdk-next`.
 */

export const WEBMASTERID_SCRIPT_ID = 'webmasterid-tracker';
export const WEBMASTERID_SRC = 'https://webmasterid.com/tracker.iife.min.js';
export const WEBMASTERID_SITE_ID = 'wm_e5zinq4tbv63jqtx';
export const WEBMASTERID_ENDPOINT =
  'https://webmasterid-ingest-api.vercel.app/api/events';

/** Is the tracker script currently present in the document? */
export function hasWebmasterID(doc: Document): boolean {
  return doc.getElementById(WEBMASTERID_SCRIPT_ID) != null;
}

/**
 * Inject the tracker exactly once. Idempotent: if a script with the tracker id
 * already exists, this does nothing, so repeated calls (re-renders, navigation,
 * rapid consent toggles) never create a second instance.
 *
 * The vendor's IIFE reads `data-wmid`/`data-endpoint` from its own tag located
 * by `id`, so the attributes are set before the element is connected.
 */
export function injectWebmasterID(doc: Document): void {
  if (hasWebmasterID(doc)) return;
  const el = doc.createElement('script');
  el.id = WEBMASTERID_SCRIPT_ID;
  el.defer = true;
  el.src = WEBMASTERID_SRC;
  el.setAttribute('data-wmid', WEBMASTERID_SITE_ID);
  el.setAttribute('data-endpoint', WEBMASTERID_ENDPOINT);
  (doc.head ?? doc.documentElement).appendChild(el);
}

/** Remove the tracker script element if present. */
export function removeWebmasterID(doc: Document): void {
  doc.getElementById(WEBMASTERID_SCRIPT_ID)?.remove();
}

/**
 * Make the document match the desired analytics state: present iff enabled.
 * This is the accept/first-load path. NOTE: removing the element does not undo
 * side effects an already-running IIFE may have registered — full withdrawal
 * pairs this with a page reload (see ConsentProvider).
 */
export function syncWebmasterID(doc: Document, enabled: boolean): void {
  if (enabled) injectWebmasterID(doc);
  else removeWebmasterID(doc);
}
