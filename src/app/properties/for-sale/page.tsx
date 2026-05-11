import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getPropertiesByStatus } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Properties for Sale in Nigeria",
  description:
    "Explore verified houses, apartments, land, and luxury properties for sale through Chaman Properties.",
  path: "/properties/for-sale"
});

export default async function ForSalePage() {
  const properties = await getPropertiesByStatus("for-sale");
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }, { name: "For Sale", path: "/properties/for-sale" }])} />
      <PropertyListingPage title="Properties for Sale" description="Premium homes, land, and investment assets prepared for confident acquisition." properties={properties} />
    </>
  );
}
