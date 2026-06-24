# Phase 5B Lawyer-Review Workflow

Generated: 2026-06-23  
Project: Chaman Law Firm website only  
Source: `SEO-MASTER-MIGRATION-ROADMAP.md`, section 10, "Top 50 law-firm articles to migrate first"

## Purpose

This workflow converts the Phase 5B SEO migration intelligence into a controlled legal-publication queue. The top 50 highest-traffic legal articles are prioritized for migration, but no article should be published until its legacy body has been extracted, updated for legal accuracy, reviewed by a lawyer, and marked `lawFirmApproved == true` in Sanity.

## Non-negotiable exclusions

- Do not migrate Chaman Properties, luxury-property-investment, commercial real-estate investment, ROI, investment-location, gated-estate, hospitality-real-estate, or property-marketing articles into the law-firm website unchanged.
- Property-law, landlord-tenant, land-title, C of O, Governor's Consent, building-approval, stamp-duty, trespass, land-grabbing, family-property, and property-dispute articles may remain on the law-firm website if they are framed as legal guidance and reviewed by a lawyer.
- Any article with sales/investment language must be rewritten as legal-risk guidance or excluded from the law-firm CMS.

## Migration waves

| Wave | Priority range | Treatment | Launch gate |
|---|---:|---|---|
| Wave 1 - highest traffic | 1-10 | Extract first, review first, publish first. Preserve URLs through 301 redirects. | Managing Partner or delegated senior lawyer sign-off required. |
| Wave 2 - high value | 11-25 | Extract after Wave 1, review by assigned practice lawyer, prepare internal links to Wave 1 pillars. | Assigned lawyer sign-off required. |
| Wave 3 - launch queue | 26-50 | Extract after Wave 2, cluster into supporting articles, publish only after no-index/duplicate checks. | Assigned lawyer sign-off plus SEO QA required. |

## Status model

Use these statuses in the migration register or CMS task tracker:

1. `Roadmap migrated to register`
2. `Legacy body extracted`
3. `Property-company exclusion checked`
4. `Editorial cleanup complete`
5. `Primary lawyer review in progress`
6. `Legal corrections required`
7. `Primary lawyer approved`
8. `Managing Partner review required`
9. `SEO QA complete`
10. `Ready for Sanity import`
11. `Imported as Sanity draft`
12. `lawFirmApproved true`
13. `Redirect implemented`
14. `Published`
15. `Post-launch QA complete`

## Required review checks

Each article must pass the following before publication:

- Legal accuracy confirmed for Nigerian law and any state-specific issue named in the article.
- Dates, statutes, agencies, procedures, filing requirements, fees, timelines, and court references verified or softened where exactness cannot be guaranteed.
- No article creates client-specific legal advice or guarantees an outcome.
- Legal disclaimer language remains visible through site-wide/legal-page architecture.
- Author/reviewer attribution is correct.
- Canonical URL points to `https://chamanlawfirm.com/resources/blog/{slug}`.
- Legacy URL has a corresponding 301 redirect in the redirect map.
- Article includes a clear consultation CTA where commercially appropriate.
- Internal links point to relevant practice-area, lawyer, consultation, and resource pages.
- No Chaman Properties branding, investment sales pitch, property-marketing claim, ROI claim, or luxury-real-estate promotion appears in the law-firm article.
- `lawFirmApproved` remains false until lawyer sign-off is complete.

## Reviewer assignment rules

| Content area | Primary reviewer | Support reviewer |
|---|---|---|
| Property title, C of O, land registration, conveyancing, due diligence | Charles Chukwuma Nkwoka | Ibraheem Akewusola or Martha Elendu |
| Tenancy, eviction, recovery of premises, landlord-tenant disputes | Justina Edewede Obriko or Arinze Amobi | Charles Chukwuma Nkwoka |
| Court jurisdiction, civil procedure, land disputes, debt recovery, enforcement | Arinze Amobi | Justina Edewede Obriko or Martha Elendu |
| Corporate, CAC, shares, resolutions, contracts | Justina Edewede Obriko | Ibraheem Akewusola |
| Family, marriage, inheritance, child protection | Justina Edewede Obriko | Victoria N. Nwofia |
| Notary, deed poll, affidavits, document authentication | Charles Chukwuma Nkwoka | Victoria N. Nwofia |
| General legal education, rule of law, legal profession | Charles Chukwuma Nkwoka | Arinze Amobi |

## Per-article workflow

1. Open the migration register and work strictly in priority order unless a lawyer reorders a cluster.
2. Extract the legacy article body from the approved WordPress backup/export or existing approved CMS source.
3. Confirm the article is not in the Chaman Properties exclusion family.
4. Clean HTML, remove tracking residue, normalize headings, and remove obsolete WordPress shortcodes.
5. Preserve search intent, but improve the article title, meta description, introduction, headings, FAQs, and CTA where needed.
6. Add internal links to the relevant practice area, lawyer profile, consultation page, and related legal articles.
7. Send the article to the assigned primary lawyer using the review checklist above.
8. Apply legal corrections and capture reviewer name, date, and decision.
9. Run SEO QA: canonical, Open Graph, schema, breadcrumbs, noindex false, sitemap inclusion, and redirect readiness.
10. Import as a Sanity draft with `lawFirmApproved` false.
11. Set `lawFirmApproved` true only after final sign-off.
12. Implement the matching 301 redirect only after the destination article resolves.
13. Run post-launch checks: old URL redirects, new URL 200, canonical correct, article appears in sitemap, and Search Console inspection is ready.

## Sanity fields required before publish

- `_type`: `post`
- `title`
- `slug.current`
- `excerpt`
- `publishedAt`
- `author`
- `categories`
- `tags`
- `mainImage` or approved default image
- `body`
- `faqs`
- `seo.metaTitle`
- `seo.metaDescription`
- `seo.keywords`
- `seo.canonicalUrl`
- `seo.noIndex`: false
- `lawFirmApproved`: true only after final legal approval

## Redirect implementation rule

The redirect CSV is a planning map, not a deployed redirect config. Implement each row only after:

1. The destination article exists.
2. The article is lawyer-approved.
3. The destination returns 200 in preview/production.
4. The canonical URL matches the destination.
5. The old URL has no superior destination in the final migration map.

For Vercel/Next.js, use a permanent 301-equivalent redirect. If implemented in `next.config.mjs`, prefer an explicit `statusCode: 301` where the SEO migration requires a traditional 301.

## Definition of done for one migrated article

- Legacy article body extracted from approved source.
- Chaman Properties exclusion check passed.
- Legal review complete and recorded.
- SEO metadata complete.
- Schema and breadcrumbs render.
- CTA and internal links present.
- Sanity draft imported.
- `lawFirmApproved` set true only after legal sign-off.
- Destination URL returns 200.
- Legacy URL redirects to destination.
- Post-launch QA recorded.

## Immediate next action

Start with Wave 1 priorities 1-10 in `docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-MIGRATION-REGISTER.csv`. Extract bodies from the approved WordPress backup/export, prepare Sanity drafts, and route each article to the assigned lawyer before publication.
