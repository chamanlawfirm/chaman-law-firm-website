# Sprint 10J - Search Handover, Hidden Draft Review, Recovery Batch, and Performance Report

Date: 2026-06-30

## Resume State

- Branch: `preview/chaman-law-firm-mvp`.
- Production site: `https://chamanlawfirm.com`.
- Approved public blog posts before Sprint 10J: 61.
- Approved public blog posts after Sprint 10J: 81.
- Sprint 10I hidden drafts reviewed: 30.
- Current restored/approved Sprint 10J batch: 20 articles.
- DNS, Hostinger, Chaman Properties, secrets, raw backups, SQL dumps, archives, and full WordPress folders were not touched.

## Search Console and Bing Handover

- Google Search Console follow-up checklist created: `docs/SPRINT-10J-GSC-INSPECTION-CHECKLIST.md`.
- Bing Webmaster follow-up checklist created: `docs/SPRINT-10J-BING-INSPECTION-CHECKLIST.md`.
- Both checklists include the Sprint 10I approved article URLs, matching legacy redirected URLs, sitemap refresh guidance, and a warning not to inspect hidden draft URLs.

## Hidden Article Risk Review

- Hidden risk review CSV created: `docs/SPRINT-10J-HIDDEN-ARTICLE-RISK-REVIEW.csv`.
- Rows reviewed: 30.
- The review classifies body, image, metadata, legal-safety, duplicate/cannibalization, source-confidence, recommended action, and approval readiness.
- Hidden articles remain unpublished until image completion, legal wording cleanup, body recovery, metadata cleanup, or duplicate/cannibalization review is complete.

## Static Generation Retry Review

- Review created: `docs/SPRINT-10J-STATIC-GENERATION-RETRY-REVIEW.md`.
- Reviewed older retry pages:
  - `annulment-of-marriage-under-the-nigerian-law`
  - `types-of-land-registration-in-nigeria`
- No Sanity document, image, canonical, sitemap, or public-author blocker was found.
- The build retry issue appears related to long article/static generation workload rather than broken content.

## Next Recovery Batch

- Selection CSV created: `docs/SPRINT-10J-LEGACY-BLOG-BATCH-SELECTION.csv`.
- Image recovery map created: `docs/SPRINT-10J-LEGACY-IMAGE-RECOVERY-MAP.csv`.
- Sanity migration result saved: `docs/sprint10j/sprint10j-restoration-result.json`.
- Drafts recovered or refreshed: 50.
- Technical approval candidates found: 36.
- Articles approved in this sprint: 20.
- Remaining restored/selected articles stayed hidden because they were outside the controlled subset or still needed source, legal, image, duplicate, placeholder, or body review.

## Articles Approved

1. Legal Process for Obtaining a Deed of Assignment in Nigeria
2. Land Tenures and Customary Land Tenure Systems in Nigeria
3. Buying Property With Existing Tenants in Nigeria
4. Where Marriage Under the Act Can Be Conducted in Nigeria
5. How Nigerian Courts Handle Electronic Evidence
6. Types of Companies in Nigeria
7. Contract Breach and Remedies in Nigeria
8. Tax Clearance Certificate in Nigeria
9. Legalisation and Authentication of Marriage Certificates in Nigeria
10. What Is a Deed of Assent in Nigeria?
11. Domestic Violence as a Ground for Dissolution of Marriage in Nigeria
12. How to Process Survey Plan Approval in Ogun State
13. Family Courts and Specialized Tribunals in Nigeria
14. The Role of Immigration Service in Border Management
15. Landlord and Tenant Relationship in Nigeria
16. How to Regularize Land Documents in Ogun State
17. How to File for Child Custody in Nigeria
18. Rights of Children Born Outside Wedlock in Nigeria
19. Overview of Statutory Marriage in Nigeria
20. How to Legally Subdivide and Develop Land in Nigeria

## Sanity Content Changes

- Public approved post count increased from 61 to 81.
- The 20 approved Sprint 10J articles were created or refreshed as public-safe post documents.
- Public author remains `Charles Chukwuma Nkwoka, Esq.`.
- Each approved article has body content, SEO metadata, canonical intent, featured image, alt text, consultation CTA, and `lawFirmApproved=true`.
- Non-selected restored drafts remain hidden with `lawFirmApproved=false`.

## Redirects

- Twenty exact legacy redirects were added in `next.config.mjs`.
- Each approved old URL maps one-hop to `/resources/blog/[same-legacy-slug]`.
- No hidden or unapproved article redirects were activated.
- No homepage dumping, redirect chain, or Chaman Properties target was introduced.

## Blog Performance

- Blog performance monitor created: `docs/SPRINT-10J-BLOG-PERFORMANCE-MONITORING.md`.
- Build initially exposed Next.js data-cache warnings because related-article reads fetched full article bodies and FAQs for up to 500 posts.
- Safe fix applied in `src/lib/cms.ts`: list/related blog queries now use a lighter projection while full article pages still fetch complete body/FAQ content.
- After the fix, the production build completed without the oversized-cache warnings.

## Testing

- `npm run lint`: passed with the existing `keyField` warning in `scripts/migration/phase5c-import-top50-to-sanity.mjs`.
- `npm run build`: passed with 150 static pages generated.

## Remaining Risks

- Hidden drafts need continued lawyer review, image completion, body recovery, and duplicate/cannibalization review.
- Search Console and Bing dashboard inspection must be done manually by the Principal.
- Larger article batches may continue increasing static generation time; keep approval batches controlled.
- Legacy redirects should continue to be activated only after exact target articles are public, live, indexable, and sitemap-included.
