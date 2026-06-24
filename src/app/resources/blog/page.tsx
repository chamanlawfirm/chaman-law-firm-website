import type { Metadata } from "next";
import { ArrowRight, Scale } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { BlogPagination } from "@/components/BlogPagination";
import { BlogSidebar } from "@/components/BlogSidebar";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogPostsPage, getBlogSidebarData } from "@/lib/cms";
import { getPracticeAreas } from "@/lib/legal-cms";
import { breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Legal Blog",
  description:
    "Chaman Law Firm legal blog for property law guides, corporate law insights, dispute resolution notes, probate explainers, notary guidance and diaspora legal education.",
  path: "/resources/blog"
});

type PageProps = {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
};

export default async function LegalBlogPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const requestedPage = Number.parseInt(query.page || "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const search = query.search?.trim();
  const category = query.category?.trim();
  const [result, sidebar, practiceAreas] = await Promise.all([
    getBlogPostsPage({ page, pageSize: 9, search, categorySlug: category }),
    getBlogSidebarData(),
    getPracticeAreas()
  ]);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Blog", path: "/resources/blog" }
        ])}
      />
      <PageHero
        eyebrow="Legal Blog"
        title="Practical legal insight for safer decisions"
        description="Explore legal articles on property, business, disputes, estates, documentation, immigration, family law and diaspora client needs."
        image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80"
        cta={{ label: "Book Consultation", href: "/consultation" }}
      />

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <SectionHeader
                eyebrow={search ? "Search Results" : category ? "Filtered Articles" : "Latest Articles"}
                title={search ? `Results for “${search}”` : "Legal guidance from the Chaman Law Firm knowledge desk"}
                description={`${result.total} published article${result.total === 1 ? "" : "s"} available in this view.`}
              />
              {result.posts.length ? (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {result.posts.map((post, index) => <BlogCard key={post.slug} post={post} priority={index < 2} />)}
                </div>
              ) : (
                <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-8 text-sm leading-7 text-ivory/68">
                  No published articles match this view yet. The article route and CMS workflow are ready for editorial content.
                </div>
              )}
              <BlogPagination
                basePath="/resources/blog"
                currentPage={result.page}
                totalPages={result.totalPages}
                search={search}
                category={category}
              />
            </div>
            <BlogSidebar {...sidebar} search={search} />
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Editorial Clusters"
            title="Explore insight by legal service"
            description="Practice-area clusters create clear internal pathways between legal education, relevant services and consultation."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {practiceAreas.map((area) => (
              <article key={area.slug} className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-6">
                <Scale className="text-royalGold" />
                <h2 className="mt-5 font-heading text-2xl font-semibold text-ivory">{area.title}</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/68">{area.summary}</p>
                <Link href={`/practice-areas/${area.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
                  View practice area <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA source="Legal blog page" />
    </main>
  );
}
