import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  Users
} from "lucide-react";
import { CampaignLeadForm } from "@/components/CampaignLeadForm";
import { CampaignTrackedLink } from "@/components/CampaignTrackedLink";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import type { AdCampaign } from "@/data/ad-campaigns";
import { lawyers } from "@/data/lawyers";
import { siteConfig } from "@/lib/constants";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/utils";

type CampaignLandingPageProps = {
  campaign: AdCampaign;
};

function campaignServiceSchema(campaign: AdCampaign) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `${campaign.shortTitle} - ${siteConfig.name}`,
    url: `${siteConfig.url}/${campaign.slug}`,
    description: campaign.metaDescription,
    serviceType: campaign.shortTitle,
    provider: {
      "@type": "LegalService",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phones[0],
      email: siteConfig.email
    },
    areaServed: ["Nigeria", "Lagos State", "Ogun State", "Diaspora Nigerians", "International Clients"],
    audience: campaign.audience.map((audienceType) => ({ "@type": "Audience", audienceType })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${campaign.shortTitle} services`,
      itemListElement: campaign.services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name }
      }))
    }
  };
}

export function CampaignLandingPage({ campaign }: CampaignLandingPageProps) {
  const managingPartner = lawyers[0];
  const phoneHref = `tel:${siteConfig.phones[0].replace(/\s/g, "")}`;
  const whatsappHref = whatsappLink(campaign.whatsappMessage);

  return (
    <main>
      <JsonLd
        data={[
          campaignServiceSchema(campaign),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: campaign.shortTitle, path: `/${campaign.slug}` }
          ]),
          faqSchema(campaign.faqs)
        ]}
      />

      <section className="relative overflow-hidden border-b border-royalGold/20 bg-luxuryBlack">
        <Image src={campaign.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/95 to-luxuryBlack/70" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-royalGold">{campaign.eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight text-ivory sm:text-5xl lg:text-6xl">{campaign.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/78">{campaign.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CampaignTrackedLink
                href="#campaign-enquiry"
                eventName="consultation_click"
                campaign={campaign.slug}
                label="hero_enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
              >
                Request Consultation <ArrowRight size={16} />
              </CampaignTrackedLink>
              <CampaignTrackedLink
                href={whatsappHref}
                eventName="whatsapp_click"
                campaign={campaign.slug}
                label="hero_whatsapp"
                className="inline-flex items-center gap-2 rounded-full border border-royalGold/45 px-6 py-3 text-sm font-bold text-royalGold transition hover:border-royalGold hover:bg-royalGold/10"
              >
                <MessageCircle size={16} /> WhatsApp
              </CampaignTrackedLink>
            </div>
            <div className="mt-9 grid max-w-2xl gap-4 text-sm text-ivory/72 sm:grid-cols-3">
              <div className="flex items-center gap-2"><ShieldCheck className="text-royalGold" size={18} /> Confidential review</div>
              <div className="flex items-center gap-2"><Globe2 className="text-royalGold" size={18} /> Remote instructions</div>
              <div className="flex items-center gap-2"><Scale className="text-royalGold" size={18} /> Nigerian counsel</div>
            </div>
          </div>
          <CampaignLeadForm campaign={campaign.slug} serviceName={campaign.shortTitle} prompt={campaign.formPrompt} />
        </div>
      </section>

      <section className="border-b border-royalGold/15 bg-charcoal py-6">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 text-sm font-semibold text-ivory/72 sm:px-6 md:grid-cols-3 lg:px-8">
          <CampaignTrackedLink href={phoneHref} eventName="phone_click" campaign={campaign.slug} label="trust_phone" className="flex items-center gap-3 hover:text-royalGold">
            <Phone className="text-royalGold" size={18} /> {siteConfig.phones[0]}
          </CampaignTrackedLink>
          <CampaignTrackedLink href={`mailto:${siteConfig.email}`} eventName="email_click" campaign={campaign.slug} label="trust_email" className="flex items-center gap-3 hover:text-royalGold">
            <Mail className="text-royalGold" size={18} /> {siteConfig.email}
          </CampaignTrackedLink>
          <div className="flex items-center gap-3"><MapPin className="text-royalGold" size={18} /> Ikeja, Lagos · Arepo, Ogun</div>
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Who We Support</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Legal support structured around your circumstances</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {campaign.audience.map((item) => (
              <div key={item} className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
                <Users className="text-royalGold" size={22} />
                <p className="mt-4 text-sm font-semibold leading-7 text-ink/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Scope of Assistance</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-ivory sm:text-4xl">What the firm can help you address</h2>
            <p className="mt-5 text-sm leading-7 text-ivory/66">
              The precise engagement is confirmed after conflict checks and an initial review of your facts and documents.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {campaign.services.map((service) => (
              <div key={service} className="flex items-start gap-3 rounded-xl border border-royalGold/16 bg-charcoal p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18} />
                <span className="text-sm font-semibold leading-6 text-ivory/76">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-ink lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-xl border border-red-900/10 bg-red-50 p-7">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-800">Risks to Address Early</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Avoid preventable legal exposure</h2>
            <ul className="mt-6 space-y-4">
              {campaign.risks.map((risk) => (
                <li key={risk} className="flex items-start gap-3 text-sm leading-7 text-ink/72">
                  <ShieldCheck className="mt-1 shrink-0 text-red-800" size={18} /> {risk}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-ink/10 bg-lightGray p-7">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Useful Documents</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Prepare for an efficient review</h2>
            <ul className="mt-6 space-y-4">
              {campaign.documents.map((document) => (
                <li key={document} className="flex items-start gap-3 text-sm leading-7 text-ink/72">
                  <FileCheck2 className="mt-1 shrink-0 text-royalGold" size={18} /> {document}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Engagement Process</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-ivory sm:text-4xl">A clear path from enquiry to action</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {campaign.process.map((step, index) => (
              <div key={step} className="rounded-xl border border-royalGold/16 bg-luxuryBlack p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royalGold text-sm font-bold text-luxuryBlack">{index + 1}</span>
                <p className="mt-5 text-sm font-semibold leading-7 text-ivory/74">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-lightGray py-16 text-ink lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-8">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl border border-royalGold/25 bg-charcoal shadow-gold">
            <Image src={managingPartner.image} alt={`${managingPartner.name}, Managing Partner of Chaman Law Firm`} fill sizes="(max-width: 1024px) 384px, 28vw" className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Professional Leadership</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Led by {managingPartner.name}, Esq.</h2>
            <p className="mt-3 font-semibold text-ink/70">{managingPartner.position} · {managingPartner.credentials.join(" · ")}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-ink/70">{managingPartner.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/lawyers/${managingPartner.slug}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-charcoal">
                View Professional Profile <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-bold text-ink hover:border-royalGold hover:text-royalGold">
                About the Firm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-ink lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Frequently Asked Questions</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Important points before you proceed</h2>
          </div>
          <div className="mt-10"><FaqList faqs={campaign.faqs} /></div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <ClipboardCheck className="mx-auto text-royalGold" size={30} />
          <h2 className="mt-5 font-heading text-3xl font-semibold text-ivory sm:text-4xl">Ready to discuss your matter?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ivory/68">Send a confidential enquiry, call the office or use WhatsApp. The firm will review the request and confirm the appropriate consultation or engagement pathway.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CampaignTrackedLink href="#campaign-enquiry" eventName="consultation_click" campaign={campaign.slug} label="final_enquiry" className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack hover:bg-champagne">
              Request Consultation <ArrowRight size={16} />
            </CampaignTrackedLink>
            <CampaignTrackedLink href={whatsappHref} eventName="whatsapp_click" campaign={campaign.slug} label="final_whatsapp" className="inline-flex items-center gap-2 rounded-full border border-royalGold/45 px-6 py-3 text-sm font-bold text-royalGold hover:bg-royalGold/10">
              <MessageCircle size={16} /> WhatsApp
            </CampaignTrackedLink>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-xs leading-6 text-ivory/45">
            This page provides general information and does not constitute legal advice or guarantee an outcome. Advice and representation depend on conflict checks, document review, applicable law and a written engagement.
          </p>
        </div>
      </section>
    </main>
  );
}
