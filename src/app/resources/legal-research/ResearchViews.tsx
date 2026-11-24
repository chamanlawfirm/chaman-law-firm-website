import type { ReactNode } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { disciplines, researchInstitution, researchName, researchPath } from "@/data/research";
import { paperPath, researchDate, type ResearchSummary } from "@/lib/research";
import styles from "./research.module.css";

export function ResearchPage({ title, summary, landing, trail = [], children }: {
  title: string; summary?: string; landing?: boolean; trail?: { name: string; path: string }[]; children: ReactNode;
}) {
  const base = [{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }];
  const trailItems = [...base, { name: researchName, path: researchPath }, ...trail];
  return (
    <main className={styles.shell}>
      <JsonLd data={breadcrumbSchema(trailItems)} />
      <div className={styles.hero}>
        <div className={styles.wrap}>
          <nav className={styles.crumb} aria-label="Breadcrumb">
            {trailItems.map((item, index) => index === trailItems.length - 1
              ? <span key={item.path} aria-current="page">{item.name}</span>
              : <Link key={item.path} href={item.path}>{item.name} /</Link>)}
          </nav>
          <p className={styles.eyebrow}>{researchInstitution}</p>
          <h1>{title}</h1>
          {summary && <p>{summary}</p>}
        </div>
      </div>
      <div className={styles.wrap}>
        <nav className={styles.nav} aria-label="Research navigation">
          <Link href={landing ? "#library" : `${researchPath}#library`}>Research library</Link>
          <Link href={`${researchPath}#disciplines`}>Disciplines</Link>
          <Link href={`${researchPath}#authors`}>Contributing authors</Link>
          <Link href={`${researchPath}/editorial`}>Editorial standards and submissions</Link>
        </nav>
        {children}
      </div>
    </main>
  );
}

export function PaperList({ papers, empty }: { papers: ResearchSummary[]; empty: string }) {
  if (!papers.length) return <p>{empty}</p>;
  return (
    <div className={styles.list}>
      {papers.map((paper) => (
        <article key={paper.slug} className={styles.card}>
          <p className="mb-2 text-sm">{disciplines.find((item) => item.id === paper.discipline)?.title} · <time dateTime={paper.publishedAt}>{researchDate(paper.publishedAt)}</time></p>
          <h3><Link href={paperPath(paper.slug)}>{paper.title}</Link></h3>
          <p className="mb-2 text-sm">{paper.authors.map(({ name }) => name).join(", ")} · {paper.researchId}</p>
          <p>{paper.abstract.split(/\n\n/)[0]}</p>
        </article>
      ))}
    </div>
  );
}
