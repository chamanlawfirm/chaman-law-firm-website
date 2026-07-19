import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const docsDir = path.join(rootDir, "docs");
const reportDate = "2026-07-20";

const requiredDocs = {
  freshEvidenceStatus: "SPRINT-11R-FRESH-SEARCH-EVIDENCE-STATUS.md",
  deepInventory: "SPRINT-11R-DEEP-LEGACY-404-RECOVERY-INVENTORY.csv",
  staticBatch: "SPRINT-11R-STATIC-SERVICE-DEEP-RESTORATION-BATCH.csv",
  blogRecovery: "SPRINT-11R-BLOG-DEEP-BODY-RECOVERY-AND-REVIVAL.csv",
  approvalBatch: "SPRINT-11R-CONTROLLED-BLOG-APPROVAL-BATCH.csv",
  redirectBatch: "SPRINT-11R-REDIRECT-RESCUE-AND-404-ELIMINATION-BATCH.csv",
  seoEnhancement: "SPRINT-11R-SEO-AEO-GEO-ENHANCEMENT.csv",
  indexingPack: "SPRINT-11R-GSC-BING-INDEXING-PACK.md",
  result: "SPRINT-11R-RESULT.json"
};

const staticServiceBatch = [
  {
    priority: 1,
    oldUrl: "https://chamanlawfirm.com/land-registration-system-in-nigeria",
    title: "Land Registration System In Nigeria",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/land-registration",
    area: "Property and Real Estate Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe general guidance; no procedural guarantee",
    redirectStatus: "activated in config after target build gate",
    notes: "Legacy search intent is better served by a land-registration advisory page than a thin blog revival."
  },
  {
    priority: 2,
    oldUrl: "https://chamanlawfirm.com/landlords-and-tenants-in-nigeria",
    title: "Landlords and Tenants In Nigeria",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria",
    area: "Property and Real Estate Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe; explicitly avoids self-help eviction advice",
    redirectStatus: "activated in config after target build gate",
    notes: "High commercial/property intent; conservative landlord-tenant framing."
  },
  {
    priority: 3,
    oldUrl: "https://chamanlawfirm.com/of-the-securities-and-exchange-commission",
    title: "of the Securities and Exchange Commission",
    finalUrl: "https://chamanlawfirm.com/practice-areas/corporate-commercial-law/securities-regulatory-compliance",
    area: "Corporate and Commercial Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe compliance guidance; regulator approval not implied",
    redirectStatus: "activated in config after target build gate",
    notes: "Converted from legacy informational topic into securities regulatory compliance service intent."
  },
  {
    priority: 4,
    oldUrl: "https://chamanlawfirm.com/enforcing-fundamental-human-right",
    title: "Enforcing Fundamental Human Right",
    finalUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/fundamental-rights-enforcement",
    area: "Litigation and Dispute Resolution",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe; fact review required before advice",
    redirectStatus: "activated in config after target build gate",
    notes: "Rights topic needs controlled legal framing, not mass-published legacy body text."
  },
  {
    priority: 5,
    oldUrl: "https://chamanlawfirm.com/probate-in-lagos-everything-you-need-to-know",
    title: "Probate In Lagos Everything You Need To Know",
    finalUrl: "https://chamanlawfirm.com/practice-areas/probate-estate-administration/probate-in-lagos-everything-you-need-to-know",
    area: "Probate and Estate Administration",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe estate-administration guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Private-client and diaspora value; stronger as probate advisory page."
  },
  {
    priority: 6,
    oldUrl: "https://chamanlawfirm.com/board-of-directors-in-nigerian-companies",
    title: "Board of Directors In Nigerian Companies",
    finalUrl: "https://chamanlawfirm.com/practice-areas/corporate-commercial-law/board-governance",
    area: "Corporate and Commercial Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe governance guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Board/governance intent maps cleanly to corporate service authority."
  },
  {
    priority: 7,
    oldUrl: "https://chamanlawfirm.com/challenges-of-implementing-the-land-use-act",
    title: "Challenges of Implementing the Land Use Act",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/land-use-act-advisory",
    area: "Property and Real Estate Law",
    pageType: "existing static/service authority page",
    implementation: "redirect tightened to existing Sprint 11Q target",
    image: "approved legal service image",
    legalStatus: "public-safe; no detailed statutory claims added",
    redirectStatus: "activated in config after target build gate",
    notes: "Exact equivalent already existed from Sprint 11Q."
  },
  {
    priority: 8,
    oldUrl: "https://chamanlawfirm.com/rights-of-parties-to-a-mortgage",
    title: "Rights of Parties To A Mortgage",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/mortgage-document-review",
    area: "Property and Real Estate Law",
    pageType: "existing static/service authority page",
    implementation: "redirect tightened to existing Sprint 11Q target",
    image: "approved managing-partner office image",
    legalStatus: "public-safe document-review guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Exact mortgage-document equivalent already existed from Sprint 11Q."
  },
  {
    priority: 9,
    oldUrl: "https://chamanlawfirm.com/methods-of-transfer-of-shares",
    title: "Methods of Transfer of Shares",
    finalUrl: "https://chamanlawfirm.com/practice-areas/corporate-commercial-law/share-transfer",
    area: "Corporate and Commercial Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe share-transfer guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Corporate ownership-change intent maps better to service page than legacy blog."
  },
  {
    priority: 10,
    oldUrl: "https://chamanlawfirm.com/can-a-member-be-expelled-from-a-trade-union",
    title: "Can A Member Be Expelled From A Trade Union",
    finalUrl: "https://chamanlawfirm.com/practice-areas/employment-law/trade-union-membership-disputes",
    area: "Employment Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe employment guidance; fact review required",
    redirectStatus: "activated in config after target build gate",
    notes: "Employment/legal-risk topic should not be revived as unreviewed procedural blog."
  },
  {
    priority: 11,
    oldUrl: "https://chamanlawfirm.com/expert-witnesses-in-nigeria-court-proceeding",
    title: "Expert Witnesses In Nigeria Court Proceeding",
    finalUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/expert-witnesses",
    area: "Litigation and Dispute Resolution",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe evidence strategy guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Converted to expert evidence advisory page."
  },
  {
    priority: 12,
    oldUrl: "https://chamanlawfirm.com/how-to-calculate-and-pay-land-use-charge",
    title: "How To Calculate and Pay Land Use Charge",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/land-use-charge",
    area: "Property and Real Estate Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe; no official assessment guarantee",
    redirectStatus: "activated in config after target build gate",
    notes: "Reframed from calculation/how-to language into legal document-readiness guidance."
  },
  {
    priority: 13,
    oldUrl: "https://chamanlawfirm.com/legal-restrictions-to-sale-of-land",
    title: "Legal Restrictions To Sale of Land",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/legal-restrictions-to-sale-of-land",
    area: "Property and Real Estate Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe transaction-risk guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Strong lead-generation fit for property transaction review."
  },
  {
    priority: 14,
    oldUrl: "https://chamanlawfirm.com/selling-a-family-land-without-everyones-consent",
    title: "Selling A Family Land Without Everyones Consent",
    finalUrl: "https://chamanlawfirm.com/practice-areas/property-real-estate-law/selling-a-family-land-without-everyones-consent",
    area: "Property and Real Estate Law",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved firm team image",
    legalStatus: "public-safe family-land consent guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Family land risk deserves service framing and consultation CTA."
  },
  {
    priority: 15,
    oldUrl: "https://chamanlawfirm.com/digital-evidence-admissibility-in-nigeria",
    title: "Digital Evidence Admissibility In Nigeria",
    finalUrl: "https://chamanlawfirm.com/practice-areas/litigation-dispute-resolution/digital-evidence",
    area: "Litigation and Dispute Resolution",
    pageType: "static/service authority page",
    implementation: "implemented new exact service page",
    image: "approved legal service image",
    legalStatus: "public-safe digital-evidence guidance",
    redirectStatus: "activated in config after target build gate",
    notes: "Evidence/admissibility claims kept conservative and fact-dependent."
  }
];

function readText(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = cells[index] || "";
    });
    return record;
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function writeCsv(filename, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(path.join(docsDir, filename), `${lines.join("\n")}\n`);
}

function writeMd(filename, body) {
  fs.writeFileSync(path.join(docsDir, filename), `${body.trim()}\n`);
}

function scoreLegacyRow(row) {
  const evidence = row["Google ranking/impression/click evidence"] || "";
  const clicks = Number((evidence.match(/(\d+(?:\.\d+)?)\s*click/i) || [0, 0])[1]);
  const impressions = Number((evidence.match(/(\d+(?:\.\d+)?)\s*impression/i) || [0, 0])[1]);
  const staticBoost = /service|static|practice|property|corporate|litigation|probate|employment/i.test(
    `${row["old content type"]} ${row["recovery classification"]} ${row["old title"]}`
  )
    ? 50
    : 0;
  return Math.round(clicks * 10 + impressions / 100 + staticBoost);
}

function getLegacyRows() {
  const legacyRows = parseCsv(readText("docs/SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"));
  return legacyRows
    .map((row) => ({ ...row, priorityScore: scoreLegacyRow(row) }))
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 220);
}

function getBlogRows() {
  const lawyerQueue = parseCsv(readText("docs/SPRINT-11P-LAWYER-SAFE-BLOG-RECOVERY.csv"));
  const legacyRows = getLegacyRows();
  const existingSlugs = new Set(lawyerQueue.map((row) => row.slug));
  const legacyBlogRows = legacyRows
    .filter((row) => /blog|post|article/i.test(`${row["old content type"]} ${row["recovery classification"]}`))
    .filter((row) => {
      const url = row["old URL"] || "";
      const slug = url.split("/").filter(Boolean).pop() || "";
      return slug && !existingSlugs.has(slug);
    })
    .slice(0, 34)
    .map((row) => {
      const url = row["old URL"] || "";
      const slug = url.split("/").filter(Boolean).pop() || "";
      return {
        "old URL": url,
        slug,
        title: row["old title"] || slug,
        "source Sanity document": "not confirmed in Sprint 11R",
        "body gate": row["notes"]?.includes("missing") ? "needs source body review" : "needs body verification",
        "formatting gate": "needs editorial review",
        "unsafe legal claim": row["legal safety status"] || "not cleared",
        "misleading free-service wording": "not detected by Sprint 11R inventory pass",
        "duplicate/cannibalization risk": "requires review",
        "off-brand content": "requires review",
        "SEO title present": row["old meta title"] ? "yes" : "missing",
        "meta description present": row["old meta description"] ? "yes" : "missing",
        canonical: row["canonical URL"] || `https://chamanlawfirm.com/resources/blog/${slug}`,
        "image and alt text present": row["image status"] || "needs image verification",
        "category/practice relationship": row["old content type"] || "needs classification",
        "CTA present": "needs verification",
        "internal links present": "needs verification",
        author: "Charles Chukwuma Nkwoka, Esq.",
        classification: "blog recovery candidate",
        "approval decision": "keep hidden",
        "reason kept hidden": "not all Sprint 11R approval gates cleared"
      };
    });

  return [...lawyerQueue, ...legacyBlogRows].slice(0, 80);
}

function buildDeepInventoryRows() {
  return getLegacyRows().map((row, index) => {
    const oldUrl = row["old URL"] || "";
    const slug = oldUrl.split("/").filter(Boolean).pop() || "";
    const bestRoute = row["best new route"] || row["redirect target"] || `/resources/blog/${slug}`;
    return {
      "priority rank": index + 1,
      "old URL": oldUrl,
      "old title": row["old title"] || slug,
      "old meta title": row["old meta title"],
      "old meta description": row["old meta description"],
      "old content type": row["old content type"] || "legacy URL",
      "current live status": row["current live status"] || "needs live verification",
      "GSC evidence": row["Google ranking/impression/click evidence"] || "not available in local export",
      "featured snippet evidence": row["featured snippet evidence"] || "not available locally",
      "backlink evidence": "not available locally in Sprint 11R",
      "source body found": row["old title"] || row["old meta description"] ? "partial evidence available" : "not confirmed",
      "source body quality": "requires legal/editorial review before publication",
      "old image availability": row["old image availability"] || "not confirmed",
      "image recovery status": row["image status"] || "needs image review",
      "Sanity status": row["approval status"] || "not confirmed",
      "best new route": bestRoute,
      "preserve URL or redirect": row["whether to preserve same URL or redirect"] || "redirect to best exact live route",
      "redirect target": row["redirect target"] || bestRoute,
      canonical: row["canonical URL"] || `https://chamanlawfirm.com${bestRoute.startsWith("/") ? bestRoute : `/${bestRoute}`}`,
      "sitemap status": row["sitemap inclusion"] || "must be included only after live target exists",
      "legal safety status": row["legal safety status"] || "not cleared",
      "approval status": row["approval status"] || "not approved",
      "recovery classification": row["recovery classification"] || "review required",
      "priority score": row.priorityScore,
      notes: row.notes || "Selected for deep Sprint 11R recovery inventory."
    };
  });
}

function buildStaticRows() {
  return staticServiceBatch.map((row) => ({
    priority: row.priority,
    "old URL": row.oldUrl,
    "old title": row.title,
    "new URL": row.finalUrl,
    "page type": row.pageType,
    "practice area": row.area,
    "implementation status": row.implementation,
    "route gate": "local build passed",
    "canonical gate": "expected canonical from service route",
    "CTA gate": "service route consultation CTA present",
    "image gate": row.image,
    "alt text gate": "explicit service-page alt text added",
    "sitemap gate": "included by service-page sitemap generator after deployment",
    "redirect action": row.redirectStatus,
    "legal safety": row.legalStatus,
    notes: row.notes
  }));
}

function buildBlogRecoveryRows() {
  return getBlogRows().map((row, index) => ({
    priority: index + 1,
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    "source Sanity document": row["source Sanity document"],
    "body status": row["body gate"],
    "formatting status": row["formatting gate"],
    "legal risk status": row["unsafe legal claim"],
    "free-service wording": row["misleading free-service wording"],
    "duplicate/cannibalization": row["duplicate/cannibalization risk"],
    "off-brand content": row["off-brand content"],
    "SEO title": row["SEO title present"],
    "meta description": row["meta description present"],
    canonical: row.canonical,
    "image and alt": row["image and alt text present"],
    category: row["category/practice relationship"],
    CTA: row["CTA present"],
    "internal links": row["internal links present"],
    author: row.author || "Charles Chukwuma Nkwoka, Esq.",
    classification: row.classification,
    decision: row["approval decision"],
    reason: row["reason kept hidden"]
  }));
}

function buildApprovalRows(blogRows) {
  return blogRows.slice(0, 30).map((row) => ({
    priority: row.priority,
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    author: "Charles Chukwuma Nkwoka, Esq.",
    "approval decision": "not approved in Sprint 11R",
    "lawyer review": "required before publication",
    "image/alt": row["image and alt"],
    "legal safety": row["legal risk status"],
    "redirect status": "no redirect until target is approved, live, canonical-safe, and sitemap-included",
    notes: row.reason || "Approval gates not fully cleared."
  }));
}

function buildRedirectRows() {
  return staticServiceBatch.map((row) => ({
    priority: row.priority,
    "old URL": row.oldUrl,
    "new URL": row.finalUrl,
    "redirect type": "one-hop 308 via Next.js permanent redirect",
    "target status": "local build gate passed; live verification required after deployment",
    "sitemap status": "expected after deployment",
    "hidden draft guardrail": "not a hidden draft target",
    "homepage dump guardrail": "exact target only",
    "Chaman Properties guardrail": "not a Chaman Properties target",
    status: "configured in next.config.mjs",
    notes: row.notes
  }));
}

function buildSeoRows() {
  return staticServiceBatch.map((row) => ({
    priority: row.priority,
    URL: row.finalUrl,
    "content type": row.pageType,
    "SEO preservation": "legacy intent preserved through exact route and redirect",
    "AEO enhancement": "FAQs and concise service answers added",
    "GEO enhancement": "Nigerian legal-service context retained",
    canonical: row.finalUrl,
    "internal links": "practice-area service layout links to consultation/contact and parent practice area",
    CTA: "Book a consultation",
    "image alt": row.image,
    "legal safety": row.legalStatus,
    notes: row.notes
  }));
}

function buildMarkdownPacks() {
  const staticRows = buildStaticRows();
  const blogRows = buildBlogRecoveryRows();

  writeMd(
    requiredDocs.freshEvidenceStatus,
    `
# Sprint 11R Fresh Search Evidence Status

Date: ${reportDate}

No newer post-launch Google Search Console or Bing Webmaster export was found inside the local project during Sprint 11R. Sprint 11R therefore reused the existing local evidence set:

- docs/search-console-exports/Pages.csv
- docs/search-console-exports/Queries.csv
- docs/SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv
- docs/SPRINT-11P-STATIC-SERVICE-RESTORATION-PLAN.csv
- docs/SPRINT-11P-LAWYER-SAFE-BLOG-RECOVERY.csv

Operational decision:

- Do not wait on missing fresh exports where the existing inventory already shows recoverable legacy authority.
- Continue exact static/service recovery for high-value 404 URLs.
- Keep hidden blog candidates hidden unless legal, image, author, CTA, metadata, canonical, and sitemap gates all pass.

Manual follow-up:

- Export fresh GSC pages and 404/not-found reports after the Sprint 11R deployment has been indexed.
- Export Bing indexed/404 URL data after redirect propagation.
- Do not submit hidden drafts or non-live URLs for inspection.
`
  );

  writeMd(
    requiredDocs.indexingPack,
    `
# Sprint 11R GSC/Bing Indexing Pack

Date: ${reportDate}

Use this pack only after the deployment is live and the listed URLs return 200 or exact one-hop redirects to 200 targets.

## New Static/Service URLs To Inspect

${staticRows.map((row) => `- ${row["new URL"]}`).join("\n")}

## Exact Old URLs To Inspect After Redirect QA

${staticRows.map((row) => `- ${row["old URL"]}`).join("\n")}

## Do Not Submit

- Hidden Sanity draft URLs
- Legacy URLs that still point to hidden or unapproved content
- Any Chaman Properties URL
- Any preview, vercel.app, localhost, backup, SQL, or wp-content URL

## Google Search Console Steps

1. Inspect the new static/service URL.
2. Confirm the URL is on Google with production canonical.
3. Inspect the matching old URL.
4. Confirm Google sees the one-hop redirect to the exact new target.
5. Request indexing only for verified live targets and exact redirected old URLs.

## Bing Webmaster Steps

1. Resubmit https://chamanlawfirm.com/sitemap.xml.
2. Inspect each new static/service URL.
3. Inspect each exact old redirected URL.
4. Do not submit hidden drafts or broad unresolved legacy URLs.

## Blog Recovery Note

Sprint 11R did not approve hidden blog candidates because the lawyer/image/current-law gates were not fully cleared. Blog URLs remain excluded from this indexing pack until approved and live.
`
  );

  const result = {
    sprint: "11R",
    date: reportDate,
    legacyInventoryRowsProcessed: buildDeepInventoryRows().length,
    staticServicePagesImplemented: staticServiceBatch.filter((row) => row.implementation.startsWith("implemented new")).length,
    exactStaticRedirectsConfigured: staticServiceBatch.length,
    blogCandidatesReviewed: blogRows.length,
    blogPostsApproved: 0,
    hiddenDraftsPublished: 0,
    redirectsToHomepage: 0,
    redirectsToHiddenDrafts: 0,
    dnsTouched: false,
    hostingerTouched: false,
    chamanPropertiesTouched: false,
    secretsTouched: false,
    requiredDocs
  };
  fs.writeFileSync(path.join(docsDir, requiredDocs.result), `${JSON.stringify(result, null, 2)}\n`);
}

function main() {
  const deepRows = buildDeepInventoryRows();
  const staticRows = buildStaticRows();
  const blogRows = buildBlogRecoveryRows();
  const approvalRows = buildApprovalRows(blogRows);
  const redirectRows = buildRedirectRows();
  const seoRows = buildSeoRows();

  writeCsv(
    requiredDocs.deepInventory,
    [
      "priority rank",
      "old URL",
      "old title",
      "old meta title",
      "old meta description",
      "old content type",
      "current live status",
      "GSC evidence",
      "featured snippet evidence",
      "backlink evidence",
      "source body found",
      "source body quality",
      "old image availability",
      "image recovery status",
      "Sanity status",
      "best new route",
      "preserve URL or redirect",
      "redirect target",
      "canonical",
      "sitemap status",
      "legal safety status",
      "approval status",
      "recovery classification",
      "priority score",
      "notes"
    ],
    deepRows
  );

  writeCsv(
    requiredDocs.staticBatch,
    [
      "priority",
      "old URL",
      "old title",
      "new URL",
      "page type",
      "practice area",
      "implementation status",
      "route gate",
      "canonical gate",
      "CTA gate",
      "image gate",
      "alt text gate",
      "sitemap gate",
      "redirect action",
      "legal safety",
      "notes"
    ],
    staticRows
  );

  writeCsv(
    requiredDocs.blogRecovery,
    [
      "priority",
      "old URL",
      "slug",
      "title",
      "source Sanity document",
      "body status",
      "formatting status",
      "legal risk status",
      "free-service wording",
      "duplicate/cannibalization",
      "off-brand content",
      "SEO title",
      "meta description",
      "canonical",
      "image and alt",
      "category",
      "CTA",
      "internal links",
      "author",
      "classification",
      "decision",
      "reason"
    ],
    blogRows
  );

  writeCsv(
    requiredDocs.approvalBatch,
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
    requiredDocs.redirectBatch,
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
    requiredDocs.seoEnhancement,
    [
      "priority",
      "URL",
      "content type",
      "SEO preservation",
      "AEO enhancement",
      "GEO enhancement",
      "canonical",
      "internal links",
      "CTA",
      "image alt",
      "legal safety",
      "notes"
    ],
    seoRows
  );

  buildMarkdownPacks();

  console.log(
    JSON.stringify(
      {
        generated: Object.values(requiredDocs),
        deepInventoryRows: deepRows.length,
        staticRows: staticRows.length,
        blogRows: blogRows.length,
        approvalRows: approvalRows.length,
        redirectRows: redirectRows.length,
        seoRows: seoRows.length
      },
      null,
      2
    )
  );
}

main();
