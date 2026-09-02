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
  // Netlify redirects run BEFORE the Next.js runtime, so the main platform's
  // headers() never applies to these responses. This project must set its own.
  if (!/async headers\(\)/.test(cfg))
    fail(
      'next.config.mjs declares no headers(); proxied responses would carry no security headers, because the main platform never sees them',
    );
}

/* -- the deployment configuration ------------------------------------------ */
{
  const toml = readFileSync(join(process.cwd(), 'netlify.toml'), 'utf8');
  // A production-wide noindex would travel through the proxy and de-index the
  // real agricultureid.com/journal URLs.
  const prodNoindex = /\[\[headers\]\][\s\S]*?X-Robots-Tag/.test(toml);
  if (prodNoindex)
    fail(
      'netlify.toml sets X-Robots-Tag outside a context block; a proxy forwards it and it would de-index the public URLs',
    );
  if (!/context\.deploy-preview\.headers/.test(toml))
    fail('netlify.toml does not de-index deploy previews');
  // This project must never proxy anywhere: internal rewrites are limited to
  // one hop, and the main platform has already spent it.
  if (/status\s*=\s*200/.test(toml))
    fail(
      'netlify.toml contains a 200 rewrite; this project is the proxy TARGET and must not proxy onward — internal rewrites are limited to one hop',
    );
}

/* -- the built output ------------------------------------------------------ */
const OUT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(OUT)) {
  console.error(
    'No build output at .next/server/app — run `next build` first.',
  );
  process.exit(1);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const html = walk(OUT);
if (html.length === 0) fail('the build produced no HTML pages');

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
  'index.html',
  'search.html',
  'editorial-policy.html',
  'sourcing-policy.html',
  'corrections.html',
  '_not-found.html',
];
for (const r of REQUIRED) {
  if (!html.some((f) => f.endsWith(`/${r}`))) fail(`the build emitted no ${r}`);
}

const ENDPOINTS = [
  'rss.xml',
  'atom.xml',
  'feed.json',
  'sitemap.xml',
  'latest.json',
  'search-index.json',
];
function walkAny(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkAny(p, out);
    else out.push(p);
  }
  return out;
}
const everything = walkAny(OUT);
for (const e of ENDPOINTS)
  if (!everything.some((f) => f.includes(e))) fail(`the build emitted no ${e}`);

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
