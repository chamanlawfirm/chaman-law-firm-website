# CHAMAN LAW FIRM — NIGERIA NEWSROOM OPERATING MANUAL
Version 1.0 | Prepared 3 November 2026 | Editor-in-Chief/Managing Partner approval required before operational use

## 1. Purpose and editorial positioning
**Existing public URL:** https://chamanlawfirm.com/resources/legal-news
**Existing CMS:** Sanity Studio at https://chamanlawfirm.com/studio (requires authorised access)
**News RSS:** https://chamanlawfirm.com/resources/legal-news/feed.xml

Publish timely, verifiable reporting about major developments in Nigeria, interpreted clearly for citizens, businesses, investors and diaspora readers. Retain the firm's independent expertise in legal and regulatory matters; distinguish general news, legal analysis, opinion, sponsored material and the firm's own announcements. This is a legal-practice newsroom, not an unverified breaking-news aggregator. Do not report rumours as news, republish other publishers' articles wholesale or manufacture stories.

The legacy URL /resources/legal-news is preserved; do not create a competing /news listing unless an intentional redirect and SEO migration are approved.

## 2. Editorial desks / coverage priorities
A. National affairs, politics and governance — official appointments, budget announcements, legislation, electoral administration, policies (strictly factual, balanced).
B. Courts, legal developments and justice — verified judgments, rules, litigation of public importance; distinguish allegations, filings, orders and final decisions.
C. Business, economy and finance — monetary policy, taxes, market regulations, SMEs, investment.
D. Property, housing, land, infrastructure — title policy, development, tenancy changes, acquisitions, Lagos/Ogun/FCT property.
E. Security and public safety — verified government and first-hand notices; respect privacy and public safety.
F. Education, health and society — confirmed institutional and policy updates, non-sensational.
G. Technology, digital business and consumer protection — technology laws, data protection, CAC and digital identity updates.
H. States and communities — Lagos, Ogun, Abuja and other confirmed local coverage without pretending local reporting occurred.
I. Diaspora and international developments affecting Nigerians — immigration, consular, travel, remittances, international commercial changes.

Prioritise Nigerian events with practical consequences. Keep local community news separate from confidential client matters and the firm's advertising. Start with 3–5 fully verified stories per working day **only if staff and source verification capacity support this**. Quality beats volume.

## 3. Roles and separation of duties
- Reporter / Contributor: researches, verifies and drafts; cannot approve their own story.
- Section editor: checks headline, evidence, quotations, spelling, attribution, category, images and source URLs; may request revisions.
- Fact checker / researcher: records sources, primary documents, chronology, uncertainty, checks against official records.
- Legal review lawyer: approves high-risk allegations, ongoing cases, contempt/privacy/defamation-sensitive stories, professional conduct and conflicts.
- Editor-in-Chief / authorised publisher: final editorial judgment; verifies approval and publishes/schedules.
- SEO / distribution editor: metadata, accessible images, internal links, social excerpts, canonical, Search Console follow-up; does not rewrite material facts without editor approval.
- Systems administrator: manages Sanity permissions, backups and technical releases; not inherently an editorial approver.

Configure actual **Sanity organisation/project roles** to restrict publication where permitted. A field named `editorialStatus` is only a content gate, not proof of RBAC. Do not share a single administrator account among staff.

## 4. Standard story workflow
1. **Pitch:** Who, what, when, where, why important, primary source, expected audience. Check against existing CMS to avoid duplicates.
2. **Verification:** Prefer primary documents, government releases, court orders or direct named statements. Confirm with two independent sources when appropriate; record uncertainty, exact dates and links.
3. **Draft in Sanity:** Create `legalNews`, title, slug, 2–3 sentence excerpt, category, reporting type, author, featured image with alt, body, dated event, primary source and additional sources. Keep `editorialStatus=draft`.
4. **Review:** Section editor checks factual precision, source rights and whether commentary is clearly labelled. Set `review` while awaiting approval. Do not present draft assertions as established facts.
5. **Sensitive-content legal sign-off:** Required for accusations, criminal allegations, disputes involving identifiable people, ongoing proceedings, minors, private client matters, graphic material and high legal/reputational risk.
6. **Final approval:** Independent authorised editor sets `editorialStatus=approved`, verifies original `publishedAt` in Africa/Lagos time, then publishes in Studio. A published Sanity document is visible only when its approval field and effective date allow it.
7. **Verification after release:** Check public URL, title, displayed byline/date/time, canonical, open graph image, source references, RSS entry, links, and mobile rendering; ensure site and CMS fetch succeeded.
8. **Distribution:** Share one accurate headline/excerpt and canonical link on firm channels; tailor to platform; do not manipulate headlines to mislead. Track results.
9. **Corrections:** Promptly update materially wrong facts, add visible correction notice and modification date, retain the original URL. Do not falsely reset publication dates to look fresh.
10. **Archive:** Preserve old news URLs where lawful and meaningful, update developing stories when material; redirect only when an actual consolidation justifies it.

## 5. Publishing checklist — non-negotiable
- Exact names, dates, amounts, places, institutions and law references verified; uncertainties attributed.
- Headline accurate, not clickbait; the article answers the headline.
- Clearly labelled original reporting, verified news summary, analysis or opinion.
- Named byline or verifiable desk attribution; source documents and relevant external links.
- No copied articles, competitor images, falsely implied interviews, fake stock photos as event photos, fake quotations or AI-fabricated sources.
- Consent, licensing, attribution and privacy for all media; avoid personal confidential information.
- Balanced political coverage and clear distinction between allegation, charge, ruling and conviction.
- Body adds reporting or material explanation beyond a press release. Distinguish legal guidance from general information; do not create solicitor–client relationship through an article.
- Source of financial, health or high-stakes claims identified; attorney review for legal conclusions.
- Descriptive, unique SEO title, excerpt/description, canonical, one H1, accessible image alt, relevant internal links and correct publication/update time.
- No future timestamp made publicly visible before publication; no approval by the story's own author.
- No confidential client story unless lawfully approved and appropriately anonymised, with professional duties observed.

## 6. SEO and discoverability
The existing article URL pattern is /resources/legal-news/<slug>; preserve it. NewsArticle structured data exists in the shared article component. Visible authorship, publication date/time, clear source links and corrections build transparency; none guarantees Google News admission.
The site has a normal sitemap at /sitemap.xml. The dedicated newsroom RSS feed is /resources/legal-news/feed.xml. For Google News, consider a dedicated news XML sitemap **once approved articles exist**, containing only items from the preceding two days and valid news:news elements. Submit it in Search Console after validating it. See Google's official News sitemap and publisher guidance.
Do not change the original publication date except where legitimate policy allows; display updated time separately if materially edited. Avoid mass-produced near-duplicate articles solely for keywords.

## 7. Daily desk routine (Africa/Lagos)
08:30–09:00: scan credible sources and confirm daily desk priorities.
09:00–11:00: research / verification and draft.
11:00–13:00: senior review, legal review for sensitive issues, approved publishing.
14:00–17:00: further verified developments, corrections and social distribution.
Before close: check links, source disputes, clarification requests and analytics.
Breaking news requires independent senior approval and should not bypass verification. Adjust hours to staff capacity.

## 8. Editorial calendar and targets — initial 30 days
Week 1: credentials, roles, CMS billing/access, source list, approval exercise and 3–5 pilot stories after successful technical verification.
Week 2: daily verified output, section balance, social distribution and corrections log.
Week 3: expand reporting formats—explainer, original interview, policy tracker—where evidence is available.
Week 4: assess useful clicks, search impressions, publisher credibility, engaged sessions and qualified enquiry conversions before raising volume.

Track: submitted pitches, verified stories, median draft→approval time, corrections, source completeness, timely publication, organic Google Search clicks and impressions, social referral sessions, engaged reading and appropriate consultation leads. Avoid vanity click targets that incentivise inaccurate reporting.

## 9. Critical activation dependencies discovered in the website
- The frontend/Sanity schema is present and now has editorial status, news desk and source fields.
- The production Sanity project was previously observed returning **Payment Required / project blocked due to non-payment**. Recheck the current account/billing status at https://www.sanity.io/manage. Until access and content fetch are confirmed, live editorial publishing cannot be certified.
- The connected Sanity organisation did not expose the firm's production CMS project to this assistant; a Sanity owner must authorise the intended publisher/editor accounts and separately configure least-privilege roles.
- The existing article media images include third-party Unsplash defaults; new news imagery must be licensed/owned and accurately captioned.
- Sanity Studio authoring at /studio is not an office staff-management dashboard. Do not imply that a specific user role is already restricted until verified.
- Do not publish invented stories, automatically pull copyrighted publisher articles, or auto-publish AI summaries without review.

## 10. First editor assignment
Each editor drafts one story from an official Nigerian primary source with (a) the original link and document date, (b) accurate headline, (c) 150–400 words of independently written context, (d) article category, (e) named byline, (f) approved image or no image, (g) clear legal/public implication where appropriate, (h) a source-verification note and (i) a proposed publish time. The editor-in-chief signs off, then confirms how the story renders live.

## 11. Escalation
Factual correction: notify editor-in-chief immediately; annotate the change.
Legal complaint/takedown demand: preserve evidence, refer to supervising lawyer, assess promptly, respond professionally, do not silently delete.
Conflict of interest, paid placement or advocacy: declare and label clearly before publication.
Client confidential information: stop and escalate to responsible lawyer; do not publish.
