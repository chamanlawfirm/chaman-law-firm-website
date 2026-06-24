import type { Metadata } from "next";
import { ContentHubPage } from "@/components/ContentHubPage";
import { getPublishedContent, publishingConfig } from "@/lib/publishing";
import { createMetadata } from "@/lib/seo";

const config = publishingConfig["court-updates"];

export const metadata: Metadata = createMetadata({ title: "Court Updates", description: config.description, path: config.hubPath });

export default async function CourtUpdatesPage() {
  return <ContentHubPage kind="court-updates" items={await getPublishedContent("court-updates")} />;
}
