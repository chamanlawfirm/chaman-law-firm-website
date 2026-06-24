import type { Metadata } from "next";
import { ArrowRight, AlertTriangle, CheckCircle2, FileText, Scale, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { practiceAreas as fallbackPracticeAreas } from "@/data/practice-areas";
import { getDownloads, getLawyers, getPracticeAreaBySlug, getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, legalServiceSchema, practiceAreaSchema } from "@/lib/schema";

type PracticeAreaPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fallbackPracticeAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PracticeAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await getPracticeAreaBySlug(slug);

  if (!area) {
    return createMetadata({
      title: "Practice Area Not Found",
      description: "The requested Chaman Law Firm practice area could not be found.",
      path: `/practice-areas/${slug}`,
      noIndex: true
    });
  }

  return createMetadata({
    title: area.title,
    description: area.summary,
    path: `/practice-areas/${area.slug}`,
    keywords: [area.title, ...area.services.slice(0, 5), ...area.seoKeywords, "Chaman Law Firm"]
  });
}

export default async function PracticeAreaPage({ params }: PracticeAreaPageProps) {
  const { slug } = await params;
  const [area, allAreas, lawyers, downloads] = await Promise.all([
    getPracticeAreaBySlug(slug),
    getPracticeAreas(),
    getLawyers(),
    getDownloads()
  ]);

  if (!area) {
    notFound();
  }

  const managingPartner = lawyers[0];
  const relatedDownloads = downloads.filter((resource) => resource.relatedPracticeAreas.includes(area.slug));
  const relatedAreas = allAreas.filter((item) => item.slug !== area.slug).slice(0, 3);
  const consultationLabel =
    area.slug === "employment-law"
      ? "Book an Employment Law Consultation"
      : area.slug === "adr-mediation"
        ? "Start a Dispute Resolution Brief"
        : "Book Consultation";

  return (
    <main>
      <JsonLd
        data={[
          legalServiceSchema(area),
          practiceAreaSchema(area),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Practice Areas", path: "/practice-areas" },
            { name: area.title, path: `/practice-areas/${area.slug}` }
          ]),
          faqSchema(area.faqs)
        ]}
      />
      <PageHero
        eyebrow={area.eyebrow}
        title={area.title}
        description={area.description}
        image="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: consultationLabel, href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Overview"
              title={`How Chaman Law Firm supports ${area.shortTitle.toLowerCase()} clients`}
              description={area.summary}
            />
            <div className="mt-8 rounded-lg border border-royalGold/16 bg-charcoal p-6">
              <Scale className="text-royalGold" />
              <p className="mt-4 text-sm leading-7 text-ivory/70">{area.description}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {area.services.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-lg border border-royalGold/16 bg-charcoal p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18} />
                <span className="text-sm font-semibold leading-6 text-ivory/76">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {area.servicePages.length ? (
        <section className="bg-charcoal py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Detailed Services"
              title={`${area.shortTitle} service pages`}
              description="High-intent legal services are structured with dedicated pages, FAQs, process guidance and direct consultation paths."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {area.servicePages.map((service) => (
                <Link
                  key={service.slug}
                  href={`/practice-areas/${area.slug}/${service.slug}`}
                  className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6 transition hover:-translate-y-1 hover:border-royalGold/45"
                >
                  <FileText className="text-royalGold" />
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{service.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/66">{service.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">
                    View service <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Who We Help</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Clients this service is designed for</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {area.whoWeHelp.map((client) => (
                <div key={client} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-white p-4">
                  <Users className="shrink-0 text-royalGold" size={18} />
                  <span className="text-sm font-semibold text-ink/75">{client}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Common Issues</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Risks and problems clients often need to solve</h2>
            <div className="mt-8 space-y-4">
              {area.commonIssues.map((issue) => (
                <div key={issue} className="flex gap-4 rounded-lg border border-ink/10 bg-white p-5">
                  <AlertTriangle className="mt-0.5 shrink-0 text-royalGold" size={18} />
                  <p className="text-sm font-semibold leading-6 text-ink/75">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeader
            eyebrow="Process"
            title="A structured path from enquiry to legal action"
            description="The firm starts by understanding the facts, documents and urgency, then identifies the most appropriate advisory, drafting, negotiation or representation pathway."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {area.process.map((step, index) => (
              <div key={step} className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-royalGold text-sm font-bold text-luxuryBlack">
                  {index + 1}
                </span>
                <p className="mt-5 text-sm font-semibold leading-7 text-ivory/76">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="FAQs"
              title={`${area.shortTitle} questions answered`}
              description="Direct answers support client education, search visibility and generative search readiness."
            />
            <div className="mt-8">
              <FaqList faqs={area.faqs} />
            </div>
          </div>
          <aside className="space-y-5">
            {managingPartner ? (
              <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Related Lawyer</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-ivory">{managingPartner.name}</h3>
                <p className="mt-2 text-sm text-champagne">{managingPartner.position}</p>
                <p className="mt-3 text-sm leading-7 text-ivory/66">{managingPartner.summary}</p>
                <Link
                  href={`/lawyers/${managingPartner.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne"
                >
                  View profile <ArrowRight size={16} />
                </Link>
              </div>
            ) : null}
            {relatedDownloads.length ? (
              <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Related Downloads</p>
                <div className="mt-4 space-y-4">
                  {relatedDownloads.map((resource) => (
                    <Link key={resource.slug} href="/resources/downloads" className="block border-b border-royalGold/10 pb-4 last:border-0 last:pb-0">
                      <FileText className="text-royalGold" size={18} />
                      <p className="mt-2 text-sm font-semibold leading-6 text-ivory">{resource.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Related Practice Areas</p>
              <div className="mt-4 space-y-3">
                {relatedAreas.map((relatedArea) => (
                  <Link key={relatedArea.slug} href={`/practice-areas/${relatedArea.slug}`} className="block text-sm font-semibold leading-6 text-ivory/72 hover:text-royalGold">
                    {relatedArea.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <ConsultationCTA
        title={consultationLabel}
        description="Share the facts, documents, and urgency so Chaman Law Firm can identify the right legal pathway and next step."
        source={`Practice area - ${area.title}`}
      />
    </main>
  );
}
