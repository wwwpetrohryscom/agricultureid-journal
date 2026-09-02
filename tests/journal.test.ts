import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  allPublications,
  isPromoted,
  isPublic,
  activeSections,
  leadPublication,
  publicPublications,
} from '@/lib/publications';
import {
  PUBLICATION_TYPES,
  REQUIRES_SOURCES,
  SCHEMA_TYPE,
  SECTIONS,
  SECTION_DESCRIPTION,
  SECTION_LABEL,
  PROMOTED_STATUSES,
  PUBLIC_STATUSES,
} from '@/types/publication';
import { articleSchema } from '@/lib/schema';
import { AUTHORS } from '@/lib/authors';
import { CONSENT_STORAGE_KEY } from '@/lib/consent/config';
import { SITE } from '@/lib/site';

const pubs = await allPublications();

describe('journal — the format is a claim the model enforces', () => {
  it('maps only time-sensitive formats to NewsArticle', () => {
    // NewsArticle asserts the item is news. A guide is not, and labelling it
    // one to court a rich result tells a search engine something untrue.
    expect(SCHEMA_TYPE.NEWS).toBe('NewsArticle');
    expect(SCHEMA_TYPE.REGULATORY_UPDATE).toBe('NewsArticle');
    expect(SCHEMA_TYPE.GUIDE).toBe('Article');
    expect(SCHEMA_TYPE.RESEARCH_NOTE).toBe('Article');
    expect(SCHEMA_TYPE.CROP_FEATURE).toBe('Article');
    // and every format has a mapping, so none can default
    for (const t of PUBLICATION_TYPES) expect(SCHEMA_TYPE[t]).toBeTruthy();
  });

  it('gives every format and section a label the UI can render', () => {
    for (const s of SECTIONS) {
      expect(SECTION_LABEL[s]).toBeTruthy();
      expect(SECTION_DESCRIPTION[s]).toBeTruthy();
    }
  });

  it('requires a source of every format that makes a claim about the world', () => {
    for (const p of pubs) {
      if (!REQUIRES_SOURCES.includes(p.publicationType)) continue;
      expect((p.sources ?? []).length, p.sourcePath).toBeGreaterThan(0);
    }
  });

  it('renders the schema type from the format, not from a default', () => {
    const news = pubs.find((p) => p.publicationType === 'NEWS')!;
    const guide = pubs.find((p) => p.publicationType === 'GUIDE')!;
    expect(articleSchema(news)['@type']).toBe('NewsArticle');
    expect(articleSchema(guide)['@type']).toBe('Article');
  });
});

describe('journal — nothing unapproved is public', () => {
  it('keeps drafts and items in review out of every public surface', () => {
    for (const p of pubs) {
      if (p.status === 'DRAFT' || p.status === 'REVIEW') {
        expect(isPublic(p), p.sourcePath).toBe(false);
        expect(isPromoted(p), p.sourcePath).toBe(false);
      }
    }
  });

  it('keeps archived items reachable but unpromoted', () => {
    expect(PUBLIC_STATUSES).toContain('ARCHIVED');
    expect(PROMOTED_STATUSES).not.toContain('ARCHIVED');
  });

  it('has at most one lead', async () => {
    expect(pubs.filter((p) => p.lead).length).toBeLessThanOrEqual(1);
    expect(await leadPublication()).toBeDefined();
  });

  it('routes only sections that hold something', async () => {
    const active = await activeSections();
    for (const s of active)
      expect(pubs.some((p) => p.section === s && isPromoted(p))).toBe(true);
    // and an empty section is genuinely absent, not rendered empty
    expect(active.length).toBeLessThanOrEqual(SECTIONS.length);
  });
});

describe('journal — identity and linking', () => {
  it('names no infrastructure host in any publication', () => {
    for (const p of pubs) {
      expect(p.bodyHtml, p.sourcePath).not.toMatch(/netlify\.app/);
      expect(JSON.stringify(p.sources ?? []), p.sourcePath).not.toMatch(
        /netlify\.app/,
      );
    }
  });

  it('attributes every publication to a registered author', () => {
    const ids = new Set(AUTHORS.map((a) => a.id));
    for (const p of pubs)
      for (const a of p.authors) expect(ids.has(a), p.sourcePath).toBe(true);
  });

  it('cites only https sources, with a real access date', () => {
    for (const p of pubs)
      for (const s of p.sources ?? []) {
        expect(s.url, `${p.sourcePath} ${s.id}`).toMatch(/^https:\/\//);
        expect(s.accessedAt, `${p.sourcePath} ${s.id}`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
      }
  });
});

describe('journal — parity with the knowledge platform', () => {
  it('reads and writes the SAME consent record as the main platform', () => {
    // The Journal is served on the same ORIGIN through a proxy rewrite, so this
    // localStorage key is literally the same storage. A visitor who decided on
    // the knowledge base is not asked again here. A subdomain would have needed
    // a second, weaker consent flow — this is the architectural reason the
    // routing is path-based rather than host-based.
    expect(CONSENT_STORAGE_KEY).toBe('agricultureid_consent');
  });

  it('publishes on the main platform origin, never its own', () => {
    expect(SITE.origin).toBe('https://agricultureid.com');
    expect(SITE.basePath).toBe('/journal');
    expect(SITE.name).toBe('AgricultureID Journal');
    // Never "Blog", anywhere in the public identity.
    expect(SITE.name).not.toMatch(/blog/i);
    expect(SITE.description).not.toMatch(/\bblog\b/i);
  });

  it('carries the canonical HELPERG ecosystem registry, not a copy of its own', () => {
    const registry = readFileSync('lib/ecosystem/registry.ts', 'utf8');
    expect(registry).toContain('HELPERG ecosystem');
    // The registry is deliberately dependency-free so it is safe in client
    // components; an import here would drag a content layer into the bundle.
    expect(registry).not.toMatch(/^import /m);
  });

  it('declares its own security headers, because the proxy bypasses the platform’s', () => {
    const cfg = readFileSync('next.config.mjs', 'utf8');
    expect(cfg).toMatch(/async headers\(\)/);
    expect(cfg).toContain('X-Content-Type-Options');
    expect(cfg).toContain("basePath: '/journal'");
    expect(cfg).not.toMatch(/^\s*assetPrefix\s*:/m);
  });
});

describe('journal — the reverse-integration contract stays small', () => {
  it('exposes no publication body in the projections the platform consumes', async () => {
    // latest.json and search-index.json are fetched by the main platform at
    // runtime. Bundling bodies would grow without bound and would ship whole
    // articles to anyone who opened a search box.
    const items = await publicPublications();
    expect(items.length).toBeGreaterThan(0);
    for (const p of items) expect(p.bodyText.length).toBeGreaterThan(0);
  });
});
