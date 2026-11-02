import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/utils";

const route = "/offices/magodo-gra";
const address = "9 Abayomi Owulade Avenue, Magodo GRA Phase 2, Shangisha, Lagos, Nigeria";
const practices = [
 {title:"Property verification and due diligence",detail:"Buying or investing in property in Magodo or elsewhere in Lagos? We can discuss seller authority, title history, survey documents, searches and relevant transaction risks before a commitment is made.",href:"/practice-areas/property-real-estate-law"},
 {title:"Conveyancing and property documentation",detail:"Seek advice on contracts of sale, deeds of assignment, lease documents, title perfection and the appropriate arrangements for completing a transaction.",href:"/practice-areas/property-real-estate-law"},
 {title:"Landlord and tenant matters",detail:"Discuss tenancy agreements, notices, rental disagreements, recovery of possession and lawful dispute-resolution options.",href:"/landlord-tenant-disputes-nigeria"},
 {title:"Corporate and commercial law",detail:"Obtain help with business agreements, contract drafting and review, corporate arrangements and commercial legal-risk assessment.",href:"/practice-areas/corporate-commercial-law"},
 {title:"Litigation and dispute resolution",detail:"Discuss civil and property-related claims, commercial disputes, pre-action assessment and appropriate settlement or representation pathways.",href:"/practice-areas/litigation-dispute-resolution"},
 {title:"Probate and private-client matters",detail:"Seek advice on wills, succession, letters of administration, family property and the legal documentation relevant to personal matters.",href:"/practice-areas/probate-estate-administration"}
];
const questions = [
 {q:"Does Chaman Law Firm have a physical office in Magodo GRA Phase 2?",a:"Yes. Chaman Law Firm receives clients at 9 Abayomi Owulade Avenue, Magodo GRA Phase 2, Shangisha, Lagos. Please make an appointment before visiting."},
 {q:"Can I ask a lawyer to investigate property documents before paying for land or a house?",a:"Yes. Contact us with the proposed property location and a brief list of the available documents. We will discuss the scope of an appropriate due-diligence instruction."},
 {q:"Can a business or investor arrange a consultation at the Magodo office?",a:"Yes. The office receives clients for legal consultations by prior arrangement. Contact our central telephone number or WhatsApp to agree the appropriate lawyer and appointment."},
 {q:"Do I have to bring original documents?",a:"Please first explain the nature of your matter and what documents you hold. Our team will advise which originals or copies are needed, and how sensitive information should be shared."}
];
export const metadata: Metadata = createMetadata({
 title:"Law Firm in Magodo GRA Phase 2, Lagos",
 description:"Consult Chaman Law Firm at 9 Abayomi Owulade Avenue, Magodo GRA Phase 2, Shangisha, Lagos for property law, due diligence, business contracts and dispute advice.",
 path:route
});
export default function MagodoOfficePage() {
 const maps = "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(address);
 return <main>
 <JsonLd data={[
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Contact",path:"/contact"},{name:"Magodo GRA Phase 2",path:route}]),
  {"@context":"https://schema.org","@type":"LegalService","@id":siteConfig.url+route+"#office","name":"Chaman Law Firm — Magodo GRA Phase 2","url":siteConfig.url+route,
   "address":{"@type":"PostalAddress","streetAddress":"9 Abayomi Owulade Avenue","addressLocality":"Magodo GRA Phase 2, Shangisha","addressRegion":"Lagos","addressCountry":"NG"},
   "telephone":siteConfig.phones[0],"email":"chamanlawfirm@gmail.com","parentOrganization":{"@type":"Organization","name":siteConfig.name,"url":siteConfig.url}}
 ]}/>
 <section className="relative isolate overflow-hidden bg-luxuryBlack text-ivory">
  <div className="absolute inset-0 -z-10"><Image src="/images/firm/firm-office-team.jpg" alt="Chaman Law Firm legal team; firm photograph" fill priority sizes="100vw" className="object-cover opacity-30"/><div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/40"/></div>
  <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
   <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-royalGold"><MapPin size={18}/>Physical client-facing office · Magodo GRA Phase 2</p>
   <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">Law Firm in Magodo GRA Phase 2, Shangisha, Lagos</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/85">Chaman Law Firm receives clients at its Magodo GRA Phase 2 office for legal advice on property transactions, land title verification, business arrangements, disputes and private-client matters. Speak with our team before important commitments and learn what documents and legal steps your matter may require.</p>
   <div className="mt-8 flex flex-wrap gap-3">
    <Link href="/consultation" className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack hover:bg-champagne">Arrange consultation <ArrowRight size={16}/></Link>
    <a href={`tel:${siteConfig.phones[0]}`} className="inline-flex items-center gap-2 rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold text-ivory hover:border-royalGold"><Phone size={16}/>Call Chaman Law Firm</a>
    <a href={whatsappLink("Hello Chaman Law Firm, I would like to arrange a consultation at your Magodo GRA Phase 2 office.")} className="rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold text-ivory hover:border-royalGold">WhatsApp Magodo enquiry</a>
   </div>
  </div>
 </section>
 <section className="bg-lightGray py-16 text-ink"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8">
  <div><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Independent advice before decisions</p><h2 className="mt-3 font-heading text-3xl font-semibold">Helping clients protect their legal interests</h2>
  <p className="mt-5 leading-8 text-ink/75">Property purchasers, landlords, business owners, investors and families frequently need clear advice before signing an agreement, paying a deposit or commencing a dispute. We discuss the facts and documents, identify the legal issues that require investigation and explain a suitable path forward.</p>
  <ul className="mt-6 space-y-3">{["Review of property documents before a purchase","Advice on property and tenancy disputes","Preparation or review of contracts and legal instruments","Initial guidance on probate, family and business matters"].map(s=><li key={s} className="flex gap-3 rounded-lg bg-white p-4 text-sm leading-7 shadow-sm"><CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18}/>{s}</li>)}</ul></div>
  <aside className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"><Building2 className="text-royalGold" size={28}/><h2 className="mt-4 font-heading text-2xl font-semibold">Visit the Magodo office</h2><address className="mt-4 not-italic leading-8 text-ink/75">{address}</address>
   <p className="mt-4 text-sm leading-7 text-ink/70">Magodo GRA Phase 2 is also known as Shangisha. The office receives clients for scheduled legal consultations. Please contact us before visiting so that suitable arrangements can be confirmed.</p>
   <a href={maps} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-ink underline decoration-royalGold underline-offset-4">Find the address on Google Maps <ArrowRight size={16}/></a>
   <p className="mt-5 text-sm text-ink/70">Telephone: <a href={`tel:${siteConfig.phones[0]}`} className="underline">+234 806 555 3671</a></p>
   <p className="mt-2 text-sm text-ink/70">Email: <a href="mailto:chamanlawfirm@gmail.com" className="break-all underline">chamanlawfirm@gmail.com</a></p>
  </aside>
 </div></section>
 <section className="bg-luxuryBlack py-16 text-ivory"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Relevant legal services</p><h2 className="mt-3 font-heading text-3xl font-semibold">How we assist Magodo clients</h2><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{practices.map(p=><article key={p.title} className="rounded-xl border border-royalGold/20 bg-charcoal p-6 transition-transform duration-200 motion-safe:hover:-translate-y-1"><ShieldCheck className="text-royalGold" size={25}/><h3 className="mt-4 font-heading text-xl font-semibold">{p.title}</h3><p className="mt-3 text-sm leading-7 text-ivory/75">{p.detail}</p><Link href={p.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">Explore service <ArrowRight size={16}/></Link></article>)}</div></div></section>
 <section className="bg-lightGray py-16 text-ink"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><h2 className="font-heading text-3xl font-semibold">Preparing for your consultation</h2><p className="mt-5 leading-8 text-ink/75">Please prepare a short account of the matter, names of the relevant parties, any urgent deadlines and the documents you currently have. For a property transaction, these may include the offer, survey plan, title documents or draft agreement. Our team will explain which materials are appropriate to review. Do not send sensitive information to unverified recipients.</p>
 <h2 className="mt-12 font-heading text-3xl font-semibold">Frequently asked questions</h2><div className="mt-7 space-y-4">{questions.map(q=><article key={q.q} className="rounded-lg border border-ink/10 bg-white p-6"><h3 className="font-heading text-xl font-semibold">{q.q}</h3><p className="mt-3 text-sm leading-7 text-ink/75">{q.a}</p></article>)}</div><p className="mt-6 text-sm leading-7 text-ink/65">The information on this page is general and does not replace advice on a specific matter.</p></div></section>
 <ConsultationCTA source="Magodo GRA Phase 2 physical office" title="Arrange a legal consultation in Magodo" description="Speak with the firm about your property transaction, dispute, commercial agreement or private-client matter. We will discuss the appropriate next steps and appointment arrangements."/>
 </main>;
}
