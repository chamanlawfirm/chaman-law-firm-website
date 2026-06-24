import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { GoogleMapSection } from "@/components/GoogleMapSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { LeadForm } from "@/components/LeadForm";
import { siteConfig } from "@/lib/constants";
import { getOfficeLocations } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Contact Chaman Law Firm",
  description:
    "Contact Chaman Law Firm for legal consultation in property law, corporate law, litigation, debt recovery, probate, notary public services, and diaspora legal matters.",
  path: "/contact"
});

export default async function ContactPage() {
  const offices = await getOfficeLocations();

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHero
        eyebrow="Contact"
        title="Speak with Chaman Law Firm"
        description="Reach the firm by phone, WhatsApp, email, office visit, or enquiry form for legal support and consultation scheduling."
        image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Direct Contact"
              title="Call, WhatsApp, email, or send an enquiry"
              description="For urgent legal support, call or use WhatsApp. For document-heavy matters, send a concise summary through the form."
            />
            <div className="mt-8 grid gap-4">
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <Phone className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Phone</h2>
                <p className="mt-3 text-sm text-ivory/70">{siteConfig.phones.join(" | ")}</p>
                <a href={`tel:${siteConfig.phones[0]}`} className="mt-5 inline-flex rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack">
                  Call Now
                </a>
              </div>
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <MessageCircle className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">WhatsApp</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/70">Send a brief message and the firm can guide the next step.</p>
                <a href={whatsappLink("Hello Chaman Law Firm, I need legal support.")} className="mt-5 inline-flex rounded-full border border-royalGold/35 px-5 py-3 text-sm font-bold text-royalGold">
                  Message on WhatsApp
                </a>
              </div>
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <Mail className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Email</h2>
                <p className="mt-3 text-sm text-ivory/70">{siteConfig.email}</p>
                <p className="mt-1 text-sm text-ivory/70">{siteConfig.secondaryEmail}</p>
              </div>
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <MapPin className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Offices</h2>
                <div className="mt-4 space-y-4">
                  {offices.map((office) => (
                    <div key={office.name}>
                      <p className="text-sm font-semibold text-ivory">{office.name}</p>
                      <p className="mt-1 text-sm leading-7 text-ivory/66">{office.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <WhatsAppCTA />
            </div>
          </div>
          <LeadForm source="Contact page" title="Send a Legal Enquiry" />
        </div>
      </section>
      <GoogleMapSection />
    </main>
  );
}
