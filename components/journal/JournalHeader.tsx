import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE, platformUrl } from '@/lib/site';
import { SECTION_LABEL, type Section } from '@/types/publication';

/**
 * The Journal masthead.
 *
 * Two things it must do. It must read AgricultureID Journal, so a reader who
 * arrives on an article knows which publication they are in — and it must offer
 * an unambiguous way back to the knowledge platform, because the Journal is an
 * editorial layer on top of it rather than a separate destination.
 *
 * Only sections with something in them are listed. A nav link to an empty
 * section is a promise the publication has not kept.
 */
export function JournalHeader({ sections }: { sections: readonly Section[] }) {
  return (
    <header className="border-b border-ink-200 bg-parchment-50">
      <Container className="py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <Link href="/" className="group">
            <span className="font-serif text-2xl text-forest-900">
              AgricultureID{' '}
              <span className="text-forest-600 group-hover:underline">
                Journal
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-ink-500">
              {SITE.tagline}
            </span>
          </Link>
          <a
            href={platformUrl()}
            className="text-sm text-forest-700 hover:underline"
          >
            ← AgricultureID knowledge base
          </a>
        </div>

        <nav aria-label="Journal sections" className="mt-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <li>
              <Link href="/" className="text-ink-700 hover:text-forest-700">
                Latest
              </Link>
            </li>
            {sections.map((s) => (
              <li key={s}>
                <Link
                  href={`/${s}`}
                  className="text-ink-700 hover:text-forest-700"
                >
                  {SECTION_LABEL[s]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className="text-ink-700 hover:text-forest-700"
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
