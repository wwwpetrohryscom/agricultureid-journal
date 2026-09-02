/**
 * AgricultureID Journal — the publication model.
 *
 * ## Why this is not a blogPost
 *
 * A blog has one kind of thing in it. This publication has fifteen, and they
 * make different claims on a reader. A market brief reports what a statistical
 * agency released; a research note reports what one study found; a regulatory
 * update reports what a rule now says. Flattening them into a single
 * `blogPost` would erase exactly the distinctions the main AgricultureID
 * platform exists to preserve — and the Journal would then be undoing, in
 * prose, the work the corpus does in structure.
 *
 * So the type is carried on the publication, it decides the schema.org mapping,
 * it decides the visual treatment, and the validator enforces what each type
 * must supply.
 */

/* -------------------------------------------------------------------------- */
/*  Editorial format                                                          */
/* -------------------------------------------------------------------------- */

export const PUBLICATION_TYPES = [
  'NEWS',
  'FEATURE',
  'ARTICLE',
  'RESEARCH_NOTE',
  'DATA_NOTE',
  'MARKET_BRIEF',
  'REGULATORY_UPDATE',
  'POLICY_UPDATE',
  'CROP_FEATURE',
  'LIVESTOCK_FEATURE',
  'INPUT_UPDATE',
  'CLIMATE_BRIEF',
  'GUIDE',
  'INTERVIEW',
  'ANALYSIS',
  'AGRICULTUREID_UPDATE',
  'CORRECTION',
] as const;
export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export const PUBLICATION_TYPE_LABEL: Record<PublicationType, string> = {
  NEWS: 'News',
  FEATURE: 'Feature',
  ARTICLE: 'Article',
  RESEARCH_NOTE: 'Research note',
  DATA_NOTE: 'Data note',
  MARKET_BRIEF: 'Market brief',
  REGULATORY_UPDATE: 'Regulatory update',
  POLICY_UPDATE: 'Policy update',
  CROP_FEATURE: 'Crop feature',
  LIVESTOCK_FEATURE: 'Livestock feature',
  INPUT_UPDATE: 'Input update',
  CLIMATE_BRIEF: 'Climate brief',
  GUIDE: 'Guide',
  INTERVIEW: 'Interview',
  ANALYSIS: 'Analysis',
  AGRICULTUREID_UPDATE: 'AgricultureID update',
  CORRECTION: 'Correction',
};

/**
 * Which schema.org type each format is.
 *
 * NewsArticle is a claim that the item is news — time-sensitive reporting of
 * something that happened. A guide to soil sampling is not news, and labelling
 * it NewsArticle to court a rich result would be telling a search engine
 * something untrue about the content. Only genuinely time-bound formats map to
 * NewsArticle; everything else is an Article.
 */
export const SCHEMA_TYPE: Record<PublicationType, 'NewsArticle' | 'Article'> = {
  NEWS: 'NewsArticle',
  REGULATORY_UPDATE: 'NewsArticle',
  POLICY_UPDATE: 'NewsArticle',
  MARKET_BRIEF: 'NewsArticle',
  INPUT_UPDATE: 'NewsArticle',
  CORRECTION: 'NewsArticle',
  FEATURE: 'Article',
  ARTICLE: 'Article',
  RESEARCH_NOTE: 'Article',
  DATA_NOTE: 'Article',
  CROP_FEATURE: 'Article',
  LIVESTOCK_FEATURE: 'Article',
  CLIMATE_BRIEF: 'Article',
  GUIDE: 'Article',
  INTERVIEW: 'Article',
  ANALYSIS: 'Article',
  AGRICULTUREID_UPDATE: 'Article',
};

/**
 * Formats that must cite at least one source.
 *
 * A feature about how AgricultureID works can be written from the repository.
 * A claim about what a regulator decided, what a market did, or what a study
 * found cannot — those are assertions about the world, and an assertion about
 * the world without a source is the thing this publication exists not to do.
 */
export const REQUIRES_SOURCES: readonly PublicationType[] = [
  'NEWS',
  'MARKET_BRIEF',
  'REGULATORY_UPDATE',
  'POLICY_UPDATE',
  'RESEARCH_NOTE',
  'DATA_NOTE',
  'INPUT_UPDATE',
  'CLIMATE_BRIEF',
  'ANALYSIS',
  'CORRECTION',
];

/* -------------------------------------------------------------------------- */
/*  Sections                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Editorial sections, not automatic SEO taxonomies.
 *
 * A section exists because an editor puts publications in it. One with nothing
 * in it is not published, not indexed and not linked — an empty section page is
 * a promise the publication has not kept.
 */
export const SECTIONS = [
  'news',
  'features',
  'markets',
  'policy',
  'regulations',
  'research',
  'data',
  'crops',
  'livestock',
  'inputs',
  'climate',
  'guides',
  'agricultureid',
] as const;
export type Section = (typeof SECTIONS)[number];

export const SECTION_LABEL: Record<Section, string> = {
  news: 'News',
  features: 'Features',
  markets: 'Markets',
  policy: 'Policy',
  regulations: 'Regulations',
  research: 'Research',
  data: 'Data',
  crops: 'Crops',
  livestock: 'Livestock',
  inputs: 'Inputs',
  climate: 'Climate & Water',
  guides: 'Guides',
  agricultureid: 'AgricultureID',
};

export const SECTION_DESCRIPTION: Record<Section, string> = {
  news: 'Time-sensitive reporting from official agricultural sources.',
  features: 'Long-form reporting that puts official data in context.',
  markets: 'Production, trade and price releases, read carefully.',
  policy: 'Agricultural policy developments and what they change.',
  regulations: 'Authorisation, registration and compliance changes.',
  research: 'What individual studies found, and what they did not.',
  data: 'Dataset releases, methodology changes and provenance notes.',
  crops: 'Crop production, seasons and varieties in editorial form.',
  livestock: 'Livestock production, health and breed reporting.',
  inputs: 'Fertilisers, plant protection products and official registers.',
  climate: 'Climate normals, drought assessments and agricultural water.',
  guides: 'Practical explanations of how agricultural information works.',
  agricultureid: 'How AgricultureID is built, verified and corrected.',
};

/* -------------------------------------------------------------------------- */
/*  Editorial lifecycle                                                       */
/* -------------------------------------------------------------------------- */

export const STATUSES = [
  'DRAFT',
  'REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'UPDATED',
  'CORRECTED',
  'ARCHIVED',
] as const;
export type Status = (typeof STATUSES)[number];

/**
 * The states a publication may be public in.
 *
 * Everything else is invisible: absent from routes, the sitemap, every feed,
 * the search index and the latest-items projection. A draft that leaked into
 * production indexing would be an unreviewed claim published under the
 * AgricultureID name, and no amount of later correction takes that back.
 *
 * ARCHIVED is deliberately public-but-not-promoted: the URL keeps working,
 * because breaking a cited link is its own kind of dishonesty, but the item is
 * marked archived on the page and is excluded from feeds and the front page.
 */
export const PUBLIC_STATUSES: readonly Status[] = [
  'PUBLISHED',
  'UPDATED',
  'CORRECTED',
  'ARCHIVED',
];

/** Public AND promoted — feeds, front page, section listings. */
export const PROMOTED_STATUSES: readonly Status[] = [
  'PUBLISHED',
  'UPDATED',
  'CORRECTED',
];

/* -------------------------------------------------------------------------- */
/*  Evidence vocabularies                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Where a regulatory item sits in its own lifecycle.
 *
 * A proposal is not a rule. A consultation is not a rule. Presenting either as
 * current law would make a reader comply with something that does not apply, or
 * ignore something that does.
 */
export const REGULATORY_STAGES = [
  'PROPOSAL',
  'CONSULTATION',
  'ADOPTED',
  'EFFECTIVE',
  'SUPERSEDED',
  'OFFICIAL_GUIDANCE',
  'REGULATORY_DECISION',
] as const;
export type RegulatoryStage = (typeof REGULATORY_STAGES)[number];

export const REGULATORY_STAGE_LABEL: Record<RegulatoryStage, string> = {
  PROPOSAL: 'Proposal — not in force',
  CONSULTATION: 'Open consultation — not in force',
  ADOPTED: 'Adopted — not yet in force',
  EFFECTIVE: 'In force',
  SUPERSEDED: 'Superseded',
  OFFICIAL_GUIDANCE: 'Official guidance',
  REGULATORY_DECISION: 'Regulatory decision',
};

/** What kind of study a research note is about. */
export const RESEARCH_KINDS = [
  'PREPRINT',
  'PEER_REVIEWED',
  'OBSERVATIONAL',
  'EXPERIMENTAL',
  'MODELED',
  'OFFICIAL_RESEARCH_RELEASE',
] as const;
export type ResearchKind = (typeof RESEARCH_KINDS)[number];

export const RESEARCH_KIND_LABEL: Record<ResearchKind, string> = {
  PREPRINT: 'Preprint — not yet peer reviewed',
  PEER_REVIEWED: 'Peer reviewed',
  OBSERVATIONAL: 'Observational study',
  EXPERIMENTAL: 'Experimental study',
  MODELED: 'Modelled result',
  OFFICIAL_RESEARCH_RELEASE: 'Official research release',
};

/**
 * What kind of number a market figure is.
 *
 * The same discipline the main platform applies to its economics and climate
 * layers. A forecast rendered as an observation is the most damaging error a
 * market brief can make, and it is the easiest one to make by accident.
 */
export const DATA_NATURES = [
  'OBSERVED',
  'ESTIMATED',
  'REVISED',
  'FORECAST',
  'PROVISIONAL',
] as const;
export type DataNature = (typeof DATA_NATURES)[number];

export const DATA_NATURE_LABEL: Record<DataNature, string> = {
  OBSERVED: 'Observed',
  ESTIMATED: 'Estimated',
  REVISED: 'Revised',
  FORECAST: 'Forecast',
  PROVISIONAL: 'Provisional',
};

/* -------------------------------------------------------------------------- */
/*  Sources                                                                   */
/* -------------------------------------------------------------------------- */

export const SOURCE_TYPES = [
  'GOVERNMENT',
  'REGULATOR',
  'STATISTICS_AGENCY',
  'INTERGOVERNMENTAL',
  'RESEARCH_INSTITUTION',
  'PEER_REVIEWED_PAPER',
  'PREPRINT',
  'OFFICIAL_REGISTER',
  'STANDARDS_BODY',
  'AGRICULTUREID',
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export interface PublicationSource {
  id: string;
  title: string;
  organization: string;
  authors?: readonly string[];
  publication?: string;
  /** ISO date the source itself carries, where it carries one. */
  date?: string;
  url: string;
  doi?: string;
  /** The source's own identifier for the record, where it has one. */
  officialRecordId?: string;
  sourceType: SourceType;
  /** ISO date this source was read. Never guessed. */
  accessedAt: string;
  /** What this source is being cited for, in one sentence. */
  supports?: string;
}

/* -------------------------------------------------------------------------- */
/*  Authors                                                                   */
/* -------------------------------------------------------------------------- */

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
}

/* -------------------------------------------------------------------------- */
/*  Corrections and updates                                                   */
/* -------------------------------------------------------------------------- */

export interface RevisionEntry {
  date: string;
  note: string;
}

/* -------------------------------------------------------------------------- */
/*  Links into the canonical corpus                                           */
/* -------------------------------------------------------------------------- */

/**
 * Structured relationships to AgricultureID entities.
 *
 * These are fields, not keyword links buried in prose. A crop feature declares
 * which crop it is about; the renderer turns that into a link to the canonical
 * entity. The Journal complements the knowledge base and must never restate it:
 * the encyclopedia page for wheat is the canonical account of wheat, and a
 * feature that duplicated it would compete with it for its own query.
 */
export interface RelatedEntities {
  crops?: readonly string[];
  cultivars?: readonly string[];
  livestock?: readonly string[];
  commodities?: readonly string[];
  authorities?: readonly string[];
  registries?: readonly string[];
  regulations?: readonly string[];
  datasets?: readonly string[];
  tools?: readonly string[];
  countries?: readonly string[];
  journalItems?: readonly string[];
}

/* -------------------------------------------------------------------------- */
/*  The publication                                                           */
/* -------------------------------------------------------------------------- */

export interface Publication {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  section: Section;
  publicationType: PublicationType;
  status: Status;
  tags: readonly string[];
  authors: readonly string[];
  datePublished: string;
  dateModified?: string;
  featured?: boolean;
  /** Lead item on the front page. At most one across the whole publication. */
  lead?: boolean;

  heroImage?: string;
  heroAlt?: string;
  heroCredit?: string;
  heroSource?: string;

  /** One-paragraph standfirst, used in listings and in feeds. */
  summary: string;
  /** Optional bulleted takeaways. Facts, not teasers. */
  keyPoints?: readonly string[];

  sources?: readonly PublicationSource[];
  related?: RelatedEntities;

  /** Regulatory items must state their stage. */
  regulatoryStage?: RegulatoryStage;
  /** Research notes must state what kind of study they describe. */
  researchKind?: ResearchKind;
  /** Market and data items must state what kind of number they carry. */
  dataNature?: DataNature;

  doi?: string;
  researchPaperUrl?: string;
  datasetReleaseId?: string;
  eventDate?: string;
  geographies?: readonly string[];

  updateHistory?: readonly RevisionEntry[];
  correctionHistory?: readonly RevisionEntry[];

  seoTitle?: string;
  seoDescription?: string;
  socialTitle?: string;
  socialDescription?: string;
  /** Only ever a same-host /journal URL. Never a *.netlify.app host. */
  canonical?: string;

  /** Rendered HTML of the Markdown body. */
  bodyHtml: string;
  /** Raw Markdown, kept for the search index and the reading estimate. */
  bodyText: string;
  readingMinutes: number;
  /** Repository path, for error messages that can be acted on. */
  sourcePath: string;
}
