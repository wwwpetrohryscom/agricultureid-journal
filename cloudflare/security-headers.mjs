/**
 * Security headers for every response under agricultureid.com/journal.
 *
 * The SINGLE source for this project. The Journal is a static export, so
 * Next's `headers()` does not apply; cloudflare/assemble.mjs writes these into
 * `dist/_headers`, which Cloudflare's static-asset handler applies to every
 * response it serves.
 *
 * /journal is served by its own Worker, so the knowledge platform's headers
 * never reach it — this project must set its own, and validate:routing fails
 * the build if it stops doing so. The set is identical to the platform's
 * (agricultureid repository, cloudflare/security-headers.mjs), unchanged from
 * the Netlify era.
 */
export const SECURITY_HEADERS = [
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
