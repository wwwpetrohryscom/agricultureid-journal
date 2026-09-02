import type { Publication } from '@/types/publication';
import { SCHEMA_TYPE } from '@/types/publication';
import { AUTHOR_MAP } from './authors';
import { SITE, journalUrl } from './site';

/**
 * Structured data for one publication.
 *
 * The schema type is taken from the format's own mapping, never defaulted to
 * NewsArticle. NewsArticle is a claim that the item is time-sensitive
 * reporting; applying it to a guide to reading a drought map would be telling a
 * search engine something untrue in order to court a rich result.
 */
export function articleSchema(p: Publication) {
  const authors = p.authors
    .map((id) => AUTHOR_MAP.get(id))
    .filter(Boolean)
    .map((a) => ({ '@type': 'Organization', name: a!.name }));

  const citations = (p.sources ?? []).map((s) => ({
    '@type': 'CreativeWork',
    name: s.title,
    url: s.url,
    ...(s.organization
      ? { publisher: { '@type': 'Organization', name: s.organization } }
      : {}),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': SCHEMA_TYPE[p.publicationType],
    headline: p.title,
    ...(p.subtitle ? { alternativeHeadline: p.subtitle } : {}),
    description: p.description,
    datePublished: p.datePublished,
    dateModified: p.dateModified ?? p.datePublished,
    author: authors.length ? authors : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE.platform,
      url: SITE.origin,
    },
    isPartOf: {
      '@type': 'Periodical',
      name: SITE.name,
      url: journalUrl(),
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': journalUrl(`${p.section}/${p.slug}`),
    },
    url: journalUrl(`${p.section}/${p.slug}`),
    inLanguage: 'en',
    articleSection: p.section,
    ...(p.tags.length ? { keywords: p.tags.join(', ') } : {}),
    ...(citations.length ? { citation: citations } : {}),
  };
}

export function journalSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name: SITE.name,
    url: journalUrl(),
    description: SITE.description,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: SITE.platform,
      url: SITE.origin,
    },
  };
}

export function breadcrumbSchema(
  trail: readonly { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: journalUrl(t.path),
    })),
  };
}
