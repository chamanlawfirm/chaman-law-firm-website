import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PropertyListingPage } from "@/components/PropertyListingPage";
import { getPropertiesByStatus } from "@/lib/cms";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = createMetadata({
  title: "Real Estate Investment Opportunities in Nigeria",
  description:
    "Discover land banking, rental-yield, luxury residential, and portfolio property opportunities with Chaman Properties.",
  path: "/properties/investment"
});

export default async function InvestmentListingsPage() {
  const properties = await getPropertiesByStatus("investment");
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Properties", path: "/properties" }, { name: "Investment", path: "/properties/investment" }])} />
      <PropertyListingPage title="Investment Properties" description="Curated assets for buyers who want growth, rental income, preservation, and long-term property wealth." properties={properties} />
    </>
  );
}
