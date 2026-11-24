export const researchPath = "/resources/legal-research";
export const researchName = "Legal Research & International Publications";
export const researchInstitution = "Chaman Legal Research & International Publications";

export const disciplines = [
  { id: "property-and-real-estate", title: "Property and Real Estate Law", summary: "Land tenure, title, transactions and investment protection." },
  { id: "corporate-commercial-and-investment", title: "Corporate, Commercial and Investment Law", summary: "Governance, market entry, capital and commercial transactions." },
  { id: "international-and-comparative", title: "International and Comparative Law", summary: "Comparative jurisprudence, treaties and cross-border enforcement." },
  { id: "technology-fintech-and-banking", title: "Technology, Fintech and Banking Law", summary: "Digital markets, financial regulation, technology and data protection." },
  { id: "constitutional-rights-and-policy", title: "Constitutional Law, Human Rights and Public Policy", summary: "Constitutional protection, public institutions and law reform." },
  { id: "litigation-arbitration-and-jurisprudence", title: "Litigation, Arbitration and Jurisprudence", summary: "Adjudication, alternative dispute resolution and enforcement." },
  { id: "probate-succession-and-private-wealth", title: "Probate, Succession and Private Wealth Law", summary: "Inheritance, fiduciary structures and estate administration." },
] as const;

export const researchTypes = [
  { value: "flagship", title: "Flagship Research Papers" },
  { value: "international", title: "International Legal Publications" },
  { value: "comparative", title: "Comparative Legal Studies" },
  { value: "policy", title: "Legal Policy and White Papers" },
  { value: "case-law", title: "Case Law and Jurisprudence" },
] as const;
