import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublishedContent } from "@/lib/publishing";
import { formatDate } from "@/lib/utils";

function hasMeaningfulDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getUTCFullYear() > 1971;
}

export function PublishedContentCard({ item, priority = false }: { item: PublishedContent; priority?: boolean }) {
  const href = `${item.hubPath}/${item.slug}`;

  return (
    <article className="group overflow-hidden rounded-lg border border-royalGold/18 bg-charcoal transition hover:-translate-y-1 hover:border-royalGold/45">
      <Link href={href} className="block overflow-hidden">
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={720}
          height={450}
          priority={priority}
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-royalGold">
          <span>{item.contentLabel}</span>
          {hasMeaningfulDate(item.date) ? (
            <>
              <span aria-hidden="true">|</span>
              <time dateTime={item.date}>{formatDate(item.date)}</time>
            </>
          ) : null}
        </div>
        <h2 className="mt-4 font-heading text-2xl font-semibold leading-snug text-ivory group-hover:text-royalGold">
          <Link href={href}>{item.title}</Link>
        </h2>
        <p className="mt-4 text-sm leading-7 text-ivory/68">{item.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ivory/58">
            {item.author} · {item.readingTime}
          </p>
          <Link href={href} className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-royalGold hover:text-champagne">
            View <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
