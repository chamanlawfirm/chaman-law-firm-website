export type ResourceCenterConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  highlights: string[];
};

export const resourceCenters: ResourceCenterConfig[] = [
  {
    slug: "real-estate-knowledge-hub",
    title: "Real Estate Knowledge Hub",
    eyebrow: "Property Education",
    description:
      "Practical real estate guides for buyers, sellers, tenants, landlords, and investors who want safer property decisions in Nigeria.",
    keywords: ["real estate", "property", "land", "buying", "selling", "verification", "title"],
    highlights: ["Property due diligence", "Title document basics", "Buying and selling guidance", "Market education"]
  },
  {
    slug: "investment-resource-center",
    title: "Investment Resource Center",
    eyebrow: "Property Investment",
    description:
      "Investment-focused articles on luxury real estate, land banking, rental yield, market opportunities, and long-term property wealth.",
    keywords: ["investment", "investor", "luxury", "yield", "market", "land banking", "roi"],
    highlights: ["Real estate investment strategy", "Luxury property insight", "Market opportunity guides", "Rental-yield education"]
  },
  {
    slug: "property-management-resource-center",
    title: "Property Management Resource Center",
    eyebrow: "Asset Protection",
    description:
      "Guides for landlords and property owners covering tenant sourcing, rent management, inspections, maintenance, and reporting.",
    keywords: ["property management", "landlord", "tenant", "rent", "maintenance", "inspection", "letting"],
    highlights: ["Tenant and rent management", "Maintenance planning", "Inspection reporting", "Landlord advisory"]
  },
  {
    slug: "diaspora-resource-center",
    title: "Diaspora Resource Center",
    eyebrow: "Diaspora Property Support",
    description:
      "Resources for Nigerians abroad who want to buy, verify, manage, lease, or monitor property investments in Nigeria with confidence.",
    keywords: ["diaspora", "abroad", "remote", "inspection", "verification", "Nigeria property", "management"],
    highlights: ["Remote property purchase guidance", "Video inspection and reporting", "Title verification support", "Post-purchase management"]
  }
];

export function getResourceCenterBySlug(slug: string) {
  return resourceCenters.find((center) => center.slug === slug) || null;
}
