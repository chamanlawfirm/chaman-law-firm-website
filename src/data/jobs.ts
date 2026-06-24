import type { JobOpening } from "@/lib/types";

export const jobOpenings: JobOpening[] = [
  {
    slug: "legal-associate",
    title: "Legal Associate",
    department: "Legal",
    location: "Lagos / Ogun",
    type: "Full-time",
    summary:
      "Support legal research, drafting, client advisory, court preparation, and practice-area execution.",
    responsibilities: [
      "Prepare legal research and drafting support",
      "Assist with client matter updates",
      "Organize matter documents",
      "Support practice-area delivery"
    ]
  },
  {
    slug: "legal-research-officer",
    title: "Legal Research Officer",
    department: "Research",
    location: "Lagos / Ogun",
    type: "Full-time",
    summary:
      "Support legal research, article preparation, regulatory monitoring, and internal knowledge management.",
    responsibilities: [
      "Research laws, cases, and regulatory updates",
      "Prepare legal notes and article drafts",
      "Support resource-centre content",
      "Maintain research files"
    ]
  },
  {
    slug: "digital-marketing-content-officer",
    title: "Digital Marketing & Content Officer",
    department: "Marketing",
    location: "Hybrid",
    type: "Full-time",
    summary:
      "Create legal education content, social media campaigns, media assets, and resource-centre updates.",
    responsibilities: [
      "Prepare legal education copy",
      "Manage social content calendars",
      "Coordinate approved media assets",
      "Publish blog and SEO content"
    ]
  }
];
