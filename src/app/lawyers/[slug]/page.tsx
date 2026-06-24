import type { Metadata } from "next";
import { Award, BriefcaseBusiness, CheckCircle2, FileText, GraduationCap, MapPin, Mic2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { lawyers as fallbackLawyers } from "@/data/lawyers";
import { officeLocations } from "@/data/site-content";
import { getLawyerBySlug, getPracticeAreas } from "@/lib/legal-cms";
import { createMetadata } from "@/lib/seo";
import { attorneySchema, breadcrumbSchema } from "@/lib/schema";

type LawyerPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fallbackLawyers.map((lawyer) => ({ slug: lawyer.slug }));
}

export async function generateMetadata({ params }: LawyerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = await getLawyerBySlug(slug);

  if (!lawyer) {
    return createMetadata({
      title: "Lawyer Not Found",
      description: "The requested Chaman Law Firm lawyer profile could not be found.",
      path: `/lawyers/${slug}`,
      noIndex: true
    });
  }

  return createMetadata({
    title: `${lawyer.name}, Esq. | ${lawyer.position}`,
    description: lawyer.summary,
    path: `/lawyers/${lawyer.slug}`,
    image: lawyer.image,
    keywords: [lawyer.name, lawyer.position, ...lawyer.credentials, ...lawyer.practiceAreas]
  });
}

export default async function LawyerPage({ params }: LawyerPageProps) {
  const { slug } = await params;
  const [lawyer, practiceAreas] = await Promise.all([getLawyerBySlug(slug), getPracticeAreas()]);

  if (!lawyer) {
    notFound();
  }

  const profileAreas = practiceAreas.filter((area) => lawyer.practiceAreas.includes(area.title));

  return (
    <main>
      <JsonLd
        data={[
          attorneySchema(lawyer),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Lawyers", path: "/lawyers" },
            { name: lawyer.name, path: `/lawyers/${lawyer.slug}` }
          ])
        ]}
      />
      <section className="bg-luxuryBlack">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-royalGold/16">
            <Image src={lawyer.image} alt={lawyer.name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">{lawyer.position}</p>
            <h1 className="mt-4 font-heading text-5xl font-semibold leading-tight text-ivory sm:text-6xl">
              {lawyer.name}, Esq.
            </h1>
            <p className="mt-5 text-lg leading-8 text-ivory/72">{lawyer.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {lawyer.credentials.map((credential) => (
                <span key={credential} className="rounded-full border border-royalGold/22 px-3 py-1 text-xs font-semibold text-royalGold">
                  {credential}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-ivory/68">{lawyer.philosophy}</p>
            <Link
              href="/consultation"
              className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-charcoal py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="space-y-8">
            <section className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6 sm:p-8">
              <h2 className="font-heading text-3xl font-semibold text-ivory">Biography</h2>
              <div className="mt-5 space-y-5 text-sm leading-7 text-ivory/72">
                {lawyer.biography.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6 sm:p-8">
              <h2 className="font-heading text-3xl font-semibold text-ivory">Professional Experience</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {lawyer.experience.map((item) => (
                  <div key={item} className="flex gap-3 rounded-md border border-royalGold/14 p-4 text-sm font-semibold leading-6 text-ivory/76">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-royalGold" size={17} />
                    {item}
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6 sm:p-8">
              <h2 className="font-heading text-3xl font-semibold text-ivory">Practice Areas</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {profileAreas.map((area) => (
                  <Link key={area.slug} href={`/practice-areas/${area.slug}`} className="flex items-center gap-3 rounded-md border border-royalGold/14 p-4 text-sm font-semibold text-ivory/76 transition hover:border-royalGold/45 hover:text-royalGold">
                    <BriefcaseBusiness className="shrink-0 text-royalGold" size={17} />
                    {area.title}
                  </Link>
                ))}
              </div>
            </section>
            {lawyer.publications.length || lawyer.mediaFeatures.length ? (
              <section className="grid gap-5 md:grid-cols-2">
                {lawyer.publications.length ? (
                  <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                    <FileText className="text-royalGold" />
                    <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Publications</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-ivory/70">
                      {lawyer.publications.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}
                {lawyer.mediaFeatures.length ? (
                  <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                    <Mic2 className="text-royalGold" />
                    <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Media Features</h2>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-ivory/70">
                      {lawyer.mediaFeatures.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>
          <aside className="space-y-5">
            <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
              <GraduationCap className="text-royalGold" />
              <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Credentials</h2>
              <ul className="mt-4 space-y-2 text-sm text-ivory/70">
                {lawyer.credentials.map((credential) => (
                  <li key={credential} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-royalGold" size={15} />
                    {credential}
                  </li>
                ))}
              </ul>
              {lawyer.admissions.length ? (
                <div className="mt-5 border-t border-royalGold/12 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-royalGold">Admission</p>
                  {lawyer.admissions.map((admission) => <p key={admission} className="mt-2 text-sm leading-6 text-ivory/70">{admission}</p>)}
                </div>
              ) : null}
            </div>
            {lawyer.memberships.length ? (
              <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <Award className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Memberships</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-ivory/70">
                  {lawyer.memberships.map((membership) => <li key={membership}>{membership}</li>)}
                </ul>
              </div>
            ) : null}
            {lawyer.awards.length ? (
              <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <Award className="text-royalGold" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Awards</h2>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-ivory/70">
                  {lawyer.awards.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
              <MapPin className="text-royalGold" />
              <h2 className="mt-4 font-heading text-2xl font-semibold text-ivory">Offices</h2>
              <div className="mt-4 space-y-4">
                {officeLocations.map((office) => (
                  <div key={office.name}>
                    <p className="text-sm font-semibold text-ivory">{office.name}</p>
                    <p className="mt-1 text-sm leading-7 text-ivory/66">{office.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <ConsultationCTA source={`Lawyer profile - ${lawyer.name}`} />
    </main>
  );
}
