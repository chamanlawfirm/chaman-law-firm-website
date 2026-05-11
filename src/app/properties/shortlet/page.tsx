import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getPropertiesByStatus } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Shortlet Apartments in Nigeria",
  description:
    "Book premium serviced shortlet apartments and explore short-let management support from Chaman Properties.",
  path: "/properties/shortlet"
});

export default async function ShortletPage() {
  const properties = await getPropertiesByStatus("shortlet");
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }, { name: "Shortlet", path: "/properties/shortlet" }])} />
      <PropertyListingPage title="Shortlet Apartments" description="Premium serviced stays for business travelers, visiting families, and executive guests." properties={properties} />
    </>
  );
}
