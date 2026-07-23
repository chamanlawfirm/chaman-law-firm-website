import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const site = "https://chamanlawfirm.com";
const publicAuthor = "Charles Chukwuma Nkwoka, Esq.";

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const writeCsv = (fileName, headers, rows) => {
  const body = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
  fs.writeFileSync(path.join(docsDir, fileName), `${body}\n`, "utf8");
};

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...records] = rows.filter((entry) => entry.some((item) => item.trim()));
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), record[index] ?? ""]))
  );
};

const readCsv = (fileName) => {
  const filePath = path.join(docsDir, fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return parseCsv(fs.readFileSync(filePath, "utf8"));
};

const slugTitle = (url) => {
  const slug = String(url).replace(site, "").replace(/^\/|\/$/g, "").split("/").pop() || "Home";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
};

const asUrl = (source) => (source.startsWith("http") ? source : `${site}${source}`);

const sprint11tPages = [
  {
    oldUrl: "/land-title-document-check-in-nigeria",
    title: "Land Title Document Check",
    area: "property-real-estate-law",
    slug: "land-title-document-check",
    type: "property service page",
    description: "Legal review of land title documents, seller authority, survey records, and transaction-risk indicators.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm team reviewing Nigerian land title documents"
  },
  {
    oldUrl: "/due-diligence-before-buying-land",
    title: "Land Purchase Due Diligence",
    area: "property-real-estate-law",
    slug: "land-purchase-due-diligence",
    type: "property service page",
    description: "Pre-purchase legal due diligence for land buyers, investors, developers, and diaspora clients.",
    image: "legal-service image",
    alt: "Legal due diligence image for Nigerian land purchase review"
  },
  {
    oldUrl: "/tenancy-agreement-lawyer-in-lagos",
    title: "Tenancy Agreement Review",
    area: "property-real-estate-law",
    slug: "tenancy-agreement-review",
    type: "property service page",
    description: "Review and drafting guidance for tenancy agreements, lease terms, rent obligations, and possession risk.",
    image: "managing-partner-office.png",
    alt: "Private legal consultation for tenancy agreement review in Nigeria"
  },
  {
    oldUrl: "/procedure-for-ejecting-a-squatter-in-lagos",
    title: "Property Dispute and Squatter Advisory",
    area: "property-real-estate-law",
    slug: "property-dispute-and-squatter-advisory",
    type: "property service page",
    description: "Legal-risk guidance for possession disputes, trespass concerns, squatter issues, and lawful recovery options.",
    image: "legal-service image",
    alt: "Legal advisory image for property dispute and squatter matters"
  },
  {
    oldUrl: "/government-acquisition-in-ogun-state",
    title: "Government Acquisition in Ogun State Advisory",
    area: "property-real-estate-law",
    slug: "government-acquisition-ogun-state-advisory",
    type: "property service page",
    description: "Property-law guidance for government acquisition, excision, allocation, and title-risk questions in Ogun State.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm lawyers advising on Ogun State land acquisition risk"
  },
  {
    oldUrl: "/building-completion-certificate-in-lagos",
    title: "Building Completion Certificate Advisory",
    area: "property-real-estate-law",
    slug: "building-completion-certificate-lagos",
    type: "property service page",
    description: "Document-readiness and legal-risk guidance for completion certificate and development approval questions.",
    image: "legal-service image",
    alt: "Legal advisory image for building completion certificate review"
  },
  {
    oldUrl: "/fencing-approval-in-lagos-key-requirements",
    title: "Fencing Approval Advisory",
    area: "property-real-estate-law",
    slug: "fencing-approval-lagos",
    type: "property service page",
    description: "Legal and compliance guidance for fencing approval, planning documents, and development-control issues.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm property lawyers reviewing fencing approval documents"
  },
  {
    oldUrl: "/how-to-register-a-business-name-in-nigeria-2024",
    title: "Business Name Registration Advisory",
    area: "corporate-commercial-law",
    slug: "business-name-registration-advisory",
    type: "corporate service page",
    description: "Legal and compliance guidance for founders, SMEs, entrepreneurs, and investors preparing business-name registration.",
    image: "legal-service image",
    alt: "Corporate legal advisory image for business name registration in Nigeria"
  },
  {
    oldUrl: "/requirements-for-starting-a-business-in-nigeria",
    title: "Company Startup Compliance Advisory",
    area: "corporate-commercial-law",
    slug: "company-startup-compliance-advisory",
    type: "corporate service page",
    description: "Startup legal guidance on setup, governance, contracts, registrations, and early compliance risks.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm corporate lawyers advising a Nigerian startup"
  },
  {
    oldUrl: "/corporate-affairs-commission-and-its-functions-in-nigeria",
    title: "CAC Compliance and Company Records",
    area: "corporate-commercial-law",
    slug: "cac-compliance-and-company-records",
    type: "corporate service page",
    description: "Corporate compliance support for CAC filings, company records, statutory registers, directors, and shareholders.",
    image: "legal-service image",
    alt: "Corporate compliance advisory image for CAC records in Nigeria"
  },
  {
    oldUrl: "/corporate-governance-and-business-ethics",
    title: "Corporate Governance and Ethics Advisory",
    area: "corporate-commercial-law",
    slug: "corporate-governance-and-ethics-advisory",
    type: "corporate service page",
    description: "Governance guidance for directors, founders, shareholders, boards, SMEs, and companies.",
    image: "managing-partner-office.png",
    alt: "Private corporate governance consultation at Chaman Law Firm"
  },
  {
    oldUrl: "/procedure-for-mergers-and-acquisitions-in-nigeria",
    title: "Mergers and Acquisitions Advisory",
    area: "corporate-commercial-law",
    slug: "mergers-and-acquisitions-advisory",
    type: "corporate service page",
    description: "Legal guidance for acquisitions, restructuring, due diligence, approvals, and transaction risk.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm corporate team advising on merger and acquisition documents"
  },
  {
    oldUrl: "/role-of-shareholder-in-corporate-decision-making",
    title: "Shareholder Decision-Making Advisory",
    area: "corporate-commercial-law",
    slug: "shareholder-decision-making-advisory",
    type: "corporate service page",
    description: "Corporate-law guidance for shareholder decisions, resolutions, voting, company control, and consent issues.",
    image: "legal-service image",
    alt: "Corporate legal advisory image for shareholder decision-making"
  },
  {
    oldUrl: "/how-to-write-a-demand-letter",
    title: "Debt Demand Letter Advisory",
    area: "debt-recovery",
    slug: "debt-demand-letter-advisory",
    type: "debt recovery service page",
    description: "Legal guidance for creditors preparing demand letters, settlement proposals, and recovery strategy.",
    image: "legal-service image",
    alt: "Debt recovery advisory image for demand letter preparation"
  },
  {
    oldUrl: "/legal-obligations-for-debt-collectors",
    title: "Debt Collector Compliance Advisory",
    area: "debt-recovery",
    slug: "debt-collector-compliance-advisory",
    type: "debt recovery service page",
    description: "Legal-risk guidance for debt recovery conduct, creditor communications, and escalation boundaries.",
    image: "managing-partner-office.png",
    alt: "Private legal consultation for debt recovery compliance"
  },
  {
    oldUrl: "/employment-contract-review-in-nigeria",
    title: "Employment Contract Review",
    area: "employment-law",
    slug: "employment-contract-review",
    type: "employment service page",
    description: "Legal review of employment contracts, executive terms, restrictive covenants, and termination provisions.",
    image: "legal-service image",
    alt: "Employment law advisory image for contract review"
  },
  {
    oldUrl: "/employment-law-7-compliance-for-nigerian",
    title: "Workplace Compliance Advisory",
    area: "employment-law",
    slug: "workplace-compliance-advisory",
    type: "employment service page",
    description: "Employment-law guidance for workplace compliance, policies, documentation, and dispute risk.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm lawyers advising on employment compliance"
  },
  {
    oldUrl: "/statute-limitations-and-limitation-periods",
    title: "Limitation Periods and Pre-Action Advisory",
    area: "litigation-dispute-resolution",
    slug: "limitation-periods-and-pre-action-advisory",
    type: "litigation service page",
    description: "Litigation-risk review for deadlines, limitation periods, pre-action steps, and evidence preservation.",
    image: "legal-service image",
    alt: "Litigation advisory image for limitation period and pre-action review"
  },
  {
    oldUrl: "/or-filing-interlocutory-applications",
    title: "Interlocutory Applications Advisory",
    area: "litigation-dispute-resolution",
    slug: "interlocutory-applications-advisory",
    type: "litigation service page",
    description: "Litigation support for interim applications, procedural strategy, evidence preparation, and urgency review.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm litigation lawyers reviewing court application documents"
  },
  {
    oldUrl: "/child-support-and-maintenance-payment",
    title: "Child Maintenance and Support Advisory",
    area: "family-law",
    slug: "child-maintenance-and-support-advisory",
    type: "family service page",
    description: "Family-law guidance for child maintenance, support obligations, records, settlement options, and dispute risk.",
    image: "legal-service image",
    alt: "Family law advisory image for child maintenance and support"
  },
  {
    oldUrl: "/challenges-of-customary-marriage",
    title: "Customary Marriage Advisory",
    area: "family-law",
    slug: "customary-marriage-advisory",
    type: "family service page",
    description: "Family-law guidance for customary marriage validity, documentation, family consent, and private-client risk.",
    image: "managing-partner-office.png",
    alt: "Private family law consultation for customary marriage advisory"
  },
  {
    oldUrl: "/inheritance-rights-of-step-children",
    title: "Inheritance Rights of Stepchildren Advisory",
    area: "probate-estate-administration",
    slug: "inheritance-rights-stepchildren-advisory",
    type: "probate service page",
    description: "Private-client guidance for inheritance questions, stepchildren, wills, estate documents, and family-dispute risk.",
    image: "managing-partner-office.png",
    alt: "Private estate consultation for inheritance rights and family structure"
  },
  {
    oldUrl: "/limitations-to-testamentary-freedom",
    title: "Testamentary Freedom Advisory",
    area: "probate-estate-administration",
    slug: "testamentary-freedom-advisory",
    type: "probate service page",
    description: "Estate-planning and probate guidance on wills, testamentary decisions, asset planning, and dispute-risk review.",
    image: "legal-service image",
    alt: "Estate planning legal advisory image for testamentary freedom"
  },
  {
    oldUrl: "/documents-apostilled-in-nigeria",
    title: "Apostille and Document Legalization Advisory",
    area: "notary-public-services",
    slug: "apostille-and-document-legalization",
    type: "notary service page",
    description: "Document-readiness guidance for foreign use, notarization, legalization, attestation, and institutional submission.",
    image: "legal-service image",
    alt: "Notary advisory image for apostille and document legalization"
  },
  {
    oldUrl: "/how-to-legalize-or-attest-a-document-in-nigeria",
    title: "Document Legalization and Attestation",
    area: "notary-public-services",
    slug: "document-legalization-and-attestation",
    type: "notary service page",
    description: "Legal guidance for documents prepared for attestation, legalization, or foreign submission.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm lawyers reviewing documents for attestation and legalization"
  },
  {
    oldUrl: "/legal-document-review",
    title: "Legal Document Review",
    area: "notary-public-services",
    slug: "legal-document-review",
    type: "notary service page",
    description: "Professional review of agreements, forms, deeds, letters, corporate documents, and other legal papers.",
    image: "managing-partner-office.png",
    alt: "Private consultation for legal document review"
  },
  {
    oldUrl: "/7-step-citizenship-application-in-nigeria",
    title: "Citizenship Application Advisory",
    area: "immigration-services",
    slug: "citizenship-application-advisory",
    type: "immigration service page",
    description: "Immigration and document-readiness guidance for citizenship-related applications and eligibility review.",
    image: "legal-service image",
    alt: "Immigration legal advisory image for citizenship application review"
  },
  {
    oldUrl: "/proven-steps-qualities-of-good-mediator",
    title: "Mediator Selection and Quality Advisory",
    area: "adr-mediation",
    slug: "mediator-selection-and-quality-advisory",
    type: "ADR service page",
    description: "ADR guidance for mediation suitability, mediator selection, settlement structure, and dispute-resolution strategy.",
    image: "legal-service image",
    alt: "ADR advisory image for mediator selection and mediation strategy"
  },
  {
    oldUrl: "/enforcement-of-arbitral-awards",
    title: "Arbitral Award Enforcement Advisory",
    area: "adr-mediation",
    slug: "arbitral-award-enforcement-advisory",
    type: "ADR service page",
    description: "Arbitration guidance for awards, enforcement risk, settlement options, and commercial dispute strategy.",
    image: "firm-team.jpg",
    alt: "Chaman Law Firm lawyers reviewing arbitral award enforcement documents"
  }
];

const existingBlogRedirectSourcesRetained = new Set([
  "/child-support-and-maintenance-payment",
  "/how-do-i-draft-tenancy-agreement-in-lagos",
  "/legal-obligations-for-debt-collectors"
]);

const sprint11tRedirects = [
  ...sprint11tPages
    .filter((page) => !existingBlogRedirectSourcesRetained.has(page.oldUrl))
    .map((page) => ({
      oldUrl: page.oldUrl,
      target: `/practice-areas/${page.area}/${page.slug}`,
      type: "new or tightened restored service/static target"
    })),
  { oldUrl: "/corporate-affairs-commission-in-nigeria", target: "/practice-areas/corporate-commercial-law/cac-compliance-and-company-records", type: "older broad redirect tightened in place" },
  { oldUrl: "/business-law-advisory", target: "/practice-areas/corporate-commercial-law/company-startup-compliance-advisory", type: "exact redirect to existing Sprint 11T service target" },
  { oldUrl: "/regulatory-compliance-nigeria", target: "/practice-areas/corporate-commercial-law/regulatory-bodies-compliance", type: "exact redirect to existing strong Sprint 11S target" },
  { oldUrl: "/regulations-understanding-of-nigerian-employment", target: "/practice-areas/employment-law/workplace-compliance-advisory", type: "older broad redirect tightened in place" },
  { oldUrl: "/roles-of-a-mediator", target: "/practice-areas/adr-mediation/mediator-selection-and-quality-advisory", type: "older broad redirect tightened in place" }
];

const getRecordValue = (record, keys) => {
  for (const key of keys) {
    if (record[key]) return record[key];
  }
  return "";
};

const inventorySources = [
  "SPRINT-11S-DEEP-LEGACY-RECOVERY-INVENTORY.csv",
  "SPRINT-11R-DEEP-LEGACY-404-RECOVERY-INVENTORY.csv",
  "SPRINT-11D-HIGH-PRIORITY-404-RESCUE-LIST.csv",
  "SPRINT-10D-DEEP-LEGACY-404-INVENTORY.csv",
  "SPRINT-10C-EMERGENCY-404-INVENTORY.csv",
  "SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv"
];

const inventorySeen = new Set();
const inventoryRows = [];

for (const fileName of inventorySources) {
  for (const record of readCsv(fileName)) {
    const oldUrl = getRecordValue(record, ["old URL", "old url", "legacy URL", "URL", "url", "source"]);
    if (!oldUrl || inventorySeen.has(oldUrl)) continue;
    inventorySeen.add(oldUrl);
    inventoryRows.push({
      "old URL": oldUrl,
      "old title": getRecordValue(record, ["old title", "title"]) || slugTitle(oldUrl),
      "old content type": getRecordValue(record, ["old content type", "page type"]) || "legacy legal content",
      "current status": getRecordValue(record, ["current live status", "current status"]) || "unknown from local evidence",
      clicks: getRecordValue(record, ["clicks"]) || "",
      impressions: getRecordValue(record, ["impressions"]) || "",
      "average position": getRecordValue(record, ["average position"]) || "",
      "backlink/ranking evidence if available": getRecordValue(record, ["backlink/ranking evidence", "GSC evidence"]) || "not available locally",
      "source body found": getRecordValue(record, ["source body found"]) || "attempted from prior inventories",
      "source body quality": getRecordValue(record, ["source body quality"]) || "requires review before publication",
      "image found": getRecordValue(record, ["image found", "old image availability"]) || "not confirmed",
      "current Sanity status": getRecordValue(record, ["current Sanity status", "Sanity status"]) || "unknown",
      "current redirect status": getRecordValue(record, ["current redirect status", "redirect target"]) || "needs exact review",
      "sitemap status": getRecordValue(record, ["sitemap status"]) || "not confirmed",
      "page type": getRecordValue(record, ["page type"]) || "blog/static/service candidate",
      "legal risk": getRecordValue(record, ["legal risk", "legal safety status"]) || "requires lawyer-safe review",
      "current-law risk": getRecordValue(record, ["current-law risk"]) || "requires current-law review",
      "duplicate/cannibalization risk": getRecordValue(record, ["duplicate/cannibalization risk"]) || "requires check",
      "business value": getRecordValue(record, ["business value"]) || "legacy SEO/business relevance under review",
      "recommended recovery path": getRecordValue(record, ["recommended recovery path", "recovery classification"]) || "defer for recovery review",
      "proposed final URL": getRecordValue(record, ["proposed final URL", "best new route"]) || "",
      "priority score": getRecordValue(record, ["priority score"]) || "",
      notes: `Imported from ${fileName}; Sprint 11T documented status without publishing hidden content.`
    });
    if (inventoryRows.length >= 500) break;
  }
  if (inventoryRows.length >= 500) break;
}

writeCsv(
  "SPRINT-11T-AGGRESSIVE-LEGACY-404-RECOVERY-INVENTORY.csv",
  [
    "old URL",
    "old title",
    "old content type",
    "current status",
    "clicks",
    "impressions",
    "average position",
    "backlink/ranking evidence if available",
    "source body found",
    "source body quality",
    "image found",
    "current Sanity status",
    "current redirect status",
    "sitemap status",
    "page type",
    "legal risk",
    "current-law risk",
    "duplicate/cannibalization risk",
    "business value",
    "recommended recovery path",
    "proposed final URL",
    "priority score",
    "notes"
  ],
  inventoryRows
);

writeCsv(
  "SPRINT-11T-STATIC-SERVICE-AUTHORITY-EXPANSION.csv",
  [
    "old URL",
    "old title",
    "current status",
    "current redirect target if any",
    "proposed final URL",
    "page type",
    "H1",
    "SEO title",
    "meta description",
    "canonical",
    "required content sections",
    "CTA",
    "internal links",
    "image recommendation",
    "alt text",
    "legal review status",
    "content readiness",
    "sitemap readiness",
    "redirect plan",
    "publish readiness",
    "notes"
  ],
  sprint11tPages.map((page) => ({
    "old URL": asUrl(page.oldUrl),
    "old title": page.title,
    "current status": "legacy source targeted for exact recovery",
    "current redirect target if any": existingBlogRedirectSourcesRetained.has(page.oldUrl)
      ? "existing approved blog redirect retained; no Sprint 11T service redirect configured for this old URL"
      : "older broad redirect tightened in place where present; no duplicate source rule kept",
    "proposed final URL": `${site}/practice-areas/${page.area}/${page.slug}`,
    "page type": page.type,
    H1: page.title,
    "SEO title": `${page.title} | Chaman Law Firm`,
    "meta description": page.description,
    canonical: `${site}/practice-areas/${page.area}/${page.slug}`,
    "required content sections": "service overview; key points; process; FAQs; practice area context; consultation CTA",
    CTA: "Book Consultation; WhatsApp; Contact",
    "internal links": `${site}/practice-areas/${page.area}; ${site}/consultation; ${site}/contact`,
    "image recommendation": page.image,
    "alt text": page.alt,
    "legal review status": "public-safe service guidance; no result guarantee; fact-specific advice required",
    "content readiness": "implemented in src/data/practice-areas.ts",
    "sitemap readiness": "included by service-page sitemap generator after deployment",
    "redirect plan": existingBlogRedirectSourcesRetained.has(page.oldUrl)
      ? "no new service redirect; existing approved blog target retained"
      : `${asUrl(page.oldUrl)} -> ${site}/practice-areas/${page.area}/${page.slug}`,
    "publish readiness": "Go after lint, build, deployment, and live QA",
    notes: "Restored as static/service authority page instead of publishing weak or legally sensitive legacy blog body."
  }))
);

const blogSources = [
  "SPRINT-11S-BLOG-DEEP-REPAIR-BATCH.csv",
  "SPRINT-11R-BLOG-DEEP-BODY-RECOVERY-AND-REVIVAL.csv",
  "SPRINT-11R-CONTROLLED-BLOG-APPROVAL-BATCH.csv"
];

const blogSeen = new Set();
const blogRows = [];

for (const fileName of blogSources) {
  for (const record of readCsv(fileName)) {
    const oldUrl = getRecordValue(record, ["old URL", "url"]);
    if (!oldUrl || blogSeen.has(oldUrl)) continue;
    blogSeen.add(oldUrl);
    const title = getRecordValue(record, ["title", "old title"]) || slugTitle(oldUrl);
    const slug = getRecordValue(record, ["slug"]) || oldUrl.replace(site, "").replace(/^\/|\/$/g, "");
    blogRows.push({
      priority: blogRows.length + 1,
      "old URL": oldUrl,
      slug,
      title,
      "source body recovery": getRecordValue(record, ["source body recovery", "source body found"]) || "recovery attempted from prior local inventory",
      "source body quality": getRecordValue(record, ["source body quality"]) || "requires article-level lawyer/editorial review",
      "plugin debris cleanup": "required before approval; no Sprint 11T approval without clean body",
      "formatting repair": "required before approval",
      "answer-first intro": "recommended where legally safe",
      CTA: "required before approval",
      "internal links": "required before approval",
      image: getRecordValue(record, ["image"]) || "image recovery/verification required",
      "alt text": getRecordValue(record, ["alt text"]) || "required before approval",
      "SEO title": getRecordValue(record, ["SEO title"]) || title,
      "meta description": getRecordValue(record, ["meta description"]) || "required before approval",
      canonical: `${site}/resources/blog/${slug}`,
      author: publicAuthor,
      category: getRecordValue(record, ["category"]) || "legal education",
      "legal risk": getRecordValue(record, ["legal risk"]) || "requires lawyer-safe review",
      "current-law risk": getRecordValue(record, ["current-law risk"]) || "requires current-law review",
      "duplicate risk": getRecordValue(record, ["duplicate risk", "duplicate/cannibalization risk"]) || "requires cannibalization check",
      "approval readiness": "not approved in Sprint 11T",
      notes: `Deep-repair queue from ${fileName}; kept hidden until all gates pass.`
    });
    if (blogRows.length >= 200) break;
  }
  if (blogRows.length >= 200) break;
}

writeCsv(
  "SPRINT-11T-BLOG-REVIVAL-DEEP-REPAIR-BATCH.csv",
  [
    "priority",
    "old URL",
    "slug",
    "title",
    "source body recovery",
    "source body quality",
    "plugin debris cleanup",
    "formatting repair",
    "answer-first intro",
    "CTA",
    "internal links",
    "image",
    "alt text",
    "SEO title",
    "meta description",
    "canonical",
    "author",
    "category",
    "legal risk",
    "current-law risk",
    "duplicate risk",
    "approval readiness",
    "notes"
  ],
  blogRows
);

writeCsv(
  "SPRINT-11T-CONTROLLED-BLOG-APPROVAL-BATCH.csv",
  [
    "old URL",
    "slug",
    "title",
    "approval decision",
    "reason",
    "author",
    "image status",
    "legal status",
    "redirect status",
    "sitemap status",
    "notes"
  ],
  blogRows.slice(0, 30).map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    "approval decision": "deferred",
    reason: "Sprint 11T focused on static/service recovery; blog approval blocked until source body, image, alt text, legal-current review, and cannibalization gates pass.",
    author: publicAuthor,
    "image status": row.image,
    "legal status": row["legal risk"],
    "redirect status": "no redirect to hidden draft",
    "sitemap status": "excluded while hidden",
    notes: "No blog post was approved automatically."
  }))
);

writeCsv(
  "SPRINT-11T-REDIRECT-RESCUE-AND-404-REDUCTION.csv",
  [
    "old URL",
    "new URL",
    "redirect type",
    "source handling",
    "target status",
    "sitemap status",
    "chain/loop/homepage-dump risk",
    "hidden draft risk",
    "Chaman Properties risk",
    "activation status",
    "notes"
  ],
  sprint11tRedirects.map((redirect) => ({
    "old URL": asUrl(redirect.oldUrl),
    "new URL": `${site}${redirect.target}`,
    "redirect type": "one-hop 308",
    "source handling": redirect.type,
    "target status": "target route implemented or already live equivalent; verify live after deployment",
    "sitemap status": "expected in service-page sitemap after deployment",
    "chain/loop/homepage-dump risk": "none intended; exact target only",
    "hidden draft risk": "none - static/service page target, not hidden Sanity draft",
    "Chaman Properties risk": "none detected in target or content",
    "activation status": "configured in next.config.mjs",
    notes: "Sprint 11T exact redirect rescue; slash and non-slash variants generated."
  }))
);

writeCsv(
  "SPRINT-11T-SEO-AEO-GEO-ENHANCEMENT.csv",
  [
    "URL",
    "search intent answered early",
    "clear H1",
    "SEO title",
    "meta description",
    "canonical",
    "internal links",
    "CTA",
    "image and alt text",
    "FAQ/short answer",
    "keyword stuffing",
    "unsupported legal claim",
    "duplicate/cannibalization",
    "sitemap inclusion",
    "old URL redirect/canonical strategy",
    "topic cluster relevance",
    "AEO readiness",
    "GEO/local Nigerian legal relevance",
    "notes"
  ],
  sprint11tPages.map((page) => ({
    URL: `${site}/practice-areas/${page.area}/${page.slug}`,
    "search intent answered early": "yes - summary and service overview",
    "clear H1": page.title,
    "SEO title": `${page.title} | Chaman Law Firm`,
    "meta description": page.description,
    canonical: `${site}/practice-areas/${page.area}/${page.slug}`,
    "internal links": "practice area, consultation, contact, and global CTA paths",
    CTA: "Book Consultation / WhatsApp / Contact",
    "image and alt text": page.alt,
    "FAQ/short answer": "yes - service FAQ and fact-specific advice caveat",
    "keyword stuffing": "not used",
    "unsupported legal claim": "none intentionally added",
    "duplicate/cannibalization": "low - service page route selected where it improves broad redirect recovery",
    "sitemap inclusion": "expected after deployment",
    "old URL redirect/canonical strategy": existingBlogRedirectSourcesRetained.has(page.oldUrl)
      ? "no new service redirect; existing approved blog target retained for the legacy URL"
      : `${asUrl(page.oldUrl)} -> ${site}/practice-areas/${page.area}/${page.slug}; canonical stays final URL`,
    "topic cluster relevance": page.area,
    "AEO readiness": "yes - concise summary, key points, process, FAQ",
    "GEO/local Nigerian legal relevance": "yes - Nigerian legal service framing",
    notes: "SEO/AEO/GEO enhancement implemented without unsupported legal claims."
  }))
);

fs.writeFileSync(
  path.join(docsDir, "SPRINT-11T-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  `# Sprint 11T Fresh Search Evidence Status

No fresh post-launch Google Search Console, Bing Webmaster, backlink, featured-snippet, or SERP export was found locally during Sprint 11T.

Sprint 11T therefore used existing local GSC exports, Sprint 11D through Sprint 11S recovery inventories, redirect configuration, sitemap behavior, and business-value/legal-practice relevance to prioritize the recovery batch.

Manual follow-up remains required:

- Export fresh Google Search Console Pages performance.
- Export fresh Google Search Console Not Found / 404 URLs.
- Export fresh Google Search Console Page with Redirect and Redirect Error reports.
- Export Bing crawl and index warnings.
- Export backlink data from Ahrefs, Semrush, Moz, Ubersuggest, or another approved source if available.
- Provide any featured-snippet or live SERP screenshots for ranking URLs.

Hidden drafts and deferred URLs must not be submitted for indexing.
`,
  "utf8"
);

fs.writeFileSync(
  path.join(docsDir, "SPRINT-11T-GSC-BING-INDEXING-PACK.md"),
  `# Sprint 11T GSC/Bing Indexing Pack

Use only verified live URLs after deployment. Do not submit hidden drafts, 404 URLs, or URLs whose target is not canonical-safe.

## Production Sitemap

- ${site}/sitemap.xml

## Newly Restored Static/Service URLs To Inspect

${sprint11tPages.map((page) => `- ${site}/practice-areas/${page.area}/${page.slug}`).join("\n")}

## Exact Old URLs To Inspect After Redirect QA

${sprint11tRedirects.map((redirect) => `- ${asUrl(redirect.oldUrl)} -> ${site}${redirect.target}`).join("\n")}

## Google Search Console Steps

1. Resubmit ${site}/sitemap.xml.
2. Inspect each newly restored service URL after live QA confirms 200.
3. Inspect each old URL only after redirect QA confirms one-hop 308 to a 200 target.
4. Request indexing for the final live URLs where available.
5. Do not submit deferred blog candidates or hidden draft URLs.

## Bing Webmaster Steps

1. Resubmit ${site}/sitemap.xml.
2. Inspect the newly restored service URLs.
3. Inspect exact old redirected URLs only after live redirect QA passes.
4. Monitor crawl errors for chains, loops, 404 targets, or soft-404 behavior.
`,
  "utf8"
);

fs.writeFileSync(
  path.join(docsDir, "SPRINT-11T-LAWZANA-BADGE-QA.md"),
  `# Sprint 11T Lawzana Badge QA

- Profile URL: ${"https://lawzana.com/lawyer/chaman-law-firm"}
- Profile URL tested locally: no - automated HTTPS request returned Cloudflare challenge / 403
- Badge SVG: ${"https://lawzana.com/assets/badges/verified-law-firm.svg?v=2"}
- Badge SVG tested locally: yes - asset returned 200 OK and image/svg+xml
- Homepage placement: deferred
- Visible label planned: Verified Law Firm on Lawzana
- Alt text planned: Chaman Law Firm verified on Lawzana
- Aria label planned: View Chaman Law Firm profile on Lawzana
- Mobile display check: deferred because profile link could not be verified
- Desktop display check: deferred because profile link could not be verified
- Performance concern: none from code because badge was not shipped
- Final recommendation: defer the homepage badge until the Principal or a normal browser session confirms the Lawzana profile URL opens successfully for users
`,
  "utf8"
);

fs.writeFileSync(
  path.join(docsDir, "SPRINT-11T-RESULT.json"),
  `${JSON.stringify(
    {
      sprint: "11T",
      generatedAt: new Date().toISOString(),
      inventoryRows: inventoryRows.length,
      staticServicePagesImplemented: sprint11tPages.length,
      exactRedirectSourcesConfigured: sprint11tRedirects.length,
      blogCandidatesDeepReviewed: blogRows.length,
      blogPostsApproved: 0,
      publicAuthorRule: publicAuthor,
      lawzanaBadgeAdded: false,
      lawzanaBadgeDeferredReason: "Automated QA confirmed the SVG badge asset returns 200, but the profile URL returned a Cloudflare challenge / 403.",
      safetyNotes: [
        "No DNS, Hostinger, Chaman Properties, secrets, backups, SQL dumps, wp-config.php, or wp-content folders touched.",
        "No hidden drafts were approved or redirected.",
        "Redirects point to service/static targets or existing strong live equivalents, not homepage fallbacks."
      ]
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`Sprint 11T report pack generated: ${inventoryRows.length} inventory rows, ${sprint11tPages.length} service pages, ${sprint11tRedirects.length} redirect sources, ${blogRows.length} blog candidates.`);
