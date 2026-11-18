/** @type {import('next').NextConfig} */

/**
 * AgricultureID Journal — Next configuration.
 *
 * `basePath` is the single most consequential line in this repository.
 *
 * The Journal is served at agricultureid.com/journal, but it is a different
 * application from the one serving agricultureid.com. Cloudflare routes only
 * /journal* on that host to this project's Worker — so
 * every URL this app emits must already begin with /journal, or it falls
 * through to the knowledge platform and 404s. That includes the URLs nobody
 * writes by hand: /_next/static/* chunks, public/ assets, RSC payload requests,
 * link prefetches and client-side navigation targets.
 *
 * `basePath` prefixes all of them. It is the whole answer to asset routing, and
 * it is why `assetPrefix` is deliberately absent: assetPrefix exists to serve
 * assets from a DIFFERENT origin, which is the opposite of what is wanted.
 * Assets must stay same-origin under agricultureid.com/journal so no
 * infrastructure hostname ever reaches a browser — and so the visitor's consent
 * record, which lives in localStorage and is scoped to the origin, is the same
 * record the main platform wrote. Setting both is a documented way to produce
 * double-prefixed URLs that 404 in a way that looks like a caching problem.
 */

/*
 * Production is a STATIC EXPORT served by its own Cloudflare Worker,
 * `agricultureid-journal`, which owns the zone route agricultureid.com/journal*
 * (wrangler.jsonc). The knowledge platform's
 * Worker owns everything else on the host. cloudflare/assemble.mjs places the
 * export under journal/ so the asset paths equal the public paths.
 *
 * Security headers are NOT declared here: `headers()` does not apply to an
 * export. They come from cloudflare/security-headers.mjs, written into the
 * deployed `_headers` file. The platform's headers never reach /journal — the
 * two Workers are separate — so this project still sets its own.
 */
const nextConfig = {
  output: 'export',
  basePath: '/journal',
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: import.meta.dirname,
  // The canonical form of every Journal URL has no trailing slash, matching the
  // main platform. The deployed _redirects file sends any trailing-slash form,
  // including /journal/, to it with a 308.
  trailingSlash: false,
};

export default nextConfig;
