---
slug: welcome-to-agricultureid-journal
title: Welcome to AgricultureID Journal
subtitle: An editorial layer for a platform built on refusing to guess
description: AgricultureID Journal publishes news, features, market briefs, research notes, data notes and regulatory updates on agriculture — each sourced to the official record and linked to the structured knowledge base.
section: agricultureid
publicationType: AGRICULTUREID_UPDATE
status: PUBLISHED
lead: true
featured: true
datePublished: '2026-09-01'
authors: [agricultureid-editorial]
tags: [about, editorial]
summary: The AgricultureID knowledge base answers what is true of a crop, an authority or a register. It cannot answer what changed this week, why two official sources disagree, or what a number actually means. That is what the Journal is for.
keyPoints:
  - The Journal is a separate application on the same domain, so publishing an article never rebuilds the knowledge base.
  - Every publication carries its format, and the format decides what it must prove.
  - Editorial items link into canonical entities rather than restating them.
related:
  datasets: []
---

AgricultureID holds 1,068 structured entities across 27 content types, drawn
from 213 catalogued sources and served over 1,571 routes. It can tell you what
species a cultivar belongs to, which authority operates a plant health register,
what a soil survey recorded for a mapped soil body, and what a statistical agency
published for the cost of growing maize.

What it cannot do is tell you what happened.

A knowledge base is a description of a state. It is deliberately not a narrative,
and every time we have been tempted to make it one — to add a "recent changes"
paragraph to an entity page, to explain in prose why two registers disagree about
a variety — the result has been worse on both counts. The entity page became
harder to read, and the explanation got buried where nobody looking for it would
find it.

So the explanations live here instead.

## What this publishes

The Journal is not a blog with one kind of post in it. It has formats, and the
format is a claim about what the item is:

A **market brief** reports what a statistical agency released, in the agency's own
terms, with forecasts labelled as forecasts. A **research note** reports what one
study found, and says whether it was peer reviewed. A **regulatory update** reports
what a rule now says and, critically, whether it is in force. A **data note**
explains a dataset release or a methodology change. A **crop feature** puts
production, seasons and official data in context around a crop — without
restating the encyclopedia entry, which remains the canonical account.

Each format carries different obligations, and the validator enforces them. A
regulatory update that does not state its stage does not build. A market brief
without a source does not build.

## What it will not do

It will not manufacture news out of evergreen material. An explanation of how
growing degree days are computed is useful, and it is not news, and dating it as
though it were would be a small dishonesty compounded every time it happened.

It will not turn one study into a consensus.

It will not present a forecast as an observation. The main platform holds 24,916
farm economics figures and publishes no gross margin, no net return and no
break-even price, because every one of those needs revenue and no source we hold
carries any. The Journal operates under the same rule: where a number is a
scenario, the page says so beside the number.

And it will not tell you what a drought cost a farm. We can tell you that a state
was assessed as wholly in drought in a given week, because an official assessment
says so. What that did to a particular field depends on crop stage, soil moisture,
irrigation and management, and the step from exposure to damage is the entire
claim. We do not take it.

## How it is built

The Journal is a separate application, deployed independently, served at
`agricultureid.com/journal` through a proxy on the main project. That is an
architectural decision with an editorial reason: publishing an article should not
rebuild a knowledge base, and — more importantly — a data problem in the corpus
should never be able to block a correction to a published article.

Corrections are an obligation with a clock on them. They do not queue behind
anything.
