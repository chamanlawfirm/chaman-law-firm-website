import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/ContentDetailPage";
import { getBlogPostBySlug, getBlogPostSlugs, getRelatedBlogPosts } from "@/lib/cms";
import { asArticleContent, getPublishedContentMetadata } from "@/lib/publishing";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getBlogPostSlugs({ publicOnly: true });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return post ? getPublishedContentMetadata(asArticleContent(post)) : {};
}

export default async function LegalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post, 3);
  return <ContentDetailPage content={asArticleContent(post)} related={related.map(asArticleContent)} />;
}
