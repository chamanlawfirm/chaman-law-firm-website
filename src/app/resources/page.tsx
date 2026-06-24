import type { Metadata } from "next";
import { ArrowRight, BookOpen, Download, FileQuestion, Landmark, Mic2, Newspaper, PlayCircle } from "lucide-react";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { globalFaqs } from "@/data/site-content";
import { getDownloads, getMediaItems, getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Legal Resources",
  description:
    "Explore Chaman Law Firm legal resources, blog topics, FAQs, downloads, guides, legal news, media and practical client education.",
  path: "/resources"
});

const hubs = [
  { icon: BookOpen, title: "Legal Blog", text: "Practical articles for property law, corporate law, disputes, probate, notary, immigration, family and diaspora topics.", href: "/resources/blog" },
  { icon: Download, title: "Downloads", text: "Client preparation resources, checklists, guides and intake briefs for high-intent legal matters.", href: "/resources/downloads" },
  { icon: Newspaper, title: "Legal News", text: "Timely legal and regulatory developments with clear practical implications.", href: "/resources/legal-news" },
  { icon: Landmark, title: "Court Updates", text: "Structured case notes covering courts, citations, decisions and legal consequences.", href: "/resources/court-updates" },
  { icon: Mic2, title: "Podcasts", text: "Legal insight episodes for clients, businesses, investors and diaspora communities.", href: "/resources/podcasts" },
  { icon: PlayCircle, title: "Videos", text: "Practical video explainers with summaries, transcripts and related legal pathways.", href: "/resources/videos" },
  { icon: FileQuestion, title: "FAQs", text: "Direct answers built for client education, search visibility and AI-powered discovery.", href: "#faqs" }
];

export default async function ResourcesPage() {
  const [practiceAreas, downloads, media] = await Promise.all([getPracticeAreas(), getDownloads(), getMediaItems()]);

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" }
          ]),
          faqSchema(globalFaqs)
        ]}
      />
      <PageHero
        eyebrow="Resources"
        title="A legal knowledge platform for clients, investors, businesses and diaspora communities"
        description="The resource centre supports legal education, search visibility, generative discovery and conversion through articles, FAQs, downloads, media and internal links to legal services."
        image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Download Resources", href: "/resources/downloads" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Knowledge Hub"
            title="Legal content organized around client decisions"
            description="The resource system connects education to practice areas, lawyer authority, downloadable assets and consultation requests."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hubs.map((hub) => {
              const Icon = hub.icon;
              return (
                <Link key={hub.title} href={hub.href} className="rounded-lg border border-royalGold/16 bg-charcoal p-6 transition hover:-translate-y-1 hover:border-royalGold/45">
                  <Icon className="text-royalGold" />
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{hub.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">{hub.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">
                    Open <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <SectionHeader
            eyebrow="Featured Downloads"
            title="Client preparation resources"
            description="Downloads help visitors organize documents and understand next steps before a consultation."
          />
          <div className="grid gap-4">
            {downloads.map((resource) => (
              <Link key={resource.slug} href="/resources/downloads" className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-5 transition hover:border-royalGold/45">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{resource.category}</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-ivory">{resource.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/68">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Editorial Clusters"
              title="Resource topics mapped to legal services"
              description="Each practice area can support articles, FAQs, guides, media transcripts and internal links."
              tone="light"
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {practiceAreas.map((area) => (
                <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-semibold text-ink/74 transition hover:border-royalGold/55 hover:text-royalGold">
                  {area.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Latest Media</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Videos, podcasts, webinars and legal updates</h2>
            <div className="mt-8 space-y-4">
              {media.slice(0, 4).map((item) => (
                <Link
                  key={item.slug}
                  href={
                    item.type === "Video" ? `/resources/videos/${item.slug}`
                      : item.type === "Podcast" ? `/resources/podcasts/${item.slug}`
                        : item.type === "News" ? `/resources/legal-news/${item.slug}`
                          : item.type === "Court Update" ? `/resources/court-updates/${item.slug}`
                            : "/media"
                  }
                  className="block rounded-lg border border-ink/10 bg-white p-5 transition hover:border-royalGold/55"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">{item.type}</p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/66">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="faqs" className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQs"
            title="Resource centre questions"
            description="Structured questions and direct answers are part of the firm's client education and GEO readiness framework."
            align="center"
          />
          <div className="mt-8">
            <FaqList faqs={globalFaqs} />
          </div>
        </div>
      </section>
      <ConsultationCTA source="Resources page" />
    </main>
  );
}
