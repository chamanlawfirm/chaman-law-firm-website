# Sprint 10Y Post-Emergency Redirect Monitoring

Date: 2026-07-11

## Production Baseline

Production domain:

- `https://chamanlawfirm.com/` returns 200.
- `https://www.chamanlawfirm.com/` returns 308 to `https://chamanlawfirm.com/`.
- `/resources/blog` returns 200.
- `/sitemap.xml` returns 200.
- `/robots.txt` returns 200.
- Sitemap contains no `vercel.app` preview URLs.

## Sprint 10W/10X Redirects

All monitored redirects remain exact one-hop redirects to 200 targets.

| Legacy path | Redirect target | Status | Final target |
| --- | --- | --- | --- |
| `/force-majeure-clauses-in-business-contracts` | `/resources/blog/force-majeure-clauses-in-business-contracts` | 308 | 200 |
| `/force-majeure-clauses-in-business-contracts/` | `/resources/blog/force-majeure-clauses-in-business-contracts` | 308 | 200 |
| `/3-proven-steps-on-how-to-rolve-land-disputes` | `/resources/blog/3-proven-steps-on-how-to-rolve-land-disputes` | 308 | 200 |
| `/3-proven-steps-on-how-to-rolve-land-disputes/` | `/resources/blog/3-proven-steps-on-how-to-rolve-land-disputes` | 308 | 200 |
| `/documents-to-verify-before-buying-property` | `/practice-areas/property-real-estate-law/property-due-diligence` | 308 | 200 |
| `/documents-to-verify-before-buying-property/` | `/practice-areas/property-real-estate-law/property-due-diligence` | 308 | 200 |

No redirect chain, redirect loop, homepage dump, hidden-draft target, Chaman Properties target, DNS change, or Hostinger change was detected or made.

## Article Target Checks

### Force Majeure Article

- Target returns 200.
- Canonical exists.
- Author block shows Charles Chukwuma Nkwoka, Esq.
- CTA path exists.
- Image exists.
- Sitemap includes target.

### Resolve Land Disputes Article

- Target returns 200 after Sprint 10X restore.
- Canonical exists.
- Author block shows Charles Chukwuma Nkwoka, Esq.
- CTA path exists.
- Image exists.
- Sitemap includes target.

## Static Redirect Check

`/documents-to-verify-before-buying-property` continues to redirect to the live property due-diligence service page.

The target page returns 200 and has canonical, CTA, image, and sitemap coverage.

## Hidden Draft Guardrail

Hidden samples remained 404:

- `/resources/blog/land-documentation-excision-vs-gazette`
- `/resources/blog/how-to-resolve-land-disputes-in-nigeria-with`
- `/resources/blog/nonexistent-hidden-draft-sprint10x-sample`

