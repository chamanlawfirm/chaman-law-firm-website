# Sprint 10T Live QA and Redirect Blocker

Generated: 2026-07-10

## Summary

Sprint 10T approved a controlled batch of repaired legacy articles in Sanity, but live production QA and redirect activation are blocked because the production Vercel deployment is currently disabled.

Production requests to `https://chamanlawfirm.com` returned:

- Status: `402 Payment Required`
- Header: `X-Vercel-Error: DEPLOYMENT_DISABLED`

## Impact

The following Sprint 10T actions are blocked until Vercel is re-enabled:

- Live verification of newly approved article URLs.
- Live sitemap inclusion verification.
- Live robots verification.
- Exact redirect activation for the newly approved legacy URLs.
- Redirect QA for slash and non-slash variants.
- Google Search Console inspection/submission for the newly approved URLs.
- Bing Webmaster inspection/submission for the newly approved URLs.

## Safe Actions Completed

- Sanity content approval for the controlled batch.
- Image upload/attachment for approved articles.
- Article metadata/canonical/author validation.
- Local lint.
- Local production build.

## Required Principal Action

Re-enable the Vercel production deployment for `chaman-law-firm-website`.

After Vercel is re-enabled, run a recovery sprint to verify:

- homepage returns 200;
- `/resources/blog` returns 200;
- each Sprint 10T approved article URL returns 200;
- `/sitemap.xml` includes the new article URLs;
- hidden drafts remain 404;
- then and only then activate exact redirects for the approved Sprint 10T URLs.

Do not submit the newly approved URLs to Google Search Console or Bing until the live production deployment is restored and verified.
