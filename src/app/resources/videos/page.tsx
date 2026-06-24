import type { Metadata } from "next";
import { ContentHubPage } from "@/components/ContentHubPage";
import { getPublishedContent, publishingConfig } from "@/lib/publishing";
import { createMetadata } from "@/lib/seo";

const config = publishingConfig.videos;

export const metadata: Metadata = createMetadata({ title: "Legal Videos", description: config.description, path: config.hubPath });

export default async function VideosPage() {
  return <ContentHubPage kind="videos" items={await getPublishedContent("videos")} />;
}
