import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { JsonLd } from "@/components/JsonLd";
import { propertyLocations } from "@/data/property-locations";
import { siteConfig } from "@/lib/constants";
import { breadcrumbSchema } from "@/lib/schema";
import { createMetadata } from "@/lib/seo";

const route = "/property-lawyers-nigeria";
export const metadata = createMetadata({
  title: "Property Lawyers in Nigeria | Land & Title Counsel",
  description: "Speak with Chaman Law Firm about property due diligence, land searches, conveyancing, documents, title perfection and disputes across Nigeria.",
  path: route,
  image: "/images/property-locations/lagos.webp"
});

export default function PropertyLawyersNigeriaPage() {
  return <main className="bg-lightGray text-ink">
    <JsonLd data={[
      breadcrumbSchema([{name:"Home",path:"/"},{name:"Property lawyers in Nigeria",path:route}]),
      {"@context":"https://schema.org","@type":"Service",name:"Property law advice across Nigeria",provider:{"@type":"LegalService",name:siteConfig.name,url:siteConfig.url},areaServed:{"@type":"Country",name:"Nigeria"},url:`${siteConfig.url}${route}`}
    ]}/>
    <section className="relative isolate overflow-hidden bg-luxuryBlack text-ivory">
      <Image src="/images/property-locations/lagos.webp" alt="Illustration of a Nigerian property consultation overlooking a city" fill priority sizes="100vw" className="-z-20 object-cover object-center opacity-55"/>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/30"/>
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-royalGold">Property law · Nigeria</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">Property lawyers for decisions that cannot be left to chance.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/85">Before buying land, signing a deed or resolving a title dispute, understand the people, documents and legal interests involved. Chaman Law Firm advises buyers, owners, developers and Nigerians abroad across Nigeria.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/consultation" className="rounded-full bg-royalGold px-7 py-3 font-bold text-luxuryBlack hover:bg-champagne">Speak to a property lawyer</Link><Link href="#locations" className="rounded-full border border-white/50 px-7 py-3 font-bold text-white hover:border-royalGold">Find your jurisdiction</Link></div>
        <p className="mt-10 text-xs text-ivory/65">Illustrative image; location-specific procedures are confirmed for each instruction.</p>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">How we assist</p><h2 className="mt-3 font-heading text-3xl font-semibold">A legal pathway from first enquiry to protected ownership</h2><p className="mt-5 leading-8 text-ink/75">A property transaction is more than a signature on a deed. We review the proposed property and parties, identify searches and professional checks, examine contract terms, help document completion and advise on applicable consent and registration work. Where title, possession or seller authority is contested, we help identify the legal options before further money is committed.</p></div><div className="grid gap-3 sm:grid-cols-2">{["Land and property due diligence","Title investigation and verification","Contracts and conveyancing","Deeds, leases and mortgages","Consent and title perfection","Property disputes and inherited land"].map(item=><div key={item} className="flex items-start gap-3 rounded-xl bg-white p-5 shadow-sm"><ShieldCheck size={19} className="mt-1 shrink-0 text-royalGold"/><span className="font-medium">{item}</span></div>)}</div></div></section>
    <ConsultationCTA eyebrow="Before you pay or sign" source="National property-law hub" title="Put the property documents before a lawyer" description="Tell us where the property is located, what stage the transaction has reached and which documents you have. We will discuss the appropriate scope of advice."/>
    <section id="locations" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Jurisdiction-specific guidance</p><h2 className="mt-3 font-heading text-3xl font-semibold">Find property-law support where your land is situated</h2><p className="mt-4 max-w-3xl leading-8 text-ink/75">Select the state or Federal Capital Territory to read about relevant transaction questions and arrange advice. An area we serve is not necessarily an office location.</p><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{propertyLocations.map(item=><Link key={item.slug} href={`/property-lawyers/${item.slug}`} className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative h-44 bg-charcoal"><Image src={item.image || `/images/property-locations/${item.slug}.webp`} alt={`Illustration inspired by ${item.short} property transactions`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover opacity-90 transition group-hover:scale-105"/></div><div className="p-6"><p className="flex items-center gap-2 text-xs uppercase tracking-widest text-royalGold"><MapPin size={15}/>{item.name}</p><h3 className="mt-3 font-heading text-xl font-semibold">Property lawyer in {item.short}</h3><p className="mt-2 text-sm leading-6 text-ink/70">{item.places.join(" · ")}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Explore local guidance <ArrowRight size={16}/></span></div></Link>)}</div></section>
    <section className="bg-white py-16"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><h2 className="font-heading text-3xl font-semibold">What to send for an initial property enquiry</h2><p className="mt-5 leading-8 text-ink/75">Identify the state, town and approximate property location. Tell us whether you plan to buy, sell, lease, develop, perfect title or resolve a dispute. List the available documents, seller details and any payment deadline. Our team will advise how to share sensitive materials securely after the enquiry.</p><div className="mt-7 flex flex-wrap gap-4 text-sm font-bold"><Link href="/practice-areas/property-real-estate-law" className="text-ink underline decoration-royalGold underline-offset-4">Explore property-law services</Link><Link href="/property-verification-nigeria" className="text-ink underline decoration-royalGold underline-offset-4">Explore property verification</Link><Link href="/probate-estate-administration-nigeria" className="text-ink underline decoration-royalGold underline-offset-4">Inherited property and probate</Link></div></div></section>
  </main>;
}
