import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogPosts } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Property Blog, Market Insights and Investment Guides",
  description:
    "Read Chaman Properties insights on diaspora property investment, title documents, property management, letting, fraud prevention, and Nigerian real estate.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
            title="SEO and GEO-ready content structure"
            description="Each article is prepared for search visibility, structured data, and useful answers that can be understood by clients and generative search engines."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-lg border border-royalGold/18 bg-charcoal transition hover:-translate-y-1 hover:border-royalGold/45"
              >
                <img src={post.image} alt={post.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-royalGold">
                    {post.category} | {formatDate(post.date)}
                  </p>
                  <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-ivory group-hover:text-royalGold">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-ivory/68">{post.excerpt}</p>
                  <p className="mt-5 text-sm font-bold text-royalGold">{post.readingTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
