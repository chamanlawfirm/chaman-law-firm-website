import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SiteBreadcrumbs } from "@/components/SiteBreadcrumbs";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...createMetadata({
    title: "Premium Law Firm in Nigeria | Chaman Law Firm",
    description:
      "Chaman Law Firm is a full-service Nigerian law firm advising clients on property law, real estate transactions, corporate and commercial law, litigation, debt recovery, probate, notary public services, and diaspora legal matters.",

    keywords: [
      "Law Firm in Nigeria",
      "Law Firm in Lagos",
      "Property Lawyer Nigeria",
      "Real Estate Lawyer Lagos",
      "Corporate Lawyer Nigeria",
      "Commercial Law Firm Nigeria",
      "Litigation Lawyer Lagos",
      "Debt Recovery Lawyer Nigeria",
      "Probate Lawyer Nigeria",
      "Notary Public Lagos",
      "Diaspora Legal Services Nigeria",
      "Chaman Law Firm"
    ],

    path: "/",
  })
};


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-NG">
      <head>
        {googleSiteVerification ? <meta name="google-site-verification" content={googleSiteVerification} /> : null}
        {bingSiteVerification ? <meta name="msvalidate.01" content={bingSiteVerification} /> : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <JsonLd data={organizationSchema()} />
        <CookieConsent gaMeasurementId={gaMeasurementId} />
        <Header />
        <SiteBreadcrumbs />
        {children}
        <Footer />
        <WhatsAppCTA variant="floating" label="WhatsApp" />
      </body>
    </html>
  );
}
