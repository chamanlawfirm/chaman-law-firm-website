import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PublishedContentCard } from "@/components/PublishedContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { publishingConfig, type PublishedContent, type PublishingKind } from "@/lib/publishing";
import { breadcrumbSchema } from "@/lib/schema";

export function ContentHubPage({ kind, items }: { kind: PublishingKind; items: PublishedContent[] }) {
  const config = publishingConfig[kind];

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: config.label, path: config.hubPath }
        ])}
      />
      <PageHero
        eyebrow={config.label}
        title={config.title}
        description={config.description}
        image={config.heroImage}
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ivory/58">
            <Link href="/" className="hover:text-royalGold">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-royalGold">Resources</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-royalGold">{config.label}</span>
          </nav>
          <SectionHeader
            eyebrow="Publishing Desk"
            title={`Latest ${config.label.toLowerCase()}`}
            description="Every publication supports structured metadata, author attribution, internal linking, related content and a clear consultation path."
          />
          {items.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <PublishedContentCard key={`${item.contentKind}-${item.slug}`} item={item} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-8 text-sm leading-7 text-ivory/68">
              This publishing channel is ready. New entries will appear here after editorial review and publication in the CMS.
            </div>
          )}
        </div>
      </section>
      <ConsultationCTA source={`${config.label} hub`} />
    </main>
  );
}
