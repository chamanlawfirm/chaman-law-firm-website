import type { Metadata } from "next";
import { ContentHubPage } from "@/components/ContentHubPage";
import { getPublishedContent, publishingConfig } from "@/lib/publishing";
import { createMetadata } from "@/lib/seo";

const config = publishingConfig["legal-news"];

export const metadata: Metadata = createMetadata({ title: "Legal News", description: config.description, path: config.hubPath });

export default async function LegalNewsPage() {
  return <ContentHubPage kind="legal-news" items={await getPublishedContent("legal-news")} />;
}
