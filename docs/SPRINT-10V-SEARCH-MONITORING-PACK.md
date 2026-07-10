# Sprint 10V Search Monitoring Pack

Generated: 2026-07-10

## Purpose

Use this pack for Google Search Console and Bing Webmaster follow-up after Sprint 10T redirect activation. Submit and inspect approved, public, canonical URLs only.

Do not inspect hidden drafts, unapproved Sanity documents, staging URLs, Vercel preview URLs, or unknown legacy URLs that do not yet have exact approved targets.

## Homepage Inspection Checklist

- URL: `https://chamanlawfirm.com/`
- Confirm status is indexed or submitted for indexing.
- Confirm canonical is `https://chamanlawfirm.com/`.
- Confirm no preview URL is selected as canonical.
- Confirm no mobile usability issue.
- Confirm no redirect error.

## Blog Index Inspection Checklist

- URL: `https://chamanlawfirm.com/resources/blog`
- Confirm page is crawlable and indexable.
- Confirm canonical is production apex domain.
- Confirm approved articles are visible.
- Confirm hidden drafts are not visible.

## Sitemap Refresh Checklist

- Submit or resubmit: `https://chamanlawfirm.com/sitemap.xml`
- Confirm sitemap fetch status is successful.
- Confirm sitemap contains approved public URLs only.
- Confirm no `vercel.app` or preview URLs appear.
- Confirm `/studio` and `/api` are not submitted.

## Sprint 10T Approved Article URLs

| Article | Public URL | GSC status | Bing status | Notes |
| --- | --- | --- | --- | --- |
| Ultimate Legal Guide to Buying Land in Nigeria | `https://chamanlawfirm.com/resources/blog/ultimate-legal-guide-to-buying-land-in-niger` | pending inspection | pending inspection | approved/live/sitemap included |
| Managing Corporate Reputation | `https://chamanlawfirm.com/resources/blog/managing-corporate-reputation` | pending inspection | pending inspection | approved/live/sitemap included |
| Land Registration in Lagos | `https://chamanlawfirm.com/resources/blog/land-registration-in-lagos` | pending inspection | pending inspection | approved/live/sitemap included |
| Property Taxes When Buying Real Estate | `https://chamanlawfirm.com/resources/blog/what-property-taxes-must-i-pay-when-buying` | pending inspection | pending inspection | approved/live/sitemap included |
| Enhancing Nigerian Immigration Security | `https://chamanlawfirm.com/resources/blog/enhancing-nigerian-immigration-security-2` | pending inspection | pending inspection | approved/live/sitemap included |
| Challenge a Fraudulent Probate Application | `https://chamanlawfirm.com/resources/blog/challenge-a-fraudulent-probate-application` | pending inspection | pending inspection | approved/live/sitemap included |
| Corporate Debt Management Practices | `https://chamanlawfirm.com/resources/blog/corporate-debt-management-practices` | pending inspection | pending inspection | approved/live/sitemap included |
| Immigration Compliance Lawyers in Nigeria | `https://chamanlawfirm.com/resources/blog/of-immigration-compliance-lawyers` | pending inspection | pending inspection | approved/live/sitemap included |
| Top Legal Mistakes Property Buyers Make | `https://chamanlawfirm.com/resources/blog/top-10-legal-mistakes-property-buyers-make-i` | pending inspection | pending inspection | approved/live/sitemap included |
| Debt Recovery and Consumer Protection Laws | `https://chamanlawfirm.com/resources/blog/debt-recovery-and-consumer-protection-laws` | pending inspection | pending inspection | approved/live/sitemap included |

## Sprint 10T Old Redirected URLs

| Old URL | Expected target | Redirect seen | Error | Notes |
| --- | --- | --- | --- | --- |
| `https://chamanlawfirm.com/ultimate-legal-guide-to-buying-land-in-niger/` | `/resources/blog/ultimate-legal-guide-to-buying-land-in-niger` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/managing-corporate-reputation/` | `/resources/blog/managing-corporate-reputation` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/land-registration-in-lagos/` | `/resources/blog/land-registration-in-lagos` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/what-property-taxes-must-i-pay-when-buying/` | `/resources/blog/what-property-taxes-must-i-pay-when-buying` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/enhancing-nigerian-immigration-security-2/` | `/resources/blog/enhancing-nigerian-immigration-security-2` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/challenge-a-fraudulent-probate-application/` | `/resources/blog/challenge-a-fraudulent-probate-application` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/corporate-debt-management-practices/` | `/resources/blog/corporate-debt-management-practices` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/of-immigration-compliance-lawyers/` | `/resources/blog/of-immigration-compliance-lawyers` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/top-10-legal-mistakes-property-buyers-make-i/` | `/resources/blog/top-10-legal-mistakes-property-buyers-make-i` | yes | no | one-hop 308 verified |
| `https://chamanlawfirm.com/debt-recovery-and-consumer-protection-laws/` | `/resources/blog/debt-recovery-and-consumer-protection-laws` | yes | no | one-hop 308 verified |

## Inspection Status Table

| URL | Indexed | Discovered | Crawled not indexed | Redirect seen | Error | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `https://chamanlawfirm.com/` | pending | pending | pending | no | pending | inspect homepage |
| `https://chamanlawfirm.com/resources/blog` | pending | pending | pending | no | pending | inspect blog index |
| `https://chamanlawfirm.com/sitemap.xml` | pending | pending | pending | no | pending | resubmit sitemap |

## Selective Indexing Rules

- Request indexing for the homepage, blog index, and highest-value approved articles first.
- Inspect old redirected URLs to confirm Google sees the 308 and target canonical.
- Do not request indexing for hidden drafts or URLs returning 404 by design.
- Do not submit unknown legacy URLs until an exact approved target exists.
