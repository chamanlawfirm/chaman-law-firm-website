import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { siteConfig } from "@/lib/constants";
import { breadcrumbSchema } from "@/lib/schema";

type Focus = { title: string; detail: string; href: string };
type LocalOffice = {
  city: string; heading: string; eyebrow: string; intro: string; address: string;
  officeName: string; districtNote: string; image: string; imageAlt: string;
  concerns: string[]; services: Focus[]; faqs: { question: string; answer: string }[];
  path: string; mapQuery: string; consultationMessage: string;
};

export const localOffices: Record<"ikeja" | "arepo", LocalOffice> = {
  ikeja: {
    city: "Ikeja, Lagos", heading: "Lawyer in Ikeja, Lagos", eyebrow: "Our Lagos Office",
    intro: "Looking for legal assistance in Ikeja? Chaman Law Firm advises individuals, families, businesses and property investors on transactions, documentation, disputes and private-client matters from its Lagos office at Allen Junction.",
    officeName: "Ikeja — Lagos Office",
    address: "115 Obafemi Awolowo Way, Allen Junction, Ikeja, Lagos State, Nigeria",
    districtNote: "Our Ikeja office is situated at Allen Junction on Obafemi Awolowo Way. Contact the firm before visiting to arrange a suitable appointment.",
    image: "/images/firm/firm-office-team.jpg", imageAlt: "Chaman Law Firm team at the firm's office",
    mapQuery: "115 Obafemi Awolowo Way Allen Junction Ikeja Lagos Nigeria",
    path: "/lawyer-in-ikeja", consultationMessage: "Book a legal consultation in Ikeja",
    concerns: ["Buying or selling land or buildings in Lagos", "Reviewing deeds, contracts and title documents", "Resolving commercial or property disputes", "Obtaining legal guidance on divorce, custody or estate matters"],
    services: [
      {title:"Property and real estate law", detail:"Title checks, due diligence, conveyancing, perfection and transaction advice for buyers, sellers and developers.",href:"/practice-areas/property-real-estate-law"},
      {title:"Corporate and commercial matters",detail:"Business agreements, company compliance, contract review and advice on commercial transactions.",href:"/practice-areas/corporate-commercial-law"},
      {title:"Litigation and dispute resolution",detail:"Advice and representation on civil disputes, property conflicts, negotiations and appropriate dispute-resolution procedures.",href:"/practice-areas/litigation-dispute-resolution"},
      {title:"Family and probate advice",detail:"Discreet advice on matrimonial matters, custody, wills and administration of estates.",href:"/practice-areas/family-law"}
    ],
    faqs:[
      {question:"Where is Chaman Law Firm's Ikeja office?",answer:"Our Lagos office is at 115 Obafemi Awolowo Way, Allen Junction, Ikeja. Please arrange an appointment before visiting."},
      {question:"Can I consult about property before paying a seller?",answer:"Yes. You may instruct the firm to assess available title documents, seller authority and transaction risks before you proceed."},
      {question:"Do I have to visit the office to make an enquiry?",answer:"No. You can begin by contacting the firm or requesting a consultation through this website. We will advise on the next steps."}
    ]
  },
  arepo: {
    city:"Arepo, Ogun State",heading:"Law Firm in Arepo, Ogun State",eyebrow:"Our Ogun State Office",
    intro:"Chaman Law Firm assists individuals, families, landlords, property buyers and businesses requiring legal support in Arepo and wider Ogun State. Our Arepo office provides a local point of contact for legal enquiries, property matters and documentation.",
    officeName:"Arepo — Ogun State Office",
    address:"5 Olalekan Ogunjobi Street, Havana Estate, Arepo, Ogun State, Nigeria",
    districtNote:"Our Arepo branch is located in Havana Estate. Please contact the firm to confirm your appointment and the documents to bring.",
    image:"/images/firm/firm-team.jpg",imageAlt:"Chaman Law Firm legal professionals",
    mapQuery:"5 Olalekan Ogunjobi Street Havana Estate Arepo Ogun Nigeria",
    path:"/law-firm-in-arepo", consultationMessage:"Discuss a legal matter at our Arepo office",
    concerns:["Verifying land ownership and title history in Ogun State","Reviewing tenancy agreements, quit notices and possession disputes","Preparing or reviewing property transaction documents","Advising families on wills, estates and inheritance documentation"],
    services:[
      {title:"Ogun State property transactions",detail:"Legal checks, seller-authority review, agreements and due diligence for prospective purchasers and investors.",href:"/practice-areas/property-real-estate-law"},
      {title:"Landlord and tenant matters",detail:"Advice on tenancy documentation, notices, rental disputes and lawful possession procedures.",href:"/practice-areas/property-real-estate-law"},
      {title:"Wills, probate and estate administration",detail:"Assistance with succession documentation, estate questions and appropriate probate procedures.",href:"/practice-areas/probate-estate-administration"},
      {title:"Business contracts and disputes",detail:"Review of commercial agreements and early assessment of claims, debt issues and settlement options.",href:"/practice-areas/corporate-commercial-law"}
    ],
    faqs:[
      {question:"Does Chaman Law Firm have an office in Arepo?",answer:"Yes. Our Ogun State office is at 5 Olalekan Ogunjobi Street, Havana Estate, Arepo. Please book ahead."},
      {question:"Can the firm advise on land purchases in Ogun State?",answer:"Yes. We can review available documents and discuss due diligence and the legal steps appropriate to the particular transaction."},
      {question:"Can I start my enquiry remotely?",answer:"Yes. You can contact us or use the consultation page to provide an initial summary of your matter."}
    ]
  }
};

export function LocalOfficeLanding({ office }: { office: LocalOffice }) {
  const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(office.mapQuery);
  return <main>
    <JsonLd data={[breadcrumbSchema([{name:"Home",path:"/"},{name:office.city,path:office.path}]),{
      "@context":"https://schema.org","@type":"LegalService","name":siteConfig.name+" — "+office.city,
      "url":siteConfig.url+office.path,"telephone":siteConfig.phones[0],
      "address":{"@type":"PostalAddress","streetAddress":office.address,"addressCountry":"NG"},
      "areaServed":office.city,"provider":{"@type":"LegalService","name":siteConfig.name,"url":siteConfig.url}
    }]} />
    <section className="relative isolate overflow-hidden bg-luxuryBlack text-ivory">
      <div className="absolute inset-0 -z-10"><Image src={office.image} alt={office.imageAlt} fill priority sizes="100vw" className="object-cover opacity-30" /><div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/35" /></div>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:pb-28 lg:pt-36 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-royalGold"><MapPin size={17}/>{office.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">{office.heading}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-ivory/85">{office.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/consultation" className="inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 font-bold text-luxuryBlack transition hover:bg-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royalGold">Book Consultation <ArrowRight size={17}/></Link>
          <a href={`tel:${siteConfig.phones[0]}`} className="inline-flex items-center gap-2 rounded-full border border-ivory/50 px-6 py-3 font-semibold text-ivory hover:border-royalGold"><Phone size={17}/>Call the Firm</a>
        </div>
      </div>
    </section>
    <section className="bg-lightGray py-16 text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:px-8">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">When to speak with us</p><h2 className="mt-3 font-heading text-3xl font-semibold">Legal assistance when decisions matter</h2><p className="mt-4 leading-8 text-ink/75">Early advice may help you understand your rights, identify missing documents and avoid preventable transaction or dispute risks. We assess each instruction on its own facts.</p>
          <ul className="mt-6 grid gap-4">{office.concerns.map(c=><li key={c} className="flex gap-3 rounded-lg bg-white p-4 shadow-sm"><CheckCircle2 className="mt-1 shrink-0 text-royalGold" size={19}/><span>{c}</span></li>)}</ul>
        </div>
        <aside className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8"><Building2 className="text-royalGold" size={28}/><h2 className="mt-4 font-heading text-2xl font-semibold">{office.officeName}</h2><address className="mt-4 not-italic leading-8 text-ink/75">{office.address}</address><p className="mt-4 text-sm leading-7 text-ink/70">{office.districtNote}</p><a href={maps} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-ink underline decoration-royalGold underline-offset-4">Find the office on Google Maps <ArrowRight size={16}/></a></aside>
      </div>
    </section>
    <section className="bg-luxuryBlack py-16 text-ivory"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">How we can assist</p><h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold">Legal services relevant to {office.city}</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{office.services.map(s=><article key={s.title} className="group rounded-xl border border-royalGold/20 bg-charcoal p-6 transition-transform duration-200 motion-safe:hover:-translate-y-1"><ShieldCheck className="text-royalGold" size={25}/><h3 className="mt-4 font-heading text-xl font-semibold">{s.title}</h3><p className="mt-3 text-sm leading-7 text-ivory/75">{s.detail}</p><Link href={s.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-royalGold hover:text-champagne">Explore this service <ArrowRight size={16}/></Link></article>)}</div></div></section>
    <section className="bg-lightGray py-16 text-ink"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><h2 className="font-heading text-3xl font-semibold">Frequently asked questions</h2><div className="mt-7 space-y-4">{office.faqs.map(f=><div key={f.question} className="rounded-lg border border-ink/10 bg-white p-6"><h3 className="font-heading text-lg font-semibold">{f.question}</h3><p className="mt-3 leading-7 text-ink/75">{f.answer}</p></div>)}</div><p className="mt-7 text-sm leading-7 text-ink/65">Information on this page is general and is not a substitute for advice based on your circumstances.</p></div></section>
    <ConsultationCTA title={office.consultationMessage} description="Tell us briefly what you need help with. We can discuss suitable consultation arrangements and the documents that may be relevant." source={`Location page - ${office.city}`}/>
  </main>;
}
