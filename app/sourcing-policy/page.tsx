import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Sourcing policy',
  description:
    'Which sources AgricultureID Journal prefers, how citations are recorded, and what the publication does when official sources disagree.',
  path: 'sourcing-policy',
});

export default function SourcingPolicyPage() {
  return (
    <Container className="py-8 lg:py-10">
      <article className="journal-prose mx-auto max-w-3xl">
        <h1>Sourcing policy</h1>

        <h2>Priority</h2>
        <p>In descending order of preference:</p>
        <ol>
          <li>The government or regulator whose decision it is</li>
          <li>The national statistics agency that produced the figure</li>
          <li>
            The intergovernmental body republishing it, where it adds definition
          </li>
          <li>The official research organisation that ran the work</li>
          <li>The primary peer-reviewed paper</li>
          <li>A preprint, labelled as a preprint</li>
        </ol>
        <p>
          A secondary report of an official decision is not a substitute for the
          decision. Where an item is about a regulation, we read and cite the
          operative text rather than a summary of it.
        </p>

        <h2>What a citation records</h2>
        <p>
          Each source carries its title, the organisation, the publication where
          relevant, the date the source itself bears, a URL, an official record
          identifier where one exists, the kind of source it is, and the date it
          was read. Where a source is cited for one specific claim, the page
          says which claim.
        </p>
        <p>
          Nothing in a citation is inferred. A DOI that is not on the paper is
          not written down; an access date is the date the page was actually
          opened.
        </p>

        <h2>Citations are visible</h2>
        <p>
          Sources are rendered in the page HTML, not behind a disclosure or a
          tooltip. A reader without JavaScript, and a crawler, see the same list
          the reader with JavaScript sees.
        </p>

        <h2>When official sources disagree</h2>
        <p>
          We record the disagreement rather than resolving it silently. Choosing
          between two sourced values produces a judgement no source made, and
          publishing one of them alone destroys the reader&rsquo;s ability to
          know the figure is contested.
        </p>
        <p>
          Most apparent conflicts turn out to be definitional — two sources
          measuring different things under the same word. Where a page must show
          one figure, the choice follows a stated rule and the other value is
          named.
        </p>

        <h2>Absence</h2>
        <p>
          Where the record is silent, the page says the record is silent.
          Absence in AgricultureID is always a statement about AgricultureID and
          never a claim that the thing does not exist. The main platform&rsquo;s
          coverage vocabulary distinguishes five kinds of not-knowing, and the
          Journal uses the same distinctions in prose.
        </p>

        <p>
          See also the <Link href="/editorial-policy">editorial policy</Link>.
        </p>
      </article>
    </Container>
  );
}
