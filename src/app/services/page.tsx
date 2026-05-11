import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getServices } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Real Estate Services",
  description:
    "Explore Chaman Properties services for property sales, letting, diaspora management, investment advisory, verification, shortlets, and property management.",
  path: "/services"
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero
        eyebrow="Chaman Properties Services"
        title="Everything needed to buy, lease, manage, verify, and invest with confidence"
        description="A full-service luxury real estate platform designed for buyers, landlords, tenants, diaspora clients, investors, developers, and corporate users."
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Service Architecture"
            title="Built around the full real estate journey"
            description="Each service page is structured for SEO, client education, inquiry conversion, and future CMS expansion."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <SectionHeader
            eyebrow="Speak With The Team"
            title="Tell us the property outcome you want"
            description="Whether you want to buy, rent, list, manage, verify, or invest, the advisory desk can route your inquiry to the right team."
          />
          <ZohoLeadForm source="Services page" title="Request Service Support" />
        </div>
      </section>
    </main>
  );
}
