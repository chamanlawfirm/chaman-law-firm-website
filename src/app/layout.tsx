import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AIChatbotButton } from "@/components/AIChatbotButton";
import { ExitIntentLeadPopup } from "@/components/ExitIntentLeadPopup";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SiteBreadcrumbs } from "@/components/SiteBreadcrumbs";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { createMetadata } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "Luxury Real Estate Nigeria | Chaman Properties",
  description:
    "Chaman Properties is a luxury real estate company in Nigeria offering property investment, property management, luxury homes, and diaspora real estate services.",

  keywords: [
    "Real Estate Company in Nigeria",
    "Luxury Real Estate Nigeria",
    "Property Investment Nigeria",
    "Diaspora Property Investment",
    "Lagos Real Estate",
    "Buy Property in Lagos",
    "Property Management Nigeria",
    "Luxury Homes Nigeria",
    "Real Estate Investment Lagos",
    "Nigeria Property Consultant",
    "Chaman Properties"
  ],

  path: "/",
});


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <JsonLd data={organizationSchema()} />
        <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-6HVQYT0SP6"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-6HVQYT0SP6');
  `}
</Script>
        <Header />
        <SiteBreadcrumbs />
        {children}
        <Footer />
        <WhatsAppCTA variant="floating" label="WhatsApp" />
        <ExitIntentLeadPopup />
        <AIChatbotButton />
      </body>
    </html>
  );
}
