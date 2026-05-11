import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getPropertiesByStatus } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Shortlets in Nigeria",
  description:
    "Explore premium shortlet apartments and serviced stays listed by Chaman Properties.",
  path: "/properties/shortlets"
});

export default async function ShortletsPage() {
  const properties = await getPropertiesByStatus("shortlet");
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }, { name: "Shortlets", path: "/properties/shortlets" }])} />
      <PropertyListingPage title="Shortlets" description="Premium serviced apartments and short-stay options for executive and family use." properties={properties} />
    </>
  );
}
