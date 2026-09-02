import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { platformUrl } from '@/lib/site';

/**
 * The Journal's own 404.
 *
 * A request for /journal/does-not-exist reaches this project through the proxy
 * and must be answered here — the main platform never sees it, so its 404 page
 * cannot respond. A visitor who lands here should be told which of the two
 * applications they are in and offered a way into both.
 */
export default function NotFound() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-sm text-ink-500">404</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900">
          There is no publication at this address
        </h1>
        <p className="mt-3 text-ink-700">
          This is AgricultureID Journal, the editorial layer of AgricultureID.
          The page you asked for is not one of its publications — it may have
          been renamed, or the link may be wrong.
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>
            <Link href="/" className="text-forest-700 hover:underline">
              AgricultureID Journal — latest publications
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-forest-700 hover:underline">
              Search the Journal
            </Link>
          </li>
          <li>
            <a href={platformUrl()} className="text-forest-700 hover:underline">
              AgricultureID knowledge base
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
}
