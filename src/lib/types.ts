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
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readingTime: string;
  content: string[];
  faqs?: Faq[];
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
