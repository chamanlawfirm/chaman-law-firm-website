import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { BlogPagination } from "@/components/BlogPagination";
import { BlogSidebar } from "@/components/BlogSidebar";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getBlogCategoryBySlug,
  getBlogCategorySlugs,
  getBlogPostsPage,
  getBlogSidebarData
} from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const revalidate = 60;
const pageSize = 12;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    page?: string;
  }>;
};

function getSafePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export async function generateStaticParams() {
  const categories = await getBlogCategorySlugs();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    return createMetadata({
      title: "Category Not Found",
      description: "The requested article category could not be found.",
      path: `/category/${slug}`
    });
  }

  return createMetadata({
    title: `${category.title} Articles`,
    description:
      category.description ||
      `Read Chaman Properties articles about ${category.title.toLowerCase()}, Nigerian real estate, property investment, and property management.`,
    path: `/category/${category.slug}`,
    keywords: [category.title, "Chaman Properties blog", "Nigeria real estate"]
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const currentPage = getSafePage(resolvedSearchParams?.page);
  const category = await getBlogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [{ posts, total, totalPages }, sidebarData] = await Promise.all([
    getBlogPostsPage({ page: currentPage, pageSize, categorySlug: category.slug }),
    getBlogSidebarData()
  ]);

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: category.title, path: `/category/${category.slug}` }
          ])
        ]}
      />
      <PageHero
        eyebrow="Chaman Property Insights"
        title={category.title}
        description={
          category.description ||
          `Explore Chaman Properties articles on ${category.title.toLowerCase()} for safer real estate decisions.`
        }
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Category Articles"
            title={`${category.title} guides and insights`}
            description={`Showing ${total} published article${total === 1 ? "" : "s"} in this category.`}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              {posts.length ? (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post, index) => (
                      <BlogCard key={post.slug} post={post} priority={index < 2 && currentPage === 1} />
                    ))}
                  </div>
                  <BlogPagination basePath={`/category/${category.slug}`} currentPage={currentPage} totalPages={totalPages} />
                </>
              ) : (
                <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center">
                  <h2 className="font-heading text-2xl font-semibold text-ivory">No articles found</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/68">
                    Articles in this category will appear automatically after they are published in Sanity CMS.
                  </p>
                </div>
              )}
            </div>
            <BlogSidebar {...sidebarData} />
          </div>
        </div>
      </section>
    </main>
  );
}
