import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata, resolveCanonicalUrl } from "@/lib/seo";
import { citations, getResearchIndex, getResearchPaper, paperPath, researchDate } from "@/lib/research";
import { disciplines, researchInstitution, researchPath } from "@/data/research";
import { ResearchPage } from "../../ResearchViews";
import { PaperTools } from "../../PaperTools";
import styles from "../../research.module.css";

type Props = { params: Promise<{ slug: string }> };

async function paperFor(params: Props["params"]) {
  return await getResearchPaper((await params).slug) ?? notFound();
}

function pdfPath(slug: string) {
  return `${paperPath(slug)}/paper.pdf`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = await paperFor(params);
  return {
    ...createMetadata({
      title: paper.seoTitle || paper.title, description: paper.seoDescription || paper.abstract,
      path: paperPath(paper.slug), image: paper.featuredImage, keywords: paper.keywords, canonicalUrl: paper.canonicalUrl, type: "article",
    }),
    authors: paper.authors.map((author) => ({name: author.name, url: `${researchPath}/authors/${author.slug}`})),
    other: {
      citation_title: paper.title,
      citation_author: paper.authors.map((item) => item.name),
      citation_publication_date: paper.publishedAt.slice(0, 10).replaceAll("-", "/"),
      citation_pdf_url: resolveCanonicalUrl(pdfPath(paper.slug)),
      citation_language: "en",
    },
  };
}

function Paragraphs({ text, footnoteCount, section }: { text: string; footnoteCount: number; section: string }) {
  return text.split(/\n\s*\n/).map((paragraph, paragraphIndex) =>
    <p key={paragraphIndex}>{paragraph.split(/(\[\d+\]|\*[^*]+\*)/).map((part, partIndex) => {
      const number = /^\[(\d+)\]$/.exec(part)?.[1];
      if (part.startsWith("*") && part.endsWith("*")) return <em key={partIndex}>{part.slice(1, -1)}</em>;
      if (!number || Number(number) < 1 || Number(number) > footnoteCount) return part;
      return <sup key={partIndex}><a id={`ref-${section}-${paragraphIndex}-${partIndex}`} href={`#note-${number}`} aria-label={`Footnote ${number}`}>{part}</a></sup>;
    })}</p>,
  );
}

export default async function Paper({ params }: Props) {
  const paper = await paperFor(params);
  const path = paperPath(paper.slug);
  const canonical = resolveCanonicalUrl(path, paper.canonicalUrl);
  const discipline = disciplines.find((item) => item.id === paper.discipline);
  const related = paper.related?.length ? paper.related : (await getResearchIndex())
    .filter((item) => item.discipline === paper.discipline && item.slug !== paper.slug).slice(0, 3);
  const footnoteCount = paper.footnotes?.length ?? 0;
  const referenceLists = [
    { heading: "Judicial authorities", entries: paper.judicialAuthorities },
    { heading: "Legislation and regulations", entries: paper.legislation },
    { heading: "Academic references", entries: paper.academicReferences },
    { heading: "External publications", entries: paper.externalPublications },
  ];
  return (
    <ResearchPage title={paper.title} summary={paper.subtitle} trail={[
      ...(discipline ? [{ name: discipline.title, path: `${researchPath}/categories/${discipline.id}` }] : []),
      { name: paper.title, path },
    ]}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": ["ScholarlyArticle", "Article"], headline: paper.title,
        abstract: paper.abstract, description: paper.abstract, url: canonical, mainEntityOfPage: canonical,
        identifier: paper.researchId, datePublished: paper.publishedAt, dateModified: paper.updatedAt, inLanguage: "en",
        keywords: paper.keywords, articleSection: discipline?.title, wordCount: paper.wordCount, image: paper.featuredImage,
        author: paper.authors.map((item) => ({ "@type": item.institutional ? "Organization" : "Person", name: item.name, url: resolveCanonicalUrl(`${researchPath}/authors/${item.slug}`) })),
        publisher: { "@type": "Organization", name: researchInstitution, url: resolveCanonicalUrl(researchPath) },
        encoding: { "@type": "MediaObject", contentUrl: resolveCanonicalUrl(pdfPath(paper.slug)), encodingFormat: "application/pdf" },
      }} />
      <article id="research-paper" className={`${styles.article} ${styles.section}`}>
        <p>{paper.authors.map((item, index) => <span key={item.slug}>{index > 0 && ", "}<Link href={`${researchPath}/authors/${item.slug}`}>{item.name}</Link></span>)}</p>
        {paper.affiliation && <p>{paper.affiliation}</p>}
        <p>{paper.researchId} · Published <time dateTime={paper.publishedAt}>{researchDate(paper.publishedAt)}</time>
          {paper.reviewedAt && <> · Reviewed <time dateTime={paper.reviewedAt}>{researchDate(paper.reviewedAt)}</time></>}
          {paper.readingMinutes && <> · {paper.readingMinutes} min read</>}</p>
        <PaperTools citations={citations(paper, canonical)} url={canonical} pdf={pdfPath(paper.slug)} />
        <h2 id="abstract">Abstract</h2>
        <Paragraphs text={paper.abstract} footnoteCount={footnoteCount} section="abstract" />
        {!!paper.keywords.length && <p><strong>Keywords</strong> {paper.keywords.join(" · ")}</p>}
        {!!paper.jurisdictions?.length && <p><strong>Jurisdictions</strong> {paper.jurisdictions.join(" · ")}</p>}
        <nav className={styles.card} aria-label="Table of contents">
          <h2>Contents</h2>
          <ol>
            <li><a href="#methodology">Research methodology</a></li>
            {paper.sections.map((item) => <li key={item._key}><a href={`#section-${item._key}`}>{item.heading}</a></li>)}
            {paper.findings && <li><a href="#findings">Research findings</a></li>}
            {paper.recommendations && <li><a href="#recommendations">Recommendations</a></li>}
            {!!footnoteCount && <li><a href="#footnotes">Footnotes</a></li>}
          </ol>
        </nav>
        <h2 className="mt-9" id="methodology">Research methodology</h2>
        <Paragraphs text={paper.methodology} footnoteCount={footnoteCount} section="methodology" />
        {paper.sections.map((item) => <section key={item._key}><h2 id={`section-${item._key}`}>{item.heading}</h2><Paragraphs text={item.text} footnoteCount={footnoteCount} section={item._key} /></section>)}
        {paper.findings && <section><h2 id="findings">Research findings</h2><Paragraphs text={paper.findings} footnoteCount={footnoteCount} section="findings" /></section>}
        {paper.recommendations && <section><h2 id="recommendations">Recommendations</h2><Paragraphs text={paper.recommendations} footnoteCount={footnoteCount} section="recommendations" /></section>}
        {!!footnoteCount && <section><h2 id="footnotes">Footnotes</h2><ol>{paper.footnotes?.map((note, index) =>
          <li key={note._key} id={`note-${index + 1}`}>{note.url ? <a href={note.url}>{note.citation}</a> : note.citation}</li>)}</ol></section>}
        {referenceLists.map(({ heading, entries }) => entries?.length ? <section className="mt-7" key={heading}><h2>{heading}</h2><ul>{entries.map((entry) => <li key={entry._key}><a href={entry.url}>{entry.label}</a></li>)}</ul></section> : null)}
        {!!paper.bibliography?.length && <section className="mt-7"><h2>Bibliography</h2><ul>{paper.bibliography.map((entry) => <li key={entry}>{entry}</li>)}</ul></section>}
        {!!paper.revisions?.length && <section className="mt-7"><h2>Corrections and revision history</h2><ul>{paper.revisions.map((entry) => <li key={entry._key}><time dateTime={entry.date}>{researchDate(entry.date)}</time> · {entry.note}</li>)}</ul></section>}
        <p>{paper.rights}</p>
        {!!related.length && <section><h2>Related research</h2><ul>{related.map((entry) => <li key={entry.slug}><Link href={paperPath(entry.slug)}>{entry.title}</Link></li>)}</ul></section>}
      </article>
    </ResearchPage>
  );
}
