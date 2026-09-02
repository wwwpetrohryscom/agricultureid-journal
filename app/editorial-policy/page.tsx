import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/metadata';
import {
  PUBLICATION_TYPES,
  PUBLICATION_TYPE_LABEL,
  SCHEMA_TYPE,
} from '@/types/publication';

export const metadata: Metadata = buildMetadata({
  title: 'Editorial policy',
  description:
    'How AgricultureID Journal decides what to publish, how each format is labelled, what it will not claim, and how AI is and is not used in drafting.',
  path: 'editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <Container className="py-8 lg:py-10">
      <article className="journal-prose mx-auto max-w-3xl">
        <h1>Editorial policy</h1>

        <p>
          AgricultureID Journal is the editorial layer of AgricultureID. The
          knowledge base describes what is true of a crop, an authority, a
          register or a dataset. The Journal reports what changed, explains what
          a number means, and says where the official record stops.
        </p>

        <h2>Formats are claims</h2>
        <p>
          Every publication carries a format, and the format decides what the
          item must supply before it can be built. A regulatory update that does
          not state whether the rule is in force does not pass validation. A
          market brief without a source does not pass validation. A research
          note must say what kind of study it describes.
        </p>
        <p>
          The format also decides the structured data. Only genuinely
          time-sensitive formats are marked as <code>NewsArticle</code>;
          everything else is an <code>Article</code>. Labelling a guide as news
          to court a rich result would be telling a search engine something
          untrue about the content.
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-300 text-left">
                <th className="py-2 pr-4 font-medium text-ink-600">Format</th>
                <th className="py-2 font-medium text-ink-600">
                  Structured data type
                </th>
              </tr>
            </thead>
            <tbody>
              {PUBLICATION_TYPES.map((t) => (
                <tr key={t} className="border-b border-ink-100">
                  <td className="py-1.5 pr-4 text-ink-800">
                    {PUBLICATION_TYPE_LABEL[t]}
                  </td>
                  <td className="py-1.5 font-mono text-xs text-ink-600">
                    {SCHEMA_TYPE[t]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>What we will not do</h2>
        <ul>
          <li>
            <strong>Manufacture news from evergreen material.</strong> An
            explanation of how growing degree days are computed is useful and is
            not news. Dating it as though it were would be a small dishonesty
            repeated every time.
          </li>
          <li>
            <strong>Present a forecast as an observation.</strong> Where a
            figure is a projection, an estimate or a provisional value, the page
            says so beside the figure, not in a footnote.
          </li>
          <li>
            <strong>Turn one study into a consensus.</strong> A research note
            reports what a study found and links the primary paper. Whether it
            was peer reviewed is stated above the text.
          </li>
          <li>
            <strong>Present a proposal as a rule.</strong> Regulatory items
            carry a stage — proposal, consultation, adopted, in force,
            superseded — and the stage is shown before the description of what
            the measure does.
          </li>
          <li>
            <strong>Infer impact from exposure.</strong> We can report that a
            state was assessed as being in drought. What that did to a
            particular field depends on crop stage, soil moisture, irrigation
            and management, and we do not take that step.
          </li>
          <li>
            <strong>Give advice.</strong> Nothing here is agronomic advice,
            legal advice or investment advice. Where a decision depends on an
            official register or a product label, the register or the label is
            the authority and we say so.
          </li>
        </ul>

        <h2>Duplication with the knowledge base</h2>
        <p>
          The canonical account of an entity lives on the main platform. A crop
          feature adds reporting, context or a look at what the sources contain;
          it does not restate the encyclopedia entry. Publications link into
          canonical entities through typed fields rather than through keywords
          placed in prose.
        </p>

        <h2>Drafting, and the use of AI</h2>
        <p>
          Editorial tooling, including AI assistance, may be used in research,
          drafting and checking. It is not used to publish. Every item is
          reviewed against the sources cited on the page before it reaches a
          public URL, and there is no pipeline anywhere in this system that
          turns a crawl into a published article without a person deciding to
          publish it.
        </p>

        <h2>Images</h2>
        <p>
          Where a publication carries an image, the page carries its credit and
          its source. An image without attribution is not published.
        </p>

        <h2>Corrections</h2>
        <p>
          Corrections are visible on the item and listed on the{' '}
          <Link href="/corrections">corrections page</Link>. See also the{' '}
          <Link href="/sourcing-policy">sourcing policy</Link>.
        </p>
      </article>
    </Container>
  );
}
