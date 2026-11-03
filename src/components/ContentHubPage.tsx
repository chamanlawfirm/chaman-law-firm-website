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
        cta={kind === "legal-news" ? { label: "Read the latest reports", href: "#latest-news" } : { label: "Book Consultation", href: "/consultation" }}
      />
      <section id={kind === "legal-news" ? "latest-news" : undefined} className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ivory/58">
            <Link href="/" className="hover:text-royalGold">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/resources" className="hover:text-royalGold">Resources</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-royalGold">{config.label}</span>
          </nav>
          {kind === "legal-news" ? (
            <>
              <SectionHeader
                eyebrow="Nigeria newsroom"
                title="Latest verified news and current affairs"
                description="National affairs, government policy, business, property and infrastructure, courts, technology and major state developments. Articles are written or verified by our editorial team and distinguish facts, analysis and opinion."
              />
              <div className="mt-7 rounded-lg border border-royalGold/20 bg-charcoal p-5 text-sm leading-7 text-ivory/75">
                <p>Our newsroom prioritises independently sourced developments affecting Nigerians at home and abroad. Sources and corrections are identified on individual reports where available. We do not automatically reproduce unverified reports from other publishers.</p>
                <p className="mt-2">Sections include: National Affairs · Government &amp; Policy · Economy &amp; Business · Property &amp; Infrastructure · Courts &amp; Regulation · Security · Education &amp; Society · Technology · States &amp; Communities.</p>
              </div>
            </>
          ) : (
            <SectionHeader
              eyebrow="Legal Updates"
              title={`Latest ${config.label.toLowerCase()}`}
              description="Read developments and explanations that may help you assess legal issues affecting your rights, property or business."
            />
          )}
          {kind === "legal-news" ? (
            <section aria-labelledby="newsroom-standards-heading" className="mt-8 rounded-xl border border-royalGold/20 bg-charcoal p-6 sm:p-8">
              <h2 id="newsroom-standards-heading" className="font-heading text-2xl font-semibold text-ivory">Nigeria News & Current Affairs</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-ivory/75">Our newsroom covers public affairs and developments affecting Nigerians, with particular attention to the law, the economy, housing, business, public safety and government policy. Reports are distinguished from legal analysis and opinion, with editorial attribution and original sources where available.</p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="News coverage areas">
                {["National affairs", "Governance and policy", "Business and economy", "Property and infrastructure", "Courts and justice", "Security", "Education and health", "Technology", "States and communities", "International developments"].map(category => (
                  <span key={category} className="rounded-full border border-royalGold/20 px-3 py-1.5 text-xs font-medium text-ivory/80">{category}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/resources/legal-news/feed.xml" className="text-sm font-bold text-royalGold underline underline-offset-4">Subscribe to newsroom RSS</Link>
                <Link href="/contact" className="text-sm font-bold text-royalGold underline underline-offset-4">Send a news correction or tip</Link>
              </div>
            </section>
          ) : null}
          {items.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <PublishedContentCard key={`${item.contentKind}-${item.slug}`} item={item} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-8 text-sm leading-7 text-ivory/68">
              {kind === "legal-news" ? "Our editorial team has not published any approved news reports yet. Verified reports will appear here after editorial review." : "No articles are available in this section at present. Please explore our other legal resources or contact the firm for assistance."}
            </div>
          )}
        </div>
      </section>
      <ConsultationCTA source={`${config.label} hub`} />
    </main>
  );
}
