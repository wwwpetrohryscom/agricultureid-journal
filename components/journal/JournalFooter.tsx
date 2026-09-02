import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE, platformUrl } from '@/lib/site';
import { PrivacySettingsButton } from '@/components/consent/PrivacySettingsButton';

export function JournalFooter() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-parchment-50">
      <Container className="py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg text-forest-900">{SITE.name}</p>
            <p className="mt-1 text-sm text-ink-600">{SITE.tagline}</p>
          </div>
          <nav aria-label="Editorial policy">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              How this is made
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-forest-700 hover:underline"
                >
                  Editorial policy
                </Link>
              </li>
              <li>
                <Link
                  href="/sourcing-policy"
                  className="text-forest-700 hover:underline"
                >
                  Sourcing policy
                </Link>
              </li>
              <li>
                <Link
                  href="/corrections"
                  className="text-forest-700 hover:underline"
                >
                  Corrections
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Feeds and platform">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Follow and return
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <a
                  href="/journal/rss.xml"
                  className="text-forest-700 hover:underline"
                >
                  RSS
                </a>
                {' · '}
                <a
                  href="/journal/atom.xml"
                  className="text-forest-700 hover:underline"
                >
                  Atom
                </a>
                {' · '}
                <a
                  href="/journal/feed.json"
                  className="text-forest-700 hover:underline"
                >
                  JSON Feed
                </a>
              </li>
              <li>
                <a
                  href={platformUrl()}
                  className="text-forest-700 hover:underline"
                >
                  AgricultureID knowledge base
                </a>
              </li>
              <li className="pt-1">
                <PrivacySettingsButton />
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-xs text-ink-500">
          {SITE.name} is the editorial layer of {SITE.platform}. Publications
          cite the official sources they rely on; the canonical structured
          record lives in the knowledge base.
        </p>
      </Container>
    </footer>
  );
}
