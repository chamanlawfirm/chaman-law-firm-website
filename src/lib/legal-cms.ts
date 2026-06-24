import { lawyers as fallbackLawyers, type Lawyer } from "@/data/lawyers";
import {
  getAllServicePages,
  getPracticeAreaBySlug as getFallbackPracticeAreaBySlug,
  getServicePageBySlug as getFallbackServicePageBySlug,
  practiceAreas as fallbackPracticeAreas,
  type PracticeArea,
  type ServicePage
} from "@/data/practice-areas";
import {
  approvedTestimonials,
  careerPaths,
  downloadResources,
  mediaItems,
  type CareerPath,
  type DownloadResource,
  type MediaItem
} from "@/data/resources";
import { globalFaqs, homepageContent, officeLocations } from "@/data/site-content";
import type { Faq } from "@/lib/types";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

const SANITY_REVALIDATE_SECONDS = 60;

type SanitySeo = {
  keywords?: string[];
  aeoKeywords?: string[];
  geoKeywords?: string[];
};

type SanityPracticeArea = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  services?: string[];
  servicePages?: ServicePage[];
  commonIssues?: string[];
  whoWeHelp?: string[];
  process?: string[];
  faqs?: Faq[];
  relatedDownloads?: string[];
  seo?: SanitySeo;
};

type SanityLawyer = {
  name?: string;
  slug?: string;
  photo?: SanityImageSource;
  position?: string;
  summary?: string;
  biographyText?: string[];
  qualifications?: string[];
  memberships?: string[];
  awards?: string[];
  experience?: string[];
  publicationsText?: string[];
  mediaAppearances?: string[];
  philosophy?: string;
};

type SanityDownload = {
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  relatedPracticeAreas?: Array<{ slug?: string } | null>;
};

type SanityTestimonial = {
  clientName?: string;
  location?: string;
  review?: string;
  rating?: number;
  approvalStatus?: "approved" | "pending";
  practiceArea?: {
    title?: string;
  };
};

type SanityFaq = {
  question?: string;
  answer?: string;
  category?: string;
};

type SanityOfficeLocation = {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapLink?: string;
};

type SanityMediaItem = {
  title?: string;
  slug?: string;
  type?: MediaItem["type"];
  description?: string;
  channel?: string;
};

type SanityCareerPath = {
  title?: string;
  slug?: string;
  department?: string;
  location?: string;
  type?: string;
  summary?: string;
  requirements?: string[];
};

async function safeFetch<T>(query: string, params: Record<string, string> = {}) {
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: SANITY_REVALIDATE_SECONDS } });
  } catch (error) {
    console.error("Sanity content fetch failed; using approved fallback content.", error);
    return null;
  }
}

function imageUrl(source?: SanityImageSource, width = 900, height = 1100) {
  if (!source) {
    return undefined;
  }

  try {
    return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return undefined;
  }
}

function normalizePracticeArea(area: SanityPracticeArea): PracticeArea | null {
  if (!area.slug || !area.title) {
    return null;
  }

  const fallback = getFallbackPracticeAreaBySlug(area.slug);

  return {
    slug: area.slug,
    title: area.title,
    shortTitle: fallback?.shortTitle || area.title,
    eyebrow: fallback?.eyebrow || "Practice Area",
    summary: area.summary || fallback?.summary || "",
    description: area.description || fallback?.description || area.summary || "",
    services: area.services?.length ? area.services : fallback?.services || [],
    servicePages: area.servicePages?.length ? area.servicePages : fallback?.servicePages || [],
    commonIssues: area.commonIssues?.length ? area.commonIssues : fallback?.commonIssues || [],
    whoWeHelp: area.whoWeHelp?.length ? area.whoWeHelp : fallback?.whoWeHelp || [],
    process: area.process?.length ? area.process : fallback?.process || [],
    faqs: area.faqs?.length ? area.faqs : fallback?.faqs || [],
    relatedDownloads: area.relatedDownloads?.length ? area.relatedDownloads : fallback?.relatedDownloads || [],
    seoKeywords: [
      ...(area.seo?.keywords || []),
      ...(area.seo?.aeoKeywords || []),
      ...(area.seo?.geoKeywords || []),
      ...(fallback?.seoKeywords || [])
    ],
    featured: fallback?.featured ?? true
  };
}

function normalizeLawyer(lawyer: SanityLawyer): Lawyer | null {
  if (!lawyer.slug || !lawyer.name) {
    return null;
  }

  const fallback = fallbackLawyers.find((item) => item.slug === lawyer.slug);

  return {
    slug: lawyer.slug,
    name: lawyer.name,
    position: lawyer.position || fallback?.position || "Lawyer",
    credentials: lawyer.qualifications?.length ? lawyer.qualifications : fallback?.credentials || [],
    summary: lawyer.summary || fallback?.summary || "",
    biography: lawyer.biographyText?.length ? lawyer.biographyText : fallback?.biography || [],
    practiceAreas: fallback?.practiceAreas || fallbackPracticeAreas.map((area) => area.title),
    memberships: lawyer.memberships?.length ? lawyer.memberships : fallback?.memberships || [],
    admissions: fallback?.admissions || ["Nigerian Bar"],
    experience: lawyer.experience?.length ? lawyer.experience : fallback?.experience || [],
    publications: lawyer.publicationsText?.length ? lawyer.publicationsText : fallback?.publications || [],
    mediaFeatures: lawyer.mediaAppearances?.length ? lawyer.mediaAppearances : fallback?.mediaFeatures || [],
    awards: lawyer.awards?.length ? lawyer.awards : fallback?.awards || [],
    philosophy: lawyer.philosophy || fallback?.philosophy || "",
    image: imageUrl(lawyer.photo) || fallback?.image || ""
  };
}

function normalizeDownload(download: SanityDownload): DownloadResource | null {
  if (!download.slug || !download.title) {
    return null;
  }

  const fallback = downloadResources.find((item) => item.slug === download.slug);

  return {
    slug: download.slug,
    title: download.title,
    category: download.category || fallback?.category || "Legal Resource",
    description: download.description || fallback?.description || "",
    cta: fallback?.cta || "Download Resource",
    downloadPath: fallback?.downloadPath,
    placeholder: fallback?.placeholder,
    relatedPracticeAreas:
      download.relatedPracticeAreas?.map((area) => area?.slug).filter((slug): slug is string => Boolean(slug)) ||
      fallback?.relatedPracticeAreas ||
      []
  };
}

export async function getHomepageContent() {
  const data = await safeFetch<{
    heroEyebrow?: string;
    heroTitle?: string;
    heroCopy?: string;
    trustIndicators?: Array<{ label?: string; description?: string }>;
  }>(
    `*[_type == "homepage"][0]{
      heroEyebrow,
      heroTitle,
      heroCopy,
      trustIndicators[]{label, description}
    }`
  );

  if (!data) {
    return homepageContent;
  }

  return {
    ...homepageContent,
    hero: {
      ...homepageContent.hero,
      eyebrow: data.heroEyebrow || homepageContent.hero.eyebrow,
      title: data.heroTitle || homepageContent.hero.title,
      copy: data.heroCopy || homepageContent.hero.copy
    },
    trustIndicators:
      data.trustIndicators?.map((item) => ({
        title: item.label || "",
        text: item.description || ""
      })).filter((item) => item.title && item.text) || homepageContent.trustIndicators
  };
}

export async function getPracticeAreas() {
  const data = await safeFetch<SanityPracticeArea[]>(
    `*[_type == "practiceArea" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      summary,
      description,
      services,
      servicePages[]{
        title,
        "slug": slug.current,
        summary,
        description,
        keyPoints,
        process,
        faqs[]{question, answer}
      },
      commonIssues,
      whoWeHelp,
      process,
      faqs[]{question, answer},
      relatedDownloads,
      seo{keywords, aeoKeywords, geoKeywords}
    }`
  );
  const normalized = data?.map(normalizePracticeArea).filter((area): area is PracticeArea => Boolean(area)) || [];

  return normalized.length ? normalized : fallbackPracticeAreas;
}

export async function getPracticeAreaBySlug(slug: string) {
  const data = await safeFetch<SanityPracticeArea | null>(
    `*[_type == "practiceArea" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      summary,
      description,
      services,
      servicePages[]{
        title,
        "slug": slug.current,
        summary,
        description,
        keyPoints,
        process,
        faqs[]{question, answer}
      },
      commonIssues,
      whoWeHelp,
      process,
      faqs[]{question, answer},
      relatedDownloads,
      seo{keywords, aeoKeywords, geoKeywords}
    }`,
    { slug }
  );

  return data ? normalizePracticeArea(data) : getFallbackPracticeAreaBySlug(slug);
}

export async function getServicePageBySlug(areaSlug: string, serviceSlug: string) {
  const area = await getPracticeAreaBySlug(areaSlug);

  return area?.servicePages.find((service) => service.slug === serviceSlug) || getFallbackServicePageBySlug(areaSlug, serviceSlug);
}

export async function getAllPracticeServicePages() {
  const areas = await getPracticeAreas();

  if (!areas.length) {
    return getAllServicePages();
  }

  return areas.flatMap((area) => area.servicePages.map((service) => ({ area, service })));
}

export async function getLawyers() {
  const data = await safeFetch<SanityLawyer[]>(
    `*[_type == "lawyer" && defined(slug.current)] | order(featured desc, name asc) {
      name,
      "slug": slug.current,
      photo,
      position,
      summary,
      "biographyText": biography[_type == "block"].children[].text,
      qualifications,
      memberships,
      awards,
      experience,
      publicationsText,
      mediaAppearances,
      philosophy
    }`
  );
  const normalized = data?.map(normalizeLawyer).filter((lawyer): lawyer is Lawyer => Boolean(lawyer)) || [];
  const cmsBySlug = new Map(normalized.map((lawyer) => [lawyer.slug, lawyer]));
  const approvedProfiles = fallbackLawyers.map((lawyer) => cmsBySlug.get(lawyer.slug) || lawyer);
  const approvedSlugs = new Set(fallbackLawyers.map((lawyer) => lawyer.slug));
  const cmsOnlyProfiles = normalized.filter((lawyer) => !approvedSlugs.has(lawyer.slug));

  return [...approvedProfiles, ...cmsOnlyProfiles];
}

export async function getLawyerBySlug(slug: string) {
  const data = await safeFetch<SanityLawyer | null>(
    `*[_type == "lawyer" && slug.current == $slug][0] {
      name,
      "slug": slug.current,
      photo,
      position,
      summary,
      "biographyText": biography[_type == "block"].children[].text,
      qualifications,
      memberships,
      awards,
      experience,
      publicationsText,
      mediaAppearances,
      philosophy
    }`,
    { slug }
  );

  return data ? normalizeLawyer(data) : fallbackLawyers.find((lawyer) => lawyer.slug === slug) || null;
}

export async function getDownloads() {
  const data = await safeFetch<SanityDownload[]>(
    `*[_type == "download" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      description,
      category,
      relatedPracticeAreas[]->{ "slug": slug.current }
    }`
  );
  const normalized = data?.map(normalizeDownload).filter((download): download is DownloadResource => Boolean(download)) || [];

  return normalized.length ? normalized : downloadResources;
}

export async function getTestimonials() {
  const data = await safeFetch<SanityTestimonial[]>(
    `*[_type == "testimonial" && approvalStatus == "approved"] | order(_createdAt desc) {
      clientName,
      location,
      review,
      rating,
      approvalStatus,
      practiceArea->{title}
    }`
  );
  const normalized =
    data?.filter((item) => item.clientName && item.review).map((item) => ({
      clientName: item.clientName || "Client",
      location: item.location || "Nigeria",
      practiceArea: item.practiceArea?.title || "Legal Services",
      review: item.review || "",
      rating: item.rating,
      approvalStatus: item.approvalStatus || "approved"
    })) || [];

  return normalized.length ? normalized : approvedTestimonials;
}

export async function getFaqs(category?: string) {
  const data = await safeFetch<SanityFaq[]>(
    `*[_type == "faq" ${category ? "&& category == $category" : ""}] | order(order asc, question asc) {
      question,
      answer,
      category
    }`,
    category ? { category } : {}
  );
  const normalized = data?.filter((faq) => faq.question && faq.answer).map((faq) => ({
    question: faq.question || "",
    answer: faq.answer || ""
  })) || [];

  return normalized.length ? normalized : globalFaqs;
}

export async function getOfficeLocations() {
  const data = await safeFetch<SanityOfficeLocation[]>(
    `*[_type == "officeLocation"] | order(name asc) {
      name,
      address,
      phone,
      email,
      mapLink
    }`
  );
  const normalized =
    data?.filter((office) => office.name && office.address).map((office) => ({
      name: office.name || "",
      address: office.address || "",
      mapQuery: office.mapLink || office.address || "",
      phone: office.phone,
      email: office.email
    })) || [];

  return normalized.length ? normalized : officeLocations;
}

export async function getMediaItems() {
  const data = await safeFetch<SanityMediaItem[]>(
    `*[_type == "mediaItem" || _type in ["podcast", "video", "legalNews", "courtUpdate", "webinar"]] | order(coalesce(publishedAt, _createdAt) desc) [0...12] {
      title,
      "slug": slug.current,
      "type": select(_type == "mediaItem" => type, _type == "podcast" => "Podcast", _type == "video" => "Video", _type == "courtUpdate" => "Court Update", _type == "webinar" => "Webinar", "News"),
      "description": coalesce(summary, description, excerpt),
      channel
    }`
  );
  const normalized =
    data?.filter((item) => item.title && item.slug).map((item) => ({
      slug: item.slug || "",
      title: item.title || "",
      type: item.type || "News",
      description: item.description || "",
      channel: item.channel,
      status: "published" as const
    })) || [];

  return normalized.length ? normalized : mediaItems;
}

export async function getCareerPaths(): Promise<CareerPath[]> {
  const data = await safeFetch<SanityCareerPath[]>(
    `*[_type == "careerPath" && defined(slug.current)] | order(order asc, title asc) {
      title,
      "slug": slug.current,
      department,
      location,
      type,
      summary,
      requirements
    }`
  );
  const normalized =
    data?.filter((item) => item.title && item.slug).map((item) => ({
      slug: item.slug || "",
      title: item.title || "",
      department: item.department || "Legal",
      location: item.location || "Lagos / Ogun",
      type: item.type || "Career Interest",
      summary: item.summary || "",
      requirements: item.requirements?.length ? item.requirements : []
    })) || [];

  return normalized.length ? normalized : careerPaths;
}
