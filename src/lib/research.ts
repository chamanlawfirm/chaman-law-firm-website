import "server-only";
import { cache } from "react";
import { publicClient } from "@/sanity/lib/client";
import { researchPath } from "@/data/research";

type ResearchLink = { _key: string; label: string; url: string };

export type ResearchAuthor = {
  name: string; slug: string; affiliation?: string; bio: string; institutional?: boolean;
};

export type ResearchSummary = {
  slug: string; title: string; abstract: string; discipline: string; publicationType: string;
  researchId: string; publishedAt: string; updatedAt: string; keywords: string[];
  authors: ResearchAuthor[]; readingMinutes?: number;
};

export type ResearchPublication = ResearchSummary & {
  subtitle?: string; affiliation?: string; methodology: string; rights: string; reviewedAt?: string;
  sections: { _key: string; heading: string; text: string }[];
  footnotes?: { _key: string; citation: string; url?: string }[];
  revisions?: { _key: string; date: string; note: string }[];
  judicialAuthorities?: ResearchLink[];
  legislation?: ResearchLink[];
  academicReferences?: ResearchLink[];
  externalPublications?: ResearchLink[];
  bibliography?: string[];
  jurisdictions?: string[];
  findings?: string; recommendations?: string; wordCount?: number; pdf: string;
  seoTitle?: string; seoDescription?: string; canonicalUrl?: string; featuredImage?: string;
  suggestedCitation?: string; related?: { slug: string; title: string }[];
};

const researchClient = publicClient.withConfig({useCdn: false});
const options = { next: { revalidate: 300, tags: ["legal-research"] } };
const visible = '_type == "researchPublication" && editorialStatus == "approved" && defined(slug.current) && dateTime(publishedAt) <= dateTime(now()) && defined(pdf.asset->url) && author->verified == true && count(coAuthors[]-> [verified != true]) == 0';
const authorProjection = '{name, "slug": slug.current, affiliation, bio, institutional}';
const summary = `"slug": slug.current, title, abstract, discipline, publicationType, researchId,
 publishedAt, "updatedAt": _updatedAt, "keywords": coalesce(keywords, []), readingMinutes,
 "authors": [author->${authorProjection}] + coalesce(coAuthors[]->${authorProjection}, [])`;

export const getResearchIndex = cache(async () =>
  researchClient.fetch<ResearchSummary[]>(`*[${visible}] | order(publishedAt desc, _id asc) {${summary}}`, {}, options));

export const getResearchPaper = cache(async (slug: string) =>
  researchClient.fetch<ResearchPublication | null>(
    `*[${visible} && slug.current == $slug][0] {
      ${summary}, subtitle, affiliation, methodology, rights, reviewedAt, sections, footnotes, revisions,
      judicialAuthorities, legislation, academicReferences, externalPublications, bibliography, jurisdictions,
      findings, recommendations, wordCount, "pdf": pdf.asset->url, seoTitle, seoDescription, canonicalUrl,
      "featuredImage": featuredImage.asset->url, suggestedCitation,
      "related": relatedPublications[]->[${visible}] { "slug": slug.current, title }
    }`, { slug }, options));

export function researchDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Africa/Lagos" }).format(new Date(value));
}

export function paperPath(slug: string) {
  return `${researchPath}/papers/${slug}`;
}

export function citations(paper: ResearchPublication, url: string) {
  const authors = paper.authors.map((author) => author.name).join(", ");
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(paper.publishedAt));
  return {
    OSCOLA: paper.suggestedCitation || `${authors}, ‘${paper.title}’ (${paper.researchId}, ${year}) <${url}>`,
    APA: `${authors}. (${year}). ${paper.title} (${paper.researchId}). ${url}`,
    Chicago: `${authors}. “${paper.title}.” ${paper.researchId}, ${researchDate(paper.publishedAt)}. ${url}.`,
  };
}
