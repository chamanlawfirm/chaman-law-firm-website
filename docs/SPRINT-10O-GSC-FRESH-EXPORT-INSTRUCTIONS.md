# Sprint 10O Fresh GSC Export Instructions

Generated: 2026-07-08T08:26:36.094Z

Wait 48-72 hours after Vercel deployment is re-enabled and the sitemap returns 200.

Export from Google Search Console:

- Pages/Indexing export.
- Not found 404 export.
- Crawled currently not indexed export.
- Performance pages export.
- Top pages by clicks and impressions.
- Redirected old URLs still appearing as errors.
- Any duplicate canonical, soft 404, or redirect error reports.

Do not export or inspect hidden Sanity draft URLs as if they were public targets.

Preferred file names:

- `gsc-pages-indexing-after-sprint10o.csv`
- `gsc-not-found-404-after-sprint10o.csv`
- `gsc-crawled-not-indexed-after-sprint10o.csv`
- `gsc-performance-pages-after-sprint10o.csv`

Manual note: if Vercel still shows `DEPLOYMENT_DISABLED`, resolve that first before exporting fresh search data.
