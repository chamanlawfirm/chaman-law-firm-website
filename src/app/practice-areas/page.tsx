import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Scale, Users } from "lucide-react";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PracticeAreaCard } from "@/components/PracticeAreaCard";
import { SectionHeader } from "@/components/SectionHeader";
import { targetAudiences } from "@/data/site-content";
import { getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, legalServiceSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Practice Areas",
  description:
    "Explore Chaman Law Firm practice areas including property and real estate law, corporate and commercial law, litigation, debt recovery, probate, notary public, immigration and family law.",
  path: "/practice-areas"
});

export default async function PracticeAreasPage() {
  const practiceAreas = await getPracticeAreas();
  const featuredAreas = practiceAreas.filter((area) => area.featured);

  return (
    <main>
      <JsonLd
        data={[
          legalServiceSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Practice Areas", path: "/practice-areas" }
          ])
        ]}
      />
      <PageHero
        eyebrow="Practice Areas"
        title="Legal services for property, business, disputes, estates and documentation"
        description="Chaman Law Firm supports individuals, businesses, investors, developers, families and diaspora clients through focused legal practice areas connected to clear consultation pathways."
        image="https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Core Services"
              title="Full-service legal capability with property law strength"
              description="Each practice page includes service detail, common issues, client fit, process, FAQs, related downloads, lawyer attribution and conversion-focused calls to action."
            />
            <Link href="/consultation" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
              Speak with a lawyer <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredAreas.map((area) => (
              <PracticeAreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeader
            eyebrow="Who We Serve"
            title="Legal support for local and international client needs"
            description="The practice structure reflects the firm's priority audiences: property buyers, businesses, investors, financial institutions, families, developers, foreign clients and Nigerians abroad."
            tone="light"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {targetAudiences.map((audience) => (
              <div key={audience} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-4">
                <Users className="shrink-0 text-royalGold" size={18} />
                <span className="text-sm font-semibold text-ink/75">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Service Architecture"
            title="Detailed service pages for high-intent legal enquiries"
            description="Priority services are available as dedicated pages with process guidance, FAQs, schema markup and consultation CTAs."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <article key={area.slug} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <Scale className="text-royalGold" />
                <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{area.title}</h2>
                <div className="mt-5 space-y-3">
                  {area.servicePages.slice(0, 4).map((service) => (
                    <Link
                      key={service.slug}
                      href={`/practice-areas/${area.slug}/${service.slug}`}
                      className="flex items-start gap-3 rounded-md border border-royalGold/12 p-3 text-sm font-semibold text-ivory/75 transition hover:border-royalGold/45 hover:text-royalGold"
                    >
                      <CheckCircle2 className="mt-0.5 shrink-0 text-royalGold" size={15} />
                      {service.title}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA source="Practice areas page" />
    </main>
  );
}
