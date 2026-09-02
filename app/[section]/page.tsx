import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { PublicationCard } from '@/components/journal/PublicationCard';
import { buildMetadata } from '@/lib/metadata';
import { breadcrumbSchema } from '@/lib/schema';
import { activeSections, publicationsInSection } from '@/lib/publications';
import {
  SECTION_DESCRIPTION,
  SECTION_LABEL,
  SECTIONS,
  type Section,
} from '@/types/publication';

type Params = { params: Promise<{ section: string }> };

/**
 * Only sections that hold something are routed.
 *
 * `dynamicParams = false` means a request for an empty or unknown section is a
 * genuine 404 rather than an on-demand render of an empty listing.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await activeSections()).map((section) => ({ section }));
}

function isSection(v: string): v is Section {
  return (SECTIONS as readonly string[]).includes(v);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  if (!isSection(section)) return {};
  return buildMetadata({
    title: SECTION_LABEL[section],
    description: SECTION_DESCRIPTION[section],
    path: section,
  });
}

export default async function SectionPage({ params }: Params) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const items = await publicationsInSection(section);
  if (items.length === 0) notFound();

  return (
    <Container className="py-8 lg:py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Journal', path: '' },
          { name: SECTION_LABEL[section], path: section },
        ])}
      />
      <header className="border-b border-ink-200 pb-5">
        <h1 className="font-serif text-3xl text-forest-900">
          {SECTION_LABEL[section]}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          {SECTION_DESCRIPTION[section]}
        </p>
        <p className="mt-2 font-mono text-xs text-ink-500">
          {items.length} publication{items.length === 1 ? '' : 's'}
        </p>
      </header>
      <div className="mt-2">
        {items.map((p) => (
          <PublicationCard key={p.slug} p={p} />
        ))}
      </div>
    </Container>
  );
}
