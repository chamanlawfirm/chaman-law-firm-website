import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const roadmapPath = path.join(root, "SEO-MASTER-MIGRATION-ROADMAP.md");
const registerPath = path.join(root, "docs", "PHASE-5B-TOP-50-LEGAL-ARTICLE-MIGRATION-REGISTER.csv");
const redirectPath = path.join(root, "docs", "PHASE-5B-TOP-50-LEGAL-ARTICLE-REDIRECT-MAP.csv");
const validationPath = path.join(root, "docs", "phase5c", "phase5c-final-validation-log.csv");
const preparedDraftsPath = path.join(root, "docs", "phase5c", "phase5c-prepared-sanity-drafts.json");

const outSelectionPath = path.join(root, "docs", "SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv");
const outInventoryPath = path.join(root, "docs", "SPRINT-9M-SOURCE-INVENTORY.md");
const outBatchBPath = path.join(root, "docs", "SPRINT-9M-BATCH-B-READINESS.csv");
const outRedirectPath = path.join(root, "docs", "SPRINT-9M-REDIRECT-READINESS.csv");
const outSummaryPath = path.join(root, "docs", "SPRINT-9M-MIGRATION-SYSTEM-SUMMARY.json");

const AUTHOR = "Charles Chukwuma Nkwoka, Esq.";
const SITE = "https://chamanlawfirm.com";
const APPROVED_SLUGS = new Set([
  "landlord-and-tenant-rights-in-nigeria",
  "the-jurisdiction-of-courts-in-nigeria",
  "proper-steps-to-eviction-of-tenants",
  "the-ogun-state-tenancy-law-chaman-law-firm",
  "building-permit-approval-in-ogun-state",
]);

const propertySignals = [
  "chamanproperties",
  "chaman properties",
  "luxury estate",
  "luxury estates",
  "luxury home",
  "luxury homes",
  "property listing",
  "for sale",
  "shortlet",
  "short-let",
  "gated estates",
  "high-net-worth investors",
];

const weakSignals = [
  "category/",
  "/tag/",
  "/author/",
  "/page/",
  "wp-content",
  "feed",
  "amp",
];

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function parseNumber(value) {
  if (value === undefined || value === null) return 0;
  const cleaned = String(value).replace(/,/g, "").replace(/%/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function slugFromUrl(value) {
  try {
    const url = value.startsWith("http") ? new URL(value) : new URL(value, SITE);
    return url.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return String(value).split("/").filter(Boolean).pop() || "";
  }
}

function titleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function csvEscape(value) {
  const stringValue = value === undefined || value === null ? "" : String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function writeCsv(filePath, rows, columns) {
  const content = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
  fs.writeFileSync(filePath, `${content}\n`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...body] = rows;
  return body
    .filter((line) => line.some((item) => item.trim()))
    .map((line) =>
      Object.fromEntries(headers.map((header, index) => [header.trim(), (line[index] || "").trim()]))
    );
}

function parseMarkdownTableAfter(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start < 0) return [];

  const table = [];
  let capture = false;

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("|")) {
      capture = true;
      table.push(line);
      continue;
    }

    if (capture && line.trim() && !line.startsWith("|")) break;
  }

  if (table.length < 2) return [];
  const headers = table[0].split("|").slice(1, -1).map((item) => item.trim());
  return table
    .slice(2)
    .map((line) => line.split("|").slice(1, -1).map((item) => item.trim()))
    .filter((cells) => cells.length === headers.length)
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function portableTextPlain(blocks = []) {
  return blocks
    .map((block) => {
      if (!Array.isArray(block.children)) return "";
      return block.children.map((child) => child?.text || "").join("");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPropertySignal(values) {
  const haystack = values.filter(Boolean).join(" ").toLowerCase();
  return propertySignals.some((signal) => haystack.includes(signal));
}

function hasWeakSignal(url) {
  const haystack = String(url || "").toLowerCase();
  return weakSignals.some((signal) => haystack.includes(signal));
}

function practiceAreaFor(topic = "") {
  const value = topic.toLowerCase();
  if (/tenancy|landlord|eviction|property|land|occupancy|real estate|building|planning/.test(value)) {
    return "Property and Real Estate Law";
  }
  if (/cac|company|corporate|commercial|contract|shares/.test(value)) return "Corporate & Commercial Law";
  if (/court|litigation|jurisdiction|dispute|procedure|restraining|police|crime/.test(value)) {
    return "Litigation and Dispute Resolution";
  }
  if (/debt/.test(value)) return "Debt Recovery";
  if (/probate|will|inheritance|estate/.test(value)) return "Probate and Estate Administration";
  if (/family|marriage|divorce|child/.test(value)) return "Family Law";
  if (/immigration|citizenship|passport|visa/.test(value)) return "Immigration";
  if (/notary|affidavit|document/.test(value)) return "Notary Public";
  if (/employment|labour|employee/.test(value)) return "Employment Law";
  return "Legal Education";
}

function migrationDecision(row, proposedNewUrl) {
  const classCode = row.Class || "";
  const url = row.URL || "";
  const oldSlug = slugFromUrl(url);
  const topic = row.Topic || "";
  const target = row["Recommended action/target"] || "";

  if (classCode === "C" || hasPropertySignal([url, topic, target])) {
    return "exclude - Chaman Properties/off-brand review";
  }

  if (classCode === "D") return "archive candidate - weak or unsafe";
  if (classCode === "E") return "redirect only - non-article or canonical route";
  if (!oldSlug || ["/", "/resources/blog", "/resources/blog/"].includes(proposedNewUrl)) {
    return "not article - route separately";
  }

  if (!proposedNewUrl.startsWith("/resources/blog/")) return "not article - route separately";
  if (classCode === "A") return "migrate - preserve and QA";
  if (classCode === "B") return "rewrite then migrate";
  if (hasWeakSignal(url)) return "archive or redirect after review";
  return "review candidate";
}

function approvalStatusFor(decision, slug) {
  if (APPROVED_SLUGS.has(slug)) return "approved/live on preview";
  if (decision.startsWith("migrate") || decision.startsWith("rewrite")) return "pending lawyer review";
  if (decision.startsWith("redirect")) return "not applicable";
  return "not approved";
}

function sitemapStatusFor(slug) {
  return APPROVED_SLUGS.has(slug) ? "included after approval" : "excluded until approved";
}

const roadmap = readText(roadmapPath);
const appendixRows = parseMarkdownTableAfter(roadmap, "# Appendix A — Complete Search Console URL classification");
const registerRows = parseCsv(readText(registerPath));
const redirectRows = parseCsv(readText(redirectPath));
const validationRows = parseCsv(readText(validationPath));
const preparedDrafts = fs.existsSync(preparedDraftsPath)
  ? JSON.parse(readText(preparedDraftsPath))
  : [];

const registerBySlug = new Map(registerRows.map((row) => [slugFromUrl(row.new_route || row.legacy_url), row]));
const validationBySlug = new Map(validationRows.map((row) => [row.slug, row]));
const draftBySlug = new Map(preparedDrafts.map((doc) => [doc.slug?.current, doc]));

const selection = appendixRows.map((row, index) => {
  const oldUrl = row.URL;
  const oldSlug = slugFromUrl(oldUrl);
  const recommendedTarget = row["Recommended action/target"] || "";
  const targetSlug = recommendedTarget.startsWith("/resources/blog/")
    ? slugFromUrl(recommendedTarget)
    : oldSlug;
  const proposedNewUrl = recommendedTarget.startsWith("/") || recommendedTarget.startsWith("http")
    ? recommendedTarget
    : hasWeakSignal(oldUrl)
      ? ""
      : `/resources/blog/${targetSlug}`;
  const slug = slugFromUrl(proposedNewUrl || oldUrl);
  const draft = draftBySlug.get(slug);
  const register = registerBySlug.get(slug);
  const validation = validationBySlug.get(slug);
  const decision = migrationDecision(row, proposedNewUrl);
  const title = draft?.title || titleFromSlug(slug || oldSlug);
  const seoTitle = draft?.seo?.metaTitle || "";
  const metaDescription = draft?.seo?.metaDescription || "";
  const imageStatus = draft?.mainImage?.asset?._ref
    ? "image present"
    : validation?.imageStatus || "image-needed";
  const contentText = draft ? portableTextPlain(draft.body) : "";
  const legalReviewStatus = APPROVED_SLUGS.has(slug)
    ? "passed for preview"
    : decision.startsWith("migrate") || decision.startsWith("rewrite")
      ? "pending lawyer review"
      : "not required unless revived";
  const notes = [];

  if (!draft) notes.push("source body not present in Phase 5C prepared drafts");
  if (!seoTitle) notes.push("SEO title requires RankMath/source preservation or rewrite");
  if (!metaDescription) notes.push("meta description requires RankMath/source preservation or rewrite");
  if (imageStatus !== "image present") notes.push("image recovery/fallback required");
  if (hasPropertySignal([oldUrl, title, contentText, row.Topic, recommendedTarget])) notes.push("property/off-brand signal requires exclusion review");
  if (decision.includes("redirect")) notes.push("redirect planning only; do not publish as article without equivalent content");

  return {
    "priority rank": index + 1,
    "old URL": oldUrl,
    "old slug": oldSlug,
    "proposed new URL": proposedNewUrl,
    "proposed slug": slug,
    title,
    "SEO title": seoTitle,
    "meta description": metaDescription,
    clicks: parseNumber(row.Clicks),
    impressions: parseNumber(row.Impressions),
    "practice area": practiceAreaFor(row.Topic),
    category: row.Topic || register?.topic || "",
    "migration decision": decision,
    author: AUTHOR,
    "image status": imageStatus,
    "legal review status": legalReviewStatus,
    "approval status": approvalStatusFor(decision, slug),
    "redirect status": proposedNewUrl ? "pending - activate only after target live and final launch approval" : "no redirect target yet",
    "sitemap status": sitemapStatusFor(slug),
    notes: notes.join("; "),
    _class: row.Class,
    _confidence: row.Confidence,
    _hasDraft: Boolean(draft),
    _hasBody: Boolean(contentText),
    _hasSeoTitle: Boolean(seoTitle),
    _hasMetaDescription: Boolean(metaDescription),
    _hasImage: imageStatus === "image present",
    _isSelectedArticle:
      proposedNewUrl.startsWith("/resources/blog/") &&
      (decision.startsWith("migrate") || decision.startsWith("rewrite")),
  };
});

const internalColumns = new Set([
  "_class",
  "_confidence",
  "_hasDraft",
  "_hasBody",
  "_hasSeoTitle",
  "_hasMetaDescription",
  "_hasImage",
  "_isSelectedArticle",
]);
const publicSelection = selection.map((row) =>
  Object.fromEntries(Object.entries(row).filter(([column]) => !internalColumns.has(column)))
);

const batchB = publicSelection
  .filter((row) => !APPROVED_SLUGS.has(row["proposed slug"]))
  .filter((row) => row["proposed new URL"].startsWith("/resources/blog/"))
  .filter((row) => row["migration decision"].startsWith("migrate") || row["migration decision"].startsWith("rewrite"))
  .slice(0, 45)
  .map((row, index) => {
    const draft = draftBySlug.get(row["proposed slug"]);
    const text = draft ? portableTextPlain(draft.body) : "";
    const hasOldFooter = /chamanlawfirm@gmail\.com|08065553671|0806 555|nigerian lawyers cent/i.test(text);
    const hasProperty = hasPropertySignal([row["old URL"], row.title, text, row.category]);
    const checklist = {
      "batch rank": index + 1,
      "priority rank": row["priority rank"],
      "old URL": row["old URL"],
      "new URL": row["proposed new URL"],
      slug: row["proposed slug"],
      title: row.title,
      "body exists": draft && text.length > 600 ? "yes" : "no",
      "SEO title exists": row["SEO title"] ? "yes" : "no",
      "meta description exists": row["meta description"] ? "yes" : "no",
      "canonical exists": draft?.seo?.canonicalUrl ? "yes" : "no",
      "publishedAt valid": draft?.publishedAt && new Date(draft.publishedAt).getTime() <= Date.now() ? "yes" : "no",
      "author governance": AUTHOR,
      "image status": row["image status"],
      "alt text exists": draft?.mainImage?.alt ? "yes" : "no",
      "category exists": draft?.categories?.length ? "yes" : "no",
      "no Chaman Properties content": hasProperty ? "no" : "yes",
      "no placeholder": /placeholder|lorem|todo/i.test(text) ? "no" : "yes",
      "no old legacy footer": hasOldFooter ? "no" : "yes",
      "consultation CTA exists": /consultation|book a consultation|contact/i.test(text) ? "yes" : "needs review",
      "automated approval readiness": "not approved - lawyer review required",
      notes: [
        !draft ? "No prepared source body in Phase 5C JSON." : "",
        text.length <= 600 ? "Body missing or too short for safe approval." : "",
        hasProperty ? "Property/off-brand signal found." : "",
        hasOldFooter ? "Legacy footer/contact content must be cleaned." : "",
        row["migration decision"].startsWith("rewrite") ? "Rewrite required before approval." : "",
      ].filter(Boolean).join("; "),
    };
    return checklist;
  });

const redirectReadiness = publicSelection
  .filter((row) => row["proposed new URL"])
  .map((row) => ({
    "priority rank": row["priority rank"],
    "old URL": row["old URL"],
    "new URL": row["proposed new URL"].startsWith("http") ? row["proposed new URL"] : `${SITE}${row["proposed new URL"]}`,
    "redirect type": "one-hop 301",
    status: "pending",
    "activation condition": "target approved, visible, indexable, in sitemap, final launch approved",
    notes: row["migration decision"],
  }));

const classCounts = selection.reduce((acc, row) => {
  acc[row._class || "Unknown"] = (acc[row._class || "Unknown"] || 0) + 1;
  return acc;
}, {});

const selectedArticles = selection.filter((row) => row._isSelectedArticle);
const selectedLegalArticles = selectedArticles.filter((row) => !row.notes.includes("property/off-brand signal"));
const excludedProperty = selection.filter((row) => row["migration decision"].includes("Chaman Properties") || row.notes.includes("property/off-brand signal"));
const weakArchive = selection.filter((row) => row["migration decision"].includes("archive"));
const redirectOnly = selection.filter((row) => row["migration decision"].includes("redirect"));
const missingContent = selectedArticles.filter((row) => !row._hasDraft || !row._hasBody);
const missingImages = selectedArticles.filter((row) => !row._hasImage);
const seoTitleCoverage = selection.filter((row) => row._hasSeoTitle).length;
const metaCoverage = selection.filter((row) => row._hasMetaDescription).length;

writeCsv(outSelectionPath, publicSelection, [
  "priority rank",
  "old URL",
  "old slug",
  "proposed new URL",
  "proposed slug",
  "title",
  "SEO title",
  "meta description",
  "clicks",
  "impressions",
  "practice area",
  "category",
  "migration decision",
  "author",
  "image status",
  "legal review status",
  "approval status",
  "redirect status",
  "sitemap status",
  "notes",
]);

writeCsv(outBatchBPath, batchB, [
  "batch rank",
  "priority rank",
  "old URL",
  "new URL",
  "slug",
  "title",
  "body exists",
  "SEO title exists",
  "meta description exists",
  "canonical exists",
  "publishedAt valid",
  "author governance",
  "image status",
  "alt text exists",
  "category exists",
  "no Chaman Properties content",
  "no placeholder",
  "no old legacy footer",
  "consultation CTA exists",
  "automated approval readiness",
  "notes",
]);

writeCsv(outRedirectPath, redirectReadiness, [
  "priority rank",
  "old URL",
  "new URL",
  "redirect type",
  "status",
  "activation condition",
  "notes",
]);

const inventoryMarkdown = `# Sprint 9M Source Inventory

Date: 2026-06-27

## Available Local Sources

| Source | Status | Coverage |
| --- | --- | --- |
| SEO Master Migration Roadmap | Available | Contains Search Console summary, classification rules, Top 100 priorities, Top 50 priorities, rewrite list, property-company exclusion notes, and Appendix A with ${appendixRows.length} Search Console page rows. |
| Phase 5B Top 50 Migration Register | Available | ${registerRows.length} priority legal article rows with clicks, impressions, legacy URLs and target routes. |
| Phase 5B Redirect Map | Available | ${redirectRows.length} redirect-planning rows. |
| Phase 5C Prepared Sanity Drafts | Available | ${preparedDrafts.length} prepared draft records. |
| Phase 5C Final Validation Log | Available | ${validationRows.length} validation rows. |
| WordPress XML export / SQL backup | Not found in active project workspace | Existing scripts support SQL dump inspection, but the full dump/export is not present locally. |
| Raw RankMath export | Not found as a separate active file | Roadmap summary records 2,015 rows, 1,880 unique non-empty slugs, 1,059 SEO titles, 1,240 descriptions, 15 canonicals and 120 redirects. |
| Raw Google Search Console pages/query exports | Not found as separate active files | Appendix A contains the 1,000 page rows. Query rows are summarized in the roadmap, not present as a standalone CSV. |
| Public law-firm images | Available | Firm and lawyer images exist under public images folders. |

## Counts

- Total Search Console URL rows discovered: ${appendixRows.length}
- Total Phase 5C prepared article records: ${preparedDrafts.length}
- Candidate legal article rows selected from local evidence: ${selectedArticles.length}
- Usable legal/article candidates after property/off-brand screening: ${selectedLegalArticles.length}
- Chaman Properties/off-brand rows excluded or flagged: ${excludedProperty.length}
- Redirect-only/non-article rows: ${redirectOnly.length}
- Weak/archive candidates: ${weakArchive.length}
- Candidate rows missing prepared body content locally: ${missingContent.length}
- Candidate rows missing image coverage locally: ${missingImages.length}
- Rows with SEO title available from local prepared drafts: ${seoTitleCoverage}
- Rows with meta description available from local prepared drafts: ${metaCoverage}
- Redirect mapping rows available from Phase 5B: ${redirectRows.length}
- Redirect planning rows generated from Appendix A: ${redirectReadiness.length}

## Class Counts From Appendix A

${Object.entries(classCounts).map(([key, count]) => `- ${key}: ${count}`).join("\n")}

## Limitation

The active project contains enough local evidence to generate a Top 1,000 selection manifest and prepare Batch B, but it does not contain the full raw WordPress export, raw RankMath export, raw GSC query export or full media archive needed to safely import all 1,000 articles in this sprint. The next import sprint should add those source files to a controlled migration-source folder or provide an export path for read-only processing.
`;

fs.writeFileSync(outInventoryPath, inventoryMarkdown);

const summary = {
  generatedAt: new Date().toISOString(),
  appendixRows: appendixRows.length,
  registerRows: registerRows.length,
  redirectRows: redirectRows.length,
  validationRows: validationRows.length,
  preparedDrafts: preparedDrafts.length,
  classCounts,
  selectedArticles: selectedArticles.length,
  selectedLegalArticles: selectedLegalArticles.length,
  excludedProperty: excludedProperty.length,
  redirectOnly: redirectOnly.length,
  weakArchive: weakArchive.length,
  missingContent: missingContent.length,
  missingImages: missingImages.length,
  seoTitleCoverage,
  metaCoverage,
  batchBRows: batchB.length,
  outputs: {
    selection: path.relative(root, outSelectionPath),
    inventory: path.relative(root, outInventoryPath),
    batchB: path.relative(root, outBatchBPath),
    redirects: path.relative(root, outRedirectPath),
  },
};

fs.writeFileSync(outSummaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
