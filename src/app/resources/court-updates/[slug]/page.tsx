import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/ContentDetailPage";
import { getPublishedContentBySlug, getPublishedContentMetadata, getPublishedContentSlugs, getRelatedPublishedContent } from "@/lib/publishing";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return getPublishedContentSlugs("court-updates"); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getPublishedContentBySlug("court-updates", (await params).slug);
  return item ? getPublishedContentMetadata(item) : {};
}

export default async function CourtUpdateDetailPage({ params }: PageProps) {
  const item = await getPublishedContentBySlug("court-updates", (await params).slug);
  if (!item) notFound();
  return <ContentDetailPage content={item} related={await getRelatedPublishedContent(item)} />;
}
