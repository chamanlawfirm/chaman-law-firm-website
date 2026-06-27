# Sprint 9P Production Launch Readiness Closeout

Date: 2026-06-27

## Scope

Sprint 9P prepared the final production launch readiness package for moving `chamanlawfirm.com` from the old website to the new Vercel website.

No production domain was connected. No DNS records were changed. No redirects were activated. No Google Search Console or Bing Webmaster submission was made. No additional Sanity articles were approved.

## Production Environment Readiness

Production values must be confirmed in the Vercel dashboard without exposing secrets.

| Variable | Local status | Production action |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | not present locally | confirm value is `https://chamanlawfirm.com` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | present locally | confirm present in Vercel |
| `NEXT_PUBLIC_SANITY_DATASET` | present locally | confirm value is `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | not present locally | confirm present in Vercel |
| `LEAD_DELIVERY_WEBHOOK_URL` | not present locally | confirm present in Vercel, do not expose value |
| `LEAD_DELIVERY_WEBHOOK_TOKEN` | not present locally | confirm if used, do not expose value |
| `LEAD_RATE_LIMIT_MAX` | not present locally | recommended `5` |
| `LEAD_RATE_LIMIT_WINDOW_MS` | not present locally | recommended `600000` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | not present locally | recommended `2348065553671` |
| Google Maps variable | not present locally | confirm if used |
| Google review variable | not present locally | confirm if used |
| Analytics variable | not present locally | confirm if used |
| Google Search Console verification variable | not present locally | confirm if used |
| Bing verification variable | not present locally | confirm if used |

Tracked source secret scan:

- No assigned webhook URL, bearer token, Sanity auth token, or lead delivery token was found in tracked source files.

## Manual Lead Delivery Confirmation Checklist

- [ ] Consultation form delivers correctly.
- [ ] Contact form delivers correctly.
- [ ] Newsletter form delivers correctly.
- [ ] Download form delivers correctly.
- [ ] Google Sheet receives leads.
- [ ] Gmail notification contains correct lead details.
- [ ] Make.com scenario is ON.
- [ ] Make.com scenario runs immediately as data arrives.
- [ ] Download Requested field behaves correctly.
- [ ] No webhook URL or token is exposed in source.

## Old Website Backup Checklist

Mandatory backup checklist created:

- `docs/SPRINT-9P-OLD-SITE-BACKUP-CHECKLIST.md`

Launch remains No-Go until the old-site backup is confirmed and stored outside the live hosting account.

## DNS Inventory And Domain Cutover Plan

DNS inventory template created:

- `docs/SPRINT-9P-DNS-INVENTORY-TEMPLATE.md`

Recommended cutover method:

- Option A: move only the website records to Vercel while preserving email and verification DNS records.

Do not use Option B, nameserver change, unless absolutely necessary and separately approved.

## Final Filtered Redirect Map Result

Final filtered redirect map created:

- `docs/SPRINT-9P-FINAL-FILTERED-REDIRECT-MAP.csv`

Scope:

- 13 approved public articles only.
- One-hop 301 redirect plan only.
- No homepage redirects.
- No unapproved article redirects.
- No Chaman Properties or off-brand content.
- All targets verified as returning 200 on preview.
- All targets verified as present in sitemap.

Redirect activation remains pending and inactive.

## Redirect Implementation Plan

Recommended future implementation method:

- Add explicit approved article redirects to `next.config.mjs` inside the existing `async redirects()` array after final approval.

Why:

- The project already uses Next.js redirect configuration.
- It keeps redirects version-controlled.
- It supports Vercel deployment without separate middleware.

Activation condition:

1. Production target article returns 200.
2. Production sitemap includes the target.
3. Principal approves redirect activation.
4. SEO owner confirms redirect map.
5. Technical owner adds redirects and deploys.

No staged active redirect file was created in Sprint 9P.

## Final Preview Recheck Result

Core routes tested and returning 200:

- `/`
- `/about`
- `/lawyers`
- `/practice-areas`
- `/resources/blog`
- `/consultation`
- `/contact`
- `/resources/downloads`
- `/thank-you`
- `/privacy-policy`
- `/terms-of-use`
- `/sitemap.xml`
- `/robots.txt`

Approved article routes tested and returning 200:

1. `landlord-and-tenant-rights-in-nigeria`
2. `the-jurisdiction-of-courts-in-nigeria`
3. `proper-steps-to-eviction-of-tenants`
4. `the-ogun-state-tenancy-law-chaman-law-firm`
5. `building-permit-approval-in-ogun-state`
6. `cac-public-search-guide-nigeria`
7. `types-of-tenant-in-nigeria`
8. `how-to-change-name-with-deed-poll`
9. `ways-to-prove-ownership-of-land`
10. `how-to-notarize-a-document-in-nigeria`
11. `the-statutory-right-of-occupancy-in-nigeria`
12. `transfer-of-company-shares-in-nigeria`
13. `statute-of-limitations-on-debt-in-nigeria`

Confirmed:

- No preview URLs in sitemap.
- No visible placeholder wording found.
- No Chaman Properties contamination found.
- Critical sampled images returned 200.
- Public author remains Charles Chukwuma Nkwoka, Esq.
- CTA links remain present.

## Search Console And Bing Launch Plan

Do not submit until production domain is live.

After cutover:

1. Verify Google Search Console property.
2. Verify Bing Webmaster Tools property.
3. Submit `https://chamanlawfirm.com/sitemap.xml`.
4. Inspect homepage.
5. Inspect blog index.
6. Inspect top approved articles.
7. Inspect redirected old URLs after redirects are active.
8. Monitor 404s.
9. Monitor indexing.
10. Monitor Core Web Vitals.
11. Monitor search performance.
12. Annotate migration date.
13. Monitor daily for the first 14 days.

## Rollback Plan

Rollback plan:

1. Restore old website DNS records from inventory.
2. Preserve email records.
3. Confirm SSL on the restored old website.
4. Restore old website access.
5. Pause redirect activation.
6. Remove or pause Vercel domain assignment if necessary.
7. Confirm rollback approval authority.
8. Monitor for at least 24 hours after rollback.

Rollback approval authority:

- Principal or Managing Partner.
- Technical deployment owner.
- DNS/domain owner.

## Sprint 10A Launch-Day Runbook

Runbook created:

- `docs/SPRINT-9P-DOMAIN-CUTOVER-RUNBOOK.md`

## Production Domain Go/No-Go Matrix

| Area | Status | Reason | Required next action |
| --- | --- | --- | --- |
| Preview website | Go | Preview routes and articles pass QA | Recheck after final production deploy |
| Blog/content | Go | 13 approved articles visible and in sitemap | Do not approve more during cutover |
| Sitemap/robots | Go | Production-domain sitemap and robots ready | Recheck on production domain |
| Lead API | Go with manual confirmation | Preview API tests previously passed | Confirm Google Sheet/Gmail delivery manually |
| Production env vars | No-Go until verified | Vercel dashboard values not confirmed here | Principal/admin verifies dashboard |
| Old website backup | No-Go until confirmed | Backup completion not confirmed here | Complete backup checklist |
| DNS inventory | No-Go until completed | Current DNS records not captured here | Complete DNS template |
| Redirect activation | No-Go | Pending map only | Approve and activate after production targets are live |
| Search Console/Bing | No-Go | Must wait for production domain | Submit after launch |
| Production domain | No-Go | Manual gates remain | Proceed only in Sprint 10A after approval |

## Lint Result

Passed.

Existing warning only:

- `scripts/migration/phase5c-import-top50-to-sanity.mjs`: `keyField` is assigned a value but never used.

## Build Result

Passed.

- Build used the Windows system certificate store.
- Build generated 82 pages.
- Build included the 13 approved blog article routes.

## Sanity Content Changes Made

None.

## Go/No-Go For Sprint 10A Domain Cutover

No-Go until the Principal completes the manual pre-cutover actions.

## Remaining Manual Actions For Principal

1. Confirm Vercel production environment variables.
2. Confirm Make.com, Google Sheet, and Gmail lead delivery.
3. Complete old website backup checklist.
4. Complete DNS inventory template.
5. Approve final filtered redirect map.
6. Confirm rollback authority and rollback window.
7. Approve Sprint 10A domain cutover timing.
