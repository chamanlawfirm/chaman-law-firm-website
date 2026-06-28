# Sprint 10D - Deep Legacy 404 Recovery and Bing Apex Handover

Date: 2026-06-28

## Scope

Sprint 10D continues the post-launch SEO rescue work for the Chaman Law Firm website after production domain cutover. The sprint focused on Search Console export import, high-value legacy 404 triage, safe redirect expansion, backup protection, and Bing handover preparation.

Production domain: `https://chamanlawfirm.com`

Git branch: `preview/chaman-law-firm-mvp`

Repository: `chamanlawfirm/chaman-law-firm-website`

## Source Inputs Reviewed

- Google Search Console performance export from `chamanlawfirm.com-Performance-on-Search-2026-06-20.zip`
- Extracted Search Console CSV files under `docs/search-console-exports/`
- RankMath export available outside the project as a read-only migration source
- Sprint 9M Top 1,000 legacy blog selection manifest
- Sprint 10C emergency 404 inventory and search handover report
- Production live URL checks against `https://chamanlawfirm.com`
- Legacy WordPress backup registration from Sprint 10A

## Search Console Import Result

The Search Console export was imported into:

`docs/search-console-exports/`

Imported files:

- `Chart.csv`
- `Countries.csv`
- `Devices.csv`
- `Filters.csv`
- `Pages.csv`
- `Queries.csv`
- `Search appearance.csv`

The primary working source for this sprint was `Pages.csv`, which contains the legacy URL performance rows used to select the next rescue set.

## Legacy Backup Safety

The legacy WordPress backup remains an external read-only source and was not committed. The extracted full backup, compressed SQL backup, WordPress archives, media archives, and private configuration files must not be staged, uploaded to Vercel, or committed.

Additional ignore protection was added for:

- SQL dump files
- Compressed SQL dump files
- Migration source folders
- Alternate lowercase legacy backup folder naming

The backup can support future controlled recovery of exact article bodies, old image paths, media files, alt text, internal links, publication dates, and redirect evidence. It does not block the current redirect rescue work.

## Deep Legacy 404 Inventory

The Sprint 10D inventory is available at:

`docs/SPRINT-10D-DEEP-LEGACY-404-INVENTORY.csv`

Inventory result:

- 70 legacy URLs are documented in the Sprint 10D inventory.
- 25 rows preserve the Sprint 10C emergency rescue set.
- 45 additional high-value legacy URLs were selected from Search Console rows.
- All 45 newly selected URLs returned `404` before Sprint 10D redirect work.
- All 45 newly selected URLs have clear legal or law-firm service intent.
- No Chaman Properties URLs were selected.
- No luxury property sales pages were selected.
- No homepage dumping was used.
- No catch-all redirect was used.
- Each URL was mapped to the closest live law-firm practice-area page.

## Redirect Implementation

The newly selected 45 URLs were added as a separate `deepLegacy404Redirects` group in `next.config.mjs`.

Redirect behavior:

- Both trailing-slash and non-trailing-slash versions are covered.
- Redirect type is permanent.
- Expected production response is a one-hop 308 redirect to a live page.
- All targets are existing law-firm routes.
- Existing Sprint 10B approved article redirects and Sprint 10C emergency redirects were preserved.

This Sprint 10D batch is intentionally temporary from a content strategy perspective. If exact restored articles are later published and legally approved, each affected redirect should be replaced with an exact old URL to `/resources/blog/[same-or-approved-slug]` redirect.

## Exact Article Restoration Status

No additional legacy article was published in this sprint.

Reason:

- The selected URLs need exact body recovery from the WordPress backup, XML export, SQL export, or source HTML.
- The current safety rule requires legal review before public publication.
- Publishing recovered legal content without confirming current accuracy would create avoidable legal and reputation risk.

Future restoration path:

1. Recover exact article body and metadata from the legacy backup or WordPress XML export.
2. Recover original image path or assign approved law-firm image.
3. Remove outdated or unsafe legal assertions.
4. Remove Chaman Properties or sales language if present.
5. Set public author to `Charles Chukwuma Nkwoka, Esq.`
6. Import into Sanity as `lawFirmApproved=false`.
7. Run legal/editorial review.
8. Approve only after body, metadata, image, CTA, author, and legal-safety checks pass.
9. Replace the temporary practice-area redirect with exact article redirect only after the new article is live, indexable, and included in the sitemap.

## Search Console Follow-Up

After the Sprint 10D deployment is live:

1. Confirm the 45 legacy URLs redirect one-hop to their mapped targets.
2. Re-submit `https://chamanlawfirm.com/sitemap.xml` in Google Search Console if needed.
3. Inspect the homepage, blog index, sitemap, and several newly rescued legacy URLs.
4. Monitor 404 reports over the next 48 to 72 hours.
5. Export fresh 404/page indexing data before the next rescue sprint.

## Bing Apex Handover

Use Bing Webmaster Tools after production deployment verification.

Recommended steps:

1. Confirm or add the apex property: `https://chamanlawfirm.com`.
2. Do not submit the Vercel preview URL.
3. Confirm `https://www.chamanlawfirm.com` resolves or redirects cleanly to the apex.
4. Submit `https://chamanlawfirm.com/sitemap.xml`.
5. Inspect the homepage.
6. Inspect `/resources/blog`.
7. Inspect several approved article URLs.
8. Inspect several Sprint 10D rescued legacy URLs after deployment.
9. Monitor crawl errors and indexing status.

## Meta Description Warning Review

The live homepage, about page, blog index, key practice areas, top property service pages, and 13 approved public articles were sampled for meta description coverage.

Result:

- Homepage, about page, practice areas, blog index, and approved article descriptions were present.
- The approved article descriptions sampled were within a reasonable range for search snippets.
- Three high-value property service pages had short summaries that could contribute to Bing's meta-description warning:
  - `/practice-areas/property-real-estate-law/property-verification`
  - `/practice-areas/property-real-estate-law/property-due-diligence`
  - `/practice-areas/property-real-estate-law/governors-consent`

Action:

- The three service summaries were expanded with conservative, service-specific language.
- No broad metadata rewrite was performed.
- No approved article metadata was changed.

## Remaining Recovery Queue

The following categories remain for future controlled restoration:

- Exact article body recovery from WordPress backup or XML export.
- Original featured-image recovery from `wp-content/uploads` or media archives.
- RankMath title/meta matching for selected legacy posts.
- Old internal-link rewriting.
- Legal review of outdated procedure/statutory statements.
- Replacement of temporary practice-area redirects with exact article redirects where exact articles are restored and approved.
- Fresh GSC 404 export review after the Sprint 10D redirects have been crawled.

## Launch Boundary

Sprint 10D does not change DNS, Hostinger, email records, production domain settings, Search Console ownership, Bing ownership, Sanity approval status, or lead-delivery secrets.

Redirects may be deployed because they are one-hop, service-relevant, and do not expose unapproved content. Search-engine manual submissions should happen only after production confirms the new redirect batch is live.
