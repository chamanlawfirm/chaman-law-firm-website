# Sprint 10A Domain Cutover Runbook

Date: 2026-06-27

Purpose: provide a non-technical launch-day sequence for moving `chamanlawfirm.com` from the old website to the new Vercel website.

Do not use this runbook until Sprint 10A is expressly approved.

## People Required

- Principal or Managing Partner.
- Website project owner.
- Technical deployment owner.
- DNS/domain owner.
- SEO migration owner.
- Lead-delivery owner.

## Pre-Launch Checks

1. Confirm Principal approval to begin.
2. Confirm no unrelated Chaman Properties project is open or being changed.
3. Confirm GitHub repo is `chamanlawfirm/chaman-law-firm-website`.
4. Confirm Vercel project is `chaman-law-firm-website`.
5. Confirm production domain is not already connected to the wrong project.
6. Confirm old website remains accessible.
7. Confirm old website backup checklist is complete.
8. Confirm DNS inventory template is complete.
9. Confirm final filtered redirect map has Principal/SEO approval.
10. Confirm Make.com, Google Sheet, and Gmail lead workflow are ready.

## Vercel Production Environment Verification

Verify in Vercel dashboard without exposing values:

1. `NEXT_PUBLIC_SITE_URL`
2. `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. `NEXT_PUBLIC_SANITY_DATASET`
4. `NEXT_PUBLIC_SANITY_API_VERSION`
5. `LEAD_DELIVERY_WEBHOOK_URL`
6. `LEAD_DELIVERY_WEBHOOK_TOKEN`, if used
7. `LEAD_RATE_LIMIT_MAX`
8. `LEAD_RATE_LIMIT_WINDOW_MS`
9. `NEXT_PUBLIC_WHATSAPP_NUMBER`
10. Google Maps variable, if used
11. Google review variable, if used
12. Analytics variable, if used
13. Google Search Console verification variable, if used
14. Bing verification variable, if used

## Production Deployment Check

1. Deploy the approved branch to Vercel production only after approval.
2. Confirm production build passes.
3. Confirm production deployment URL opens.
4. Confirm sitemap and robots are served.
5. Confirm production environment variables are attached to the production environment.

## Domain Addition In Vercel

1. Open Vercel project `chaman-law-firm-website`.
2. Add `chamanlawfirm.com`.
3. Add `www.chamanlawfirm.com`.
4. Copy the exact DNS records Vercel requests.
5. Do not change unrelated domain records.

## DNS Record Preparation

1. Use the completed DNS inventory as the source of truth.
2. Keep email records unchanged.
3. Keep verification TXT records unchanged unless the DNS owner approves.
4. Prepare only the website records required by Vercel.
5. Use a low TTL if the DNS provider allows it.

## DNS Change

1. Apply the Vercel-required website DNS records.
2. Preserve MX, SPF, DKIM, DMARC, and verification records.
3. Record the exact time of change.
4. Take a screenshot/export after changes.

## SSL Verification

1. Wait for Vercel to issue SSL.
2. Confirm `https://chamanlawfirm.com` opens without browser warnings.
3. Confirm `https://www.chamanlawfirm.com` opens or redirects as planned.

## Homepage Check

1. Open `https://chamanlawfirm.com`.
2. Confirm the new Chaman Law Firm homepage appears.
3. Confirm logo, hero, navigation, phone, WhatsApp, and consultation CTAs.

## Blog Check

1. Open `/resources/blog`.
2. Confirm approved articles appear.
3. Open at least three approved article pages.
4. Confirm author is Charles Chukwuma Nkwoka, Esq.
5. Confirm images and CTAs render.

## Form Submission Check

1. Submit a production consultation test.
2. Submit a production contact test.
3. Submit a production newsletter test.
4. Submit a production download test.
5. Confirm Google Sheet rows.
6. Confirm Gmail notifications.
7. Confirm reference numbers.

## Sitemap Check

1. Open `https://chamanlawfirm.com/sitemap.xml`.
2. Confirm it returns 200.
3. Confirm approved article URLs are included.
4. Confirm preview URLs are not included.

## Robots Check

1. Open `https://chamanlawfirm.com/robots.txt`.
2. Confirm public site is allowed.
3. Confirm `/studio` and `/api` are blocked.
4. Confirm sitemap points to `https://chamanlawfirm.com/sitemap.xml`.

## Redirect Activation

Do not activate redirects until:

1. Production target URLs return 200.
2. Production sitemap includes target URLs.
3. Final filtered redirect map is approved.
4. Principal or SEO owner gives explicit redirect activation approval.

## Redirect Testing

After activation:

1. Test every row in `docs/SPRINT-9P-FINAL-FILTERED-REDIRECT-MAP.csv`.
2. Confirm old URL returns one-hop 301.
3. Confirm destination is the matching article.
4. Confirm no homepage redirect unless separately approved.
5. Confirm no unapproved article redirects.

## Google Search Console Submission

Do not submit until production is live.

After launch:

1. Verify property.
2. Submit sitemap.
3. Inspect homepage.
4. Inspect blog index.
5. Inspect top approved articles.
6. Inspect redirected old URLs.

## Bing Webmaster Submission

Do not submit until production is live.

After launch:

1. Verify property.
2. Submit sitemap.
3. Inspect selected approved URLs.

## Post-Launch Monitoring

Monitor daily for 14 days:

- Homepage availability.
- Consultation/contact form delivery.
- Google Sheet and Gmail notifications.
- Sitemap availability.
- Robots availability.
- 404 errors.
- Redirect behavior.
- Search Console coverage.
- Bing coverage.
- Core Web Vitals.
- Search performance.

## Rollback Trigger Points

Rollback may be needed if:

- Production site is unreachable.
- SSL fails and cannot be fixed quickly.
- Forms fail and phone/WhatsApp fallback is insufficient.
- DNS was applied incorrectly and affects email.
- Major pages return 500 or 404.
- Redirects send important URLs to wrong targets.
- Principal directs rollback.

## Rollback Summary

1. Restore prior website DNS records.
2. Preserve email records.
3. Pause redirect activation.
4. Keep old website available.
5. Remove or pause Vercel domain assignment if necessary.
6. Record rollback time and reason.
