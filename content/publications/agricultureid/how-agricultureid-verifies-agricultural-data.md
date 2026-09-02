---
slug: how-agricultureid-verifies-agricultural-data
title: How AgricultureID verifies agricultural data
subtitle: Pinned contracts, injected defects, and the difference between a rule that stops applying and a rule that fails
description: AgricultureID checks its own data by writing per-source contracts that fail closed and then deliberately breaking the corpus to see whether the gates notice. Across four recent data layers, 82 injected defects found 11 holes.
section: agricultureid
publicationType: ARTICLE
status: PUBLISHED
featured: true
datePublished: '2026-09-01'
authors: [agricultureid-data]
tags: [methodology, verification, data quality]
summary: Most data-quality checking asks whether a value looks right. That catches typos and misses the errors that matter, which are values in the correct shape carrying the wrong meaning. Here is what we do instead.
keyPoints:
  - A rule written against one source stops failing — not just stops applying — when a second source arrives without a contract.
  - "Nine of eleven recent gate holes were the same shape: a rule checking a value's form while the error lived in its meaning."
  - Gates are tested by injecting real defects into the real corpus, not by unit-testing the gate.
related:
  datasets: []
---

Every value AgricultureID publishes has to survive a set of automated checks
before it can reach a page. There are 30 of them in the build. This is an
account of what they actually check, because "we validate our data" is a
sentence that means almost nothing.

## The check that does not work

The obvious approach is to describe what a valid value looks like. A date matches
a pattern. A currency is one of a known list. A percentage is between 0 and 100.

These checks are worth having and they catch almost nothing important, because
the errors that matter are not malformed. Consider a certificate record whose
expiry date is stored as 1996-06-28. It is a well-formed ISO date. It is in the
past, so the certificate is expired, and the page says so. Every structural check
passes.

The date was the _grant_ date. The certificate is current.

Nothing about the value's shape was wrong. What was wrong was what it meant, and
a rule that only looks at shape will pass that error forever. We have found this
same failure nine times in eleven recent gate holes, in layers as different as
soil surveys, border requirements, farm economics and climate. It is the single
most reliable defect class we know of.

## Pinned contracts that fail closed

The replacement is to write down, per source, what that source is entitled to
say — and to make an unrecognised source a build failure rather than an
unchecked pass.

The distinction matters more than it sounds. A validation rule written against
one source, with the source's name in it, does not merely stop _applying_ when a
second source arrives. It stops _failing_. The corpus grows, the rule goes quiet,
and nobody notices that the newest data is the least checked.

So each dataset carries a contract: which metrics it may publish, in which units,
in which currencies, at which geographic level, and what kind of statement its
values are. A value whose dataset has no contract fails validation with a message
naming the dataset.

Then the contract itself is checked against the payload. A contract can declare
that a dataset is entirely forecasts; only the data can confirm it. We found that
hole by injecting a row that the source had not marked as a forecast and watching
the gate pass it.

## Breaking the corpus on purpose

A gate that has never failed is a gate nobody has tested. So before a data layer
ships, we inject defects into the real corpus — one at a time, run the real gate,
record whether it noticed, and put the corpus back.

Across the four most recent layers that meant 82 injected defects. 71 were caught
on the first pass. The other 11 were holes, and every one was fixed by making the
rule stricter rather than by adjusting a threshold to let the data through. After
the fixes, all 82 were caught.

Some of what those injections found:

- A currency landing on a price index was being silently dropped rather than
  rejected, because the code that reads indices does not read currencies. The
  data was fine; the _next_ ingest would not have been.
- A geography the corpus could not place as a country, a union or a region was
  publishing anyway under a level meaning "unknown".
- A list of dataset limitations was being checked for length rather than content,
  so a list of empty strings satisfied it.

None of these would have produced an obviously wrong page. That is the point.

## What this does not prove

These are internal-consistency checks. They can prove that a figure matches what
we captured, that a label matches the source's own words, and that a total is
consistent with its components. They cannot prove that the source was right.

Where a source is the only one publishing something, we say so. Where two
official sources disagree, we record the disagreement rather than resolving it —
which is a separate piece, and a harder problem.
