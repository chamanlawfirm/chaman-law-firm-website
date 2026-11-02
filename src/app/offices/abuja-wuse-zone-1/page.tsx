import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/utils";

const path = "/offices/abuja-wuse-zone-1";
const address = "71 Nouakchott Street, Zone 1, Wuse, FCT, Abuja, Nigeria";
const services = [
 { title:"Property transactions and title enquiries", detail:"Discuss property purchases, sale documents, ownership verification and appropriate due-diligence instructions before making a commitment.", url:"/practice-areas/property-real-estate-law" },
 { title:"Corporate agreements and business advice", detail:"Request assistance with contracts, business arrangements, compliance questions and commercial disputes.", url:"/practice-areas/corporate-commercial-law" },
 { title:"Dispute resolution and litigation", detail:"Obtain an initial assessment of a civil dispute and discuss representation or negotiated resolution arrangements.", url:"/practice-areas/litigation-dispute-resolution" },
 { title:"Private-client and estate matters", detail:"Discuss succession, wills, estate documentation and other personal legal matters requiring careful review.", url:"/practice-areas/probate-estate-administration" }
];
const faqs = [
 { q:"Where is the Abuja office?", a:"Our partner-managed Abuja location is at 71 Nouakchott Street, Zone 1, Wuse, FCT, Abuja. Please contact the firm to arrange an appointment before visiting." },
 { q:"How is an Abuja enquiry handled?", a:"The firm coordinates enquiries through its central contact channels and arranges the appropriate lawyer or local partner support for the subject matter. The precise scope is agreed when your instructions are reviewed." },
 { q:"Can I discuss a property purchase before payment?", a:"Yes. Explain the transaction and available documents when booking a consultation. We can advise on the investigations and documentation relevant to the proposed purchase." },
 { q:"Can clients outside Abuja obtain assistance?", a:"Yes. You may begin with a telephone, WhatsApp or online enquiry. Any in-person arrangements will be confirmed directly." }
];

export const metadata: Metadata = createMetadata({
 title:"Law Firm in Wuse Zone 1, Abuja | Chaman Law Firm",
 description:"Visit Chaman Law Firm's partner-managed location at 71 Nouakchott Street, Wuse Zone 1, Abuja. Enquire about property law, commercial agreements and dispute resolution.",
 path
});

export default function AbujaOfficePage() {
 const directions = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);
 return <main>
  <JsonLd data={[
   breadcrumbSchema([{name:"Home",path:"/"},{name:"Contact",path:"/contact"},{name:"Abuja — Wuse Zone 1",path}]),
   {"@context":"https://schema.org","@type":"LegalService","@id":siteConfig.url+path+"#office","name":"Chaman Law Firm — Abuja (Wuse Zone 1)","url":siteConfig.url+path,
    "address":{"@type":"PostalAddress","streetAddress":"71 Nouakchott Street, Zone 1, Wuse","addressLocality":"Abuja","addressRegion":"FCT","addressCountry":"NG"},
    "telephone":siteConfig.phones[0],"email":"chamanlawfirm@gmail.com","parentOrganization":{"@id":siteConfig.url+"/#organization","name":siteConfig.name}}
  ]} />
  <section className="relative isolate overflow-hidden bg-luxuryBlack text-ivory">
   <div className="absolute inset-0 -z-10"><Image src="/images/firm/firm-team.jpg" alt="Chaman Law Firm legal team; firm-wide photograph, not the Abuja office" fill sizes="100vw" priority className="object-cover opacity-25"/><div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/50"/></div>
   <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-royalGold"><MapPin size={16}/>Partner-managed Abuja location</p>
    <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">Law Firm in Wuse Zone 1, Abuja, FCT</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/85">Chaman Law Firm maintains a partner-managed presence in Wuse Zone 1, Abuja. Individuals, families, property buyers and businesses can contact the firm for legal guidance, transaction documentation and assistance with disputes. Enquiries are coordinated with the appropriate legal professionals.</p>
    <div className="mt-8 flex flex-wrap gap-3">
     <Link href="/consultation" className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack hover:bg-champagne">Request consultation <ArrowRight size={16}/></Link>
     <a href={`tel:${siteConfig.phones[0]}`} className="rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold text-ivory hover:border-royalGold">Call our central office</a>
     <a href={whatsappLink("Hello Chaman Law Firm, I am enquiring about legal assistance through the Wuse Zone 1 Abuja location.")} className="rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold text-ivory hover:border-royalGold">WhatsApp Abuja enquiry</a>
    </div>
   </div>
  </section>
  <section className="bg-lightGray py-16 text-ink"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:px-8">
   <div><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Your legal enquiry</p><h2 className="mt-3 font-heading text-3xl font-semibold">Practical legal support for Abuja clients</h2><p className="mt-5 leading-8 text-ink/75">You can begin by describing the legal question, identifying any deadlines and outlining the documents available. We will discuss suitable consultation arrangements, potential next steps and the scope of professional assistance before undertaking work.</p>
    <ul className="mt-6 space-y-3">{["Property buyers seeking independent title and document review","Businesses requiring contracts or commercial advice","Individuals involved in civil or property disputes","Families requiring estate and succession guidance"].map(s=><li key={s} className="flex gap-3 rounded-lg bg-white p-4 text-sm leading-7"><CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18}/>{s}</li>)}</ul>
   </div>
   <aside className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"><Building2 className="text-royalGold"/><h2 className="mt-4 font-heading text-2xl font-semibold">Wuse Zone 1 — Abuja</h2>
    <address className="mt-4 not-italic leading-8 text-ink/75">{address}</address>
    <p className="mt-4 text-sm leading-7 text-ink/70">This location operates through a local partner. Please arrange an appointment with the firm before travelling to the address. The lawyer handling your matter and consultation arrangements will be confirmed directly.</p>
    <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-ink underline decoration-royalGold underline-offset-4">View location on Google Maps <ArrowRight size={16}/></a>
    <p className="mt-5 text-sm text-ink/70">Central telephone: <a className="underline" href={`tel:${siteConfig.phones[0]}`}>+234 806 555 3671</a></p>
    <p className="mt-2 text-sm text-ink/70">Email: <a className="break-all underline" href="mailto:chamanlawfirm@gmail.com">chamanlawfirm@gmail.com</a></p>
   </aside>
  </div></section>
  <section className="bg-luxuryBlack py-16 text-ivory"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Our practice</p><h2 className="mt-3 font-heading text-3xl font-semibold">How the firm can assist</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{services.map(s=><article key={s.title} className="rounded-xl border border-royalGold/20 bg-charcoal p-6 transition-transform duration-200 motion-safe:hover:-translate-y-1"><ShieldCheck className="text-royalGold"/><h3 className="mt-4 font-heading text-xl font-semibold">{s.title}</h3><p className="mt-3 text-sm leading-7 text-ivory/75">{s.detail}</p><Link href={s.url} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">Explore the practice area <ArrowRight size={16}/></Link></article>)}</div></div></section>
  <section className="bg-lightGray py-16 text-ink"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><h2 className="font-heading text-3xl font-semibold">Frequently asked questions</h2><div className="mt-7 space-y-4">{faqs.map(f=><article key={f.q} className="rounded-lg border border-ink/10 bg-white p-6"><h3 className="font-heading text-xl font-semibold">{f.q}</h3><p className="mt-3 text-sm leading-7 text-ink/75">{f.a}</p></article>)}</div><p className="mt-6 text-sm leading-7 text-ink/65">This page provides general information, not advice on any particular legal matter.</p></div></section>
  <ConsultationCTA source="Abuja Wuse Zone 1 partner office" title="Discuss your legal matter in Abuja" description="Contact the firm to agree a suitable consultation and determine the documents and legal assistance relevant to your enquiry." />
 </main>;
}
