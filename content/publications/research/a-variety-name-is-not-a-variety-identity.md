---
slug: a-variety-name-is-not-a-variety-identity
title: A variety name is not a variety identity
subtitle: 57% of exact name matches across official plant variety registers were a different species
description: Variety denominations are unique only within a species group. Matching official register entries by name alone produced wrong records more often than right ones — and each wrong record carried a real register identifier.
section: research
publicationType: RESEARCH_NOTE
researchKind: OBSERVATIONAL
status: PUBLISHED
featured: true
datePublished: '2026-09-01'
authors: [agricultureid-data]
tags: [varieties, registers, identity, methodology]
summary: When AgricultureID matched cultivars against four official variety registers, 24 of 42 exact name matches belonged to a different botanical species. The wheat "Cadenza" returned a granted right for a strawberry.
keyPoints:
  - Denominations are unique within a species group, not globally.
  - Every register examined reproduced the trap independently.
  - The fix is to match on denomination AND the register's own species field, never on name alone.
sources:
  - id: upov-denomination
    title: UPOV Convention, Article 20 — variety denomination
    organization: International Union for the Protection of New Varieties of Plants
    url: https://www.upov.int/upovlex/en/conventions/1991/act1991.html
    sourceType: INTERGOVERNMENTAL
    accessedAt: '2026-08-27'
    supports: The requirement that a variety be designated by a denomination, and the framework within which denominations are unique.
related:
  cultivars: []
---

This is a note about a matching problem that looks solved and is not.

Official plant variety registers publish a denomination — the variety's
registered name — alongside a species, a holder, a status and dates. If a corpus
holds a cultivar called "Cadenza" and a register holds an entry called "Cadenza",
it is tempting to treat them as the same variety. The names match exactly. The
register is authoritative.

## What the registers actually returned

Across four official registers — Great Britain and Northern Ireland variety
lists, the Canadian register of varieties of crop kinds, United States plant
variety protection, and Australian plant breeder's rights — 42 entries matched a
cultivar name exactly.

Eighteen were the same variety. Twenty-four, or 57%, were a different botanical
species:

| Register           | Name matched          | What the register actually held       |
| ------------------ | --------------------- | ------------------------------------- |
| United Kingdom PBR | Cadenza (bread wheat) | _Fragaria_ × _ananassa_, a strawberry |
| United States      | McIntosh (apple)      | _Triticum aestivum_, a common wheat   |
| United States      | Roma (tomato)         | _Phaseolus vulgaris_, a garden bean   |
| United States      | Gala (apple)          | an onion, a tall fescue and a potato  |
| United States      | Marquis (wheat)       | _Phaseolus vulgaris_                  |
| United Kingdom     | Riesling (grape)      | _Solanum lycopersicum_, a tomato      |
| United Kingdom     | Carmel (almond)       | _Spinacia oleracea_, a spinach        |

Every register reproduced the trap independently. It is not a quirk of one
system's data entry.

## Why this happens

Variety denominations are required to be unique, but the scope of that
requirement is a species group — not the whole of botany. "Roma" may be a tomato
in one group and a bean in another without any rule being broken. The registers
are behaving correctly. It is the name-only matcher that is wrong.

What makes the error dangerous is that it is _convincing_. A false match is not
obviously junk: it carries a real register identifier, a real country, a real
grant date and a real status. Published without checking the species, it looks
exactly like a verified record.

## The correction, and a second one

Match on the denomination **and** the register's own species field. AgricultureID
now records the register's species verbatim alongside every registration, and the
match basis vocabulary has exactly one member, so a weaker basis cannot be named
and then quietly used.

Reviewing the rejected pairs individually surfaced the opposite error too: two
genuine matches had been discarded because the register publishes durum wheat at
species rank as _Triticum durum_ Desf. where the corpus uses subspecies rank,
_Triticum turgidum_ subsp. _durum_. That is one documented taxonomic equivalence,
written down as an exception — not a fuzzy rule, because a fuzzy rule would
re-open the door the species check just closed.

## What this means for reading any variety claim

If a source tells you a variety is registered somewhere, the useful question is
not whether the name matches. It is which species the register says the entry is
for. Where AgricultureID cannot answer that, it publishes no registration at all —
128 of 251 candidate matches were discarded on this basis in an earlier pass, and
the discard list is the part of that work we would defend hardest.
