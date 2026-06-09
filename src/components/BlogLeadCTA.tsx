import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

type BlogLeadCTAProps = {
  source: string;
};

export function BlogLeadCTA({ source }: BlogLeadCTAProps) {
  const message = `Hello ${siteConfig.name}, I read your article and need professional property advice. Source: ${source}`;

  return (
    <section className="rounded-lg border border-royalGold/25 bg-luxuryBlack p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Need Professional Property Advice?</p>
      <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-ivory">Contact Chaman Properties Today.</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/68">
        Speak with our team about property sales, letting, verification, investment opportunities, property management, or diaspora support.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink(message)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
        >
          Book Consultation
          <ArrowRight size={16} />
        </a>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-royalGold/35 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
        >
          Contact Office
        </Link>
      </div>
    </section>
  );
}
