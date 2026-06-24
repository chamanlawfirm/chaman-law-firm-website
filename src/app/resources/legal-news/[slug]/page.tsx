import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/ContentDetailPage";
import { getPublishedContentBySlug, getPublishedContentMetadata, getPublishedContentSlugs, getRelatedPublishedContent } from "@/lib/publishing";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return getPublishedContentSlugs("legal-news"); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getPublishedContentBySlug("legal-news", (await params).slug);
  return item ? getPublishedContentMetadata(item) : {};
}

export default async function LegalNewsDetailPage({ params }: PageProps) {
  const item = await getPublishedContentBySlug("legal-news", (await params).slug);
  if (!item) notFound();
  return <ContentDetailPage content={item} related={await getRelatedPublishedContent(item)} />;
}
