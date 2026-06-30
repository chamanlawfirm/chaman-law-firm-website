# Sprint 10J - Static Generation Retry Review

Date: 2026-06-30

## Pages Reviewed

Two older approved blog pages required Next.js static-generation retries during the Sprint 10I build:

1. `/resources/blog/annulment-of-marriage-under-the-nigerian-law`
2. `/resources/blog/types-of-land-registration-in-nigeria`

## Sanity Review

### Annulment of Marriage Under Nigerian Law

- Sanity ID: `chamanlawfirm-sprint10h-annulment-of-marriage-under-the-nigerian-law`
- Approved public post: yes
- Public author: Charles Chukwuma Nkwoka, Esq.
- Body blocks: 31
- Body text length: 6,914
- Featured image: present
- Image dimensions: 275 x 183
- SEO title: present
- Meta description: present
- Canonical: `https://chamanlawfirm.com/resources/blog/annulment-of-marriage-under-the-nigerian-law`
- Live URL result: 200
- Sitemap impact: no negative issue identified

### Types of Land Registration in Nigeria

- Sanity ID: `chamanlawfirm-sprint10h-types-of-land-registration-in-nigeria`
- Approved public post: yes
- Public author: Charles Chukwuma Nkwoka, Esq.
- Body blocks: 120
- Body text length: 11,266
- Featured image: present
- Image dimensions: 1080 x 607
- SEO title: present
- Meta description: present
- Canonical: `https://chamanlawfirm.com/resources/blog/types-of-land-registration-in-nigeria`
- Live URL result: 200
- Sitemap impact: no negative issue identified

## Likely Cause

No broken Sanity data, missing image, missing canonical, or public-visibility issue was found.

The likely cause is slow static generation for older, heavier blog pages during the build worker phase, especially the land registration page with 120 body blocks and 11,266 characters of body text.

## Action Taken

No production code change was made for these pages.

The pages remain live, approved, canonicalized, and sitemap-eligible.

## Recommendation

- Continue monitoring future builds.
- If retries increase, consider reducing static-generation workload for older long posts by using more dynamic rendering or smaller generated static parameter batches.
- If these two pages repeatedly time out, inspect Portable Text complexity, image rendering, and internal link density before making code changes.
