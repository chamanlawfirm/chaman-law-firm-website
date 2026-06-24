import type { Metadata } from "next";
import { Clock3, Download, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getDownloads, getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Downloads",
  description:
    "Download Chaman Law Firm legal checklists, guides, templates and client preparation resources for property, diaspora, business, probate and debt recovery matters.",
  path: "/resources/downloads"
});

export default async function DownloadsPage() {
  const [downloads, practiceAreas] = await Promise.all([getDownloads(), getPracticeAreas()]);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Downloads", path: "/resources/downloads" }
        ])}
      />
      <PageHero
        eyebrow="Downloads"
        title="Legal checklists, guides and client preparation resources"
        description="Use these resources to organize facts and documents before speaking with Chaman Law Firm about property, diaspora, business, debt recovery and estate matters."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Resource Library"
            title="Approved download categories for client preparation"
            description="Each resource is connected to related practice areas and a consultation path so visitors can move from education to action."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {downloads.map((resource) => (
              <article key={resource.slug} className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
                <Download className="text-royalGold" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{resource.category}</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">{resource.title}</h2>
                {resource.placeholder ? (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-champagne/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-champagne">
                    <Clock3 size={13} /> Editable content placeholder
                  </p>
                ) : null}
                <p className="mt-3 text-sm leading-7 text-ivory/68">{resource.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.relatedPracticeAreas.map((slug) => {
                    const area = practiceAreas.find((item) => item.slug === slug);

                    return area ? (
                      <Link key={slug} href={`/practice-areas/${slug}`} className="rounded-full border border-royalGold/18 px-3 py-1 text-xs font-semibold text-royalGold hover:bg-royalGold hover:text-luxuryBlack">
                        {area.shortTitle}
                      </Link>
                    ) : null;
                  })}
                </div>
                {resource.downloadPath ? (
                  <a href={resource.downloadPath} className="mt-6 inline-flex items-center gap-2 rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne">
                    <Download size={16} /> {resource.cta}
                  </a>
                ) : (
                  <a
                    href={`mailto:info@chamanlawfirm.com?subject=${encodeURIComponent(`Resource draft request: ${resource.title}`)}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-royalGold/35 px-5 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
                  >
                    <Mail size={16} /> Request editable draft
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            "Property due diligence preparation",
            "Diaspora legal representation guidance",
            "Business, debt recovery and probate intake support"
          ].map((item) => (
            <div key={item} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
              <FileText className="text-royalGold" />
              <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-ivory/66">
                Downloadable resources help clients understand documents, risks and next steps before formal legal work begins.
              </p>
            </div>
          ))}
        </div>
      </section>
      <ConsultationCTA source="Downloads page" />
    </main>
  );
}
