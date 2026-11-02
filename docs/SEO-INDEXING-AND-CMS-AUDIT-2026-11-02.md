# Chaman Law Firm — Live SEO, indexation, CMS and legacy URL audit
Audit date: 2026-11-02 (Nigeria). Sources: connected Google Search Console / GSC Wizard, GitHub source, Vercel deployment and attempted Sanity access.

## Verified Search Console performance
Last 28 settled days through 2026-10-30:
- Total clicks: 1,223
- Total impressions: 84,923
- CTR: 1.44%
- Impression-weighted average position: 8.04
- Data is site-wide from Search Console; do not sum top-row values to reconstruct total.

High-impact organic query:
- cac public search: 14,704 impressions; 15 clicks; CTR 0.102%; mean position 7.00.
The corresponding article /resources/blog/cac-public-search-guide-nigeria receives 17,210 impressions across all its queries, 20 clicks, CTR 0.116%, mean position 7.15.
Action: improve existing page's title/snippet relevance, factual guidance, internal linking and qualified conversion. Do not create a duplicate article.

Other observed pages:
- /resources/blog/landlord-and-tenant-rights-in-nigeria — 101 clicks; 4,227 impressions.
- /resources/blog/how-to-change-name-with-deed-poll — 72 clicks; 1,516 impressions.
- /resources/blog/the-ogun-state-tenancy-law-chaman-law-firm — 72 clicks; 865 impressions.
- /resources/blog/complete-guide-to-probate-registry-in-lagos — 22 clicks; 918 impressions.

## Google URL Inspection API — 2026-11-02
- / : PASS, submitted and indexed; last crawl 2026-10-30.
- /practice-areas/property-real-estate-law : PASS, submitted and indexed; last crawl 2026-10-25.
- /resources/blog/cac-public-search-guide-nigeria : PASS, submitted and indexed; last crawl 2026-10-29.
- /lawyer-in-ikeja : NEUTRAL, URL unknown to Google; newly published, not yet indexed.
- /law-firm-in-arepo : NEUTRAL, URL unknown to Google; newly published, not yet indexed.
No evidence that the location pages are blocked; unknown to Google is not the same as a crawl refusal.

## Sitemap and indexing actions
- Existing submitted sitemap: https://chamanlawfirm.com/sitemap.xml
- Search Console reported 639 submitted web URLs at its 2026-10-29 download and 2 warnings, 0 errors.
- Re-submitted this sitemap on 2026-11-02; Google accepted it, but fetching/processing was pending. The initial no-warnings acknowledgment is NOT proof old warnings are repaired.
- 12 priority URLs added to the connected GSC Wizard Indexing Tracker (two new location pages plus ten important pages). Indexing tracker monitors status; it cannot force indexing.

## Legacy blog and duplication investigation
- /resources/blog/[slug] fetches published content through src/lib/cms.ts (Sanity integration).
- There are 4 known duplicate-blog slug redirects in src/data/duplicate-blog-redirects.ts.
- There are 9 known legacy fallback redirects in src/data/legacy-blog-fallback-redirects.ts.
- The old legacy inventory of approximately 1,000 posts has not been supplied as a machine-readable complete source in the accessible repository. A URL-by-URL diff, recovery of missing articles and confirmed publication dates cannot be certified.
- Do not delete or redirect trafficked legacy pages until backlink/traffic evidence and destinations have been verified.
- Google Search Console still has traffic for both /blog/... and /resources/blog/... variants of the securities commission article, a canonical/legacy-routing candidate for inspection.
- The generated sitemap route count and the GSC sitemap submitted count measure different things and are not proof of a discrepancy alone.

## Sanity CMS blocking dependency
- Application configured for Sanity project eeuefmhu, production dataset.
- The connected Sanity account currently sees other projects but not eeuefmhu.
- Sanity tool returned explicit authorization error: 'project eeuefmhu is outside this connection's current Sanity organization scope.'
- Authorize the Sanity MCP OAuth application for the organization owning eeuefmhu. If organization settings block third-party applications, an administrator must allow it under Manage > organization > Settings > OAuth apps > Application access.
- Until this is authorized, direct CMS article inventory, duplicate-body scans and CMS write operations cannot be honestly certified complete.

## Implementation checks and pending quality controls
- Two location pages in /lawyer-in-ikeja and /law-firm-in-arepo were published to the production-alias deployment and use real firm image assets and source-defined verified office details.
- Vercel build of deployment dpl_FPzvJQraguWqCQEUcVaYnmHaRdm4 passed Next.js compile / TypeScript and produced 237 static pages; production status READY.
- Browser-based external URL rendering checks did not return usable HTML in this session. Do not mark mobile and desktop live visual QA as passed.
- Original Nigeria-themed illustration library and practice-specific visual assets remain incomplete.
- Accessible user-level GA4 and CRM conversion measurements were not verified here; no conversions or commercial ROI should be fabricated.
- Google ranking cannot be guaranteed, nor indexing forced.

## Next mandatory actions once Sanity access is granted
1. Export paginated CMS posts with slug, title, publication status, original URL, canonical, excerpts, headings, body length and image references.
2. Diff against the old WordPress/legacy URL export and GSC landing page data; protect URLs with ranking/backlinks.
3. Identify missing posts, duplicated intent/body, orphans and invalid canonical relationships.
4. Improve CAC and other high-impression low-CTR legacy articles *in place*, with client-facing guides and natural consultation pathways.
5. Verify all page templates visually in a real mobile/desktop browser, test conversions end to end and inspect analytics instrumentation.
6. Validate 100 keyword-to-URL mapping with GSC page/query intersection and eliminate unsupported keyword-location assertions.
7. Inspect new location URLs after Google recrawls; verify if sitemap warnings clear.

This report deliberately distinguishes completed verified actions from blocked or not-yet-verified work.
## Additional completed legacy and search inventory investigation
- Queried 1,000 top-page rows from connected GSC; **762 page rows returned, covering 100% of Search Console clicks and impressions in the period**. These are observed search-visible URLs, not a complete inventory of unpublished/unindexed CMS content.
- Repository lists **499 legacy blog activation slugs** in src/data/legacy-blog-redirect-slugs.ts. This is an in-repository recovery set, not an independently verified original WordPress export.
- Repository src/data/legacy-static-redirects.ts currently contains **388 explicit path rules**, of which **186 point to /consultation**. Flag these for careful manual semantic destination review; blanket redirection of informational articles to the consultation page can be inappropriate for users and harmful to search relevance. Do NOT replace them without determining original title/content and proper page matches.
- Additional emergency redirects exist in next.config.mjs. Counts from separate sources may overlap, and no aggregate unique total is claimed.
- GSC shows both /blog/functions-of-the-securities-and-exchange-commission-in-nigeria and /resources/blog/functions-of-the-securities-and-exchange-commission-in-nigeria receiving impressions and clicks (15 and 9 clicks respectively on the base URLs); check canonical/redirect implementation after CMS access. This is a verified dual-path visibility concern, not proven duplicate content.
