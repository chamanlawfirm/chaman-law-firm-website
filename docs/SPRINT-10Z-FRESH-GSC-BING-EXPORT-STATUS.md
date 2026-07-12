# Sprint 10Z Fresh GSC/Bing Export Status

Date: 2026-07-12

## Result

No fresh post-launch Google Search Console or Bing Webmaster export was found locally during Sprint 10Z.

The only local search export set still appears to be the existing June 20, 2026 Google Search Console export bundle under:

`docs/search-console-exports/`

Observed files:

- `Chart.csv`
- `Countries.csv`
- `Devices.csv`
- `Filters.csv`
- `Pages.csv`
- `Queries.csv`
- `Search appearance.csv`

No new Google indexing, Google 404, Google crawled-currently-not-indexed, Google page-with-redirect, Google redirect-error, Google performance pages, Bing crawl, Bing index, or Bing sitemap warning export was available in the project workspace.

## Import Action

No fresh export was imported.

## Principal Action Required

Please export the latest post-launch data from:

- Google Search Console: Pages, Not Found 404, Crawled currently not indexed, Page with redirect, Redirect error, Performance pages and queries.
- Bing Webmaster Tools: crawl errors, index coverage, sitemap status, and top pages where available.

Place the files in a clearly named local folder under `docs/` or provide their local paths for the next sprint.

## Current Safe Position

- Do not submit hidden draft URLs.
- Do not request indexing for draft, 404-by-design, or unapproved URLs.
- Continue inspecting only live production URLs, approved article URLs, sitemap URLs, and exact redirected legacy URLs.
