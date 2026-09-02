---
slug: how-to-read-the-drought-monitor
title: How to read the U.S. Drought Monitor
subtitle: Two ways of counting the same map that differ by fifty points
description: The Drought Monitor publishes its area statistics in categorical and cumulative form. For the same state in the same week the two say 43.09% and 90.79%. Knowing which one you have is the whole skill.
section: climate
publicationType: CLIMATE_BRIEF
dataNature: OBSERVED
status: PUBLISHED
datePublished: '2026-09-01'
authors: [agricultureid-data]
tags: [drought, methodology, united states]
geographies: [United States]
summary: The same Drought Monitor map can be read two ways, and the difference is not small. For Nebraska on 25 February 2025 the D1 figure is either 43.09% or 90.79% depending on which form of the statistic you took.
keyPoints:
  - Categorical shares partition the state and sum to 100. Cumulative shares nest and do not.
  - D0 is abnormally dry and is not drought.
  - Each map is valid for one week; outside that week it is history, not the current state.
sources:
  - id: usdm-service
    title: U.S. Drought Monitor — data services
    organization: National Drought Mitigation Center, United States Department of Agriculture and National Oceanic and Atmospheric Administration
    url: https://droughtmonitor.unl.edu/DmData/DataDownload/WebServiceInfo.aspx
    sourceType: GOVERNMENT
    accessedAt: '2026-08-27'
    supports: Categorical and cumulative statistic formats for drought severity area percentages.
related:
  countries: []
---

The U.S. Drought Monitor is the most cited agricultural climate product in the
United States, and it is easy to quote wrongly in two specific ways.

## One: categorical and cumulative are both published

The service offers area statistics in two forms.

**Categorical** means what it says: the share of the state in D1 and no worse.
The categories partition the state, so they sum with the no-category share to
100%.

**Cumulative** means D1 _or worse_. Each category includes every more severe one,
so the shares nest and sum to far more than 100%.

For Nebraska on the map of 25 February 2025, the D1 figure is **43.09%** in
categorical form and **90.79%** in cumulative form. Same map, same week, same
state. A brief that took the cumulative number and described it as "43% of
Nebraska in moderate drought" would be wrong twice: wrong figure, wrong category
meaning.

There is a reliable way to tell which one you have without asking: add the
categories together, including the no-category share. Categorical sums to 100.
Cumulative does not come close. AgricultureID ingests the categorical form and
validates that sum on all 7,000 state-weeks it holds, which is how a mislabelled
ingest would be caught rather than published.

## Two: D0 is not drought

The categories run D0 to D4. D0 is **abnormally dry**, and the Drought Monitor
describes it as a precursor to drought and as a category areas pass through while
recovering. It is not drought.

Across the fifty states in the week of 25 August 2026, counting D0 as drought
would add **22.7 percentage points** to the average state's drought figure. That
is not a rounding difference; it is a different map. California in that week sits
at 13.9% in drought and 51.3% in D0 — fold them together and you have described a
state in widespread drought when the assessment says the opposite.

## And a third: a map has an expiry

Each weekly map states the week it is valid for. Outside that window it is
history — accurate about its week, silent about now.

This sounds obvious and is the most common failure in drought reporting: a figure
lifted from a map published in July, presented in September as the current state
of a drought. AgricultureID's climate layer will only return an assessment as
current if the reference date falls inside that map's own validity window, and a
date outside every window returns nothing rather than the nearest map.

## What it is, finally

The Drought Monitor is an assessment. Each map is drawn by a rotating author who
weighs several drought indicators together with reports from local observers. It
is authoritative and it is a judgement — not an instrument reading and not a
model output. Reporting it as a measurement overstates its precision; dismissing
it as an opinion understates its standing. It is neither.
