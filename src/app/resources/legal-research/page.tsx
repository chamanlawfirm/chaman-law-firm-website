import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { getResearchIndex } from "@/lib/research";
import { disciplines, researchName, researchPath, researchTypes } from "@/data/research";
import { PaperList, ResearchPage } from "./ResearchViews";
import styles from "./research.module.css";

const description = "Explore the Chaman Law Firm research library for Nigerian and comparative legal scholarship, case analysis and legal policy.";
export const metadata = createMetadata({ title: researchName, description, path: researchPath });

type Query = Record<string, string | string[] | undefined>;

function scalar(value: Query[string]) {
  return typeof value === "string" ? value.trim().slice(0, 180) : "";
}

export default async function LegalResearch({ searchParams }: { searchParams: Promise<Query> }) {
  const [papers, values] = await Promise.all([getResearchIndex(), searchParams]);
  const query = scalar(values.q);
  const discipline = scalar(values.discipline);
  const type = scalar(values.type);
  const author = scalar(values.author);
  const from = scalar(values.from);
  const to = scalar(values.to);
  const terms = query.toLocaleLowerCase("en-NG").split(/\s+/).filter(Boolean);
  const authors = [...new Map(papers.flatMap((paper) => paper.authors).map((entry) => [entry.slug, entry])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));
  const results = papers.filter((paper) => {
    const searchable = [paper.title, paper.abstract, paper.researchId, ...paper.keywords].join(" ").toLocaleLowerCase("en-NG");
    const date = paper.publishedAt.slice(0, 10);
    return terms.every((term) => searchable.includes(term))
      && (!discipline || paper.discipline === discipline)
      && (!type || paper.publicationType === type)
      && (!author || paper.authors.some((entry) => entry.slug === author))
      && (!from || date >= from) && (!to || date <= to);
  });
  const filtered = Boolean(query || discipline || type || author || from || to);

  return (
    <ResearchPage title={researchName} summary="Advancing Legal Scholarship Across Borders." landing>
      <section id="disciplines" className={styles.section}>
        <h2>Research disciplines</h2>
        <div className={styles.grid}>
          {disciplines.map((item) => (
            <Link key={item.id} className={styles.card} href={`${researchPath}/categories/${item.id}`}>
              <h3>{item.title}</h3><p>{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section id="library" className={styles.section}>
        <h2>Legal Research Library</h2>
        <nav className={`${styles.nav} mb-5`} aria-label="Publication collections">
          {researchTypes.map((item) => <Link key={item.value} href={`${researchPath}?type=${item.value}#library`}>{item.title}</Link>)}
        </nav>
        <form className={styles.form} action={`${researchPath}#library`}>
          <label>Search papers<input type="search" name="q" maxLength={180} defaultValue={query} placeholder="Title, keyword or research ID" /></label>
          <label>Discipline<select name="discipline" defaultValue={discipline}><option value="">All disciplines</option>{disciplines.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label>Publication type<select name="type" defaultValue={type}><option value="">All publication types</option>{researchTypes.map((item) => <option key={item.value} value={item.value}>{item.title}</option>)}</select></label>
          <label>Author<select name="author" defaultValue={author}><option value="">All authors</option>{authors.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}</select></label>
          <label>From<input type="date" name="from" defaultValue={from} /></label>
          <label>Through<input type="date" name="to" defaultValue={to} /></label>
          <button className={styles.button} type="submit">Search</button>
        </form>
        {filtered && <p className="my-4">{results.length} {results.length === 1 ? "publication" : "publications"} found. <Link className="underline" href={`${researchPath}#library`}>Clear filters</Link></p>}
        <PaperList papers={results} empty={filtered ? "No publications match these filters." : "No research papers have been released yet."} />
      </section>
      <section id="authors" className={styles.section}>
        <h2>Contributing Authors</h2>
        {authors.length ? <ul className={styles.grid}>{authors.map((entry) => <li key={entry.slug}><Link className={styles.card} href={`${researchPath}/authors/${entry.slug}`}>{entry.name}</Link></li>)}</ul>
          : <p>Author profiles accompany released research.</p>}
      </section>
    </ResearchPage>
  );
}
