# Sprint 10I - Continued Legacy Blog Recovery

Date: 2026-06-30
Branch: preview/chaman-law-firm-mvp
Repository: chamanlawfirm/chaman-law-firm-website
Production domain: https://chamanlawfirm.com

## 1. Current State

- Production website is live on chamanlawfirm.com.
- Lead delivery was previously confirmed through Make.com, Google Sheet, and Gmail notification.
- Sprint 10I started from 41 approved public blog posts.
- Sprint 10I approved public blog count after controlled approval: 61.
- No DNS, Hostinger, Chaman Properties, or unrelated project folders were touched.
- No secrets, WordPress configuration files, database files, archives, or raw backups were committed.

## 2. Source Inventory Result

Sources used for Sprint 10I:

- Top 1,000 selection manifest: `docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`
- Legacy WordPress SQL backup, used read-only from the external legacy backup folder.
- Legacy WordPress media archive, used read-only for image recovery.
- RankMath export, used read-only for SEO metadata and image evidence.
- Existing `next.config.mjs` redirect map.
- Existing Sanity production dataset `eeuefmhu/production`.

## 3. Hidden Draft Cleanup

Generated file:

- `docs/SPRINT-10I-HIDDEN-DRAFT-CLEANUP.csv`

Result:

- Hidden draft records reviewed across Sprint 10E, 10G, 10H, and 10I prefixes: 72.
- Cleanup columns include title, slug, old URL, current redirect target, body status, image status, metadata status, legal safety status, duplicate/thin risk, recommended action, approval readiness, and notes.
- Drafts with placeholder/plugin debris, eviction/self-help risk, off-brand signals, duplicate C of O risk, or image/source concerns remained hidden.

## 4. Batch Selection And Image Recovery

Generated files:

- `docs/SPRINT-10I-LEGACY-BLOG-BATCH-SELECTION.csv`
- `docs/SPRINT-10I-LEGACY-IMAGE-RECOVERY-MAP.csv`
- `docs/sprint10i/sprint10i-restoration-result.json`

Result:

- Articles selected for Sprint 10I review/recovery: 50.
- Drafts recovered or refreshed in Sanity: 50.
- Technical approval candidates found: 28.
- Controlled approvals applied: 20.
- Remaining selected articles kept hidden: 30.

## 5. Articles Approved In Sprint 10I

The following 20 articles were approved for public visibility:

1. How to Replace a Lost Marriage Certificate in Nigeria
2. What Are the Rights of Tenants in Ogun State?
3. Taxation of the Construction Sector in Nigeria
4. Sharing of Property After Divorce in Nigeria
5. The Role of Family Court in Child Protection in Nigeria
6. How to Calculate Stamp Duty for Property Transactions in Ogun State
7. How to Legally Sublet a Property in Nigeria
8. What Governs Contracts in Nigeria?
9. Obtaining Governor's Consent for Land Transactions in Nigeria
10. The Land Use and Allocation Committee (LUAC) in Nigeria
11. Property Insurance in Nigeria
12. Overview of Family Law in Nigeria
13. Who Holds Authority Over Land Under the Land Use Act?
14. What to Do When a Developer Fails to Deliver Property
15. How to Conduct a Search at the Land Registry in Nigeria
16. Importance of Covenants in a Tenancy Agreement
17. How to Prove Ownership of Land in Nigeria
18. How to Conduct a Statutory Marriage in Nigeria
19. Legal Obligations for Debt Collectors in Nigeria
20. Challenges Facing the Nigerian Court System

## 6. Author Governance Result

- Public author for all Sprint 10I approved articles: Charles Chukwuma Nkwoka, Esq.
- Public attribution to associates, employees, interns, or temporary staff was not used.
- Sanity query confirmed the approved Sprint 10I documents use the required public author.

## 7. SEO / AEO / GEO Result

- Original legacy slugs were preserved.
- Public URL pattern remains `/resources/blog/[legacy-slug]`.
- Canonical URLs use `https://chamanlawfirm.com/resources/blog/[slug]`.
- SEO titles and meta descriptions were recovered or normalized from legacy/RankMath/source content.
- Article bodies include public legal education framing and consultation CTA sections through the migration template.
- Answer-style introductory guidance and FAQ-style structures were preserved/generated where supported by the migration helper.
- Chaman Properties and luxury property sales content were filtered by migration safety checks.

## 8. Image / Alt / Caption Result

- Recovered article-specific images were matched from the legacy media archive.
- Sanity image assets were uploaded or reused.
- Alt text was normalized to the cleaned public article title plus Chaman Law Firm context.
- Chaman Properties imagery was not intentionally used.
- Article image mappings are recorded in `docs/SPRINT-10I-LEGACY-IMAGE-RECOVERY-MAP.csv`.

## 9. Redirect Readiness And Activation

Exact redirects were updated only for the 20 approved Sprint 10I articles.

- Old URL: `https://chamanlawfirm.com/[legacy-slug]/`
- New URL: `https://chamanlawfirm.com/resources/blog/[legacy-slug]`
- Redirect type: one-hop permanent redirect through Next.js.
- Hidden/unapproved articles were not redirected to blog article targets.
- Generic homepage dumping was not used.

## 10. Sanity Content Changes

Sanity production changes made:

- Created/refreshed 50 hidden public-safe draft documents under the Sprint 10I draft prefix.
- Created/refreshed 20 public post documents under the Sprint 10I public prefix.
- Set `lawFirmApproved=true` only for the 20 controlled approved articles.
- Kept all non-selected and failed-risk articles hidden with `lawFirmApproved=false`.
- Confirmed approved public post count: 61.

## 11. Testing Result

Lint:

- Passed.
- Existing warning only: `scripts/migration/phase5c-import-top50-to-sanity.mjs` has unused `keyField`.

Build:

- Passed.
- Build generated 110 static pages.
- Two older blog pages required static generation retries, but the build completed successfully.

## 12. Remaining Hidden / Blocked Content

Examples of articles deliberately kept hidden:

- `steps-on-how-to-confidently-report-acrimelaw` - title/source quality issue.
- `abandonment-and-withdrew-of-court-action` - off-topic image/source fit concern.
- `certificate-of-occupancy-in-rivers-state` - duplicate/cannibalization and location-specific review risk.
- `deal-with-and-bad-tenant-as-a-landlord` - tenancy/self-help risk.
- `how-do-i-obtain-a-certificate-of-occupancy` - duplicate C of O risk.
- `how-to-register-a-deed-of-assignment-in-ogun` - image relevance concern.
- `how-to-handle-land-grabbers-in-ogun-state` - legal risk and image relevance concern.
- `how-to-legally-evict-a-tenant-in-lagos-state` - eviction/self-help legal review risk.

The full hidden review is in `docs/SPRINT-10I-HIDDEN-DRAFT-CLEANUP.csv`.

## 13. Production Readiness Status

- Go for post-deploy verification of the 20 newly approved articles.
- Go for next controlled review/preparation batch.
- No-Go for mass approval of all remaining drafts.
- No-Go for broad redirect activation beyond approved article targets.
- No DNS changes are required or recommended in this sprint.

## 14. Recommended Next Sprint

Sprint 10J should focus on:

- Post-deploy QA of the 61 public blog articles.
- Search Console inspection of selected high-value restored URLs.
- Recovery of the next safest hidden batch from the 72 hidden draft review list.
- Lawyer review of eviction, land-grabbing, police, and duplicate C of O articles before approval.
- Performance monitoring as blog volume continues to grow.
