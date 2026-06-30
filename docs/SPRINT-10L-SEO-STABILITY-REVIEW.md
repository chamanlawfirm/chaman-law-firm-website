# Sprint 10L - SEO Stability Review

Date: 2026-07-01

## Public Blog State

- Approved public blog posts at Sprint 10L start: 101.
- New Sprint 10L public approvals: 0.
- Expected public blog count after Sprint 10L: 101.
- No Sprint 10L redirects were activated because no new Sprint 10L articles became public.

## Checks

| Check | Result |
| --- | --- |
| Duplicate public slugs | No new risk introduced |
| Duplicate public canonicals | No new risk introduced |
| Missing meta descriptions | No new public content introduced |
| Missing images/alt text | No new public content introduced |
| Wrong public author | No new public content introduced |
| Hidden draft exclusion | Preserved; no new hidden drafts were created due Sanity permission blocker |
| Sitemap inclusion | Should remain at 101 public blog URLs until Sanity permissions are resolved |
| Redirect chains | No new redirect chains introduced |
| Chaman Properties contamination | No public content introduced |

## Permission Blocker

Sanity write operations failed with insufficient permissions:

- Image asset creation blocked by missing `create` permission.
- Post document creation blocked by missing `create` permission.

Because of this, the 100-draft recovery and 40 controlled approvals remain prepared but unapplied.

## Remaining SEO Risks

- Search Console/Bing processing lag from prior restored batches.
- Repeated image groups from older batches still need refresh.
- Sprint 10L candidate metadata and titles have been reviewed in dry-run form, but not published.
- Some selected candidates need lawyer review before future approval, especially eviction, tenancy, family, and land dispute content.

## Recommendation

Resolve Sanity token permissions before retrying Sprint 10L apply. Required capabilities: create Sanity image assets, create post documents, create categories if missing, and create hidden draft documents. Do not activate redirects until target articles are live and sitemap-included.
