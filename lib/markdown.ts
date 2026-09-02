import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

/**
 * Render a publication body from Markdown to HTML.
 *
 * `allowDangerousHtml` is off. Bodies are repository-native content written by
 * the editorial desk, so raw HTML is not needed, and leaving the door shut
 * means the rendered output cannot contain a script even if a body someday
 * arrives from somewhere less trusted.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

export async function renderMarkdown(md: string): Promise<string> {
  return String(await processor.process(md));
}

/** Words a reader gets through in a minute, rounded to a whole minute. */
const WORDS_PER_MINUTE = 220;

export function readingMinutes(md: string): number {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Plain text for the search index — no markup, no link syntax, no headings. */
export function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
