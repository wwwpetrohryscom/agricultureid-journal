import { SITE, journalUrl } from '@/lib/site';
import { escapeXml, feedItems, publicationUrl, rfc822 } from '@/lib/feed-items';
import { PUBLICATION_TYPE_LABEL } from '@/types/publication';

export const dynamic = 'force-static';

export async function GET() {
  const items = await feedItems();
  const latest = items[0]?.dateModified ?? items[0]?.datePublished;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${journalUrl()}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${journalUrl('rss.xml')}" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ''}${items
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${publicationUrl(p)}</link>
      <guid isPermaLink="true">${publicationUrl(p)}</guid>
      <pubDate>${rfc822(p.datePublished)}</pubDate>
      <category>${escapeXml(PUBLICATION_TYPE_LABEL[p.publicationType])}</category>
      <description>${escapeXml(p.summary)}</description>
    </item>`,
    )
    .join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
