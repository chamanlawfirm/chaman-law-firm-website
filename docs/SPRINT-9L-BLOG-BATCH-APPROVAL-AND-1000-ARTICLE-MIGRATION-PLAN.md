# Sprint 9L - Blog Batch Approval and 1,000 Article Migration Plan

Date: 2026-06-27

## Scope

Sprint 9L completed the controlled fixing and approval of the next four migrated blog articles for Vercel preview publication. The work was limited to the Chaman Law Firm website project, the `preview/chaman-law-firm-mvp` branch, the `chamanlawfirm/chaman-law-firm-website` repository, and Sanity project `eeuefmhu` / dataset `production`.

No production domain was connected. No production deployment was triggered manually. No Google Search Console submission was made. No legacy redirects were activated.

## Articles Fixed and Approved

| Article | Slug | Status |
| --- | --- | --- |
| The Jurisdiction of Courts in Nigeria | `the-jurisdiction-of-courts-in-nigeria` | Fixed and approved |
| Proper Legal Steps to Evict a Tenant in Nigeria | `proper-steps-to-eviction-of-tenants` | Fixed and approved |
| Ogun State Tenancy Law: Rights, Rent, Notices and Eviction Procedure | `the-ogun-state-tenancy-law-chaman-law-firm` | Fixed and approved |
| How to Get Building Permit Approval in Ogun State | `building-permit-approval-in-ogun-state` | Fixed and approved |

The pilot article remains approved:

- `landlord-and-tenant-rights-in-nigeria`

The approved non-draft blog set after Sprint 9L is five articles total: the pilot plus the four listed above.

## Content Fixes Applied

### Global Fixes

- Public author updated to `Charles Chukwuma Nkwoka, Esq.`
- Legacy footer/contact blocks removed from the affected articles.
- Off-brand legacy publisher wording removed.
- Chaman Properties references removed.
- Placeholder text checks passed.
- SEO titles and meta descriptions rewritten in a professional law-firm style.
- Canonical URLs preserved under `https://chamanlawfirm.com/resources/blog/[slug]`.
- Published dates preserved and confirmed not future-dated as of 2026-06-27.
- Featured images and alt text preserved.
- Consultation CTAs added through internal links and page template support.
- FAQs added for answer-engine and search-readiness support.
- Categories were tightened where needed.

### Legal-Safety Fixes

The articles were rewritten conservatively as public legal education:

- Jurisdiction article avoids overbroad court-jurisdiction claims and recommends early legal advice before filing.
- Eviction article strongly warns against self-help eviction and emphasizes lawful notices and court process.
- Ogun tenancy article avoids unsupported absolute statutory claims and frames guidance as fact- and state-law dependent.
- Building permit article avoids presenting agency/process details as permanently fixed and tells readers to verify current official requirements.

## Sanity Content Changes

Sanity document changes were made to these public-safe post IDs:

- `chamanlawfirm-phase5c-the-jurisdiction-of-courts-in-nigeria`
- `chamanlawfirm-phase5c-proper-steps-to-eviction-of-tenants`
- `chamanlawfirm-phase5c-the-ogun-state-tenancy-law-chaman-law-firm`
- `chamanlawfirm-phase5c-building-permit-approval-in-ogun-state`

Author document updated:

- `209c9423-a10c-429d-b4b9-1a7ba8afeaa5`
- Display name changed to `Charles Chukwuma Nkwoka, Esq.`
- Public bio cleaned to remove Chaman Properties wording and legacy tracking parameters from the firm link.

Each of the four article documents now has:

- `lawFirmApproved=true`
- body content present
- SEO title present
- meta description present
- canonical present
- `publishedAt` present and not future-dated
- featured image present
- alt text present
- internal links present
- FAQs present
- practice/category relationships present

## Redirect Readiness Notes

Redirects remain pending. Do not activate until final launch approval.

| Old URL | New URL | Status |
| --- | --- | --- |
| `/the-jurisdiction-of-courts-in-nigeria/` | `/resources/blog/the-jurisdiction-of-courts-in-nigeria` | Pending |
| `/proper-steps-to-eviction-of-tenants/` | `/resources/blog/proper-steps-to-eviction-of-tenants` | Pending |
| `/the-ogun-state-tenancy-law-chaman-law-firm/` | `/resources/blog/the-ogun-state-tenancy-law-chaman-law-firm` | Pending |
| `/building-permit-approval-in-ogun-state/` | `/resources/blog/building-permit-approval-in-ogun-state` | Pending |

Activation condition for each redirect:

1. Article is approved in Sanity.
2. Article URL returns 200 on preview.
3. Metadata and canonical are correct.
4. Article appears in sitemap.
5. Final launch approval has been given.

## Scalable 1,000 Article Migration Plan

The legacy archive is too large to migrate manually one article at a time. The recommended migration model is a batch pipeline that selects the strongest 1,000 legacy articles, imports them as hidden drafts/public-safe posts, runs automated QA, assigns lawyer review, approves in batches, and activates redirects only after each target article is visible and indexable.

### Source Inventory

Collect and normalize the following source files:

- WordPress XML export for posts, pages, authors, categories, tags, and dates.
- WordPress uploads/media folders.
- RankMath export for SEO title, meta description, canonical, focus keyword, noindex, schema, and redirects.
- Google Search Console export for clicks, impressions, CTR, average position, pages, and queries.
- Legacy sitemap URLs.
- Existing redirect maps.
- Local migration registers already produced in `docs/` and `docs/phase5c/`.
- Legacy media recovery folders.

### Article Selection Rules

Prioritize:

- Top organic traffic articles.
- High-impression articles with strong SEO opportunity.
- Property and real estate law.
- Landlord/tenant and eviction.
- CAC/company registration and corporate compliance.
- Probate, wills, and inheritance.
- Litigation and dispute resolution.
- Debt recovery.
- Immigration.
- Notary and legal documentation.
- Corporate and commercial law.
- Family and employment law where content is current and safe.

Exclude or archive:

- Chaman Properties or luxury property sales content.
- Duplicate articles.
- Thin/weak articles with no clear search demand.
- Outdated legal claims that require full rewriting.
- Content with unsupported promises, guarantees, or misleading advice.
- Content unrelated to Chaman Law Firm services.
- Content with no recoverable source, slug, or SEO value.

### Migration Preservation Rules

For each selected article:

- Preserve original slug wherever safe and possible.
- Preserve legacy published date where appropriate.
- Preserve SEO title if strong; rewrite if spammy, weak, or off-brand.
- Preserve meta description if accurate; rewrite if truncated, outdated, or misleading.
- Preserve canonical intent under the new `chamanlawfirm.com/resources/blog/[slug]` URL.
- Preserve featured image and alt text where law-firm appropriate.
- Replace Chaman Properties or luxury imagery with approved law-firm imagery.
- Preserve relevant internal links and update them to new routes.
- Public author should be `Charles Chukwuma Nkwoka, Esq.` for migrated legacy content unless the principal approves another author model.
- Add practice-area/category relationships.
- Add consultation CTAs.
- Add FAQs/AEO answer blocks only where legally safe.
- Import all articles initially with `lawFirmApproved=false`.

### Batch Structure

Batch A: current top 50

- Complete legal/editorial QA.
- Confirm image coverage.
- Approve in small groups.
- Activate redirects only after each article is visible.

Batch B: next 100

- Apply automated QA from Batch A.
- Prioritize property, tenancy, CAC, probate, litigation, debt recovery, immigration, notary, and corporate law.

Batch C: next 250

- Process through automated migration scoring.
- Assign lawyer review by practice area.

Batch D: remaining priority 600

- Migrate only after automated exclusion checks remove weak, duplicate, unsafe, or irrelevant content.

Archive/rewrite pool:

- Remaining legacy posts should be archived, consolidated, redirected to stronger equivalents, or rewritten later only where SEO or client value justifies the work.

### Working Command Plan

The following command plan should be implemented as scripts before the large import proceeds. Names are proposed and can be adjusted to match the repository conventions.

1. Build source inventory:

```powershell
node scripts/migration/build-legacy-source-inventory.mjs `
  --wordpress-export ".\migration-source\wordpress-export.xml" `
  --rankmath-export ".\migration-source\rankmath-export.csv" `
  --gsc-pages ".\migration-source\gsc-pages.csv" `
  --legacy-sitemap ".\migration-source\legacy-sitemap.xml" `
  --media-root ".\Legacy Media Recovery" `
  --out ".\docs\migration\legacy-source-inventory.csv"
```

2. Score and select the best 1,000 articles:

```powershell
node scripts/migration/score-legacy-articles.mjs `
  --inventory ".\docs\migration\legacy-source-inventory.csv" `
  --priority-keywords ".\docs\migration\priority-legal-keywords.csv" `
  --exclude-keywords ".\docs\migration\excluded-property-sales-keywords.csv" `
  --out ".\docs\migration\top-1000-selection.csv"
```

3. Create public-safe Sanity import payloads with `lawFirmApproved=false`:

```powershell
node scripts/migration/create-sanity-import-payloads.mjs `
  --selection ".\docs\migration\top-1000-selection.csv" `
  --media-map ".\docs\migration\media-recovery-map.csv" `
  --out ".\docs\migration\sanity-import-payloads"
```

4. Run automated quality checks:

```powershell
node scripts/migration/qa-sanity-import-payloads.mjs `
  --payload-dir ".\docs\migration\sanity-import-payloads" `
  --out ".\docs\migration\qa-report.csv"
```

5. Import approved payload candidates as hidden Sanity posts:

```powershell
npx sanity dataset import .\docs\migration\sanity-import-payloads\batch-a.ndjson production --replace
```

6. Produce lawyer review packs:

```powershell
node scripts/migration/create-lawyer-review-packs.mjs `
  --qa ".\docs\migration\qa-report.csv" `
  --batch "A" `
  --out ".\docs\migration\lawyer-review-batch-a.md"
```

7. Approve only lawyer-cleared articles:

```powershell
node scripts/migration/approve-reviewed-articles.mjs `
  --approved ".\docs\migration\approved-batch-a.csv" `
  --dataset production
```

8. Generate redirect activation map only after preview verification:

```powershell
node scripts/migration/generate-redirect-activation-map.mjs `
  --approved ".\docs\migration\approved-batch-a.csv" `
  --preview-base "https://chaman-law-firm-website.vercel.app" `
  --out ".\docs\migration\redirect-activation-batch-a.csv"
```

### Automated QA Checklist

Each article should fail import or approval if it contains:

- `Chaman Properties`
- `chamanproperties`
- luxury-property sales language
- placeholder/lorem/TODO text
- old Gmail/phone/address footer blocks
- missing slug
- missing body
- missing SEO title or meta description
- missing canonical
- missing featured image or alt text
- missing author
- missing practice/category relationship
- future-dated `publishedAt`
- no consultation/contact CTA
- unsafe self-help, guarantee, or misleading legal wording

### Approval Workflow

1. Import as `lawFirmApproved=false`.
2. Run automated QA.
3. Assign lawyer review by practice area.
4. Fix article content and SEO.
5. Confirm author governance.
6. Approve in small batches.
7. Verify preview URL returns 200.
8. Confirm metadata, canonical, image, author, CTA, and sitemap inclusion.
9. Activate one-hop 301 redirect only after the target article is live.

### Redirect Strategy

- Use one-hop 301 redirects only.
- Prefer old URL to `/resources/blog/[same-slug]`.
- Do not redirect old articles to the generic blog homepage unless no equivalent exists and the principal approves.
- Do not activate redirects before the target article is live.
- Keep a redirect log with old URL, new URL, approval date, preview verification date, launch status, and Search Console monitoring status.

## Current Go/No-Go

- Go for Vercel preview QA after preview redeploy/cache refresh.
- No-Go for production domain connection.
- No-Go for Search Console submission.
- No-Go for legacy redirect activation until final launch approval.
