# Sprint 10L - Ranking Priority Source Review

Date: 2026-07-01

## Sources Used

- `docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv`
- `docs/SPRINT-10I-*`, `docs/SPRINT-10J-*`, and `docs/SPRINT-10K-*` recovery outputs
- RankMath export referenced by the migration helper
- WordPress SQL backup, read-only
- WordPress media archive, read-only
- Current `next.config.mjs` redirect map
- Live production checks for `https://chamanlawfirm.com`

## Source Reliability

| Source | Reliability | Notes |
| --- | --- | --- |
| Top 1,000 manifest | High | Best available ranked source because it combines legacy URL, click, impression, category, and migration-decision signals. |
| RankMath export | High for metadata | Used for SEO title, meta description, focus keyword, and Open Graph image hints where available. |
| WordPress SQL backup | High for body recovery | Treated as the safest source for legacy body, slug, dates, and post IDs. |
| WordPress media archive | High for image recovery | Used read-only to match article-specific image paths from SQL, body HTML, and RankMath fields. |
| Existing redirect map | High | Used to avoid redirect chains and avoid replacing redirects for hidden/unapproved targets. |
| Search Console/Bing manual data | Pending | Fresh post-launch exports are still needed after the restored content settles. |

## Priority Method

Priority was determined by:

1. Legacy click/impression value.
2. Legal relevance to Chaman Law Firm practice areas.
3. Recoverable body content from the WordPress backup.
4. Recoverable article-specific image evidence.
5. Current redirect or 404 risk.
6. SEO metadata availability.
7. Legal/public-safety suitability.
8. Duplicate and cannibalization risk.

## Exclusions

Excluded or kept hidden:

- Articles with placeholder/plugin debris.
- Articles with possible eviction/self-help risk requiring lawyer review.
- Articles with Chaman Properties, luxury-sales, casino, betting, or off-brand signals.
- Articles with missing body or weak source confidence.
- Articles with missing article-specific image where public approval would create a weak result.
- Static/non-blog URLs, which were moved to the static authority inventory instead of being forced into the blog.

## Sprint 10L Finding

The dry-run selected 100 recoverable legacy posts and identified 44 automated approval candidates. A controlled list of 40 was prepared, but Sanity write permissions blocked actual draft/public creation. No redirects were activated because no new Sprint 10L article became publicly live.
