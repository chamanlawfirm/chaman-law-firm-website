import type { Metadata } from "next";
import { CalendarDays, RefreshCcw, Tag, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEngagementStats } from "@/components/ArticleEngagementStats";
import { AuthorBio } from "@/components/AuthorBio";
import { BlogArticleGrid } from "@/components/BlogArticleGrid";
import { BlogLeadCTA } from "@/components/BlogLeadCTA";
import { BlogSidebar } from "@/components/BlogSidebar";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { LeadMagnetDownloads } from "@/components/LeadMagnetDownloads";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
  getBlogSidebarData,
  getRecommendedBlogPosts,
  getRelatedBlogPosts
} from "@/lib/cms";
import { getArticleFaqs, getArticleHeadings } from "@/lib/article";
import { createMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

type BlogArticleProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPostSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return createMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: `/blog/${slug}`
    });
  }

  return createMetadata({
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.seo?.openGraphImage || post.image,
    keywords: post.seo?.keywords || [post.category, "property guide", "Nigeria real estate"],
    canonicalUrl: post.seo?.canonicalUrl,
    noIndex: post.seo?.noIndex,
    type: "article"
  });
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, recommendedPosts, sidebarData] = await Promise.all([
    getRelatedBlogPosts(post, 3),
    getRecommendedBlogPosts(post.slug, 3),
    getBlogSidebarData()
  ]);
  const headings = getArticleHeadings(post.body);
  const articleFaqs = getArticleFaqs(post);

  return (
    <main>
      <ReadingProgressBar />
      <JsonLd
        data={[
          organizationSchema(),
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ]),
          faqSchema(articleFaqs)
        ]}
      />
      <article>
        <section className="relative overflow-hidden bg-luxuryBlack">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-32"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/86 to-luxuryBlack/32" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-royalGold">{post.category}</p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-ivory sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-ivory/66">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} className="text-royalGold" />
                {post.authorProfile.slug ? (
                  <Link href={`/authors/${post.authorProfile.slug}`} className="hover:text-royalGold">
                    {post.author}
                  </Link>
                ) : (
                  post.author
                )}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-royalGold" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <RefreshCcw size={16} className="text-royalGold" />
                Updated {formatDate(post.updatedAt)}
              </span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </section>
        <section className="bg-luxuryBlack py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
            <div className="space-y-10">
              <div className="rounded-lg border border-royalGold/16 bg-charcoal p-6 sm:p-10">
                <p className="font-display text-2xl leading-10 text-champagne">{post.excerpt}</p>
                {post.tags.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {post.tags.slice(0, 8).map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/tags/${tag.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-royalGold/16 px-3 py-1 text-xs font-semibold text-ivory/58 transition hover:border-royalGold/40 hover:text-royalGold"
                      >
                        <Tag size={13} />
                        {tag.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <div className="mt-8">
                  <BlogLeadCTA source={`Blog article intro - ${post.title}`} />
                </div>
                <div className="mt-8">
                  <TableOfContents headings={headings} />
                </div>
                <div className="mt-8">
                  {post.body.length ? (
                    <PortableTextRenderer value={post.body} />
                  ) : (
                    <p className="text-base leading-8 text-ivory/76">
                      Full article content is being prepared in the CMS. Please check back shortly.
                    </p>
                  )}
                </div>
                <div className="mt-10">
                  <BlogLeadCTA source={`Blog article body - ${post.title}`} />
                </div>
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-ivory">Questions Answered</h2>
                  <div className="mt-5">
                    <FaqList faqs={articleFaqs} />
                  </div>
                </div>
              </div>
              <AuthorBio post={post} />
              <LeadMagnetDownloads source={`Blog article - ${post.title}`} />
              <NewsletterSignup source={`Blog article newsletter - ${post.title}`} />
              <BlogArticleGrid
                eyebrow="Related Articles"
                title="More from this category"
                posts={relatedPosts}
                emptyText="Related articles from this category will appear as more posts are published."
              />
              <BlogArticleGrid
                eyebrow="Recommended Reading"
                title="Continue learning"
                posts={recommendedPosts}
                emptyText="Recommended Chaman Properties articles will appear here soon."
              />
            </div>
            <aside className="space-y-5">
              <ArticleEngagementStats slug={post.slug} />
              <SocialShareButtons title={post.title} path={`/blog/${post.slug}`} />
              <BlogSidebar {...sidebarData} />
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
