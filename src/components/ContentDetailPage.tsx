import { CalendarDays, Clock3, ExternalLink, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleEngagementStats } from "@/components/ArticleEngagementStats";
import { AuthorBio } from "@/components/AuthorBio";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { PublishedContentCard } from "@/components/PublishedContentCard";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { TableOfContents } from "@/components/TableOfContents";
import { getArticleHeadings } from "@/lib/article";
import type { PublishedContent } from "@/lib/publishing";
import { breadcrumbSchema, faqSchema, publishedContentSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

function hasMeaningfulDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getUTCFullYear() > 1971;
}

export function ContentDetailPage({ content, related }: { content: PublishedContent; related: PublishedContent[] }) {
  const path = `${content.hubPath}/${content.slug}`;
  const headings = getArticleHeadings(content.body);
  const structuredData: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
      { name: content.contentKind === "article" ? "Legal Blog" : content.contentLabel, path: content.hubPath },
      { name: content.title, path }
    ]),
    publishedContentSchema(content)
  ];

  if (content.faqs?.length) structuredData.push(faqSchema(content.faqs));

  return (
    <main>
      <ReadingProgressBar />
      <JsonLd data={structuredData} />
      <article>
        <header className="border-b border-royalGold/15 bg-charcoal">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-sm text-ivory/58">
              <Link href="/" className="hover:text-royalGold">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link href="/resources" className="hover:text-royalGold">Resources</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link href={content.hubPath} className="hover:text-royalGold">
                {content.contentKind === "article" ? "Legal Blog" : content.contentLabel}
              </Link>
            </nav>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-royalGold">{content.contentLabel}</p>
                <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-ivory sm:text-5xl">{content.title}</h1>
                <p className="mt-6 text-lg leading-8 text-ivory/74">{content.excerpt}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-ivory/60">
                  <span>{content.author}</span>
                  {hasMeaningfulDate(content.date) ? (
                    <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-royalGold" />{formatDate(content.date)}</span>
                  ) : null}
                  <span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-royalGold" />{content.readingTime}</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-royalGold/18">
                <Image src={content.image} alt={content.imageAlt} width={1200} height={760} priority className="h-auto w-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="bg-luxuryBlack py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
            <div className="min-w-0 space-y-10">
              {content.mediaUrl ? (
                <section className="rounded-lg border border-royalGold/22 bg-charcoal p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">
                    {content.contentKind === "podcasts" ? "Listen to This Episode" : content.contentKind === "videos" ? "Watch This Video" : "Source Material"}
                  </p>
                  <a
                    href={content.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
                  >
                    Open media <ExternalLink size={16} />
                  </a>
                </section>
              ) : null}

              {content.contentKind === "court-updates" && (content.courtName || content.citation || content.jurisdiction || content.decisionDate) ? (
                <section className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                  <div className="flex items-center gap-3 text-royalGold"><Scale size={20} /><h2 className="font-heading text-2xl font-semibold text-ivory">Case details</h2></div>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {content.courtName ? <div><dt className="text-xs font-bold uppercase tracking-[0.18em] text-royalGold">Court</dt><dd className="mt-1 text-sm text-ivory/72">{content.courtName}</dd></div> : null}
                    {content.citation ? <div><dt className="text-xs font-bold uppercase tracking-[0.18em] text-royalGold">Citation</dt><dd className="mt-1 text-sm text-ivory/72">{content.citation}</dd></div> : null}
                    {content.jurisdiction ? <div><dt className="text-xs font-bold uppercase tracking-[0.18em] text-royalGold">Jurisdiction</dt><dd className="mt-1 text-sm text-ivory/72">{content.jurisdiction}</dd></div> : null}
                    {content.decisionDate ? <div><dt className="text-xs font-bold uppercase tracking-[0.18em] text-royalGold">Decision date</dt><dd className="mt-1 text-sm text-ivory/72">{formatDate(content.decisionDate)}</dd></div> : null}
                  </dl>
                </section>
              ) : null}

              <section aria-label={`${content.contentLabel} content`} className="rounded-lg border border-royalGold/14 bg-charcoal p-6 sm:p-8">
                <PortableTextRenderer value={content.body} />
              </section>

              {content.transcript ? (
                <section className="rounded-lg border border-royalGold/16 bg-charcoal p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Transcript</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-ivory">Full transcript</h2>
                  <div className="mt-6 whitespace-pre-line text-base leading-8 text-ivory/74">{content.transcript}</div>
                </section>
              ) : null}

              {content.faqs?.length ? (
                <section>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Frequently Asked Questions</p>
                  <h2 className="mt-3 font-heading text-3xl font-semibold text-ivory">Questions related to this publication</h2>
                  <div className="mt-6"><FaqList faqs={content.faqs} /></div>
                </section>
              ) : null}

              <AuthorBio post={content} />
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <TableOfContents headings={headings} />
              <ArticleEngagementStats slug={content.slug} />
              <SocialShareButtons title={content.title} path={path} />
            </aside>
          </div>
        </div>

        {related.length ? (
          <section className="bg-charcoal py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Related Content</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-ivory">Continue exploring</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((item) => <PublishedContentCard key={`${item.contentKind}-${item.slug}`} item={item} />)}
              </div>
            </div>
          </section>
        ) : null}
      </article>
      <ConsultationCTA source={`${content.contentLabel} detail page`} />
    </main>
  );
}
