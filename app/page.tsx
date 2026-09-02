import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { PublicationCard } from '@/components/journal/PublicationCard';
import { buildMetadata } from '@/lib/metadata';
import { journalSchema } from '@/lib/schema';
import { SITE } from '@/lib/site';
import {
  activeSections,
  featuredPublications,
  leadPublication,
  promotedPublications,
} from '@/lib/publications';
import { SECTION_DESCRIPTION, SECTION_LABEL } from '@/types/publication';

export const metadata: Metadata = buildMetadata({
  title: SITE.name,
  description: SITE.description,
});

/**
 * The front page of a publication, not a reverse-chronological blog.
 *
 * A lead, then what is new, then the sections that actually hold something.
 * Sections with nothing in them are absent entirely — an empty section on a
 * front page advertises a promise the publication has not kept.
 */
export default async function JournalHome() {
  const lead = await leadPublication();
  const featured = await featuredPublications();
  const all = await promotedPublications();
  const sections = await activeSections();
  const leadSlugs = new Set([lead?.slug, ...featured.map((f) => f.slug)]);
  const latest = all.filter((p) => !leadSlugs.has(p.slug)).slice(0, 8);

  return (
    <Container className="py-8 lg:py-10">
      <JsonLd data={journalSchema()} />

      {lead && (
        <section aria-label="Lead story">
          <PublicationCard p={lead} variant="lead" />
        </section>
      )}

      {featured.length > 0 && (
        <section className="mt-8" aria-label="Featured">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Featured
          </h2>
          <div className="mt-2 grid gap-x-10 sm:grid-cols-2">
            {featured.map((p) => (
              <PublicationCard key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mt-10" aria-label="Latest">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Latest
          </h2>
          <div className="mt-2 grid gap-x-10 sm:grid-cols-2">
            {latest.map((p) => (
              <PublicationCard key={p.slug} p={p} variant="compact" />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12" aria-label="Sections">
        <h2 className="font-serif text-xl text-forest-900">Sections</h2>
        <p className="mt-1 text-sm text-ink-600">
          Only sections that hold published work appear here.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => {
            const n = all.filter((p) => p.section === s).length;
            return (
              <div
                key={s}
                className="rounded-lg border border-ink-100 bg-parchment-50 p-4"
              >
                <dt className="font-medium text-forest-900">
                  <Link href={`/${s}`} className="hover:underline">
                    {SECTION_LABEL[s]}
                  </Link>
                  <span className="ml-2 font-mono text-xs font-normal text-ink-500">
                    {n}
                  </span>
                </dt>
                <dd className="mt-1 text-sm text-ink-600">
                  {SECTION_DESCRIPTION[s]}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="mt-12 rounded-lg border border-ink-200 bg-parchment-50 p-5">
        <h2 className="font-serif text-lg text-forest-900">
          How to read this publication
        </h2>
        <p className="mt-2 text-sm text-ink-700">
          Every item carries its format, and the format is a claim about what
          the item is. A market brief reports what an agency released, with
          forecasts labelled as forecasts. A research note says whether a study
          was peer reviewed. A regulatory update says whether the rule is in
          force. Where a claim rests on a source, the source is listed on the
          page.
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/editorial-policy"
            className="text-forest-700 hover:underline"
          >
            Editorial policy
          </Link>
          {' · '}
          <Link
            href="/sourcing-policy"
            className="text-forest-700 hover:underline"
          >
            Sourcing policy
          </Link>
          {' · '}
          <Link href="/corrections" className="text-forest-700 hover:underline">
            Corrections
          </Link>
        </p>
      </section>
    </Container>
  );
}
