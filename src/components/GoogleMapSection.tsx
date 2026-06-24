import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { SectionHeader } from "@/components/SectionHeader";

export function GoogleMapSection() {
  const embedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps?q=115%20Obafemi%20Awolowo%20Way%20Ikeja%20Lagos%20Nigeria&output=embed";

  return (
    <section className="bg-charcoal py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Visit Our Offices"
          title="Ikeja, Lagos and Arepo, Ogun State"
          description="Meet Chaman Law Firm for legal consultation, document review, property-law support, corporate advisory, dispute guidance, and notary public services."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-lg border border-royalGold/18 bg-luxuryBlack">
            <iframe
              title="Chaman Law Firm office map"
              src={embedUrl}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="grid gap-4">
            {siteConfig.offices.map((office) => (
              <div key={office.name} className="rounded-lg border border-royalGold/18 bg-luxuryBlack p-6">
                <MapPin className="text-royalGold" />
                <h3 className="mt-4 font-heading text-xl font-semibold text-ivory">{office.name}</h3>
                <p className="mt-3 text-sm leading-7 text-ivory/70">{office.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
                  className="mt-5 inline-flex text-sm font-bold text-royalGold hover:text-champagne"
                >
                  Open in Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
