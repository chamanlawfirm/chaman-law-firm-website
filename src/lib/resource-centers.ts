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
    slug: "legal-knowledge-hub",
    title: "Legal Knowledge Hub",
    eyebrow: "Client Education",
    description:
      "Practical legal guides for individuals, businesses, investors, families, and diaspora clients who need clear Nigerian legal guidance.",
    keywords: ["legal services", "law firm", "client education", "Nigeria law", "legal guidance"],
    highlights: ["Legal due diligence", "Client preparation", "Document review", "Consultation guidance"]
  },
  {
    slug: "business-law-resource-center",
    title: "Business Law Resource Center",
    eyebrow: "Commercial Advisory",
    description:
      "Articles and guides for companies, SMEs, founders, directors, investors, and commercial decision-makers.",
    keywords: ["business law", "corporate law", "commercial law", "contracts", "governance"],
    highlights: ["Contract review", "Corporate governance", "Business compliance", "Commercial advisory"]
  },
  {
    slug: "dispute-resolution-resource-center",
    title: "Dispute Resolution Resource Center",
    eyebrow: "Representation",
    description:
      "Guides for clients assessing litigation, mediation, arbitration, negotiation, settlement, and enforcement options.",
    keywords: ["litigation", "dispute resolution", "mediation", "arbitration", "settlement"],
    highlights: ["Claim assessment", "ADR options", "Court preparation", "Settlement strategy"]
  },
  {
    slug: "diaspora-legal-resource-center",
    title: "Diaspora Legal Resource Center",
    eyebrow: "Diaspora Legal Support",
    description:
      "Resources for Nigerians abroad who need trusted legal representation, document execution, probate support, or Nigerian legal guidance.",
    keywords: ["diaspora legal services", "Nigeria lawyer", "power of attorney", "probate", "legal representation"],
    highlights: ["Remote consultation", "Document execution", "Probate guidance", "Legal representation"]
  }
];

export function getResourceCenterBySlug(slug: string) {
  return resourceCenters.find((center) => center.slug === slug) || null;
}
