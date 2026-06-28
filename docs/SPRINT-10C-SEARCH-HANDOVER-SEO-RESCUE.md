# Sprint 10C Search Handover and Emergency Legacy 404 SEO Rescue

Date: 2026-06-28

## Bing Canonical Property Guidance

The canonical production property is:

`https://chamanlawfirm.com`

In Bing Webmaster Tools:

1. Keep the existing `www.chamanlawfirm.com` property for history/reference.
2. Add or verify the canonical apex property: `https://chamanlawfirm.com`.
3. If Google Search Console import fails or reports nothing to import, use manual Bing verification.
4. Submit: `https://chamanlawfirm.com/sitemap.xml`.
5. Inspect the homepage, `/resources/blog`, top approved articles, and the emergency fixed legacy URLs.

## Source Inventory Used

- Sprint 10B live-domain and redirect result.
- Sprint 9M Top 1,000 legacy blog selection manifest.
- Sprint 9M redirect readiness CSV.
- SEO Master Migration Roadmap.
- Phase 5B Top 50 migration register.
- Phase 5B redirect map.
- Current live production URL tests.
- Principal-observed Google-result patterns for family-law and free-advice pages.

The registered legacy WordPress backup was not accessible from this execution environment at the registered path, so no backup files were read or copied in this sprint.

## Emergency Fix Policy

This sprint did not mass-approve articles and did not route 404s to hidden Sanity posts.

Emergency redirects were added only when:

- the old URL was specific,
- the old URL returned 404 on production,
- there was Principal-observed or migration/export evidence,
- a relevant live replacement page already existed,
- the target was not Chaman Properties,
- the target was not the homepage,
- the redirect could be tested as a one-hop permanent redirect.

## Content Recovery Notes

Several rescued URLs should still be recovered as full articles later, especially high-click family, property, probate, and immigration topics. The emergency redirect points users and search engines to a relevant live practice page while legal/editorial recovery continues.

For any page using "free legal advice" language, future recovery must avoid implying that all legal services are free. Use safer wording such as "request an initial enquiry" or "book a consultation."

## Emergency Redirect Batch

See `docs/SPRINT-10C-EMERGENCY-404-INVENTORY.csv`.

The batch contains 25 specific legacy 404 URLs, including the Principal-observed family-law and free-advice patterns.

## Google Search Console Follow-Up

After deployment and live redirect testing:

1. Inspect each newly fixed old URL.
2. Confirm Google sees the permanent redirect.
3. Inspect the live target practice pages.
4. Request indexing where appropriate.
5. Do not repeatedly request indexing for the same URL.
6. Continue monitoring 404 reports for newly surfaced high-value URLs.

## Bing Follow-Up

After canonical property verification:

1. Submit `https://chamanlawfirm.com/sitemap.xml`.
2. Inspect `https://chamanlawfirm.com/`.
3. Inspect `https://chamanlawfirm.com/resources/blog`.
4. Inspect top approved articles.
5. Inspect selected newly fixed old URLs.

## Remaining SEO Risks

- Google may continue surfacing old URLs not yet in the emergency batch.
- Some high-value legacy articles remain hidden because they still need legal review, image recovery, or source recovery.
- The exact legacy backup path was not accessible locally in this execution environment.
- Search Console 404 exports should be reviewed daily for the first 7 days after launch.

## Recommended Next Sprint

Sprint 10D should focus on:

- importing Search Console 404 exports,
- confirming exact old URLs from Google/Bing,
- recovering the next 25-50 high-value legacy legal articles,
- approving only legally safe recovered posts,
- replacing temporary practice-page redirects with exact article redirects once target articles are live.
