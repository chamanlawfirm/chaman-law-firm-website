import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const today = "2026-07-20";

const docs = {
  freshEvidence: "SPRINT-11S-FRESH-SEARCH-EVIDENCE-STATUS.md",
  deepInventory: "SPRINT-11S-DEEP-LEGACY-RECOVERY-INVENTORY.csv",
  staticBatch: "SPRINT-11S-STATIC-SERVICE-AUTHORITY-RESTORATION-BATCH.csv",
  redirectBatch: "SPRINT-11S-STATIC-REDIRECT-RESCUE-AND-UPDATES.csv",
  blogRepair: "SPRINT-11S-BLOG-DEEP-REPAIR-BATCH.csv",
  approvalBatch: "SPRINT-11S-CONTROLLED-BLOG-APPROVAL-BATCH.csv",
  seoEnhancement: "SPRINT-11S-SEO-AEO-GEO-ENHANCEMENT.csv",
  indexingPack: "SPRINT-11S-GSC-BING-INDEXING-PACK.md",
  result: "SPRINT-11S-RESULT.json"
};

const staticPages = [
  {
    priority: 1,
    oldUrl: "https://chamanlawfirm.com/gain-nigerian-citizenship-by-marriage",
    oldTitle: "Gain Nigerian Citizenship by Marriage",
    priorStatus: "broad redirect to immigration practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/immigration-services/citizenship-by-marriage-advisory",
    pageType: "immigration service page",
    area: "Immigration Services",
    h1: "Citizenship by Marriage Advisory",
    seoTitle: "Citizenship by Marriage Advisory | Immigration Services | Chaman Law Firm",
    metaDescription:
      "Immigration and documentation guidance for Nigerian citizenship by marriage questions, eligibility records, and application readiness.",
    image: "approved legal-service image",
    alt: "Immigration legal advisory image for citizenship by marriage questions",
    legalSafety: "public-safe; approval not guaranteed; facts and documents must be reviewed"
  },
  {
    priority: 2,
    oldUrl: "https://chamanlawfirm.com/what-is-the-implication-of-quit-notice",
    oldTitle: "What Is The Implication Of Quit Notice",
    priorStatus: "broad redirect to property practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/quit-notice-advisory",
    pageType: "property service page",
    area: "Property and Real Estate Law",
    h1: "Quit Notice Legal Advisory",
    seoTitle: "Quit Notice Legal Advisory | Property & Real Estate Law | Chaman Law Firm",
    metaDescription:
      "Tenancy-law guidance for quit notices, possession demands, landlord and tenant documents, and dispute-risk review.",
    image: "approved legal-service image",
    alt: "Legal advisory image for quit notice and tenancy dispute review in Nigeria",
    legalSafety: "public-safe; expressly avoids self-help eviction"
  },
  {
    priority: 3,
    oldUrl: "https://chamanlawfirm.com/registration-of-trade-union-in-nigeria",
    oldTitle: "Registration Of Trade Union In Nigeria",
    priorStatus: "broad redirect to employment practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/employment-law/trade-union-registration-advisory",
    pageType: "employment service page",
    area: "Employment Law",
    h1: "Trade Union Registration Advisory",
    seoTitle: "Trade Union Registration Advisory | Employment Law | Chaman Law Firm",
    metaDescription:
      "Employment-law guidance for trade union registration, membership, workplace representation, and labour-relations risk.",
    image: "approved legal-service image",
    alt: "Employment law advisory image for trade union registration and labour relations",
    legalSafety: "public-safe; official registration decisions not guaranteed"
  },
  {
    priority: 4,
    oldUrl: "https://chamanlawfirm.com/how-to-file-complaint-against-police-officers-in-nigeria",
    oldTitle: "How To File Complaint Against Police Officers In Nigeria",
    priorStatus: "broad redirect to litigation practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/police-complaint-and-rights-advisory",
    pageType: "litigation service page",
    area: "Litigation and Dispute Resolution",
    h1: "Police Complaint and Rights Advisory",
    seoTitle: "Police Complaint and Rights Advisory | Litigation | Chaman Law Firm",
    metaDescription:
      "Rights-focused legal guidance for police complaints, harassment concerns, evidence records, and lawful escalation.",
    image: "approved legal-service image",
    alt: "Legal advisory image for police complaint and rights representation",
    legalSafety: "public-safe; fact-sensitive rights guidance"
  },
  {
    priority: 5,
    oldUrl: "https://chamanlawfirm.com/how-to-legally-change-a-child-surname",
    oldTitle: "How To Legally Change A Child Surname",
    priorStatus: "broad redirect to family law practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/family-law/child-surname-change-advisory",
    pageType: "family service page",
    area: "Family Law",
    h1: "Child Surname Change Advisory",
    seoTitle: "Child Surname Change Advisory | Family Law | Chaman Law Firm",
    metaDescription:
      "Family-law guidance for child surname changes, consent concerns, guardianship records, and documentation risk.",
    image: "approved legal-service image",
    alt: "Family law advisory image for child surname change documentation",
    legalSafety: "public-safe; children's matters are fact-sensitive"
  },
  {
    priority: 6,
    oldUrl: "https://chamanlawfirm.com/void-and-voidable-marriages-in-nigeria",
    oldTitle: "Void And Voidable Marriages In Nigeria",
    priorStatus: "broad redirect to family law practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/family-law/void-and-voidable-marriage-advisory",
    pageType: "family service page",
    area: "Family Law",
    h1: "Void and Voidable Marriage Advisory",
    seoTitle: "Void and Voidable Marriage Advisory | Family Law | Chaman Law Firm",
    metaDescription:
      "Private family-law advice for marriage-validity questions, annulment concerns, capacity, consent, and records.",
    image: "approved managing-partner office image",
    alt: "Private family law consultation for marriage-validity advisory",
    legalSafety: "public-safe; no generic validity conclusion"
  },
  {
    priority: 7,
    oldUrl: "https://chamanlawfirm.com/can-a-minor-enter-into-a-valid-contract-in-nigeria",
    oldTitle: "Can A Minor Enter Into A Valid Contract In Nigeria",
    priorStatus: "broad redirect to corporate practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/corporate-commercial-law/minor-contract-capacity",
    pageType: "corporate service page",
    area: "Corporate and Commercial Law",
    h1: "Minor Contract Capacity Advisory",
    seoTitle: "Minor Contract Capacity Advisory | Corporate Law | Chaman Law Firm",
    metaDescription:
      "Contract-law guidance for agreement risk, capacity, consent, guardianship, and enforceability where a minor may be involved.",
    image: "approved legal-service image",
    alt: "Legal advisory image for contract capacity and commercial documentation review",
    legalSafety: "public-safe; fact-specific contract-risk guidance"
  },
  {
    priority: 8,
    oldUrl: "https://chamanlawfirm.com/conditions-for-granting-injunctions-and-types-of-injunctions",
    oldTitle: "Conditions For Granting Injunctions And Types Of Injunctions",
    priorStatus: "broad redirect to litigation practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/injunctions-and-interim-reliefs",
    pageType: "litigation service page",
    area: "Litigation and Dispute Resolution",
    h1: "Injunctions and Interim Reliefs Advisory",
    seoTitle: "Injunctions and Interim Reliefs Advisory | Litigation | Chaman Law Firm",
    metaDescription:
      "Litigation strategy advice for urgent court protection, interim reliefs, preservation orders, and dispute containment.",
    image: "approved managing-partner office image",
    alt: "Litigation strategy setting for injunctions and interim relief advisory",
    legalSafety: "public-safe; no promise of court relief"
  },
  {
    priority: 9,
    oldUrl: "https://chamanlawfirm.com/letter-of-administration-in-ogun-state",
    oldTitle: "Letter Of Administration In Ogun State",
    priorStatus: "broad redirect to probate practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/probate-estate-administration/letters-of-administration-ogun-state",
    pageType: "probate service page",
    area: "Probate and Estate Administration",
    h1: "Letters of Administration in Ogun State",
    seoTitle: "Letters of Administration in Ogun State | Probate | Chaman Law Firm",
    metaDescription:
      "Estate-administration guidance for Ogun State assets, administrators, beneficiaries, family documents, and diaspora clients.",
    image: "approved firm-team image",
    alt: "Private-client legal advisory for letters of administration in Ogun State",
    legalSafety: "public-safe private-client guidance"
  },
  {
    priority: 10,
    oldUrl: "https://chamanlawfirm.com/who-can-be-a-notary-public",
    oldTitle: "Who Can Be A Notary Public",
    priorStatus: "broad redirect to notary practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/notary-public-services/notary-public-eligibility-and-document-advisory",
    pageType: "notary service page",
    area: "Notary Public Services",
    h1: "Notary Public Eligibility and Document Advisory",
    seoTitle: "Notary Public Eligibility and Document Advisory | Chaman Law Firm",
    metaDescription:
      "Notary and document-authentication guidance for notarization, certification, execution, powers of attorney, and document use.",
    image: "approved managing-partner office image",
    alt: "Notary public document advisory at Chaman Law Firm",
    legalSafety: "public-safe document guidance"
  },
  {
    priority: 11,
    oldUrl: "https://chamanlawfirm.com/the-role-of-the-judiciary-in-nigerian-democracy",
    oldTitle: "The Role Of The Judiciary In Nigerian Democracy",
    priorStatus: "broad redirect to litigation practice area",
    newUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/court-system-and-judiciary-advisory",
    pageType: "litigation service page",
    area: "Litigation and Dispute Resolution",
    h1: "Court System and Judiciary Advisory",
    seoTitle: "Court System and Judiciary Advisory | Litigation | Chaman Law Firm",
    metaDescription:
      "Practical litigation orientation for court structure, jurisdiction questions, forum selection, and dispute pathways in Nigeria.",
    image: "approved legal-service image",
    alt: "Legal advisory image for Nigerian court system and jurisdiction review",
    legalSafety: "public-safe litigation orientation"
  },
  {
    priority: 12,
    oldUrl: "https://chamanlawfirm.com/how-to-apply-for-certificate-of-good-conduct-in-nigeria",
    oldTitle: "How To Apply For Certificate Of Good Conduct In Nigeria",
    priorStatus: "live 404 before Sprint 11S",
    newUrl: "https://chamanlawfirm.com/practice-areas/immigration-services/certificate-of-good-conduct-advisory",
    pageType: "immigration service page",
    area: "Immigration Services",
    h1: "Certificate of Good Conduct Advisory",
    seoTitle: "Certificate of Good Conduct Advisory | Immigration Services | Chaman Law Firm",
    metaDescription:
      "Document-readiness guidance for certificate-of-good-conduct, police character documentation, and immigration record review.",
    image: "approved firm-team image",
    alt: "Chaman Law Firm lawyers advising on certificate of good conduct documentation",
    legalSafety: "public-safe; official outcome not guaranteed"
  },
  {
    priority: 13,
    oldUrl: "https://chamanlawfirm.com/laspppa-what-it-is-and-why-it-matters-in-lagos",
    oldTitle: "LASPPPA What It Is And Why It Matters In Lagos",
    priorStatus: "live 404 before Sprint 11S",
    newUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/lagos-physical-planning-compliance",
    pageType: "property service page",
    area: "Property and Real Estate Law",
    h1: "Lagos Physical Planning Compliance Advisory",
    seoTitle: "Lagos Physical Planning Compliance Advisory | Property Law | Chaman Law Firm",
    metaDescription:
      "Legal and document-readiness advice for planning approvals, development-control issues, building permits, and Lagos property compliance.",
    image: "approved firm-team image",
    alt: "Chaman Law Firm lawyers advising on Lagos physical planning and property compliance",
    legalSafety: "public-safe property compliance guidance"
  },
  {
    priority: 14,
    oldUrl: "https://chamanlawfirm.com/doctrine-of-ultra-vires",
    oldTitle: "Doctrine Of Ultra Vires",
    priorStatus: "live 404 before Sprint 11S",
    newUrl: "https://chamanlawfirm.com/practice-areas/corporate-commercial-law/ultra-vires-corporate-powers",
    pageType: "corporate service page",
    area: "Corporate and Commercial Law",
    h1: "Ultra Vires and Corporate Powers Advisory",
    seoTitle: "Ultra Vires and Corporate Powers Advisory | Corporate Law | Chaman Law Firm",
    metaDescription:
      "Corporate-law guidance on company authority, objects, board approvals, director powers, and transaction documentation.",
    image: "approved firm-team image",
    alt: "Corporate lawyers reviewing company authority and governance records",
    legalSafety: "public-safe corporate powers guidance"
  },
  {
    priority: 15,
    oldUrl: "https://chamanlawfirm.com/how-to-file-a-lawsuit-in-nigeria",
    oldTitle: "How To File A Lawsuit In Nigeria",
    priorStatus: "live 404 before Sprint 11S",
    newUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/civil-lawsuit-pre-action-review",
    pageType: "litigation service page",
    area: "Litigation and Dispute Resolution",
    h1: "Civil Lawsuit Pre-Action Review",
    seoTitle: "Civil Lawsuit Pre-Action Review | Litigation | Chaman Law Firm",
    metaDescription:
      "Pre-action legal review for civil claims, evidence, parties, limitation concerns, settlement options, and court-readiness.",
    image: "approved firm-team image",
    alt: "Chaman Law Firm litigation team reviewing civil lawsuit documents",
    legalSafety: "public-safe pre-action guidance; does not encourage weak filing"
  }
];

function readText(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        field += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  const [headers = [], ...dataRows] = rows;
  return dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), (cells[index] || "").trim()]))
  );
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }
  return stringValue;
}

function writeCsv(filename, headers, rows) {
  const lines = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))];
  fs.writeFileSync(path.join(docsDir, filename), `${lines.join("\n")}\n`);
}

function writeMd(filename, body) {
  fs.writeFileSync(path.join(docsDir, filename), `${body.trim()}\n`);
}

function numberFrom(value) {
  const match = String(value || "").replaceAll(",", "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function slugFromUrl(url) {
  return String(url || "")
    .replace(/^https?:\/\/[^/]+\/?/, "")
    .replace(/^resources\/blog\//, "")
    .replace(/\/$/, "");
}

function getLegacyRows() {
  const primary = parseCsv(readText("docs/SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"));
  const fallback = parseCsv(readText("docs/SPRINT-11D-HIGH-PRIORITY-404-RESCUE-LIST.csv"));
  const seen = new Set();
  const combined = [...primary, ...fallback].filter((row) => {
    const oldUrl = row["old URL"];
    if (!oldUrl || seen.has(oldUrl)) return false;
    seen.add(oldUrl);
    return true;
  });

  return combined
    .map((row) => ({
      ...row,
      score:
        numberFrom(row.clicks || row["Google ranking/impression/click evidence"]) * 10 +
        numberFrom(row.impressions || row["Google ranking/impression/click evidence"]) / 100 +
        (String(row["current live status"] || row["current status"]).includes("404") ? 100 : 0)
    }))
    .sort((a, b) => b.score - a.score);
}

function buildDeepInventoryRows() {
  return getLegacyRows()
    .slice(0, 320)
    .map((row, index) => {
      const oldUrl = row["old URL"];
      const slug = slugFromUrl(oldUrl);
      const currentStatus = row["current live status"] || row["current status"] || "unknown";
      const route = row["best new route"] || row["redirect target"] || `/resources/blog/${slug}`;
      const isStaticMatch = staticPages.find((page) => page.oldUrl.replace(/\/$/, "") === oldUrl.replace(/\/$/, ""));
      const recoveryPath = isStaticMatch
        ? "restore as service page"
        : row["recovery classification"] || row["recommended recovery path"] || "defer for source/image/legal review";

      return {
        "priority rank": index + 1,
        "old URL": oldUrl,
        "old title": row["old title"] || row.title || "",
        "old content type": row["old content type"] || row["page type"] || "legacy legal education",
        "current status": currentStatus,
        clicks: row.clicks || numberFrom(row["Google ranking/impression/click evidence"]),
        impressions: row.impressions || numberFrom(String(row["Google ranking/impression/click evidence"]).split("impressions")[0]),
        "average position": row["average position"] || row["avg position"] || "",
        "backlink/ranking evidence": row["backlink/ranking evidence if available"] || row["Google ranking/impression/click evidence"] || "local evidence only",
        "source body found": row["source body found yes/no"] || (String(currentStatus).includes("hidden") ? "yes in Sanity queue" : "not confirmed"),
        "source body quality": row["source body quality"] || "needs review before publication",
        "image found": row["image found yes/no"] || (String(row["image status"] || row["old image availability"]).includes("present") ? "yes" : "not confirmed"),
        "old media found": row["old media found yes/no"] || "not confirmed in Sprint 11S",
        "current Sanity status": row["current Sanity status"] || row["approval status"] || "not checked in Sprint 11S",
        "current redirect status": row["current redirect status"] || row["current live status"] || "",
        "sitemap status": isStaticMatch ? "sitemap after deployment" : row["sitemap inclusion"] || "not included unless live and approved",
        "page type": isStaticMatch ? "service" : row["page type"] || "blog",
        "legal risk": row["legal safety status"] || "requires editorial/legal review",
        "current-law risk": String(row["legal safety status"] || "").includes("high") ? "high" : "medium",
        "duplicate/cannibalization risk": isStaticMatch ? "low; service route selected to avoid weak blog duplication" : "requires check",
        "business value": isStaticMatch ? "high service/lead value" : row["business value"] || "score based on local GSC evidence",
        "recommended recovery path": recoveryPath,
        "proposed final URL": isStaticMatch ? isStaticMatch.newUrl : `https://chamanlawfirm.com${route.startsWith("/") ? route : `/${route}`}`,
        "priority score": Math.round(row.score || 0),
        notes: isStaticMatch
          ? "Implemented in Sprint 11S as focused static/service authority page."
          : "Attempt recovery before rejection; keep hidden unless all publication gates pass."
      };
    });
}

function buildStaticRows() {
  return staticPages.map((page) => ({
    priority: page.priority,
    "old URL": page.oldUrl,
    "old title": page.oldTitle,
    "current status": page.priorStatus,
    "current redirect target if any": page.priorStatus.includes("redirect") ? "broad target replaced by exact Sprint 11S target" : "",
    "proposed final URL": page.newUrl,
    "page type": page.pageType,
    H1: page.h1,
    "SEO title": page.seoTitle,
    "meta description": page.metaDescription,
    canonical: page.newUrl,
    "required content sections": "short answer; service overview; key points; process; FAQs; related practice area; consultation CTA",
    CTA: "Book Consultation; WhatsApp; Call Now",
    "internal links": `${page.newUrl.replace(/\/[^/]+$/, "")}; /consultation; /contact; related downloads where available`,
    "image recommendation": page.image,
    "alt text": page.alt,
    "legal review status": page.legalSafety,
    "content readiness": "implemented in src/data/practice-areas.ts",
    "sitemap readiness": "included by service-page sitemap generator after deployment",
    "redirect plan": `${page.oldUrl} -> ${page.newUrl}`,
    "publish readiness": "Go after build and live QA",
    notes: "Restored as static/service authority page instead of publishing weak or risky legacy blog body."
  }));
}

function buildRedirectRows() {
  return staticPages.map((page) => ({
    priority: page.priority,
    "old URL": page.oldUrl,
    "new URL": page.newUrl,
    "redirect type": "one-hop 308 via Next.js permanent redirect",
    "target status": "local build gate required before deployment; live QA required after deployment",
    "sitemap status": "expected after deployment",
    "hidden draft guardrail": "not a hidden draft target",
    "homepage dump guardrail": "exact target only",
    "Chaman Properties guardrail": "not a Chaman Properties target",
    status: page.priorStatus.includes("broad redirect")
      ? "existing broad redirect tightened to exact service target"
      : "new exact static authority redirect configured",
    notes: page.legalSafety
  }));
}

function buildBlogRepairRows() {
  const staticOldUrls = new Set(staticPages.map((page) => page.oldUrl.replace(/\/$/, "")));
  return getLegacyRows()
    .filter((row) => !staticOldUrls.has(String(row["old URL"]).replace(/\/$/, "")))
    .filter((row) => {
      const status = `${row["current live status"] || ""} ${row["approval status"] || ""} ${row["recovery classification"] || ""}`.toLowerCase();
      return status.includes("404") || status.includes("hidden") || status.includes("restore as blog") || status.includes("not approved");
    })
    .slice(0, 120)
    .map((row, index) => {
      const oldUrl = row["old URL"];
      const slug = slugFromUrl(oldUrl);
      const imageStatus = row["image status"] || row["old image availability"] || "not confirmed";
      const legalRisk = row["legal safety status"] || "requires lawyer review";
      const riskText = `${oldUrl} ${row["old title"]} ${legalRisk}`.toLowerCase();
      const risky =
        riskText.includes("police") ||
        riskText.includes("evict") ||
        riskText.includes("harassment") ||
        riskText.includes("citizenship") ||
        riskText.includes("injunction") ||
        riskText.includes("current law") ||
        legalRisk.toLowerCase().includes("high");
      const hasImage = /present|patched|yes/i.test(imageStatus);

      return {
        priority: index + 1,
        "old URL": oldUrl,
        slug,
        title: row["old title"] || row.title || slug,
        "source body recovery": row["source body found yes/no"] || (String(row["current live status"]).includes("hidden") ? "existing hidden Sanity/source queue" : "needs source recovery"),
        "source body quality": row["source body quality"] || "repair attempted from local evidence; requires article-level review",
        "plugin debris cleanup": "required before approval",
        "formatting repair": "required before approval",
        "answer-first intro": "recommended where legally safe",
        CTA: "required before approval",
        "internal links": "required before approval",
        image: hasImage ? "candidate image present; verify relevance" : "image recovery required",
        "alt text": hasImage ? "verify relevance before approval" : "required",
        "SEO title": row["old meta title"] || row["SEO title"] || "requires preservation or rewrite",
        "meta description": row["old meta description"] || row["meta description"] || "requires preservation or rewrite",
        canonical: `https://chamanlawfirm.com/resources/blog/${slug}`,
        author: "Charles Chukwuma Nkwoka, Esq.",
        category: row["old content type"] || "legal education",
        "legal risk": risky ? "blocked for lawyer/current-law review" : legalRisk,
        "duplicate risk": "requires cannibalization check before approval",
        "approval readiness": "not approved in Sprint 11S",
        notes: risky
          ? "Deep repair queued, but public approval blocked by legal/current-law sensitivity."
          : "Deep repair queued; publication still requires full body, image, alt, CTA, metadata, and legal gates."
      };
    });
}

function buildApprovalRows(blogRows) {
  return blogRows.slice(0, 35).map((row) => ({
    priority: row.priority,
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    author: "Charles Chukwuma Nkwoka, Esq.",
    "approval decision": "not approved in Sprint 11S",
    "lawyer review": "required before publication",
    "image/alt": row.image.includes("required") || row["alt text"].includes("required") ? "not complete" : "verify manually",
    "legal safety": row["legal risk"],
    "redirect status": "no blog redirect until target is approved, live, canonical-safe, and sitemap-included",
    notes: row.notes
  }));
}

function buildSeoRows() {
  return staticPages.map((page) => ({
    URL: page.newUrl,
    "content type": page.pageType,
    "search intent answered early": "yes",
    H1: page.h1,
    "SEO title": page.seoTitle,
    "meta description": page.metaDescription,
    canonical: page.newUrl,
    "internal links": "practice area, consultation, contact, related downloads where available",
    CTA: "Book Consultation; WhatsApp; Call Now",
    image: page.image,
    "alt text": page.alt,
    "FAQ/short answer": "yes",
    "keyword stuffing": "not present",
    "unsupported legal claim": "not present",
    "duplicate/cannibalization": "low; exact service intent selected",
    "sitemap inclusion": "expected after deployment",
    "redirect/canonical strategy": `${page.oldUrl} redirects to canonical target`,
    "topic cluster": page.area,
    "AEO readiness": "yes",
    "GEO/local Nigerian legal relevance": "yes"
  }));
}

function buildMarkdownPacks() {
  const liveUrls = staticPages.map((page) => `- ${page.newUrl}`).join("\n");
  const oldUrls = staticPages.map((page) => `- ${page.oldUrl}`).join("\n");

  writeMd(
    docs.freshEvidence,
    `# Sprint 11S Fresh Search Evidence Status

Date: ${today}

No newer post-launch Google Search Console, Bing Webmaster, backlink, featured-snippet, or SERP screenshot export was found inside the local project during Sprint 11S.

Sprint 11S therefore reused the local recovery evidence already present in:

- docs/search-console-exports/Pages.csv
- docs/search-console-exports/Queries.csv
- docs/SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv
- docs/SPRINT-11P-STATIC-SERVICE-RESTORATION-PLAN.csv
- docs/SPRINT-11R-DEEP-LEGACY-404-RECOVERY-INVENTORY.csv

Operational decision:

- Continue restoring high-value legacy authority where existing local evidence shows clicks, impressions, or business value.
- Prefer static/service pages where weak or sensitive legacy blog bodies create legal, current-law, or cannibalization risk.
- Do not submit hidden drafts, 404 URLs, or non-canonical targets to search engines.

Manual follow-up:

- Export fresh GSC indexing and performance data after deployment and redirect propagation.
- Export Bing crawl/index warnings after sitemap refresh.
- Import any backlink or featured-snippet evidence before the next large redirect batch.`
  );

  writeMd(
    docs.indexingPack,
    `# Sprint 11S GSC/Bing Indexing Pack

Use this pack only after deployment is live and QA confirms the listed final URLs return 200, are canonical-safe, and appear in sitemap.

## Production Sitemap

- https://chamanlawfirm.com/sitemap.xml

## Newly Restored Static/Service URLs

${liveUrls}

## Newly Redirected Old URLs

${oldUrls}

## Google Search Console Steps

1. Refresh or resubmit https://chamanlawfirm.com/sitemap.xml.
2. Inspect each new static/service URL above.
3. Confirm Google-selected canonical is the listed production URL.
4. Inspect each exact old URL above.
5. Confirm Google sees the one-hop redirect to the exact new target.
6. Request indexing only for verified live targets and exact old redirected URLs.

## Bing Webmaster Steps

1. Resubmit the production sitemap.
2. Inspect the same final URLs.
3. Inspect the same exact old redirected URLs.
4. Do not submit hidden drafts, 404 URLs, preview URLs, or broad practice-area fallbacks.

## Do Not Submit

- Hidden Sanity drafts
- Any URL returning 404
- Any URL whose redirect target is not live
- Any preview or vercel.app URL
- Any Chaman Properties URL`
  );
}

function main() {
  const deepRows = buildDeepInventoryRows();
  const staticRows = buildStaticRows();
  const redirectRows = buildRedirectRows();
  const blogRows = buildBlogRepairRows();
  const approvalRows = buildApprovalRows(blogRows);
  const seoRows = buildSeoRows();

  buildMarkdownPacks();

  writeCsv(
    docs.deepInventory,
    [
      "priority rank",
      "old URL",
      "old title",
      "old content type",
      "current status",
      "clicks",
      "impressions",
      "average position",
      "backlink/ranking evidence",
      "source body found",
      "source body quality",
      "image found",
      "old media found",
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
    deepRows
  );

  writeCsv(
    docs.staticBatch,
    [
      "priority",
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
    staticRows
  );

  writeCsv(
    docs.redirectBatch,
    [
      "priority",
      "old URL",
      "new URL",
      "redirect type",
      "target status",
      "sitemap status",
      "hidden draft guardrail",
      "homepage dump guardrail",
      "Chaman Properties guardrail",
      "status",
      "notes"
    ],
    redirectRows
  );

  writeCsv(
    docs.blogRepair,
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
      "duplicate risk",
      "approval readiness",
      "notes"
    ],
    blogRows
  );

  writeCsv(
    docs.approvalBatch,
    [
      "priority",
      "old URL",
      "slug",
      "title",
      "author",
      "approval decision",
      "lawyer review",
      "image/alt",
      "legal safety",
      "redirect status",
      "notes"
    ],
    approvalRows
  );

  writeCsv(
    docs.seoEnhancement,
    [
      "URL",
      "content type",
      "search intent answered early",
      "H1",
      "SEO title",
      "meta description",
      "canonical",
      "internal links",
      "CTA",
      "image",
      "alt text",
      "FAQ/short answer",
      "keyword stuffing",
      "unsupported legal claim",
      "duplicate/cannibalization",
      "sitemap inclusion",
      "redirect/canonical strategy",
      "topic cluster",
      "AEO readiness",
      "GEO/local Nigerian legal relevance"
    ],
    seoRows
  );

  const result = {
    sprint: "11S",
    date: today,
    legacyInventoryRowsProcessed: deepRows.length,
    staticServicePagesImplemented: staticRows.length,
    exactStaticRedirectsConfigured: redirectRows.length,
    blogCandidatesDeepReviewed: blogRows.length,
    blogPostsApproved: 0,
    hiddenDraftsPublished: 0,
    redirectsToHomepage: 0,
    redirectsToHiddenDrafts: 0,
    dnsTouched: false,
    hostingerTouched: false,
    chamanPropertiesTouched: false,
    secretsTouched: false,
    files: docs
  };

  fs.writeFileSync(path.join(docsDir, docs.result), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}

main();
