# Sprint 10J - Blog Performance Monitoring

Date: 2026-06-30

## Current Blog Growth Baseline

- Approved public posts before Sprint 10J: 61.
- Approved public posts after Sprint 10J Sanity approval: 81.
- Blog index route: `/resources/blog`.
- Sitemap route: `/sitemap.xml`.
- Robots route: `/robots.txt`.

## What To Monitor

### Blog Index

- `/resources/blog` should return 200.
- Pagination pages should return 200.
- Article cards should render titles, excerpts, authors, dates, and images.
- Pagination should remain usable as public post count grows.
- The blog index should not show hidden or unapproved drafts.

### Article Pages

- Newly approved article URLs should return 200.
- Article title should render correctly.
- Featured image should render.
- Public author should be Charles Chukwuma Nkwoka, Esq.
- Canonical URL should point to `https://chamanlawfirm.com/resources/blog/[slug]`.
- Consultation CTA should be present.
- No Chaman Properties content should appear.

### Sitemap

- Sitemap should return 200.
- Sitemap should use `https://chamanlawfirm.com`.
- Sitemap should include approved public articles only.
- Sitemap should exclude hidden drafts and preview URLs.
- Sitemap size remains well below sitemap-index threshold.

### Redirects

- Old approved legacy URLs should redirect one-hop to exact article targets.
- Hidden or unapproved article URLs should not be redirected to article targets.
- No old URL should dump to the homepage unless separately approved.
- No redirect loop should exist.

### Build Performance

- Build should complete successfully.
- Static page count is expected to grow as approved article count grows.
- Older long articles may require build-worker retries.
- If retries become frequent, review long Portable Text bodies and consider whether blog pages should rely less heavily on static generation.

## Current Risks

- Blog volume is growing quickly and build time may continue to increase.
- Some older restored posts have long bodies and may slow static page generation.
- A few hidden drafts remain blocked for legal wording, duplicate risk, placeholder/plugin debris, or image relevance.
- Some legacy images are low resolution but article-specific; these should be improved in later image-refresh sprints.

## Recommended Monitoring Cadence

- After every controlled approval batch: test blog index, pagination, newly approved URLs, old redirected URLs, sitemap, and robots.
- Weekly after launch: review Search Console/Bing crawl and indexing warnings.
- Monthly: review duplicate titles, thin content, image quality, and article cannibalization.
