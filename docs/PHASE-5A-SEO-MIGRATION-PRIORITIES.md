# Phase 5A SEO Migration Priorities

Prepared from the approved RankMath export dated 20 June 2026 and Google Search Console export covering 19 June 2025 to 18 June 2026.

## Source inventory

- RankMath records: 2,015
- Records with non-empty slugs: 1,882
- Records with SEO titles: 1,059
- Records with SEO descriptions: 1,240
- Records with focus keywords: 1,702
- Records with canonical URLs: 15
- Recorded RankMath redirects: 120, all marked 301
- Search Console page rows: 1,000
- Search Console query rows: 1,000
- Search Console totals: 58,537 clicks and 4,876,446 impressions

## Priority URLs to preserve

These URLs should not be removed, consolidated or redirected until their source content has been reviewed and an equivalent target has passed editorial and legal QA.

| Priority | Legacy path | Clicks | Impressions | Recommended destination |
|---:|---|---:|---:|---|
| 1 | `/` | 3,369 across HTTPS, WWW and HTTP variants | 198,121 | `/`; force HTTPS and non-WWW |
| 2 | `/landlord-and-tenant-rights-in-nigeria/` | 1,579 | 59,489 | Preserve as approved legal article |
| 3 | `/obtaining-a-certificate-of-occupancy-c-of-o/` | 1,173 | 39,662 | Preserve as property-law article |
| 4 | `/cac-public-search-guide-nigeria/` | 1,009 | 77,699 | Preserve as corporate-law article |
| 5 | `/the-jurisdiction-of-courts-in-nigeria/` | 770 | 40,707 | Preserve as litigation/legal-system article |
| 6 | `/the-concept-of-rule-of-law-in-nigeria/` | 763 | 51,092 | Preserve after legal/editorial review |
| 7 | `/types-of-tenant-in-nigeria/` | 758 | 23,316 | Preserve as property/tenancy article |
| 8 | `/about-us/` | 733 | 41,803 | Redirect to `/about` |
| 9 | `/how-to-change-car-ownership-in-nigeria/` | 731 | 34,973 | Preserve if legally accurate and in scope |
| 10 | `/proper-steps-to-eviction-of-tenants/` | 708 | 32,444 | Preserve as tenancy article |
| 11 | `/how-to-track-a-stolen-phone-in-nigeria/` | 689 | 48,652 | Review scope, accuracy and conversion value |
| 12 | `/the-ogun-state-tenancy-law-chaman-law-firm/` | 646 | 10,043 | Preserve as Ogun tenancy-law article |
| 13 | `/building-permit-approval-in-ogun-state/` | 629 | 22,729 | Preserve as property/regulatory article |
| 14 | `/list-of-government-agencies-of-nigeria/` | 608 | 70,716 | Review freshness before preservation |
| 15 | `/4-steps-on-how-to-deal-with-a-bad-landlordin/` | 570 | 14,414 | Preserve after title and content cleanup |
| 16 | `/joinder-of-parties-misjoinder-of-parties/` | 553 | 15,775 | Preserve as litigation article |
| 17 | `/how-to-change-name-with-deed-poll/` | 531 | 24,126 | Preserve as notary/private-client article |
| 18 | `/gain-nigerian-citizenship-by-marriage/` | 505 | 34,961 | Preserve as immigration article |
| 19 | `/statutory-right-of-occupancy-vs-customary-right/` | 503 | 14,711 | Preserve as property-law article |
| 20 | `/ways-to-prove-ownership-of-land/` | 442 | 28,020 | Preserve as property-law article |
| 21 | `/5-steps-on-how-to-obtain-restraining-order/` | 421 | 7,829 | Preserve after legal review |
| 22 | `/steps-on-how-to-confidently-report-acrimelaw/` | 414 | 30,229 | Preserve after title and accuracy review |
| 23 | `/what-are-elements-of-tax-law/` | 397 | 10,170 | Preserve if tax-law coverage remains approved |
| 24 | `/tax-administration-in-nigeria/` | 376 | 16,882 | Preserve if tax-law coverage remains approved |
| 25 | `/how-to-notarize-a-document-in-nigeria/` | 351 | 27,073 | Preserve under Notary Public Services |

## Priority service and profile redirects

| Legacy path | Recommended target |
|---|---|
| `/about-us/` | `/about` |
| `/charles-chukwuma-nkwoka-esq/` | `/lawyers/charles-chukwuma-nkwoka` |
| `/justina-obriko-esq/` | `/lawyers/justina-edewede-obriko` |
| `/ibraheem-akewusola-esq/` | `/lawyers/ibraheem-akewusola` |
| `/martha-elendu-esq/` | `/lawyers/martha-elendu` |
| `/property-lawyer-lagos/` | `/practice-areas/property-real-estate-law` |
| `/corporate-lawyer-nigeria/` | `/practice-areas/corporate-commercial-law` |
| `/litigation-lawyer-lagos/` | `/practice-areas/litigation-dispute-resolution` |
| `/debt-recovery-lawyer-nigeria/` | `/practice-areas/debt-recovery` |
| `/family-lawyer-lagos/` | `/practice-areas/family-law` |
| `/immigration-lawyer-nigeria/` | `/practice-areas/immigration-services` |

## Governance rules

1. Migrate or recreate a page before activating its redirect.
2. Preserve the original path as a redirect source and use one permanent hop to the final canonical target.
3. Do not redirect high-performing articles to unrelated hubs.
4. Use `410 Gone` for content that is unsafe, irrelevant and has no equivalent.
5. Normalize every canonical to `https://chamanlawfirm.com` without `www`.
6. Import and validate all 120 RankMath redirects before deployment; several contain changed destination slugs.
7. Keep legal articles noindexed until lawyer review, attribution, dates, citations and internal links are complete.

## Immediate SEO risks

- The current rebuild does not yet contain the highest-performing legacy articles.
- The Search Console export contains HTTP, WWW and non-WWW versions of the homepage, splitting signals.
- Only 15 of 2,015 RankMath records have a canonical URL.
- Many legacy titles and slugs require editorial cleanup, but high-performing paths must remain redirect sources.
- The existing Sanity investment-article cluster is not approved for the law-firm launch and is excluded until explicit brand and legal approval.
