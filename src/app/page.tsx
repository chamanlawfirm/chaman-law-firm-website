import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Globe2,
  MessageCircle,
  Scale,
  ShieldCheck,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PracticeAreaCard } from "@/components/PracticeAreaCard";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { professionalMemberships, keyDifferentiators } from "@/data/resources";
import { targetAudiences } from "@/data/site-content";
import {
  getDownloads,
  getHomepageContent,
  getLawyers,
  getMediaItems,
  getPracticeAreas,
  getTestimonials
} from "@/lib/legal-cms";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, legalServiceSchema, organizationSchema } from "@/lib/schema";
import { globalFaqs } from "@/data/site-content";

export const metadata: Metadata = createMetadata({
  title: "Chaman Law Firm",
  description:
    "Chaman Law Firm is a premium full-service Nigerian law firm for property law, real estate transactions, corporate and commercial law, litigation, debt recovery, probate, immigration, family law, notary public services, and diaspora legal support.",
  path: "/"
});

const trustIcons = [ShieldCheck, BriefcaseBusiness, Globe2, Scale];

export default async function HomePage() {
  const [home, practiceAreas, lawyers, downloads, media, testimonials] = await Promise.all([
    getHomepageContent(),
    getPracticeAreas(),
    getLawyers(),
    getDownloads(),
    getMediaItems(),
    getTestimonials()
  ]);
  const managingPartner = lawyers.find((lawyer) => lawyer.slug === "charles-chukwuma-nkwoka");

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          legalServiceSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(globalFaqs)
        ]}
      />
      <section className="relative min-h-[84svh] overflow-hidden bg-luxuryBlack">
        <Image
          src="/images/firm/firm-team.jpg"
          alt="Chaman Law Firm legal team"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-38"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/82 to-luxuryBlack/25" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-luxuryBlack to-transparent" />
        <div className="relative mx-auto flex min-h-[84svh] max-w-7xl flex-col justify-center px-4 pb-14 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-royalGold">{home.hero.eyebrow}</p>
            <h1 className="mt-5 font-heading text-5xl font-bold leading-tight text-ivory sm:text-6xl lg:text-7xl">
              {home.hero.title}
            </h1>
            <p className="mt-6 max-w-3xl font-display text-2xl leading-9 text-champagne">{home.hero.tagline}</p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ivory/78">{home.hero.copy}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
              >
                {home.hero.primaryCta}
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/practice-areas"
                className="inline-flex items-center justify-center rounded-full border border-royalGold/40 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
              >
                {home.hero.secondaryCta}
              </Link>
              <a
                href={`tel:${siteConfig.phones[0]}`}
                className="inline-flex items-center justify-center rounded-full border border-ivory/20 px-6 py-3 text-sm font-bold text-ivory transition hover:border-royalGold hover:text-royalGold"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-lightGray text-ink">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {home.trustIndicators.map((item, index) => {
            const Icon = trustIcons[index % trustIcons.length];
            return (
              <div key={item.title} className="border-l border-royalGold/40 pl-5">
                <Icon className="text-royalGold" size={22} />
                <h2 className="mt-3 font-heading text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-luxuryBlack py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {home.stats.map((item) => (
            <div key={item.label} className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
              <p className="font-heading text-3xl font-semibold text-royalGold">{item.value}</p>
              <p className="mt-2 text-sm text-ivory/66">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Core Practice Areas"
              title="Legal services built around high-value client decisions"
              description="Every practice area is structured for overview, services, who we help, common issues, process, FAQs, lawyer attribution, related downloads, and consultation conversion."
            />
            <Link href="/practice-areas" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
              View all practice areas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {practiceAreas.map((area) => (
              <PracticeAreaCard key={area.slug} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Signature Expertise</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight">{home.signatureExpertise.title}</h2>
            <p className="mt-5 text-base leading-8 text-ink/72">{home.signatureExpertise.copy}</p>
            <div className="mt-8">
              <WhatsAppCTA message="Hello Chaman Law Firm, I need legal support for a property, business, or diaspora matter." />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {home.signatureExpertise.points.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-ink/10 bg-white p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={19} />
                <span className="text-sm font-semibold leading-6 text-ink/78">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeader
            eyebrow="Diaspora Legal Services"
            title={home.diasporaServices.title}
            description={home.diasporaServices.copy}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {home.diasporaServices.points.map((point) => (
              <div key={point} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-5">
                <Globe2 className="text-royalGold" />
                <p className="mt-4 text-sm font-semibold leading-7 text-ivory/76">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <SectionHeader
            eyebrow="Client Journey"
            title="A clear path from first enquiry to legal action"
            description="The website is designed to convert qualified visitors into consultation requests, WhatsApp enquiries, calls, and resource downloads."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {home.clientJourney.map((step, index) => (
              <div key={step} className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-royalGold text-sm font-bold text-luxuryBlack">
                  {index + 1}
                </span>
                <p className="mt-5 text-base font-semibold leading-7 text-ivory">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Who We Serve"
            title="Built for the clients identified in the project blueprint"
            description="The platform serves local clients, businesses, investors, developers, families, institutions, and diaspora communities seeking trusted Nigerian legal support."
            tone="light"
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {targetAudiences.map((audience) => (
              <div key={audience} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-semibold text-ink/75">
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          {managingPartner ? (
            <>
              <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-royalGold/16">
                <Image
                  src={managingPartner.image}
                  alt={managingPartner.name}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Managing Partner</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-ivory">{managingPartner.name}</h2>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-champagne">{managingPartner.position}</p>
                <p className="mt-5 text-base leading-8 text-ivory/72">{managingPartner.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {managingPartner.credentials.map((credential) => (
                    <span key={credential} className="rounded-full border border-royalGold/22 px-3 py-1 text-xs font-semibold text-royalGold">
                      {credential}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-ivory/68">{managingPartner.philosophy}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/lawyers/${managingPartner.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
                  >
                    View Profile <ArrowRight size={17} />
                  </Link>
                  <Link
                    href="/lawyers"
                    className="inline-flex items-center justify-center rounded-full border border-royalGold/35 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
                  >
                    Meet the Team
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Resources, Downloads, Media and News"
            title="A legal knowledge platform for SEO, AEO and GEO authority"
            description="The resource centre supports articles, guides, FAQs, legal news, court updates, downloadable resources, podcasts, videos, webinars, and internal linking to practice areas and lawyer profiles."
            tone="light"
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-lg border border-ink/10 bg-white p-6">
              <FileText className="text-royalGold" />
              <h3 className="mt-4 font-heading text-2xl font-semibold">Download Centre</h3>
              <div className="mt-5 space-y-4">
                {downloads.slice(0, 3).map((resource) => (
                  <Link key={resource.slug} href="/resources/downloads" className="block border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-ink">{resource.title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{resource.description}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-6">
              <MessageCircle className="text-royalGold" />
              <h3 className="mt-4 font-heading text-2xl font-semibold">Media Centre</h3>
              <div className="mt-5 space-y-4">
                {media.slice(0, 3).map((item) => (
                  <Link key={item.slug} href="/media" className="block rounded-md border border-ink/10 p-4 transition hover:border-royalGold/55">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">{item.type}</p>
                    <p className="mt-2 font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-6">
              <Award className="text-royalGold" />
              <h3 className="mt-4 font-heading text-2xl font-semibold">Authority Signals</h3>
              <div className="mt-5 space-y-3">
                {[...professionalMemberships.slice(0, 4), ...keyDifferentiators.slice(0, 3)].map((item) => (
                  <p key={item} className="flex gap-2 text-sm leading-6 text-ink/70">
                    <CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={15} />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeader
            eyebrow="Testimonials"
            title="Client trust will be published through the approval workflow"
            description="The testimonial CMS is configured for approved written reviews, ratings, video testimonials, Google Reviews and practice-area relationships. No client quote is displayed until it is approved."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.length ? (
              testimonials.slice(0, 4).map((testimonial) => (
                <article key={`${testimonial.clientName}-${testimonial.practiceArea}`} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                  <p className="text-sm leading-7 text-ivory/72">&ldquo;{testimonial.review}&rdquo;</p>
                  <p className="mt-5 font-semibold text-ivory">{testimonial.clientName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-royalGold">{testimonial.practiceArea}</p>
                </article>
              ))
            ) : (
              ["Google Reviews", "Client Testimonials", "Video Testimonials", "Practice-Area Reviews"].map((item) => (
                <div key={item} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                  <Users className="text-royalGold" />
                  <h3 className="mt-5 font-heading text-xl font-semibold text-ivory">{item}</h3>
                  <p className="mt-3 text-sm leading-7 text-ivory/66">Ready for publication after client approval and editorial review.</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <ConsultationCTA source="Homepage" />

      <section className="bg-lightGray py-14 text-ink">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Newsletter</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold">Legal insights for property, business, disputes, probate and diaspora clients</h2>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-bold text-ink transition hover:border-royalGold hover:text-royalGold"
          >
            Browse Resources <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
