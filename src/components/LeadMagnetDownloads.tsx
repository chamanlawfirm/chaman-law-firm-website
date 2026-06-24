import { Download } from "lucide-react";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { leadMagnets } from "@/lib/lead-magnets";

type LeadMagnetDownloadsProps = {
  source: string;
  compact?: boolean;
};

export function LeadMagnetDownloads({ source, compact = false }: LeadMagnetDownloadsProps) {
  return (
    <section className={compact ? "rounded-lg border border-royalGold/16 bg-charcoal p-5" : "rounded-lg border border-royalGold/18 bg-charcoal p-6 sm:p-8"}>
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royalGold text-luxuryBlack">
          <Download size={18} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Free Legal Resources</p>
          <h2 className={compact ? "mt-2 font-heading text-xl font-semibold text-ivory" : "mt-2 font-heading text-3xl font-semibold text-ivory"}>
            Download client-ready guides
          </h2>
          <p className="mt-3 text-sm leading-7 text-ivory/66">
            Get practical Chaman Law Firm checklists for property due diligence, diaspora representation, contract review, debt recovery, probate, and safer legal decisions.
          </p>
        </div>
      </div>
      <div className={compact ? "mt-5 space-y-5" : "mt-6 grid gap-5 lg:grid-cols-2"}>
        {leadMagnets.map((magnet) => (
          <article key={magnet.slug} className="rounded-lg border border-royalGold/12 bg-luxuryBlack p-5">
            <h3 className="font-heading text-xl font-semibold text-ivory">{magnet.title}</h3>
            <p className="mt-3 text-sm leading-7 text-ivory/62">{magnet.description}</p>
            <LeadMagnetForm magnet={magnet} source={`${source} - ${magnet.shortTitle}`} compact />
          </article>
        ))}
      </div>
    </section>
  );
}
