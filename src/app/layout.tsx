import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AIChatbotButton } from "@/components/AIChatbotButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { createMetadata } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "Premium Real Estate Investment & Property Management in Nigeria",
  description:
    "Chaman Properties helps Nigerians at home and in the diaspora buy, sell, lease, manage, and invest in verified real estate assets with confidence.",
  path: "/"
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <JsonLd data={organizationSchema()} />
        <Header />
        {children}
        <Footer />
        <WhatsAppCTA variant="floating" label="WhatsApp" />
        <AIChatbotButton />
      </body>
    </html>
  );
}
