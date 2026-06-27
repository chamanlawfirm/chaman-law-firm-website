# Sprint 9P DNS Inventory Template

Date: 2026-06-27

Purpose: capture the current DNS state before moving `chamanlawfirm.com` to Vercel.

Do not change DNS while completing this template.

## Domain

- Domain: `chamanlawfirm.com`
- Registrar:
- DNS host:
- Current nameservers:
- Person taking inventory:
- Date/time of inventory:

## Nameservers

| Host | Current value | Notes |
| --- | --- | --- |
| NS 1 |  |  |
| NS 2 |  |  |
| NS 3 |  |  |
| NS 4 |  |  |

## Website Records

| Type | Name/Host | Current value | TTL | Keep/change | Notes |
| --- | --- | --- | --- | --- | --- |
| A | @ |  |  | prepare for Vercel only after approval | Apex domain |
| CNAME | www |  |  | prepare for Vercel only after approval | www domain |

## Email Records

Email records must not be deleted during website cutover.

| Type | Name/Host | Current value | TTL | Keep/change | Notes |
| --- | --- | --- | --- | --- | --- |
| MX | @ |  |  | keep | Mail delivery |
| TXT | @ |  |  | keep | SPF |
| TXT | selector._domainkey |  |  | keep | DKIM |
| TXT | _dmarc |  |  | keep | DMARC |

## Verification Records

| Type | Name/Host | Current value | TTL | Keep/change | Notes |
| --- | --- | --- | --- | --- | --- |
| TXT | @ |  |  | keep | Google verification if present |
| TXT | @ |  |  | keep | Bing verification if present |
| TXT | @ |  |  | keep | Other verification |

## Vercel Records To Prepare

Do not enter final values until the Vercel domain screen provides the exact records.

| Purpose | Type | Name/Host | Vercel value | TTL | Status |
| --- | --- | --- | --- | --- | --- |
| Apex domain | A or Vercel-recommended value | @ |  | 300 if allowed | pending |
| www domain | CNAME | www |  | 300 if allowed | pending |

## Cutover Recommendation

Recommended method: Option A.

Option A: move only website records to Vercel while preserving email and verification DNS records.

Option B: change nameservers only if absolutely necessary and separately approved.

## TTL Recommendation

- If the DNS provider allows it, lower relevant website-record TTLs to 300 seconds before cutover.
- Do not alter email-record TTLs unless the email administrator approves.

## Expected Propagation Window

- Some users may see the new site within minutes.
- Full propagation can take up to 24 to 48 hours depending on DNS provider and caching.

## Records That Must Not Be Deleted

- MX records.
- SPF TXT records.
- DKIM TXT records.
- DMARC TXT records.
- Google/Bing verification records unless intentionally replaced.
- Any other email, workspace, or security verification records.
