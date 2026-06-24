import type { Metadata } from "next";
import { CalendarDays, Clock3, Mic2, Newspaper, PlayCircle } from "lucide-react";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getMediaItems } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Media Centre",
  description:
    "Chaman Law Firm media centre for podcasts, videos, webinars, legal news, court updates, professional commentary and media features.",
  path: "/media"
});

const channels = [
  { icon: Mic2, title: "Podcast", text: "Legal insight episodes for clients, diaspora communities, businesses and the legal public.", href: "/resources/podcasts" },
  { icon: PlayCircle, title: "Video", text: "Educational explainers on property verification, contracts, disputes, probate, notary and diaspora matters.", href: "/resources/videos" },
  { icon: Newspaper, title: "Legal News", text: "Legal and regulatory updates with professional commentary and practical implications.", href: "/resources/legal-news" },
  { icon: CalendarDays, title: "Court Updates", text: "Case developments and decisions organized by court, citation and jurisdiction.", href: "/resources/court-updates" }
];

export default async function MediaPage() {
  const mediaItems = await getMediaItems();

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Media", path: "/media" }])} />
      <PageHero
        eyebrow="Media Centre"
        title="Legal media, commentary, podcasts, videos and news"
        description="The media centre supports Chaman Law Firm's legal education strategy through podcasts, video explainers, webinars, legal news, court updates and professional commentary."
        image="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Speak With a Lawyer", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Publishing Channels"
            title="Multimedia legal authority for modern clients"
            description="Media content is organized around client education, lawyer authority, practice-area relevance and internal links to consultation paths."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Link key={channel.title} href={channel.href} className="rounded-lg border border-royalGold/16 bg-charcoal p-6 transition hover:-translate-y-1 hover:border-royalGold/45">
                  <Icon className="text-royalGold" />
                  <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{channel.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">{channel.text}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Media Library"
            title="Approved media content categories"
            description="Each item can be expanded in Sanity with transcripts, related practice areas, SEO fields and schema markup."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item) => (
              <Link
                key={item.slug}
                href={
                  item.type === "Video" ? `/resources/videos/${item.slug}`
                    : item.type === "Podcast" ? `/resources/podcasts/${item.slug}`
                      : item.type === "News" ? `/resources/legal-news/${item.slug}`
                        : item.type === "Court Update" ? `/resources/court-updates/${item.slug}`
                          : "/media"
                }
                className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6 transition hover:border-royalGold/45"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{item.type}</p>
                {item.status === "placeholder" ? (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-champagne/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-champagne">
                    <Clock3 size={13} /> Editable placeholder
                  </p>
                ) : null}
                <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/68">{item.description}</p>
                {item.channel ? <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-champagne">{item.channel}</p> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA source="Media page" />
    </main>
  );
}
