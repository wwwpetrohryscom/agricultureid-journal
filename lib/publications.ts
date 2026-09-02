import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { Publication, Section, Status } from '@/types/publication';
import {
  PROMOTED_STATUSES,
  PUBLIC_STATUSES,
  SECTIONS,
} from '@/types/publication';
import { readingMinutes, renderMarkdown, toPlainText } from './markdown';

const ROOT = join(process.cwd(), 'content', 'publications');

/**
 * The build's reference date.
 *
 * A SCHEDULED item becomes public when its publication date arrives, and
 * "arrives" has to mean something a build can decide. It means: the date is not
 * in the future at the moment the site is built. A scheduled item therefore
 * goes live on the next deploy after its date, which is deliberate — publishing
 * is a decision someone takes, not a clock that fires unattended.
 */
export const BUILD_DATE = new Date().toISOString().slice(0, 10);

let CACHE: Publication[] | null = null;

function readOne(
  section: Section,
  file: string,
): {
  data: Record<string, unknown>;
  body: string;
  path: string;
} {
  const path = join(ROOT, section, file);
  const raw = readFileSync(path, 'utf8');
  const { data, content } = matter(raw);
  return {
    data: data as Record<string, unknown>,
    body: content,
    path: `content/publications/${section}/${file}`,
  };
}

/**
 * Every publication in the repository, in whatever state it is in.
 *
 * Drafts are included here so the validator can check them; the public helpers
 * below are the only things the site renders from, and they filter by status.
 */
export async function allPublications(): Promise<Publication[]> {
  if (CACHE) return CACHE;
  const out: Publication[] = [];

  for (const section of SECTIONS) {
    const dir = join(ROOT, section);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).sort()) {
      if (!file.endsWith('.md')) continue;
      const { data, body, path } = readOne(section, file);
      const slug = String(data.slug ?? file.replace(/\.md$/, ''));
      out.push({
        ...(data as unknown as Publication),
        slug,
        section,
        bodyHtml: await renderMarkdown(body),
        bodyText: toPlainText(body),
        readingMinutes: readingMinutes(body),
        sourcePath: path,
      });
    }
  }

  out.sort((a, b) =>
    a.datePublished === b.datePublished
      ? a.slug.localeCompare(b.slug)
      : b.datePublished.localeCompare(a.datePublished),
  );
  CACHE = out;
  return out;
}

/** Is this item allowed to have a public URL at all? */
export function isPublic(p: Publication): boolean {
  if (p.status === 'SCHEDULED') return p.datePublished <= BUILD_DATE;
  return PUBLIC_STATUSES.includes(p.status);
}

/** Is this item allowed into feeds, listings and the front page? */
export function isPromoted(p: Publication): boolean {
  if (p.status === 'SCHEDULED') return p.datePublished <= BUILD_DATE;
  return PROMOTED_STATUSES.includes(p.status);
}

/** Everything with a public URL, newest first. */
export async function publicPublications(): Promise<Publication[]> {
  return (await allPublications()).filter(isPublic);
}

/** Everything that may appear in a listing or a feed, newest first. */
export async function promotedPublications(): Promise<Publication[]> {
  return (await allPublications()).filter(isPromoted);
}

export async function publicationsInSection(
  section: Section,
): Promise<Publication[]> {
  return (await promotedPublications()).filter((p) => p.section === section);
}

/**
 * Sections that actually have something in them.
 *
 * An empty section is not routed, not linked and not in the sitemap. Publishing
 * an empty page because the taxonomy allows one is how a publication ends up
 * with thirteen doorways into nothing.
 */
export async function activeSections(): Promise<Section[]> {
  const items = await promotedPublications();
  return SECTIONS.filter((s) => items.some((p) => p.section === s));
}

export async function getPublication(
  section: Section,
  slug: string,
): Promise<Publication | undefined> {
  return (await publicPublications()).find(
    (p) => p.section === section && p.slug === slug,
  );
}

/** The lead item for the front page, or the newest promoted item. */
export async function leadPublication(): Promise<Publication | undefined> {
  const items = await promotedPublications();
  return items.find((p) => p.lead) ?? items[0];
}

export async function featuredPublications(limit = 4): Promise<Publication[]> {
  const items = await promotedPublications();
  const lead = await leadPublication();
  return items
    .filter((p) => p.featured && p.slug !== lead?.slug)
    .slice(0, limit);
}

/** The date shown to a reader: when it last changed, or when it appeared. */
export function displayDate(p: Publication): string {
  return p.dateModified ?? p.datePublished;
}

export function statusIsRevised(status: Status): boolean {
  return status === 'UPDATED' || status === 'CORRECTED';
}
