/**
 * Editorial gate for AgricultureID Journal. Offline, runs before every build.
 *
 * What it prevents is a publication that makes a claim it has not earned: a
 * regulatory item that does not say whether the rule is in force, a market
 * figure that does not say whether it is observed or forecast, a byline naming
 * a person who does not exist, a draft with a public URL, a link into the
 * knowledge base that goes nowhere.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  allPublications,
  isPromoted,
  isPublic,
  BUILD_DATE,
} from '../lib/publications';
import { AUTHOR_MAP } from '../lib/authors';
import {
  DATA_NATURES,
  PUBLICATION_TYPES,
  REGULATORY_STAGES,
  REQUIRES_SOURCES,
  RESEARCH_KINDS,
  SCHEMA_TYPE,
  SECTIONS,
  SOURCE_TYPES,
  STATUSES,
} from '../types/publication';
import { SITE } from '../lib/site';

const errors: string[] = [];
const fail = (m: string) => errors.push(m);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

const manifest = JSON.parse(
  readFileSync(join(process.cwd(), 'data/entity-manifest.json'), 'utf8'),
) as Record<string, string[]>;

/** Entity families the manifest can actually check. */
const CHECKABLE = ['crops', 'cultivars', 'livestock', 'commodities'] as const;

async function main() {
  const pubs = await allPublications();

  if (pubs.length === 0) fail('no publications were found at all');

  const slugs = new Set<string>();
  let leadCount = 0;

  for (const p of pubs) {
    const at = p.sourcePath;

    /* -- identity ---------------------------------------------------------- */
    if (!p.slug?.trim()) fail(`${at}: no slug`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))
      fail(`${at}: slug "${p.slug}" is not lowercase kebab-case`);
    // Slugs are unique across the WHOLE publication, not per section, so an item
    // can be moved between sections later without colliding with itself.
    if (slugs.has(p.slug)) fail(`${at}: duplicate slug "${p.slug}"`);
    slugs.add(p.slug);

    /* -- the fields every item must have ----------------------------------- */
    if (!p.title?.trim()) fail(`${at}: no title`);
    if (!p.description?.trim()) fail(`${at}: no description`);
    else if (p.description.length < 50)
      fail(
        `${at}: description is ${p.description.length} characters; too short to be a description`,
      );
    if (!p.summary?.trim()) fail(`${at}: no summary`);
    if (!p.bodyText || p.bodyText.length < 400)
      fail(
        `${at}: body is ${p.bodyText?.length ?? 0} characters — too short to be a publication`,
      );

    /* -- vocabularies ------------------------------------------------------- */
    if (!SECTIONS.includes(p.section))
      fail(`${at}: section "${p.section}" is not in the vocabulary`);
    if (!p.publicationType)
      fail(`${at}: no publicationType — every item must declare its format`);
    else if (!PUBLICATION_TYPES.includes(p.publicationType))
      fail(
        `${at}: publicationType "${p.publicationType}" is not in the vocabulary`,
      );
    if (!p.status) fail(`${at}: no status`);
    else if (!STATUSES.includes(p.status))
      fail(`${at}: status "${p.status}" is not in the vocabulary`);

    /* -- frontmatter shapes -------------------------------------------------- */
    // YAML turns `- Some text: with a colon` into a MAPPING, not a string, and
    // the object then reaches React and fails the build with a message that says
    // nothing about which file it came from. Check the shape here instead.
    for (const [field, value] of [
      ['keyPoints', p.keyPoints],
      ['tags', p.tags],
      ['authors', p.authors],
      ['geographies', p.geographies],
    ] as const) {
      if (value === undefined) continue;
      if (!Array.isArray(value)) {
        fail(`${at}: ${field} is not a list`);
        continue;
      }
      for (const v of value)
        if (typeof v !== 'string')
          fail(
            `${at}: ${field} contains a ${typeof v} rather than a string — a YAML value with a colon in it must be quoted`,
          );
    }
    for (const [field, value] of [
      ['title', p.title],
      ['subtitle', p.subtitle],
      ['description', p.description],
      ['summary', p.summary],
    ] as const) {
      if (value !== undefined && typeof value !== 'string')
        fail(
          `${at}: ${field} is a ${typeof value} rather than a string — quote the YAML value`,
        );
    }

    /* -- authors ------------------------------------------------------------ */
    if (!p.authors?.length) fail(`${at}: no author`);
    for (const a of p.authors ?? [])
      if (!AUTHOR_MAP.has(a))
        fail(`${at}: author "${a}" is not in the author register`);

    /* -- dates -------------------------------------------------------------- */
    if (!ISO.test(p.datePublished ?? ''))
      fail(`${at}: datePublished must be an ISO date`);
    if (p.dateModified) {
      if (!ISO.test(p.dateModified))
        fail(`${at}: dateModified must be an ISO date`);
      else if (p.dateModified < p.datePublished)
        fail(
          `${at}: dateModified ${p.dateModified} is before datePublished ${p.datePublished}`,
        );
    }
    if (p.eventDate && !ISO.test(p.eventDate))
      fail(`${at}: eventDate must be an ISO date`);

    // A scheduled item must be in the future. One dated in the past is either a
    // publication somebody forgot to promote or a date somebody mistyped, and in
    // both cases the state and the date disagree.
    if (p.status === 'SCHEDULED' && p.datePublished <= BUILD_DATE)
      fail(
        `${at}: status SCHEDULED but datePublished ${p.datePublished} is not in the future (build date ${BUILD_DATE})`,
      );
    // And nothing else may be dated ahead of the build.
    if (p.status !== 'SCHEDULED' && p.datePublished > BUILD_DATE)
      fail(
        `${at}: dated ${p.datePublished}, which is after the build date ${BUILD_DATE}, but is not SCHEDULED`,
      );

    /* -- what each format must supply --------------------------------------- */
    if (
      REQUIRES_SOURCES.includes(p.publicationType) &&
      !(p.sources ?? []).length
    )
      fail(
        `${at}: a "${p.publicationType}" makes a claim about the world and cites nothing`,
      );

    if (p.publicationType === 'REGULATORY_UPDATE' && !p.regulatoryStage)
      fail(
        `${at}: a regulatory update must state its stage — a proposal read as a rule is the failure this prevents`,
      );
    if (p.regulatoryStage && !REGULATORY_STAGES.includes(p.regulatoryStage))
      fail(
        `${at}: regulatoryStage "${p.regulatoryStage}" is not in the vocabulary`,
      );

    if (p.publicationType === 'RESEARCH_NOTE' && !p.researchKind)
      fail(`${at}: a research note must say what kind of study it describes`);
    if (p.researchKind && !RESEARCH_KINDS.includes(p.researchKind))
      fail(`${at}: researchKind "${p.researchKind}" is not in the vocabulary`);

    if (
      (p.publicationType === 'MARKET_BRIEF' ||
        p.publicationType === 'DATA_NOTE') &&
      !p.dataNature
    )
      fail(
        `${at}: a "${p.publicationType}" must say whether its figures are observed, estimated, revised, provisional or forecast`,
      );
    if (p.dataNature && !DATA_NATURES.includes(p.dataNature))
      fail(`${at}: dataNature "${p.dataNature}" is not in the vocabulary`);

    /* -- sources ------------------------------------------------------------ */
    const sourceIds = new Set<string>();
    for (const s of p.sources ?? []) {
      const sat = `${at} source "${s.id}"`;
      if (!s.id?.trim()) fail(`${at}: a source with no id`);
      if (sourceIds.has(s.id)) fail(`${sat}: duplicate source id`);
      sourceIds.add(s.id);
      if (!s.title?.trim()) fail(`${sat}: no title`);
      if (!s.organization?.trim()) fail(`${sat}: no organization`);
      if (!s.url?.trim()) fail(`${sat}: no url`);
      else if (!/^https:\/\//.test(s.url)) fail(`${sat}: url is not https`);
      if (!SOURCE_TYPES.includes(s.sourceType))
        fail(`${sat}: sourceType "${s.sourceType}" is not in the vocabulary`);
      if (!ISO.test(s.accessedAt ?? ''))
        fail(
          `${sat}: accessedAt must be an ISO date — when the source was actually read`,
        );
      else if (s.accessedAt > BUILD_DATE)
        fail(`${sat}: accessedAt ${s.accessedAt} is in the future`);
      if (s.date && !ISO.test(s.date)) fail(`${sat}: date must be an ISO date`);
      // An empty DOI is worse than no DOI: it looks like a field somebody filled.
      if (s.doi !== undefined && !s.doi.trim())
        fail(`${sat}: doi is present but empty — omit the field instead`);
    }

    /* -- images carry their attribution -------------------------------------- */
    if (p.heroImage) {
      if (!p.heroAlt?.trim()) fail(`${at}: has a hero image and no alt text`);
      if (!p.heroCredit?.trim() && !p.heroSource?.trim())
        fail(`${at}: has a hero image with no credit and no source`);
    }

    /* -- links into the knowledge base --------------------------------------- */
    for (const family of CHECKABLE) {
      for (const slug of p.related?.[family] ?? []) {
        if (!manifest[family]?.includes(slug))
          fail(
            `${at}: related.${family} names "${slug}", which is not an entity in the knowledge base`,
          );
      }
    }
    for (const other of p.related?.journalItems ?? []) {
      if (
        !pubs.some(
          (x) => `${x.section}/${x.slug}` === other || x.slug === other,
        )
      )
        fail(
          `${at}: related.journalItems names "${other}", which is not a publication here`,
        );
    }

    /* -- canonical ------------------------------------------------------------ */
    if (p.canonical) {
      if (!p.canonical.startsWith(`${SITE.origin}${SITE.basePath}/`))
        fail(
          `${at}: canonical "${p.canonical}" is not a ${SITE.basePath} URL on ${SITE.origin}`,
        );
      if (/netlify\.app/i.test(p.canonical))
        fail(`${at}: canonical names an infrastructure host`);
    }

    /* -- revisions ------------------------------------------------------------ */
    for (const r of [
      ...(p.updateHistory ?? []),
      ...(p.correctionHistory ?? []),
    ]) {
      if (!ISO.test(r.date))
        fail(`${at}: a revision entry with a malformed date`);
      if (!r.note?.trim()) fail(`${at}: a revision entry with no note`);
      if (r.date < p.datePublished)
        fail(
          `${at}: a revision dated ${r.date}, before the item was published`,
        );
    }
    // A corrected item must say what was corrected. Otherwise "CORRECTED" is a
    // badge with nothing behind it.
    if (p.status === 'CORRECTED' && !(p.correctionHistory ?? []).length)
      fail(`${at}: status CORRECTED but no correction is recorded`);
    if (p.status === 'UPDATED' && !(p.updateHistory ?? []).length)
      fail(`${at}: status UPDATED but no update is recorded`);

    /* -- front page ------------------------------------------------------------ */
    if (p.lead) {
      leadCount += 1;
      if (!isPromoted(p))
        fail(`${at}: marked as the lead but is not in a promoted state`);
    }
    if (p.featured && !isPromoted(p))
      fail(`${at}: marked featured but is not in a promoted state`);

    /* -- schema mapping --------------------------------------------------------- */
    if (p.publicationType && !SCHEMA_TYPE[p.publicationType])
      fail(`${at}: no schema.org mapping for "${p.publicationType}"`);
  }

  if (leadCount > 1)
    fail(`${leadCount} publications are marked as the lead; there can be one`);

  /* -- vocabulary liveness ------------------------------------------------------ */
  // Every format in the vocabulary must have a schema mapping, and every section
  // must have a label and a description, or the UI renders `undefined`.
  for (const t of PUBLICATION_TYPES)
    if (!SCHEMA_TYPE[t]) fail(`publication type "${t}" has no schema mapping`);

  /* -- report -------------------------------------------------------------------- */
  const publicItems = pubs.filter(isPublic);
  const promoted = pubs.filter(isPromoted);
  console.log('\nAgricultureID Journal — editorial validation\n');
  console.log(`  Publications:      ${pubs.length}`);
  console.log(`  Public:            ${publicItems.length}`);
  console.log(`  In feeds:          ${promoted.length}`);
  console.log(
    `  Not public:        ${pubs.length - publicItems.length} (draft, review or scheduled ahead)`,
  );
  {
    const byType = new Map<string, number>();
    for (const p of promoted)
      byType.set(p.publicationType, (byType.get(p.publicationType) ?? 0) + 1);
    console.log('\n  By format');
    for (const [k, v] of [...byType].sort((a, b) => b[1] - a[1]))
      console.log(`    ${k.padEnd(22)}${String(v).padStart(3)}`);
    const bySection = new Map<string, number>();
    for (const p of promoted)
      bySection.set(p.section, (bySection.get(p.section) ?? 0) + 1);
    console.log('\n  By section');
    for (const [k, v] of [...bySection].sort((a, b) => b[1] - a[1]))
      console.log(`    ${k.padEnd(22)}${String(v).padStart(3)}`);
    const cited = promoted.reduce((t, p) => t + (p.sources ?? []).length, 0);
    console.log(`\n  Sources cited:     ${cited}`);
  }

  if (errors.length) {
    console.error(`\n  FAILED — ${errors.length} error(s):\n`);
    for (const e of errors.slice(0, 40)) console.error(`    ✗ ${e}`);
    process.exit(1);
  }
  console.log('\n  ✓ Editorial validation passed.\n');
}

main();
