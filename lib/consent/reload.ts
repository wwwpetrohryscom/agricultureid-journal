/**
 * A single indirection over a full-page reload, so withdrawal can guarantee the
 * analytics tracker is gone (see lib/analytics/webmasterid.ts) and so tests can
 * observe the reload without a real navigation.
 */
export function reloadPage(): void {
  if (typeof window !== 'undefined') window.location.reload();
}
