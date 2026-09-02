import { describe, expect, it } from 'vitest';
import { buildMetadata } from '@/lib/metadata';
import { SITE, journalUrl, platformUrl } from '@/lib/site';

/**
 * The title contract.
 *
 * The root layout declares `template: '%s · AgricultureID Journal'`, so a page
 * must return its BARE title. A page that builds the suffix itself gets it
 * twice — which is invisible in development and ships to every search result,
 * and which cannot be detected reliably from the rendered HTML because an
 * article may legitimately be titled after the publication.
 */
describe('metadata — the title template is applied exactly once', () => {
  it('returns a bare title so the layout template can add the suffix', () => {
    const m = buildMetadata({ title: 'Research', description: 'x'.repeat(60) });
    expect(m.title).toBe('Research');
  });

  it('opts the front page out of the template rather than doubling the name', () => {
    const m = buildMetadata({ title: SITE.name, description: 'x'.repeat(60) });
    expect(m.title).toEqual({ absolute: SITE.name });
  });

  it('keeps the full title on Open Graph, which has no template', () => {
    const m = buildMetadata({ title: 'Research', description: 'x'.repeat(60) });
    expect(m.openGraph?.title).toBe(`Research · ${SITE.name}`);
  });
});

describe('metadata — canonical URLs are always on the public host', () => {
  it('builds canonicals from the public origin, never the deployment host', () => {
    const m = buildMetadata({
      title: 'X',
      description: 'y'.repeat(60),
      path: 'news/thing',
    });
    expect(m.alternates?.canonical).toBe(
      'https://agricultureid.com/journal/news/thing',
    );
  });

  it('gives the Journal root a canonical with no trailing slash', () => {
    expect(journalUrl()).toBe('https://agricultureid.com/journal');
    expect(journalUrl('news')).toBe('https://agricultureid.com/journal/news');
    expect(journalUrl('/news/')).toBe('https://agricultureid.com/journal/news');
  });

  it('builds knowledge-base URLs outside the Journal namespace', () => {
    expect(platformUrl('/crops/wheat')).toBe(
      'https://agricultureid.com/crops/wheat',
    );
    expect(platformUrl()).toBe('https://agricultureid.com');
  });

  it('never names an infrastructure host', () => {
    const m = buildMetadata({
      title: 'X',
      description: 'y'.repeat(60),
      path: 'a/b',
    });
    expect(JSON.stringify(m)).not.toMatch(/netlify\.app/);
  });

  it('marks a query surface noindex, follow', () => {
    const m = buildMetadata({
      title: 'Search',
      description: 'y'.repeat(60),
      path: 'search',
      noindex: true,
    });
    expect(m.robots).toEqual({ index: false, follow: true });
  });
});
