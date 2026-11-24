import { notFound } from "next/navigation";
import { getResearchIndex } from "@/lib/research";
import { createMetadata } from "@/lib/seo";
import { disciplines, researchPath } from "@/data/research";
import { PaperList, ResearchPage } from "../../ResearchViews";
import styles from "../../research.module.css";

type Props = { params: Promise<{ discipline: string }> };

async function getDiscipline(params: Props["params"]) {
  const { discipline } = await params;
  return disciplines.find((item) => item.id === discipline) ?? notFound();
}

export async function generateMetadata({ params }: Props) {
  const item = await getDiscipline(params);
  return createMetadata({ title: item.title, description: item.summary, path: `${researchPath}/categories/${item.id}` });
}

export default async function ResearchCategory({ params }: Props) {
  const item = await getDiscipline(params);
  const papers = (await getResearchIndex()).filter((paper) => paper.discipline === item.id);
  return <ResearchPage title={item.title} summary={item.summary} trail={[{ name: item.title, path: `${researchPath}/categories/${item.id}` }]}>
    <section className={styles.section}><h2>Research publications</h2><PaperList papers={papers} empty="No research papers have been released in this discipline yet." /></section>
  </ResearchPage>;
}
