import type { Metadata } from "next";
import { ArrowRight, Award, BriefcaseBusiness, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getLawyers, getPracticeAreas } from "@/lib/legal-cms";
import { attorneySchema, breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Lawyers",
  description:
    "Meet the Chaman Law Firm legal team led by Managing Partner Charles Chukwuma Nkwoka, Esq., with experience across property, corporate, litigation, debt recovery, probate and private-client matters.",
  path: "/lawyers"
});

export default async function LawyersPage() {
  const [lawyers, practiceAreas] = await Promise.all([getLawyers(), getPracticeAreas()]);
  const managingPartner = lawyers.find((lawyer) => lawyer.slug === "charles-chukwuma-nkwoka");
  const legalTeam = lawyers.filter((lawyer) => lawyer.slug !== "charles-chukwuma-nkwoka");

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lawyers", path: "/lawyers" }
          ]),
          ...lawyers.map(attorneySchema)
        ]}
      />
      <PageHero
        eyebrow="Lawyers"
        title="Meet the legal team behind Chaman Law Firm"
        description="Our lawyers combine legal analysis, strategic advocacy and practical client service across the firm's core practice areas."
        image="/images/firm/firm-team.jpg"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />

      {managingPartner ? (
        <section className="bg-luxuryBlack py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Firm Leadership"
              title="Managing Partner"
              description="Charles Chukwuma Nkwoka, Esq. leads the firm's strategy, professional standards and commitment to practical, client-centred legal service."
            />
            <article className="mt-10 grid overflow-hidden rounded-lg border border-royalGold/20 bg-charcoal lg:grid-cols-[0.82fr_1.18fr]">
              <div className="relative min-h-[480px]">
                <Image src={managingPartner.image} alt={`${managingPartner.name}, Esq.`} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{managingPartner.position}</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold text-ivory">{managingPartner.name}, Esq.</h2>
                <p className="mt-5 text-base leading-8 text-ivory/72">{managingPartner.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {managingPartner.credentials.map((credential) => (
                    <span key={credential} className="inline-flex items-center gap-1 rounded-full border border-royalGold/18 px-3 py-1 text-xs text-royalGold">
                      <Award size={12} /> {credential}
                    </span>
                  ))}
                </div>
                <Link href={`/lawyers/${managingPartner.slug}`} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne">
                  View Managing Partner profile <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Legal Team"
            title="Experienced counsel, practical support"
            description="Meet the lawyers supporting the firm's litigation, commercial, property, debt recovery, family and private-client work."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {legalTeam.map((lawyer) => (
              <article key={lawyer.slug} className="overflow-hidden rounded-lg border border-royalGold/16 bg-luxuryBlack">
                <div className="relative h-80">
                  <Image src={lawyer.image} alt={`${lawyer.name}, Esq.`} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{lawyer.position}</p>
                  <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">{lawyer.name}, Esq.</h2>
                  <p className="mt-4 text-sm leading-7 text-ivory/68">{lawyer.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {lawyer.credentials.map((credential) => (
                      <span key={credential} className="rounded-full border border-royalGold/18 px-3 py-1 text-xs text-royalGold">{credential}</span>
                    ))}
                  </div>
                  <Link href={`/lawyers/${lawyer.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
                    View lawyer profile <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Practice Attribution"
            title="Legal experience connected to client needs"
            description="Each profile connects the lawyer's work to relevant practice areas and consultation pathways."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {practiceAreas.map((area) => (
              <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="rounded-lg border border-royalGold/16 bg-charcoal p-6 transition hover:border-royalGold/45">
                <BriefcaseBusiness className="text-royalGold" />
                <h2 className="mt-5 font-heading text-xl font-semibold text-ivory">{area.shortTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/66">{area.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-royalGold/16 bg-charcoal p-6">
            <Scale className="text-royalGold" />
            <p className="mt-4 text-sm leading-7 text-ivory/70">All lawyer biographies and portraits on this page were integrated from the approved Chaman Law Firm profile materials.</p>
          </div>
        </div>
      </section>
      <ConsultationCTA source="Lawyers page" />
    </main>
  );
}
