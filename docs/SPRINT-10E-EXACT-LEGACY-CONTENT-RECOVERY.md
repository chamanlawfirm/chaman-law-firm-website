# Sprint 10E - Exact Legacy Content Recovery

## Scope

Sprint 10E continued post-launch SEO recovery after Sprint 10D. The focus was exact legacy content recovery, hidden Sanity draft restoration, approval safety, and redirect replacement readiness.

Production domain: `https://chamanlawfirm.com`

Branch: `preview/chaman-law-firm-mvp`

Repository: `chamanlawfirm/chaman-law-firm-website`

## Source Availability

Available and reviewed:

- `docs/search-console-exports/`
- `docs/SPRINT-10C-EMERGENCY-404-INVENTORY.csv`
- `docs/SPRINT-10D-DEEP-LEGACY-404-INVENTORY.csv`
- `docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`
- `docs/SPRINT-9M-REDIRECT-READINESS.csv`
- `docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-MIGRATION-REGISTER.csv`
- External RankMath export: `chamanlawfirmtoplawfirminnigeria_rank-math-2026-06-20_16-32-27.csv`
- External WordPress SQL backup: `Legacy website (Old Wordpress backup) - June 28, 2026/u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz`
- External uploads archive: `uploads.zip`

The SQL backup is accessible and contains `wp_posts`, `wp_postmeta`, taxonomy tables, and users. The full WordPress tar backup remains external/read-only and was not extracted or committed.

## Backup and Git Safety

The following remain ignored by `.gitignore`:

- `*.tar`
- `*.tar.gz`
- `*.zip`
- `*.sql`
- `*.sql.gz`
- `public_html/`
- `wp-admin/`
- `wp-content/`
- `wp-includes/`
- `wp-config.php`
- `Legacy website*/`
- `Old Wordpress backup*/`
- `backup*/`
- `backups*/`
- `migration-source/`
- `migration-sources/`

No backup archive, SQL dump, `wp-config.php`, secret, token, or environment file was staged or committed.

## Exact Recovery Selection

Created:

`docs/SPRINT-10E-EXACT-RECOVERY-SELECTION.csv`

Selection result:

- 25 high-value legacy URLs selected from the Sprint 10C/10D redirect inventories.
- 24 of the 25 selected URLs had exact WordPress post/page body content in the SQL backup.
- 1 selected URL, `obtaining-a-certificate-of-occupancy-c-of-o`, was not found as an exact matching SQL post/page slug in this pass.
- 20 highest-priority recoverable items were prepared as Sanity draft documents.

## Sanity Draft Restoration

20 exact legacy articles were restored to Sanity as draft documents with IDs beginning:

`drafts.chamanlawfirm.sprint10e.`

Controls applied:

- `_type = post`
- Public author forced to `Charles Chukwuma Nkwoka, Esq.`
- `lawFirmApproved = false`
- Canonical set to `https://chamanlawfirm.com/resources/blog/[legacy-slug]`
- Legacy slug preserved
- WordPress body converted into Sanity Portable Text
- Old WordPress footer/contact debris removed where detected
- General legal-education note added
- Consultation CTA added
- Practice-area internal link added
- FAQ placeholders added for review context

Verification result:

- Draft count: 20
- Unapproved count: 20
- Author-governed count: 20
- Approved/published count: 0

## Drafts Restored

Restored as hidden Sanity drafts:

1. `4-steps-on-how-to-deal-with-a-bad-landlordin`
2. `joinder-of-parties-misjoinder-of-parties`
3. `gain-nigerian-citizenship-by-marriage`
4. `statutory-right-of-occupancy-vs-customary-right`
5. `5-steps-on-how-to-obtain-restraining-order`
6. `what-are-elements-of-tax-law`
7. `tax-administration-in-nigeria`
8. `difference-between-ownership-and-possession`
9. `community-development-associations-law`
10. `child-support-and-maintenance-payment`
11. `how-to-replace-a-lost-a-marriage-certificate`
12. `legal-steps-to-take-when-our-land-has-been`
13. `rights-of-tenants-in-ogun-chaman-law-firm`
14. `5-vital-role-of-consumer-protection-agencies`
15. `what-is-the-implication-of-quit-notice`
16. `polygamy-and-multiple-marriages-in-nigeria`
17. `steps-to-permanent-residency-in-nigeria`
18. `taxation-of-the-construction-sector-in-nigeria`
19. `sharing-of-property-after-divorce-in-nigeria`
20. `challenges-facing-the-nigerian-court-system`

Review logs:

- `docs/sprint10e/sprint10e-draft-review.json`
- `docs/sprint10e/sprint10e-approval-candidates.json`

The generated full-body file `docs/sprint10e/sprint10e-prepared-drafts.json` was kept local and gitignored because it contains unapproved recovered article body text. The hidden Sanity drafts are the controlled review source.

## Approval Result

No recovered article was approved or published in Sprint 10E.

Reason:

- The exact legacy bodies still need lawyer/editorial review before public publication.
- Some recovered legacy image URLs are unavailable on the live domain.
- Recovered image sources were not attached to Sanity image fields in this sprint.
- Some articles cover sensitive procedural topics such as eviction, restraining orders, family law, tax, immigration, and court process.

This was intentional. Hidden draft restoration is complete; public approval remains blocked until legal review and image completion.

## Image Recovery Result

The SQL recovery found old image URL references for 10 of the 20 prepared drafts.

However:

- Tested legacy `wp-content/uploads` image URLs returned `403` from the live domain.
- External `uploads.zip` has a ZIP signature but could not be opened through the standard PowerShell ZIP reader because the central directory was unreadable.
- No large media archive was extracted.
- No raw WordPress media folder was committed.
- No Sanity image uploads were performed.

Next image step:

- Recover images from a valid `wp-content/uploads` archive or extracted backup.
- Upload only selected optimized images to Sanity.
- Add descriptive alt text.
- Use approved Chaman Law Firm fallback imagery where exact article image recovery is not possible.

## Redirect Replacement Result

No temporary redirect was replaced in Sprint 10E.

Reason:

- Redirect replacement is only safe after the exact article target is approved, public, returns 200, and appears in the sitemap.
- All recovered exact articles remain hidden drafts.

Current behavior was preserved:

- Old legacy URLs continue to redirect one-hop to relevant temporary practice-area targets.
- New exact article URLs remain 404 publicly until approval.
- Hidden drafts remain excluded from sitemap.

## Public Visibility QA

Sample hidden draft URLs returned 404:

- `/resources/blog/4-steps-on-how-to-deal-with-a-bad-landlordin`
- `/resources/blog/what-are-elements-of-tax-law`
- `/resources/blog/gain-nigerian-citizenship-by-marriage`

Sample old legacy URLs still redirect one-hop to live temporary targets:

- `/4-steps-on-how-to-deal-with-a-bad-landlordin/` -> `/practice-areas/property-real-estate-law`
- `/what-are-elements-of-tax-law/` -> `/practice-areas/corporate-commercial-law`
- `/gain-nigerian-citizenship-by-marriage/` -> `/practice-areas/immigration-services`

Sitemap checks:

- Recovered hidden draft slugs are not included.
- Approved public article behavior remains unchanged.

## Search Engine Follow-Up

Google Search Console:

1. Do not inspect hidden draft URLs yet.
2. Continue monitoring rescued legacy URL indexing.
3. After lawyer approval and publication, inspect each exact article URL.
4. After redirect replacement, inspect each old URL and confirm Google sees the one-hop redirect.
5. Export fresh 404/indexing data 48-72 hours after each redirect publication batch.

Bing Webmaster:

1. Add or verify the apex property `https://chamanlawfirm.com`.
2. Keep `https://www.chamanlawfirm.com`.
3. Submit `https://chamanlawfirm.com/sitemap.xml`.
4. Inspect homepage, `/resources/blog`, approved articles, and temporary redirect URLs.
5. Do not inspect hidden draft article URLs until they are approved and public.

## Next Gate

Before any Sprint 10E recovered article can go public:

1. Lawyer review body content for legal accuracy.
2. Remove or revise outdated legal/procedural statements.
3. Attach a Sanity image or approved fallback image.
4. Confirm SEO title, meta description, canonical, author, CTA, and internal links.
5. Set `lawFirmApproved=true` only for passing articles.
6. Verify public article URL returns 200.
7. Verify sitemap inclusion.
8. Replace only that article's temporary redirect with the exact article target.
