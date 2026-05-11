import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getServiceBySlug, getServices } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

const images: Record<string, string> = {
  "property-sales": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80",
  "property-letting": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=80",
  diaspora: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
  "property-management": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80",
  "investment-opportunities": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80",
  "verification-due-diligence": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return createMetadata({
      title: "Service Not Found",
      description: "The requested Chaman Properties service could not be found.",
      path: `/services/${slug}`
    });
  }

  return createMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: images[service.slug]
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` }
          ]),
          faqSchema(service.faqs)
        ]}
      />
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.description}
        image={images[service.slug]}
        cta={{ label: "Request Consultation", href: "/contact" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="space-y-10">
            <SectionHeader
              eyebrow="Service Details"
              title="What this service includes"
              description={service.summary}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {service.highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3 rounded-lg border border-royalGold/18 bg-charcoal p-5 text-sm text-ivory/76">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-royalGold" size={18} />
                  {highlight}
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
              <h2 className="font-heading text-2xl text-ivory">Frequently Asked Questions</h2>
              <div className="mt-6">
                <FaqList faqs={service.faqs} />
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <ZohoLeadForm source={`Service - ${service.title}`} title="Request This Service" />
            <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
              <h2 className="font-heading text-2xl text-ivory">Need urgent support?</h2>
              <p className="mt-3 text-sm leading-7 text-ivory/68">
                Connect directly with the Chaman Properties advisory team for inspection, listing, verification, and management inquiries.
              </p>
              <div className="mt-5">
                <WhatsAppCTA message={`Hello Chaman Properties, I need support with ${service.title}.`} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
