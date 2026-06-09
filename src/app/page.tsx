import { ArrowRight, FileCheck2, Globe2, KeyRound, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { GoogleMapSection } from "@/components/GoogleMapSection";
import { JsonLd } from "@/components/JsonLd";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearchBar } from "@/components/PropertySearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { StatsBand } from "@/components/StatsBand";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getFeaturedProperties, getRecentBlogPosts, getServices } from "@/lib/cms";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const homeFaqs = [
  {
    question: "What does Chaman Properties do?",
    answer:
      "Chaman Properties provides property sales, letting, short-let support, diaspora property management, investment advisory, and verified property acquisition assistance in Nigeria."
  },
  {
    question: "Can Chaman Properties help Nigerians abroad buy property in Nigeria?",
    answer:
      "Yes. The diaspora service supports property search, inspection, video reporting, title verification coordination, negotiation, tenant sourcing, and post-purchase management."
  },
  {
    question: "Does Chaman Properties support property title verification?",
    answer:
      "Yes. Property verification and legal due diligence support can be coordinated through qualified property law professionals where required."
  }
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Legal-Backed Confidence",
    text: "Property decisions supported by documentation awareness and legal due diligence coordination."
  },
  {
    icon: Globe2,
    title: "Diaspora-Ready Process",
    text: "Inspection, video reporting, rent collection, and asset monitoring for Nigerians abroad."
  },
  {
    icon: TrendingUp,
    title: "Investment-Focused Advisory",
    text: "Curated land, housing, rental-yield, luxury, and development opportunities."
  },
  {
    icon: KeyRound,
    title: "End-to-End Management",
    text: "Tenant sourcing, maintenance coordination, rent management, inspections, and reporting."
  }
];

export default async function HomePage() {
  const [featuredProperties, services, posts] = await Promise.all([
    getFeaturedProperties(),
    getServices(),
    getRecentBlogPosts(6)
  ]);

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(homeFaqs)
        ]}
      />
      <section className="relative min-h-[820px] overflow-hidden bg-luxuryBlack">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85"
          alt="Luxury residential property"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/78 to-luxuryBlack/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-luxuryBlack to-transparent" />
        <div className="relative mx-auto flex min-h-[820px] max-w-7xl flex-col justify-center px-4 pb-14 pt-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-royalGold">
              Luxury Real Estate | Property Investment | Diaspora Management
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-ivory sm:text-6xl lg:text-7xl">
              Premium Real Estate Investment & Property Management in Nigeria
            </h1>
            <p className="mt-6 max-w-2xl font-display text-2xl text-champagne">
              Your Dream Home, Our Work.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ivory/78">
              We help Nigerians at home and in the diaspora buy, sell, lease, manage, and invest in verified real estate assets with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
              >
                View Available Properties
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/services/diaspora"
                className="inline-flex items-center justify-center rounded-full border border-royalGold/40 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
              >
                Invest From Abroad
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-6xl">
            <PropertySearchBar />
          </div>
        </div>
      </section>

      <StatsBand />

      <section className="bg-luxuryBlack">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Featured Properties"
              title="Verified luxury, rental, land, and investment opportunities"
              description="Explore selected properties prepared for buyers, tenants, investors, and diaspora clients seeking confidence before commitment."
            />
            <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
              View all listings <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Core Services"
            title="A complete property company for ownership, income, and long-term asset protection"
            description="From acquisition to tenant management, documentation support, investment advisory, and resale, the website is structured around the real property journey."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Why Choose Chaman"
              title="Luxury real estate with documentation discipline"
              description="The brand advantage is clear: a real estate company shaped by strong property law awareness, disciplined transactions, and investor-focused support."
            />
            <div className="mt-8">
              <WhatsAppCTA />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                  <Icon className="text-royalGold" />
                  <h3 className="mt-5 font-heading text-xl font-semibold text-ivory">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-16">
        <img
          src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80"
          alt="Premium residential property"
          className="absolute inset-0 h-full w-full object-cover opacity-18"
        />
        <div className="absolute inset-0 bg-luxuryBlack/80" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Diaspora Investment & Management"
              title="Own and manage property in Nigeria from anywhere in the world"
              description="Whether you live in the USA, UK, Canada, Europe, or anywhere outside Nigeria, Chaman Properties supports property search, inspection, video reporting, legal verification coordination, tenant sourcing, rent collection, maintenance, and periodic reporting."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Video inspection reports", "Title verification coordination", "Rent collection", "Maintenance reporting", "Tenant sourcing", "Resale support"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-royalGold/16 bg-charcoal/80 p-4 text-sm text-ivory/78">
                  <FileCheck2 size={18} className="text-royalGold" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <ZohoLeadForm source="Homepage Diaspora CTA" title="Book a Diaspora Consultation" />
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Market Insight"
              title="Guides for safer property decisions"
              description="Educational content improves trust, search visibility, and AI discoverability while helping clients understand real estate decisions."
            />
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
              View All Articles <ArrowRight size={16} />
            </Link>
          </div>
          {posts.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-6 text-sm leading-7 text-ivory/68">
              Published blog posts from Sanity CMS will appear here automatically.
            </div>
          )}
        </div>
      </section>

      <GoogleMapSection />
    </main>
  );
}
