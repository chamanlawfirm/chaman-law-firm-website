import type { MetadataRoute } from "next";
import {
  getBlogAuthorSlugs,
  getBlogCategories,
  getBlogPosts,
  getBlogTags,
  getProperties,
  getServices
} from "@/lib/cms";
import { siteConfig } from "@/lib/constants";
import { resourceCenters } from "@/lib/resource-centers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, services, posts, categories, authors, tags] = await Promise.all([
    getProperties(),
    getServices(),
    getBlogPosts({ limit: 100 }),
    getBlogCategories(),
    getBlogAuthorSlugs(),
    getBlogTags()
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/properties",
    "/properties/for-sale",
    "/properties/for-rent",
    "/properties/shortlet",
    "/properties/shortlets",
    "/properties/investment",
    "/services",
    "/blog",
    "/careers",
    "/internship",
    "/contact"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8
    })),
    ...services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85
    })),
    ...properties.map((property) => ({
      url: `${siteConfig.url}/properties/${property.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.72
    })),
    ...categories.map((category) => ({
      url: `${siteConfig.url}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...authors.map((author) => ({
      url: `${siteConfig.url}/authors/${author.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.64
    })),
    ...tags.map((tag) => ({
      url: `${siteConfig.url}/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.62
    })),
    ...resourceCenters.map((center) => ({
      url: `${siteConfig.url}/resources/${center.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.76
    }))
  ];
}
