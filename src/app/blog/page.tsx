import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogPostsPage } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;
const pageSize = 20;

export const metadata: Metadata = createMetadata({
  title: "Property Blog, Market Insights and Investment Guides",
  description:
"Read expert real estate insights, property investment guides, due diligence tips, diaspora property advice, and luxury real estate updates in Lagos, Ogun State, and across Nigeria.",
  path: "/blog"
});

type BlogPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function getSafePage(value?: string) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = getSafePage(resolvedSearchParams?.page);
  const { posts, total, totalPages, hasNextPage, hasPreviousPage } = await getBlogPostsPage(currentPage, pageSize);

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
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
          {posts.length ? (
            <>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="group overflow-hidden rounded-lg border border-royalGold/18 bg-charcoal transition hover:-translate-y-1 hover:border-royalGold/45"
                  >
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        width={900}
                        height={560}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">
                        {post.category} | {formatDate(post.date)}
                      </p>
                      <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-ivory group-hover:text-royalGold">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-ivory/68">{post.excerpt}</p>
                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-ivory/58">
                          {post.author} | {post.readingTime}
                        </p>
                        <Link href={`/blog/${post.slug}`} className="text-sm font-bold text-royalGold hover:text-champagne">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {totalPages > 1 ? (
                <nav className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-royalGold/12 pt-6 sm:flex-row">
                  <p className="text-sm text-ivory/62">
                    Showing page {currentPage} of {totalPages} | {total} published posts
                  </p>
                  <div className="flex gap-3">
                    {hasPreviousPage ? (
                      <Link
                        href={currentPage - 1 === 1 ? "/blog" : `/blog?page=${currentPage - 1}`}
                        className="rounded-full border border-royalGold/30 px-5 py-2 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
                      >
                        Previous
                      </Link>
                    ) : null}
                    {hasNextPage ? (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="rounded-full bg-royalGold px-5 py-2 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
                      >
                        Load More
                      </Link>
                    ) : null}
                  </div>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="mt-10 rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center">
              <h2 className="font-heading text-2xl font-semibold text-ivory">No blog posts found</h2>
              <p className="mt-3 text-sm leading-7 text-ivory/68">
                Published Chaman Properties articles will appear here automatically after they are created in Sanity CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
