import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearchBar } from "@/components/PropertySearchBar";
import { SectionHeader } from "@/components/SectionHeader";
import type { Property } from "@/lib/types";

type PropertyListingPageProps = {
  title: string;
  description: string;
  properties: Property[];
  eyebrow?: string;
};

export function PropertyListingPage({
  title,
  description,
  properties,
  eyebrow = "Verified Listings"
}: PropertyListingPageProps) {
  return (
    <main>
      <section className="border-b border-royalGold/15 bg-charcoal py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
          <div className="mt-8">
            <PropertySearchBar />
          </div>
        </div>
      </section>
      <section className="bg-luxuryBlack py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-royalGold">{properties.length} listings available</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-ivory">Curated Property Options</h2>
            </div>
          </div>
          {properties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-royalGold/18 bg-charcoal p-8 text-center">
              <h3 className="font-heading text-2xl text-ivory">No exact match found</h3>
              <p className="mt-3 text-sm text-ivory/68">
                Send your property brief and the advisory team will recommend suitable verified options.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
