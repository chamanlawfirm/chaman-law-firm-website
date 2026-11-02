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

export function resolveCanonicalUrl(path = "", candidate?: string) {
  const fallback = new URL(path || "/", siteConfig.url).toString();

  if (!candidate) return fallback;

  try {
    const url = new URL(candidate, siteConfig.url);
    const approvedHost = new URL(siteConfig.url).hostname.replace(/^www\./, "");
    const candidateHost = url.hostname.replace(/^www\./, "");

    if (candidateHost !== approvedHost) return fallback;

    url.hostname = approvedHost;
    url.protocol = "https:";
    if (url.pathname === "/blog" || url.pathname.startsWith("/blog/")) {
      url.pathname = `/resources${url.pathname}`;
    }
    return url.toString();
  } catch {
    return fallback;
  }
}

function shortenMetadata(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const candidate = value.slice(0, maxLength - 1);
  const lastSpace = candidate.lastIndexOf(" ");
  const shortened = lastSpace >= Math.floor(maxLength * 0.7) ? candidate.slice(0, lastSpace) : candidate;
  return `${shortened.trimEnd()}…`;
}

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
  const brandedTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const fullTitle = brandedTitle.length <= 65 ? brandedTitle : shortenMetadata(brandedTitle, 65);
  const metaDescription = shortenMetadata(description, 165);
  const url = resolveCanonicalUrl(path, canonicalUrl);

  return {
    title: fullTitle,
    description: metaDescription,
    ...(keywords.length ? { keywords: [...new Set(keywords)] } : {}),
    alternates: {
      canonical: url
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : undefined,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
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
      description: metaDescription,
      images: [image]
    }
  };
}
