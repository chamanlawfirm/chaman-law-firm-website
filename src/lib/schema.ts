import { siteConfig } from "@/lib/constants";
import type { BlogPost, Faq } from "@/lib/types";
import type { Lawyer } from "@/data/lawyers";
import type { PracticeArea } from "@/data/practice-areas";
import type { PublishedContent } from "@/lib/publishing";
import { resolveCanonicalUrl } from "@/lib/seo";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LegalService", "LocalBusiness", "Organization"],
    name: siteConfig.name,
    legalName: "Chaman Law Firm",
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phones[0],
    priceRange: "$$",
    image: `${siteConfig.url}/logo.png`,
    logo: `${siteConfig.url}/logo.png`,
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ikeja",
        addressRegion: "Lagos State",
        addressCountry: "NG"
      }
    },
    founder: {
      "@type": "Person",
      name: "Charles Chukwuma Nkwoka",
      jobTitle: "Founder and Managing Partner"
    },
    areaServed: ["Nigeria", "Lagos", "Ogun", "Abuja", "Diaspora Nigerians", "International Clients"],
    knowsAbout: [
      "Property Law",
      "Real Estate Transactions",
      "Corporate Law",
      "Commercial Law",
      "Litigation",
      "Alternative Dispute Resolution",
      "Mediation",
      "Debt Recovery",
      "Employment Law",
      "Family Law",
      "Immigration Law",
      "Probate",
      "Estate Administration",
      "Notary Public Services",
      "Diaspora Legal Services"
    ],
    address: siteConfig.offices.map((office) => ({
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressCountry: "NG"
    })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phones[0],
        contactType: "client enquiries",
        areaServed: "NG",
        availableLanguage: ["English"]
      }
    ],
    sameAs: Object.values(siteConfig.socials)
  };
}

export function legalServiceSchema(area?: PracticeArea) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: area ? `${area.title} - ${siteConfig.name}` : siteConfig.name,
    url: area ? `${siteConfig.url}/practice-areas/${area.slug}` : siteConfig.url,
    description: area?.summary || siteConfig.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    serviceType: area?.title || "Full-service legal services",
    areaServed: ["Nigeria", "Lagos", "Ogun", "Diaspora Nigerians"],
    telephone: siteConfig.phones[0],
    email: siteConfig.email
  };
}

export function attorneySchema(lawyer: Lawyer) {
  return {
    "@context": "https://schema.org",
    "@type": "Attorney",
    name: lawyer.name,
    jobTitle: lawyer.position,
    url: `${siteConfig.url}/lawyers/${lawyer.slug}`,
    image: lawyer.image,
    description: lawyer.summary,
    worksFor: {
      "@type": "LegalService",
      name: siteConfig.name,
      url: siteConfig.url
    },
    knowsAbout: lawyer.practiceAreas,
    honorificSuffix: lawyer.credentials.join(", "),
    memberOf: lawyer.memberships.map((name) => ({
      "@type": "Organization",
      name
    }))
  };
}

export function practiceAreaSchema(area: PracticeArea) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: area.title,
    serviceType: area.title,
    url: `${siteConfig.url}/practice-areas/${area.slug}`,
    description: area.summary,
    provider: {
      "@type": "LegalService",
      name: siteConfig.name,
      url: siteConfig.url
    },
    audience: area.whoWeHelp.map((name) => ({
      "@type": "Audience",
      audienceType: name
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${area.title} services`,
      itemListElement: area.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service
        }
      }))
    }
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`
    }))
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
      image: post.authorProfile.image,
      url: post.authorProfile.slug ? `${siteConfig.url}/lawyers/${post.authorProfile.slug}` : siteConfig.url
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`
      }
    },
    articleSection: post.category,
    keywords: post.seo?.keywords || [...post.categories.map((category) => category.title), ...post.tags.map((tag) => tag.title)],
    mainEntityOfPage: `${siteConfig.url}/resources/blog/${post.slug}`
  };
}

export function publishedContentSchema(content: PublishedContent) {
  if (content.contentKind === "article") {
    return articleSchema(content);
  }

  const url = resolveCanonicalUrl(`${content.hubPath}/${content.slug}`, content.seo?.canonicalUrl);
  const author = {
    "@type": content.authorProfile.slug ? "Person" : "Organization",
    name: content.author,
    ...(content.authorProfile.image ? { image: content.authorProfile.image } : {}),
    ...(content.authorProfile.slug ? { url: `${siteConfig.url}/lawyers/${content.authorProfile.slug}` } : { url: siteConfig.url })
  };
  const publisher = {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`
    }
  };
  const common = {
    "@context": "https://schema.org",
    name: content.title,
    headline: content.title,
    description: content.excerpt,
    url,
    image: content.image,
    datePublished: content.date,
    dateModified: content.updatedAt,
    author,
    publisher,
    keywords: content.seo?.keywords || content.tags.map((tag) => tag.title),
    mainEntityOfPage: url
  };

  if (content.contentKind === "podcasts") {
    return {
      ...common,
      "@type": "PodcastEpisode",
      episodeNumber: content.episodeNumber,
      duration: content.duration,
      associatedMedia: content.mediaUrl
        ? { "@type": "MediaObject", contentUrl: content.mediaUrl }
        : undefined,
      transcript: content.transcript
    };
  }

  if (content.contentKind === "videos") {
    return {
      ...common,
      "@type": "VideoObject",
      thumbnailUrl: content.image,
      uploadDate: content.date,
      duration: content.duration,
      contentUrl: content.mediaUrl,
      transcript: content.transcript
    };
  }

  return {
    ...common,
    "@type": "NewsArticle",
    articleSection: content.contentLabel,
    ...(content.contentKind === "court-updates"
      ? {
          about: [content.courtName, content.citation, content.jurisdiction].filter(Boolean),
          temporalCoverage: content.decisionDate
        }
      : {})
  };
}

export function jobPostingSchema(job: {
  title: string;
  summary: string;
  location: string;
  type: string;
  department: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url
    },
    employmentType: job.type.toUpperCase().replace("-", "_"),
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "NG"
      }
    },
    industry: "Legal Services",
    occupationalCategory: job.department
  };
}
