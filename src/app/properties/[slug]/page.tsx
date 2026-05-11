import type { Metadata } from "next";
import { Bath, BedDouble, Car, FileCheck2, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PropertyCard } from "@/components/PropertyCard";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ZohoLeadForm } from "@/components/ZohoLeadForm";
import { getProperties, getPropertyBySlug } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, propertySchema } from "@/lib/schema";

type PropertyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return createMetadata({
      title: "Property Not Found",
      description: "The requested property could not be found.",
      path: `/properties/${slug}`
    });
  }

  return createMetadata({
    title: property.title,
    description: property.summary,
    path: `/properties/${property.slug}`,
    image: property.featuredImage,
    keywords: [property.location, property.state, property.status, property.type]
  });
}

const propertyFaqs = [
  {
    question: "Can I book an inspection for this property?",
    answer:
      "Yes. You can request a physical inspection, video inspection, or consultation through Chaman Properties."
  },
  {
    question: "Can Chaman Properties support document verification?",
    answer:
      "Yes. Chaman Properties can coordinate title and documentation review support through qualified property law professionals where required."
  }
];

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const [property, allProperties] = await Promise.all([getPropertyBySlug(slug), getProperties()]);

  if (!property) {
    notFound();
  }

  const similar = allProperties
    .filter((item) => item.slug !== property.slug && (item.state === property.state || item.status === property.status))
    .slice(0, 3);

  return (
    <main>
      <JsonLd
        data={[
          propertySchema(property),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Properties", path: "/properties" },
            { name: property.title, path: `/properties/${property.slug}` }
          ]),
          faqSchema(propertyFaqs)
        ]}
      />
      <section className="bg-luxuryBlack">
        <div className="relative min-h-[580px] overflow-hidden">
          <img src={property.featuredImage} alt={property.title} className="absolute inset-0 h-full w-full object-cover opacity-58" />
          <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/72 to-luxuryBlack/16" />
          <div className="relative mx-auto flex min-h-[580px] max-w-7xl items-end px-4 pb-14 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-royalGold px-3 py-1 text-xs font-bold text-luxuryBlack">{property.status}</span>
                <span className="rounded-full border border-royalGold/35 bg-luxuryBlack/80 px-3 py-1 text-xs font-bold text-royalGold">{property.type}</span>
                {property.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-royalGold/35 bg-luxuryBlack/80 px-3 py-1 text-xs font-bold text-champagne">
                    <ShieldCheck size={13} />
                    Verified Listing
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-ivory sm:text-5xl lg:text-6xl">
                {property.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-lg text-ivory/74">
                <MapPin className="text-royalGold" size={20} />
                {property.address}
              </p>
              <p className="mt-5 font-heading text-3xl font-bold text-royalGold">{property.price}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal py-8">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="rounded-md border border-royalGold/14 bg-luxuryBlack p-4">
            <BedDouble className="text-royalGold" size={19} />
            <p className="mt-2 text-sm text-ivory/62">Bedrooms</p>
            <p className="font-heading text-xl text-ivory">{property.bedrooms ?? "N/A"}</p>
          </div>
          <div className="rounded-md border border-royalGold/14 bg-luxuryBlack p-4">
            <Bath className="text-royalGold" size={19} />
            <p className="mt-2 text-sm text-ivory/62">Bathrooms</p>
            <p className="font-heading text-xl text-ivory">{property.bathrooms ?? "N/A"}</p>
          </div>
          <div className="rounded-md border border-royalGold/14 bg-luxuryBlack p-4">
            <Car className="text-royalGold" size={19} />
            <p className="mt-2 text-sm text-ivory/62">Parking</p>
            <p className="font-heading text-xl text-ivory">{property.parking ?? "N/A"}</p>
          </div>
          <div className="rounded-md border border-royalGold/14 bg-luxuryBlack p-4">
            <Ruler className="text-royalGold" size={19} />
            <p className="mt-2 text-sm text-ivory/62">Size</p>
            <p className="font-heading text-xl text-ivory">{property.size || property.landSize || "N/A"}</p>
          </div>
          <div className="rounded-md border border-royalGold/14 bg-luxuryBlack p-4">
            <FileCheck2 className="text-royalGold" size={19} />
            <p className="mt-2 text-sm text-ivory/62">Property ID</p>
            <p className="font-heading text-xl text-ivory">{property.id}</p>
          </div>
        </div>
      </section>

      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="space-y-10">
            <div>
              <SectionHeader eyebrow="Property Overview" title="Details, documents, and buyer confidence" description={property.description} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {property.images.map((image) => (
                <img key={image} src={image} alt={property.title} className="h-56 w-full rounded-lg border border-royalGold/14 object-cover" />
              ))}
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <h2 className="font-heading text-2xl text-ivory">Features</h2>
                <ul className="mt-5 space-y-3 text-sm text-ivory/72">
                  {property.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <ShieldCheck size={16} className="mt-1 shrink-0 text-royalGold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
                <h2 className="font-heading text-2xl text-ivory">Documents & Amenities</h2>
                <ul className="mt-5 space-y-3 text-sm text-ivory/72">
                  {[...property.titleDocuments, ...property.amenities].map((item) => (
                    <li key={item} className="flex gap-3">
                      <FileCheck2 size={16} className="mt-1 shrink-0 text-royalGold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {property.investmentNote ? (
              <div className="rounded-lg border border-royalGold/22 bg-gold-sheen p-6">
                <h2 className="font-heading text-2xl text-ivory">Investment Note</h2>
                <p className="mt-3 text-sm leading-7 text-ivory/72">{property.investmentNote}</p>
              </div>
            ) : null}
          </div>
          <aside className="space-y-6">
            <ZohoLeadForm source={`Property detail - ${property.id}`} title="Book Inspection" submitLabel="Request Inspection" />
            <div className="rounded-lg border border-royalGold/18 bg-charcoal p-6">
              <img src={property.agent.image} alt={property.agent.name} className="h-24 w-24 rounded-full object-cover" />
              <h2 className="mt-4 font-heading text-2xl text-ivory">{property.agent.name}</h2>
              <p className="mt-1 text-sm text-royalGold">{property.agent.role}</p>
              <p className="mt-4 text-sm text-ivory/68">{property.agent.phone}</p>
              <p className="mt-1 text-sm text-ivory/68">{property.agent.email}</p>
              <div className="mt-5">
                <WhatsAppCTA
                  label="WhatsApp Agent"
                  message={`Hello Chaman Properties, I want to inspect ${property.title}. Property ID: ${property.id}`}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {similar.length > 0 ? (
        <section className="bg-charcoal py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Similar Properties" title="You may also consider" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
