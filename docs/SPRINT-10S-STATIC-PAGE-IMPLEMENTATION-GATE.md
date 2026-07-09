# Sprint 10S Static Page Implementation Gate

Generated: 2026-07-09

## Current Position

The website already supports core static routes, practice-area pages, service pages under practice areas, resources, approved blog posts, sitemap generation, and redirect mapping.

Sprint 10S did not create or publish new static authority pages. That restraint is intentional: several legacy candidates have high search value, but they need exact content, canonical alignment, and lawyer review before redirects move traffic to them.

## Required Gate Before Creating A New Static Authority Page

A new static/service authority page may be implemented only when all of the following are true:

- Search intent is distinct from existing practice pages and blog posts.
- Source content has been recovered or a lawyer-approved brief exists.
- The target route is selected before redirect work begins.
- The route has a stable canonical URL using `https://chamanlawfirm.com`.
- Title and meta description are unique.
- Page content includes a clear Nigerian legal context.
- Page content avoids legal advice that could mislead a reader.
- Page content avoids Chaman Properties or luxury sales language.
- Page has at least one relevant law-firm image or approved non-image layout.
- Internal links point to relevant practice areas, resources, and consultation.
- CTA points to live consultation/contact paths.
- Sitemap inclusion is verified.
- Mobile/desktop layout is checked.
- Redirect is added only after the target returns 200 and is indexable.

## Blockers

- No fresh post-launch GSC/Bing exports are available locally.
- Several high-value legacy topics overlap with existing posts and practice pages.
- C of O, Land Use Act, family-law, and legal-system topics need cannibalization review.
- Sensitive family-law, immigration, and eviction/tenancy topics need lawyer review.

## Allowed Sprint 10T Implementation Options

### Option A: Practice Service Expansion

Enhance existing service routes under `/practice-areas/[slug]/[serviceSlug]` where the target already exists and has matching intent.

Best candidates:

- `/practice-areas/property-real-estate-law/property-verification`
- `/practice-areas/property-real-estate-law/property-due-diligence`
- `/practice-areas/debt-recovery`

### Option B: Dedicated Static Authority Route

Create a controlled static page only when the route, content, metadata, canonical, and redirect plan are approved together.

Best candidates:

- Certificate of Occupancy / C of O.
- Documents to verify before buying property.
- Debt recovery lawyer Nigeria.

### Option C: Blog Restoration Instead Of Static Page

Recover as an approved article where the legacy URL was informational rather than service-intent.

Best candidates:

- The Nigerian Legal System.
- The Role of the Judiciary in Nigerian Democracy.
- Land Use Act 1978, after duplicate review.

## Redirect Gate

Redirects must remain pending unless the target page:

- returns 200 on production;
- has production canonical;
- appears in sitemap where indexable;
- is not a hidden draft;
- is not a generic homepage/blog fallback;
- has been approved for legal and SEO safety.

No Sprint 10S static redirect activation was performed.
