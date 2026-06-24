import type { Metadata } from "next";
import { BriefcaseBusiness, CheckCircle2, GraduationCap, MapPin, Users } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { LeadForm } from "@/components/LeadForm";
import { getCareerPaths } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description:
    "Explore career, internship, NYSC, lawyer, legal research, administrative and professional development opportunities at Chaman Law Firm.",
  path: "/careers"
});

export default async function CareersPage() {
  const roles = await getCareerPaths();

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" }
          ]),
          ...roles.map(jobPostingSchema)
        ]}
      />
      <PageHero
        eyebrow="Careers"
        title="Build a legal career with Chaman Law Firm"
        description="Chaman Law Firm welcomes career interest from lawyers, interns, NYSC associates, legal researchers, administrative talent and professionals who value excellence, integrity and client service."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Submit Career Interest", href: "#career-form" }}
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Opportunities"
              title="Legal and operational career pathways"
              description="Career interest can be submitted for legal practice, training, legal research, administration, client service and digital content operations."
            />
            <div className="mt-10 space-y-5">
              {roles.map((role) => (
                <article key={role.slug} className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{role.department}</p>
                      <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">{role.title}</h2>
                    </div>
                    <span className="rounded-full border border-royalGold/25 px-3 py-1 text-xs font-semibold text-champagne">
                      {role.type}
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-ivory/64">
                    <MapPin size={16} className="text-royalGold" />
                    {role.location}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-ivory/70">{role.summary}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {role.requirements.map((requirement) => (
                      <p key={requirement} className="flex gap-2 text-xs font-semibold leading-5 text-ivory/66">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-royalGold" size={14} />
                        {requirement}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: BriefcaseBusiness, title: "Lawyers" },
                { icon: GraduationCap, title: "Interns / NYSC" },
                { icon: Users, title: "Support Teams" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
                    <Icon className="text-royalGold" />
                    <p className="mt-4 text-sm font-semibold text-ivory">{item.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <aside id="career-form">
            <LeadForm source="Careers page" title="Submit Career Interest" submitLabel="Submit Interest" />
          </aside>
        </div>
      </section>
    </main>
  );
}
