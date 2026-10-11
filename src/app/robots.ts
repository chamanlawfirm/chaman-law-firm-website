import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"]
      },
      {
        userAgent: ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"],
        allow: "/",
        disallow: ["/studio", "/api"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
