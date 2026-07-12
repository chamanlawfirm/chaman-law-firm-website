# Sprint 11D First Urgent Batch QA

Date: 2026-07-13

## Strategy

This sprint pivots legacy recovery beyond blog migration. The first urgent implementation batch is intentionally limited to exact, low-risk old URLs that already have live equivalents:

- Lawyer profile URL to live lawyer profile.
- Governor's Consent authority URLs to the live Governor's Consent service page.
- Employment, notary, immigration, corporate, ADR, and media URLs to exact live practice/static pages.

No hidden draft is used as a redirect target.
No homepage fallback is used.
No Chaman Properties image/content is used.

## Batch Size

- Redirect sources selected: 16
- GSC evidence covered by this urgent batch: 279 clicks and 33736 impressions in the local Pages.csv export.

## Sitemap / Robots Baseline

- Sitemap fetch status: 200
- Robots fetch status: 200
- Sitemap contains preview URLs: no
- Robots references production sitemap: yes

## Important Limitation

The workspace does not contain fresh post-launch GSC/Bing exports or a featured-snippet export. Featured-snippet evidence is therefore marked as unavailable unless inferred only as a high-ranking candidate from average position.
