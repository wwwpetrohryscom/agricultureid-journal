# Publishing to AgricultureID Journal

## What publishing is

Adding or editing one Markdown file under `content/publications/<section>/`,
committing it, and merging to `main`. Netlify builds this project and nothing
else. The AgricultureID knowledge platform does not rebuild, its deploy history
is untouched, and a data gate failing over there cannot block a publication or a
correction over here.

## Steps

1. Create `content/publications/<section>/<slug>.md`.
2. Write the frontmatter. The required fields are `slug`, `title`,
   `description`, `section`, `publicationType`, `status`, `authors`,
   `datePublished` and `summary`; the format decides what else is required.
3. Write the body in Markdown.
4. `npm run validate:journal` — fast, offline, no build needed.
5. Commit and open a pull request. Netlify builds a deploy preview.
6. Merge. The item is live at `agricultureid.com/journal/<section>/<slug>`.

## What the format obliges you to supply

| Format                                                                                                                                                | Must also carry                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `REGULATORY_UPDATE`                                                                                                                                   | `regulatoryStage` — proposal, consultation, adopted, in force, superseded, guidance or decision   |
| `RESEARCH_NOTE`                                                                                                                                       | `researchKind` — preprint, peer reviewed, observational, experimental, modelled, official release |
| `MARKET_BRIEF`, `DATA_NOTE`                                                                                                                           | `dataNature` — observed, estimated, revised, provisional or forecast                              |
| `NEWS`, `MARKET_BRIEF`, `REGULATORY_UPDATE`, `POLICY_UPDATE`, `RESEARCH_NOTE`, `DATA_NOTE`, `INPUT_UPDATE`, `CLIMATE_BRIEF`, `ANALYSIS`, `CORRECTION` | at least one entry in `sources`                                                                   |
| any item with `heroImage`                                                                                                                             | `heroAlt`, and `heroCredit` or `heroSource`                                                       |

## Editorial states

```
DRAFT  REVIEW  SCHEDULED         →  not public at all
PUBLISHED  UPDATED  CORRECTED    →  public, in feeds, on the front page
ARCHIVED                         →  public URL kept working, out of feeds
```

A `SCHEDULED` item must be dated in the future and becomes public on the first
build on or after its date. That is deliberate: publication is a decision
somebody takes, not a clock that fires unattended.

## Correcting a published item

Do not overwrite. Add an entry to `correctionHistory` with the date and what was
wrong, set `status: CORRECTED`, set `dateModified`. The correction appears on the
item and on `/journal/corrections`, which is derived from the items themselves —
so a correction cannot be recorded on an item and fail to appear on the register,
and the register cannot list one that is not on the item.

`updateHistory` is for additions. `correctionHistory` is for errors. They are
different admissions and are kept apart.

## Linking into the knowledge base

Use the typed `related` fields, not links written into the prose:

```yaml
related:
  crops: [wheat, maize]
  registries: [eu-pesticides-database]
```

`validate:journal` checks crop, cultivar, livestock and commodity slugs against
`data/entity-manifest.json`, a 12 kB projection of the corpus. A slug that is not
an entity fails the build.

**Regenerating the manifest** — after the knowledge base adds entities, run from
the main repository a small script that writes `crops`, `cultivars`, `livestock`,
`commodities`, `authorities` and `registries` slug arrays into
`../agricultureid-journal/data/entity-manifest.json`.

This is the only coupling between the two repositories, it is a checked-in file
rather than a build-time import, and it goes stale safely: a stale manifest can
only reject a link to a brand-new entity, never accept a wrong one.

## Two YAML traps

A value containing `: ` becomes a mapping unless it is quoted:

```yaml
keyPoints:
  - 'Nine of eleven holes were the same shape: form checked, meaning missed.'
```

A value that _starts_ with a quote character must be quoted as a whole. Both
cases are caught by `validate:journal` naming the file, rather than by the build
with a React error that names nothing.

## Telling search engines about a new publication

IndexNow keys are validated at the **host** root, and the Journal shares a host
with the knowledge platform. The existing key file at
`https://agricultureid.com/8f700117e33b46399992b313b729d2ce.txt` therefore
already authorises submissions for `https://agricultureid.com/journal/...` — no
second key, no key file in this repository, and nothing to add to the main
project.

That is a property of the path-based architecture. A Journal on
`journal.agricultureid.com` would have been a different host and would have
needed its own key file, served by this deployment, with its own rotation.

Submit only canonical `agricultureid.com/journal/...` URLs. Never the
`*.netlify.app` origin — it is not a host any search engine should be told
about, and the key would not validate for it in any case.

Submission is a deliberate step taken after a publication is live. Nothing here
submits automatically, and nothing in this repository rebuilds the main project
to do it.

## What is deliberately not automated

There is no crawler, no scheduled generation, and no path from a feed to a
published article. Editorial tooling may assist research and drafting; the
decision to publish is taken by a person merging a pull request.
