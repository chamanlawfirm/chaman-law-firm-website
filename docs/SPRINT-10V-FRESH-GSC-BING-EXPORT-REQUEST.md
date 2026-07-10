# Sprint 10V Fresh GSC/Bing Export Request

Generated: 2026-07-10

## Current Local Export Status

No fresh post-redirect Google Search Console or Bing Webmaster export was found in the project workspace.

The only local Search Console export folder found is:

`docs/search-console-exports/`

Those files are dated June 20, 2026 and should be treated as pre-launch or early migration reference data, not fresh post-Sprint-10T redirect evidence.

## Needed Google Search Console Exports

Export these after Google has had time to recrawl the Sprint 10T redirects:

- Pages / Indexing export.
- Not Found 404 export.
- Crawled - currently not indexed export.
- Page with redirect export.
- Redirect error export.
- Performance Pages export.
- Sitemap status export.

## Needed Bing Webmaster Exports

Export these after Bing has recrawled the sitemap:

- Crawl errors.
- Indexed pages.
- URL inspection results for approved article URLs.
- Sitemap warnings.
- Redirect warnings, if available.

## Handling Rules

- Do not include passwords, tokens, or private dashboard screenshots.
- Do not export hidden draft URLs for submission.
- Save exports into `docs/search-console-exports/` or a clearly dated subfolder.
- Prefer CSV/XLSX exports over screenshots.

## Manual Follow-Up

Once fresh exports are available, review:

- Legacy URLs still returning 404.
- Legacy URLs with impressions or clicks.
- Redirected URLs not yet recognized as redirected.
- Approved article URLs crawled but not indexed.
- Sitemap warnings or canonical mismatches.
