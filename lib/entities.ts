/**
 * Links from a publication into the canonical AgricultureID knowledge base.
 *
 * The Journal does not hold the corpus and must not import it: the main
 * repository's `data/` directory alone is 51 MB, and pulling any of it in
 * would couple the two builds and put megabytes of registry snapshots into a
 * publication's bundle. What the Journal holds instead is the URL SHAPE of each
 * entity family — enough to build a correct link, and nothing more.
 *
 * The cost of that choice is that a slug typo produces a link to a 404 rather
 * than a build error. That is paid for in `validate:journal`, which checks the
 * declared entity references against a small checked-in manifest of known
 * slugs, and in the main platform's own rendered-link audit.
 */
export const ENTITY_PATHS = {
  crops: 'crops',
  cultivars: 'cultivars',
  livestock: 'livestock',
  commodities: 'commodities',
  authorities: 'agricultural-authorities',
  registries: 'agricultural-registries',
  regulations: 'agricultural-regulations',
  datasets: 'datasets',
  tools: 'tools',
  countries: 'countries',
} as const;

export type EntityFamily = keyof typeof ENTITY_PATHS;

export const ENTITY_FAMILY_LABEL: Record<EntityFamily, string> = {
  crops: 'Crop',
  cultivars: 'Cultivar',
  livestock: 'Livestock',
  commodities: 'Commodity',
  authorities: 'Authority',
  registries: 'Official registry',
  regulations: 'Compliance topic',
  datasets: 'Dataset',
  tools: 'Tool',
  countries: 'Country',
};

/** Path on the main platform for one entity, relative to the site root. */
export function entityPath(family: EntityFamily, slug: string): string {
  return `/${ENTITY_PATHS[family]}/${slug}`;
}
