import { publicationUrl } from '@/lib/feed-items';
import { promotedPublications } from '@/lib/publications';
import { PUBLICATION_TYPE_LABEL } from '@/types/publication';

export const dynamic = 'force-static';

/**
 * The search contract, for this project's own search page and for the main
 * platform's search should it choose to consume it.
 *
 * Bodies are NOT included. A full-text index of every publication would grow
 * without bound and would ship the whole publication to every visitor who
 * opened the search box. Titles, standfirsts, tags, sections and entity links
 * are enough to find an article; the article itself is one click away.
 */
export async function GET() {
  const items = await promotedPublications();
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString().slice(0, 10),
    count: items.length,
    docs: items.map((p) => ({
      id: `${p.section}/${p.slug}`,
      title: p.title,
      subtitle: p.subtitle ?? '',
      description: p.summary,
      url: publicationUrl(p),
      path: `/${p.section}/${p.slug}`,
      section: p.section,
      publicationType: p.publicationType,
      publicationTypeLabel: PUBLICATION_TYPE_LABEL[p.publicationType],
      tags: p.tags,
      publishedAt: p.datePublished,
      relatedEntityIds: Object.entries(p.related ?? {}).flatMap(
        ([family, slugs]) =>
          (slugs as readonly string[]).map((s) => `${family}:${s}`),
      ),
    })),
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
