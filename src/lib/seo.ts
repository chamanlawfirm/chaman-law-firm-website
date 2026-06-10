import type { Metadata } from "next";
import { defaultOgImage, siteConfig } from "@/lib/constants";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function createMetadata({
  title,
  description,
  path = "",
  image = defaultOgImage,
  keywords = [],
  canonicalUrl,
  noIndex = false,
  type = "website"
}: SeoInput): Metadata {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const url = canonicalUrl || `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "Chaman Properties",
      "Nigeria real estate",
      "property sales Nigeria",
      "property management Lagos",
      "diaspora property management",
      "verified property investment",
      ...keywords
    ],
    alternates: {
      canonical: url
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: {
        "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
          ? [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION]
          : []
      }
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: fullTitle
        }
      ],
      locale: "en_NG",
      type
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image]
    }
  };
}
