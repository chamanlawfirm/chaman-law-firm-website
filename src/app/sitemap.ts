import type { MetadataRoute } from "next";
import { getAllServicePages, practiceAreas } from "@/data/practice-areas";
import { getBlogPostSlugs } from "@/lib/cms";
import { getLawyers } from "@/lib/legal-cms";
import { siteConfig } from "@/lib/constants";
import { getPublishedContent, publishingKinds } from "@/lib/publishing";
import { adCampaigns } from "@/data/ad-campaigns";
import { disciplines, researchPath } from "@/data/research";
import { getResearchIndex, paperPath } from "@/lib/research";
import { propertyLocations } from "@/data/property-locations";

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
    "/property-lawyers-nigeria",
    "/lawyer-in-ikeja",
    "/law-firm-in-arepo",
    "/offices/abuja-wuse-zone-1",
    "/offices/magodo-gra",
    "/offices/lekki",
    "/privacy-policy",
    "/cookie-policy",
    "/terms-of-use",
    "/legal-disclaimer"
  ];
  const [lawyers, blogSlugs, publishedGroups, research] = await Promise.all([
    getLawyers(),
    getBlogPostSlugs(),
    Promise.all(publishingKinds.map((kind) => getPublishedContent(kind, 500))),
    getResearchIndex().catch(() => [])
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
      lastModified: route === "/lawyer-in-ikeja" || route === "/law-firm-in-arepo" || route === "/offices/abuja-wuse-zone-1" || route === "/offices/magodo-gra" || route === "/offices/lekki" ? officePageLastModified : lastModified,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8
    })),
    ...lawyers.map(({ slug }) => ({
      url: `${siteConfig.url}/lawyers/${slug}`
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
    ...propertyLocations.map((item) => ({
      url: `${siteConfig.url}/property-lawyers/${item.slug}`,
      lastModified: new Date("2026-11-22T00:00:00.000Z"),
      changeFrequency: "monthly" as const,
      priority: 0.84
    })),
    ...serviceRoutes,
    ...articleRoutes,
    ...publishingRoutes,
    { url: `${siteConfig.url}${researchPath}` },
    { url: `${siteConfig.url}${researchPath}/editorial` },
    ...disciplines.map(({ id }) => ({ url: `${siteConfig.url}${researchPath}/categories/${id}` })),
    ...research.map((paper) => ({ url: `${siteConfig.url}${paperPath(paper.slug)}`, lastModified: new Date(paper.updatedAt) })),
    ...[...new Set(research.flatMap((paper) => paper.authors.map((author) => author.slug)))].map((slug) => ({ url: `${siteConfig.url}${researchPath}/authors/${slug}` }))
  ];
}
