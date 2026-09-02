import type { RelatedEntities as Related } from '@/types/publication';
import {
  ENTITY_FAMILY_LABEL,
  entityPath,
  type EntityFamily,
} from '@/lib/entities';
import { platformUrl } from '@/lib/site';

/**
 * Links from a publication into the canonical knowledge base.
 *
 * These come from typed fields on the publication, not from keywords matched in
 * the prose. A crop feature declares which crop it is about and the renderer
 * builds the link; nobody hand-writes an anchor into an entity page to improve
 * a ranking, which is the practice this replaces.
 */
export function RelatedEntitiesPanel({ related }: { related?: Related }) {
  if (!related) return null;
  const families: EntityFamily[] = [
    'crops',
    'cultivars',
    'livestock',
    'commodities',
    'authorities',
    'registries',
    'regulations',
    'datasets',
    'tools',
    'countries',
  ];
  const present = families
    .map((f) => ({ f, slugs: related[f] ?? [] }))
    .filter((x) => x.slugs.length > 0);
  if (present.length === 0) return null;

  return (
    <section
      className="mt-12 rounded-lg border border-ink-200 bg-parchment-50 p-5"
      aria-label="In the AgricultureID knowledge base"
    >
      <h2 className="font-serif text-lg text-forest-900">
        In the AgricultureID knowledge base
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        The canonical structured record for each of these lives on the main
        platform. This publication adds context; it does not replace them.
      </p>
      <dl className="mt-4 space-y-2">
        {present.map(({ f, slugs }) => (
          <div key={f} className="flex flex-wrap items-baseline gap-x-2">
            <dt className="text-xs uppercase tracking-wide text-ink-500">
              {ENTITY_FAMILY_LABEL[f]}
            </dt>
            <dd className="text-sm">
              {slugs.map((slug, i) => (
                <span key={slug}>
                  {i > 0 && ', '}
                  <a
                    href={platformUrl(entityPath(f, slug))}
                    className="text-forest-700 hover:underline"
                  >
                    {slug.replace(/-/g, ' ')}
                  </a>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
