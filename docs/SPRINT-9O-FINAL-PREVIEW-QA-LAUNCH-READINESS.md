# Sprint 9O Final Preview QA and Launch Readiness Report

Date: 2026-06-27

## Scope

Sprint 9O performed final preview QA, launch-readiness review, redirect audit, environment-readiness review, domain migration planning, rollback planning, and Search Console/Bing planning for the Chaman Law Firm website.

No production domain was connected. No DNS records were changed. No production deployment was manually triggered. No Google Search Console or Bing Webmaster submission was made. No legacy redirects were activated. No additional Sanity articles were approved.

## 1. Final Preview Website QA Result

Preview URL tested:

- `https://chaman-law-firm-website.vercel.app`

Routes tested and returning 200:

- `/`
- `/about`
- `/lawyers`
- `/lawyers/charles-chukwuma-nkwoka`
- `/lawyers/justina-edewede-obriko`
- `/lawyers/arinze-amobi`
- `/lawyers/ibraheem-akewusola`
- `/lawyers/martha-elendu`
- `/lawyers/victoria-nwofia`
- `/practice-areas`
- `/practice-areas/property-real-estate-law`
- `/practice-areas/corporate-commercial-law`
- `/practice-areas/litigation-dispute-resolution`
- `/practice-areas/debt-recovery`
- `/practice-areas/probate-estate-administration`
- `/practice-areas/notary-public-services`
- `/practice-areas/immigration-services`
- `/practice-areas/family-law`
- `/practice-areas/employment-law`
- `/practice-areas/adr-mediation`
- `/consultation`
- `/contact`
- `/resources`
- `/resources/blog`
- `/resources/blog?page=2`
- `/resources/downloads`
- `/thank-you`
- `/privacy-policy`
- `/terms-of-use`
- `/cookie-policy`
- `/legal-disclaimer`
- `/sitemap.xml`
- `/robots.txt`

QA findings:

- No Chaman Properties contamination found on tested public pages.
- No wrong firm name found on tested public pages.
- Core CTAs were present.
- Header/footer were present on sampled rendered pages.
- Canonical and Open Graph metadata were present on tested HTML pages.
- Sampled image URLs returned 200.
- Desktop and mobile-width browser checks found no horizontal overflow on sampled pages.
- Visible internal placeholder copy was found in media/resource card labels, then fixed in source by replacing editorial placeholder wording with public-safe section descriptions.

## 2. Blog and Content QA Result

The approved public blog set was confirmed from Sanity and preview.

Each approved article passed:

- URL returns 200.
- Title renders.
- Body renders.
- Featured image renders.
- Alt text exists.
- Public author is Charles Chukwuma Nkwoka, Esq.
- SEO title exists.
- Meta description exists.
- Canonical uses `https://chamanlawfirm.com`.
- Consultation/contact CTA exists.
- No Chaman Properties content found.
- No luxury property sales language found.
- Article appears in sitemap.

## 3. Approved Public Article Count

Approved public article count: 13.

Approved public articles:

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

Hidden/unapproved repaired Batch B articles tested and returning 404:

- `the-concept-of-rule-of-law-in-nigeria`
- `difference-between-ownership-and-possession`
- `community-development-associations-law`
- `how-to-replace-a-lost-a-marriage-certificate`
- `legal-steps-to-take-when-our-land-has-been`
- `rights-of-tenants-in-ogun-chaman-law-firm`
- `is-foreign-marriage-under-the-nigerian-law`
- `abandonment-and-withdrew-of-court-action`
- `powerful-steps-what-is-trespass-to-land-2`
- `the-duties-of-lawyers-to-client`

## 4. Sitemap and Robots QA Result

Sitemap:

- `/sitemap.xml` returns 200.
- Sitemap URL count during QA: 55.
- Sitemap uses production canonical domain: `https://chamanlawfirm.com`.
- Sitemap does not expose Vercel preview URLs.
- Sitemap includes all 13 approved public articles.
- Sitemap excludes hidden/unapproved Batch B articles.

Robots:

- `/robots.txt` returns 200.
- Public pages are allowed.
- `/studio` is disallowed.
- `/api` is disallowed.
- Sitemap points to `https://chamanlawfirm.com/sitemap.xml`.

## 5. Lead Delivery/Form QA Result

Live preview `/api/leads` tests were performed with clearly marked Sprint 9O QA payloads.

Passed:

- Consultation enquiry: 201, delivered, reference returned.
- Contact enquiry: 201, delivered, reference returned.
- Newsletter signup: 201, delivered, reference returned.
- Lead magnet download: 201, delivered, reference returned.
- Invalid payload validation: 422, no false success.

Code review confirms:

- `LeadForm`, `LeadMagnetForm`, and `NewsletterSignup` submit through `submitLeadRequest`.
- `submitLeadRequest` posts to `/api/leads`.
- API validates payloads, honeypot, consent, phone/email, and lead type.
- API rate-limits requests.
- API returns success only when delivery reports success.
- Missing/misconfigured webhook returns failure instead of false success.

Manual confirmation still needed:

- User should confirm the four Sprint 9O QA rows appeared in Google Sheet.
- User should confirm Gmail notifications were received.
- User should confirm Make.com scenario remains ON and immediate.

## 6. Production Environment Readiness Result

Local `.env.local` presence:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: present locally.
- `NEXT_PUBLIC_SANITY_DATASET`: present locally.

Local `.env.local` missing or not locally configured:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `LEAD_DELIVERY_WEBHOOK_URL`
- `LEAD_DELIVERY_WEBHOOK_TOKEN`
- `LEAD_RATE_LIMIT_MAX`
- `LEAD_RATE_LIMIT_WINDOW_MS`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`

Production Vercel dashboard must be verified without exposing values.

Required production values:

- `NEXT_PUBLIC_SITE_URL=https://chamanlawfirm.com`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `LEAD_DELIVERY_WEBHOOK_URL`

Recommended production values:

- `LEAD_DELIVERY_WEBHOOK_TOKEN`
- `LEAD_RATE_LIMIT_MAX=5`
- `LEAD_RATE_LIMIT_WINDOW_MS=600000`
- `NEXT_PUBLIC_WHATSAPP_NUMBER=2348065553671`
- analytics and verification variables after launch approval.

Secret scan:

- No assigned webhook, bearer token, Sanity auth token, or lead webhook token was found in tracked source files.

## 7. Redirect Readiness Audit Result

Redirect planning files reviewed:

- `docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-REDIRECT-MAP.csv`
- `docs/SPRINT-9M-REDIRECT-READINESS.csv`
- `docs/SPRINT-9N-REDIRECT-READINESS-UPDATE.csv`
- `next.config.mjs`

Approved article redirect coverage:

- All 13 approved article slugs have pending redirect-plan coverage.

Current active redirect status:

- Article-specific legacy redirects remain inactive.
- Next.js config contains general legacy redirects and temporary blog/category/tag aliases.
- No Sprint 9M/9N article redirect plan has been activated.

Redirect risks requiring review before launch:

- Sprint 9M redirect readiness contains duplicate target groups.
- Sprint 9M contains broad/homepage-like target rows that should not be activated blindly.
- Root/domain canonical redirects must be handled separately from blog article redirects.
- Category/archive/page-number URLs should not be redirected to homepage.
- Targets must be approved, visible, indexable, and in sitemap before redirect activation.

Launch-ready redirect checklist:

1. Filter redirect plan to approved and visible targets only.
2. Confirm every target returns 200.
3. Confirm every target is in sitemap.
4. Exclude hidden, draft, weak, off-brand, duplicate, or unknown targets.
5. Remove redirect chains.
6. Avoid homepage catch-all redirects.
7. Use one-hop 301 redirects.
8. Review category/archive redirects separately.
9. Keep Chaman Properties/off-brand routes excluded.
10. Activate redirects only after final launch approval.

## 8. DNS and Domain Migration Plan

Do not change DNS until launch approval.

Preparation steps:

1. Confirm old website backup exists and can be restored.
2. Export current DNS records before changes.
3. Confirm whether `chamanlawfirm.com` and `www.chamanlawfirm.com` both need to resolve to Vercel.
4. Add the domain to Vercel project `chaman-law-firm-website` only after approval.
5. Prepare Vercel DNS instructions for apex and www.
6. Verify SSL issuance in Vercel after DNS points correctly.
7. Confirm domain verification status.
8. Confirm production environment variables before DNS switch.
9. Switch during a low-traffic window, preferably early morning Lagos time or a pre-agreed low-risk maintenance window.
10. Run post-switch checks immediately.

Typical Vercel DNS preparation:

- Apex domain may require an A record or Vercel-recommended apex configuration.
- `www` usually uses a CNAME to Vercel.
- Exact records must be taken from the Vercel domain screen at launch time.

Rollback plan:

1. Keep old hosting active during launch.
2. Preserve prior DNS record inventory.
3. If critical failure occurs, restore prior DNS values.
4. Keep TTL low before planned cutover where possible.
5. Pause redirect activation if rollback is needed.
6. Document the rollback decision and time.

Required launch approval:

- Managing Partner / Principal.
- Website project owner.
- Technical deployment owner.
- SEO migration owner.

## 9. Search Console/Bing Plan

Do not submit yet.

Post-launch steps:

1. Verify property in Google Search Console.
2. Verify property in Bing Webmaster Tools.
3. Submit `https://chamanlawfirm.com/sitemap.xml`.
4. Inspect homepage, practice area pages, blog index, and approved article URLs.
5. Monitor 404s daily during launch week.
6. Monitor redirect behavior and coverage.
7. Check top legacy URLs manually after redirect activation.
8. Annotate migration date in analytics/reporting.
9. Monitor search performance, index coverage, crawl stats, and duplicate canonical signals.
10. Compare old vs new URL rankings and impressions weekly.

## 10. Remaining Batch B / Top 1,000 Status

Current status:

- 13 public approved articles.
- 10 repaired Batch B articles remain hidden.
- 27 Batch B candidates need deeper source recovery.
- Top 1,000 manifest exists.
- Redirect planning exists but remains pending.

Missing source files still needed for scale:

- Full WordPress XML export.
- RankMath SEO export.
- Database backup if XML is incomplete.
- `wp-content/uploads` archive.
- Old sitemap export.
- Legacy media archive.

Recommended next controlled approval candidates:

- `difference-between-ownership-and-possession`
- `powerful-steps-what-is-trespass-to-land-2`
- `legal-steps-to-take-when-our-land-has-been`
- `rights-of-tenants-in-ogun-chaman-law-firm`
- `how-to-replace-a-lost-a-marriage-certificate`

Do not approve these until lawyer/editorial review is complete.

## 11. Final Launch Decision Matrix

| Area | Status | Owner | Recommended action |
| --- | --- | --- | --- |
| Preview site | Ready | Technical owner | Re-verify after Sprint 9O preview deploy. |
| Core pages | Ready | Technical/editorial owner | Keep no-placeholder source fix. |
| Blog content | Ready | Editorial/legal owner | Maintain 13 approved posts only. |
| Sitemap | Ready | SEO owner | Re-check after production deploy. |
| Robots | Ready | SEO owner | Keep `/studio` and `/api` blocked. |
| Lead delivery | Needs manual confirmation | User/operations owner | Confirm Google Sheet and Gmail QA entries. |
| Production env vars | Needs verification | Vercel/admin owner | Verify values in Vercel without exposing secrets. |
| Redirects | Blocked | SEO/technical owner | Finalize approved-only redirect map before activation. |
| DNS | Blocked | Domain/admin owner | Export current DNS and confirm cutover plan. |
| Rollback | Needs confirmation | Technical/domain owner | Confirm old hosting backup and DNS rollback steps. |
| Search Console/Bing | Blocked | SEO owner | Submit only after production domain launch. |
| Production domain | Blocked | Principal/technical owner | Approve only after env, redirects, DNS, and rollback are ready. |

## 12. Safe Fixes Applied

- Removed public-facing “Editable Placeholder” and “Editorial placeholder” wording from media/resource cards in `src/data/resources.ts`.

## 13. Lint Result

Passed.

Existing warning only:

- `scripts/migration/phase5c-import-top50-to-sanity.mjs`: `keyField` is assigned a value but never used.

## 14. Build Result

Passed.

- Command used the Windows system certificate store.
- Build generated 82 pages.
- The build included all 13 approved blog article routes.

## 15. Files Modified

- `src/data/resources.ts`
- `docs/SPRINT-9O-FINAL-PREVIEW-QA-LAUNCH-READINESS.md`

## 16. Sanity Content Changes Made

None.

## 17. Commit/Push Status

Pending at report-writing time.

## 18. Current Git Status

Pending final post-commit verification.

## 19. Go/No-Go For Next Controlled Article Batch

Go for review and preparation only.

No-Go for automatic approval or mass publication.

## 20. Go/No-Go For Production Domain Connection

No-Go.

Production domain connection remains blocked until:

- Vercel production environment variables are verified.
- Google Sheet/Gmail QA entries are manually confirmed.
- Redirect plan is filtered and approved.
- Current DNS records are exported.
- Old website backup is confirmed.
- Rollback plan is accepted.
- Final production deployment QA is passed.

## 21. Recommended Next Sprint

Sprint 9P: Production launch readiness closeout.

Recommended scope:

1. Verify Vercel production environment variables.
2. Confirm Make.com, Google Sheet, and Gmail QA entries.
3. Export current DNS records.
4. Confirm old website backup.
5. Finalize approved-only redirect map.
6. Prepare production deployment checklist.
7. Prepare domain cutover runbook.
8. Prepare rollback runbook.
9. Perform final pre-domain preview QA after Sprint 9O deploy.
10. Seek explicit production-domain approval.
