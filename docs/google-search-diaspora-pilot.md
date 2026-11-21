# Chaman Law Firm: diaspora Google Search pilot (draft, inactive)

This is a configuration brief for review in the existing Google Ads account. Do not enable spending until the account, currency, billing, duplicate campaigns and conversion actions have been inspected and the owner approves activation.

## Campaign settings

- Name: `CLF | Search | Diaspora Legal | US UK CA | Pilot`
- Type: Search only; Google Search Network only. Disable Display Network, search partners and automatically created assets for the initial controlled pilot.
- Budget: **₦10,000 average daily**, shared by all four ad groups in this one campaign, conditional on an NGN Google Ads account. If the account uses another currency, obtain the approved converted amount before creation. Google's average daily budget is not a hard daily cap.
- Locations (included): United States: New York City, Houston, Dallas–Fort Worth, Atlanta, Washington DC metro, Chicago; United Kingdom: Greater London, Birmingham, Manchester; Canada: Greater Toronto Area, Ottawa, Calgary. Resolve exact eligible Google Ads geo targets in the account before saving; use the intended city/metro rather than broad countries. Exclude Nigeria. Set location option to **Presence: people in or regularly in targeted locations**, not Presence or interest.
- Language: English. Ads must be eligible for searches about Nigerian services from these locations; location is a geographic signal, not proof of citizenship or nationality.
- Bidding: begin with Maximize clicks and a reviewed CPC ceiling if no reliable primary conversion history exists; consider Maximize conversions after lead quality and conversion measurements are verified. Avoid selecting generic page views or WhatsApp clicks as the primary conversion.
- Final URL: one matching page per ad group; preserve auto-tagging and GCLID. No public consultation fee or promise of outcome. Do not add audience lists based on sensitive legal matters.

## Ad groups and keywords

Phrase and exact match only. Review search terms during the pilot; phrase/exact can still match close variants.

| Ad group | Final URL | Initial keywords |
| --- | --- | --- |
| Property purchase | `/buy-property-nigeria-from-abroad` | [property lawyer nigeria diaspora], "buy property in nigeria from abroad lawyer", [conveyancing lawyer lagos], "nigerian lawyer for property purchase" |
| Due diligence | `/property-verification-nigeria` | [property due diligence lawyer nigeria], "verify property title lagos lawyer", [land title verification lagos], "property verification nigeria lawyer" |
| Corporate transactions | `/corporate-cac-legal-services-nigeria` | [corporate lawyer nigeria], "nigerian business acquisition lawyer", [commercial contract lawyer lagos], "company legal due diligence nigeria" |
| Probate | `/probate-estate-administration-nigeria` | [probate lawyer nigeria], "letters of administration lawyer lagos", [estate administration lawyer nigeria], "nigerian inheritance lawyer abroad" |

Use cross-group negatives when search terms overlap and the intent belongs to a different service page.

### Campaign-level negatives (initial)

`free`, `pro bono`, `legal aid`, `job`, `jobs`, `vacancy`, `internship`, `salary`, `course`, `courses`, `school`, `student`, `exam`, `past questions`, `definition`, `meaning`, `pdf`, `template`, `sample`, `form download`, `DIY`, `house for rent`, `cheap house`, `property listing`, `rightmove`, `zillow`, `visa`, `immigration`, `divorce`, `tenant rights`, `landlord rights`.

Do not negate `Nigeria`, `Nigerian`, `Lagos`, `probate`, `property`, or `lawyer`. Check each negative against actual search terms before adding wider variants.

## Responsive Search Ads

Create one RSA in each group initially, with 10–12 relevant headlines and 3–4 descriptions. Keep headlines within 30 characters and descriptions within 90. Mix the following without pinning every position; do not make claims of guaranteed results.

| Group | Suggested headlines | Suggested descriptions |
| --- | --- | --- |
| Property purchase | Buy Property in Nigeria; Nigerian Property Lawyers; Buying From Abroad?; Check Before You Pay; Counsel for Diaspora Buyers; Review Title and Contracts; Chaman Law Firm | Buying in Nigeria from abroad? Instruct independent counsel before paying or signing.; We review title, seller authority and contract terms. Request a confidential consultation. |
| Due diligence | Verify Property Title; Nigerian Land Due Diligence; Check Seller Authority; Lagos Property Searches; Independent Legal Review; Chaman Law Firm | Have Nigerian property documents reviewed before you commit funds. Speak with counsel.; Title, survey and seller authority checks tailored to the location and documents. |
| Corporate | Corporate Lawyers Nigeria; Nigerian Business Counsel; Review Your Transaction; Contracts and Governance; Counsel for Investors; Chaman Law Firm | Nigerian corporate counsel for contracts, investment and transaction due diligence.; Discuss your transaction remotely. We confirm scope after a confidential intake review. |
| Probate | Probate Lawyers Nigeria; Estate Matters in Nigeria; Letters of Administration; Support for Families Abroad; Nigerian Probate Counsel; Chaman Law Firm | Get guidance on Nigerian probate, estate assets and administrator authority from abroad.; Tell us about the Will, estate location and urgent deadlines. Request a private review. |

Add sitelinks to matching service pages, contact and firm profile only after confirming each URL and visible copy. Avoid call assets that route overseas callers to an unattended number.

## Conversion, lead handling and payment gates

1. Primary conversion: accepted enquiry returned `201` by `/api/leads`, counted once per unique lead reference. Deduplicate across any GA4 import and native Google Ads action. Do not treat a page load on `/thank-you` alone as proof; it can be opened without submitting a form.
2. Preserve existing consent-gated GA4 behavior; check the actual GA4 property, GTM container and Google Ads conversion account before changing tags. The app currently sends `generate_lead` after a successful response; verify in DebugView/Tag Assistant and the Ads conversion screen before using it for bidding.
3. Confirm the lead webhook destination, CRM field mapping, duplicate rules, routing, retention and conflict-check workflow in the actual account. Store GCLID and UTM fields; do not send full confidential narratives to analytics.
4. Paystack checkout should be offered privately after intake, conflict check and a quoted fee accepted by the client. Use a server-created Paystack transaction or existing approved payment link, verify the transaction server-side or by signed webhook, and mark the CRM record paid only after verification. Do not embed a secret key or quote a fee on public pages. Existing Paystack account and currency capabilities must be verified before implementation.
5. Confirm Google Ads billing method, balance, currency, account-level spend controls, active campaigns and policy status. A ₦10,000 average daily budget can spend up to ₦20,000 on some days, subject to Google's monthly spending limit for most campaigns.

## Verification before activation

Review mobile and desktop landing pages, successful and failed form submissions, one CRM record with attribution, consent-aware tag firing, Ads test conversion status, payment test mode and signed verification, geo and network settings, all ad previews, negatives and billing. Obtain the owner's final approval for the exact account, campaign, locations, budget and conversion actions before enabling.
