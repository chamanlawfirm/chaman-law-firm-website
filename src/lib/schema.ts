import { siteConfig } from "@/lib/constants";
import type { BlogPost, Faq, Property } from "@/lib/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phones[0],
    areaServed: ["Nigeria", "Lagos", "Ogun", "Abuja", "Diaspora Nigerians"],
    address: siteConfig.offices.map((office) => ({
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressCountry: "NG"
    })),
    sameAs: Object.values(siteConfig.socials)
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

export function propertySchema(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: `${siteConfig.url}/properties/${property.slug}`,
    image: property.images,
    description: property.description,
    identifier: property.id,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "NG"
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NGN",
        price: property.price.replace(/[^\d]/g, "") || property.price
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "RealEstateAgent",
        name: siteConfig.name,
        telephone: siteConfig.phones[0]
      }
    }
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
      url: post.authorProfile.slug ? `${siteConfig.url}/authors/${post.authorProfile.slug}` : siteConfig.url
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
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`
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
    industry: "Real Estate",
    occupationalCategory: job.department
  };
}
