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
  { source: "/obtaining-a-certificate-of-occupancy-c-of-o", destination: "/practice-areas/property-real-estate-law" },
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
  { source: "/how-to-verify-land-title-before-buying-land", destination: "/practice-areas/property-real-estate-law" },
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
  { source: "/deed-of-assignment-in-nigeria", destination: "/practice-areas/property-real-estate-law" }
].flatMap(({ source, destination }) => [
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
