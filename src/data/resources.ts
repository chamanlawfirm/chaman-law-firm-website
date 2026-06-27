export type DownloadResource = {
  slug: string;
  title: string;
  category: string;
  description: string;
  cta: string;
  relatedPracticeAreas: string[];
  downloadPath?: string;
  placeholder?: boolean;
};

export type MediaItem = {
  slug: string;
  title: string;
  type: "Video" | "Podcast" | "News" | "Court Update" | "Webinar" | "Media Feature";
  description: string;
  channel?: string;
  status: "published" | "placeholder";
};

export type Testimonial = {
  clientName: string;
  location: string;
  practiceArea: string;
  review: string;
  rating?: number;
  approvalStatus: "approved" | "pending";
};

export type CareerPath = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  requirements: string[];
};

export const downloadResources: DownloadResource[] = [
  {
    slug: "property-due-diligence-checklist",
    title: "Property Purchase Due Diligence Checklist",
    category: "Property Law",
    description:
      "A practical checklist for property buyers, investors, and diaspora clients reviewing title, seller authority, documents, approvals, payment records, and transaction risk before commitment.",
    cta: "Download Checklist",
    relatedPracticeAreas: ["property-real-estate-law"],
    downloadPath: "/api/downloads/property-due-diligence-checklist"
  },
  {
    slug: "diaspora-property-legal-guide",
    title: "Diaspora Property Legal Guide",
    category: "Diaspora Legal Services",
    description:
      "A guide for Nigerians abroad who need trusted legal representation for property purchase, verification, power of attorney, document execution, probate, and dispute prevention in Nigeria.",
    cta: "Download Guide",
    relatedPracticeAreas: ["property-real-estate-law", "notary-public-services", "probate-estate-administration"],
    downloadPath: "/api/downloads/diaspora-property-legal-guide"
  },
  {
    slug: "business-contract-review-brief",
    title: "Business Contract Review Brief",
    category: "Corporate & Commercial Law",
    description:
      "A short intake brief to help companies, SMEs, startups, directors, and investors prepare documents and core facts before a contract review consultation.",
    cta: "Download Brief",
    relatedPracticeAreas: ["corporate-commercial-law"],
    downloadPath: "/api/downloads/business-contract-review-brief"
  },
  {
    slug: "debt-recovery-document-checklist",
    title: "Debt Recovery Document Checklist",
    category: "Debt Recovery",
    description:
      "A preparation checklist for creditors and businesses organizing invoices, contracts, payment records, admissions, correspondence, and settlement history.",
    cta: "Download Checklist",
    relatedPracticeAreas: ["debt-recovery"],
    downloadPath: "/api/downloads/debt-recovery-document-checklist"
  },
  {
    slug: "probate-estate-intake-guide",
    title: "Probate & Estate Intake Guide",
    category: "Probate & Estate Administration",
    description:
      "A family and estate preparation guide covering beneficiary information, estate documents, wills, asset lists, administrator details, and diaspora representation questions.",
    cta: "Download Guide",
    relatedPracticeAreas: ["probate-estate-administration"],
    downloadPath: "/api/downloads/probate-estate-intake-guide"
  }
];

export const mediaItems: MediaItem[] = [
  {
    slug: "property-law-education-series",
    type: "Video",
    channel: "YouTube - Chaman Law Firm",
    status: "placeholder",
    title: "Legal Video Library",
    description:
      "Curated Chaman Law Firm video explainers on property verification, contracts, disputes, probate, notary and diaspora legal matters."
  },
  {
    slug: "chaman-legal-insights-podcast",
    type: "Podcast",
    channel: "Chaman Law Firm media channels",
    status: "placeholder",
    title: "Chaman Legal Insights Podcast",
    description:
      "Legal insight episodes for property owners, businesses, investors, families and diaspora clients seeking practical Nigerian legal guidance."
  },
  {
    slug: "legal-news-editorial-desk",
    title: "Legal News Desk",
    type: "News",
    status: "placeholder",
    description:
      "Verified Nigerian legal and regulatory developments explained with practical implications for clients and businesses."
  },
  {
    slug: "legal-news-and-court-updates",
    title: "Court Updates Desk",
    type: "Court Update",
    status: "placeholder",
    description:
      "Structured court and procedure updates prepared for public legal education and lawyer-reviewed commentary."
  },
  {
    slug: "webinars-and-training",
    title: "Webinars and Legal Training",
    type: "Webinar",
    status: "placeholder",
    description:
      "Chaman Law Firm training resources on property due diligence, business contracts, probate preparation, dispute prevention and diaspora legal planning."
  },
  {
    slug: "media-features",
    title: "Media Features and Public Commentary",
    type: "Media Feature",
    status: "placeholder",
    description:
      "Approved interviews, public speaking engagements, legal commentary and professional authority material from Chaman Law Firm."
  }
];

export const approvedTestimonials: Testimonial[] = [];

export const careerPaths: CareerPath[] = [
  {
    slug: "lawyers-and-associates",
    title: "Lawyers and Associates",
    department: "Legal",
    location: "Lagos / Ogun",
    type: "Full-time",
    summary:
      "Career pathway for lawyers supporting property law, corporate and commercial law, litigation, probate, debt recovery, notary services, and client advisory work.",
    requirements: ["Strong legal research and drafting skills", "Professional discipline", "Client-service mindset", "Interest in legal education and digital legal service delivery"]
  },
  {
    slug: "internship-and-nysc-programme",
    title: "Internship and NYSC Programme",
    department: "Training",
    location: "Lagos / Ogun",
    type: "Internship / NYSC",
    summary:
      "Structured learning pathway for interns, NYSC associates, and early-career legal talent interested in litigation, property law, research, and professional growth.",
    requirements: ["Evidence of legal study or NYSC eligibility", "Strong writing ability", "Professional conduct", "Willingness to learn through supervised work"]
  },
  {
    slug: "legal-research-and-administration",
    title: "Legal Research and Administration",
    department: "Operations",
    location: "Lagos / Ogun",
    type: "Full-time / Support",
    summary:
      "Support pathway for legal research, documentation, client service, administration, media publishing, and resource-centre operations.",
    requirements: ["Organizational skill", "Clear written communication", "Digital literacy", "Attention to confidentiality and professional standards"]
  }
];

export const professionalMemberships = [
  "Nigerian Bar Association (NBA)",
  "Nigerian Institute of Chartered Arbitrators (NICArb)",
  "Institute of Chartered Mediators and Conciliators (ICMC)",
  "Business Recovery and Insolvency Practitioners Association of Nigeria (BRIPAN) - Training Participant",
  "Lagos Chamber of Commerce and Industry (LCCI)"
];

export const keyDifferentiators = [
  "Strong property law expertise",
  "Real estate transaction experience",
  "Diaspora client focus",
  "Technology-driven service delivery",
  "Practical commercial advice",
  "Client-centered approach",
  "Full-service legal capability",
  "Thought leadership strategy",
  "Legal education focus"
];

export const socialChannels = [
  { label: "Facebook", href: "https://www.facebook.com/chamanlawfirm/" },
  { label: "Instagram", href: "https://www.instagram.com/chamanlawfirm/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/chaman-law-firm/" },
  { label: "YouTube", href: "https://www.youtube.com/@chamanlawfirm" },
  { label: "TikTok", href: "https://www.tiktok.com/@chamanlawfirm" }
];
