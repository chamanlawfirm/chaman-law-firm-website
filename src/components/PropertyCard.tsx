import { Bath, BedDouble, Car, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-royalGold/18 bg-charcoal shadow-2xl transition hover:-translate-y-1 hover:border-royalGold/45">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.featuredImage}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 property-image-overlay" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-royalGold px-3 py-1 text-xs font-bold text-luxuryBlack">
              {property.status}
            </span>
            {property.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-luxuryBlack/80 px-3 py-1 text-xs font-semibold text-champagne">
                <ShieldCheck size={13} />
                Verified
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-heading text-xl font-bold text-ivory">{property.price}</p>
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div>
          <Link href={`/properties/${property.slug}`}>
            <h3 className="font-heading text-xl font-semibold leading-snug text-ivory transition hover:text-royalGold">
              {property.title}
            </h3>
          </Link>
          <p className="mt-2 flex items-center gap-2 text-sm text-ivory/64">
            <MapPin size={16} className="text-royalGold" />
            {property.location}, {property.state}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-y border-royalGold/12 py-3 text-sm text-ivory/76">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={16} className="text-royalGold" />
            {property.bedrooms ?? "-"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={16} className="text-royalGold" />
            {property.bathrooms ?? "-"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Car size={16} className="text-royalGold" />
            {property.parking ?? "-"}
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-7 text-ivory/68">{property.summary}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 rounded-full border border-royalGold/30 px-4 py-3 text-center text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
          >
            View Details
          </Link>
          <a
            href={whatsappLink(`Hello Chaman Properties, I am interested in ${property.title}. Property ID: ${property.id}`)}
            className="flex-1 rounded-full bg-royalGold px-4 py-3 text-center text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
