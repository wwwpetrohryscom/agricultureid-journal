---
slug: how-agricultureid-handles-conflicting-official-sources
title: How AgricultureID handles conflicting official sources
subtitle: When two authorities disagree, the disagreement is the finding
description: Official sources contradict each other more often than a knowledge base would like. AgricultureID records the conflict rather than resolving it, and this is why.
section: agricultureid
publicationType: ARTICLE
status: PUBLISHED
datePublished: '2026-09-01'
authors: [agricultureid-data]
tags: [methodology, provenance, sources]
summary: A platform that silently picks a winner between two official sources has invented an authority it does not have. AgricultureID records both, says which it displays and why, and treats the conflict as information.
keyPoints:
  - Picking the "better" source silently manufactures a judgement no source made.
  - Conflicts are usually definitional, not factual — the same word measured differently.
  - Where a conflict cannot be resolved from evidence, nothing is published as certain.
related:
  authorities: []
---

Two official sources disagree. One is a national statistics agency, one is an
intergovernmental body republishing that agency's data. The numbers differ by
four percent. Which one goes on the page?

The tempting answer is "the more authoritative one", and it is wrong twice over.

## Why silent resolution is a fabrication

Choosing between two sourced values produces a third thing: a judgement about
which source is better for this quantity, in this country, in this year. No
source made that judgement. If the page shows one number and cites one source,
the reader is told there is one answer, and the existence of the other is
destroyed.

The reader can no longer tell that this figure is contested. That is information,
and it was in the corpus a moment ago.

## Most conflicts are definitional

When we look at actual disagreements, very few are one source being wrong. Nearly
all are two sources measuring different things under the same word.

Land "equipped for irrigation" and land "actually irrigated" are both irrigation
figures for the same country in the same year, and they are not the same number —
one is infrastructure and one is use. A trade flow recorded by the exporter and
by the importer differ because they are measured at different borders, at
different times, with different valuations. A national average cost figure and a
regional one differ because they cover different farms.

Resolving these by picking a winner does not produce a truer number. It produces
a number whose definition nobody can recover.

## What we do

**Record both, with what each is.** Every value carries its source, its capture,
and the source's own words for what it measures. Where two are held, both are
held.

**Say which is displayed and why.** Where a page must show one figure, the choice
is a stated rule — the reporting country's own statistic over a republication,
for example — not an unstated preference.

**Check the source against itself first.** Many apparent conflicts are ingest
errors. Before recording a disagreement between two sources we verify each
source's internal arithmetic: that a published total equals the published
components, that categorical shares sum to a whole, that a release identifier is
the one the payload carries. A surprising number of "conflicts" disappear here.

**Publish nothing as certain where the conflict is unresolved.** The platform has
a vocabulary for this, and pages use it: verified, partial, and several distinct
kinds of "not yet indexed". A conflict that cannot be resolved from evidence is
not rounded down to silence and not rounded up to a claim.

## The case that made this concrete

FAOSTAT publishes an area called "China" alongside China mainland, Hong Kong SAR,
Macao SAR and Taiwan Province of China — all reported separately. Its value
equals the sum of the four in every one of the 25 series where they coexist.

Read naively, the corpus would have held both the parts and the whole in one
country column, and any total across countries would have counted the same land
twice. There was no conflict of fact here at all. There was a conflict between
what the column looked like — a country — and what one of its rows meant.

That is what most source conflicts turn out to be, and it is why we resolve them
by reading the source more carefully rather than by ranking sources against each
other.
