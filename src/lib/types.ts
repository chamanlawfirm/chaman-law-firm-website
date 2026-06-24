export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  highlights: string[];
  faqs: Faq[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt: string;
  author: string;
  category: string;
  categories: Array<{
    title: string;
    slug?: string;
  }>;
  authorProfile: {
    name: string;
    slug?: string;
    image?: string;
    imageAlt?: string;
    bio: Array<Record<string, unknown>>;
  };
  tags: Array<{
    title: string;
    slug: string;
  }>;
  image: string;
  imageAlt: string;
  readingTime: string;
  body: Array<Record<string, unknown>>;
  isFeatured?: boolean;
  isTrending?: boolean;
  isMostRead?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    openGraphImage?: string;
    noIndex?: boolean;
  };
  faqs?: Faq[];
};

export type BlogPostPage = {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  postCount: number;
};

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  imageAlt?: string;
  bio: Array<Record<string, unknown>>;
  postCount: number;
};

export type BlogTag = {
  title: string;
  slug: string;
  postCount: number;
};

export type JobOpening = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
};
