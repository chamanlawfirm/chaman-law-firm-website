# Sprint 9H Author and Legacy SEO Governance

## Controlling Rule

All migrated legacy blog articles originally authored under the Chaman Law Firm legacy website must be publicly attributed to:

**Charles Chukwuma Nkwoka, Esq.**

Where a neutral institutional byline is needed, **Chaman Law Firm** may be used as an approved fallback. Do not publicly attribute migrated legacy articles to current employees, associates, interns, temporary staff, or team members unless the Principal separately approves that specific attribution.

## Public Author vs Internal Reviewer

- Public author: Charles Chukwuma Nkwoka, Esq.
- Approved fallback public author: Chaman Law Firm.
- Internal reviewer: assigned lawyer or practice reviewer, stored separately when the schema supports it.
- Firm attribution: Chaman Law Firm may appear as publisher or institutional source.

Reviewer attribution must not be confused with public authorship. If the current Sanity model allows only one author reference, migrated legacy posts should point to Charles Chukwuma Nkwoka, Esq. unless a specific exception is approved.

## Current Implementation Notes

- Blog posts use the Sanity `post.author` reference.
- The author reference is rendered on the blog index, individual blog article header, author bio section, author pages, and structured article schema.
- The current `post` schema does not include separate reviewer, review-status, or law-current-as-of fields.
- Those fields should be added in a later CMS governance sprint before reviewer names are displayed publicly.

## Sitemap Publication Rule

The sitemap must include only approved, public, indexable blog posts that pass all of these gates:

- `_type == "post"`
- `lawFirmApproved == true`
- not a draft
- slug is defined
- `publishedAt` is defined
- `publishedAt <= now()`

The sitemap must not include drafts, unapproved posts, placeholders, future-dated posts, Chaman Properties content, luxury property sales content, or any article that has not passed legal review.

The sitemap must use the production canonical domain:

`https://chamanlawfirm.com`

Preview URLs must not be exposed in the sitemap.

## Legacy SEO Preservation Rule

For the 2,000 legacy articles:

1. Preserve the original slug wherever possible.
2. Use the new canonical route: `/resources/blog/[same-legacy-slug]`.
3. Add a one-hop 301 redirect from the old legacy URL to the new approved URL only after the article is approved, visible, indexable, and present in the sitemap.
4. Preserve SEO title, meta description, canonical intent, publication date where appropriate, updated date, internal links, images, alt text, and structured data.
5. Do not import Chaman Properties or luxury property sales content into the law firm blog.
6. Articles must pass lawyer review before `lawFirmApproved=true`.
7. Apply AEO/GEO enhancements only after legal accuracy is confirmed, including concise answer blocks, FAQ schema where appropriate, clear headings, lawyer-reviewed disclaimers, practice-area internal links, consultation CTAs, and structured metadata.
8. Do not mass-publish all legacy articles at once.
9. Publish in controlled batches and activate redirects only after verification.

## Pilot Article Status

Pilot article:

`/resources/blog/landlord-and-tenant-rights-in-nigeria`

Required public author:

**Charles Chukwuma Nkwoka, Esq.**

No other migrated article should be approved or publicly exposed until the pilot sitemap behavior is confirmed and the lawyer review workflow is ready for the next controlled batch.
