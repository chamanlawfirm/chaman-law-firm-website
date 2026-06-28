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

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        source: "/landlord-and-tenant-rights-in-nigeria",
        destination: "/resources/blog/landlord-and-tenant-rights-in-nigeria",
        permanent: true
      },
      {
        source: "/the-jurisdiction-of-courts-in-nigeria",
        destination: "/resources/blog/the-jurisdiction-of-courts-in-nigeria",
        permanent: true
      },
      {
        source: "/proper-steps-to-eviction-of-tenants",
        destination: "/resources/blog/proper-steps-to-eviction-of-tenants",
        permanent: true
      },
      {
        source: "/the-ogun-state-tenancy-law-chaman-law-firm",
        destination: "/resources/blog/the-ogun-state-tenancy-law-chaman-law-firm",
        permanent: true
      },
      {
        source: "/building-permit-approval-in-ogun-state",
        destination: "/resources/blog/building-permit-approval-in-ogun-state",
        permanent: true
      },
      {
        source: "/cac-public-search-guide-nigeria",
        destination: "/resources/blog/cac-public-search-guide-nigeria",
        permanent: true
      },
      {
        source: "/types-of-tenant-in-nigeria",
        destination: "/resources/blog/types-of-tenant-in-nigeria",
        permanent: true
      },
      {
        source: "/how-to-change-name-with-deed-poll",
        destination: "/resources/blog/how-to-change-name-with-deed-poll",
        permanent: true
      },
      {
        source: "/ways-to-prove-ownership-of-land",
        destination: "/resources/blog/ways-to-prove-ownership-of-land",
        permanent: true
      },
      {
        source: "/how-to-notarize-a-document-in-nigeria",
        destination: "/resources/blog/how-to-notarize-a-document-in-nigeria",
        permanent: true
      },
      {
        source: "/the-statutory-right-of-occupancy-in-nigeria",
        destination: "/resources/blog/the-statutory-right-of-occupancy-in-nigeria",
        permanent: true
      },
      {
        source: "/transfer-of-company-shares-in-nigeria",
        destination: "/resources/blog/transfer-of-company-shares-in-nigeria",
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
