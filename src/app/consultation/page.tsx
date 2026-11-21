import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { LeadForm } from "@/components/LeadForm";
import { consultationContent } from "@/data/site-content";
import { getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Book Consultation",
  description:
    "Book a legal consultation with Chaman Law Firm for property law, corporate law, litigation, debt recovery, probate, notary public, immigration, family law and diaspora legal matters.",
  path: "/consultation"
});

const stepIcons = [MessageCircle, FileText, CalendarCheck2, ShieldCheck];

export default async function ConsultationPage() {
  const practiceAreas = await getPracticeAreas();

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Consultation", path: "/consultation" }])} />
      <PageHero
        eyebrow="Book Consultation"
        title={consultationContent.title}
        description={consultationContent.copy}
        image="/images/firm/managing-partner-office.png"
        cta={{ label: "Request Consultation", href: "#consultation-form" }}
      />
      <section className="bg-charcoal py-16 text-ivory" aria-labelledby="consultation-pathways">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Private consultations" title="Choose the matter you need to resolve" description="Tell us the transaction or legal decision, the documents available, and your timeline. We confirm scope, the appropriate lawyer and the consultation arrangement privately." />
          <div id="consultation-pathways" className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Property purchase", text: "Buyer representation, title review, contracts and a controlled route to completion." },
              { title: "Due diligence", text: "Title searches, survey and seller checks, document review and a written risk assessment." },
              { title: "Corporate transactions", text: "Company, investment, commercial contract and transaction advisory." },
              { title: "Probate and estates", text: "Estate administration, succession documents and family property matters." }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-royalGold/25 bg-luxuryBlack p-6">
                <h2 className="font-heading text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/70">{item.text}</p>
                <Link href="#consultation-form" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">Request assessment <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Consultation Flow"
              title="A clear intake path before legal action"
              description="The consultation process helps the firm identify your issue, documents, urgency, scope and appropriate legal pathway."
            />
            <div className="mt-8 grid gap-4">
              {consultationContent.steps.map((step, index) => {
                const Icon = stepIcons[index % stepIcons.length];
                return (
                  <div key={step} className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
                    <Icon className="text-royalGold" />
                    <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Step {index + 1}</h2>
                    <p className="mt-2 text-sm leading-7 text-ivory/68">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div id="consultation-form" className="space-y-6">
            <LeadForm source="Consultation page" title="Request a Consultation" submitLabel="Request Consultation" />
            <div className="rounded-lg border border-royalGold/16 bg-charcoal p-6 text-sm leading-7 text-ivory/70">
              <h2 className="font-heading text-xl font-semibold text-ivory">Payment after scope confirmation</h2>
              <p className="mt-2">Our team reviews the enquiry, checks conflicts where appropriate, and confirms the consultation scope and fee directly. Use the secure payment gateway only after receiving written payment instructions and your matter reference.</p>
              <Link href="/payments" className="mt-4 inline-flex items-center gap-2 font-bold text-royalGold">Secure client payments <ArrowRight size={16} /></Link>
            </div>
            <div className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Matter Types</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {practiceAreas.map((area) => (
                  <span key={area.slug} className="rounded-full border border-royalGold/18 px-3 py-1 text-xs font-semibold text-ivory/72">
                    {area.shortTitle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
