import type { MetadataRoute } from 'next';
import { journalUrl } from '@/lib/site';

// Generated once at build time: the site is a static export.
export const dynamic = 'force-static';

/**
 * robots.txt for the Journal deployment.
 *
 * Served at agricultureid.com/journal/robots.txt by this project's Worker. The
 * main platform's /robots.txt is a different document owned by a different
 * deployment; crawlers read that one, and it names both sitemaps.
 *
 * The infrastructure host (*.workers.dev, disabled in production) is kept out
 * of the index by canonical tags that always name the public origin. The
 * CONTEXT branch below is a Netlify-era guard for preview builds; nothing sets
 * CONTEXT on Cloudflare, so production output is the indexable branch.
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
