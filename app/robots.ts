import type { MetadataRoute } from 'next';
import { journalUrl } from '@/lib/site';

/**
 * robots.txt for the Journal deployment.
 *
 * Served at agricultureid.com/journal/robots.txt through the proxy, and at the
 * *.netlify.app root for this project. The main platform's /robots.txt is a
 * different document owned by a different deployment; crawlers read that one,
 * and it names both sitemaps.
 *
 * X-Robots-Tag is deliberately NOT used to protect the infrastructure host in
 * production. A proxy forwards origin response headers to the visitor, so a
 * blanket noindex here would travel through the rewrite and de-index the real
 * agricultureid.com/journal URLs. Non-production contexts are handled by
 * context-scoped headers in netlify.toml, and the infrastructure host is kept
 * out of the index by canonical tags that always name the public origin.
 */
export default function robots(): MetadataRoute.Robots {
  const nonProduction =
    process.env.CONTEXT === 'deploy-preview' ||
    process.env.CONTEXT === 'branch-deploy';

  if (nonProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // The search page is a query surface, not a document.
      { userAgent: '*', disallow: '/journal/search' },
    ],
    sitemap: journalUrl('sitemap.xml'),
  };
}
