import { ArrowUpRight, Scale } from "lucide-react";
import Link from "next/link";
import type { PracticeArea } from "@/data/practice-areas";

type PracticeAreaCardProps = {
  area: PracticeArea;
};

export function PracticeAreaCard({ area }: PracticeAreaCardProps) {
  return (
    <Link
      href={`/practice-areas/${area.slug}`}
      className="group block rounded-lg border border-royalGold/16 bg-charcoal p-6 transition hover:-translate-y-1 hover:border-royalGold/45 hover:shadow-gold"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-royalGold/25 text-royalGold">
          <Scale size={20} />
        </span>
        <ArrowUpRight className="text-ivory/45 transition group-hover:text-royalGold" size={19} />
      </div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-royalGold">{area.eyebrow}</p>
      <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight text-ivory">{area.title}</h3>
      <p className="mt-4 text-sm leading-7 text-ivory/68">{area.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {area.services.slice(0, 3).map((service) => (
          <span key={service} className="rounded-full border border-royalGold/14 px-3 py-1 text-xs text-ivory/60">
            {service}
          </span>
        ))}
      </div>
    </Link>
  );
}
