import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/metadata';
import { publicPublications } from '@/lib/publications';
import { SECTION_LABEL } from '@/types/publication';

export const metadata: Metadata = buildMetadata({
  title: 'Corrections',
  description:
    'Every correction and material update made to an AgricultureID Journal publication after it was published.',
  path: 'corrections',
});

/**
 * The corrections register.
 *
 * Derived from the publications themselves rather than maintained by hand, so a
 * correction recorded on an item cannot fail to appear here — and this page
 * cannot list a correction that is not on the item.
 */
export default async function CorrectionsPage() {
  const items = await publicPublications();
  const corrected = items.filter((p) => (p.correctionHistory ?? []).length > 0);
  const updated = items.filter((p) => (p.updateHistory ?? []).length > 0);

  return (
    <Container className="py-8 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <article className="journal-prose">
          <h1>Corrections</h1>
          <p>
            When a publication is wrong we correct it on the item, keep the
            record of what changed, and list it here. A correction that quietly
            overwrote the original would not be a correction — it would be an
            edit that hides the fact there was something to correct.
          </p>
          <p>
            Updates and corrections are kept apart because they are different
            admissions. An update adds something. A correction says the earlier
            version was wrong.
          </p>
          <p>
            To report an error, use the contact route on the{' '}
            <a href="https://agricultureid.com/contact">main platform</a> and
            name the publication URL.
          </p>
        </article>

        <section className="mt-10" aria-label="Corrections issued">
          <h2 className="font-serif text-xl text-forest-900">
            Corrections issued
          </h2>
          {corrected.length === 0 ? (
            <p className="mt-2 text-sm text-ink-600">
              None. This publication has issued no corrections since it began on
              1 September 2026. That is a statement about its age, not about its
              infallibility.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {corrected.map((p) => (
                <li key={p.slug} className="border-b border-ink-100 pb-3">
                  <Link
                    href={`/${p.section}/${p.slug}`}
                    className="font-medium text-forest-800 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <span className="ml-2 text-xs text-ink-500">
                    {SECTION_LABEL[p.section]}
                  </span>
                  <dl className="mt-1 space-y-1 text-sm">
                    {(p.correctionHistory ?? []).map((c) => (
                      <div key={c.date + c.note}>
                        <dt className="font-mono text-xs text-ink-500">
                          {c.date}
                        </dt>
                        <dd className="text-ink-800">{c.note}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10" aria-label="Material updates">
          <h2 className="font-serif text-xl text-forest-900">
            Material updates
          </h2>
          {updated.length === 0 ? (
            <p className="mt-2 text-sm text-ink-600">None recorded.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {updated.map((p) => (
                <li key={p.slug} className="border-b border-ink-100 pb-3">
                  <Link
                    href={`/${p.section}/${p.slug}`}
                    className="font-medium text-forest-800 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <dl className="mt-1 space-y-1 text-sm">
                    {(p.updateHistory ?? []).map((u) => (
                      <div key={u.date + u.note}>
                        <dt className="font-mono text-xs text-ink-500">
                          {u.date}
                        </dt>
                        <dd className="text-ink-800">{u.note}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}
