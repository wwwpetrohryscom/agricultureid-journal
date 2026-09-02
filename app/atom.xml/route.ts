import { SITE, journalUrl } from '@/lib/site';
import {
  escapeXml,
  feedItems,
  publicationUrl,
  rfc3339,
} from '@/lib/feed-items';

export const dynamic = 'force-static';

export async function GET() {
  const items = await feedItems();
  const updated = rfc3339(
    items[0]?.dateModified ?? items[0]?.datePublished ?? '1970-01-01',
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.name)}</title>
  <subtitle>${escapeXml(SITE.tagline)}</subtitle>
  <link href="${journalUrl('atom.xml')}" rel="self" />
  <link href="${journalUrl()}" />
  <id>${journalUrl()}</id>
  <updated>${updated}</updated>
${items
  .map(
    (p) => `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${publicationUrl(p)}" />
    <id>${publicationUrl(p)}</id>
    <published>${rfc3339(p.datePublished)}</published>
    <updated>${rfc3339(p.dateModified ?? p.datePublished)}</updated>
    <summary>${escapeXml(p.summary)}</summary>
  </entry>`,
  )
  .join('\n')}
</feed>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}
