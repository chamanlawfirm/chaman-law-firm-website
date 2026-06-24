import type { ReactNode } from "react";
import { PageHero } from "@/components/PageHero";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalDocument({ eyebrow, title, description, lastUpdated, children }: LegalDocumentProps) {
  return (
    <main>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="bg-luxuryBlack py-16">
        <article className="legal-document mx-auto max-w-4xl px-4 text-ivory/76 sm:px-6 lg:px-8">
          <p className="rounded-md border border-royalGold/18 bg-charcoal p-4 text-sm text-champagne">
            Last updated: {lastUpdated}
          </p>
          {children}
        </article>
      </section>
    </main>
  );
}
