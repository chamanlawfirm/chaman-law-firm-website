# Sprint 10H - Next Legacy Blog Restoration Batch

Date: 2026-06-30

## Scope

Sprint 10H continued the controlled legacy blog restoration workflow after Sprint 10G. The sprint focused on article-specific image recovery, hidden Sanity draft repair, a controlled approval batch, and exact redirect replacement only for newly approved articles.

No DNS, Hostinger, Search Console, Bing, Chaman Properties, or unrelated project changes were made.

## Sources Used

- Top 1,000 legacy blog selection manifest: `docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`
- Legacy WordPress SQL backup: external read-only source
- Legacy WordPress media archive: external read-only source
- RankMath export: external read-only source
- Current redirect configuration: `next.config.mjs`
- Sanity project: `eeuefmhu`
- Sanity dataset: `production`

## Files Generated

- `docs/SPRINT-10H-REMAINING-HIDDEN-DRAFT-REVIEW.csv`
- `docs/SPRINT-10H-LEGACY-BLOG-BATCH-SELECTION.csv`
- `docs/SPRINT-10H-LEGACY-IMAGE-RECOVERY-MAP.csv`
- `docs/sprint10h/sprint10h-restoration-result.json`

## Migration Script

Created `scripts/migration/sprint10h-next-legacy-batch.mjs`.

The script:

- Reads the Top 1,000 migration manifest.
- Streams the legacy WordPress SQL dump for article body and metadata recovery.
- Streams the legacy media archive for article-specific image recovery.
- Rejects corrupt/non-ASCII archive image paths and known off-topic image matches.
- Creates/refreshed hidden Sprint 10H Sanity drafts.
- Approves only the curated controlled subset.
- Keeps public author attribution as Charles Chukwuma Nkwoka, Esq.
- Leaves non-selected and unsafe articles hidden.

## Sanity Content Result

Sanity apply completed successfully.

- Approved public posts before Sprint 10H apply: 25
- Approved public posts after Sprint 10H apply: 41
- Hidden drafts recovered/refreshed: 30
- Technical approval candidates found: 21
- Articles approved in Sprint 10H controlled batch: 16
- Remaining Sprint 10E hidden drafts reviewed: 8

## Articles Approved

1. How Valid Is a Foreign Marriage Under Nigerian Law?
   - Old URL: `https://chamanlawfirm.com/is-foreign-marriage-under-the-nigerian-law/`
   - New URL: `/resources/blog/is-foreign-marriage-under-the-nigerian-law`

2. Taxation of Sole Proprietorships in Nigeria
   - Old URL: `https://chamanlawfirm.com/taxation-of-sole-proprietorship/`
   - New URL: `/resources/blog/taxation-of-sole-proprietorship`

3. Customary vs Statutory Marriage in Nigeria
   - Old URL: `https://chamanlawfirm.com/customary-vs-statutory-marriage-in-nigeria/`
   - New URL: `/resources/blog/customary-vs-statutory-marriage-in-nigeria`

4. What Is Trespass to Land in Nigeria?
   - Old URL: `https://chamanlawfirm.com/powerful-steps-what-is-trespass-to-land-2/`
   - New URL: `/resources/blog/powerful-steps-what-is-trespass-to-land-2`

5. How to Secure Child Support and Maintenance in Nigeria
   - Old URL: `https://chamanlawfirm.com/how-to-secure-child-support-and-maintenance/`
   - New URL: `/resources/blog/how-to-secure-child-support-and-maintenance`

6. How to Apply For and Obtain a Certificate of Occupancy in Nigeria
   - Old URL: `https://chamanlawfirm.com/to-apply-for-and-get-certificate-of-occupancy/`
   - New URL: `/resources/blog/to-apply-for-and-get-certificate-of-occupancy`

7. Grounds for Dissolution of Marriage Under Nigerian Law
   - Old URL: `https://chamanlawfirm.com/dissolution-of-marriage-under-the-nigeria-law/`
   - New URL: `/resources/blog/dissolution-of-marriage-under-the-nigeria-law`

8. Family Property and Rights of Individual Family Members in Nigeria
   - Old URL: `https://chamanlawfirm.com/family-property-and-right-of-individual-member-in-family-property/`
   - New URL: `/resources/blog/family-property-and-right-of-individual-member-in-family-property`

9. Annulment of Marriage Under Nigerian Law
   - Old URL: `https://chamanlawfirm.com/annulment-of-marriage-under-the-nigerian-law/`
   - New URL: `/resources/blog/annulment-of-marriage-under-the-nigerian-law`

10. Rights of Women to Inheritance in Nigeria
    - Old URL: `https://chamanlawfirm.com/what-are-rights-of-women-to-inheritance-in-nigeria/`
    - New URL: `/resources/blog/what-are-rights-of-women-to-inheritance-in-nigeria`

11. Communal Land and Family Land in Nigeria
    - Old URL: `https://chamanlawfirm.com/communal-land-and-family-land/`
    - New URL: `/resources/blog/communal-land-and-family-land`

12. The Role of Courts in Land Ownership Disputes in Nigeria
    - Old URL: `https://chamanlawfirm.com/land-ownership-disputes-in-nigeria/`
    - New URL: `/resources/blog/land-ownership-disputes-in-nigeria`

13. Types of Land Registration in Nigeria
    - Old URL: `https://chamanlawfirm.com/types-of-land-registration-in-nigeria/`
    - New URL: `/resources/blog/types-of-land-registration-in-nigeria`

14. What to Know About Company Resolutions in Nigeria
    - Old URL: `https://chamanlawfirm.com/what-to-know-about-company-resolution/`
    - New URL: `/resources/blog/what-to-know-about-company-resolution`

15. What Is the Process of Land Acquisition in Nigeria?
    - Old URL: `https://chamanlawfirm.com/what-is-the-process-of-land-acquisition/`
    - New URL: `/resources/blog/what-is-the-process-of-land-acquisition`

16. Complete Guide to the Probate Registry in Lagos
    - Old URL: `https://chamanlawfirm.com/complete-guide-to-probate-registry-in-lagos/`
    - New URL: `/resources/blog/complete-guide-to-probate-registry-in-lagos`

## Articles Kept Hidden

These records were not approved in this sprint:

- `steps-on-how-to-confidently-report-acrimelaw` - kept outside controlled approval subset.
- `how-to-file-complaint-against-police-officers-in-nigeria` - no recoverable article-specific image.
- `abandonment-and-withdrew-of-court-action` - kept outside controlled approval subset.
- `certificate-of-occupancy-in-rivers-state` - kept outside controlled approval subset.
- `void-and-voidable-marriages-in-nigeria` - placeholder/plugin debris requires cleanup.
- `can-a-minor-enter-into-a-valid-contract-in-nigeria` - meta description requires improvement.
- `conditions-for-granting-injunctions-and-types-of-injunctions` - no recoverable article-specific image.
- `overview-of-the-concept-recovery-of-premises` - eviction/self-help language requires lawyer review.
- `how-do-i-legally-evict-a-tenant-in-ogun-state` - misleading free-service and eviction/self-help language require revision.
- `land-grabbing-the-legal-consequences-of` - meta description requires improvement.
- `powerful-steps-sources-of-tax-law-in-nigeria` - meta description requires improvement.
- `the-role-of-family-court-in-relation-to-child-protect-in-nigeria` - kept outside controlled approval subset.
- `property-how-to-place-a-caveat` - meta description requires improvement.
- `how-to-calculate-stamp-duty-chaman-law-firm` - kept outside controlled approval subset.

Additional recovered hidden drafts remain available for future review and approval only after article-specific checks.

## Author Governance

All approved Sprint 10H migrated articles publicly use:

Charles Chukwuma Nkwoka, Esq.

No migrated article was publicly attributed to employees, interns, temporary staff, or non-permanent contributors.

## Image Recovery Result

Article-specific images were recovered from the legacy WordPress media archive and uploaded to Sanity as tracked image assets.

The import helper rejects:

- corrupt/non-ASCII archive paths;
- known off-topic image matches;
- logo/favicon/placeholder matches;
- non-WordPress-upload image paths.

The women-inheritance article was manually mapped to a more relevant legacy inheritance image instead of a broader family-property image.

Detailed image mapping is recorded in `docs/SPRINT-10H-LEGACY-IMAGE-RECOVERY-MAP.csv`.

## Redirect Update

`next.config.mjs` was updated to replace temporary practice-area redirects with exact one-hop article redirects only for the 16 newly approved articles.

No redirects were added for unapproved Sprint 10H hidden drafts.

No Chaman Properties redirects were added.

## Local Test Result

Lint:

- Passed.
- Existing warning only: `scripts/migration/phase5c-import-top50-to-sanity.mjs` has an unused `keyField` variable.

Build:

- Passed using Node with the Windows system certificate store.
- Static generation completed with 94 pages.
- Blog detail route remains capable of fetching approved posts by slug at runtime.

## Deployment / Live QA Status

Pending Vercel redeploy after commit and push.

Live QA to complete after deployment:

- `/resources/blog`
- `/sitemap.xml`
- `/robots.txt`
- 16 newly approved article URLs
- 16 exact old URL redirects
- sample hidden draft URLs return 404 or remain non-public

## Launch Status

Sprint 10H is safe to push to `preview/chaman-law-firm-mvp` after commit.

Search Console/Bing resubmission should wait until live QA confirms:

- all 16 new article URLs return 200;
- sitemap includes the 16 new approved article URLs;
- redirects resolve one hop to exact restored articles;
- hidden drafts remain hidden.
