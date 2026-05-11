import type { Metadata } from "next";
import { Award, Building2, Globe2, Scale, ShieldCheck, Users } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "About Chaman Properties",
  description:
    "Learn about Chaman Properties, a premium real estate investment, sales, letting, and property management company serving Nigeria and diaspora investors.",
  path: "/about"
});

const faqs = [
  {
    question: "What makes Chaman Properties different?",
    answer:
      "Chaman Properties combines real estate marketing, investment advisory, property management, and strong legal documentation awareness for safer client decisions."
  },
  {
    question: "Who does Chaman Properties serve?",
    answer:
      "The company serves local buyers, diaspora Nigerians, landlords, tenants, corporate clients, luxury property buyers, and investors."
  }
];

const values = [
  { icon: ShieldCheck, title: "Trust", text: "Verified listings, transparent communication, and disciplined transaction support." },
  { icon: Scale, title: "Legal Awareness", text: "Property acquisition support strengthened by title, approval, and documentation focus." },
  { icon: Globe2, title: "Diaspora Focus", text: "Remote buyer support, video inspections, management reporting, and rent collection." },
  { icon: Award, title: "Premium Service", text: "A luxury brand experience for buyers, sellers, landlords, tenants, and investors." }
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]), faqSchema(faqs)]} />
      <PageHero
        eyebrow="About Chaman Properties"
        title="A premium real estate company built around confidence"
        description="Chaman Properties helps clients acquire, lease, manage, verify, and invest in Nigerian real estate assets with a premium, legally informed, and diaspora-friendly approach."
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Brand Positioning"
              title="Luxury real estate. Verified investments. Trusted management."
              description="Chaman Properties is positioned for high-net-worth buyers, diaspora investors, landlords, corporate clients, and anyone who wants more confidence before committing to a property transaction."
            />
            <div className="mt-8">
              <WhatsAppCTA message="Hello Chaman Properties, I would like to learn more about your services." />
            </div>
          </div>
          <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8">
            <p className="font-display text-2xl leading-10 text-champagne">
              “At Chaman Properties, we do not merely market properties; we help clients secure verified real estate investments, manage assets, and build long-term property wealth in Nigeria.”
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-royalGold/12 bg-luxuryBlack p-5">
                <Building2 className="text-royalGold" />
                <p className="mt-4 text-sm text-ivory/70">Sales, letting, shortlets, investment, and management under one premium property brand.</p>
              </div>
              <div className="rounded-md border border-royalGold/12 bg-luxuryBlack p-5">
                <Users className="text-royalGold" />
                <p className="mt-4 text-sm text-ivory/70">Built for Nigerians at home and across the USA, UK, Canada, Europe, and beyond.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Values"
            title="The standards behind every client relationship"
            description="The website, brand voice, and service architecture all reinforce professionalism, confidence, and property law awareness."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-lg border border-royalGold/18 bg-luxuryBlack p-6">
                  <Icon className="text-royalGold" />
                  <h2 className="mt-5 font-heading text-xl text-ivory">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
