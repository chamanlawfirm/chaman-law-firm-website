# Sprint 11A Fresh GSC/Bing Export Status

Date: 2026-07-12

## Result

No fresh post-launch Google Search Console or Bing Webmaster export was found locally during Sprint 11A.

The project still only contains the known local Google Search Console export set under:

`docs/search-console-exports/`

Observed export files remain:

- `Chart.csv`
- `Countries.csv`
- `Devices.csv`
- `Filters.csv`
- `Pages.csv`
- `Queries.csv`
- `Search appearance.csv`

No new local files were found for Google 404/not found, crawled-currently-not-indexed, page-with-redirect, redirect-error, fresh performance pages, Bing crawl/index, or Bing sitemap warnings.

## Import Action

No fresh export was imported.

## Principal Action Required

Please export the latest post-launch data from:

- Google Search Console: Pages, Not Found 404, Crawled currently not indexed, Page with redirect, Redirect error, Performance pages and queries.
- Bing Webmaster Tools: crawl errors, indexed pages, sitemap status, top pages, and redirect/index warnings where available.

Place the fresh exports in a clearly named local folder under `docs/`, or provide their local paths for the next sprint.

## Safety Position

- Do not submit hidden draft URLs.
- Do not request indexing for unapproved articles.
- Continue inspecting only production URLs, approved public article URLs, sitemap URLs, and exact redirected legacy URLs.
