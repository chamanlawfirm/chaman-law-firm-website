import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { BlogLeadCTA } from "@/components/BlogLeadCTA";
import { BlogSidebar } from "@/components/BlogSidebar";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getBlogSidebarData, getResourceCenterPosts } from "@/lib/cms";
import { getResourceCenterBySlug, resourceCenters } from "@/lib/resource-centers";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";

export const revalidate = 60;

type ResourceCenterPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resourceCenters.map((center) => ({ slug: center.slug }));
}

export async function generateMetadata({ params }: ResourceCenterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const center = getResourceCenterBySlug(slug);

  if (!center) {
    return createMetadata({
      title: "Resource Center Not Found",
      description: "The requested Chaman Properties resource center could not be found.",
      path: `/resources/${slug}`
    });
  }

  return createMetadata({
    title: center.title,
    description: center.description,
    path: `/resources/${center.slug}`,
    keywords: center.keywords
  });
}

export default async function ResourceCenterPage({ params }: ResourceCenterPageProps) {
  const { slug } = await params;
  const center = getResourceCenterBySlug(slug);

  if (!center) {
    notFound();
  }

  const [posts, sidebarData] = await Promise.all([
    getResourceCenterPosts(center.keywords, 12),
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
            { name: center.title, path: `/resources/${center.slug}` }
          ])
        ]}
      />
      <PageHero
        eyebrow={center.eyebrow}
        title={center.title}
        description={center.description}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80"
      />
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="space-y-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {center.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-3 rounded-lg border border-royalGold/16 bg-charcoal p-4 text-sm text-ivory/72">
                  <CheckCircle2 size={18} className="shrink-0 text-royalGold" />
                  {highlight}
                </div>
              ))}
            </div>
            <BlogLeadCTA source={center.title} />
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow="Recommended Resources"
                  title="Start with these Chaman Properties guides"
                  description="This hub pulls relevant articles from the Sanity CMS and updates automatically as new content is published."
                />
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
                  View All Articles <ArrowRight size={16} />
                </Link>
              </div>
              {posts.length ? (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {posts.map((post, index) => (
                    <BlogCard key={post.slug} post={post} priority={index < 2} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center text-sm leading-7 text-ivory/68">
                  Relevant articles will appear here automatically after they are published in Sanity CMS.
                </div>
              )}
            </section>
          </div>
          <BlogSidebar {...sidebarData} />
        </div>
      </section>
    </main>
  );
}
