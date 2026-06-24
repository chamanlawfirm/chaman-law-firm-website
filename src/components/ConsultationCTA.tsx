import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

type ConsultationCTAProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  source?: string;
};

export function ConsultationCTA({
  eyebrow = "Need Legal Support?",
  title = "Speak with Chaman Law Firm about your matter",
  description = "Book a consultation, call the firm, or send a WhatsApp message so the right legal pathway can be identified early.",
  source = "Website CTA"
}: ConsultationCTAProps) {
  return (
    <section className="bg-luxuryBlack py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-lg border border-royalGold/20 bg-charcoal p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">{eyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-ivory/70">{description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
            >
              Book Consultation
              <ArrowRight size={17} />
            </Link>
            <a
              href={whatsappLink(`Hello Chaman Law Firm, I need legal support. Source: ${source}`)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-royalGold/30 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phones[0]}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/15 px-6 py-3 text-sm font-bold text-ivory transition hover:border-royalGold hover:text-royalGold"
            >
              <Phone size={17} />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
