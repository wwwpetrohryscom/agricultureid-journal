import type { PublicationSource } from '@/types/publication';

/**
 * Citations, rendered visibly in the HTML.
 *
 * Not a collapsed disclosure and not a tooltip. If a claim rests on a source,
 * the reader gets to see the source without an interaction — and so does a
 * crawler, and so does anyone reading the page with JavaScript disabled.
 */
export function SourceList({
  sources,
}: {
  sources: readonly PublicationSource[];
}) {
  if (sources.length === 0) return null;
  return (
    <section
      className="mt-12 border-t border-ink-200 pt-6"
      aria-label="Sources"
    >
      <h2 className="font-serif text-xl text-forest-900">Sources</h2>
      <ol className="mt-4 space-y-4">
        {sources.map((s, i) => (
          <li key={s.id} className="text-sm">
            <p className="text-ink-900">
              <span className="mr-1.5 font-mono text-xs text-ink-500">
                [{i + 1}]
              </span>
              <a
                href={s.url}
                rel="nofollow noopener"
                className="text-forest-700 hover:underline"
              >
                {s.title}
              </a>
            </p>
            <p className="mt-0.5 text-ink-600">
              {s.organization}
              {s.publication ? ` · ${s.publication}` : ''}
              {s.date ? ` · ${s.date}` : ''}
              {s.officialRecordId ? ` · ${s.officialRecordId}` : ''}
            </p>
            {s.supports && (
              <p className="mt-1 text-ink-700">
                <span className="text-ink-500">Cited for: </span>
                {s.supports}
              </p>
            )}
            <p className="mt-0.5 font-mono text-xs text-ink-500">
              {s.sourceType.toLowerCase().replace(/_/g, ' ')} · read{' '}
              {s.accessedAt}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
