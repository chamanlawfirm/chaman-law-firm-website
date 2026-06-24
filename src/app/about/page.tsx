import type { Metadata } from "next";
import { Award, Globe2, Lightbulb, Scale, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { aboutContent, globalFaqs } from "@/data/site-content";
import { getLawyers, getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "About Chaman Law Firm",
  description:
    "Learn about Chaman Law Firm, a full-service Nigerian law firm serving individuals, businesses, investors, developers, financial institutions, families and diaspora clients.",
  path: "/about"
});

const valueIcons = [ShieldCheck, Award, Scale, Lightbulb, Users, Globe2];

export default async function AboutPage() {
  const [lawyers, practiceAreas] = await Promise.all([getLawyers(), getPracticeAreas()]);
  const managingPartner = lawyers.find((lawyer) => lawyer.slug === "charles-chukwuma-nkwoka");

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" }
          ]),
          faqSchema(globalFaqs)
        ]}
      />
      <PageHero
        eyebrow="About Chaman Law Firm"
        title="A full-service Nigerian law firm with international digital standards"
        description="Chaman Law Firm provides strategic legal solutions that protect clients' property, businesses, rights and future while building a trusted legal knowledge platform for Nigeria and the diaspora."
        image="/images/firm/firm-office-team.jpg"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <SectionHeader
            eyebrow="Firm Positioning"
            title="Professional legal guidance with practical commercial insight"
            description={aboutContent.positioning}
          />
          <div className="space-y-5 text-base leading-8 text-ivory/72">
            <p>{aboutContent.mission}</p>
            <p>{aboutContent.vision}</p>
            {managingPartner ? (
              <p>
                The firm is led by Barr. {managingPartner.name}, {managingPartner.position}, whose practice spans property
                transactions, title verification, due diligence, corporate advisory, dispute resolution, debt recovery,
                probate, notary public services and diaspora legal support.
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Values"
            title="The standards behind every client relationship"
            description="The brand is professional, sophisticated, authoritative, trustworthy, modern, accessible and human."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {aboutContent.values.slice(0, 6).map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <div key={value} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                  <Icon className="text-royalGold" />
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{value}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">
                    A core standard guiding advice, drafting, representation, communication and professional judgment.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeader
            eyebrow="Practice Capability"
            title="Legal support across personal, commercial and cross-border Nigerian matters"
            description="The firm is built around priority practice areas with clear consultation paths, educational resources and lawyer attribution."
            tone="light"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {practiceAreas.map((area) => (
              <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-semibold text-ink/75 transition hover:border-royalGold/55 hover:text-royalGold">
                {area.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQs"
            title="About the firm"
            description="Common questions about Chaman Law Firm, its services, client groups and office locations."
            align="center"
          />
          <div className="mt-8">
            <FaqList faqs={globalFaqs} />
          </div>
        </div>
      </section>
      <ConsultationCTA source="About page" />
    </main>
  );
}
