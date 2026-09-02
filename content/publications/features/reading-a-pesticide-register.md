---
slug: reading-a-pesticide-register
title: What 43,591 authorisations look like when you read the registers
subtitle: Official plant protection registers are not lists of approved products, and reading them as though they were is the commonest mistake in the field
description: AgricultureID has ingested 43,591 plant protection authorisations from official national registers. The structure of what those registers publish explains why "is this product approved" has no general answer.
section: features
publicationType: FEATURE
status: PUBLISHED
datePublished: '2026-09-01'
authors: [agricultureid-editorial]
tags: [plant protection, registers, europe, methodology]
summary: A register entry is a decision about one product, in one country, for named uses, under stated conditions, on a stated date. Almost every part of that sentence is dropped when the data is summarised.
keyPoints:
  - The unit of an authorisation is a product-in-a-country, not a substance and not a brand.
  - Withdrawal usually comes with a grace period, so "withdrawn" and "cannot be used today" are different states.
  - Registers publish in their own languages and their own identifier schemes, and neither normalises cleanly.
sources:
  - id: eu-pesticides-db
    title: EU Pesticides Database
    organization: European Commission
    url: https://food.ec.europa.eu/plants/pesticides/eu-pesticides-database_en
    sourceType: OFFICIAL_REGISTER
    accessedAt: '2026-08-27'
    supports: Union-level approval status of active substances, distinct from national product authorisations.
related:
  registries: []
---

Plant protection registers are the most consulted agricultural data in Europe and
among the most misread. AgricultureID has ingested 43,591 authorisation records
from official national registers, and what follows is less about the records than
about the shape of the thing they came from.

## The unit is smaller than people expect

A register entry is not "product X is approved". It is: this specific formulated
product, from this authorisation holder, in this country, may be used on this
list of crops, against this list of targets, at up to this rate, this many times,
with these intervals and these conditions, from this date, under this
authorisation number.

Every clause in that sentence is load-bearing. A summary that keeps the product
name and the word "authorised" and drops the rest is not a shorter true
statement; it is a different statement, and one that can lead directly to an
illegal application.

## Approval and authorisation are different layers

At Union level, active substances are approved under Regulation (EC) No
1107/2009. Nationally, products containing them are authorised. Article 28(1) of
the regulation says a product shall not be placed on the market or used unless it
has been authorised in the member state concerned.

So a substance can be approved across the Union while a product containing it is
authorised in six member states, refused in two, and never applied for in the
rest. "Approved in the EU" is a statement about the middle layer only.

## Withdrawn does not mean gone

When an authorisation is withdrawn, the decision usually carries a grace period:
a final date for sale and distribution, and a later final date for disposal,
storage and use. Between those dates a product is withdrawn and legally usable.

A register that shows only a status flag flattens three distinct states — current,
in grace period, expired — into two. AgricultureID records the dates the register
publishes rather than a derived flag, because the derived flag is where the
information goes missing.

## The registers do not agree on how to say things

They publish in their own languages, with their own identifier schemes, their own
crop nomenclature and their own formulation type codes. None of it normalises
cleanly, and the places where normalisation is _almost_ possible are the
dangerous ones — a crop name that maps to a corpus entity in nine countries and
means something slightly wider in the tenth.

Where a mapping is not certain, AgricultureID keeps the register's own words.
That makes some pages less tidy and keeps them answerable to the source.

## What we do not publish

We do not publish a shortlist of products for a crop and a pest. The register
holds the conditions that decide whether a given use is lawful, those conditions
are specific to a place, and a shortlist that omitted them would be actively
harmful while looking like exactly the thing a user came for.

What the platform publishes is which register is authoritative for a country,
what it contains, when a record was read, and a link to the record. The register
is the answer. Our job is to be a reliable index of where the answer lives — and
to be honest that an index is not the thing indexed.
