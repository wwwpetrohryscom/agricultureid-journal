import type { Publication } from '@/types/publication';
import { promotedPublications } from './publications';
import { journalUrl } from './site';

/** The canonical public URL of one publication. Never an infrastructure host. */
export function publicationUrl(p: Publication): string {
  return journalUrl(`${p.section}/${p.slug}`);
}

/**
 * What goes in a feed.
 *
 * Promoted items only: drafts, items in review and archived pieces are all
 * excluded. A feed is a push channel — an item that reaches a subscriber cannot
 * be unsent, so the bar for entering one is the same as the bar for publishing.
 */
export async function feedItems(limit = 50): Promise<Publication[]> {
  return (await promotedPublications()).slice(0, limit);
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function rfc822(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}

export function rfc3339(iso: string): string {
  return `${iso}T00:00:00Z`;
}
