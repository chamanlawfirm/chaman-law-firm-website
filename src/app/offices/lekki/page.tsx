import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, FileCheck2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/utils";

const path = "/offices/lekki";
const officeAddress = "House 44, Road 11, Ikota Villa, Lekki, Lagos, Nigeria";
const services = [
  { title: "Property due diligence and title investigation", description: "Independent legal review may involve the seller's authority, existing title documents, survey plans, land registry enquiries, potential encumbrances and transaction-specific risks. Receiving copies from a seller does not by itself establish good title.", href: "/practice-areas/property-real-estate-law" },
  { title: "Conveyancing, deeds and title perfection", description: "Obtain assistance with sale agreements, deeds of assignment, leases, completion arrangements and advice on Governor's Consent or other applicable title-perfection steps.", href: "/property-verification-nigeria" },
  { title: "Landlord, tenant and development matters", description: "Discuss residential or commercial leases, tenancy documentation, possession disputes and property development or joint-venture agreements.", href: "/landlord-tenant-disputes-nigeria" },
  { title: "Corporate and commercial law", description: "Speak with the firm about business structuring, contracts, company compliance, employment documentation and commercial risk.", href: "/practice-areas/corporate-commercial-law" },
  { title: "Debt recovery and dispute resolution", description: "We can assess available agreements, correspondence, payment records and the options for negotiation, mediation or legal proceedings.", href: "/debt-recovery-nigeria" },
  { title: "Probate, family and private-client advice", description: "Enquire about wills, estate administration, succession matters, family disputes and related legal documentation.", href: "/practice-areas/probate-estate-administration" }
];
const questions = [
  { q: "Where is Chaman Law Firm’s Lekki office?", a: "Our Lekki office is at House 44, Road 11, Ikota Villa, Lekki, Lagos, Nigeria. Call +234 806 555 3671 or email chamanlawfirm@gmail.com to arrange a consultation or visit." },
  { q: "Do you have lawyers physically present in Lekki?", a: "Yes. Chaman Law Firm maintains a physical office in Ikota Villa, Lekki, with lawyers present there. Please contact us before visiting so we can confirm availability and arrange assistance appropriate to your matter." },
  { q: "Is your Lekki office in Lekki Phase 1?", a: "Our Lekki office is at House 44, Road 11, Ikota Villa, Lekki, Lagos. Please use this address when arranging your visit or requesting directions." },
  { q: "Can I consult a property lawyer at your Lekki office?", a: "Yes. Contact the firm to arrange a consultation concerning a property purchase, title investigation, transaction documentation, tenancy issue or property dispute. We will confirm the relevant scope of assistance after reviewing your enquiry." },
  { q: "Can you assist Nigerians abroad with property matters in Lekki?", a: "The firm provides diaspora legal support concerning Nigerian property matters. Contact us with the property details and available documents so we can discuss the required assistance and engagement arrangements." },
  { q: "What should I bring to a consultation?", a: "Bring identification and the documents relevant to your enquiry. For a property matter, these may include available title documents, survey plans, agreements, receipts and correspondence. Contact the firm beforehand for guidance on your particular matter." },
  { q: "How do I book a consultation at the Lekki office?", a: "Call +234 806 555 3671, email chamanlawfirm@gmail.com or use the website’s consultation form and mention the Lekki office." }
];
export const metadata: Metadata = createMetadata({
 title: "Law Firm in Lekki, Lagos",
 description: "Visit Chaman Law Firm at House 44, Road 11, Ikota Villa, Lekki, Lagos. Contact our lawyers for property, business and dispute-related legal assistance.",
 path
});

export default function LekkiOfficePage() {
 const directions = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(officeAddress);
 return <main>
  <JsonLd data={[
   breadcrumbSchema([{name:"Home",path:"/"},{name:"Contact",path:"/contact"},{name:"Lekki — Ikota Villa",path}]),
   {"@context":"https://schema.org","@type":"LegalService","@id":siteConfig.url+path+"#office","name":"Chaman Law Firm — Lekki Office","url":siteConfig.url+path,
     "address":{"@type":"PostalAddress","streetAddress":"House 44, Road 11, Ikota Villa","addressLocality":"Lekki","addressRegion":"Lagos","addressCountry":"NG"},
     "telephone":siteConfig.phones[0],"email":"chamanlawfirm@gmail.com",
     "parentOrganization":{"@type":"Organization","name":siteConfig.name,"url":siteConfig.url}}
  ]}/>
  <section className="relative isolate overflow-hidden bg-luxuryBlack text-ivory">
   <div className="absolute inset-0 -z-10"><Image src="/images/firm/firm-office-team.jpg" alt="Chaman Law Firm team photograph; this image does not depict the Lekki office premises" fill priority sizes="100vw" className="object-cover opacity-30"/><div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/40"/></div>
   <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-royalGold"><MapPin size={17}/>Physical office in Ikota Villa, Lekki</p>
    <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">Lawyers in Lekki, Lagos — Our Ikota Villa Office</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/85">Chaman Law Firm maintains a physical office at House 44, Road 11, Ikota Villa, Lekki, with lawyers present to assist clients by appointment. We advise property purchasers, investors, landlords, developers, businesses, families and Nigerians abroad on legal decisions that deserve careful preparation.</p>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/consultation" className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack hover:bg-champagne">Book a Lekki consultation <ArrowRight size={16}/></Link><a href={`tel:${siteConfig.phones[0]}`} className="inline-flex items-center gap-2 rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold hover:border-royalGold"><Phone size={16}/>Call the firm</a><a href={whatsappLink("Hello Chaman Law Firm, I would like to arrange a legal consultation at the Lekki office, House 44 Road 11 Ikota Villa.")} className="rounded-full border border-ivory/50 px-6 py-3 text-sm font-bold hover:border-royalGold">WhatsApp Lekki office</a></div>
   </div>
  </section>
  <section className="bg-lightGray py-16 text-ink"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:px-8">
   <div><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Legal advice before you commit</p><h2 className="mt-3 font-heading text-3xl font-semibold">A local point of contact for important transactions and disputes</h2><p className="mt-5 leading-8 text-ink/75">Property transactions in Lekki can involve different ownership histories, surveys, approvals, contracts and practical risks. The checks appropriate to each purchase depend on its actual circumstances. Our lawyers can help identify what should be investigated before a buyer, seller or investor becomes legally committed.</p><p className="mt-4 leading-8 text-ink/75">The office also provides a place to discuss business agreements, disputes, tenancy issues, estate matters and the legal steps relevant to your objectives. Specialist assistance can be coordinated with the wider firm where appropriate.</p>
    <ul className="mt-6 space-y-3">{["Discuss your concern with lawyers physically present in Lekki","Understand documents and searches relevant to the matter","Agree the scope and professional fees before formal instructions","Receive guidance on suitable next steps and communication"].map(s=><li key={s} className="flex gap-3 rounded-lg bg-white p-4 text-sm leading-7 shadow-sm"><CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={18}/>{s}</li>)}</ul>
   </div>
   <aside className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"><Building2 className="text-royalGold" size={28}/><h2 className="mt-4 font-heading text-2xl font-semibold">Visit the Lekki office</h2><address className="mt-4 not-italic leading-8 text-ink/75">{officeAddress}</address><p className="mt-4 text-sm leading-7 text-ink/70">Lawyers are present at this office. Please contact the firm before visiting to confirm the relevant lawyer's availability and your appointment arrangements. Walk-in availability is not guaranteed.</p>
    <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-ink underline decoration-royalGold underline-offset-4">Search address in Google Maps <ArrowRight size={16}/></a><p className="mt-5 text-sm text-ink/70">Telephone: <a href={`tel:${siteConfig.phones[0]}`} className="underline">+234 806 555 3671</a></p><p className="mt-2 text-sm text-ink/70">Email: <a href="mailto:chamanlawfirm@gmail.com" className="break-all underline">chamanlawfirm@gmail.com</a></p>
   </aside>
  </div></section>
  <section className="bg-luxuryBlack py-16 text-ivory"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Legal support</p><h2 className="mt-3 font-heading text-3xl font-semibold">Services available through our Lekki office</h2><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{services.map(s=><article key={s.title} className="rounded-xl border border-royalGold/20 bg-charcoal p-6 transition-transform duration-200 motion-safe:hover:-translate-y-1"><ShieldCheck className="text-royalGold" size={25}/><h3 className="mt-4 font-heading text-xl font-semibold">{s.title}</h3><p className="mt-3 text-sm leading-7 text-ivory/75">{s.description}</p><Link href={s.href} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royalGold">Explore related legal service <ArrowRight size={16}/></Link></article>)}</div></div></section>
  <section className="bg-lightGray py-16 text-ink"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><FileCheck2 className="text-royalGold" size={30}/><h2 className="mt-4 font-heading text-3xl font-semibold">Preparing for an appointment</h2><p className="mt-5 leading-8 text-ink/75">Call, email or send a brief enquiry identifying the matter and any urgent deadline. The firm can conduct necessary initial checks, confirm the consultation arrangement and explain the documents, scope and fees relevant to a proposed instruction. For a property purchase, useful materials may include the seller's offer, available title instruments, survey plans, receipts and draft agreements. Do not send confidential documents to unverified recipients.</p><p className="mt-4 leading-8 text-ink/75">Our team will confirm the lawyer handling the matter, any further checks required and appropriate next steps. No legal outcome or fixed processing time can be promised in advance.</p>
    <h2 className="mt-12 font-heading text-3xl font-semibold">Frequently asked questions</h2><div className="mt-7 space-y-4">{questions.map(item=><article key={item.q} className="rounded-lg border border-ink/10 bg-white p-6"><h3 className="font-heading text-xl font-semibold">{item.q}</h3><p className="mt-3 text-sm leading-7 text-ink/75">{item.a}</p></article>)}</div><p className="mt-6 text-sm leading-7 text-ink/65">The information on this page is general and does not replace advice on specific circumstances.</p></div></section>
  <ConsultationCTA source="Lekki Ikota Villa physical office" title="Discuss your legal matter with our Lekki team" description="Contact Chaman Law Firm to arrange an appointment at House 44, Road 11, Ikota Villa, Lekki and confirm the appropriate documents and professional assistance."/>
 </main>;
}
