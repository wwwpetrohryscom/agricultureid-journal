import type { Metadata } from 'next';
import '@/styles/globals.css';
import { EcosystemBar } from '@/components/ecosystem/EcosystemBar';
import { ConsentProvider } from '@/components/consent/ConsentProvider';
import { JournalHeader } from '@/components/journal/JournalHeader';
import { JournalFooter } from '@/components/journal/JournalFooter';
import { SITE, journalUrl } from '@/lib/site';
import { activeSections } from '@/lib/publications';

/**
 * `metadataBase` is the PUBLIC origin, not this deployment's own host.
 *
 * Next resolves every relative metadata URL against it, so setting it to
 * agricultureid.com is what makes an Open Graph image or a canonical tag
 * rendered on the *.netlify.app deploy still point at the real address.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  publisher: SITE.platform,
  robots: { index: true, follow: true },
  alternates: { canonical: journalUrl() },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: journalUrl(),
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  category: 'Agriculture',
  formatDetection: { telephone: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sections = await activeSections();
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {/*
          The same ConsentProvider component as the main platform, reading and
          writing the same `agricultureid_consent` key in localStorage. Because
          the Journal is served on the same ORIGIN through a proxy rewrite, that
          is literally the same storage: a visitor who has already decided on
          the knowledge base is not asked again here, and a decision made here
          is honoured there. A subdomain would have needed a second consent
          record; a path does not.
        */}
        <ConsentProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {/* The canonical HELPERG ecosystem bar, same registry as the main
              platform. Mounted once, never per page. */}
          <EcosystemBar />
          <JournalHeader sections={sections} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <JournalFooter />
        </ConsentProvider>
      </body>
    </html>
  );
}
