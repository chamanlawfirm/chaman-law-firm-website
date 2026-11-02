import type { MetadataRoute } from "next";
import { getAllServicePages, practiceAreas } from "@/data/practice-areas";
import { getBlogPostSlugs } from "@/lib/cms";
import { siteConfig } from "@/lib/constants";
import { getPublishedContent, publishingKinds } from "@/lib/publishing";
import { adCampaigns } from "@/data/ad-campaigns";

export const revalidate = 3600;

const consolidatedBlogSlugs = new Set([
  "how-to-use-cac-public-search-for-your-business"
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date("2026-08-14T00:00:00.000Z");
  const officePageLastModified = new Date("2026-11-02T00:00:00.000Z");
  const staticRoutes = [
    "",
    "/about",
    "/practice-areas",
    "/lawyers",
    "/lawyers/charles-chukwuma-nkwoka",
    "/resources",
    "/resources/blog",
    "/resources/legal-news",
    "/resources/court-updates",
    "/resources/podcasts",
    "/resources/videos",
    "/resources/downloads",
    "/media",
    "/careers",
    "/contact",
    "/consultation",
    "/lawyer-in-ikeja",
    "/law-firm-in-arepo",
    "/privacy-policy",
    "/cookie-policy",
    "/terms-of-use",
    "/legal-disclaimer"
  ];
  const [blogSlugs, publishedGroups] = await Promise.all([
    getBlogPostSlugs(),
    Promise.all(publishingKinds.map((kind) => getPublishedContent(kind, 500)))
  ]);

  const serviceRoutes = getAllServicePages().map(({ area, service }) => ({
    url: `${siteConfig.url}/practice-areas/${area.slug}/${service.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.82
  }));
  const articleRoutes = blogSlugs.filter(({ slug }) => !consolidatedBlogSlugs.has(slug)).map(({ slug }) => ({
    url: `${siteConfig.url}/resources/blog/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.78
  }));
  const publishingRoutes = publishedGroups.flatMap((items) =>
    items.filter((item) => !item.seo?.noIndex).map((item) => ({
      url: `${siteConfig.url}${item.hubPath}/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.76
    }))
  );

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: route === "/lawyer-in-ikeja" || route === "/law-firm-in-arepo" ? officePageLastModified : lastModified,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8
    })),
    ...practiceAreas.map((area) => ({
      url: `${siteConfig.url}/practice-areas/${area.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...adCampaigns.map((campaign) => ({
      url: `${siteConfig.url}/${campaign.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.92
    })),
    ...serviceRoutes,
    ...articleRoutes,
    ...publishingRoutes
  ];
}
