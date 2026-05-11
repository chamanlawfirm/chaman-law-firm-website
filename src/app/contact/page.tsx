import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { GoogleMapSection } from "@/components/GoogleMapSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Contact Chaman Properties",
  description:
    "Contact Chaman Properties for property sales, letting, shortlets, property management, diaspora services, investment opportunities, and verification support.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHero
        eyebrow="Contact"
        title="Speak with the Chaman Properties team"
        description="Reach us for property consultation, listing inquiries, inspection booking, diaspora support, management proposals, investment advisory, and verification guidance."
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Direct Contact"
              title="Call, WhatsApp, email, or visit"
              description="For fastest response, use WhatsApp or call the property desk during business hours."
            />
            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <Phone className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl text-ivory">Phone / WhatsApp</h2>
                <p className="mt-3 text-sm text-ivory/70">{siteConfig.phones.join(" | ")}</p>
                <div className="mt-5">
                  <WhatsAppCTA />
                </div>
              </div>
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <Mail className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl text-ivory">Email</h2>
                <p className="mt-3 text-sm text-ivory/70">{siteConfig.email}</p>
                <p className="mt-1 text-sm text-ivory/70">{siteConfig.secondaryEmail}</p>
              </div>
            </div>
          </div>
          <ZohoLeadForm source="Contact page" title="Send a Message" />
        </div>
      </section>
      <GoogleMapSection />
    </main>
  );
}
