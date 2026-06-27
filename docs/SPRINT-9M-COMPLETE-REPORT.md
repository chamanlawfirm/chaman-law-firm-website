# Sprint 9M Complete Report

Date: 2026-06-27

## Executive Summary

Sprint 9M moved the blog migration from manual article-by-article handling into a repeatable migration system. The sprint generated a Top 1,000 legacy URL selection manifest, a source inventory report, a Batch B readiness file, redirect-readiness output, a hidden Sanity repair/import result, and reusable migration scripts.

No production domain was connected. No production deployment was triggered. No Google Search Console submission was made. No legacy redirects were activated.

## Current Public Blog State

- Five articles are approved and visible on Vercel preview.
- `/resources/blog` shows the approved posts.
- Approved article URLs return 200.
- `/sitemap.xml` includes approved posts only.
- Public author governance is `Charles Chukwuma Nkwoka, Esq.`
- Redirects remain pending only.

## Generated Files

- `docs/SPRINT-9M-SOURCE-INVENTORY.md`
- `docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`
- `docs/SPRINT-9M-BATCH-B-READINESS.csv`
- `docs/SPRINT-9M-REDIRECT-READINESS.csv`
- `docs/SPRINT-9M-MIGRATION-SYSTEM-SUMMARY.json`
- `docs/SPRINT-9M-IMPORT-REPAIR-RESULT.json`

## Scripts Added

- `scripts/migration/sprint9m-build-top1000-system.mjs`
- `scripts/migration/sprint9m-repair-batch-b-hidden.mjs`

## Source Inventory Result

Available local sources:

- SEO Master Migration Roadmap with 1,000 Search Console URL rows in Appendix A.
- Phase 5B Top 50 Migration Register.
- Phase 5B Top 50 Redirect Map.
- Phase 5C prepared Sanity drafts.
- Phase 5C validation logs.
- Public law-firm images.

Not available as standalone local source files:

- Full WordPress XML export or SQL backup.
- Raw RankMath export.
- Raw Google Search Console query export.
- Full original media archive for all 2,000 legacy posts.

Counts from generated inventory:

- Search Console URL rows discovered: 1,000.
- Phase 5C prepared article records: 50.
- Candidate legal/article rows selected from local evidence: 887.
- Usable legal/article candidates after property/off-brand screening: 885.
- Chaman Properties/off-brand rows excluded or flagged: 9.
- Redirect-only/non-article rows: 93.
- Weak/archive candidates: 12.
- Candidate rows missing prepared body content locally: 837.
- Candidate rows missing image coverage locally: 882.

## Top 1,000 Selection Result

The Top 1,000 manifest was generated from the SEO roadmap Appendix A and enriched with Phase 5B/5C data where available. It preserves:

- old URL
- old slug
- proposed `/resources/blog/[slug]` route where appropriate
- clicks
- impressions
- category/topic
- migration decision
- author governance
- image status
- legal review status
- approval status
- redirect status
- sitemap status

The manifest is located at:

`docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`

## Import / Repair Result

Batch B hidden repair/import was completed for 18 locally prepared article records.

Imported/repaired as hidden Sanity documents:

- `cac-public-search-guide-nigeria`
- `the-concept-of-rule-of-law-in-nigeria`
- `types-of-tenant-in-nigeria`
- `how-to-change-name-with-deed-poll`
- `ways-to-prove-ownership-of-land`
- `difference-between-ownership-and-possession`
- `community-development-associations-law`
- `how-to-notarize-a-document-in-nigeria`
- `how-to-replace-a-lost-a-marriage-certificate`
- `the-statutory-right-of-occupancy-in-nigeria`
- `legal-steps-to-take-when-our-land-has-been`
- `transfer-of-company-shares-in-nigeria`
- `rights-of-tenants-in-ogun-chaman-law-firm`
- `statute-of-limitations-on-debt-in-nigeria`
- `is-foreign-marriage-under-the-nigerian-law`
- `abandonment-and-withdrew-of-court-action`
- `powerful-steps-what-is-trespass-to-land-2`
- `the-duties-of-lawyers-to-client`

All imported/repaired Batch B records remain:

- `_type=post`
- public-safe non-draft IDs
- `lawFirmApproved=false`
- author set to Charles Chukwuma Nkwoka, Esq.
- hidden from public blog routes
- excluded from sitemap

## Batch B Readiness Result

Batch B contains the next 45 priority article candidates after the five approved/live posts.

Current readiness:

- 18 have local prepared body and SEO metadata.
- 27 require source body/SEO recovery from the full WordPress/RankMath sources.
- 18 were repaired/imported as hidden Sanity documents.
- 0 were approved in Sprint 9M.

Reason no Batch B article was approved:

- Several titles remain legacy/spammy and need editorial cleanup.
- Legal/procedural accuracy needs lawyer review before publication.
- Some content requires substantive rewriting.
- This sprint created the scalable system and hidden staging layer; it did not complete lawyer review for a new public sub-batch.

## Author Governance Result

Passed.

All migrated legacy content should publicly show:

`Charles Chukwuma Nkwoka, Esq.`

Batch B hidden staging records use this author. Non-permanent staff, associates, interns, or temporary writers were not used as public authors.

## SEO Preservation Result

Implemented in the manifest and hidden import strategy:

- original slugs preserved where safe
- new route pattern `/resources/blog/[same-slug]`
- SEO title and meta description preserved where available
- canonical intent mapped to `https://chamanlawfirm.com/resources/blog/[slug]`
- clicks and impressions retained in selection CSV
- redirect status documented as pending
- sitemap status tied to approval state

## Image / Alt / Caption Result

- Approved law-firm image assets were used for hidden Batch B fallback coverage where original image recovery was unavailable.
- No Chaman Properties imagery was used.
- No luxury property sales imagery was used.
- Alt text exists on repaired/imported hidden Batch B records.
- Caption support should be added later if the Sanity post schema is expanded to include a formal caption field.

## AEO / GEO Enhancement Result

Hidden repaired records received:

- concise public-education answer block near the top
- general legal disclaimer language
- consultation CTA
- practice-area link
- FAQ blocks where missing

Approval remains blocked until lawyer review confirms accuracy.

## Redirect Readiness Result

Generated:

`docs/SPRINT-9M-REDIRECT-READINESS.csv`

Redirect rules remain pending only:

- one-hop 301 redirects
- old legacy URL to new target URL
- no generic homepage/blog redirects unless separately approved
- activate only after target article is approved, visible, indexable, in sitemap, and final launch approved

## Blog Performance / Pagination Result

`src/components/BlogPagination.tsx` was updated to avoid rendering every page number when the blog grows to hundreds or thousands of articles. It now renders a compact first/last/current-window pagination pattern.

Current sitemap scale is safe for 1,000 articles. A sitemap index is not required until the site approaches large sitemap limits, but a sitemap-index strategy should be prepared before expanding beyond tens of thousands of URLs.

## Launch Readiness Context

Before moving `chamanlawfirm.com` from the old site to the new site:

- lead delivery must remain confirmed
- five approved articles must remain live
- Batch B approval status must be reviewed
- sitemap must include only approved/indexable URLs
- redirects must remain pending until each target is live
- production Vercel environment variables must be confirmed
- production deployment must be tested
- DNS cutover plan must be approved
- rollback plan must be ready
- Search Console submission must wait until after production launch and redirect activation

## Go / No-Go

- Go for continued preview QA.
- Go for Batch B lawyer review workflow.
- No-Go for approving Batch B automatically.
- No-Go for production domain connection.
- No-Go for legacy redirect activation.
