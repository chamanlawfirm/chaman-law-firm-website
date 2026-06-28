# Sprint 10B Post-Launch Monitoring Plan

Date: 2026-06-28

## Launch Baseline

- Production domain: `https://chamanlawfirm.com`
- Canonical domain: `https://chamanlawfirm.com`
- `www.chamanlawfirm.com` should redirect to the apex domain.
- DNS and SSL have been confirmed before redirect activation.
- Live lead delivery must remain monitored after launch.
- Only the 13 approved legacy article redirects are eligible for activation.
- Search Console and Bing submissions should happen only after redirects are tested.

## Day 0 Checks

- Confirm homepage returns 200.
- Confirm SSL is valid.
- Confirm `www` redirects cleanly to apex.
- Confirm `/sitemap.xml` returns 200 and uses production URLs.
- Confirm `/robots.txt` allows public crawling and blocks `/studio` and `/api`.
- Confirm consultation, contact, newsletter, and download leads reach Make.com, Google Sheet, and Gmail.
- Confirm each approved redirect is one-hop and lands on the matching approved article.
- Submit sitemap in Google Search Console after redirect tests pass.
- Submit sitemap in Bing Webmaster Tools after Google handoff is complete.

## Days 1-3

- Check Google Search Console sitemap fetch status.
- Check indexed/queued status for homepage, blog index, and approved article URLs.
- Inspect several redirected legacy URLs.
- Check lead delivery daily.
- Check top redirects daily.
- Review 404 reports or crawl errors if available.
- Confirm no unexpected `vercel.app` canonical URLs appear.

## Days 4-14

- Monitor Google Search Console coverage and page indexing.
- Monitor Bing Webmaster Tools coverage if available.
- Monitor impressions, clicks, and query movement.
- Monitor redirect errors and unexpected 404s.
- Monitor Core Web Vitals and page experience where available.
- Continue controlled article migration through Sanity approval workflows.
- Do not mass-approve migrated content without legal/editorial review.

## Rollback Watch Items

Escalate immediately if:

- Homepage fails.
- SSL fails.
- Lead delivery fails.
- Email DNS is reported broken.
- Important legacy URLs redirect to wrong targets.
- Redirect loops or chains appear.
- Approved articles disappear from sitemap.
- Chaman Properties content appears on the law firm site.
