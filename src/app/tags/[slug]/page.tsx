import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { BlogPagination } from "@/components/BlogPagination";
import { BlogSidebar } from "@/components/BlogSidebar";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getBlogPostsByTagPage,
  getBlogSidebarData,
  getBlogTagBySlug,
  getBlogTagSlugs
} from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const revalidate = 60;
const pageSize = 24;

type TagPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

function getSafePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export async function generateStaticParams() {
  const tags = await getBlogTagSlugs();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getBlogTagBySlug(slug);

  if (!tag) {
    return createMetadata({
      title: "Tag Not Found",
      description: "The requested Chaman Properties article tag could not be found.",
      path: `/tags/${slug}`
    });
  }

  return createMetadata({
    title: `${tag.title} Articles`,
    description: `Read Chaman Properties articles tagged ${tag.title}, with practical Nigerian real estate guidance and investment insights.`,
    path: `/tags/${tag.slug}`,
    keywords: [tag.title, "Chaman Properties blog", "Nigeria real estate"]
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const currentPage = getSafePage(resolvedSearchParams?.page);
  const tag = await getBlogTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const [{ posts, total, totalPages }, sidebarData] = await Promise.all([
    getBlogPostsByTagPage(tag.slug, currentPage, pageSize),
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
            { name: tag.title, path: `/tags/${tag.slug}` }
          ])
        ]}
      />
      <PageHero
        eyebrow="Tagged Articles"
        title={tag.title}
        description={`Explore Chaman Properties articles tagged ${tag.title.toLowerCase()} for practical real estate guidance, investment insight, and property management education.`}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Tag Archive"
            title={`${tag.title} resources`}
            description={`Showing ${total} published article${total === 1 ? "" : "s"} connected to this topic.`}
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
                  <BlogPagination basePath={`/tags/${tag.slug}`} currentPage={currentPage} totalPages={totalPages} />
                </>
              ) : (
                <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center text-sm leading-7 text-ivory/68">
                  No published articles are currently connected to this tag.
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
