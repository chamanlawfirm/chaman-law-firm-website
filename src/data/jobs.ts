import type { JobOpening } from "@/lib/types";

export const jobOpenings: JobOpening[] = [
  {
    slug: "property-sales-executive",
    title: "Property Sales Executive",
    department: "Sales",
    location: "Lagos / Ogun",
    type: "Full-time",
    summary:
      "Drive property sales, client advisory, inspection follow-up, and investor relationship management.",
    responsibilities: [
      "Qualify buyers and investors",
      "Coordinate inspections",
      "Follow up leads through closing",
      "Prepare listing and transaction updates"
    ]
  },
  {
    slug: "property-management-officer",
    title: "Property Management Officer",
    department: "Property Management",
    location: "Lagos / Ogun",
    type: "Full-time",
    summary:
      "Support tenant relations, maintenance coordination, inspections, rent tracking, and owner reporting.",
    responsibilities: [
      "Track maintenance requests",
      "Prepare inspection summaries",
      "Coordinate tenants and vendors",
      "Maintain owner communication records"
    ]
  },
  {
    slug: "digital-marketing-content-officer",
    title: "Digital Marketing & Content Officer",
    department: "Marketing",
    location: "Hybrid",
    type: "Full-time",
    summary:
      "Create premium listing content, social media campaigns, market insights, and property video scripts.",
    responsibilities: [
      "Prepare property marketing copy",
      "Manage social content calendars",
      "Coordinate listing photography",
      "Publish blog and SEO content"
    ]
  }
];
