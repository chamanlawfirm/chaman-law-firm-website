import type { Metadata } from "next";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getJobOpenings } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Careers at Chaman Properties",
  description:
    "Apply for jobs at Chaman Properties across property sales, property management, marketing, administration, and client service.",
  path: "/careers"
});

export default async function CareersPage() {
  const jobs = await getJobOpenings();

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }]),
          ...jobs.map(jobPostingSchema)
        ]}
      />
      <PageHero
        eyebrow="Careers"
        title="Build a premium real estate career with Chaman Properties"
        description="Join a property company serving buyers, landlords, investors, diaspora Nigerians, and corporate clients through trusted real estate services."
        image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div>
            <SectionHeader
              eyebrow="Open Roles"
              title="Property, client service, marketing, and management opportunities"
              description="The careers page is ready for CMS-managed job openings, future CV upload, and Zoho CRM or Zoho Recruit integration."
            />
            <div className="mt-10 space-y-5">
              {jobs.map((job) => (
                <article key={job.slug} className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">{job.department}</p>
                      <h2 className="mt-3 font-heading text-2xl text-ivory">{job.title}</h2>
                    </div>
                    <span className="rounded-full border border-royalGold/28 px-3 py-1 text-xs font-semibold text-champagne">
                      {job.type}
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-ivory/64">
                    <MapPin size={16} className="text-royalGold" />
                    {job.location}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-ivory/70">{job.summary}</p>
                  <ul className="mt-5 grid gap-2 text-sm text-ivory/68 sm:grid-cols-2">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="flex gap-2">
                        <BriefcaseBusiness size={15} className="mt-1 shrink-0 text-royalGold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <aside>
            <ZohoLeadForm source="Careers page" title="Apply for a Role" submitLabel="Submit Application" />
          </aside>
        </div>
      </section>
    </main>
  );
}
