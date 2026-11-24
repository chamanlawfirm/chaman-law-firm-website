"use client";

import { useEffect, useState } from "react";
import styles from "./research.module.css";

export function PaperTools({ citations, url, pdf }: { citations: Record<string, string>; url: string; pdf: string }) {
  const [format, setFormat] = useState("OSCOLA");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("research-paper");
      if (!article) return;
      const { top, height } = article.getBoundingClientRect();
      const proportion = height > 0 ? (window.innerHeight - top) / height : 0;
      setProgress(Math.min(1, Math.max(0, proportion)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(message);
    } catch {
      setStatus("Copy access is unavailable. Select and copy the text manually.");
    }
  }

  return (
    <>
      <div className={styles.actions}>
        <a className={styles.button} href={pdf}>Download PDF</a>
        <button type="button" className={styles.button} onClick={() => window.print()}>Print</button>
        <button type="button" className={styles.button} onClick={() => copy(url, "Publication link copied.")}>Copy share link</button>
        <a className={styles.button} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>Share on LinkedIn</a>
      </div>
      <div className={styles.actions}>
        <label htmlFor="citation-format">Citation style</label>
        <select className={styles.button} id="citation-format" value={format} onChange={(event) => { setFormat(event.target.value); setStatus(""); }}>
          {Object.keys(citations).map((name) => <option key={name}>{name}</option>)}
        </select>
        <button type="button" className={styles.button} onClick={() => copy(citations[format], "Citation copied.")}>Copy citation</button>
      </div>
      <blockquote className={styles.citation}>{citations[format]}</blockquote>
      <p className="text-sm" role="status">{status}</p>
      <progress className={styles.progress} aria-label="Paper reading progress" max={1} value={progress} />
    </>
  );
}
