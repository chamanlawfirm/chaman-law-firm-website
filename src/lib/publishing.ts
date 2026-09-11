import { defaultOgImage } from "@/lib/constants";
import type { BlogPost } from "@/lib/types";
import { mediaItems } from "@/data/resources";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

const SANITY_REVALIDATE_SECONDS = 3600;

export const publishingKinds = ["legal-news", "court-updates", "podcasts", "videos"] as const;
export type PublishingKind = (typeof publishingKinds)[number];

export type PublishedContent = BlogPost & {
  contentKind: PublishingKind | "article";
  contentLabel: string;
  hubPath: string;
  mediaUrl?: string;
  transcript?: string;
  duration?: string;
  episodeNumber?: number;
  courtName?: string;
  citation?: string;
  jurisdiction?: string;
  decisionDate?: string;
};

type PublishingConfig = {
  kind: PublishingKind;
  documentType: "legalNews" | "courtUpdate" | "podcast" | "video";
  mediaType: "News" | "Court Update" | "Podcast" | "Video";
  label: string;
  singular: string;
  hubPath: string;
  title: string;
  description: string;
  heroImage: string;
};

export const publishingConfig: Record<PublishingKind, PublishingConfig> = {
  "legal-news": {
    kind: "legal-news",
    documentType: "legalNews",
    mediaType: "News",
    label: "Legal News",
    singular: "Legal News",
    hubPath: "/resources/legal-news",
    title: "Legal news with practical implications",
    description: "Timely legal and regulatory developments explained for clients, businesses, investors and the wider public.",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1800&q=80"
  },
  "court-updates": {
    kind: "court-updates",
    documentType: "courtUpdate",
    mediaType: "Court Update",
    label: "Court Updates",
    singular: "Court Update",
    hubPath: "/resources/court-updates",
    title: "Court decisions and legal developments",
    description: "Structured court updates highlighting decisions, legal principles, jurisdiction and practical consequences.",
    heroImage: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1800&q=80"
  },
  podcasts: {
    kind: "podcasts",
    documentType: "podcast",
    mediaType: "Podcast",
    label: "Podcasts",
    singular: "Podcast Episode",
    hubPath: "/resources/podcasts",
    title: "Chaman Legal Insights Podcast",
    description: "Practical conversations on Nigerian law, property, business, disputes, estates and diaspora legal needs.",
    heroImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1800&q=80"
  },
  videos: {
    kind: "videos",
    documentType: "video",
    mediaType: "Video",
    label: "Videos",
    singular: "Legal Video",
    hubPath: "/resources/videos",
    title: "Legal video explainers",
    description: "Clear video guidance on property verification, contracts, disputes, probate, notary and diaspora matters.",
    heroImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1800&q=80"
  }
};

type SanityPublishedContent = {
  _id?: string;
  _updatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  image?: SanityImageSource & { alt?: string };
  author?: {
    name?: string;
    slug?: string;
    image?: SanityImageSource & { alt?: string };
    photo?: SanityImageSource & { alt?: string };
    bio?: Array<Record<string, unknown>>;
    biography?: Array<Record<string, unknown>>;
  };
  body?: Array<Record<string, unknown>>;
  transcript?: string;
  mediaUrl?: string;
  duration?: string;
  episodeNumber?: number;
  courtName?: string;
  citation?: string;
  jurisdiction?: string;
  decisionDate?: string;
  tags?: string[];
  relatedPracticeAreas?: Array<{ title?: string; slug?: string } | null>;
  faqs?: Array<{ question?: string; answer?: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    noIndex?: boolean;
    openGraphImage?: SanityImageSource;
  };
};

const publishedContentFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, summary, description),
  "publishedAt": coalesce(publishedAt, decisionDate, _createdAt),
  updatedAt,
  "image": coalesce(featuredImage, mainImage, thumbnail),
  author->{
    name,
    "slug": slug.current,
    image,
    photo,
    bio,
    biography
  },
  body,
  transcript,
  "mediaUrl": coalesce(audioUrl, videoUrl, externalUrl),
  duration,
  episodeNumber,
  courtName,
  citation,
  jurisdiction,
  decisionDate,
  tags,
  relatedPracticeAreas[]->{title, "slug": slug.current},
  faqs[]{question, answer},
  seo{
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    noIndex,
    openGraphImage
  }
`;

function imageUrl(source?: SanityImageSource, width = 1200, height = 760) {
  if (!source) return defaultOgImage;

  try {
    return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return defaultOgImage;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plainText(blocks: Array<Record<string, unknown>> = []) {
  return blocks
    .map((block) => {
      const children = Array.isArray(block.children) ? block.children : [];
      return children
        .map((child) => (child && typeof child === "object" && "text" in child ? String(child.text || "") : ""))
        .join("");
    })
    .join(" ")
    .trim();
}

function fallbackBody(text: string) {
  return [
    {
      _type: "block",
      _key: "overview",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "overview-text", marks: [], text }]
    }
  ];
}

function normalizePublishedContent(item: SanityPublishedContent, kind: PublishingKind): PublishedContent | null {
  if (!item.slug || !item.title) return null;

  const config = publishingConfig[kind];
  const excerpt = item.excerpt?.trim() || `Read this ${config.singular.toLowerCase()} from Chaman Law Firm.`;
  const body = item.body?.length ? item.body : fallbackBody(excerpt);
  const categories = (item.relatedPracticeAreas || [])
    .filter((area): area is { title?: string; slug?: string } => Boolean(area?.title))
    .map((area) => ({ title: area.title || config.label, slug: area.slug }));
  const tagTitles = Array.from(new Set([...(item.tags || []), ...(item.seo?.keywords || []), config.label])).slice(0, 12);
  const authorImage = item.author?.image || item.author?.photo;
  const wordCount = `${plainText(body)} ${item.transcript || ""}`.split(/\s+/).filter(Boolean).length;

  return {
    id: item._id || item.slug,
    slug: item.slug,
    title: item.title,
    excerpt,
    date: item.publishedAt || item._updatedAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item._updatedAt || item.publishedAt || new Date().toISOString(),
    author: item.author?.name || "Chaman Law Firm",
    category: categories[0]?.title || config.label,
    categories: categories.length ? categories : [{ title: config.label }],
    authorProfile: {
      name: item.author?.name || "Chaman Law Firm",
      slug: item.author?.slug,
      image: authorImage ? imageUrl(authorImage, 320, 320) : undefined,
      imageAlt: authorImage?.alt || item.author?.name || "Chaman Law Firm author",
      bio: item.author?.bio || item.author?.biography || []
    },
    tags: tagTitles.map((title) => ({ title, slug: slugify(title) })),
    image: imageUrl(item.image),
    imageAlt: item.image?.alt || item.title,
    readingTime: `${Math.max(1, Math.ceil(wordCount / 220))} min read`,
    body,
    faqs: item.faqs?.filter((faq) => faq.question && faq.answer).map((faq) => ({
      question: faq.question || "",
      answer: faq.answer || ""
    })),
    seo: {
      title: item.seo?.metaTitle,
      description: item.seo?.metaDescription,
      keywords: item.seo?.keywords,
      canonicalUrl: item.seo?.canonicalUrl,
      openGraphImage: item.seo?.openGraphImage ? imageUrl(item.seo.openGraphImage, 1600, 900) : undefined,
      noIndex: item.seo?.noIndex
    },
    contentKind: kind,
    contentLabel: config.singular,
    hubPath: config.hubPath,
    mediaUrl: item.mediaUrl,
    transcript: item.transcript,
    duration: item.duration,
    episodeNumber: item.episodeNumber,
    courtName: item.courtName,
    citation: item.citation,
    jurisdiction: item.jurisdiction,
    decisionDate: item.decisionDate
  };
}

function fallbackPublishedContent(kind: PublishingKind) {
  const config = publishingConfig[kind];

  return mediaItems
    .filter((item) => item.type === config.mediaType)
    .map((item) =>
      normalizePublishedContent(
        {
          _id: `fallback-${item.slug}`,
          title: item.title,
          slug: item.slug,
          excerpt: item.description,
          publishedAt: new Date(0).toISOString(),
          mediaUrl: undefined,
          tags: [item.type, item.channel || "Chaman Law Firm"],
          seo: { noIndex: item.status === "placeholder" }
        },
        kind
      )
    )
    .filter((item): item is PublishedContent => Boolean(item));
}

function publishedFilter() {
  return `!(_id in path("drafts.**")) && defined(slug.current) && (_type == $documentType || (_type == "mediaItem" && type == $mediaType))`;
}

export async function getPublishedContent(kind: PublishingKind, limit = 24) {
  const config = publishingConfig[kind];

  try {
    const data = await client.fetch<SanityPublishedContent[]>(
      `*[${publishedFilter()}] | order(coalesce(publishedAt, decisionDate, _createdAt) desc) [0...$limit] {
        ${publishedContentFields}
      }`,
      { documentType: config.documentType, mediaType: config.mediaType, limit },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );
    const normalized = data.map((item) => normalizePublishedContent(item, kind)).filter((item): item is PublishedContent => Boolean(item));
    return normalized.length ? normalized : fallbackPublishedContent(kind);
  } catch {
    return fallbackPublishedContent(kind);
  }
}

export async function getPublishedContentBySlug(kind: PublishingKind, slug: string) {
  const config = publishingConfig[kind];

  try {
    const item = await client.fetch<SanityPublishedContent | null>(
      `*[${publishedFilter()} && slug.current == $slug][0] {
        ${publishedContentFields}
      }`,
      { documentType: config.documentType, mediaType: config.mediaType, slug },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );
    const normalized = item ? normalizePublishedContent(item, kind) : null;
    return normalized || fallbackPublishedContent(kind).find((entry) => entry.slug === slug) || null;
  } catch {
    return fallbackPublishedContent(kind).find((entry) => entry.slug === slug) || null;
  }
}

export async function getPublishedContentSlugs(kind: PublishingKind) {
  const items = await getPublishedContent(kind, 500);
  return items.map((item) => ({ slug: item.slug }));
}

export async function getRelatedPublishedContent(item: PublishedContent, limit = 3) {
  if (item.contentKind === "article") return [];

  const items = await getPublishedContent(item.contentKind, 24);
  return items.filter((candidate) => candidate.slug !== item.slug).slice(0, limit);
}

export function asArticleContent(post: BlogPost): PublishedContent {
  return {
    ...post,
    contentKind: "article",
    contentLabel: "Legal Article",
    hubPath: "/resources/blog"
  };
}

export function getPublishedContentMetadata(content: PublishedContent): Metadata {
  return createMetadata({
    title: content.seo?.title || content.title,
    description: content.seo?.description || content.excerpt,
    path: `${content.hubPath}/${content.slug}`,
    canonicalUrl: content.seo?.canonicalUrl,
    image: content.seo?.openGraphImage || content.image,
    keywords: content.seo?.keywords || content.tags.map((tag) => tag.title),
    noIndex: content.seo?.noIndex,
    type: "article"
  });
}
