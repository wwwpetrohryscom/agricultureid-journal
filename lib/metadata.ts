import type { Metadata } from 'next';
import { SITE, journalUrl } from './site';

/**
 * Build page metadata with a canonical URL that is always on the public host.
 *
 * `path` is relative to the Journal root: '' is the front page, 'news' is the
 * news section. The canonical is assembled from SITE.origin, never from the
 * request, so a page rendered on the *.netlify.app deploy still canonicalises
 * to agricultureid.com/journal — which is what stops the infrastructure host
 * from ever competing with the real URL in an index.
 */
export function buildMetadata({
  title,
  description,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}): Metadata {
  const url = journalUrl(path);
  // The root layout declares `template: '%s · AgricultureID Journal'`, so a
  // page must return its BARE title and let the template add the suffix.
  // Building the full string here too produced "… · AgricultureID Journal ·
  // AgricultureID Journal" on every page — invisible in development, and in
  // every search result. The front page opts out of the template with
  // `absolute`, because applying it there is the same bug in another hat.
  // `fullTitle` is still the complete string, for Open Graph and Twitter, which
  // have no template.
  const fullTitle = title === SITE.name ? title : `${title} · ${SITE.name}`;
  return {
    title: title === SITE.name ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: 'en_US',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
