import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { BlogPagination } from "@/components/BlogPagination";
import { BlogSidebar } from "@/components/BlogSidebar";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogPostsPage, getBlogSidebarData } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const revalidate = 60;
const pageSize = 24;

export const metadata: Metadata = createMetadata({
  title: "Property Blog, Market Insights and Investment Guides",
  description:
"Read expert real estate insights, property investment guides, due diligence tips, diaspora property advice, and luxury real estate updates in Lagos, Ogun State, and across Nigeria.",
  path: "/blog"
});

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

function getSafePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getSafePage(resolvedSearchParams?.page);
  const search = resolvedSearchParams?.search?.trim() || undefined;
  const [{ posts, total, totalPages }, sidebarData] = await Promise.all([
    getBlogPostsPage({ page: currentPage, pageSize, search }),
    getBlogSidebarData()
  ]);

  return (
    <main>
      <JsonLd data={[organizationSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])]} />
      <PageHero
        eyebrow="Chaman Property Insights"
        title="Practical real estate guides for safer decisions"
        description="Educational content for buyers, landlords, diaspora clients, tenants, and investors who want more confidence before making property decisions."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Latest Articles"
            title="Latest property insights from Chaman Properties"
            description="Fresh articles from the Chaman Properties CMS, ordered by publish date for buyers, landlords, diaspora clients, and investors."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              {search ? (
                <p className="mb-5 text-sm text-ivory/62">
                  Showing {total} result{total === 1 ? "" : "s"} for <span className="font-semibold text-royalGold">{search}</span>
                </p>
              ) : null}
              {posts.length ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post, index) => (
                      <BlogCard key={post.slug} post={post} priority={index < 2 && currentPage === 1} />
                    ))}
                  </div>
                  <BlogPagination basePath="/blog" currentPage={currentPage} totalPages={totalPages} search={search} />
                </>
              ) : (
                <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center">
                  <h2 className="font-heading text-2xl font-semibold text-ivory">No blog posts found</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">
                    Published Chaman Properties articles will appear here automatically after they are created in Sanity CMS.
                  </p>
                </div>
              )}
            </div>
            <BlogSidebar {...sidebarData} search={search} />
          </div>
        </div>
      </section>
    </main>
  );
}
