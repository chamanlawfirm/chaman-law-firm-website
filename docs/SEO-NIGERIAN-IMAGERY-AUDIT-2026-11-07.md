# Chaman Law Firm — Nigerian Image Localization Audit
**Review:** 7 November 2026
**Scope:** Next.js/Vercel source-controlled image references (major pages and shared image-rendering components). This does not constitute a photographic content audit of every Sanity CMS document.

## Completed
- Replaced generic remote Unsplash hero sources with authentic, existing Chaman Law Firm photographs in:
  - `src/data/practice-areas.ts`
  - `src/lib/publishing.ts` (legal news, court updates, podcast, videos hubs)
  - `src/app/resources/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/practice-areas/page.tsx`
  - `src/app/careers/page.tsx`
  - `src/app/consultation/page.tsx`
  - `src/app/media/page.tsx`
  - `src/app/resources/blog/page.tsx`
  - `src/app/resources/downloads/page.tsx`
  - `src/app/practice-areas/[slug]/page.tsx`
  - `src/app/practice-areas/[slug]/[serviceSlug]/page.tsx`
- Added a reusable stock-image guard in `src/lib/localized-images.ts` and applied it in `src/components/PageHero.tsx`, `src/components/PublishedContentCard.tsx`, and `src/components/ContentDetailPage.tsx`. It substitutes explicitly recognized generic Unsplash/Pexels/Pixabay image URLs with local law-firm photography. It does **not** replace unverified CMS uploads or alter named lawyer portraits.
- Preserved genuine available firm images under `public/images/firm` and `public/images/lawyers`. The existing firm photos must not be falsely described as pictures of a particular branch, court session or public event.

## Approved local source images available in repository
- `/images/firm/firm-office-team.jpg`
- `/images/firm/firm-team.jpg`
- `/images/firm/managing-partner-office.png`
- Six individually identified lawyer portraits under `/images/lawyers/`.

## Publishing and editorial caution
- All page templates and resource hubs now have source-level replacement or guard coverage for recognized generic remote stock domains.
- Existing CMS-authored individual blog, legal-news, and other editorial images require manual review in the live Sanity dataset; many may use `cdn.sanity.io` and cannot be classified as Nigerian or foreign solely from their URL.
- The firm's production Sanity API has reported `Payment Required`. CMS image auditing, replacement and publishing cannot be certified without restoring authorised dataset access.
- Do not replace authentic public-event images, court evidence, documents, or images for which rights/attribution have been established merely because an image was sourced externally. Validate actual nationality/geography where the subject is relevant.
- Prefer original Nigeria-specific imagery with properly documented rights: Lagos/Ikeja and Magodo offices (only verified photographs), Nigerian legal professionals, authentic meeting scenes, Nigerian public architecture (where photo rights permit), Lagos/Abuja skylines. If synthetic visuals are used, do not imply a depicted person is an actual lawyer, client or official, or that a fabricated scene is a real event.
- Where several category hubs now reuse the same firm-wide photograph, commission/licence a small set of differentiated, accurate Nigerian photographs to improve visual diversity.
- Check mobile render, contrast/crop/focal point, LCP and alt text after deployment. Avoid adding larger-than-needed media files.

## Follow-up validation
1. When Sanity access returns, inspect every published image asset and its rights/caption, particularly legacy blog posts and news articles.
2. Create a per-URL ledger of any remaining foreign imagery and whether the images have legitimate editorial relevance.
3. Replace inappropriate images with Nigerian alternatives whose provenance and licence are documented. Update alt text and social share images where needed.
4. Recheck mobile/desktop visual presentation and Core Web Vitals using live browser measurements; Vercel READY alone does not certify these.

The changes deliberately do not alter legal copy, slugs, canonical URL patterns, sitemap routes, or metadata structures.
