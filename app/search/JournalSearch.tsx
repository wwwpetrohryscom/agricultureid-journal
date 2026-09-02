'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Doc = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  section: string;
  publicationTypeLabel: string;
  tags: string[];
  publishedAt: string;
};

/**
 * Journal search.
 *
 * Deliberately small: it fetches the same index the main platform can consume,
 * matches on the fields an editor would expect to search, and ranks by where
 * the match landed. There is no ranking model and no stemming, because with a
 * publication of this size either would be machinery pretending to be
 * intelligence.
 */
export function JournalSearch() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/journal/search-index.json')
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setDocs(j.docs as Doc[]);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!docs) return [];
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return docs.slice(0, 20);
    return docs
      .map((d) => {
        const title = d.title.toLowerCase();
        const sub = `${d.subtitle} ${d.description}`.toLowerCase();
        const meta =
          `${d.section} ${d.publicationTypeLabel} ${d.tags.join(' ')}`.toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 6;
          else if (sub.includes(t)) score += 3;
          else if (meta.includes(t)) score += 2;
        }
        return { d, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.d);
  }, [docs, q]);

  return (
    <div>
      <label htmlFor="journal-q" className="block text-sm text-ink-700">
        Search AgricultureID Journal
      </label>
      <input
        id="journal-q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="drought, authorisation, cost of production…"
        autoComplete="off"
        className="mt-2 w-full max-w-xl rounded border border-ink-300 bg-white px-3 py-2 text-ink-900 focus:border-forest-600 focus:outline-none focus:ring-1 focus:ring-forest-600"
      />

      <p className="mt-3 text-sm text-ink-600" aria-live="polite">
        {docs === null
          ? 'Loading the index…'
          : q
            ? `${results.length} result${results.length === 1 ? '' : 's'}`
            : `${docs.length} publications`}
      </p>

      <ul className="mt-4">
        {results.map((d) => (
          <li key={d.id} className="border-b border-ink-100 py-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-forest-700">
                {d.publicationTypeLabel}
              </span>
              <time className="text-xs text-ink-500" dateTime={d.publishedAt}>
                {d.publishedAt}
              </time>
            </div>
            <h2 className="mt-1 font-serif text-lg text-forest-900">
              <Link href={d.path} className="hover:underline">
                {d.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-ink-700">{d.description}</p>
          </li>
        ))}
      </ul>

      {docs !== null && q && results.length === 0 && (
        <p className="mt-4 text-sm text-ink-600">
          Nothing matches that. The Journal is small and deliberately so — the
          canonical structured record for crops, authorities, registers and
          datasets is on the{' '}
          <a
            href="https://agricultureid.com/search"
            className="text-forest-700 hover:underline"
          >
            main platform&rsquo;s search
          </a>
          .
        </p>
      )}
    </div>
  );
}
