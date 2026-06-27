# Sprint 9N Complete Report

Date: 2026-06-27

## Executive Summary

Sprint 9N improved project alignment, reviewed the current preview website, completed controlled Batch B editorial readiness for selected articles, and approved a sub-batch of 8 high-value migrated blog articles for preview visibility.

No production domain was connected. No production deployment was triggered. No Google Search Console submission was made. No legacy redirects were activated.

## Project Document / PRD Review Result

Reviewed current project documentation, sprint reports, migration records, and launch-readiness documents. The website remains aligned with the PRD:

- Next.js, TypeScript, Tailwind CSS, Sanity CMS, and Vercel stack is intact.
- Lead generation and consultation paths are active.
- Blog migration is controlled by `lawFirmApproved`.
- Sitemap includes approved blog posts only.
- Redirect readiness exists but remains inactive.
- Author governance remains fixed on Charles Chukwuma Nkwoka, Esq. for migrated legacy articles.

Remaining blockers are content scale, source recovery, final launch QA, redirect approval, production environment verification, and DNS/domain cutover planning.

## Website-Wide Quality Audit Result

Preview routes checked:

- `/`
- `/about`
- `/lawyers`
- `/practice-areas`
- `/consultation`
- `/contact`
- `/resources/blog`
- `/resources/downloads`
- `/thank-you`
- `/sitemap.xml`
- `/robots.txt`

Result:

- Routes returned 200.
- HTML routes include canonical metadata.
- Source scan found no current Chaman Properties contamination in website source.
- Source scan found no obvious placeholder/lorem content in website source.
- Blog pagination remains active with 9 posts per page.
- Hidden repaired Batch B articles continue to return 404.

## Safe Fixes Applied

- Created a reusable Sprint 9N controlled approval script.
- Rewrote 8 selected Batch B articles into public-safe legal education format.
- Removed legacy footer/contact residue from selected articles.
- Added answer-style opening blocks, FAQs, internal practice-area links, and consultation CTAs.
- Confirmed SEO title, meta description, canonical, image, alt text, author, categories, and published dates.
- Approved only the selected 8 articles in Sanity.

## Batch B Article Review Result

Sprint 9M had 18 repaired/imported hidden Batch B articles. Sprint 9N approved 8 and kept 10 hidden.

Detailed article review is recorded in:

- `docs/SPRINT-9N-BATCH-B-ARTICLE-REVIEW.csv`

## Articles Approved In This Sprint

Approved in Sanity with `lawFirmApproved=true`:

- `cac-public-search-guide-nigeria`
- `types-of-tenant-in-nigeria`
- `how-to-change-name-with-deed-poll`
- `ways-to-prove-ownership-of-land`
- `how-to-notarize-a-document-in-nigeria`
- `the-statutory-right-of-occupancy-in-nigeria`
- `transfer-of-company-shares-in-nigeria`
- `statute-of-limitations-on-debt-in-nigeria`

Total approved blog posts after Sprint 9N: 13.

## Articles Kept Hidden And Why

The following repaired/imported Batch B articles remain hidden with `lawFirmApproved=false`:

- `the-concept-of-rule-of-law-in-nigeria` - lower lead value; needs title/body cleanup.
- `difference-between-ownership-and-possession` - potential cannibalization with proof-of-ownership content.
- `community-development-associations-law` - needs jurisdiction/current-law review.
- `how-to-replace-a-lost-a-marriage-certificate` - needs family/documentation review and title normalization.
- `legal-steps-to-take-when-our-land-has-been` - needs no-self-help land-dispute review.
- `rights-of-tenants-in-ogun-chaman-law-firm` - potential overlap with approved tenancy/Ogun content.
- `is-foreign-marriage-under-the-nigerian-law` - needs family-law review and title normalization.
- `abandonment-and-withdrew-of-court-action` - needs litigation procedure review.
- `powerful-steps-what-is-trespass-to-land-2` - needs land-dispute safety review.
- `the-duties-of-lawyers-to-client` - needs brand/professional-ethics review.

## Preview Blog Verification Result

Preview verified at `https://chaman-law-firm-website.vercel.app`.

- `/resources/blog` returned 200.
- `/resources/blog?page=2` returned 200.
- Newly approved article URLs returned 200.
- Titles rendered.
- Featured images rendered.
- Public author rendered as Charles Chukwuma Nkwoka, Esq.
- Canonical links rendered.
- Consultation/contact CTA links were present.
- Sitemap includes newly approved article URLs.
- Non-approved repaired Batch B article URLs returned 404.

## Individual New Article URL Results

- `/resources/blog/cac-public-search-guide-nigeria` - 200
- `/resources/blog/types-of-tenant-in-nigeria` - 200
- `/resources/blog/how-to-change-name-with-deed-poll` - 200
- `/resources/blog/ways-to-prove-ownership-of-land` - 200
- `/resources/blog/how-to-notarize-a-document-in-nigeria` - 200
- `/resources/blog/the-statutory-right-of-occupancy-in-nigeria` - 200
- `/resources/blog/transfer-of-company-shares-in-nigeria` - 200
- `/resources/blog/statute-of-limitations-on-debt-in-nigeria` - 200

## Sitemap Inclusion Result

`/sitemap.xml` returned 200 and includes all 8 newly approved articles.

The 10 hidden repaired Batch B article URLs remain excluded from the sitemap and return 404.

## SEO/AEO/GEO Preservation Result

Preserved or improved:

- Legacy slugs.
- `/resources/blog/[legacy-slug]` URL pattern.
- Canonical target pattern.
- Meta titles.
- Meta descriptions.
- Practice-area relevance.
- Author governance.
- Featured images and alt text.
- Answer blocks.
- FAQ sections.
- Consultation CTAs.
- Nigerian legal education positioning.

Redirects remain pending only.

## Redirect Readiness Update

Redirect notes for newly approved articles are recorded in:

- `docs/SPRINT-9N-REDIRECT-READINESS-UPDATE.csv`

No redirects were activated.

## Missing Source Recovery Plan

27 Batch B candidates remain blocked by missing body/source material and related metadata or image gaps. Recovery requests are recorded in:

- `docs/SPRINT-9N-MISSING-SOURCE-RECOVERY.csv`

Preferred source exports:

- WordPress XML export.
- RankMath SEO export.
- Database backup if XML is incomplete.
- `wp-content/uploads` archive.
- Old sitemap export.
- Legacy media archive.

No passwords should be requested in code, logs, or chat. If access is required later, ask only for the export file needed.

## Production Domain Readiness Audit

Production domain connection remains No-Go.

Required before connecting `chamanlawfirm.com`:

- Vercel production project verification.
- Production environment variable verification.
- Production lead delivery test.
- Sitemap and robots check on production.
- Final preview QA.
- Approved redirect map review.
- DNS cutover plan.
- Rollback plan.
- Old website backup confirmation.
- Search Console and Bing Webmaster submission plan.
- Analytics and post-launch monitoring plan.

## Sanity Content Changes Made

Only 8 selected Batch B articles were approved. All non-selected Batch B documents remain hidden.

Public author is Charles Chukwuma Nkwoka, Esq. for the approved articles.

## Lint Result

Passed.

Existing warning only:

- `scripts/migration/phase5c-import-top50-to-sanity.mjs`: `keyField` is assigned a value but never used.

## Build Result

Passed using the local Windows system certificate store.

- Build generated 74 static pages.
- Corrected build run completed without the local Sanity certificate warning.

## Files Modified

- `scripts/migration/sprint9n-publish-batch-b-subset.mjs`
- `docs/SPRINT-9N-PROJECT-ALIGNMENT-AUDIT.md`
- `docs/SPRINT-9N-BATCH-B-ARTICLE-REVIEW.csv`
- `docs/SPRINT-9N-REDIRECT-READINESS-UPDATE.csv`
- `docs/SPRINT-9N-MISSING-SOURCE-RECOVERY.csv`
- `docs/SPRINT-9N-COMPLETE-REPORT.md`

## Go/No-Go

- Next controlled article batch: Go for review and cleanup, not mass publication.
- Final preview QA: Go after this sprint's deployment/checks are confirmed.
- Production domain connection: No-Go.
