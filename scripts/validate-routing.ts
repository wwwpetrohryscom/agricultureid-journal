/**
 * Routing gate, run against the BUILT output.
 *
 * The Journal is only correct if every URL it emits already begins with
 * /journal. The main platform forwards that prefix and forwards nothing else,
 * so an un-prefixed URL is not a cosmetic problem — it is a request that lands
 * on the knowledge platform and 404s, and it will do so only in production,
 * because in local development both applications are the same server.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/site';

const errors: string[] = [];
const fail = (m: string) => errors.push(m);
const BASE = SITE.basePath;

/* -- the configuration that makes it work --------------------------------- */
{
  const cfg = readFileSync(join(process.cwd(), 'next.config.mjs'), 'utf8');
  if (!new RegExp(`basePath:\\s*['"]${BASE}['"]`).test(cfg))
    fail(`next.config.mjs does not set basePath to "${BASE}"`);
  // assetPrefix serves assets from a DIFFERENT origin. Setting it alongside
  // basePath produces double-prefixed URLs that 404 like a caching problem.
  if (/^\s*assetPrefix\s*:/m.test(cfg))
    fail(
      'next.config.mjs sets assetPrefix, which conflicts with basePath here',
    );
  if (!/trailingSlash:\s*false/.test(cfg))
    fail('next.config.mjs does not set trailingSlash: false');
  // A static export: nothing renders on request, so nothing can read a
  // request header or a query string on the server.
  if (!/output:\s*['"]export['"]/.test(cfg))
    fail("next.config.mjs does not set output: 'export'");
}

/* -- the deployment configuration ------------------------------------------ */
{
  // /journal is served by its own Worker, so the knowledge platform's headers
  // never apply to these responses. This project must set its own.
  const headers = readFileSync(
    join(process.cwd(), 'cloudflare', 'security-headers.mjs'),
    'utf8',
  );
  for (const h of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Strict-Transport-Security',
  ])
    if (!headers.includes(`'${h}'`))
      fail(`cloudflare/security-headers.mjs does not set ${h}`);

  const wrangler = readFileSync(join(process.cwd(), 'wrangler.jsonc'), 'utf8');
  // Exactly one route, `agricultureid.com/journal*`. Route patterns are
  // matched against the query string as well as the path, so an exact
  // `agricultureid.com/journal` route misses /journal?utm_source=… and that
  // request falls through to the platform's 404. `journal*` is the narrowest
  // pattern that catches /journal with and without a query and everything
  // below it.
  const routes = [...wrangler.matchAll(/"pattern":\s*"([^"]+)"/g)].map(
    (m) => m[1],
  );
  const expected = [`agricultureid.com${BASE}*`];
  if (JSON.stringify(routes) !== JSON.stringify(expected))
    fail(
      `wrangler.jsonc routes are ${JSON.stringify(routes)}; expected exactly ${JSON.stringify(expected)}`,
    );
  // Assets only. A Worker script here could proxy or rewrite; the Journal
  // serves its own files and nothing else.
  if (/^\s*"main"\s*:/m.test(wrangler))
    fail('wrangler.jsonc declares a Worker script; the Journal is assets-only');
  if (!/"directory":\s*"\.\/dist"/.test(wrangler))
    fail('wrangler.jsonc does not serve ./dist (cloudflare/assemble.mjs)');
}

/* -- the deployed output -------------------------------------------------- */
// dist/ is what the Worker serves (cloudflare/assemble.mjs): the export under
// dist/journal/, the front page at dist/journal.html.
const DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.error('No deploy output at dist/ — run `npm run build` first.');
  process.exit(1);
}
const OUT = join(DIST, BASE.slice(1));

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const html = walk(DIST);
if (html.length === 0) fail('the build produced no HTML pages');

// The front page must be a FILE beside the directory, not its index: the asset
// handler answers a directory index at /journal/ and would redirect the
// canonical /journal there.
if (!existsSync(join(DIST, `${BASE.slice(1)}.html`)))
  fail(
    `dist has no ${BASE.slice(1)}.html — the front page would not be served at ${BASE}`,
  );
if (existsSync(join(OUT, 'index.html')))
  fail(`dist${BASE}/index.html exists — ${BASE} would redirect to ${BASE}/`);

const redirects = existsSync(join(DIST, '_redirects'))
  ? readFileSync(join(DIST, '_redirects'), 'utf8')
  : '';
if (!/^\/\*\/ \/:splat 308$/m.test(redirects))
  fail(
    'dist/_redirects does not 308 trailing-slash URLs to the canonical form',
  );
const deployedHeaders = existsSync(join(DIST, '_headers'))
  ? readFileSync(join(DIST, '_headers'), 'utf8')
  : '';
if (!deployedHeaders.includes('Strict-Transport-Security'))
  fail('dist/_headers carries no security headers');

/**
 * Every internal URL must be prefixed.
 *
 * Only absolute-path URLs are checked. A root-relative URL is the one that
 * silently escapes the namespace; an external https:// URL is fine, and a
 * fragment or a mailto is not a route.
 */
for (const f of html) {
  const rel = f.replace(process.cwd() + '/', '');
  const body = readFileSync(f, 'utf8');
  const urls = [...body.matchAll(/(?:href|src)="(\/[^"]*)"/g)].map(
    (m) => m[1]!,
  );
  const escaped = urls.filter(
    (u) => !u.startsWith(`${BASE}/`) && u !== BASE && u !== '/',
  );
  if (escaped.length)
    fail(
      `${rel}: ${escaped.length} internal URL(s) outside ${BASE} — e.g. ${[...new Set(escaped)].slice(0, 3).join(', ')}`,
    );
}

/* -- the routes that must exist -------------------------------------------- */
const REQUIRED = [
  `${BASE.slice(1)}.html`,
  `${BASE.slice(1)}/search.html`,
  `${BASE.slice(1)}/editorial-policy.html`,
  `${BASE.slice(1)}/sourcing-policy.html`,
  `${BASE.slice(1)}/corrections.html`,
  `${BASE.slice(1)}/404.html`,
  '404.html',
];
for (const r of REQUIRED) {
  if (!existsSync(join(DIST, r))) fail(`the build emitted no ${r}`);
}

const ENDPOINTS = [
  'rss.xml',
  'atom.xml',
  'feed.json',
  'sitemap.xml',
  'latest.json',
  'search-index.json',
];
for (const e of ENDPOINTS)
  if (!existsSync(join(OUT, e))) fail(`the build emitted no ${BASE}/${e}`);

console.log('\nAgricultureID Journal — routing validation\n');
console.log(`  basePath:          ${BASE}`);
console.log(`  HTML pages:        ${html.length}`);
console.log(`  Required routes:   ${REQUIRED.length} checked`);
console.log(`  Endpoints:         ${ENDPOINTS.length} checked`);

if (errors.length) {
  console.error(`\n  FAILED — ${errors.length} error(s):\n`);
  for (const e of errors.slice(0, 30)) console.error(`    ✗ ${e}`);
  process.exit(1);
}
console.log('\n  ✓ Routing validation passed.\n');
