const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://cdn.sanity.io",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests"
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
];

const emergencyLegacyRedirects = [
  { source: "/family-law-lawyer-near-me", destination: "/practice-areas/family-law" },
  { source: "/get-the-top-legal-advice-from-experts-for-free", destination: "/consultation" },
  { source: "/top-legal-services", destination: "/consultation" },
  { source: "/obtaining-a-certificate-of-occupancy-c-of-o", destination: "/resources/blog/how-do-i-obtain-a-certificate-of-occupancy" },
  { source: "/4-steps-on-how-to-deal-with-a-bad-landlordin", destination: "/resources/blog/4-steps-on-how-to-deal-with-a-bad-landlordin" },
  { source: "/joinder-of-parties-misjoinder-of-parties", destination: "/resources/blog/joinder-of-parties-misjoinder-of-parties" },
  { source: "/gain-nigerian-citizenship-by-marriage", destination: "/practice-areas/immigration-services" },
  { source: "/statutory-right-of-occupancy-vs-customary-right", destination: "/resources/blog/statutory-right-of-occupancy-vs-customary-right" },
  { source: "/5-steps-on-how-to-obtain-restraining-order", destination: "/resources/blog/5-steps-on-how-to-obtain-restraining-order" },
  { source: "/child-support-and-maintenance-payment", destination: "/resources/blog/child-support-and-maintenance-payment" },
  { source: "/how-to-replace-a-lost-a-marriage-certificate", destination: "/resources/blog/how-to-replace-a-lost-a-marriage-certificate" },
  { source: "/legal-steps-to-take-when-our-land-has-been", destination: "/resources/blog/legal-steps-to-take-when-our-land-has-been" },
  { source: "/rights-of-tenants-in-ogun-chaman-law-firm", destination: "/resources/blog/rights-of-tenants-in-ogun-chaman-law-firm" },
  { source: "/what-is-the-implication-of-quit-notice", destination: "/practice-areas/property-real-estate-law" },
  { source: "/polygamy-and-multiple-marriages-in-nigeria", destination: "/practice-areas/family-law" },
  { source: "/steps-to-permanent-residency-in-nigeria", destination: "/resources/blog/steps-to-permanent-residency-in-nigeria" },
  { source: "/sharing-of-property-after-divorce-in-nigeria", destination: "/resources/blog/sharing-of-property-after-divorce-in-nigeria" },
  { source: "/challenges-facing-the-nigerian-court-system", destination: "/resources/blog/challenges-facing-the-nigerian-court-system" },
  { source: "/how-to-secure-child-support-and-maintenance", destination: "/resources/blog/how-to-secure-child-support-and-maintenance" },
  { source: "/is-foreign-marriage-under-the-nigerian-law", destination: "/resources/blog/is-foreign-marriage-under-the-nigerian-law" },
  { source: "/customary-vs-statutory-marriage-in-nigeria", destination: "/resources/blog/customary-vs-statutory-marriage-in-nigeria" },
  { source: "/void-and-voidable-marriages-in-nigeria", destination: "/practice-areas/family-law" },
  { source: "/dissolution-of-marriage-under-the-nigeria-law", destination: "/resources/blog/dissolution-of-marriage-under-the-nigeria-law" },
  { source: "/annulment-of-marriage-under-the-nigerian-law", destination: "/resources/blog/annulment-of-marriage-under-the-nigerian-law" },
  { source: "/complete-guide-to-probate-registry-in-lagos", destination: "/resources/blog/complete-guide-to-probate-registry-in-lagos" }
].flatMap(({ source, destination }) => [
  { source: `${source}/`, destination, permanent: true },
  { source, destination, permanent: true }
]);

const sprint10lExactArticleRedirectSources = new Set([
  "/abandonment-and-withdrew-of-court-action",
  "/certificate-of-occupancy-in-rivers-state",
  "/deal-with-and-bad-tenant-as-a-landlord",
  "/how-do-i-obtain-a-certificate-of-occupancy",
  "/how-to-register-a-deed-of-assignment-in-ogun",
  "/how-to-handle-land-grabbers-in-ogun-state",
  "/how-to-legally-evict-a-tenant-in-lagos-state",
  "/the-morgage-sell-the-mortgaged-property",
  "/how-to-obtain-dual-citizenship-in-nigeria-a",
  "/legal-remedies-for-breach-of-land-sale-contract",
  "/how-to-obtain-an-infant-visa-in-nigeria",
  "/real-estate-taxes-in-nigeria-transactions",
  "/how-to-apply-for-certificate-of-occupancy-in-nigeria",
  "/certificate-of-occupancy-in-oyo-state",
  "/mastering-nigeria-law-for-contract-an-in",
  "/how-to-apply-for-and-get-a-certificate-of-occupancy-in-enugu-state-nigeria",
  "/difference-between-a-parent-company-and-a-subsidiary",
  "/tenancy-law-of-lagos-state-2011",
  "/how-to-get-international-passport-in-nigeria",
  "/procedures-for-land-registration-in-nigeria",
  "/the-le-a-legally-binding-contracts-in-nigeri",
  "/recovery-of-premises",
  "/how-to-be-a-good-property-lawyer",
  "/what-is-the-cost-of-perfecting-land-titles",
  "/deed-of-assignment-guide-to-register",
  "/proven-steps-on-land-allocation-and-ownership",
  "/land-use-act-and-its-role-in-land-allocation",
  "/how-do-i-draft-tenancy-agreement-in-lagos",
  "/company-management-in-nigeria",
  "/legalimplicationsof-co-ownership-of-property",
  "/lagos-inheritance-law-explained-family-rights",
  "/roles-of-a-property-lawyer-in-real-estate",
  "/how-tohandle-land-disputes-withfamilymembers",
  "/what-is-the-cost-of-perfecting-land-title",
  "/letters-of-administration-in-lagos-state",
  "/procedure-for-company-registration-in-nigeria",
  "/a-complete-guide-on-how-to-register-a-company-in-nigeria",
  "/how-to-apply-for-certificate-of-occupancy-in-lagos-state-nigeria",
  "/taxation-vat-and-other-indirect-taxes-in-nigeria",
  "/transfer-land-ownership-and-land-document"
]);

const sprint10lExactArticleRedirects = [...sprint10lExactArticleRedirectSources].flatMap((source) => [
  { source: `${source}/`, destination: `/resources/blog${source}`, permanent: true },
  { source, destination: `/resources/blog${source}`, permanent: true }
]);

const sprint10nExactArticleRedirectSources = new Set([
  "/navigating-the-probate-registry-in-ogun-state",
  "/how-to-verify-property-titles-in-nigeria",
  "/division-in-divorce-proceedings",
  "/calculate-land-use-charge-chaman-law-firm",
  "/strategies-to-handle-a-bad-tenant-legally",
  "/verify-land-titles-before-buying-property",
  "/business-registration-process-in-lagosa-com",
  "/difference-between-excision-gazette-c-of-o",
  "/9-cyber-crime-prosecution-breakthrough-ch",
  "/how-to-perfect-a-property-title-in-nigeria",
  "/criteria-for-patent-in-nigeria",
  "/what-are-the-penalties-for-fake-land-documents",
  "/estate-administration-in-lagos-state",
  "/mechanisms-for-the-childs-rights-act",
  "/drafting-company-bylaws-in-nigeria-a-compre",
  "/the-essential-ethics-of-debt-recovery",
  "/4-proven-features-of-customary-marriage-and-the-bill-of-rights-conflicting-interests",
  "/how-to-register-a-tech-company-in-nigeria",
  "/understanding-the-land-use-act-in-nigeria",
  "/modernizing-customary-marriage",
  "/priority-in-entitlement",
  "/how-does-the-land-use-act-interact-with-the-petroleum-industry",
  "/legal-bonds-of-marriage-in-nigeria",
  "/is-a-woman-a-property-to-be-inherited",
  "/why-a-certificate-of-occupancy-c-of-o-is",
  "/legal-research-for-nigerian-litigation-cases",
  "/how-is-land-registry-practice-in-nigeria",
  "/effect-of-not-paying-child-support",
  "/legal-requirements-for-land-purchase",
  "/lagos-property-succession-without-a-will",
  "/foreign-wills-and-lagos-property-what-to-know",
  "/police-prosecution-in-nigerian-courts",
  "/what-are-the-legal-rights-of-private-property-owners",
  "/use-arbitration-for-property-disputes-lagos",
  "/how-to-acquire-citizenship-in-nigeria",
  "/types-of-wills",
  "/what-is-trespass-to-land2",
  "/lawful-methods-to-recover-debt-in-nigeria",
  "/how-to-handle-land-grabbers-in-lagos",
  "/land-dispute-resolution-in-nigeria-court-system",
  "/taxes-exemptions-and-incentives-in-nigeria",
  "/the-legal-implications-of-breach-of-contract",
  "/legal-processes-of-transferring-property",
  "/tax-planning-and-avoidance-in-nigeria",
  "/verify-land-ownership-with-the-lagos-state",
  "/probate-for-a-deceased-estate-in-nigeria",
  "/legally-challenge-forged-land-documents-in-ogun",
  "/how-can-nigerians-in-the-diaspora-buy-property",
  "/lagos-property-succession-how-to-transfer-ownership-after-a-death",
  "/procedures-for-making-a-will-in-nigeria"
]);

const sprint10nExactArticleRedirects = [...sprint10nExactArticleRedirectSources].flatMap((source) => [
  { source: `${source}/`, destination: `/resources/blog${source}`, permanent: true },
  { source, destination: `/resources/blog${source}`, permanent: true }
]);

const sprint10oExactArticleRedirectSources = new Set([
  "/legal-steps-to-perfecting-title-documents",
  "/how-does-the-land-use-act-affect-land-title",
  "/legal-remedies-for-breach-of-contract",
  "/when-a-loved-one-dies-without-a-will",
  "/contract-of-sale-of-land-and-what-it-takes",
  "/acquire-and-secure-industrial-land-in-ogun",
  "/8-steps-to-enforce-court-judgments-innigeria",
  "/roles-of-a-cybercrime-lawyer-in-nigeria",
  "/effects-of-exchange-of-contract",
  "/floodplain-management-under-the-land-use-act",
  "/what-is-the-cost-of-perfecting-land-titles-2",
  "/what-is-the-process-of-obtaining-a-c-of-o",
  "/difference-between-c-of-o-and-governors-consent",
  "/cyber-crime-investigation-techniques",
  "/family-law-issues-for-expatriate-families",
  "/the-role-of-town-planners-in-land-allocation-under-the-land-use-act",
  "/ways-to-resolve-property-disputes-in-ogun",
  "/8-step-business-registration-process-in-lag",
  "/legal-pitfalls-in-debt-recovery",
  "/proven-steps-how-to-file-patent-in-nigeria",
  "/debt-recovery-in-banking-sector",
  "/legal-aspects-of-commercial-litigation",
  "/proven-steps-on-capacity-to-make-a-will",
  "/landlord-and-tenant-relationship-on-property",
  "/the-process-of-transferring-land-in-nigeria",
  "/4-proven-cross-border-cybercrime-issues",
  "/contractual-dispute-resolution",
  "/the-land-use-act-relate-to-land-conflicts",
  "/mastering-nigerian-company-law-essentialstep",
  "/how-does-the-land-use-act-influence-real-estate-development",
  "/company-registration-in-nigeria",
  "/land-tenure-systems-coexist-with-statutory-land",
  "/the-cyber-crime-investigation-procedure",
  "/aim-to-improve-land-titles-and-ownership",
  "/investigating-title-in-property-transaction",
  "/challenging-forged-property-documents-in-lagos",
  "/how-can-issues-of-land-fraud-and-illegal-land-transactions-be-addressed-in-nigeria",
  "/how-to-register-a-company-in-nigeria-2024",
  "/duties-of-company-board-of-directors",
  "/compliance-with-debt-recovery-regulations",
  "/due-diligence-in-real-estate-transaction",
  "/the-role-of-lawyers-in-debt-recovery-5-keys",
  "/intellectual-property-in-franchise-operations",
  "/disputes-arising-from-property-ownership",
  "/corporate-fraud-and-mismanagement",
  "/legal-assistance-for-visa-appeals-5-step",
  "/thing-you-need-to-know-about-a-legal-will",
  "/challenges-women-face-in-obtaining-land-titles",
  "/digitization-impact-land-title-registration",
  "/legally-binding-contracts"
]);

const sprint10oExactArticleRedirects = [...sprint10oExactArticleRedirectSources].flatMap((source) => [
  { source: `${source}/`, destination: `/resources/blog${source}`, permanent: true },
  { source, destination: `/resources/blog${source}`, permanent: true }
]);

const sprint10qExactArticleRedirectSources = new Set([
  "/how-to-draft-a-commercial-contract-a-proven",
  "/4-main-guide-to-land-ownership-in-nigeria",
  "/piracy-and-its-burden-on-copyright",
  "/how-to-check-if-a-property-title-is-genuine",
  "/remedies-for-breach-of-property-contracts-in-lagos-a-legal-guide",
  "/insurance-in-construction-contracts",
  "/how-does-land-title-insurance-protect-property-owners-in-nigeria",
  "/corporate-tax-obligations-in-nigeria",
  "/what-is-the-legal-process-for-land-dispute",
  "/lawyers-help-you-access-inherited-property",
  "/how-does-land-title-regularization-affect-p",
  "/the-land-use-act-protect-the-environment",
  "/immigration-law-at-chaman-law-firm",
  "/land-record-keeping-ensure-accurate-land-titles",
  "/5-proven-roles-of-a-child-adoption-lawyer",
  "/legal-advice-for-expatriates-in-nigeria-ess",
  "/different-types-of-marriage-in-nigeria",
  "/land-titles-in-nigeria",
  "/reasons-yourland-title-verification-may-fail",
  "/why-you-need-a-certificate-of-occupancy-in-nigeria",
  "/what-challenges-are-associated-with-preserving-and-digitizing-historical-land-records",
  "/real-estate-contracts",
  "/what-is-the-role-of-the-surveyor-general-in-land-allocation-under-the-land-use-act",
  "/what-is-the-legal-way-to-safeguard-your-will",
  "/top-5-intellectual-property-enforcement-stra",
  "/why-is-public-awareness-important-for-land-ownership-and-titles-in-nigeria",
  "/steps-to-understanding-financial-crimes",
  "/review-of-corporate-affairs-commission-share-capital-for-company-registration-in-nigeria",
  "/register-your-company-with-cac-in-nigeria",
  "/obtain-a-certificate-of-occupancy-chaman-law",
  "/ultimate-legal-guide-to-buying-land-in-niger",
  "/managing-corporate-reputation",
  "/land-registration-in-lagos",
  "/what-property-taxes-must-i-pay-when-buying",
  "/enhancing-nigerian-immigration-security-2",
  "/challenge-a-fraudulent-probate-application",
  "/corporate-debt-management-practices",
  "/of-immigration-compliance-lawyers",
  "/top-10-legal-mistakes-property-buyers-make-i",
  "/debt-recovery-and-consumer-protection-laws",
  "/lekki-property-when-owner-dies-without-will",
  "/risk-management-strategies-for-real-estate-investment-in-nigeria",
  "/what-is-the-process-for-land-allocation-for-agricultural-purposes-under-the-land-use-act",
  "/can-a-foreigner-buy-property-chaman-law-firm",
  "/what-is-the-significan-and-titles-in-nigeria",
  "/what-you-need-to-know-when-buying-a-family-g",
  "/evaluating-real-estate-investment-returns",
  "/force-majeure-clauses-in-business-contracts",
  "/3-proven-steps-on-how-to-rolve-land-disputes"
]);

const sprint10qExactArticleRedirects = [...sprint10qExactArticleRedirectSources].flatMap((source) => [
  { source: `${source}/`, destination: `/resources/blog${source}`, permanent: true },
  { source, destination: `/resources/blog${source}`, permanent: true }
]);

const deepLegacy404Redirects = [
  { source: "/what-are-elements-of-tax-law", destination: "/resources/blog/what-are-elements-of-tax-law" },
  { source: "/tax-administration-in-nigeria", destination: "/resources/blog/tax-administration-in-nigeria" },
  { source: "/difference-between-ownership-and-possession", destination: "/resources/blog/difference-between-ownership-and-possession" },
  { source: "/community-development-associations-law", destination: "/resources/blog/community-development-associations-law" },
  { source: "/5-vital-role-of-consumer-protection-agencies", destination: "/resources/blog/5-vital-role-of-consumer-protection-agencies" },
  { source: "/taxation-of-the-construction-sector-in-nigeria", destination: "/resources/blog/taxation-of-the-construction-sector-in-nigeria" },
  { source: "/registration-of-trade-union-in-nigeria", destination: "/practice-areas/employment-law" },
  { source: "/how-to-file-complaint-against-police-officers-in-nigeria", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/abandonment-and-withdrew-of-court-action", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/taxation-of-sole-proprietorship", destination: "/resources/blog/taxation-of-sole-proprietorship" },
  { source: "/powerful-steps-what-is-trespass-to-land-2", destination: "/resources/blog/powerful-steps-what-is-trespass-to-land-2" },
  { source: "/certificate-of-occupancy-in-rivers-state", destination: "/practice-areas/property-real-estate-law" },
  { source: "/to-apply-for-and-get-certificate-of-occupancy", destination: "/resources/blog/to-apply-for-and-get-certificate-of-occupancy" },
  { source: "/how-to-legally-change-a-child-surname", destination: "/practice-areas/family-law" },
  { source: "/the-role-of-the-judiciary-in-nigerian-democracy", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/can-a-minor-enter-into-a-valid-contract-in-nigeria", destination: "/practice-areas/corporate-commercial-law" },
  { source: "/family-property-and-right-of-individual-member-in-family-property", destination: "/resources/blog/family-property-and-right-of-individual-member-in-family-property" },
  { source: "/conditions-for-granting-injunctions-and-types-of-injunctions", destination: "/practice-areas/litigation-dispute-resolution" },
  {
    source: "/how-to-verify-land-title-before-buying-land",
    destination: "/practice-areas/property-real-estate-law/property-verification"
  },
  {
    source: "/documents-to-verify-before-buying-property",
    destination: "/practice-areas/property-real-estate-law/property-due-diligence"
  },
  { source: "/what-are-rights-of-women-to-inheritance-in-nigeria", destination: "/resources/blog/what-are-rights-of-women-to-inheritance-in-nigeria" },
  { source: "/communal-land-and-family-land", destination: "/resources/blog/communal-land-and-family-land" },
  { source: "/land-ownership-disputes-in-nigeria", destination: "/resources/blog/land-ownership-disputes-in-nigeria" },
  { source: "/overview-of-the-concept-recovery-of-premises", destination: "/practice-areas/property-real-estate-law" },
  { source: "/how-do-i-legally-evict-a-tenant-in-ogun-state", destination: "/practice-areas/property-real-estate-law" },
  { source: "/types-of-land-registration-in-nigeria", destination: "/resources/blog/types-of-land-registration-in-nigeria" },
  { source: "/overview-of-latches-and-acquiescence", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/land-grabbing-the-legal-consequences-of", destination: "/practice-areas/property-real-estate-law" },
  { source: "/is-police-bail-free-in-nigeria", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/what-to-know-about-company-resolution", destination: "/resources/blog/what-to-know-about-company-resolution" },
  { source: "/powerful-steps-sources-of-tax-law-in-nigeria", destination: "/practice-areas/corporate-commercial-law" },
  { source: "/what-is-the-process-of-land-acquisition", destination: "/resources/blog/what-is-the-process-of-land-acquisition" },
  { source: "/the-role-of-family-court-in-relation-to-child-protect-in-nigeria", destination: "/resources/blog/the-role-of-family-court-in-relation-to-child-protect-in-nigeria" },
  { source: "/cost-of-building-approval-chaman-law-firm", destination: "/practice-areas/property-real-estate-law" },
  { source: "/property-how-to-place-a-caveat", destination: "/practice-areas/property-real-estate-law" },
  { source: "/tthe-legal-rights-of-a-wife-after-divorce", destination: "/practice-areas/family-law" },
  { source: "/how-to-calculate-stamp-duty-chaman-law-firm", destination: "/resources/blog/how-to-calculate-stamp-duty-chaman-law-firm" },
  { source: "/can-a-landlord-increase-rent-arbitrarily-in-ogun", destination: "/practice-areas/property-real-estate-law" },
  { source: "/deal-with-and-bad-tenant-as-a-landlord", destination: "/practice-areas/property-real-estate-law" },
  { source: "/types-of-parties-to-a-civil-action", destination: "/practice-areas/litigation-dispute-resolution" },
  { source: "/how-to-legally-sublet-a-property-in-nigeria", destination: "/resources/blog/how-to-legally-sublet-a-property-in-nigeria" },
  { source: "/how-do-i-obtain-a-certificate-of-occupancy", destination: "/practice-areas/property-real-estate-law" },
  { source: "/powerful-steps-valid-survey", destination: "/practice-areas/property-real-estate-law" },
  { source: "/what-governs-contract-in-nigeria", destination: "/resources/blog/what-governs-contract-in-nigeria" },
  { source: "/understanding-rent-increase-laws-in-lagos", destination: "/practice-areas/property-real-estate-law" },
  { source: "/obtaining-governor-consent-for-land-transactions", destination: "/resources/blog/obtaining-governor-consent-for-land-transactions" },
  { source: "/the-land-use-and-allocation-committee-luac", destination: "/resources/blog/the-land-use-and-allocation-committee-luac" },
  { source: "/property-insurance-in-nigeria", destination: "/resources/blog/property-insurance-in-nigeria" },
  { source: "/insightful-overview-of-family-law-in-nigeria", destination: "/resources/blog/insightful-overview-of-family-law-in-nigeria" },
  { source: "/who-holds-authority-over-land-under-the-land", destination: "/resources/blog/who-holds-authority-over-land-under-the-land" },
  { source: "/developer-fails-to-deliver-property", destination: "/resources/blog/developer-fails-to-deliver-property" },
  { source: "/how-to-conduct-search-at-land-registry", destination: "/resources/blog/how-to-conduct-search-at-land-registry" },
  { source: "/importance-of-covenants-in-a-tenancy-agreement", destination: "/resources/blog/importance-of-covenants-in-a-tenancy-agreement" },
  { source: "/how-to-prove-ownership-of-land-in-nigeria", destination: "/resources/blog/how-to-prove-ownership-of-land-in-nigeria" },
  { source: "/step-by-step-guide-on-how-to-conduct-a-statutory-marriage-in-nigeria", destination: "/resources/blog/step-by-step-guide-on-how-to-conduct-a-statutory-marriage-in-nigeria" },
  { source: "/legal-obligations-for-debt-collectors", destination: "/resources/blog/legal-obligations-for-debt-collectors" },
  { source: "/legal-processofobtaininga-deed-of-assignment", destination: "/resources/blog/legal-processofobtaininga-deed-of-assignment" },
  { source: "/land-tenures-and-customary-land-tenure-systems", destination: "/resources/blog/land-tenures-and-customary-land-tenure-systems" },
  { source: "/property-with-existing-tenants-in-nigeria", destination: "/resources/blog/property-with-existing-tenants-in-nigeria" },
  { source: "/where-marriage-under-the-act-can-be-conducted", destination: "/resources/blog/where-marriage-under-the-act-can-be-conducted" },
  { source: "/how-nigerian-courts-handle-electronic-evidence", destination: "/resources/blog/how-nigerian-courts-handle-electronic-evidence" },
  { source: "/types-of-company-in-nigeria", destination: "/resources/blog/types-of-company-in-nigeria" },
  { source: "/contract-breach-and-remedies", destination: "/resources/blog/contract-breach-and-remedies" },
  { source: "/tax-clearance-certificate-in-nigeria", destination: "/resources/blog/tax-clearance-certificate-in-nigeria" },
  { source: "/legalisation-authentication-of-marriage-certificate-in-nigeria", destination: "/resources/blog/legalisation-authentication-of-marriage-certificate-in-nigeria" },
  { source: "/what-is-a-deed-of-assent-in-nigeria", destination: "/resources/blog/what-is-a-deed-of-assent-in-nigeria" },
  { source: "/domestic-violence-ground-for-dissolution-of-marriage-and-its-criminal-implications", destination: "/resources/blog/domestic-violence-ground-for-dissolution-of-marriage-and-its-criminal-implications" },
  { source: "/how-do-i-process-survey-plan-approval-in-ogun", destination: "/resources/blog/how-do-i-process-survey-plan-approval-in-ogun" },
  { source: "/family-courts-and-specialized-tribunals-2", destination: "/resources/blog/family-courts-and-specialized-tribunals-2" },
  { source: "/immigration-service-in-border-management", destination: "/resources/blog/immigration-service-in-border-management" },
  { source: "/landlord-and-tenant-relationship", destination: "/resources/blog/landlord-and-tenant-relationship" },
  { source: "/how-do-i-regularize-land-documents-in-ogun-state", destination: "/resources/blog/how-do-i-regularize-land-documents-in-ogun-state" },
  { source: "/how-to-file-for-child-custody-in-nigeria-a", destination: "/resources/blog/how-to-file-for-child-custody-in-nigeria-a" },
  { source: "/rights-of-children-born-outside-wedlock", destination: "/resources/blog/rights-of-children-born-outside-wedlock" },
  { source: "/overview-of-statutory-marriage-in-nigeria", destination: "/resources/blog/overview-of-statutory-marriage-in-nigeria" },
  { source: "/how-to-legally-subdivide-and-develop-land", destination: "/resources/blog/how-to-legally-subdivide-and-develop-land" },
  { source: "/role-of-stamp-duty-in-property-transactions", destination: "/resources/blog/role-of-stamp-duty-in-property-transactions" },
  { source: "/guide-for-transfer-of-land-ownership-and", destination: "/resources/blog/guide-for-transfer-of-land-ownership-and" },
  { source: "/registration-of-deed-of-assignment-in-nigeria", destination: "/resources/blog/registration-of-deed-of-assignment-in-nigeria" },
  { source: "/can-a-landlord-increase-rent-arbitrarily", destination: "/resources/blog/can-a-landlord-increase-rent-arbitrarily" },
  { source: "/the-basics-of-statutory-right-of-occupancy", destination: "/resources/blog/the-basics-of-statutory-right-of-occupancy" },
  { source: "/family-law-disputes-and-child-abduction", destination: "/resources/blog/family-law-disputes-and-child-abduction" },
  { source: "/government-acquired-lands-in-nigeria", destination: "/resources/blog/government-acquired-lands-in-nigeria" },
  { source: "/overview-of-citizenship-in-nigeria", destination: "/resources/blog/overview-of-citizenship-in-nigeria" },
  { source: "/how-to-use-cac-public-search-for-your-business", destination: "/resources/blog/how-to-use-cac-public-search-for-your-business" },
  { source: "/basic-procedure-for-dissolution-of-marriage", destination: "/resources/blog/basic-procedure-for-dissolution-of-marriage" },
  { source: "/effect-of-witness-as-beneficiary-in-will", destination: "/resources/blog/effect-of-witness-as-beneficiary-in-will" },
  { source: "/what-are-the-implications-of-unregistered-land-titles-in-nigeria", destination: "/resources/blog/what-are-the-implications-of-unregistered-land-titles-in-nigeria" },
  { source: "/obtaining-a-c-of-o-in-ogun-state", destination: "/resources/blog/obtaining-a-c-of-o-in-ogun-state" },
  { source: "/legal-aspects-of-employment-contracts", destination: "/resources/blog/legal-aspects-of-employment-contracts" },
  { source: "/probate-vs-letter-of-administration-in-nigeria-key-differences-you-must-know", destination: "/resources/blog/probate-vs-letter-of-administration-in-nigeria-key-differences-you-must-know" },
  { source: "/how-to-appoint-a-company-secretary-in-nigeria", destination: "/resources/blog/how-to-appoint-a-company-secretary-in-nigeria" },
  { source: "/accountability-in-corporate-governance", destination: "/resources/blog/accountability-in-corporate-governance" },
  { source: "/business-name-and-a-company-limited-by-shares", destination: "/resources/blog/business-name-and-a-company-limited-by-shares" },
  { source: "/verify-a-property-title-in-lagos", destination: "/resources/blog/verify-a-property-title-in-lagos" },
  { source: "/what-makes-up-a-valid-employment-contract", destination: "/resources/blog/what-makes-up-a-valid-employment-contract" },
  { source: "/deed-of-assignment-in-nigeria", destination: "/practice-areas/property-real-estate-law" }
]
  .filter(
    ({ source }) =>
      !sprint10lExactArticleRedirectSources.has(source) &&
      !sprint10nExactArticleRedirectSources.has(source) &&
      !sprint10oExactArticleRedirectSources.has(source) &&
      !sprint10qExactArticleRedirectSources.has(source)
  )
  .flatMap(({ source, destination }) => [
  { source: `${source}/`, destination, permanent: true },
  { source, destination, permanent: true }
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true
      },
      {
        source: "/about-chaman-law-firm/",
        destination: "/about",
        permanent: true
      },
      {
        source: "/about-chaman-law-firm",
        destination: "/about",
        permanent: true
      },
      {
        source: "/contact-for-legal-consultation/",
        destination: "/consultation",
        permanent: true
      },
      {
        source: "/contact-for-legal-consultation",
        destination: "/consultation",
        permanent: true
      },
      {
        source: "/charles-chukwuma-nkwoka-esq",
        destination: "/lawyers/charles-chukwuma-nkwoka",
        permanent: true
      },
      {
        source: "/justina-obriko-esq",
        destination: "/lawyers/justina-edewede-obriko",
        permanent: true
      },
      {
        source: "/ibraheem-akewusola-esq",
        destination: "/lawyers/ibraheem-akewusola",
        permanent: true
      },
      {
        source: "/martha-elendu-esq",
        destination: "/lawyers/martha-elendu",
        permanent: true
      },
      {
        source: "/property-lawyer-lagos",
        destination: "/practice-areas/property-real-estate-law",
        permanent: true
      },
      {
        source: "/corporate-lawyer-nigeria",
        destination: "/practice-areas/corporate-commercial-law",
        permanent: true
      },
      {
        source: "/litigation-lawyer-lagos",
        destination: "/practice-areas/litigation-dispute-resolution",
        permanent: true
      },
      {
        source: "/debt-recovery-lawyer-nigeria",
        destination: "/practice-areas/debt-recovery",
        permanent: true
      },
      {
        source: "/family-lawyer-lagos",
        destination: "/practice-areas/family-law",
        permanent: true
      },
      {
        source: "/immigration-lawyer-nigeria",
        destination: "/practice-areas/immigration-services",
        permanent: true
      },
      {
        source: "/downloads",
        destination: "/resources/downloads",
        permanent: true
      },
      ...emergencyLegacyRedirects,
      ...sprint10lExactArticleRedirects,
      ...sprint10nExactArticleRedirects,
      ...sprint10oExactArticleRedirects,
      ...sprint10qExactArticleRedirects,
      ...deepLegacy404Redirects,
      {
        source: "/landlord-and-tenant-rights-in-nigeria/",
        destination: "/resources/blog/landlord-and-tenant-rights-in-nigeria",
        permanent: true
      },
      {
        source: "/landlord-and-tenant-rights-in-nigeria",
        destination: "/resources/blog/landlord-and-tenant-rights-in-nigeria",
        permanent: true
      },
      {
        source: "/the-jurisdiction-of-courts-in-nigeria/",
        destination: "/resources/blog/the-jurisdiction-of-courts-in-nigeria",
        permanent: true
      },
      {
        source: "/the-jurisdiction-of-courts-in-nigeria",
        destination: "/resources/blog/the-jurisdiction-of-courts-in-nigeria",
        permanent: true
      },
      {
        source: "/proper-steps-to-eviction-of-tenants/",
        destination: "/resources/blog/proper-steps-to-eviction-of-tenants",
        permanent: true
      },
      {
        source: "/proper-steps-to-eviction-of-tenants",
        destination: "/resources/blog/proper-steps-to-eviction-of-tenants",
        permanent: true
      },
      {
        source: "/the-ogun-state-tenancy-law-chaman-law-firm/",
        destination: "/resources/blog/the-ogun-state-tenancy-law-chaman-law-firm",
        permanent: true
      },
      {
        source: "/the-ogun-state-tenancy-law-chaman-law-firm",
        destination: "/resources/blog/the-ogun-state-tenancy-law-chaman-law-firm",
        permanent: true
      },
      {
        source: "/building-permit-approval-in-ogun-state/",
        destination: "/resources/blog/building-permit-approval-in-ogun-state",
        permanent: true
      },
      {
        source: "/building-permit-approval-in-ogun-state",
        destination: "/resources/blog/building-permit-approval-in-ogun-state",
        permanent: true
      },
      {
        source: "/cac-public-search-guide-nigeria/",
        destination: "/resources/blog/cac-public-search-guide-nigeria",
        permanent: true
      },
      {
        source: "/cac-public-search-guide-nigeria",
        destination: "/resources/blog/cac-public-search-guide-nigeria",
        permanent: true
      },
      {
        source: "/types-of-tenant-in-nigeria/",
        destination: "/resources/blog/types-of-tenant-in-nigeria",
        permanent: true
      },
      {
        source: "/types-of-tenant-in-nigeria",
        destination: "/resources/blog/types-of-tenant-in-nigeria",
        permanent: true
      },
      {
        source: "/how-to-change-name-with-deed-poll/",
        destination: "/resources/blog/how-to-change-name-with-deed-poll",
        permanent: true
      },
      {
        source: "/how-to-change-name-with-deed-poll",
        destination: "/resources/blog/how-to-change-name-with-deed-poll",
        permanent: true
      },
      {
        source: "/ways-to-prove-ownership-of-land/",
        destination: "/resources/blog/ways-to-prove-ownership-of-land",
        permanent: true
      },
      {
        source: "/ways-to-prove-ownership-of-land",
        destination: "/resources/blog/ways-to-prove-ownership-of-land",
        permanent: true
      },
      {
        source: "/how-to-notarize-a-document-in-nigeria/",
        destination: "/resources/blog/how-to-notarize-a-document-in-nigeria",
        permanent: true
      },
      {
        source: "/how-to-notarize-a-document-in-nigeria",
        destination: "/resources/blog/how-to-notarize-a-document-in-nigeria",
        permanent: true
      },
      {
        source: "/the-statutory-right-of-occupancy-in-nigeria/",
        destination: "/resources/blog/the-statutory-right-of-occupancy-in-nigeria",
        permanent: true
      },
      {
        source: "/the-statutory-right-of-occupancy-in-nigeria",
        destination: "/resources/blog/the-statutory-right-of-occupancy-in-nigeria",
        permanent: true
      },
      {
        source: "/transfer-of-company-shares-in-nigeria/",
        destination: "/resources/blog/transfer-of-company-shares-in-nigeria",
        permanent: true
      },
      {
        source: "/transfer-of-company-shares-in-nigeria",
        destination: "/resources/blog/transfer-of-company-shares-in-nigeria",
        permanent: true
      },
      {
        source: "/statute-of-limitations-on-debt-in-nigeria/",
        destination: "/resources/blog/statute-of-limitations-on-debt-in-nigeria",
        permanent: true
      },
      {
        source: "/statute-of-limitations-on-debt-in-nigeria",
        destination: "/resources/blog/statute-of-limitations-on-debt-in-nigeria",
        permanent: true
      },
      {
        source: "/properties/:path*",
        destination: "/practice-areas/property-real-estate-law",
        permanent: false
      },
      {
        source: "/services/:path*",
        destination: "/practice-areas",
        permanent: false
      },
      {
        source: "/blog/:slug",
        destination: "/resources/blog/:slug",
        permanent: false
      },
      {
        source: "/blog",
        destination: "/resources/blog",
        permanent: false
      },
      {
        source: "/category/:path*",
        destination: "/resources/blog",
        permanent: false
      },
      {
        source: "/tags/:path*",
        destination: "/resources/blog",
        permanent: false
      },
      {
        source: "/authors/:path*",
        destination: "/lawyers",
        permanent: false
      },
      {
        source: "/internship",
        destination: "/careers",
        permanent: false
      }
    ];
  }
};

export default nextConfig;
