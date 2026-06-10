export type LeadMagnet = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  filename: string;
  buttonLabel: string;
  lines: string[];
};

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "property-investment-guide",
    title: "Free Property Investment Guide",
    shortTitle: "Investment Guide",
    description:
      "A practical guide for buying, verifying, and managing Nigerian property investments with more confidence.",
    filename: "chaman-property-investment-guide.pdf",
    buttonLabel: "Download Guide",
    lines: [
      "Chaman Properties - Free Property Investment Guide",
      "Purpose: help buyers, investors, and diaspora clients approach Nigerian real estate with more discipline.",
      "",
      "1. Define your investment objective before viewing property: home ownership, rental income, resale gain, land banking, or short-let yield.",
      "2. Confirm location fundamentals: access roads, drainage, security, nearby infrastructure, commercial activity, and future development potential.",
      "3. Ask for core title documents early. Common documents include Certificate of Occupancy, Governor's Consent, Deed of Assignment, survey plan, allocation papers, and family receipts where applicable.",
      "4. Verify that the seller has authority to sell. This is especially important for family land, estate property, company-owned property, and agent-led transactions.",
      "5. Never rely on photographs alone. Request physical inspection, video inspection, and a condition report before payment.",
      "6. Compare pricing with similar properties in the same micro-location. A low price can indicate urgency, title risk, hidden disputes, or incomplete documentation.",
      "7. Budget beyond purchase price. Include legal fees, agency fees, documentation, perfection costs, renovation, service charges, and maintenance.",
      "8. Diaspora buyers should appoint a trusted property team for inspection, negotiation, documentation coordination, rent collection, and periodic reporting.",
      "9. For rental-yield assets, review likely rent, vacancy risk, maintenance burden, tenant profile, and service charge obligations.",
      "10. Keep every payment traceable. Use bank transfers, written receipts, offer letters, sale agreements, and documented handover records.",
      "",
      "Chaman Properties supports property search, sales, letting, management, investment advisory, diaspora support, and due diligence coordination.",
      "Website: www.chamanproperties.com | Email: info@chamanproperties.com | WhatsApp: 08065553671"
    ]
  },
  {
    slug: "due-diligence-checklist",
    title: "Free Due Diligence Checklist",
    shortTitle: "Due Diligence Checklist",
    description:
      "A buyer-friendly checklist for property inspection, seller checks, title review, payment records, and handover control.",
    filename: "chaman-due-diligence-checklist.pdf",
    buttonLabel: "Download Checklist",
    lines: [
      "Chaman Properties - Free Due Diligence Checklist",
      "Use this checklist before committing funds to any property transaction in Nigeria.",
      "",
      "Seller and Authority",
      "- Confirm seller's legal name, identity, contact details, and authority to sell.",
      "- Confirm whether the property is owned by an individual, family, estate, company, developer, or government allocation holder.",
      "- Request board resolution or power of attorney where a company or representative is involved.",
      "",
      "Title and Documentation",
      "- Request the survey plan, deed, certificate, consent, allocation documents, receipts, and previous chain documents where available.",
      "- Check that names, property description, size, location, and boundaries are consistent across documents.",
      "- Confirm whether the property is subject to mortgage, litigation, family dispute, government acquisition, or pending consent.",
      "",
      "Inspection and Physical Checks",
      "- Inspect the property physically or request a video inspection report.",
      "- Confirm access roads, drainage, electricity, water, security, neighborhood condition, and building state.",
      "- For buildings, inspect roofing, plumbing, electricals, structure, dampness, finishing, and service charge obligations.",
      "",
      "Transaction Control",
      "- Use written offers, sale agreements, receipts, and bank-transfer evidence.",
      "- Avoid paying into personal accounts without documented authority.",
      "- Confirm handover process, keys, vacant possession, tenant status, and post-purchase management needs.",
      "",
      "Chaman Properties can coordinate inspection, negotiation, management, and legal due diligence support through qualified professionals.",
      "Website: www.chamanproperties.com | Email: info@chamanproperties.com | WhatsApp: 08065553671"
    ]
  }
];

export function getLeadMagnet(slug: string) {
  return leadMagnets.find((magnet) => magnet.slug === slug) || null;
}
