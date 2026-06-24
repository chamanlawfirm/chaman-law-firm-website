import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getAllServicePages, practiceAreas as fallbackPracticeAreas } from "@/data/practice-areas";
import { getDownloads, getPracticeAreaBySlug, getServicePageBySlug } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, legalServiceSchema } from "@/lib/schema";

type ServicePageProps = {
  params: Promise<{ slug: string; serviceSlug: string }>;
};

export function generateStaticParams() {
  return getAllServicePages().map(({ area, service }) => ({
    slug: area.slug,
    serviceSlug: service.slug
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params;
  const area = fallbackPracticeAreas.find((item) => item.slug === slug) || (await getPracticeAreaBySlug(slug));
  const service = await getServicePageBySlug(slug, serviceSlug);

  if (!area || !service) {
    return createMetadata({
      title: "Legal Service Not Found",
      description: "The requested Chaman Law Firm legal service could not be found.",
      path: `/practice-areas/${slug}/${serviceSlug}`,
      noIndex: true
    });
  }

  return createMetadata({
    title: `${service.title} | ${area.title}`,
    description: service.summary,
    path: `/practice-areas/${area.slug}/${service.slug}`,
    keywords: [service.title, area.title, ...service.keyPoints, "Chaman Law Firm"]
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug, serviceSlug } = await params;
  const [area, service, downloads] = await Promise.all([
    getPracticeAreaBySlug(slug),
    getServicePageBySlug(slug, serviceSlug),
    getDownloads()
  ]);

  if (!area || !service) {
    notFound();
  }

  const relatedDownloads = downloads.filter((resource) => resource.relatedPracticeAreas.includes(area.slug));

  return (
    <main>
      <JsonLd
        data={[
          legalServiceSchema(area),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Practice Areas", path: "/practice-areas" },
            { name: area.title, path: `/practice-areas/${area.slug}` },
            { name: service.title, path: `/practice-areas/${area.slug}/${service.slug}` }
          ]),
          faqSchema(service.faqs)
        ]}
      />
      <PageHero
        eyebrow={area.title}
        title={service.title}
        description={service.description}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeader
            eyebrow="Service Overview"
            title={`${service.title} support from Chaman Law Firm`}
            description={service.summary}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {service.keyPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-lg border border-royalGold/16 bg-charcoal p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18} />
                <span className="text-sm font-semibold leading-6 text-ivory/76">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Process</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">How the service is handled</h2>
            <div className="mt-8 space-y-4">
              {service.process.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg border border-ink/10 bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-royalGold text-sm font-bold text-luxuryBlack">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-ink/75">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-5">
            <div className="rounded-lg border border-ink/10 bg-white p-6">
              <ClipboardCheck className="text-royalGold" />
              <h2 className="mt-4 font-heading text-2xl font-semibold">Related Practice Area</h2>
              <p className="mt-3 text-sm leading-7 text-ink/68">{area.summary}</p>
              <Link href={`/practice-areas/${area.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-ink">
                View {area.shortTitle} <ArrowRight size={15} />
              </Link>
            </div>
            {relatedDownloads.length ? (
              <div className="rounded-lg border border-ink/10 bg-white p-6">
                <FileText className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold">Related Downloads</h2>
                <div className="mt-4 space-y-3">
                  {relatedDownloads.map((resource) => (
                    <Link key={resource.slug} href="/resources/downloads" className="block text-sm font-semibold leading-6 text-ink/70 hover:text-royalGold">
                      {resource.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQs"
            title={`${service.title} questions`}
            description="Clear answers help clients understand the issue before booking a consultation."
            align="center"
          />
          <div className="mt-8">
            <FaqList faqs={service.faqs} />
          </div>
        </div>
      </section>
      <ConsultationCTA source={`Service page - ${service.title}`} />
    </main>
  );
}
