/**
 * SEO and identity gate, run against the BUILT output.
 *
 * The single most important thing it prevents: the infrastructure hostname
 * leaking into rendered output. The Journal is deployed on a *.netlify.app
 * host and served to the public at agricultureid.com/journal. If that host ever
 * appears in a canonical tag, an Open Graph URL, a feed, a sitemap or a link,
 * the publication becomes indexable twice under two hostnames, competing with
 * itself, and the split-deployment architecture starts leaking through to
 * readers.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/site';

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

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
    else if (/\.(html|body|rsc|json|xml|txt)$/.test(e)) out.push(p);
  }
  return out;
}

const files = walk(OUT);
const html = files.filter((f) => f.endsWith('.html'));

if (html.length === 0) fail('the build produced no HTML pages');

/* -- the infrastructure host must not appear anywhere -------------------- */
const INFRA = /[a-z0-9-]+\.netlify\.app/gi;
for (const f of files) {
  const body = readFileSync(f, 'utf8');
  const hits = body.match(INFRA);
  if (hits)
    fail(
      `${f.replace(process.cwd() + '/', '')}: contains the infrastructure hostname ${[...new Set(hits)].join(', ')}`,
    );
}

/* -- every page canonicalises to the public origin under /journal -------- */
for (const f of html) {
  const rel = f.replace(process.cwd() + '/', '');
  const body = readFileSync(f, 'utf8');

  const canonical = body.match(
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i,
  )?.[1];
  if (!canonical) {
    fail(`${rel}: no canonical link`);
  } else {
    if (!canonical.startsWith(`${SITE.origin}${SITE.basePath}`))
      fail(
        `${rel}: canonical "${canonical}" is not under ${SITE.origin}${SITE.basePath}`,
      );
    if (
      canonical.endsWith('/') &&
      canonical !== `${SITE.origin}${SITE.basePath}`
    )
      fail(`${rel}: canonical "${canonical}" has a trailing slash`);
  }

  const title = body.match(/<title>([^<]*)<\/title>/i)?.[1];
  if (!title?.trim()) fail(`${rel}: no title`);
  // The title-suffix-applied-twice defect is NOT checked here. It cannot be
  // distinguished from a legitimate headline by looking at the rendered string:
  // an article titled "Welcome to AgricultureID Journal" produces a page title
  // ending "AgricultureID Journal · AgricultureID Journal", and so does the
  // bug. The invariant lives where it is exact, as a test on buildMetadata's
  // contract in tests/metadata.test.ts.

  // Exactly one h1. A page with none gives a screen-reader user and a crawler
  // no top-level heading; a page with several has no single subject. The front
  // page's is visually hidden because the masthead already shows the name.
  const h1s = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(`${rel}: ${h1s} h1 elements`);

  const desc = body.match(
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i,
  )?.[1];
  if (!desc?.trim()) fail(`${rel}: no meta description`);

  // The publication must be identifiable as the Journal, not as a blog.
  if (/AgricultureID Blog/i.test(body))
    fail(`${rel}: calls the publication a blog`);

  // Assets must be namespaced. An un-prefixed /_next/ URL would be fetched
  // from the main platform and 404.
  const bad = body.match(/(?:src|href)="\/_next\//g);
  if (bad)
    fail(
      `${rel}: ${bad.length} asset URL(s) at /_next/ rather than ${SITE.basePath}/_next/ — basePath is not applied`,
    );
}

/* -- structured data ------------------------------------------------------ */
{
  const withLd = html.filter((f) =>
    /application\/ld\+json/.test(readFileSync(f, 'utf8')),
  );
  if (withLd.length === 0) fail('no page carries structured data');
  let news = 0;
  let article = 0;
  for (const f of withLd) {
    const body = readFileSync(f, 'utf8');
    news += (body.match(/"NewsArticle"/g) ?? []).length;
    article += (body.match(/"Article"/g) ?? []).length;
  }
  // If everything is NewsArticle, the mapping has stopped being semantic.
  if (news > 0 && article === 0)
    fail(
      'every structured-data item is a NewsArticle; the mapping is not semantic',
    );
}

/* -- feeds and sitemap use public URLs ------------------------------------- */
for (const name of ['rss.xml', 'atom.xml', 'feed.json', 'sitemap.xml']) {
  const candidates = files.filter((f) => f.includes(name));
  if (candidates.length === 0) {
    fail(`${name} was not emitted`);
    continue;
  }
  // The Next.js runtime writes a route handler's output as `<name>.body` with
  // a `<name>.meta` sidecar. Requiring the URL in every candidate would demand
  // it of the headers file too, so the check is that at least one of them —
  // the one carrying the payload — has it.
  const carrying = candidates.filter((f) =>
    readFileSync(f, 'utf8').includes(`${SITE.origin}${SITE.basePath}`),
  );
  if (carrying.length === 0)
    fail(
      `${name}: no emitted file carries a ${SITE.origin}${SITE.basePath} URL`,
    );
}

console.log('\nAgricultureID Journal — SEO and identity validation\n');
console.log(`  Files scanned:     ${files.length}`);
console.log(`  HTML pages:        ${html.length}`);
console.log(
  `  Infrastructure host in output: ${errors.some((e) => e.includes('infrastructure hostname')) ? 'YES' : 'none'}`,
);

if (errors.length) {
  console.error(`\n  FAILED — ${errors.length} error(s):\n`);
  for (const e of errors.slice(0, 30)) console.error(`    ✗ ${e}`);
  process.exit(1);
}
console.log('\n  ✓ SEO and identity validation passed.\n');
