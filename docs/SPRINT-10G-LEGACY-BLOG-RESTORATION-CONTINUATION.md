# Sprint 10G - Legacy Blog Restoration Continuation

Date: 2026-06-30

## Resume State

- Branch: `preview/chaman-law-firm-mvp`
- Last committed baseline before this sprint: `8740eb9 chore: restore exact legacy article drafts for review`
- Sprint 10F partial local files were present and continued rather than overwritten.
- Production domain and DNS were not changed.
- Hostinger DNS was not touched.
- No secrets, environment values, webhook URLs, `wp-config.php`, SQL contents, or backup file contents were exposed.

## Backup Access

- External backup found at: `C:\Users\Progressive\OneDrive - CHAMAN LAW FIRM\CHAMAN DIGITAL ASSETS\WEBSITES PROJECTS\Legacy website (Old Wordpress backup) - June 28, 2026`
- SQL dump available: `u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz`
- Site archive available: `u169781131.chamanlawfirm-com.20260626153946.tar.gz`
- Archive listing confirms WordPress folders including `public_html`, `wp-admin`, `wp-content`, `wp-includes`, and `wp-content/uploads`.
- The backup remains an external read-only migration source and must not be committed.

## Image Recovery

- Created image recovery pipeline: `scripts/migration/sprint10g-legacy-restoration-pipeline.mjs`
- Generated image map: `docs/SPRINT-10G-LEGACY-IMAGE-RECOVERY-MAP.csv`
- Selected image files were extracted only to temporary working storage under `C:\tmp\chaman-sprint10g-images`.
- No raw upload folder, backup archive, SQL dump, or WordPress config file was staged or committed.
- Twelve restored articles now have article-specific Sanity image assets and descriptive alt text.

## Controlled Publication

The following restored articles were confirmed public-safe by automated checks, assigned Charles Chukwuma Nkwoka, Esq. as public author, given article-specific images, and approved for public visibility:

1. `statutory-right-of-occupancy-vs-customary-right`
2. `what-are-elements-of-tax-law`
3. `tax-administration-in-nigeria`
4. `difference-between-ownership-and-possession`
5. `community-development-associations-law`
6. `5-vital-role-of-consumer-protection-agencies`
7. `4-steps-on-how-to-deal-with-a-bad-landlordin`
8. `5-steps-on-how-to-obtain-restraining-order`
9. `child-support-and-maintenance-payment`
10. `legal-steps-to-take-when-our-land-has-been`
11. `steps-to-permanent-residency-in-nigeria`
12. `joinder-of-parties-misjoinder-of-parties`

Resulting approved public post count in Sanity: 25.

## Kept Hidden

The remaining restored drafts remain hidden pending lawyer review, image completion, or source recovery:

- `gain-nigerian-citizenship-by-marriage`
- `how-to-replace-a-lost-a-marriage-certificate`
- `rights-of-tenants-in-ogun-chaman-law-firm`
- `what-is-the-implication-of-quit-notice`
- `polygamy-and-multiple-marriages-in-nigeria`
- `taxation-of-the-construction-sector-in-nigeria`
- `sharing-of-property-after-divorce-in-nigeria`
- `challenges-facing-the-nigerian-court-system`

No hidden draft was intentionally exposed.

## Redirect Updates

Temporary redirects were replaced only for restored articles that are approved and public:

- `/4-steps-on-how-to-deal-with-a-bad-landlordin` -> `/resources/blog/4-steps-on-how-to-deal-with-a-bad-landlordin`
- `/joinder-of-parties-misjoinder-of-parties` -> `/resources/blog/joinder-of-parties-misjoinder-of-parties`
- `/statutory-right-of-occupancy-vs-customary-right` -> `/resources/blog/statutory-right-of-occupancy-vs-customary-right`
- `/5-steps-on-how-to-obtain-restraining-order` -> `/resources/blog/5-steps-on-how-to-obtain-restraining-order`
- `/child-support-and-maintenance-payment` -> `/resources/blog/child-support-and-maintenance-payment`
- `/legal-steps-to-take-when-our-land-has-been` -> `/resources/blog/legal-steps-to-take-when-our-land-has-been`
- `/steps-to-permanent-residency-in-nigeria` -> `/resources/blog/steps-to-permanent-residency-in-nigeria`
- `/what-are-elements-of-tax-law` -> `/resources/blog/what-are-elements-of-tax-law`
- `/tax-administration-in-nigeria` -> `/resources/blog/tax-administration-in-nigeria`
- `/difference-between-ownership-and-possession` -> `/resources/blog/difference-between-ownership-and-possession`
- `/community-development-associations-law` -> `/resources/blog/community-development-associations-law`
- `/5-vital-role-of-consumer-protection-agencies` -> `/resources/blog/5-vital-role-of-consumer-protection-agencies`

No redirect was pointed to the homepage. No redirect was pointed to a hidden article.

## Generated Artifacts

- `docs/SPRINT-10G-LEGACY-BACKUP-ACCESS-REPORT.md`
- `docs/SPRINT-10G-LEGACY-IMAGE-RECOVERY-MAP.csv`
- `docs/SPRINT-10G-LEGACY-BLOG-RESTORATION-MASTER.csv`
- `docs/sprint10g/sprint10g-restoration-result.json`

## Testing

- `npm run lint`: passed with one existing warning in `scripts/migration/phase5c-import-top50-to-sanity.mjs`.
- `npm run build`: passed with `NODE_OPTIONS=--use-system-ca`; build generated 94 static pages.
- Blog SSG output now includes 25 approved article paths under `/resources/blog/[slug]`.

## Search Console / Bing Follow-Up

- Inspect newly approved article URLs after deployment.
- Inspect the replaced old legacy URLs after redirects deploy.
- Request indexing selectively for approved articles only.
- Do not inspect hidden draft URLs.
- Export fresh 404/indexing data again in 48-72 hours.
- Submit or refresh `https://chamanlawfirm.com/sitemap.xml` in Bing Webmaster if not already refreshed.

## Remaining Risks

- Some restored drafts still require lawyer review and article-specific imagery.
- Several high-value legacy posts outside the 20 restored drafts still require deeper SQL/RankMath/media recovery.
- Live redirect QA must be repeated after the pushed branch deploys to production.

## Recommended Next Sprint

Sprint 10H should continue the same pipeline against the next 25-50 high-value legacy posts, with image recovery first, hidden Sanity drafts second, and controlled approval only after lawyer/SEO checks.
