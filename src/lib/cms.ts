import { jobOpenings } from "@/data/jobs";
import { properties } from "@/data/properties";
import { services } from "@/data/services";
import { defaultOgImage } from "@/lib/constants";
import type { BlogCategory, BlogPost, BlogPostPage } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

const BLOG_PAGE_SIZE = 12;
const SANITY_REVALIDATE_SECONDS = 60;

const publishedBlogFilter = `_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;

const blogPostFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  "date": coalesce(publishedAt, _createdAt),
  author->{
    name,
    image,
    bio
  },
  "categories": categories[]->{
    title,
    "slug": slug.current,
    description
  },
  mainImage,
  body,
  faqs[]{
    question,
    answer
  },
  seo{
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    noIndex,
    openGraphImage
  }
`;

type SanityBlogPost = {
  _id?: string;
  _updatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  author?: {
    name?: string;
    image?: SanityImageSource & { alt?: string };
    bio?: Array<Record<string, unknown>>;
  };
  categories?: Array<{ title?: string; slug?: string; description?: string } | null>;
  mainImage?: SanityImageSource & { alt?: string };
  body?: Array<Record<string, unknown>>;
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

type SanityBlogPostPage = {
  posts?: SanityBlogPost[];
  total?: number;
};

type BlogPostQueryOptions = {
  limit?: number;
  offset?: number;
  search?: string;
  categorySlug?: string;
  excludeSlug?: string;
};

type BlogPostPageOptions = {
  page?: number;
  pageSize?: number;
  search?: string;
  categorySlug?: string;
};

type SanityBlogCategory = {
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  postCount?: number;
};

export async function getProperties() {
  return properties;
}

export async function getFeaturedProperties() {
  return properties.filter((property) => property.featured);
}

export async function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug) || null;
}

export async function getPropertiesByStatus(status: string) {
  const normalized = status.toLowerCase();
  return properties.filter((property) => property.status.toLowerCase().replace(" ", "-") === normalized);
}

export async function getServices() {
  return services;
}

export async function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug) || null;
}

function imageUrl(source?: SanityImageSource, width = 1200, height = 800) {
  if (!source) {
    return defaultOgImage;
  }

  try {
    return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return defaultOgImage;
  }
}

function sanitizeSearchTerm(search?: string) {
  const normalized = search?.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return undefined;
  }

  return `${normalized}*`;
}

function buildBlogFilter({ search, categorySlug, excludeSlug }: BlogPostQueryOptions = {}) {
  const filters = [publishedBlogFilter];
  const params: Record<string, string> = {};
  const searchTerm = sanitizeSearchTerm(search);

  if (searchTerm) {
    filters.push(
      `(title match $searchTerm || excerpt match $searchTerm || pt::text(body) match $searchTerm || author->name match $searchTerm || categories[]->title match $searchTerm)`
    );
    params.searchTerm = searchTerm;
  }

  if (categorySlug) {
    filters.push(`$categorySlug in categories[]->slug.current`);
    params.categorySlug = categorySlug;
  }

  if (excludeSlug) {
    filters.push(`slug.current != $excludeSlug`);
    params.excludeSlug = excludeSlug;
  }

  return {
    filter: filters.join(" && "),
    params
  };
}

function getPortableTextPlainText(blocks: Array<Record<string, unknown>> = []) {
  return blocks
    .map((block) => {
      const children = Array.isArray(block.children) ? block.children : [];
      return children
        .map((child) => {
          if (child && typeof child === "object" && "text" in child) {
            return String(child.text || "");
          }

          return "";
        })
        .join("");
    })
    .filter(Boolean)
    .join(" ");
}

function readingTimeFor(post: SanityBlogPost) {
  const text = [post.title, post.excerpt, getPortableTextPlainText(post.body)].filter(Boolean).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function normalizeBlogPost(post: SanityBlogPost): BlogPost | null {
  if (!post.slug || !post.title) {
    return null;
  }

  const categories = (post.categories || [])
    .filter((category): category is { title?: string; slug?: string } => Boolean(category?.title))
    .map((category) => ({
      title: category.title || "Property Insights",
      slug: category.slug
    }));
  const category = categories[0]?.title || "Property Insights";
  const excerpt =
    post.excerpt ||
    getPortableTextPlainText(post.body).slice(0, 180) ||
    "Read the latest Chaman Properties insight on verified real estate decisions, property investment, and management.";
  const image = imageUrl(post.mainImage);
  const openGraphImage = post.seo?.openGraphImage ? imageUrl(post.seo.openGraphImage, 1600, 900) : undefined;

  return {
    id: post._id || post.slug,
    slug: post.slug,
    title: post.title,
    excerpt,
    date: post.date || post._updatedAt || new Date().toISOString(),
    updatedAt: post._updatedAt || post.date || new Date().toISOString(),
    author: post.author?.name || "Chaman Properties",
    category,
    categories,
    authorProfile: {
      name: post.author?.name || "Chaman Properties",
      image: post.author?.image ? imageUrl(post.author.image, 320, 320) : undefined,
      imageAlt: post.author?.image?.alt || post.author?.name || "Chaman Properties author",
      bio: post.author?.bio || []
    },
    image,
    imageAlt: post.mainImage?.alt || post.title,
    readingTime: readingTimeFor(post),
    body: post.body || [],
    faqs: post.faqs?.filter((faq) => faq.question && faq.answer).map((faq) => ({
      question: faq.question || "",
      answer: faq.answer || ""
    })),
    seo: {
      title: post.seo?.metaTitle,
      description: post.seo?.metaDescription,
      keywords: post.seo?.keywords,
      canonicalUrl: post.seo?.canonicalUrl,
      openGraphImage,
      noIndex: post.seo?.noIndex
    }
  };
}

function normalizeBlogPosts(posts: SanityBlogPost[] = []) {
  return posts.map(normalizeBlogPost).filter((post): post is BlogPost => Boolean(post));
}

function normalizeBlogCategory(category: SanityBlogCategory): BlogCategory | null {
  if (!category.slug || !category.title) {
    return null;
  }

  return {
    id: category._id || category.slug,
    title: category.title,
    slug: category.slug,
    description: category.description,
    postCount: category.postCount || 0
  };
}

function normalizeBlogCategories(categories: SanityBlogCategory[] = []) {
  return categories.map(normalizeBlogCategory).filter((category): category is BlogCategory => Boolean(category));
}

export async function getBlogPosts({
  limit = BLOG_PAGE_SIZE,
  offset = 0,
  search,
  categorySlug,
  excludeSlug
}: BlogPostQueryOptions = {}) {
  const { filter, params } = buildBlogFilter({ search, categorySlug, excludeSlug });

  try {
    const posts = await client.fetch<SanityBlogPost[]>(
      `*[${filter}] | order(publishedAt desc, _createdAt desc) [$offset...$end] {
        ${blogPostFields}
      }`,
      { ...params, offset, end: offset + limit },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return normalizeBlogPosts(posts);
  } catch (error) {
    console.error("Failed to fetch Sanity blog posts", error);
    return [];
  }
}

export async function getRecentBlogPosts(limit = 3) {
  return getBlogPosts({ limit });
}

export async function getPopularBlogPosts(limit = 5) {
  return getBlogPosts({ limit });
}

export async function getBlogPostsPage({
  page = 1,
  pageSize = BLOG_PAGE_SIZE,
  search,
  categorySlug
}: BlogPostPageOptions = {}): Promise<BlogPostPage> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const offset = (safePage - 1) * safePageSize;
  const { filter, params } = buildBlogFilter({ search, categorySlug });

  try {
    const data = await client.fetch<SanityBlogPostPage>(
      `{
        "posts": *[${filter}] | order(publishedAt desc, _createdAt desc) [$offset...$end] {
          ${blogPostFields}
        },
        "total": count(*[${filter}])
      }`,
      { ...params, offset, end: offset + safePageSize },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );
    const total = data.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));

    return {
      posts: normalizeBlogPosts(data.posts),
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1
    };
  } catch (error) {
    console.error("Failed to fetch paginated Sanity blog posts", error);
    return {
      posts: [],
      total: 0,
      page: safePage,
      pageSize: safePageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: safePage > 1
    };
  }
}

export async function getBlogPostSlugs() {
  try {
    const slugs = await client.fetch<Array<{ slug: string }>>(
      `*[${publishedBlogFilter}] | order(publishedAt desc, _createdAt desc) {
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return slugs.filter((post) => Boolean(post.slug));
  } catch (error) {
    console.error("Failed to fetch Sanity blog slugs", error);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    const categories = await client.fetch<SanityBlogCategory[]>(
      `*[_type == "category" && defined(slug.current)] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description,
        "postCount": count(*[${publishedBlogFilter} && references(^._id)])
      }`,
      {},
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return normalizeBlogCategories(categories).filter((category) => category.postCount > 0);
  } catch (error) {
    console.error("Failed to fetch Sanity blog categories", error);
    return [];
  }
}

export async function getBlogCategoryBySlug(slug: string) {
  try {
    const category = await client.fetch<SanityBlogCategory | null>(
      `*[_type == "category" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        description,
        "postCount": count(*[${publishedBlogFilter} && references(^._id)])
      }`,
      { slug },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return category ? normalizeBlogCategory(category) : null;
  } catch (error) {
    console.error(`Failed to fetch Sanity blog category: ${slug}`, error);
    return null;
  }
}

export async function getBlogCategorySlugs() {
  try {
    const categories = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "category" && defined(slug.current) && count(*[${publishedBlogFilter} && references(^._id)]) > 0] | order(title asc) {
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return categories.filter((category) => Boolean(category.slug));
  } catch (error) {
    console.error("Failed to fetch Sanity blog category slugs", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await client.fetch<SanityBlogPost | null>(
      `*[${publishedBlogFilter} && slug.current == $slug][0] {
        ${blogPostFields}
      }`,
      { slug },
      { next: { revalidate: SANITY_REVALIDATE_SECONDS } }
    );

    return post ? normalizeBlogPost(post) : null;
  } catch (error) {
    console.error(`Failed to fetch Sanity blog post: ${slug}`, error);
    return null;
  }
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const categorySlug = post.categories.find((category) => category.slug)?.slug;

  if (!categorySlug) {
    return getBlogPosts({ limit, excludeSlug: post.slug });
  }

  const related = await getBlogPosts({
    limit,
    categorySlug,
    excludeSlug: post.slug
  });

  if (related.length >= limit) {
    return related;
  }

  const fallback = await getBlogPosts({
    limit: limit - related.length,
    excludeSlug: post.slug
  });
  const seen = new Set(related.map((item) => item.slug));

  return [...related, ...fallback.filter((item) => !seen.has(item.slug))].slice(0, limit);
}

export async function getRecommendedBlogPosts(excludeSlug?: string, limit = 3) {
  return getBlogPosts({ limit, excludeSlug });
}

export async function getBlogSidebarData() {
  const [categories, recentPosts, popularPosts] = await Promise.all([
    getBlogCategories(),
    getRecentBlogPosts(5),
    getPopularBlogPosts(5)
  ]);

  return {
    categories,
    recentPosts,
    popularPosts
  };
}

export async function getJobOpenings() {
  return jobOpenings;
}
