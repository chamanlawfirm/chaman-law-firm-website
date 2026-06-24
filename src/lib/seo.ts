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
    return url.toString();
  } catch {
    return fallback;
  }
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
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const url = resolveCanonicalUrl(path, canonicalUrl);

  return {
    title: fullTitle,
    description,
    keywords: [
      "Chaman Law Firm",
      "law firm in Nigeria",
      "law firm in Lagos",
      "property lawyer in Nigeria",
      "real estate lawyer in Lagos",
      "corporate lawyer Nigeria",
      "commercial law firm Nigeria",
      "litigation lawyer Lagos",
      "debt recovery lawyer Nigeria",
      "probate lawyer Nigeria",
      "notary public Lagos",
      "diaspora legal services Nigeria",
      ...keywords
    ],
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
