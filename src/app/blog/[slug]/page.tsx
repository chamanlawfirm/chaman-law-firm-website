import type { Metadata } from "next";
import { CalendarDays, UserRound } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
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

  return (
    <main>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` }
          ]),
          ...(post.faqs ? [faqSchema(post.faqs)] : [])
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
                {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-royalGold" />
                {formatDate(post.date)}
              </span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </section>
        <section className="bg-luxuryBlack py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
            <div className="rounded-lg border border-royalGold/16 bg-charcoal p-6 sm:p-10">
              <p className="font-display text-2xl leading-10 text-champagne">{post.excerpt}</p>
              <div className="mt-8">
                {post.body.length ? (
                  <PortableTextRenderer value={post.body} />
                ) : (
                  <p className="text-base leading-8 text-ivory/76">
                    Full article content is being prepared in the CMS. Please check back shortly.
                  </p>
                )}
              </div>
              {post.faqs ? (
                <div className="mt-10">
                  <h2 className="font-heading text-2xl text-ivory">Questions Answered</h2>
                  <div className="mt-5">
                    <FaqList faqs={post.faqs} />
                  </div>
                </div>
              ) : null}
            </div>
            <aside>
              <ZohoLeadForm source={`Blog article - ${post.title}`} title="Need Property Advice?" />
            </aside>
          </div>
        </section>
      </article>
    </main>
  );
}
