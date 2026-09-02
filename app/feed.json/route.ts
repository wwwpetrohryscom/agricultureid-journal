import { SITE, journalUrl } from '@/lib/site';
import { feedItems, publicationUrl } from '@/lib/feed-items';
import { AUTHOR_MAP } from '@/lib/authors';
import { PUBLICATION_TYPE_LABEL } from '@/types/publication';

export const dynamic = 'force-static';

export async function GET() {
  const items = await feedItems();
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: SITE.name,
    home_page_url: journalUrl(),
    feed_url: journalUrl('feed.json'),
    description: SITE.description,
    language: 'en',
    items: items.map((p) => ({
      id: publicationUrl(p),
      url: publicationUrl(p),
      title: p.title,
      summary: p.summary,
      content_text: p.summary,
      date_published: `${p.datePublished}T00:00:00Z`,
      date_modified: `${p.dateModified ?? p.datePublished}T00:00:00Z`,
      tags: [PUBLICATION_TYPE_LABEL[p.publicationType], ...p.tags],
      authors: p.authors
        .map((id) => AUTHOR_MAP.get(id))
        .filter(Boolean)
        .map((a) => ({ name: a!.name })),
    })),
  };

  return new Response(JSON.stringify(feed, null, 1), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
}
