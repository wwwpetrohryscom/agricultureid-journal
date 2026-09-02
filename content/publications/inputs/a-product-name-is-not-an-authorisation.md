---
slug: a-product-name-is-not-an-authorisation
title: A product name is not an authorisation
subtitle: Why AgricultureID will not tell you whether you can use a plant protection product
description: A pesticide product's name, its active substance and its authorisation are three different things, and only one of them decides whether the product may be used on your crop in your country.
section: inputs
publicationType: ARTICLE
status: PUBLISHED
featured: true
datePublished: '2026-09-01'
authors: [agricultureid-editorial]
tags: [plant protection, registers, authorisation]
summary: AgricultureID holds 43,591 input authorisations read from official registers. It still will not answer "can I spray this", and the reason is in how the registers themselves are structured.
keyPoints:
  - An active substance approved at EU level is not a product authorised in a member state.
  - The same brand name can be a different product, with different terms, in each country.
  - An authorisation is specific to a crop, a pest, a rate and a set of conditions the register holds and a name does not.
sources:
  - id: eu-1107-2009
    title: Regulation (EC) No 1107/2009 concerning the placing of plant protection products on the market
    organization: European Union
    url: https://eur-lex.europa.eu/eli/reg/2009/1107/oj
    sourceType: GOVERNMENT
    accessedAt: '2026-08-27'
    supports: Article 28(1) — a plant protection product shall not be placed on the market or used unless it has been authorised in the member state concerned.
related:
  registries: []
---

AgricultureID has read 43,591 authorisation records out of official plant
protection registers. It is one of the larger things the platform holds. It is
also the layer we are most careful about, because the question people arrive
with — _can I use this product on this crop_ — is one the data cannot answer,
and answering it anyway would be the most dangerous thing the platform could do.

## Three things that are not each other

**An active substance** is a chemical. In the European Union it is approved, or
not approved, at Union level under Regulation (EC) No 1107/2009. Approval means
the substance may be used in products — it does not put a single product on a
single shelf.

**A product** is a formulation containing one or more active substances, sold
under a brand name. Products are authorised nationally. Article 28(1) of the same
regulation is explicit: a plant protection product shall not be placed on the
market or used unless it has been authorised in the member state concerned.

**An authorisation** is a national decision about a specific product, listing the
crops it may be used on, the pests it may be used against, the maximum rate, the
number of applications, intervals, buffer zones and conditions. Two countries can
authorise the same product with materially different terms. One can withdraw it
while the other renews it.

A product name carries none of that. It is a label on a can.

## The name is not even stable

The registers make this concrete. The same brand name recurs across countries
attached to different formulations, and across time attached to different active
substances after a reformulation. A search that matched on name alone would
return records that are genuinely about different things, each looking equally
official, each carrying a real register identifier.

We hit the same trap in a different layer with variety names — where 57% of exact
name matches across official registers turned out to be different botanical
species — and the lesson transferred: match on the identifier the register uses,
never on the name a human recognises.

## What AgricultureID does instead

The platform records which authority operates which register, what a register
publishes, and what a given record says on the date it was read. It links to the
official record. It does not restate the conditions of use, and it does not
compute whether a use is permitted.

That is a real limitation and we would rather state it than blur it. The register
is the authority. A page that summarised an authorisation into "approved for
cereals" would be wrong in ways that matter — the omitted rate, the omitted
interval, the omitted buffer zone — and would be wrong while looking helpful.

If you need to know whether you may use a product, the answer is in the national
register, on the label, and nowhere else. AgricultureID's job is to tell you
which register, and to be honest that it is not a substitute for it.
