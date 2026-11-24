import { notFound } from "next/navigation";
import { getResearchIndex } from "@/lib/research";
import { createMetadata } from "@/lib/seo";
import { researchPath } from "@/data/research";
import { PaperList, ResearchPage } from "../../ResearchViews";
import styles from "../../research.module.css";

type Props = { params: Promise<{ slug: string }> };

async function getAuthor(params: Props["params"]) {
  const { slug } = await params;
  const papers = (await getResearchIndex()).filter((paper) => paper.authors.some((author) => author.slug === slug));
  const author = papers[0]?.authors.find((item) => item.slug === slug) ?? notFound();
  return { author, papers, path: `${researchPath}/authors/${slug}` };
}

export async function generateMetadata({ params }: Props) {
  const { author, path } = await getAuthor(params);
  return createMetadata({ title: author.name, description: author.bio, path });
}

export default async function AuthorProfile({ params }: Props) {
  const { author, papers, path } = await getAuthor(params);
  return <ResearchPage title={author.name} summary={author.affiliation} trail={[{ name: author.name, path }]}>
    <section className={styles.section}><h2>Profile</h2><p className="max-w-prose whitespace-pre-line">{author.bio}</p></section>
    <section className={styles.section}><h2>Research publications</h2><PaperList papers={papers} empty="No research papers available." /></section>
  </ResearchPage>;
}
