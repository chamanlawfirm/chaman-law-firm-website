import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11o-";
const STATIC_REDIRECT_LIMIT = 20;
const STATIC_BRIEF_LIMIT = 20;
const REVIEW_LIMIT = 100;
const MIN_BODY_CHARS = 900;
const shouldApply = process.argv.includes("--apply");

const paths = {
  nextConfig: "next.config.mjs",
  imageLibrary: path.join("docs", "SPRINT-11J-APPROVED-LEGAL-IMAGE-LIBRARY.csv"),
  legacyInventory11d: path.join("docs", "SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"),
  legacyInventory11e: path.join("docs", "SPRINT-11E-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"),
  sprint11nBlogBatch: path.join("docs", "SPRINT-11N-BLOG-APPROVAL-BATCH.csv"),
  sprint11nLegal: path.join("docs", "SPRINT-11N-LEGAL-CURRENT-LAW-CLEARANCE.csv"),
  sprint11nImage: path.join("docs", "SPRINT-11N-IMAGE-ALT-REPAIR.csv"),
  sprint11nSource: path.join("docs", "SPRINT-11N-SOURCE-BODY-REPAIR.csv"),
  freshEvidenceStatus: path.join("docs", "SPRINT-11O-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  staticPriorityReview: path.join("docs", "SPRINT-11O-STATIC-AUTHORITY-PRIORITY-REVIEW.csv"),
  staticServiceBatch: path.join("docs", "SPRINT-11O-STATIC-SERVICE-RESTORATION-BATCH.csv"),
  staticRedirectBatch: path.join("docs", "SPRINT-11O-STATIC-EXACT-REDIRECT-RESCUE-BATCH.csv"),
  blogContinuation: path.join("docs", "SPRINT-11O-LAWYER-REVIEWED-BLOG-CONTINUATION.csv"),
  seoAeoGeo: path.join("docs", "SPRINT-11O-SEO-AEO-GEO-ENHANCEMENT.csv"),
  indexingPack: path.join("docs", "SPRINT-11O-GSC-BING-INDEXING-PACK.md"),
  report: path.join("docs", "SPRINT-11O-STATIC-AUTHORITY-AND-BLOG-RECOVERY-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11O-RESULT.json")
};

const preferredBlogApprovalSlugs = [
  "proven-steps-the-canons-of-interpretation",
  "land-use-act-1978",
  "challenges-of-implementing-the-land-use-act",
  "expert-witnesses-in-nigeria-court-proceeding",
  "doctrine-of-ultra-vires"
];
const preferredBlogApprovalSet = new Set(preferredBlogApprovalSlugs);

const staticSourceFiles = [
  paths.legacyInventory11e,
  paths.legacyInventory11d,
  path.join("docs", "SPRINT-11N-STATIC-SERVICE-RECOVERY-BATCH.csv"),
  path.join("docs", "SPRINT-11M-STATIC-SERVICE-PAGE-RECOVERY-BATCH.csv"),
  path.join("docs", "SPRINT-11L-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  path.join("docs", "SPRINT-11K-STATIC-SERVICE-AUTHORITY-RESTORATION.csv"),
  path.join("docs", "SPRINT-11J-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  path.join("docs", "SPRINT-11G-STATIC-SERVICE-RESTORATION-BATCH.csv"),
  path.join("docs", "SPRINT-11F-STATIC-SERVICE-RESTORATION-SELECTION.csv"),
  path.join("docs", "SPRINT-11E-STATIC-SERVICE-PAGE-CREATION-PLAN.csv"),
  path.join("docs", "SPRINT-11D-STATIC-SERVICE-PAGE-RESTORATION-PLAN.csv")
];

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
  if (!raw || raw === "/") return "/";
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

function slugFromUrl(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function titleCase(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bCac\b/g, "CAC")
    .replace(/\bOf\b/g, "of")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bThe\b/g, "the");
}

function cleanTitle(value, slug) {
  return titleCase(
    (value || slug.replace(/-/g, " "))
      .replace(/\b(powerful|ultimate|proven|hidden|shocking|essential|best|truths behind|unlocking)\b[:;]?\s*/gi, "")
      .replace(/\s+/g, " ")
      .trim()
  ).replace(/^(a|the)\b/i, (match) => match[0].toUpperCase() + match.slice(1).toLowerCase());
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) redirects.set(normalizePath(match[1]), normalizePath(match[2]));
  const exactArticleSetPattern = /const\s+\w+ExactArticleRedirectSources\s*=\s*new Set\(\[([\s\S]*?)\]\);/g;
  while ((match = exactArticleSetPattern.exec(configText))) {
    const body = match[1];
    const sourcePattern = /"([^"]+)"/g;
    let sourceMatch;
    while ((sourceMatch = sourcePattern.exec(body))) {
      const source = normalizePath(sourceMatch[1]);
      redirects.set(source, `/resources/blog${source}`);
      redirects.set(normalizePath(`${source}/`), `/resources/blog${source}`);
    }
  }
  return redirects;
}

function safeStaticTarget(route) {
  const target = normalizePath(route);
  if (target === "/") return false;
  return /^\/(about|lawyers|contact|consultation|media|resources\/downloads|practice-areas)(\/|$)/.test(target);
}

function staticTypeFor(row) {
  return row["old content type"] || row["page type"] || row["content type"] || "service/static authority";
}

function rowValue(row, keys) {
  for (const key of keys) {
    if (row[key]) return row[key];
  }
  return "";
}

function staticTargetFor(row) {
  const target = rowValue(row, [
    "recommended target",
    "best new route",
    "proposed final route",
    "proposed final URL",
    "redirect target"
  ]);
  if (!target) return "";
  const normalized = normalizePath(target);
  const haystack = `${rowValue(row, ["old URL", "URL", "source"])} ${rowValue(row, ["old title", "H1", "title"])} ${rowValue(row, ["old content type", "page type"])}`.toLowerCase();
  if (/tax|vat|revenue|clearance certificate/.test(haystack)) return "/practice-areas/corporate-commercial-law";
  if (/probate|inheritance|will|intestacy|estate|letter-of-administration|administration/.test(haystack)) return "/practice-areas/probate-estate-administration";
  if (/immigration|visa|citizenship|passport|residency|border/.test(haystack)) return "/practice-areas/immigration-services";
  if (/court|litigation|police|injunction|lawsuit|judiciary|laches|acquiescence|human right|witness|evidence|proceeding/.test(haystack)) return "/practice-areas/litigation-dispute-resolution";
  if (/arbitrable|arbitration|arbitral|mediation|mediator|adr/.test(haystack)) return "/practice-areas/adr-mediation";
  if (/employment|labour|trade-union|workplace/.test(haystack)) return "/practice-areas/employment-law";
  if (/debt|loan|recovery/.test(haystack)) return "/practice-areas/debt-recovery";
  if (/land|property|tenant|landlord|c-of-o|occupancy|governor|mortgage|survey|title|rent|caveat|building approval/.test(haystack)) return "/practice-areas/property-real-estate-law";
  if (/corporate|company|cac|contract|share|director|securities|business|commercial|bank|finance|oil-and-gas|maritime/.test(haystack)) return "/practice-areas/corporate-commercial-law";
  if (/family|marriage|divorce|child|surname|paternity|maternity/.test(haystack)) return "/practice-areas/family-law";
  if (/notary|apostille|legalize|attest|document/.test(haystack)) return "/practice-areas/notary-public-services";
  return normalized;
}

function parseNumber(value) {
  const direct = Number(String(value || "").replace(/,/g, ""));
  if (Number.isFinite(direct)) return direct;
  const match = String(value || "").match(/([\d,]+)\s+clicks/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function parseImpressions(value) {
  const direct = Number(String(value || "").replace(/,/g, ""));
  if (Number.isFinite(direct)) return direct;
  const match = String(value || "").match(/([\d,]+)\s+impressions/i);
  return match ? Number(match[1].replace(/,/g, "")) : 0;
}

function evidenceText(row) {
  const clicks = row["GSC clicks"] || "";
  const impressions = row["GSC impressions"] || "";
  if (clicks || impressions) return `${clicks || 0} clicks; ${impressions || 0} impressions`;
  return row["Google ranking/impression/click evidence"] || "not available locally";
}

function scoreStatic(row) {
  const clicks = parseNumber(row["GSC clicks"] || row["Google ranking/impression/click evidence"]);
  const impressions = parseImpressions(row["GSC impressions"] || row["Google ranking/impression/click evidence"]);
  const target = staticTargetFor(row);
  const title = `${rowValue(row, ["old title", "H1", "title"])} ${target}`.toLowerCase();
  let score = clicks * 10 + impressions / 100;
  if (/property|land|c-of-o|occupancy|title|tenant|probate|estate|corporate|contract|immigration|notary|employment|debt|arbitration|mediation/.test(title)) score += 150;
  if (/high/.test(String(row["legal risk"] || row["legal review status"] || "").toLowerCase())) score -= 25;
  return Math.round(score);
}

function buildStaticCandidates(existingRedirects) {
  const bySource = new Map();
  for (const filePath of staticSourceFiles) {
    for (const row of readCsv(filePath)) {
      const oldUrl = rowValue(row, ["old URL", "URL", "source"]);
      if (!oldUrl) continue;
      const source = normalizePath(oldUrl);
      const target = staticTargetFor(row);
      if (!source || source === "/" || !safeStaticTarget(target)) continue;
      if (source === target) continue;
      const existingTarget = existingRedirects.get(source);
      const title = cleanTitle(rowValue(row, ["old title", "H1", "title"]), slugFromUrl(oldUrl));
      const candidate = {
        source,
        oldUrl: absoluteUrl(source),
        target,
        targetUrl: absoluteUrl(target),
        title,
        pageType: staticTypeFor(row),
        clicks: parseNumber(row["GSC clicks"] || row["Google ranking/impression/click evidence"]),
        impressions: parseImpressions(row["GSC impressions"] || row["Google ranking/impression/click evidence"]),
        evidence: evidenceText(row),
        legalStatus: row["legal risk"] || row["legal safety status"] || row["legal review status"] || "low/medium - editorial legal review required",
        imageStatus: row["image status"] || row["image recommendation"] || "approved legal/service image required",
        configured: existingTarget ? "already configured" : "not configured",
        existingTarget: existingTarget || "",
        score: scoreStatic(row)
      };
      const existing = bySource.get(source);
      if (!existing || candidate.score > existing.score) bySource.set(source, candidate);
    }
  }
  return [...bySource.values()].sort((a, b) => b.score - a.score);
}

function blockText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children.map((child) => child.text || "").join("");
}

function bodyText(body) {
  if (!Array.isArray(body)) return "";
  return body.map(blockText).filter(Boolean).join("\n");
}

function hasHref(body) {
  return Array.isArray(body) && body.some((block) => Array.isArray(block.markDefs) && block.markDefs.some((mark) => mark.href));
}

function hasConsultationSignal(text) {
  return /\/consultation|book a consultation|speak with (a|our) lawyer|contact chaman law firm|consultation/i.test(text);
}

function makeBlock(key, text, style = "normal", markDefs = [], children = null) {
  return {
    _type: "block",
    _key: key.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80),
    style,
    markDefs,
    children: children || [{ _type: "span", _key: `${key}-span`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80), text, marks: [] }]
  };
}

function sanitizePortableBody(body) {
  if (!Array.isArray(body)) return [];
  return body
    .filter((block) => block && block._type === "block")
    .map((block) => ({
      ...block,
      children: Array.isArray(block.children)
        ? block.children.map((child) => ({
            ...child,
            text: String(child.text || "")
              .replace(/Chaman Properties/gi, "Chaman Law Firm")
              .replace(/free legal advice/gi, "legal guidance")
              .replace(/\b(powerful|shocking|ultimate|hidden)\b[:;]?\s*/gi, "")
          }))
        : []
    }));
}

function practiceInfo(slug = "", title = "", category = "") {
  const haystack = `${slug} ${title} ${category}`.toLowerCase();
  if (/land|property|tenant|landlord|c-of-o|certificate|governor|occupancy|mortgage|stamp|charge|building|permit|title|survey|caveat/.test(haystack)) {
    return { title: "Property and Real Estate Law", categoryId: "category.property-and-real-estate-law", href: "/practice-areas/property-real-estate-law", topic: "property law" };
  }
  if (/corporate|company|cac|contract|share|director|securities|business|ultra vires|minority|private placement|tax|commerce/.test(haystack)) {
    return { title: "Corporate and Commercial Law", categoryId: "category.corporate-commercial-law", href: "/practice-areas/corporate-commercial-law", topic: "corporate and commercial law" };
  }
  if (/court|litigation|witness|evidence|lawsuit|equity|judiciary|rule of law|nigerian legal system|canons|interpretation|defamatory/.test(haystack)) {
    return { title: "Litigation and Dispute Resolution", categoryId: "category.litigation-dispute-resolution", href: "/practice-areas/litigation-dispute-resolution", topic: "litigation and dispute resolution" };
  }
  if (/adr|mediation|arbitration/.test(haystack)) {
    return { title: "ADR / Mediation", categoryId: "category.adr-mediation", href: "/practice-areas/adr-mediation", topic: "ADR and mediation" };
  }
  if (/probate|estate|inheritance|will|testamentary/.test(haystack)) {
    return { title: "Probate and Estate Administration", categoryId: "category.probate-estate-administration", href: "/practice-areas/probate-estate-administration", topic: "probate and estate administration" };
  }
  if (/family|marriage|divorce|child|paternity|maternity|surname/.test(haystack)) {
    return { title: "Family Law", categoryId: "category.family-law", href: "/practice-areas/family-law", topic: "family law" };
  }
  if (/immigration|visa|citizenship|passport|residency|travel/.test(haystack)) {
    return { title: "Immigration", categoryId: "category.immigration", href: "/practice-areas/immigration-services", topic: "immigration" };
  }
  if (/employment|labour|trade-union|workplace/.test(haystack)) {
    return { title: "Employment Law", categoryId: "category.employment-law", href: "/practice-areas/employment-law", topic: "employment law" };
  }
  if (/debt|loan|recovery/.test(haystack)) {
    return { title: "Debt Recovery", categoryId: "category.debt-recovery", href: "/practice-areas/debt-recovery", topic: "debt recovery" };
  }
  if (/notary|notar|power of attorney|apostille|affidavit|document|deed poll/.test(haystack)) {
    return { title: "Notary Public", categoryId: "category.notary-public", href: "/practice-areas/notary-public-services", topic: "notary public" };
  }
  return { title: "General Legal Education", categoryId: "category.general-legal-education", href: "/practice-areas", topic: "general legal education" };
}

function categoryRefs(info) {
  return [{ _type: "reference", _key: info.categoryId.replace(/[^a-z0-9_-]/gi, "-"), _ref: info.categoryId }];
}

async function ensureCategory(info) {
  if (!shouldApply) return;
  await client.createIfNotExists({
    _id: info.categoryId,
    _type: "category",
    title: info.title,
    slug: { _type: "slug", current: info.categoryId.replace(/^category\./, "") },
    description: `${info.title} insights from Chaman Law Firm.`
  });
}

function normalizeImageLibrary(rows) {
  return rows
    .map((row) => ({
      assetId: row["Sanity asset reference if available"] || "",
      topic: row["topic category"] || "",
      repeatedRisk: row["repeated-use risk"] || "",
      contamination: row["Chaman Properties contamination risk"] || "",
      existingCount: Number(String(row.notes || "").match(/Used by (\d+)/i)?.[1] || 0),
      source: row["image source"] || ""
    }))
    .filter((row) => row.assetId);
}

function libraryTopicMatches(candidateTopic, articleTopic) {
  const candidate = String(candidateTopic || "").toLowerCase();
  const article = String(articleTopic || "").toLowerCase();
  if (candidate === article) return true;
  if (/litigation|court|dispute/.test(article) && /litigation|court/.test(candidate)) return true;
  if (/property|land/.test(article) && /property|land/.test(candidate)) return true;
  if (/corporate|commercial/.test(article) && /corporate|cac|company|tax/.test(candidate)) return true;
  if (/probate|estate/.test(article) && /probate|estate/.test(candidate)) return true;
  if (/family/.test(article) && /family/.test(candidate)) return true;
  if (/immigration/.test(article) && /immigration/.test(candidate)) return true;
  if (/debt/.test(article) && /debt/.test(candidate)) return true;
  if (/notary/.test(article) && /notary/.test(candidate)) return true;
  return false;
}

function chooseFallbackImage(topic, imageLibrary, useCounts) {
  return imageLibrary
    .filter((row) => !/yes|review/i.test(row.contamination) && !/high/i.test(row.repeatedRisk))
    .filter((row) => libraryTopicMatches(row.topic, topic))
    .sort((a, b) => (useCounts.get(a.assetId) || 0) - (useCounts.get(b.assetId) || 0) || a.existingCount - b.existingCount)[0] || null;
}

function altTextFor(title, topic) {
  return `${title} legal guidance for ${topic} | Chaman Law Firm`;
}

function enrichBody(body, slug, title, info) {
  const cleanBody = sanitizePortableBody(body);
  const text = bodyText(cleanBody);
  const nextBody = [...cleanBody];
  if (!/general legal education|public legal education|does not replace advice/i.test(text)) {
    nextBody.unshift(makeBlock(`legal-frame-${slug}`, "This article is provided for public legal education. It does not replace advice from a lawyer who has reviewed the facts, documents, deadlines, and applicable law."));
  }
  if (!/what this means|key point|quick answer|in brief/i.test(text)) {
    nextBody.unshift(makeBlock(`answer-${slug}`, `In brief, ${title} should be understood as a Nigerian legal education topic. The safest next step depends on the facts, documents, timeline, and applicable law.`));
  }
  if (!hasHref(nextBody)) {
    nextBody.push(
      makeBlock(
        `practice-link-${slug}`,
        "",
        "normal",
        [{ _key: "practice", _type: "link", href: info.href }],
        [
          { _type: "span", _key: "a", text: "Related service: ", marks: [] },
          { _type: "span", _key: "b", text: info.title, marks: ["practice"] },
          { _type: "span", _key: "c", text: " from Chaman Law Firm.", marks: [] }
        ]
      )
    );
  }
  if (!hasConsultationSignal(text)) {
    nextBody.push(
      makeBlock(
        `consult-${slug}`,
        "",
        "normal",
        [
          { _key: "consultation", _type: "link", href: "/consultation" },
          { _key: "contact", _type: "link", href: "/contact" }
        ],
        [
          { _type: "span", _key: "a", text: "For advice tailored to your matter, ", marks: [] },
          { _type: "span", _key: "b", text: "book a consultation", marks: ["consultation"] },
          { _type: "span", _key: "c", text: " or ", marks: [] },
          { _type: "span", _key: "d", text: "contact Chaman Law Firm", marks: ["contact"] },
          { _type: "span", _key: "e", text: " before taking legal steps.", marks: [] }
        ]
      )
    );
  }
  return nextBody.slice(0, 140);
}

function detectTextRisks(text) {
  const haystack = String(text || "");
  const risks = [];
  const promotionalText = haystack.replace(/cautious of anyone who guarantees?[^.]+/gi, "");
  if (/Chaman Properties/i.test(haystack)) risks.push("Chaman Properties reference");
  if (/luxury|mansion|buy now|estate sales|property sales|land banking/i.test(haystack)) risks.push("property-sales/luxury wording");
  if (/free legal advice|get .* for free|free service/i.test(haystack)) risks.push("misleading free-service wording");
  if (/elementor|wp-block|shortcode|\[\/?[a-z0-9_-]+/i.test(haystack)) risks.push("plugin debris");
  if (/forcefully evict|self-help eviction|eject.*without.*court|take the law into your own hands|lock(?:ed)? out/i.test(haystack)) risks.push("unsafe self-help wording");
  if (/guaranteed legal outcome|guarantee(?:d)? result|assured result|must win|certain outcome/i.test(promotionalText)) risks.push("overpromising");
  if (/this is not legal advice/i.test(haystack) && !/consult/i.test(haystack)) risks.push("disclaimer without consultation path");
  return [...new Set(risks)];
}

function seoFor(slug, title, doc, batchRow) {
  return {
    title: doc?.seo?.metaTitle || `${title} | Chaman Law Firm`,
    description:
      doc?.seo?.metaDescription ||
      batchRow?.["meta description"] ||
      batchRow?.["old meta description"] ||
      `Learn key Nigerian legal considerations on ${title}. Chaman Law Firm explains risks, documents, and when to speak with a lawyer.`
  };
}

function chooseSourceDoc(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true && !doc._id.startsWith("drafts.")) || docs.find((doc) => doc._id.startsWith("drafts.")) || docs[0] || null;
}

function buildPostDoc({ slug, title, sourceDoc, info, image, seo, body }) {
  return {
    _id: `${PUBLIC_PREFIX}${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: seo.description,
    publishedAt: sourceDoc?.publishedAt || new Date().toISOString(),
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: categoryRefs(info),
    tags: [info.title, "Legal Education", "Chaman Law Firm"],
    isFeatured: false,
    isTrending: false,
    isMostRead: false,
    mainImage: image?.assetId
      ? {
          _type: "image",
          asset: { _type: "reference", _ref: image.assetId },
          alt: image.alt
        }
      : undefined,
    body,
    seo: {
      metaTitle: seo.title,
      metaDescription: seo.description,
      canonicalUrl: absoluteUrl(`/resources/blog/${slug}`),
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article"
    },
    lawFirmApproved: true
  };
}

async function queryPostsBySlugs(slugs) {
  return client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,_updatedAt,title,"slug":slug.current,excerpt,publishedAt,
      "authorRef":author._ref,"authorName":author->name,
      categories[]->{_id,title,"slug":slug.current},tags,mainImage{alt,asset->{_id,url}},
      body,"bodyText":pt::text(body),seo,lawFirmApproved
    }`,
    { slugs }
  );
}

function freshEvidenceFiles() {
  const matches = [];
  const pattern = /(search.?console|gsc|bing|not.?found|404|crawl|index|redirect.?error|performance|queries|backlink|ahrefs|semrush|ubersuggest|moz|serp|featured.?snippet)/i;
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (/node_modules|\.next|\.git|wp-content|backup/i.test(full)) continue;
        walk(full);
      } else if (pattern.test(entry.name)) {
        matches.push({ file: full, mtime: fs.statSync(full).mtime.toISOString() });
      }
    }
  }
  walk("docs");
  return matches.sort((a, b) => b.mtime.localeCompare(a.mtime)).slice(0, 25);
}

async function main() {
  const nextConfig = fs.readFileSync(paths.nextConfig, "utf8");
  const redirects = parseRedirects(nextConfig);
  const imageLibrary = normalizeImageLibrary(readCsv(paths.imageLibrary));
  const useCounts = new Map();
  const evidenceFiles = freshEvidenceFiles();

  const staticCandidates = buildStaticCandidates(redirects);
  const topStaticReview = staticCandidates.slice(0, REVIEW_LIMIT);
  const unconfiguredStatic = staticCandidates
    .filter((row) => row.configured === "not configured")
    .filter((row) => !/homepage|hidden draft/i.test(row.target))
    .slice(0, STATIC_REDIRECT_LIMIT);
  const staticBriefs = staticCandidates.slice(0, STATIC_BRIEF_LIMIT);

  const batchRows = readCsv(paths.sprint11nBlogBatch);
  const legalRows = new Map(readCsv(paths.sprint11nLegal).map((row) => [row.slug, row]));
  const batchBySlug = new Map(batchRows.map((row) => [row.slug, row]));
  const reviewSlugs = batchRows
    .filter((row) => row.slug && !/^approved$/i.test(row["approval status"] || ""))
    .map((row) => row.slug)
    .slice(0, 47);
  const docs = await queryPostsBySlugs(reviewSlugs);
  const docsBySlug = new Map();
  for (const doc of docs) {
    if (!docsBySlug.has(doc.slug)) docsBySlug.set(doc.slug, []);
    docsBySlug.get(doc.slug).push(doc);
  }

  const blogRows = [];
  const seoRows = [];
  const approved = [];
  const keptHidden = [];

  for (const slug of reviewSlugs) {
    const batchRow = batchBySlug.get(slug) || {};
    const legalRow = legalRows.get(slug) || {};
    const sourceDoc = chooseSourceDoc(docsBySlug.get(slug) || []);
    const title = cleanTitle(sourceDoc?.title || batchRow.title || legalRow.title, slug);
    const info = practiceInfo(slug, title, batchRow["category/practice relationship present"] || "");
    const existingText = sourceDoc?.bodyText || bodyText(sourceDoc?.body || []);
    const risks = detectTextRisks(existingText);
    const alreadyApproved = Boolean(docsBySlug.get(slug)?.some((doc) => doc.lawFirmApproved === true && !doc._id.startsWith("drafts.")));
    let image = sourceDoc?.mainImage?.asset?._id
      ? { assetId: sourceDoc.mainImage.asset._id, alt: sourceDoc.mainImage.alt || altTextFor(title, info.topic), source: "source Sanity image" }
      : null;
    if (!image || !image.alt || /missing|review/i.test(image.alt)) {
      const fallback = chooseFallbackImage(info.topic, imageLibrary, useCounts);
      if (fallback) image = { assetId: fallback.assetId, alt: altTextFor(title, info.topic), source: `approved image library: ${fallback.source}` };
    }
    if (image?.assetId) image.alt = altTextFor(title, info.topic);
    if (image?.assetId) useCounts.set(image.assetId, (useCounts.get(image.assetId) || 0) + 1);

    const body = enrichBody(sourceDoc?.body || [], slug, title, info);
    const textAfter = bodyText(body);
    const seo = seoFor(slug, title, sourceDoc, batchRow);
    const gates = {
      sourceDocument: sourceDoc ? "yes" : "no",
      body: textAfter.length >= MIN_BODY_CHARS ? "yes" : "no",
      seoTitle: seo.title ? "yes" : "no",
      metaDescription: seo.description ? "yes" : "no",
      canonical: "yes",
      publishedAt: sourceDoc?.publishedAt ? "yes" : "yes - generated at approval",
      author: AUTHOR_NAME,
      image: image?.assetId ? "yes" : "no",
      altText: image?.alt ? "yes" : "no",
      category: info.title,
      cta: hasConsultationSignal(textAfter) ? "yes" : "no",
      internalLinks: hasHref(body) ? "yes" : "no",
      risks: risks.join("; ") || "not detected",
      currentLawStatus: legalRow.classification || "manual legal review notes carried from Sprint 11N"
    };
    const legalStatusText = String(gates.currentLawStatus || "");
    const legalCurrentLawCleared =
      /low-risk/i.test(legalStatusText) &&
      !/medium|high|needs Principal|lawyer review|manual verification|keep hidden|blocked/i.test(legalStatusText);
    const inPreferredApprovalSet = preferredBlogApprovalSet.has(slug);
    const pass =
      inPreferredApprovalSet &&
      legalCurrentLawCleared &&
      !alreadyApproved &&
      sourceDoc &&
      gates.body === "yes" &&
      gates.image === "yes" &&
      gates.altText === "yes" &&
      gates.seoTitle === "yes" &&
      gates.metaDescription === "yes" &&
      gates.cta === "yes" &&
      gates.internalLinks === "yes" &&
      risks.length === 0;

    const decision = pass ? "approve for controlled Sprint 11O publication" : "keep hidden";
    const notes = pass
      ? "Passed controlled public-education, image, SEO, author, CTA, and redirect-readiness gates."
      : [
          alreadyApproved ? "already approved before Sprint 11O" : "",
          !inPreferredApprovalSet ? "not in Sprint 11O preferred tiny approval subset" : "",
          !legalCurrentLawCleared ? "legal/current-law gate not cleared" : "",
          !sourceDoc ? "source Sanity document missing" : "",
          gates.body !== "yes" ? "body too short or missing" : "",
          gates.image !== "yes" ? "featured image missing" : "",
          gates.altText !== "yes" ? "alt text missing" : "",
          gates.cta !== "yes" ? "consultation CTA missing" : "",
          gates.internalLinks !== "yes" ? "internal links missing" : "",
          risks.length ? risks.join("; ") : ""
        ]
          .filter(Boolean)
          .join("; ");

    blogRows.push({
      "old URL": batchRow["old URL"] || absoluteUrl(`/${slug}`),
      slug,
      title,
      "source Sanity document": sourceDoc?._id || "",
      "body gate": gates.body,
      "SEO title gate": gates.seoTitle,
      "meta description gate": gates.metaDescription,
      "canonical": absoluteUrl(`/resources/blog/${slug}`),
      "publishedAt gate": gates.publishedAt,
      "author": AUTHOR_NAME,
      "practice/category": info.title,
      "image gate": gates.image,
      "image asset": image?.assetId || "",
      "alt text": image?.alt || "",
      "internal links gate": gates.internalLinks,
      "CTA gate": gates.cta,
      "legal/current-law status": gates.currentLawStatus,
      "risk flags": gates.risks,
      "approval decision": decision,
      notes
    });

    seoRows.push({
      slug,
      title,
      "answer block": "present or injected in controlled public document",
      "FAQ": "not added unless already present; avoid fabricated legal questions",
      "practice link": info.href,
      "consultation CTA": gates.cta,
      "author governance": AUTHOR_NAME,
      "canonical": absoluteUrl(`/resources/blog/${slug}`),
      "metadata": seo.title && seo.description ? "present" : "incomplete",
      "image alt": image?.alt || "missing",
      "redirect readiness": pass ? "old URL can redirect after target is live and sitemap-included" : "blocked while hidden"
    });

    if (pass) {
      const postDoc = buildPostDoc({ slug, title, sourceDoc, info, image, seo, body });
      if (shouldApply) {
        await ensureCategory(info);
        await client.createOrReplace(postDoc);
      }
      approved.push({ slug, title, oldUrl: batchRow["old URL"] || absoluteUrl(`/${slug}`), targetPath: `/resources/blog/${slug}`, targetUrl: absoluteUrl(`/resources/blog/${slug}`) });
    } else {
      keptHidden.push({ slug, title, reason: notes || "did not pass all Sprint 11O gates" });
    }
  }

  const approvedCountAfter = shouldApply
    ? await client.fetch(`count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])`)
    : null;

  writeCsv(
    paths.staticPriorityReview,
    [
      "priority",
      "old URL",
      "old title",
      "GSC evidence",
      "current redirect status",
      "existing target",
      "recommended target",
      "target URL",
      "page type",
      "legal status",
      "image status",
      "priority score",
      "recommended action"
    ],
    topStaticReview.map((row, index) => ({
      priority: index + 1,
      "old URL": row.oldUrl,
      "old title": row.title,
      "GSC evidence": row.evidence,
      "current redirect status": row.configured,
      "existing target": row.existingTarget,
      "recommended target": row.target,
      "target URL": row.targetUrl,
      "page type": row.pageType,
      "legal status": row.legalStatus,
      "image status": row.imageStatus,
      "priority score": row.score,
      "recommended action": row.configured === "already configured" ? "monitor existing redirect" : "redirect one-hop to existing live authority page"
    }))
  );

  writeCsv(
    paths.staticServiceBatch,
    [
      "priority",
      "old URL",
      "proposed final URL",
      "page type",
      "H1",
      "SEO title",
      "meta description",
      "canonical",
      "required sections",
      "CTA",
      "internal links",
      "image recommendation",
      "legal review status",
      "publish readiness",
      "redirect plan"
    ],
    staticBriefs.map((row, index) => ({
      priority: index + 1,
      "old URL": row.oldUrl,
      "proposed final URL": row.targetUrl,
      "page type": row.pageType,
      H1: row.title,
      "SEO title": `${row.title} | Chaman Law Firm`,
      "meta description": `Chaman Law Firm guidance on ${row.title}. Speak with our legal team for advice tailored to your matter.`,
      canonical: row.targetUrl,
      "required sections": "answer block; service overview; legal context; risks; FAQs where lawyer-approved; consultation CTA",
      CTA: "Book a consultation",
      "internal links": "relevant practice area; consultation; contact; related resources",
      "image recommendation": "approved Chaman Law Firm legal/service image with accurate alt text",
      "legal review status": row.legalStatus,
      "publish readiness": row.configured === "already configured" ? "existing live target/redirect configured" : "redirect-only rescue pending config and live QA",
      "redirect plan": row.configured === "already configured" ? `already configured to ${row.existingTarget}` : `pending exact 308 to ${row.target}`
    }))
  );

  writeCsv(
    paths.staticRedirectBatch,
    ["priority", "source", "destination", "old URL", "new URL", "redirect type", "status", "activation condition"],
    unconfiguredStatic.map((row, index) => ({
      priority: index + 1,
      source: row.source,
      destination: row.target,
      "old URL": row.oldUrl,
      "new URL": row.targetUrl,
      "redirect type": "one-hop 308",
      status: shouldApply ? "ready for next.config activation" : "dry-run only",
      "activation condition": "target must return 200; no hidden draft; no homepage dump; no Chaman Properties target"
    }))
  );

  writeCsv(
    paths.blogContinuation,
    [
      "old URL",
      "slug",
      "title",
      "source Sanity document",
      "body gate",
      "SEO title gate",
      "meta description gate",
      "canonical",
      "publishedAt gate",
      "author",
      "practice/category",
      "image gate",
      "image asset",
      "alt text",
      "internal links gate",
      "CTA gate",
      "legal/current-law status",
      "risk flags",
      "approval decision",
      "notes"
    ],
    blogRows
  );

  writeCsv(
    paths.seoAeoGeo,
    ["slug", "title", "answer block", "FAQ", "practice link", "consultation CTA", "author governance", "canonical", "metadata", "image alt", "redirect readiness"],
    seoRows
  );

  const freshEvidenceMd = [
    "# Sprint 11O Fresh Search Evidence Status",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "No new post-launch GSC/Bing export was imported automatically in this sprint. Existing local GSC/Bing and legacy recovery inventories remain the active evidence base unless the Principal supplies a fresh export.",
    "",
    "Search-related local files reviewed:",
    ...evidenceFiles.map((file) => `- ${file.file} (${file.mtime})`),
    ""
  ].join("\n");
  fs.writeFileSync(paths.freshEvidenceStatus, freshEvidenceMd, "utf8");

  const indexingPack = [
    "# Sprint 11O GSC/Bing Indexing Pack",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Submit or inspect only live approved URLs and exact old URLs whose redirects have passed live QA. Do not submit hidden drafts, draft URLs, preview URLs, or Vercel URLs.",
    "",
    "## Newly Approved Blog Targets",
    ...approved.map((item) => `- ${item.targetUrl}`),
    "",
    "## Old Blog URLs For Inspection After Redirect Activation",
    ...approved.map((item) => `- ${item.oldUrl}`),
    "",
    "## Static Authority Redirect Candidates",
    ...unconfiguredStatic.map((item) => `- ${item.oldUrl} -> ${item.targetUrl}`),
    "",
    "## Manual Checks",
    "- Confirm target returns 200.",
    "- Confirm sitemap contains approved article targets.",
    "- Confirm static/practice destinations are live authority pages.",
    "- Confirm old URL redirects one-hop only after deployment.",
    "- Do not inspect or submit hidden drafts.",
    ""
  ].join("\n");
  fs.writeFileSync(paths.indexingPack, indexingPack, "utf8");

  const result = {
    generatedAt: new Date().toISOString(),
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    staticCandidatesReviewed: topStaticReview.length,
    staticRedirectCandidates: unconfiguredStatic.length,
    staticBriefs: staticBriefs.length,
    blogCandidatesReviewed: blogRows.length,
    approvedCount: approved.length,
    approvedThisRun: approved,
    keptHiddenCount: keptHidden.length,
    keptHidden,
    approvedPublicPostsAfter: approvedCountAfter,
    staticRedirectsPendingConfig: unconfiguredStatic.map((row) => ({ source: row.source, destination: row.target })),
    filesWritten: [
      paths.freshEvidenceStatus,
      paths.staticPriorityReview,
      paths.staticServiceBatch,
      paths.staticRedirectBatch,
      paths.blogContinuation,
      paths.seoAeoGeo,
      paths.indexingPack,
      paths.report,
      paths.resultJson
    ]
  };

  const report = [
    "# Sprint 11O Static Authority and Blog Recovery Report",
    "",
    `Generated: ${result.generatedAt}`,
    "",
    "## Scope",
    "",
    "Sprint 11O continued the full legacy SEO authority recovery model across static/service/practice URLs and selected hidden blog candidates. No DNS, Hostinger, Chaman Properties, secrets, backups, SQL dumps, wp-config.php, or wp-content folders were touched.",
    "",
    "## Static Authority Recovery",
    "",
    `- Static/service candidates reviewed: ${result.staticCandidatesReviewed}`,
    `- Static/service restoration briefs prepared: ${result.staticBriefs}`,
    `- Exact static redirect candidates prepared for activation: ${result.staticRedirectCandidates}`,
    "- Static candidates route only to existing live Chaman Law Firm pages; no homepage dumping and no hidden draft targets.",
    "",
    "## Blog Recovery",
    "",
    `- Sprint 11N hidden candidates reviewed for controlled continuation: ${result.blogCandidatesReviewed}`,
    `- Blog articles approved in Sanity by this helper: ${result.approvedCount}`,
    `- Blog articles kept hidden: ${result.keptHiddenCount}`,
    "- Public author is fixed to Charles Chukwuma Nkwoka, Esq.",
    "",
    "## Approved Blog Articles",
    "",
    ...(approved.length ? approved.map((item) => `- ${item.title}: ${item.targetUrl}`) : ["- None."]),
    "",
    "## Kept Hidden",
    "",
    ...(keptHidden.length ? keptHidden.map((item) => `- ${item.slug}: ${item.reason}`) : ["- None."]),
    "",
    "## Redirect Rule",
    "",
    "Redirects remain pending until target URLs return 200, sitemap inclusion is confirmed where appropriate, and live QA confirms no chain, loop, homepage dump, hidden draft target, 404 target, or Chaman Properties target.",
    ""
  ].join("\n");
  fs.writeFileSync(paths.report, report, "utf8");
  fs.writeFileSync(paths.resultJson, JSON.stringify(result, null, 2), "utf8");

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
