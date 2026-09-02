/**
 * Canonical identity of AgricultureID Journal.
 *
 * `origin` is the MAIN AgricultureID hostname, and that is deliberate. The
 * Journal is a separate deployment unit but not a separate website: every
 * public URL it emits — canonical tags, Open Graph, JSON-LD, feeds, the sitemap
 * — must be on agricultureid.com. The *.netlify.app host this project deploys
 * to is infrastructure and appears in exactly one place in the architecture:
 * the `to =` field of two redirect rules in the main repository.
 */
export const SITE = {
  /** Public product name. Never "Blog". */
  name: 'AgricultureID Journal',
  /** The platform this publication belongs to. */
  platform: 'AgricultureID',
  origin: 'https://agricultureid.com',
  /** Every Journal URL begins here. Matches next.config basePath. */
  basePath: '/journal',
  tagline:
    'Evidence-based reporting, research, data, markets and agricultural intelligence.',
  description:
    'AgricultureID Journal publishes news, features, market briefs, research notes, data notes and regulatory updates on agriculture — each sourced to the official record and linked to the structured AgricultureID knowledge base.',
  locale: 'en',
} as const;

/** Absolute public URL for a Journal path. `p` is relative to the Journal root. */
export function journalUrl(p = ''): string {
  const clean = p.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean
    ? `${SITE.origin}${SITE.basePath}/${clean}`
    : `${SITE.origin}${SITE.basePath}`;
}

/** Absolute URL for a page on the main AgricultureID platform. */
export function platformUrl(p = ''): string {
  const clean = p.replace(/^\/+/, '');
  return clean ? `${SITE.origin}/${clean}` : SITE.origin;
}
