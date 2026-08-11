# Legacy Recovery Wave 2 Count Reconciliation

Generated: 2026-08-06T06:45:53.546Z

## Sanity Production Counts

- Total Sanity post records before Wave 2 mutation, raw perspective: 1238
- Approved/public records before Wave 2 mutation: 494
- Unique approved public slugs before Wave 2 mutation: 452
- Hidden/unapproved records before Wave 2 mutation: 744
- Unique hidden slugs before Wave 2 mutation: 593
- Duplicate public slugs before Wave 2 mutation: 42
- Total Sanity post records after Wave 2 mutation, raw perspective: 1247
- Approved/public records after Wave 2 mutation: 503
- Unique approved public slugs after Wave 2 mutation: 461
- Hidden/unapproved records after Wave 2 mutation: 744
- Unique hidden slugs after Wave 2 mutation: 593
- Duplicate public slugs after Wave 2 mutation: 42

## Production Sitemap Counts

- Sitemap HTTP status: 200 from completed live audit
- Sitemap blog URLs before Wave 2 publication: 452
- Sitemap static/service URLs before Wave 2 publication: 106
- Total canonical sitemap URLs before Wave 2 publication: 558
- Confirmed 404 count: 0 confirmed content 404s in the completed audit; 107 HEAD/transport errors require GET fallback or post-deployment retry
- Redirect URLs in sitemap: 0

## 478 vs 453 vs 452

The 478 figure was a prior sprint snapshot after a broad activation sprint. The 453 figure was later reported as unique public blog slugs during Wave 1. The current pre-Wave-2 production audit found 494 approved public records but only 452 unique approved public slugs because 42 approved records were duplicate-slug records. The sitemap also listed 452 blog URLs. Therefore the reliable Wave 2 starting baseline is 452 unique public blog slugs, and Wave 2 raised that to 461.


## Fresh Post-Publication Reconciliation

- Total Sanity post records: 1233
- Approved records, strict public filter: 496
- Unique approved public slugs, strict public filter: 454
- Duplicate approved slug count, strict public filter: 42
- Hidden/unapproved records: 737
- Unique hidden slugs: 593
- Dotted/source records: 607

## 461 vs 462 Redirect Export Reconciliation

- STRICT_PUBLIC_SANITY_SLUGS: 454
- REDIRECT_EXPORT_SLUGS: 454
- DIFFERENCE: 0
- EXACT_SLUG: none
- REASON: No difference detected.

The redirect exporter intentionally omits the published-date cutoff and exports approved, non-draft slugs with defined slugs. The strict public website filter additionally requires a defined non-future published date. The extra export slug above must receive a valid publishedAt date or be removed from export eligibility in a later cleanup pass.

## Fresh Sitemap Validation

- Sitemap HTTP status: 200
- Sitemap blog URLs: 454
- Sitemap static/service URLs: 106
- Total canonical sitemap URLs: 560
- Confirmed 200 URLs: 560
- Confirmed redirects: 0
- Confirmed 404 URLs: 0
- Transport errors: 0
- Preview/Vercel URLs: 0


## Fresh Post-Publication Reconciliation

- Total Sanity post records: 1237
- Approved records, strict public filter: 501
- Unique approved public slugs, strict public filter: 459
- Duplicate approved slug count, strict public filter: 42
- Hidden/unapproved records: 736
- Unique hidden slugs: 592
- Dotted/source records: 607

## 461 vs 462 Redirect Export Reconciliation

- STRICT_PUBLIC_SANITY_SLUGS: 459
- REDIRECT_EXPORT_SLUGS: 459
- DIFFERENCE: 0
- EXACT_SLUG: none
- REASON: No difference detected.

The redirect exporter intentionally omits the published-date cutoff and exports approved, non-draft slugs with defined slugs. The strict public website filter additionally requires a defined non-future published date. The extra export slug above must receive a valid publishedAt date or be removed from export eligibility in a later cleanup pass.

## Fresh Sitemap Validation

- Sitemap HTTP status: 200
- Sitemap blog URLs: 457
- Sitemap static/service URLs: 106
- Total canonical sitemap URLs: 563
- Confirmed 200 URLs: 563
- Confirmed redirects: 0
- Confirmed 404 URLs: 0
- Transport errors: 0
- Preview/Vercel URLs: 0


## Fresh Post-Publication Reconciliation

- Total Sanity post records: 1237
- Approved records, strict public filter: 501
- Unique approved public slugs, strict public filter: 459
- Duplicate approved slug count, strict public filter: 42
- Hidden/unapproved records: 736
- Unique hidden slugs: 592
- Dotted/source records: 607

## 461 vs 462 Redirect Export Reconciliation

- STRICT_PUBLIC_SANITY_SLUGS: 459
- REDIRECT_EXPORT_SLUGS: 459
- DIFFERENCE: 0
- EXACT_SLUG: none
- REASON: No difference detected.

The redirect exporter intentionally omits the published-date cutoff and exports approved, non-draft slugs with defined slugs. The strict public website filter additionally requires a defined non-future published date. The extra export slug above must receive a valid publishedAt date or be removed from export eligibility in a later cleanup pass.

## Fresh Sitemap Validation

- Sitemap HTTP status: 200
- Sitemap blog URLs: 459
- Sitemap static/service URLs: 106
- Total canonical sitemap URLs: 565
- Confirmed 200 URLs: 565
- Confirmed redirects: 0
- Confirmed 404 URLs: 0
- Transport errors: 0
- Preview/Vercel URLs: 0
