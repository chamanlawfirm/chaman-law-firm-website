import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11l-";
const MIN_BODY_CHARACTERS = 900;
const shouldApply = process.argv.includes("--apply");

const paths = {
  sprint11kApproval: path.join("docs", "SPRINT-11K-BLOG-APPROVAL-BATCH.csv"),
  sprint11kImage: path.join("docs", "SPRINT-11K-IMAGE-ALT-COMPLETION.csv"),
  sprint11kStatic: path.join("docs", "SPRINT-11K-STATIC-SERVICE-AUTHORITY-RESTORATION.csv"),
  nextConfig: "next.config.mjs",
  freshEvidence: path.join("docs", "SPRINT-11L-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  sourceReview: path.join("docs", "SPRINT-11L-RECOVERED-SOURCE-BATCH-REVIEW.csv"),
  imageCompletion: path.join("docs", "SPRINT-11L-IMAGE-METADATA-COMPLETION.csv"),
  lawyerReview: path.join("docs", "SPRINT-11L-LAWYER-SAFE-APPROVAL-REVIEW.csv"),
  approvalBatch: path.join("docs", "SPRINT-11L-BLOG-APPROVAL-BATCH.csv"),
  staticContinuation: path.join("docs", "SPRINT-11L-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  redirectBatch: path.join("docs", "SPRINT-11L-REDIRECT-ACTIVATION-BATCH.csv"),
  report: path.join("docs", "SPRINT-11L-RECOVERED-SOURCE-APPROVAL-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11L-RESULT.json")
};

const lowRiskApprovalSlugs = new Set([
  "what-are-the-sources-of-nigerian-law",
  "the-nigerian-legal-system",
  "maxims-of-equity",
  "the-role-of-regulatory-bodies",
  "doctrine-of-ultra-vires",
  "pohistory-of-legal-profession-in-nigeria"
]);

const titleOverrides = new Map([
  ["what-are-the-sources-of-nigerian-law", "What Are the Sources of Nigerian Law?"],
  ["the-nigerian-legal-system", "The Nigerian Legal System: Structure, Sources and Process"],
  ["maxims-of-equity", "Maxims of Equity in Nigerian Legal Practice"],
  ["the-role-of-regulatory-bodies", "The Role of Regulatory Bodies in Nigeria"],
  ["doctrine-of-ultra-vires", "The Doctrine of Ultra Vires in Nigerian Company Law"],
  ["pohistory-of-legal-profession-in-nigeria", "History of the Legal Profession in Nigeria"]
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    if (process.env[key]) continue;
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[key] = value;
  }
}

loadEnvFile(".env.local");
const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  token,
  useCdn: false,
  perspective: "raw"
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
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
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers = [], ...body] = rows;
  return body
    .filter((item) => item.some(Boolean))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ""])));
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
    "utf8"
  );
}

function normalizePath(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  try {
    const parsed = new URL(raw, SITE_URL);
    return `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
  } catch {
    return `/${raw.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0].split("/").filter(Boolean).join("/")}`;
  }
}

function absoluteUrl(route) {
  const normalized = normalizePath(route);
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

function cleanTitle(value, slug) {
  if (titleOverrides.has(slug)) return titleOverrides.get(slug);
  return String(value || slug.replace(/-/g, " "))
    .replace(/\b(powerful|critical|shocking|essential|ultimate|hidden|unlocking|revolutionizing|cracking the code)\b[:;]?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function blockText(block) {
  if (!block) return "";
  if (typeof block === "string") return block;
  if (Array.isArray(block.children)) return block.children.map((child) => child.text || "").join("");
  return "";
}

function bodyText(body) {
  return Array.isArray(body) ? body.map(blockText).join("\n").trim() : "";
}

function hasHref(body) {
  return Array.isArray(body) && body.some((block) => Array.isArray(block.markDefs) && block.markDefs.some((mark) => mark._type === "link" && mark.href));
}

function hasConsultationSignal(text) {
  return /consultation|contact chaman law firm|speak with|lawyer/i.test(text);
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) redirects.set(normalizePath(match[1]), normalizePath(match[2]));
  return redirects;
}

function freshEvidenceFiles() {
  const matches = [];
  const pattern = /(search.?console|gsc|bing|backlink|ahrefs|semrush|serp|featured.?snippet|404|crawl|coverage|index)/i;
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === ".next") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (pattern.test(entry.name) && !/SPRINT-11L/i.test(entry.name)) matches.push(fullPath);
    }
  }
  walk("docs");
  return matches.sort();
}

async function queryPostsBySlugs(slugs) {
  return client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,_type,title,slug,excerpt,publishedAt,author,categories,tags,isFeatured,isTrending,isMostRead,
      mainImage,body,"bodyText":pt::text(body),seo,lawFirmApproved
    }`,
    { slugs }
  );
}

function chooseSourceDoc(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true && doc._id.includes("sprint11k-hidden")) ||
    docs.find((doc) => doc.lawFirmApproved !== true && !doc._id.startsWith("drafts.")) ||
    docs.find((doc) => doc._id.startsWith("drafts.")) ||
    null;
}

function riskSignals(text, row, imageRow) {
  const rowNotes = `${row.notes || ""}\n${row["duplicate/cannibalization risk"] || ""}`;
  const imageNotes = `${imageRow?.notes || ""}\n${imageRow?.["Chaman Properties contamination risk"] || ""}\n${imageRow?.["image relevance"] || ""}`;
  const haystack = `${text}\n${rowNotes}\n${imageNotes}`.toLowerCase();
  const risks = [];
  if (/chaman properties|luxury|property sales/.test(haystack)) risks.push("off-brand/property-sales wording");
  if (/free legal|for free|get.*legal advice.*free/.test(haystack)) risks.push("misleading free-service wording");
  if (/self-help|forcefully evict|lock.*tenant|throw.*tenant|remove.*tenant/.test(haystack)) risks.push("unsafe self-help wording");
  if (/high - lawyer review|high risk|high - likely|high - old URL/.test(haystack)) risks.push("high legal-risk flag");
  if (/high - likely cannibalization|duplicate\/cannibalizing|body too short/.test(haystack)) risks.push("duplicate/thin-content flag");
  if (/overpromising|shocking|powerful|hidden strengths|revolutionizing/.test(haystack)) risks.push("overpromising/editorial hype");
  return [...new Set(risks)];
}

function approvalBlockers({ slug, sourceDoc, row, imageRow, text, configuredRedirect }) {
  const blockers = [];
  const imageRef = sourceDoc?.mainImage?.asset?._ref || imageRow?.["Sanity image reference"] || "";
  const alt = sourceDoc?.mainImage?.alt || imageRow?.["alt text"] || "";
  const canonical = sourceDoc?.seo?.canonicalUrl || row["canonical correct"] || "";
  const title = sourceDoc?.title || row.title || "";
  const metaDescription = sourceDoc?.seo?.metaDescription || "";
  const risks = riskSignals(text, row, imageRow);
  if (!lowRiskApprovalSlugs.has(slug)) blockers.push("not in Sprint 11L low-risk controlled subset");
  if (!sourceDoc) blockers.push("hidden Sanity source document missing");
  if (text.length < MIN_BODY_CHARACTERS) blockers.push("body too short");
  if (!title) blockers.push("title missing");
  if (!imageRef) blockers.push("image missing");
  if (!alt) blockers.push("alt text missing");
  if (!metaDescription && !row["meta description present"]) blockers.push("meta description missing");
  if (!canonical || normalizePath(canonical) !== `/resources/blog/${slug}`) blockers.push("canonical not aligned");
  if (!sourceDoc?.categories?.length && !row["category/practice relationship present"]) blockers.push("category/practice relationship missing");
  if (!hasConsultationSignal(text)) blockers.push("consultation CTA missing");
  if (!hasHref(sourceDoc?.body)) blockers.push("internal links missing");
  if (configuredRedirect && configuredRedirect !== `/resources/blog/${slug}`) blockers.push(`old URL already redirects to ${configuredRedirect}`);
  blockers.push(...risks);
  return [...new Set(blockers)];
}

function publicDocFromSource(sourceDoc, slug, finalTitle) {
  const image = sourceDoc.mainImage
    ? {
        ...sourceDoc.mainImage,
        alt: sourceDoc.mainImage.alt || `${finalTitle} legal guidance | Chaman Law Firm`
      }
    : undefined;
  return {
    _id: `${PUBLIC_PREFIX}${slug}`,
    _type: "post",
    title: finalTitle,
    slug: { _type: "slug", current: slug },
    excerpt: sourceDoc.excerpt || `${finalTitle} explained by Chaman Law Firm for public legal education in Nigeria.`,
    publishedAt: sourceDoc.publishedAt || new Date().toISOString(),
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: sourceDoc.categories || [],
    tags: sourceDoc.tags || [],
    isFeatured: false,
    isTrending: false,
    isMostRead: false,
    mainImage: image,
    body: sourceDoc.body || [],
    seo: {
      ...(sourceDoc.seo || {}),
      metaTitle: `${finalTitle} | Chaman Law Firm`,
      metaDescription:
        sourceDoc.seo?.metaDescription ||
        `${finalTitle} explained for public legal education in Nigeria by Chaman Law Firm.`,
      canonicalUrl: `${SITE_URL}/resources/blog/${slug}`,
      noIndex: false
    },
    lawFirmApproved: true
  };
}

async function head(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    return { status: response.status, location: response.headers.get("location") || "" };
  } catch (error) {
    return { status: "error", location: "", error: error.message };
  }
}

async function getText(url) {
  try {
    const response = await fetch(url);
    return { status: response.status, text: await response.text() };
  } catch (error) {
    return { status: "error", text: "", error: error.message };
  }
}

async function main() {
  if (shouldApply && !token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const rows = readCsv(paths.sprint11kApproval)
    .filter((row) => row["approval status"] === "hidden" && row.slug !== "revocation-of-power-of-attorney");
  const imageRows = new Map(readCsv(paths.sprint11kImage).map((row) => [row.slug, row]));
  const staticRows = readCsv(paths.sprint11kStatic);
  const redirects = parseRedirects(fs.readFileSync(paths.nextConfig, "utf8"));
  const slugs = rows.map((row) => row.slug);
  const docs = await queryPostsBySlugs(slugs);
  const docsBySlug = new Map();
  for (const doc of docs) {
    const slug = doc.slug?.current;
    if (!slug) continue;
    if (!docsBySlug.has(slug)) docsBySlug.set(slug, []);
    docsBySlug.get(slug).push(doc);
  }

  const evidence = freshEvidenceFiles();
  const sourceRows = [];
  const imageCompletionRows = [];
  const lawyerRows = [];
  const approvalRows = [];
  const redirectRows = [];
  const approved = [];
  const hidden = [];
  const patches = [];

  for (const row of rows) {
    const slug = row.slug;
    const oldPath = normalizePath(row["old URL"]);
    const sourceDoc = chooseSourceDoc(docsBySlug.get(slug) || []);
    const imageRow = imageRows.get(slug) || {};
    const text = bodyText(sourceDoc?.body) || sourceDoc?.bodyText || "";
    const configuredRedirect = redirects.get(oldPath);
    const finalTitle = cleanTitle(sourceDoc?.title || row.title, slug);
    const blockers = approvalBlockers({ slug, sourceDoc, row, imageRow, text, configuredRedirect });
    const canApprove = blockers.length === 0;
    const classification = canApprove
      ? "low-risk and approval-ready"
      : blockers.some((item) => /high legal-risk|unsafe|off-brand|duplicate|thin/.test(item))
        ? "high risk, keep hidden"
        : blockers.includes("not in Sprint 11L low-risk controlled subset")
          ? "medium risk, needs lawyer review"
          : "medium risk, needs lawyer review";
    const imageRef = sourceDoc?.mainImage?.asset?._ref || imageRow["Sanity image reference"] || "";
    const alt = sourceDoc?.mainImage?.alt || imageRow["alt text"] || "";
    const canonical = sourceDoc?.seo?.canonicalUrl || `${SITE_URL}/resources/blog/${slug}`;

    sourceRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title: finalTitle,
      "body recovered yes/no": text.length >= MIN_BODY_CHARACTERS ? "yes" : "no",
      "body quality": text.length >= 1800 ? "complete" : text.length >= MIN_BODY_CHARACTERS ? "usable" : "thin/missing",
      "short/thin risk": text.length < MIN_BODY_CHARACTERS ? "yes" : "no",
      "plugin debris": /wp-block|elementor|yoast|rankmath|shortcode/i.test(text) ? "possible" : "not detected",
      "image status": imageRef ? "present" : "missing",
      "alt status": alt ? "present" : "missing",
      "metadata status": sourceDoc?.seo?.metaTitle && sourceDoc?.seo?.metaDescription ? "complete" : "needs completion",
      "legal/current-law risk": classification,
      "duplicate/cannibalization risk": blockers.find((item) => /duplicate|cannibalization/.test(item)) || "not flagged",
      "approval readiness": canApprove ? (shouldApply ? "approved" : "ready if --apply") : "not ready",
      notes: blockers.join("; ") || "passes Sprint 11L approval gates"
    });

    imageCompletionRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title: finalTitle,
      "image status": imageRef ? "present" : "missing",
      "alt text": alt || "",
      "SEO title": `${finalTitle} | Chaman Law Firm`,
      "meta description": sourceDoc?.seo?.metaDescription || `${finalTitle} explained for public legal education in Nigeria by Chaman Law Firm.`,
      canonical,
      "category/practice relationship": sourceDoc?.categories?.length ? "present" : row["category/practice relationship present"] || "needs review",
      "consultation CTA": hasConsultationSignal(text) ? "present" : "missing",
      "internal links": hasHref(sourceDoc?.body) ? "present" : "missing",
      "completion action": canApprove ? (shouldApply ? "public and hidden metadata normalized" : "ready to normalize on apply") : "kept hidden; no broad image substitution",
      notes: canApprove ? "image/metadata gates passed" : blockers.join("; ")
    });

    lawyerRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title: finalTitle,
      classification,
      "unsafe legal advice": blockers.some((item) => /unsafe/.test(item)) ? "yes" : "not detected",
      "outdated/current-law concern": classification === "low-risk and approval-ready" ? "low - evergreen legal education" : "manual verification required",
      "overpromising/editorial hype": blockers.some((item) => /overpromising/.test(item)) ? "yes" : "not detected",
      "misleading free-service wording": blockers.some((item) => /free-service/.test(item)) ? "yes" : "not detected",
      "self-help risk": blockers.some((item) => /self-help/.test(item)) ? "yes" : "not detected",
      "author governance": AUTHOR_NAME,
      "approval recommendation": canApprove ? "approve controlled public article" : "keep hidden",
      notes: blockers.join("; ") || "evergreen/doctrinal topic cleared for controlled preview/public visibility"
    });

    approvalRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title: finalTitle,
      "complete recovered body": text.length >= MIN_BODY_CHARACTERS ? "yes" : "no",
      "clean formatting": /wp-block|elementor|yoast|rankmath|shortcode/i.test(text) ? "needs review" : "yes",
      "unsafe legal claim": blockers.some((item) => /unsafe|high legal-risk/.test(item)) ? "flagged" : "not detected",
      "misleading free-service wording": blockers.some((item) => /free-service/.test(item)) ? "flagged" : "not detected",
      "duplicate/cannibalization risk": blockers.some((item) => /duplicate/.test(item)) ? "flagged" : "not flagged",
      "SEO title present": "yes",
      "meta description present": sourceDoc?.seo?.metaDescription ? "yes" : "completed from approved fallback",
      "canonical correct": canonical,
      "image and alt text present": imageRef && alt ? "yes" : "no",
      "category/practice relationship present": sourceDoc?.categories?.length ? "yes" : "needs review",
      "CTA present": hasConsultationSignal(text) ? "yes" : "no",
      "internal links present": hasHref(sourceDoc?.body) ? "yes" : "no",
      author: AUTHOR_NAME,
      "approval status": canApprove ? (shouldApply ? "approved" : "ready") : "hidden",
      "redirect status": canApprove ? "ready after live/sitemap verification" : "not eligible",
      notes: blockers.join("; ") || "approved by Sprint 11L low-risk gates"
    });

    if (canApprove && sourceDoc) {
      const publicDoc = publicDocFromSource(sourceDoc, slug, finalTitle);
      approved.push({ slug, oldUrl: absoluteUrl(row["old URL"]), target: `${SITE_URL}/resources/blog/${slug}`, title: finalTitle });
      redirectRows.push({
        "old URL": absoluteUrl(row["old URL"]),
        "old source path": oldPath,
        "new URL": `${SITE_URL}/resources/blog/${slug}`,
        "new target path": `/resources/blog/${slug}`,
        "redirect type": "one-hop 308",
        "activation status": "pending code activation after live/sitemap verification",
        "sitemap status": shouldApply ? "verify after production revalidation" : "pending approval",
        notes: "do not activate until target returns 200 and appears in sitemap"
      });
      if (shouldApply) {
        await client
          .patch(sourceDoc._id)
          .set({
            title: finalTitle,
            author: { _type: "reference", _ref: AUTHOR_ID },
            "mainImage.alt": publicDoc.mainImage?.alt,
            seo: publicDoc.seo,
            lawFirmApproved: false
          })
          .commit();
        await client.createOrReplace(publicDoc);
        patches.push({ slug, hiddenId: sourceDoc._id, publicId: publicDoc._id });
      }
    } else {
      hidden.push({ slug, oldUrl: absoluteUrl(row["old URL"]), reason: blockers.join("; ") || "kept hidden for manual review" });
    }
  }

  const staticContinuationRows = [];
  for (const row of staticRows.slice(0, 10)) {
    const oldPath = normalizePath(row["old URL"]);
    const targetPath = normalizePath(row["proposed final URL"]);
    const configured = redirects.get(oldPath);
    const targetHead = await head(absoluteUrl(targetPath));
    staticContinuationRows.push({
      priority: row.priority,
      "old URL": absoluteUrl(oldPath),
      "proposed final URL": absoluteUrl(targetPath),
      "page type": row["page type"] || "service/static authority",
      decision: configured ? "existing exact redirect retained; verify only" : "defer for service/static page brief",
      "target status": targetHead.status,
      "canonical-safe": targetHead.status === 200 ? "target reachable; manual canonical review still required" : "not ready",
      "sitemap-safe": "verify in production sitemap before any new redirect",
      "legal review status": row["legal review status"] || "manual review required",
      "recommended next action": configured ? "no new redirect in Sprint 11L" : "prepare content/intent brief before activation",
      notes: configured ? `configured to ${configured}` : "not activated"
    });
  }

  writeCsv(paths.sourceReview, [
    "old URL", "slug", "title", "body recovered yes/no", "body quality", "short/thin risk", "plugin debris", "image status", "alt status",
    "metadata status", "legal/current-law risk", "duplicate/cannibalization risk", "approval readiness", "notes"
  ], sourceRows);
  writeCsv(paths.imageCompletion, [
    "old URL", "slug", "title", "image status", "alt text", "SEO title", "meta description", "canonical",
    "category/practice relationship", "consultation CTA", "internal links", "completion action", "notes"
  ], imageCompletionRows);
  writeCsv(paths.lawyerReview, [
    "old URL", "slug", "title", "classification", "unsafe legal advice", "outdated/current-law concern", "overpromising/editorial hype",
    "misleading free-service wording", "self-help risk", "author governance", "approval recommendation", "notes"
  ], lawyerRows);
  writeCsv(paths.approvalBatch, [
    "old URL", "slug", "title", "complete recovered body", "clean formatting", "unsafe legal claim", "misleading free-service wording",
    "duplicate/cannibalization risk", "SEO title present", "meta description present", "canonical correct", "image and alt text present",
    "category/practice relationship present", "CTA present", "internal links present", "author", "approval status", "redirect status", "notes"
  ], approvalRows);
  writeCsv(paths.staticContinuation, [
    "priority", "old URL", "proposed final URL", "page type", "decision", "target status", "canonical-safe", "sitemap-safe",
    "legal review status", "recommended next action", "notes"
  ], staticContinuationRows);
  writeCsv(paths.redirectBatch, [
    "old URL", "old source path", "new URL", "new target path", "redirect type", "activation status", "sitemap status", "notes"
  ], redirectRows);

  const approvedCountBefore = shouldApply
    ? await client.fetch(`count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])`)
    : null;
  const sitemap = await getText(`${SITE_URL}/sitemap.xml`);
  const robots = await getText(`${SITE_URL}/robots.txt`);
  const result = {
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    recoveredHiddenCandidatesReviewed: rows.length,
    approvedCount: approved.length,
    approvedSlugs: approved.map((item) => item.slug),
    keptHiddenCount: hidden.length,
    patchesApplied: patches.length,
    staticRowsReviewed: staticContinuationRows.length,
    redirectRows: redirectRows.length,
    approvedPublicPostsAfterApply: approvedCountBefore,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  };
  fs.writeFileSync(paths.resultJson, `${JSON.stringify({ result, approved, hidden }, null, 2)}\n`, "utf8");
  fs.writeFileSync(paths.freshEvidence, [
    "# Sprint 11L Fresh Search Evidence Status",
    "",
    "No fresh post-launch GSC, Bing, backlink, or SERP exports were found locally during Sprint 11L.",
    "",
    `Existing related local evidence files detected: ${evidence.length}.`,
    "",
    "Next action: export fresh Search Console pages/queries, Bing crawl/index reports, and backlink/SERP evidence before prioritizing the next recovery batch."
  ].join("\n"), "utf8");
  fs.writeFileSync(paths.report, [
    "# Sprint 11L Recovered Source Approval Report",
    "",
    `Applied: ${shouldApply ? "yes" : "no - dry run"}`,
    `Recovered Sprint 11K hidden candidates reviewed: ${rows.length}`,
    `Articles approved by controlled low-risk gates: ${approved.length}`,
    `Articles kept hidden: ${hidden.length}`,
    `Static/service rows reviewed: ${staticContinuationRows.length}`,
    `Redirect rows prepared: ${redirectRows.length}`,
    "",
    "## Approved Slugs",
    approved.length ? approved.map((item) => `- ${item.slug}`).join("\n") : "- None",
    "",
    "## Guardrails",
    "- No DNS, Hostinger, Chaman Properties, backup, SQL dump, wp-config, or secret files were touched.",
    "- Public author remains Charles Chukwuma Nkwoka, Esq.",
    "- Redirects remain pending until each target is live, canonical-safe, and sitemap-included.",
    "- Medium/high current-law and duplicate/cannibalization candidates remain hidden."
  ].join("\n"), "utf8");

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
