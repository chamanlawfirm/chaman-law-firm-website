import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group rounded-lg border border-royalGold/18 bg-charcoal p-6 transition hover:-translate-y-1 hover:border-royalGold/45 hover:shadow-gold"
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">{service.eyebrow}</p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-heading text-2xl font-semibold leading-snug text-ivory">{service.title}</h3>
        <ArrowUpRight className="shrink-0 text-royalGold transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <p className="mt-4 text-sm leading-7 text-ivory/68">{service.summary}</p>
    </Link>
  );
}
