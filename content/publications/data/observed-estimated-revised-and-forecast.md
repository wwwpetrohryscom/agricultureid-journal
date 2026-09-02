---
slug: observed-estimated-revised-and-forecast
title: Observed, estimated, revised and forecast
subtitle: Four kinds of agricultural number that look identical on a page
description: Statistical agencies publish observations, estimates, revisions and forecasts in the same tables, in the same columns, in the same units. Telling them apart is not a presentational nicety.
section: data
publicationType: DATA_NOTE
dataNature: OBSERVED
status: PUBLISHED
datePublished: '2026-09-01'
authors: [agricultureid-data]
tags: [methodology, statistics, provenance]
summary: Fewer than 40% of the agricultural water figures AgricultureID holds from FAO are figures a country officially reported. The rest are FAO's own estimates and imputations, flagged in the same column — and the flag is the whole story.
keyPoints:
  - A flag on a value says who produced it, and it travels with the value everywhere.
  - Every USDA ERS cost-of-production figure AgricultureID holds is a forecast, marked F by the source.
  - A number without its kind is not a smaller claim than a number with it. It is a different claim.
sources:
  - id: faostat-rl
    title: 'FAOSTAT — Land, Inputs and Sustainability: Land Use'
    organization: Food and Agriculture Organization of the United Nations
    url: https://www.fao.org/faostat/en/#data/RL
    sourceType: INTERGOVERNMENTAL
    accessedAt: '2026-08-27'
    supports: Per-value flags A (official), E (estimated), I (imputed by a receiving agency), X (from an external organization).
  - id: ers-cop
    title: Commodity Costs and Returns
    organization: United States Department of Agriculture — Economic Research Service
    url: https://www.ers.usda.gov/data-products/commodity-costs-and-returns
    sourceType: STATISTICS_AGENCY
    accessedAt: '2026-08-27'
    supports: Cost-of-production estimates published for forecast years, marked with F.
related:
  datasets: []
---

Open any agricultural statistics table and the numbers look the same. Same
column, same units, same number of decimal places. Some of them are records of
what happened. Some are the agency's best guess at what happened. Some are
guesses at what will happen. Nothing about the typography tells you which.

The agencies do tell you. They tell you in a flag, a footnote or a letter beside
the year, and that marker is routinely the first thing lost when a number is
copied into a chart, a headline or a knowledge base.

## What the flags say

FAO puts a single letter on every value in its land use tables: **A** for an
official value the country reported, **E** for a value FAO estimated, **I** for a
value FAO imputed, **X** for a value taken from another organisation.

Of the 7,074 irrigation figures AgricultureID holds from that source, 2,676 —
38% — carry the A flag. The majority are the agency's own work, published in the
same column, formatted identically.

This is not a criticism of FAO. Estimating and imputing is what a global
statistical agency is for; the alternative to an imputed value is usually a gap
that makes the whole series unusable. The failure would be to reproduce those
values without the flag, at which point a reader has no way to tell a reported
national statistic from a modelled one.

## The letter that changes everything

The USDA Economic Research Service publishes cost-of-production estimates by
crop. AgricultureID holds 306 of them. Every single one is a forecast: the source
labels the years 2026F and 2027F, and the F is the whole of what distinguishes
this dataset from an accounting of what farms actually spent.

Drop the F and the sentence "growing an acre of maize costs \$935.79" becomes a
statement about the world rather than a projection for a year that has not
finished. It reads as a measurement. It is not one.

## Revisions are their own category

A revised figure is neither the original observation nor a new one. Agencies
revise as late returns arrive, and a series that looks stable in one release can
move materially in the next. A corpus that overwrites the old value silently
loses the fact that the number changed — which is often the most interesting
thing about it.

AgricultureID keeps immutable snapshots with checksums, so the previous release
is still there, and change is derived by comparing them rather than asserted.

## What this costs us

Carrying the kind of every number means the platform publishes fewer clean
statements than it could. It means a chart sometimes needs a footnote. It means
we say "the source forecasts" where a competitor says "costs are".

The alternative is a number that is real, sourced, correctly transcribed, and
about something other than what the reader thinks.
