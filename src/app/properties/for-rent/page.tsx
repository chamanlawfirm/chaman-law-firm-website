import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getPropertiesByStatus } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Properties for Rent in Lagos, Ogun and Nigeria",
  description:
    "Find verified residential and commercial rental properties with inspection and tenancy support from Chaman Properties.",
  path: "/properties/for-rent"
});

export default async function ForRentPage() {
  const properties = await getPropertiesByStatus("for-rent");
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }, { name: "For Rent", path: "/properties/for-rent" }])} />
      <PropertyListingPage title="Properties for Rent" description="Secure rental options for families, executives, businesses, and corporate clients." properties={properties} />
    </>
  );
}
