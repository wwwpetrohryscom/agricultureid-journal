---
slug: wheat-in-the-official-record
title: Wheat, as the official record holds it
subtitle: What nine kinds of source say about one crop, and where they stop
description: Wheat appears in cost forecasts, variety registers, plant health listings, trade statistics and soil surveys. Each holds a different wheat. This is an editorial tour of what the official record actually contains — not a replacement for the crop entry.
section: crops
publicationType: CROP_FEATURE
status: PUBLISHED
featured: true
datePublished: '2026-09-01'
authors: [agricultureid-editorial]
tags: [wheat, sources, official data]
summary: The canonical AgricultureID entry describes what wheat is. This piece describes something different — what the official record can and cannot tell you about it, and why the answer depends entirely on which register you ask.
keyPoints:
  - USDA forecasts wheat at $419.41 per planted acre in 2026, the lowest of nine field crops it covers.
  - Variety registers publish durum wheat at species rank where the corpus uses subspecies rank — one documented equivalence, not a fuzzy rule.
  - No single source holds "wheat". Nine hold different slices, defined differently.
sources:
  - id: ers-cop-wheat
    title: Commodity Costs and Returns
    organization: United States Department of Agriculture — Economic Research Service
    url: https://www.ers.usda.gov/data-products/commodity-costs-and-returns
    sourceType: STATISTICS_AGENCY
    accessedAt: '2026-08-27'
    supports: Forecast total and operating costs per planted acre for wheat, 2026.
  - id: faostat-wheat
    title: FAOSTAT
    organization: Food and Agriculture Organization of the United Nations
    url: https://www.fao.org/faostat/en/#data
    sourceType: INTERGOVERNMENTAL
    accessedAt: '2026-08-27'
    supports: Production, trade and producer price series for wheat by reporting country.
related:
  crops: [wheat]
  commodities: []
---

The AgricultureID entry for wheat is the canonical account: what the crop is, how
it grows, what it needs, what it is affected by. This piece is not that, and is
deliberately not a summary of it. It is about the sources — what the official
record holds on wheat, and how differently each part of it is defined.

Ask nine sources about wheat and you get nine different objects.

## The economics source holds a forecast

USDA's Economic Research Service forecasts total listed costs for wheat at
**$419.41 per planted acre** in 2026, of which $169.08 is operating cost. That is
the lowest total of the nine field crops ERS covers — below barley ($526.92),
soybean ($683.89) and maize ($935.79).

Three qualifications travel with that number and are usually stripped off it. It
is a forecast for a year that has not finished. It is a United States national
average, and ERS publishes regional breakdowns separately. And it is a cost with
no revenue beside it, so nothing about margin follows from it.

## The variety registers hold a name problem

Official plant variety registers publish wheat varieties by denomination. They
also publish strawberry, bean and ryegrass varieties by denomination, and the
denominations collide: in United Kingdom plant breeder's rights, the bread wheat
name "Cadenza" returns a granted right for a strawberry. Across four registers,
57% of exact name matches to a cultivar belonged to a different botanical species.

There is a second, quieter problem specific to wheat. Registers publish durum at
species rank as _Triticum durum_ Desf.; the corpus uses subspecies rank,
_Triticum turgidum_ subsp. _durum_. Both are correct. A matcher that does not
know they are the same plant discards genuine registrations, and one that guesses
too freely re-opens the homonym door. AgricultureID handles it as a single
written-down equivalence.

## The trade sources hold two different wheats

Wheat crosses a border twice in the statistics: once as the exporter records it,
once as the importer does. The two figures differ, and the difference is not
error. They are measured at different borders, at different times, with different
valuations, and often under different commodity codes after a classification
revision.

Where a reporting country did not report at all, the absence is not a zero — a
gap in a trade matrix is a gap, and filling it with zero manufactures a claim
that no wheat moved.

## The plant health sources hold a list of what to keep out

Wheat appears in quarantine and regulated-pest listings, which are statements
about what an authority has decided to regulate in its territory. A pest
recommended for regulation in a region is not a pest present in a country, and a
listing is not a report of an outbreak. These are three different claims that use
overlapping vocabulary.

## The soil surveys hold something that is not about wheat at all

A soil survey records what a mapped soil body is like. It says nothing about
wheat. The connection between a soil's drainage class and a wheat crop's
performance is agronomy, and it is real, and it is not in the survey — a survey
that appeared to say "good for wheat" would be a reader's inference wearing an
official source's authority.

## What this adds up to

There is no source that holds "wheat". There are sources that hold a forecast
cost, a set of registered denominations, two asymmetric trade flows, a regulatory
list, and a soil description that a person connects to wheat.

The canonical AgricultureID entry is where the crop itself is described. What the
Journal can add is this: a sense of which question each source can actually
answer, so that a figure quoted from one of them is quoted for the thing it
measures.
