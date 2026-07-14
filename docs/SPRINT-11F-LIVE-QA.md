# Sprint 11F Live QA Closeout

- Production sitemap status: 200
- Production robots status: 200
- Sitemap contains preview/vercel URLs: no
- Robots references production sitemap: yes
- Robots blocks /studio: yes
- Robots blocks /api: yes
- Sprint 11F selected redirects: 13
- Selected redirect target statuses: /practice-areas/corporate-commercial-law=200, /practice-areas/employment-law=200, /practice-areas/adr-mediation=200, /practice-areas/probate-estate-administration=200

## Final Production QA

Completed after Vercel served commit `d3b94f5`.

- Homepage: 200
- www to apex: 308 to `https://chamanlawfirm.com/`
- Blog index: 200
- Sitemap: 200
- Robots: 200
- Sprint 11F redirect variants tested: 26
- Sprint 11F redirect variants passed: 26
- Redirect style: exact one-hop 308
- Redirect chains found: none
- Redirect loops found: none
- Homepage dumps found: none
- Hidden-draft targets found: none
- 404 redirect targets found: none
- Chaman Properties targets found: none

## Public Target QA

All selected public targets return 200 and are sitemap-included:

- `/practice-areas/corporate-commercial-law`
- `/practice-areas/employment-law`
- `/practice-areas/adr-mediation`
- `/practice-areas/probate-estate-administration`

## Hidden Draft Guardrail

The following hidden/unapproved samples still return 404:

- `/resources/blog/the-concept-of-rule-of-law-in-nigeria`
- `/resources/blog/how-to-change-car-ownership-in-nigeria`
- `/resources/blog/how-to-track-a-stolen-phone-in-nigeria`
- `/resources/blog/steps-on-how-to-confidently-report-acrimelaw`
- `/resources/blog/protect-your-properties-from-family-disputes`

## Regression Samples

Existing important redirects still return one-hop 308 to 200 targets:

- `/governors-consent`
- `/documents-apostilled-in-nigeria`
- `/force-majeure-clauses-in-business-contracts`
- `/3-proven-steps-on-how-to-rolve-land-disputes`
- `/obtaining-a-certificate-of-occupancy-c-of-o`
