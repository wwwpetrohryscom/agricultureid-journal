import { publicationUrl } from '@/lib/feed-items';
import { promotedPublications } from '@/lib/publications';
import { PUBLICATION_TYPE_LABEL } from '@/types/publication';

export const dynamic = 'force-static';

/**
 * The reverse-integration contract.
 *
 * The main AgricultureID platform wants to show "Latest from the Journal"
 * without rebuilding every time an article is published — which rules out
 * bundling publication data into its build. This endpoint is the alternative: a
 * compact, stable projection the platform can fetch at runtime.
 *
 * Deliberately small. No bodies, no sources, no HTML. Enough to render a list
 * and a link, and nothing that would tempt a consumer to reproduce the article
 * rather than link to it.
 */
export async function GET() {
  const items = (await promotedPublications()).slice(0, 20);
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString().slice(0, 10),
    count: items.length,
    items: items.map((p) => ({
      id: `${p.section}/${p.slug}`,
      title: p.title,
      description: p.summary,
      url: publicationUrl(p),
      section: p.section,
      publicationType: p.publicationType,
      publicationTypeLabel: PUBLICATION_TYPE_LABEL[p.publicationType],
      publishedAt: p.datePublished,
      updatedAt: p.dateModified ?? p.datePublished,
      relatedEntityIds: Object.entries(p.related ?? {}).flatMap(
        ([family, slugs]) =>
          (slugs as readonly string[]).map((s) => `${family}:${s}`),
      ),
    })),
  };

  return new Response(JSON.stringify(payload, null, 1), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Consumed cross-deployment by the main platform on the same host.
      'Access-Control-Allow-Origin': '*',
    },
  });
}
