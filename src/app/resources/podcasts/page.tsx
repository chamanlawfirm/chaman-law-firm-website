import type { Metadata } from "next";
import { ContentHubPage } from "@/components/ContentHubPage";
import { getPublishedContent, publishingConfig } from "@/lib/publishing";
import { createMetadata } from "@/lib/seo";

const config = publishingConfig.podcasts;

export const metadata: Metadata = createMetadata({ title: "Legal Podcasts", description: config.description, path: config.hubPath });

export default async function PodcastsPage() {
  return <ContentHubPage kind="podcasts" items={await getPublishedContent("podcasts")} />;
}
