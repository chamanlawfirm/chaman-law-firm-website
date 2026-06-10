import type { ArticleHeading } from "@/lib/article";

type TableOfContentsProps = {
  headings: ArticleHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 3) {
    return null;
  }

  return (
    <nav aria-label="Article table of contents" className="rounded-lg border border-royalGold/16 bg-luxuryBlack p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Table of Contents</p>
      <ol className="mt-4 space-y-3 text-sm leading-6 text-ivory/66">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : heading.level === 4 ? "pl-8" : undefined}>
            <a href={`#${heading.id}`} className="transition hover:text-royalGold">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
