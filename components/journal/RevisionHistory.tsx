import type { Publication } from '@/types/publication';

/**
 * What changed after publication, and when.
 *
 * A correction that quietly overwrites the original is not a correction — it is
 * an edit that hides the fact there was something to correct. Updates and
 * corrections are kept apart because they are different admissions: an update
 * adds, a correction says the earlier version was wrong.
 */
export function RevisionHistory({ p }: { p: Publication }) {
  const updates = p.updateHistory ?? [];
  const corrections = p.correctionHistory ?? [];
  if (updates.length === 0 && corrections.length === 0) return null;

  return (
    <section
      className="mt-12 border-t border-ink-200 pt-6"
      aria-label="Updates and corrections"
    >
      {corrections.length > 0 && (
        <>
          <h2 className="font-serif text-xl text-forest-900">Corrections</h2>
          <dl className="mt-3 space-y-2">
            {corrections.map((c) => (
              <div key={c.date + c.note} className="text-sm">
                <dt className="font-mono text-xs text-ink-500">{c.date}</dt>
                <dd className="text-ink-800">{c.note}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      {updates.length > 0 && (
        <>
          <h2 className="mt-6 font-serif text-xl text-forest-900">Updates</h2>
          <dl className="mt-3 space-y-2">
            {updates.map((u) => (
              <div key={u.date + u.note} className="text-sm">
                <dt className="font-mono text-xs text-ink-500">{u.date}</dt>
                <dd className="text-ink-800">{u.note}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}
