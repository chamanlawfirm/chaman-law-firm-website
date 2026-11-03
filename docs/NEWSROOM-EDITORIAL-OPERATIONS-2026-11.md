# CHAMAN LAW FIRM — NIGERIA NEWS AND CURRENT AFFAIRS EDITORIAL OPERATING POLICY
**Version:** 1.0 — 3 November 2026
**Website:** https://chamanlawfirm.com/resources/legal-news
**Authoring:** https://chamanlawfirm.com/studio → Legal News
**Status:** Editorial blueprint; editors must receive approved CMS access and verify production publishing before commencing a daily news operation.

## 1. Editorial positioning
Chaman Law Firm publishes **Nigeria News, Current Affairs and Legal Developments** as a service to Nigerian readers, businesses, investors, property owners and the diaspora. The product combines reliable factual reporting or independently sourced summaries with useful legal, compliance, economic and public-policy context.

The firm is **not** a wire service. Publish original interviews, analysis, legal implications and verified public-information updates. Do not scrape or republish full third-party stories, manufacture quotes, or claim original reporting of an event witnessed only through another outlet. Political reporting must be factual, balanced and distinctly separate from any commentary. Do not confuse an allegation, court filing, interim ruling or police statement with a proven fact.

## 2. Existing live architecture
- Hub: `/resources/legal-news`; canonical individual story: `/resources/legal-news/{slug}`.
- Built-in Sanity Studio already has a **Legal News** document type with title, slug, excerpt, author, main image/alt text, body, dates, tags, related practice areas, FAQs and SEO.
- New editorial fields: category, reporting format, primary source name and URL, last fact verification, public correction note.
- Existing `NewsArticle` structured data, title and meta description, social sharing and site-wide sitemap support are reused.
- Server data caching adjusted from 30 days to five minutes (not an instant push guarantee); sitemap currently revalidates hourly.
- Future-dated items are not publicly displayed by the content queries; scheduling still requires the CMS release/scheduling workflow.
- Placeholder media entries are not treated as genuine published reporting.
- No automatic news ingestion, auto-publication, publisher licence, syndication agreement, Google News admission or social posting automation has been created.

## 3. Sections and editorial coverage
1. **National Affairs** — national announcements, institutions and public-interest developments.
2. **Government & Public Policy** — legislation, agency circulars, policy commencement, regulatory effects.
3. **Economy, Business & Finance** — NBS, CBN and other officially reported indicators, corporate developments, jobs, investments, trade.
4. **Property, Housing & Infrastructure** — land governance, development approvals, housing, planning, transport infrastructure; key firm authority area.
5. **Courts, Law & Regulation** — legislation, judgments, regulatory and professional notices. Detailed judgments should link to the separate Court Updates section.
6. **Security & Public Safety** — verified alerts, official statements, legally sensitive reporting.
7. **Education, Health & Society** — public institutions, labour, education, service-delivery issues.
8. **Technology & Innovation** — digital economy, privacy, technology regulation, cyber issues.
9. **States & Local Communities** — state and local government developments relevant to Nigerians nationwide.
10. **International Affairs Affecting Nigeria** — consular, diaspora, trade, travel and cross-border developments.

Every article should have an identifiable audience benefit. Avoid publishing unrelated celebrity rumours, unsubstantiated viral claims, pornography, copied press releases without added context or clickbait purely to inflate traffic.

## 4. Publishing workflow and responsibilities
**Reporter / Researcher (Contributor)** → verify facts and capture source records; save draft. They cannot publish.
**News Editor (Editor)** → assess relevance, sources, copy editing, rights, conflicts, defamation and corrections.
**Legal Reviewer (designated lawyer)** → mandatory review for legal advice, judgments, allegations, regulatory interpretation, criminal accusations or sensitive client matters.
**Publisher / Managing Editor (authorised Editor or custom publishing role)** → final review, approve and publish or schedule; confirm public URL and metadata.
**Managing Partner / Management** → escalations, corrections, crisis stories, disputes, legal risk, access oversight and monthly performance review.

A Sanity built-in Editor can publish. Contributor is drafts-only. If the firm requires strict approval by two named persons, do not rely on instructions alone: configure custom roles/document workflows in Sanity (subject to plan capabilities), or enforce written manual signoff and use credentials only for the authorised publisher. Never share one staff login; revoke access on exit. Confirm actual roles in the project's own organization before inviting staff.

## 5. Story verification checklist (mandatory, before publication)
- [ ] Clear public-interest angle and the Nigeria-specific implication.
- [ ] Confirm **what happened and when**; distinguish event date, source publication date and article publication date (Nigeria local timezone).
- [ ] Identify **primary source**: official document, original interview, published decision or direct record. Add the original HTTPS URL where available.
- [ ] Corroborate contested claims independently; seek a relevant response for serious allegations.
- [ ] Attribute material originating with third-party newsrooms and link to source; do not reproduce long protected text or unlicensed images.
- [ ] Verify spelling, figures, locations, names, quotes and currency; check context of old events resurfacing as current.
- [ ] Flag unverified social-media reports as unconfirmed or do not publish.
- [ ] Clearly label reportage, opinion, analysis and sponsored content. No undisclosed paid stories.
- [ ] Conduct privacy and defamation review, especially for minors, criminal allegations, employment claims and court reporting.
- [ ] Confirm the image belongs to the firm or is properly licensed; alt text describes the actual image; add attribution where required.
- [ ] Ensure sufficiently original reporting, substantive analysis or genuinely useful synthesis.
- [ ] Give a descriptive title, concise 120–180-character excerpt, unique slug, proper author identity, category and related pages.
- [ ] Confirm title/meta/canonical, mobile layout, clean source link, Article structured data, share preview and publication date.
- [ ] Confirm correct draft/review approval and scheduled publication state before sharing.
- [ ] Monitor the published story and keep a correction record for material changes.

## 6. Recommended article template
**Headline:** Fact-first, specific, no sensational exaggeration.
**Standfirst:** 1–2 sentences describing the verified development.
**When / Where / Who:** Dates, location, direct source and key actors.
**The development:** What is known; separate unverified matters.
**Background:** 1–3 relevant facts establishing context.
**Why it matters:** Impact on Nigeria, local residents, investors, companies or the diaspora.
**Legal or practical perspective:** Only when relevant; distinguish general information from specific legal advice.
**Sources:** Accessible official record or original publisher link; use the new source-name/source-URL fields.
**Updated/correction note:** Clearly describe substantive updates and changes.
**Related reading:** Link naturally to an existing practice page or explainer; never stuff commercial links into every news item.

## 7. Cadence and publishing schedule (suggested, not a promise)
**First 2 weeks:** 2–4 rigorously sourced articles each weekday plus one substantial weekly legal/current-affairs explainer; maintain a queue of at least 1 working day.
**Weeks 3–8:** Increase only if editors consistently meet verification and review standards. Prioritise relevance over quantity; no unsupervised automated publishing.
**Daily newsroom meetings (Lagos time):** 08:30 morning assignment, 13:00 verification/edits, 16:30 next-day queue review. Urgent developments can use a separate signed-off breaking-news route.
**Weekly:** check duplicate URLs, Search Console queries, corrections, source quality and newsletter/social click-through.

Do not pretend automated distribution has been set up. Scheduling can use Sanity **Scheduled drafts** or **Content Releases** where the plan and roles allow; avoid the deprecated Scheduled Publishing plugin.

## 8. Discoverability and monetisation principles
- Publish canonical, indexable, fast article pages with accurate authorship, timestamps and useful structured data.
- Provide a clear news-category experience without spawning thin duplicate archives; build separate indexable category pages only after there is enough distinct content.
- Add internal links to relevant previous news, legal explainers and service pages where editorially appropriate.
- Social distribution: Facebook, LinkedIn, X, Instagram, TikTok and WhatsApp summaries should link to the originating page, use factually supported claims and identify the publisher. Approval before publishing.
- Start with GA4 and Search Console measurement: impressions, organic clicks, CTR, engaged sessions, returning readers, newsletter opt-ins (only with consent) and qualified enquiries. Never state rankings or traffic without measurements.
- Revenue: quality leads, retainers and professional trust first; sponsorship or advertising only with clearly labelled separation, conflict checks and professional/ethical review.
- Google News: being indexed, having NewsArticle markup or a news sitemap does not guarantee discovery or Top Stories eligibility.
- If Google News sitemap is later warranted, include only news from the **last two days** and ensure it is maintained dynamically; the ordinary sitemap already carries article URLs.

## 9. Corrections, rights and confidentiality
Provide an editorial corrections email (existing firm email initially); investigate promptly, document what changed and when and place the correction note prominently in the article. Do not silently rewrite allegations, erase legitimate historical context, or conceal correction requests. Never use confidential instructions, case records or identifying client facts without lawful authorisation. Retain evidence/source records in a restricted editorial archive, not in public CMS fields.

## 10. Operational blockers and go-live acceptance
**Current known blocker:** the website production Sanity project ID `eeuefmhu` is not accessible through the connected Sanity app; available account sees other projects. Earlier builds showed Sanity `Payment Required` responses with fallback site content. This must be resolved with the owning Sanity organization/account. Obtain both correct project access and billing status before promising editor publication.
**Go-live checks:** authenticate as Contributor and Editor, create a synthetic draft (not public), verify reviewer controls, publish a genuine verified news article, confirm the live URL and structured data, verify Search Console sitemap discovery, record publication-to-visible latency, and test social preview. No unverified synthetic article should be published as real news.

## 11. Next 10 editorial topics (assign only after verifying current facts)
- Federal housing-policy announcement: what is official and whom it affects.
- Latest published CBN policy decision and implications for small businesses.
- NBS inflation or labour report explained with data and source.
- New or amended Lagos land / planning / tenancy rule, if officially in force.
- Verified CAC filing or public-search procedure change.
- National infrastructure procurement project with documents and public impact.
- Data protection commission guidance and business compliance.
- Federal or state tax measure: effective date, scope and obligations.
- Significant Nigerian appellate judgment with citation and procedural context.
- Official diaspora/consular change affecting property transactions or documentation.

No article may be labelled "latest" merely because the topic is on this list. Verify dates and official sources first.
