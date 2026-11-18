# AgricultureID Journal

The editorial layer of [AgricultureID](https://agricultureid.com), published at
**https://agricultureid.com/journal**.

This is a separate application and a separate Cloudflare Worker
(`agricultureid-journal`) from the AgricultureID knowledge platform. They share
one public hostname and nothing else: publishing an article here does not
rebuild the knowledge base, and a change to the knowledge base does not rebuild
this.

## How it is served

The `agricultureid.com` Cloudflare zone routes `/journal` and `/journal/*` to
this project's Worker and everything else to the platform's. This project sets
`basePath: "/journal"` and is a static export; `cloudflare/assemble.mjs` places
the export under `dist/journal/` so file paths equal public paths, and
`npx wrangler@4 deploy` publishes `dist/`. The Worker's `*.workers.dev`
hostname is infrastructure, and `validate:seo` fails the build if it (or the
retired `*.netlify.app` one) ever reaches the output.

Publishing steps: `docs/journal-publishing-workflow.md`. The architecture
decision (why a path on the same host) is in the main repository at
`docs/journal-routing-architecture.md`, and its Cloudflare form in
`docs/cloudflare-deployment.md` there.

## Commands

```
npm run validate:journal   editorial gate — offline, no build needed
npm run build              production build → dist/ (runs the editorial gate first)
npm run validate:seo       identity and SEO gate, against dist/
npm run validate:routing   routing and deploy-config gate, against dist/
npm run validate           all of the above, in order
```

## Publishing

See `docs/journal-publishing-workflow.md`.

## What this is not

Not a blog. It publishes seventeen editorial formats, and the format is a claim
about what an item is: a market brief labels forecasts as forecasts, a research
note says whether a study was peer reviewed, a regulatory update says whether
the rule is in force. The validator enforces those obligations.
