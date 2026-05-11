import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getProperties } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Properties for Sale, Rent, Shortlet and Investment",
  description:
    "Browse verified Chaman Properties listings for sale, rent, shortlet, land, luxury homes, commercial spaces, and real estate investment opportunities in Nigeria.",
  path: "/properties"
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const allProperties = await getProperties();
  const status = firstValue(params.status)?.toLowerCase();
  const location = firstValue(params.location)?.toLowerCase();
  const type = firstValue(params.type)?.toLowerCase();
  const beds = Number.parseInt(firstValue(params.beds) || "", 10);

  const filtered = allProperties.filter((property) => {
    const propertyStatus = property.status.toLowerCase().replace(" ", "-");
    const matchesStatus = status ? propertyStatus === status : true;
    const matchesLocation = location
      ? `${property.location} ${property.city} ${property.state}`.toLowerCase().includes(location)
      : true;
    const matchesType = type ? property.type.toLowerCase() === type : true;
    const matchesBeds = Number.isFinite(beds) ? (property.bedrooms || 0) >= beds : true;

    return matchesStatus && matchesLocation && matchesType && matchesBeds;
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }])} />
      <PropertyListingPage
        title="Verified Properties for Sale, Rent, Shortlet and Investment"
        description="Search curated property options backed by inspection support, documentation awareness, and client-first advisory."
        properties={filtered}
      />
    </>
  );
}
