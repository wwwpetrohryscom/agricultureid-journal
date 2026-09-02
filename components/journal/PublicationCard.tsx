import Link from 'next/link';
import type { Publication } from '@/types/publication';
import { PUBLICATION_TYPE_LABEL, SECTION_LABEL } from '@/types/publication';
import { displayDate } from '@/lib/publications';

/**
 * Visual weight follows editorial weight.
 *
 * A market brief, a news item and a long feature are not the same size of
 * thing, and rendering them as identical cards would tell a reader they are.
 * `variant` is chosen by the page, not by the item, because the same item is a
 * lead on the front page and a row in a section listing.
 */
export function PublicationCard({
  p,
  variant = 'default',
}: {
  p: Publication;
  variant?: 'lead' | 'default' | 'compact';
}) {
  const href = `/${p.section}/${p.slug}`;
  const kind = PUBLICATION_TYPE_LABEL[p.publicationType];

  if (variant === 'lead') {
    return (
      <article className="border-b border-ink-200 pb-8">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="rounded-full bg-forest-700 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-parchment-50">
            {kind}
          </span>
          <Link
            href={`/${p.section}`}
            className="text-xs uppercase tracking-wide text-ink-500 hover:text-forest-700"
          >
            {SECTION_LABEL[p.section]}
          </Link>
          <time className="text-xs text-ink-500" dateTime={displayDate(p)}>
            {displayDate(p)}
          </time>
        </div>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-forest-900 sm:text-4xl">
          <Link href={href} className="hover:underline">
            {p.title}
          </Link>
        </h2>
        {p.subtitle && (
          <p className="mt-2 font-serif text-lg text-ink-600">{p.subtitle}</p>
        )}
        <p className="mt-3 max-w-2xl text-ink-700">{p.summary}</p>
        <p className="mt-3 text-xs text-ink-500">{p.readingMinutes} min read</p>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="border-b border-ink-100 py-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-forest-700">
            {kind}
          </span>
          <time className="text-xs text-ink-500" dateTime={displayDate(p)}>
            {displayDate(p)}
          </time>
        </div>
        <h3 className="mt-1 font-medium leading-snug text-ink-900">
          <Link href={href} className="hover:text-forest-700 hover:underline">
            {p.title}
          </Link>
        </h3>
      </article>
    );
  }

  return (
    <article className="border-b border-ink-100 py-5">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="rounded-full border border-ink-200 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-ink-600">
          {kind}
        </span>
        <Link
          href={`/${p.section}`}
          className="text-xs uppercase tracking-wide text-ink-500 hover:text-forest-700"
        >
          {SECTION_LABEL[p.section]}
        </Link>
        <time className="text-xs text-ink-500" dateTime={displayDate(p)}>
          {displayDate(p)}
        </time>
      </div>
      <h3 className="mt-2 font-serif text-xl leading-snug text-forest-900">
        <Link href={href} className="hover:underline">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-2xl text-sm text-ink-700">{p.summary}</p>
      <p className="mt-2 text-xs text-ink-500">{p.readingMinutes} min read</p>
    </article>
  );
}
