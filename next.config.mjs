/** @type {import('next').NextConfig} */

/**
 * AgricultureID Journal — Next configuration.
 *
 * `basePath` is the single most consequential line in this repository.
 *
 * The Journal is served at agricultureid.com/journal, but it is a different
 * application from the one serving agricultureid.com. The main project forwards
 * /journal/* here with a Netlify proxy rewrite and forwards nothing else — so
 * every URL this app emits must already begin with /journal, or it falls
 * through to the knowledge platform and 404s. That includes the URLs nobody
 * writes by hand: /_next/static/* chunks, public/ assets, RSC payload requests,
 * link prefetches and client-side navigation targets.
 *
 * `basePath` prefixes all of them. It is the whole answer to asset routing, and
 * it is why `assetPrefix` is deliberately absent: assetPrefix exists to serve
 * assets from a DIFFERENT origin, which is the opposite of what is wanted.
 * Assets must stay same-origin under agricultureid.com/journal so no
 * *.netlify.app hostname ever reaches a browser — and so the visitor's consent
 * record, which lives in localStorage and is scoped to the origin, is the same
 * record the main platform wrote. Setting both is a documented way to produce
 * double-prefixed URLs that 404 in a way that looks like a caching problem.
 */

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig = {
  basePath: '/journal',
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: import.meta.dirname,
  // The canonical form of every Journal URL has no trailing slash, matching the
  // main platform. Netlify's matcher folds /journal and /journal/ together, so
  // both answer 200; the canonical tag and the sitemap name only this form.
  trailingSlash: false,
  /**
   * Declared here rather than left to the host.
   *
   * Netlify evaluates its own redirects BEFORE the Next.js runtime, so the main
   * project's proxy rule sends /journal/* here without the main application's
   * `headers()` block ever running. These responses therefore carry no security
   * headers unless this project sets them. That is a consequence of the routing
   * mechanism, not an oversight, and validate:routing checks for it.
   */
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
