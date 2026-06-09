export type PropertyStatus = "For Sale" | "For Rent" | "Shortlet" | "Investment";

export type PropertyType =
  | "Detached Duplex"
  | "Semi-Detached Duplex"
  | "Apartment"
  | "Terrace"
  | "Land"
  | "Commercial"
  | "Shortlet";

export type Agent = {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  type: PropertyType;
  price: string;
  location: string;
  city: string;
  state: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  size?: string;
  landSize?: string;
  titleDocuments: string[];
  featuredImage: string;
  images: string[];
  summary: string;
  description: string;
  features: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  investmentNote?: string;
  agent: Agent;
};

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
    image?: string;
    imageAlt?: string;
    bio: Array<Record<string, unknown>>;
  };
  image: string;
  imageAlt: string;
  readingTime: string;
  body: Array<Record<string, unknown>>;
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

export type JobOpening = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
};
