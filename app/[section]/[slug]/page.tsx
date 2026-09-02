import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { EvidenceBadges } from '@/components/journal/EvidenceBadges';
import { SourceList } from '@/components/journal/SourceList';
import { RelatedEntitiesPanel } from '@/components/journal/RelatedEntities';
import { RevisionHistory } from '@/components/journal/RevisionHistory';
import { PublicationCard } from '@/components/journal/PublicationCard';
import { buildMetadata } from '@/lib/metadata';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { AUTHOR_MAP } from '@/lib/authors';
import {
  getPublication,
  publicPublications,
  publicationsInSection,
} from '@/lib/publications';
import {
  PUBLICATION_TYPE_LABEL,
  SECTION_LABEL,
  SECTIONS,
  type Section,
} from '@/types/publication';

type Params = { params: Promise<{ section: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await publicPublications()).map((p) => ({
    section: p.section,
    slug: p.slug,
  }));
}

function isSection(v: string): v is Section {
  return (SECTIONS as readonly string[]).includes(v);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section, slug } = await params;
  if (!isSection(section)) return {};
  const p = await getPublication(section, slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.description,
    path: `${section}/${slug}`,
    type: 'article',
    publishedTime: p.datePublished,
    modifiedTime: p.dateModified ?? p.datePublished,
  });
}

export default async function PublicationPage({ params }: Params) {
  const { section, slug } = await params;
  if (!isSection(section)) notFound();
  const p = await getPublication(section, slug);
  if (!p) notFound();

  const authors = p.authors.map((id) => AUTHOR_MAP.get(id)).filter(Boolean);
  const siblings = (await publicationsInSection(section))
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);

  return (
    <Container className="py-8 lg:py-10">
      <JsonLd
        data={[
          articleSchema(p),
          breadcrumbSchema([
            { name: 'Journal', path: '' },
            { name: SECTION_LABEL[section], path: section },
            { name: p.title, path: `${section}/${slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-500">
          <Link href="/" className="hover:text-forest-700">
            Journal
          </Link>
          {' / '}
          <Link href={`/${section}`} className="hover:text-forest-700">
            {SECTION_LABEL[section]}
          </Link>
        </nav>

        <header className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
            {PUBLICATION_TYPE_LABEL[p.publicationType]}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-forest-900 sm:text-4xl">
            {p.title}
          </h1>
          {p.subtitle && (
            <p className="mt-3 font-serif text-xl leading-snug text-ink-600">
              {p.subtitle}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-ink-600">
            <span>
              {authors.map((a) => a!.name).join(', ') || 'AgricultureID'}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={p.datePublished}>{p.datePublished}</time>
            {p.dateModified && p.dateModified !== p.datePublished && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {p.dateModified}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{p.readingMinutes} min read</span>
          </div>

          <EvidenceBadges p={p} />

          <p className="mt-5 border-l-2 border-forest-600 pl-4 font-serif text-lg leading-relaxed text-ink-800">
            {p.summary}
          </p>
        </header>

        {p.keyPoints && p.keyPoints.length > 0 && (
          <section
            className="mt-6 rounded-lg border border-ink-200 bg-parchment-50 p-5"
            aria-label="Key points"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Key points
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-800">
              {p.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </section>
        )}

        {/*
          The body is repository-native Markdown, rendered server-side with raw
          HTML disabled. It is trusted content from this repository, and the
          renderer is configured so that it would still be safe if it were not.
        */}
        <div
          className="journal-prose mt-8"
          dangerouslySetInnerHTML={{ __html: p.bodyHtml }}
        />

        {p.geographies && p.geographies.length > 0 && (
          <p className="mt-8 text-sm text-ink-600">
            <span className="text-ink-500">Geographies: </span>
            {p.geographies.join(', ')}
          </p>
        )}

        {p.sources && <SourceList sources={p.sources} />}
        <RelatedEntitiesPanel related={p.related} />
        <RevisionHistory p={p} />

        {authors.length > 0 && (
          <section className="mt-12 border-t border-ink-200 pt-6">
            <h2 className="font-serif text-lg text-forest-900">
              About the {authors.length === 1 ? 'author' : 'authors'}
            </h2>
            <dl className="mt-3 space-y-3">
              {authors.map((a) => (
                <div key={a!.id}>
                  <dt className="font-medium text-ink-900">
                    {a!.name}
                    <span className="ml-2 text-sm font-normal text-ink-500">
                      {a!.role}
                    </span>
                  </dt>
                  <dd className="mt-0.5 text-sm text-ink-700">{a!.bio}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </article>

      {siblings.length > 0 && (
        <section className="mx-auto mt-14 max-w-3xl border-t border-ink-200 pt-6">
          <h2 className="font-serif text-lg text-forest-900">
            More in {SECTION_LABEL[section]}
          </h2>
          <div className="mt-2">
            {siblings.map((s) => (
              <PublicationCard key={s.slug} p={s} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
