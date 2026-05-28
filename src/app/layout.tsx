import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { AIChatbotButton } from "@/components/AIChatbotButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { createMetadata } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "Luxury Real Estate in Nigeria | Chaman Properties",
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
        {children}
        <Footer />
        <WhatsAppCTA variant="floating" label="WhatsApp" />
        <AIChatbotButton />
      </body>
    </html>
  );
}
