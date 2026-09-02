# AgricultureID Journal

The editorial layer of [AgricultureID](https://agricultureid.com), published at
**https://agricultureid.com/journal**.

This is a separate application and a separate Netlify project from the
AgricultureID knowledge platform. They share one public hostname and nothing
else: publishing an article here does not rebuild the knowledge base, and a
change to the knowledge base does not rebuild this.

## How it is served

`agricultureid.com/journal/*` is forwarded to this project by a proxy rewrite on
the main project, and this project sets `basePath: "/journal"` so every URL it
emits already begins there. The `*.netlify.app` hostname this deploys to is
infrastructure: it appears in exactly one place in the whole architecture — the
`to =` field of two redirect rules in the main repository — and `validate:seo`
fails the build if it ever reaches rendered output.

The mechanism, the alternatives examined and the evidence are in the main
repository at `docs/journal-routing-architecture.md`.

## Commands

```
npm run validate:journal   editorial gate — offline, no build needed
npm run build              production build (runs the editorial gate first)
npm run validate:seo       identity and SEO gate, against the built output
npm run validate:routing   routing gate, against the built output
npm run validate           all of the above, in order
```

## Publishing

See `docs/journal-publishing-workflow.md`.

## What this is not

Not a blog. It publishes seventeen editorial formats, and the format is a claim
about what an item is: a market brief labels forecasts as forecasts, a research
note says whether a study was peer reviewed, a regulatory update says whether
the rule is in force. The validator enforces those obligations.
