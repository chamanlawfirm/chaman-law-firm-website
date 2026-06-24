import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";

type ThankYouType = "consultation" | "contact" | "download";

type ThankYouPageProps = {
  searchParams?: Promise<{
    type?: string;
    download?: string;
    ref?: string;
  }>;
};

const pageCopy: Record<ThankYouType, { title: string; description: string; nextSteps: string[] }> = {
  consultation: {
    title: "Consultation Request Received",
    description:
      "Thank you for contacting Chaman Law Firm. The team will review your request and respond through the contact details you provided.",
    nextSteps: [
      "Your enquiry will be reviewed for the right practice-area pathway.",
      "Please keep relevant documents, timelines, and payment records ready where applicable.",
      "For urgent property, court, or deadline-sensitive matters, call or send a WhatsApp message now."
    ]
  },
  contact: {
    title: "Message Received",
    description:
      "Your message has been received. Chaman Law Firm will review the details and follow up through your preferred contact channel.",
    nextSteps: [
      "The team will assess your message and route it to the appropriate person.",
      "If your matter is urgent, use the phone or WhatsApp option below.",
      "You may also review the practice areas while waiting for a response."
    ]
  },
  download: {
    title: "Download Request Received",
    description:
      "Your request has been received. You can access the requested resource below and continue browsing related legal guidance.",
    nextSteps: [
      "Use the download button below to open the requested resource.",
      "Save any questions raised by the checklist or guide for your consultation.",
      "For urgent legal support, contact the firm directly by phone or WhatsApp."
    ]
  }
};

export const metadata: Metadata = createMetadata({
  title: "Request Received",
  description: "Thank you for contacting Chaman Law Firm. Your request has been received and the team will follow up.",
  path: "/thank-you",
  noIndex: true
});

function getThankYouType(type?: string): ThankYouType {
  if (type === "contact" || type === "download") return type;
  return "consultation";
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const type = getThankYouType(params?.type);
  const copy = pageCopy[type];
  const downloadSlug = params?.download?.trim();

  return (
    <main className="bg-luxuryBlack">
      <section className="border-b border-royalGold/15 bg-luxuryBlack py-20 text-ivory">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-royalGold text-luxuryBlack">
            <CheckCircle2 size={28} />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Received</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl">{copy.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ivory/72">{copy.description}</p>
          {params?.ref ? <p className="mt-4 text-sm font-semibold text-champagne">Reference: {params.ref}</p> : null}
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Next Steps</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">What happens now</h2>
            <div className="mt-8 grid gap-4">
              {copy.nextSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg border border-ink/10 bg-white p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royalGold text-sm font-bold text-luxuryBlack">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-7 text-ink/72">{step}</p>
                </div>
              ))}
            </div>
            {type === "download" && downloadSlug ? (
              <Link
                href={`/api/downloads/${downloadSlug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
              >
                Open Requested Download
                <ArrowRight size={17} />
              </Link>
            ) : null}
          </div>

          <aside className="rounded-lg border border-royalGold/20 bg-luxuryBlack p-6 text-ivory">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Urgent Contact</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Need faster support?</h2>
            <p className="mt-4 text-sm leading-7 text-ivory/70">
              For urgent legal deadlines, property risks, court matters, or time-sensitive transactions, contact the
              firm directly.
            </p>
            <div className="mt-6 grid gap-3">
              <a
                href={`tel:${siteConfig.phones[0]}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
              >
                <Phone size={17} />
                Call {siteConfig.phones[0]}
              </a>
              <a
                href={whatsappLink("Hello Chaman Law Firm, I submitted a website request and need urgent support.")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-royalGold/30 px-5 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
              >
                <MessageCircle size={17} />
                WhatsApp the Firm
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/15 px-5 py-3 text-sm font-bold text-ivory transition hover:border-royalGold hover:text-royalGold"
              >
                <Mail size={17} />
                Email {siteConfig.email}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-charcoal py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <Link
            href="/practice-areas"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            View Practice Areas
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-royalGold/30 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
          >
            Browse Resources
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/15 px-6 py-3 text-sm font-bold text-ivory transition hover:border-royalGold hover:text-royalGold"
          >
            Contact Page
          </Link>
        </div>
      </section>
    </main>
  );
}
