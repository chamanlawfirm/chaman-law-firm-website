import type { Metadata } from "next";
import { GraduationCap, ListChecks, UsersRound } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Internship Opportunities",
  description:
    "Apply for internship opportunities at Chaman Properties in property sales, property management, marketing, documentation support, and client service.",
  path: "/internship"
});

const faqs = [
  {
    question: "Who can apply for internship at Chaman Properties?",
    answer:
      "Students, graduates, and early-career professionals interested in real estate sales, management, marketing, client service, and property documentation support can apply."
  },
  {
    question: "What departments can interns support?",
    answer:
      "Interns may support sales, property management, marketing, inspection coordination, administration, and documentation liaison depending on business needs."
  }
];

const tracks = [
  "Property sales and client advisory",
  "Property management operations",
  "Digital marketing and listing content",
  "Inspection coordination and reporting",
  "Administrative and customer support",
  "Documentation liaison support"
];

export default function InternshipPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Internship", path: "/internship" }]),
          faqSchema(faqs)
        ]}
      />
      <PageHero
        eyebrow="Internship"
        title="Start a practical real estate career path"
        description="The internship page captures future talent for property sales, management, marketing, inspections, and client support."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Internship Tracks"
              title="Learn the business of verified property service"
              description="Internship candidates can be routed into departments based on interest, availability, and current company needs."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {tracks.map((track) => (
                <div key={track} className="rounded-lg border border-royalGold/18 bg-charcoal p-5">
                  <GraduationCap className="text-royalGold" />
                  <p className="mt-4 text-sm font-semibold text-ivory">{track}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-6">
              <div className="flex gap-4">
                <UsersRound className="shrink-0 text-royalGold" />
                <div>
                  <h2 className="font-heading text-2xl text-ivory">What to prepare</h2>
                  <ul className="mt-5 space-y-3 text-sm text-ivory/70">
                    {["CV or resume link", "Preferred department", "Availability period", "Location preference", "Short statement of interest"].map((item) => (
                      <li key={item} className="flex gap-2">
                        <ListChecks size={16} className="mt-1 shrink-0 text-royalGold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <ZohoLeadForm source="Internship page" title="Apply for Internship" submitLabel="Submit Internship Application" />
        </div>
      </section>
    </main>
  );
}
