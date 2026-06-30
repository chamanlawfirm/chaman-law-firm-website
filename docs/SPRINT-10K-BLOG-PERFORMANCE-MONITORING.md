# Sprint 10K - Blog Performance Monitoring

Date: 2026-06-30

## Current Baseline

- Production domain: `https://chamanlawfirm.com`.
- Approved public blog posts: 101.
- Latest local production build: 170 static pages generated.
- Blog index: `/resources/blog`.
- Sitemap: `/sitemap.xml`.
- Robots: `/robots.txt`.
- Blog query payload fix from Sprint 10J remains in place: list and related-post reads use a lighter projection, while article pages still fetch full body content.

## Routes To Monitor

- `https://chamanlawfirm.com/`
- `https://chamanlawfirm.com/resources/blog`
- `https://chamanlawfirm.com/resources/blog?page=2`
- `https://chamanlawfirm.com/resources/blog?page=3`
- `https://chamanlawfirm.com/sitemap.xml`
- `https://chamanlawfirm.com/robots.txt`

## Expected Behaviour

- Blog index returns 200.
- Pagination returns 200.
- Article cards render title, excerpt, date, author, reading time, and image.
- Newly approved articles return 200.
- Old restored URLs redirect one-hop to exact article targets.
- Hidden drafts remain 404 and are not in sitemap.
- Sitemap contains production URLs only.
- Robots points to production sitemap and blocks `/studio` and `/api`.

## Performance Watch Items

- Build time will grow as static article count grows.
- Sitemap remains far below sitemap-index threshold at 101 public posts.
- Repeated image groups should be improved, but they are not a technical blocker.
- Sanity query payload warnings should not return after the `src/lib/cms.ts` list-query optimization.
- If build warnings return, inspect list/related queries before changing content.

## Batch Safety Rule

Continue approving legacy articles in controlled groups. Recommended batch size: 15 to 25 articles, with exact redirects only after each article is public, live, indexable, and in the sitemap.

## Manual Monitoring Cadence

- Immediately after each batch: blog, pagination, new articles, redirects, sitemap, robots.
- Weekly: Search Console and Bing coverage report.
- Monthly: duplicate/cannibalization, image diversity, metadata polish, and high-impression underperformers.
