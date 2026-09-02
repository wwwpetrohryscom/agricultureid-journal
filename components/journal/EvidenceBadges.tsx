import type { Publication } from '@/types/publication';
import {
  DATA_NATURE_LABEL,
  REGULATORY_STAGE_LABEL,
  RESEARCH_KIND_LABEL,
} from '@/types/publication';

/**
 * The claim-qualifying labels, rendered ABOVE the body.
 *
 * A regulatory stage buried at the foot of an article is a caveat nobody
 * reaches. "Proposal — not in force" has to be visible before the text that
 * describes what the rule says, or the reader has already formed the wrong
 * belief by the time they meet it.
 */
export function EvidenceBadges({ p }: { p: Publication }) {
  const badges: { label: string; tone: 'warn' | 'neutral' }[] = [];

  if (p.regulatoryStage) {
    const label = REGULATORY_STAGE_LABEL[p.regulatoryStage];
    badges.push({
      label,
      tone: label.includes('not in force') ? 'warn' : 'neutral',
    });
  }
  if (p.researchKind) {
    const label = RESEARCH_KIND_LABEL[p.researchKind];
    badges.push({
      label,
      tone: p.researchKind === 'PREPRINT' ? 'warn' : 'neutral',
    });
  }
  if (p.dataNature) {
    badges.push({
      label: DATA_NATURE_LABEL[p.dataNature],
      tone:
        p.dataNature === 'FORECAST' || p.dataNature === 'PROVISIONAL'
          ? 'warn'
          : 'neutral',
    });
  }
  if (p.status === 'ARCHIVED') {
    badges.push({ label: 'Archived — not maintained', tone: 'warn' });
  }

  if (badges.length === 0) return null;

  return (
    <ul
      className="mt-4 flex flex-wrap gap-2"
      aria-label="What kind of claim this is"
    >
      {badges.map((b) => (
        <li
          key={b.label}
          className={
            b.tone === 'warn'
              ? 'rounded border border-clay-300 bg-clay-50 px-2.5 py-1 text-xs font-medium text-clay-800'
              : 'rounded border border-ink-200 bg-parchment-100 px-2.5 py-1 text-xs font-medium text-ink-700'
          }
        >
          {b.label}
        </li>
      ))}
    </ul>
  );
}
