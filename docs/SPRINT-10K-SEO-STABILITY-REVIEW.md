# Sprint 10K - SEO Stability Review

Date: 2026-06-30

## Public Blog State

- Approved public blog posts before Sprint 10K: 81.
- Approved public blog posts after Sprint 10K: 101.
- New Sprint 10K approved articles: 20.
- Public author governance: all checked public posts use `Charles Chukwuma Nkwoka, Esq.`
- Hidden drafts remain excluded from the public blog and sitemap.

## Stability Checks

| Check | Result |
| --- | --- |
| Duplicate public slugs | 0 found |
| Duplicate public canonical URLs | 0 found |
| Missing meta descriptions | 0 found |
| Overly short meta descriptions under 90 characters | 0 found |
| Missing public article images | 0 found |
| Missing image alt text | 0 found |
| Wrong public author attribution | 0 found |
| Sitemap route | 200 |
| Robots route | 200 |
| Blog index route | 200 |

## Repeated Image Review

Repeated image groups were found and should be treated as image-refresh candidates in later editorial sprints.

Largest repeated group:

- Image asset `image-03621dd4ea8d18ac61f44df60bac6e107f0f1377-1086x1448-png` appears on 9 older approved articles:
  - `building-permit-approval-in-ogun-state`
  - `cac-public-search-guide-nigeria`
  - `how-to-change-name-with-deed-poll`
  - `how-to-notarize-a-document-in-nigeria`
  - `statute-of-limitations-on-debt-in-nigeria`
  - `the-statutory-right-of-occupancy-in-nigeria`
  - `transfer-of-company-shares-in-nigeria`
  - `types-of-tenant-in-nigeria`
  - `ways-to-prove-ownership-of-land`

Other repeated groups exist at lower frequency. They are not launch blockers because images and alt text exist, but they should be improved as the blog grows.

## Sprint 10K Article Metadata Notes

The Sprint 10K batch passed hard technical gates: body, slug, canonical, meta description, image, alt text, and author. A few restored meta titles/descriptions still preserve legacy wording and can be improved in later editorial polish.

Examples for later polish:

- `effect-of-witness-as-beneficiary-in-will`: meta description contains legacy introductory wording.
- `business-name-and-a-company-limited-by-shares`: meta description starts lower-case.
- `verify-a-property-title-in-lagos`: meta title has awkward legacy wording.
- `the-basics-of-statutory-right-of-occupancy`: meta title can be title-cased.

No immediate technical blocker was found.

## Redirect Stability

- Existing exact article redirects remain in the deep legacy redirect set.
- Sprint 10K adds 20 exact old URL to article redirects.
- No homepage dumping was introduced.
- No redirect was added for hidden or unapproved content.
- No Chaman Properties target was introduced.

## Remaining SEO Risks

- Google and Bing may take time to process newly restored articles and one-hop redirects.
- Some older restored articles need stronger image diversity.
- Legacy metadata quality varies; preserve first, polish second.
- Hidden drafts should not be inspected or submitted until approved.
- Large future approval batches may increase build time and sitemap size; keep controlled batches.

## Recommendation

Proceed with manual Search Console and Bing monitoring for the 101 approved public posts. Continue hidden-risk cleanup before approving the next batch.
