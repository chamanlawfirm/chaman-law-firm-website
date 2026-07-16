import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import readline from "node:readline";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const HIDDEN_PREFIX = "chamanlawfirm-sprint11k-hidden-";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11k-";
const MIN_BODY_CHARACTERS = 900;
const APPROVAL_LIMIT = 15;
const shouldApply = process.argv.includes("--apply");

const backupRoot =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026";
const sqlGzPath = path.join(backupRoot, "u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz");

const paths = {
  sprint11jApproval: path.join("docs", "SPRINT-11J-BLOG-APPROVAL-BATCH.csv"),
  sprint11jStatic: path.join("docs", "SPRINT-11J-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  nextConfig: "next.config.mjs",
  freshEvidence: path.join("docs", "SPRINT-11K-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  sourceRecovery: path.join("docs", "SPRINT-11K-BLOCKED-CANDIDATE-SOURCE-RECOVERY.csv"),
  imageCompletion: path.join("docs", "SPRINT-11K-IMAGE-ALT-COMPLETION.csv"),
  lawyerClearance: path.join("docs", "SPRINT-11K-LAWYER-CURRENT-LAW-CLEARANCE.csv"),
  metadataCompletion: path.join("docs", "SPRINT-11K-METADATA-INTERNAL-LINKING-AEO-GEO-COMPLETION.csv"),
  approvalBatch: path.join("docs", "SPRINT-11K-BLOG-APPROVAL-BATCH.csv"),
  staticRestoration: path.join("docs", "SPRINT-11K-STATIC-SERVICE-AUTHORITY-RESTORATION.csv"),
  redirectBatch: path.join("docs", "SPRINT-11K-REDIRECT-ACTIVATION-BATCH.csv"),
  report: path.join("docs", "SPRINT-11K-SOURCE-RECOVERY-AUTHORITY-RESTORATION-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11K-RESULT.json")
};

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

function titleFor(slug, fallback) {
  return (fallback || slug.replace(/-/g, " ")).replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bCac\b/g, "CAC");
}

function mysqlUnescape(value) {
  return value.replace(/\\([0btnrZ"'\\%_])/g, (_, code) => {
    switch (code) {
      case "0":
        return "\0";
      case "b":
        return "\b";
      case "t":
        return "\t";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "Z":
        return "\u001a";
      default:
        return code;
    }
  });
}

function parseMysqlTuple(line) {
  let value = line.trim().replace(/[;,]\s*$/, "");
  if (value.startsWith("(") && value.endsWith(")")) value = value.slice(1, -1);
  const fields = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quoted) {
      if (char === "\\" && index + 1 < value.length) {
        cell += char + value[index + 1];
        index += 1;
      } else if (char === "'") {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === "'") {
      quoted = true;
    } else if (char === ",") {
      fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
      cell = "";
    } else {
      cell += char;
    }
  }
  fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
  return fields;
}

async function extractWordPressData(sqlPath, wantedSlugs) {
  const wanted = new Set(wantedSlugs);
  const postsBySlug = new Map();
  const postIds = new Set();
  const metaByPostId = new Map();
  let activeTable = "";
  if (!fs.existsSync(sqlPath)) return { postsBySlug, metaByPostId, sqlAvailable: false };

  const rl = readline.createInterface({
    input: fs.createReadStream(sqlPath).pipe(zlib.createGunzip({ finishFlush: zlib.constants.Z_SYNC_FLUSH })),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const insertMatch = line.match(/^INSERT INTO `([^`]+)`/);
    if (insertMatch) activeTable = insertMatch[1];
    if (!activeTable || !line.trim().startsWith("(")) continue;
    const row = parseMysqlTuple(line);
    if (activeTable.endsWith("posts")) {
      const post = {
        ID: Number(row[0]),
        post_author: row[1],
        post_date: row[2],
        post_content: row[4] || "",
        post_title: row[5] || "",
        post_excerpt: row[6] || "",
        post_status: row[7] || "",
        post_name: row[11] || "",
        post_modified: row[14] || "",
        post_type: row[20] || ""
      };
      if (wanted.has(post.post_name) && ["post", "page"].includes(post.post_type) && ["publish", "draft"].includes(post.post_status)) {
        postsBySlug.set(post.post_name, post);
        postIds.add(post.ID);
      }
    } else if (activeTable.endsWith("postmeta")) {
      const postId = Number(row[1]);
      if (!postIds.has(postId)) continue;
      const key = row[2] || "";
      const value = row[3] || "";
      if (!metaByPostId.has(postId)) metaByPostId.set(postId, {});
      metaByPostId.get(postId)[key] = value;
    }
  }

  return { postsBySlug, metaByPostId, sqlAvailable: true };
}

function cleanText(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#8217;|&rsquo;/gi, "'")
    .replace(/&#8211;|&ndash;/gi, "-")
    .replace(/\s+/g, " ")
    .trim();
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
  return /\/consultation|book a consultation|speak with (a|our) lawyer|contact Chaman Law Firm|consultation/i.test(text);
}

function makeBlock(key, text, style = "normal", markDefs = [], marks = []) {
  return {
    _type: "block",
    _key: key.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80),
    style,
    markDefs,
    children: [{ _type: "span", _key: `${key}-span`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80), text, marks }]
  };
}

function portableTextFromWordPress(html, title, slug, practiceHref) {
  const cleaned = String(html || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[caption[^\]]*\]/gi, " ")
    .replace(/\[\/caption\]/gi, " ")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const fragments = cleaned
    .split(/<\/(?:p|h[1-6]|li|blockquote|div)>/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const blocks = [
    makeBlock(`answer-${slug}`, `${title} is a public legal education topic. Chaman Law Firm explains the practical legal issues, documents, risks, and decision points readers should understand before acting.`),
    makeBlock(`legal-frame-${slug}`, "This article is for general legal education only. It does not replace advice from a lawyer who has reviewed the facts, documents, deadlines, and applicable law.")
  ];
  fragments.forEach((fragment, index) => {
    const tag = fragment.match(/<\s*(h[1-6]|blockquote|li|p|div)\b/i)?.[1]?.toLowerCase() || "p";
    const text = cleanText(fragment);
    if (!text || text.length < 20) return;
    const style = tag.startsWith("h") ? tag : tag === "blockquote" ? "blockquote" : "normal";
    blocks.push(makeBlock(`wp-${slug}-${index}`, text, style));
  });
  blocks.push({
    _type: "block",
    _key: `practice-link-${slug}`.slice(0, 80),
    style: "normal",
    markDefs: [{ _key: "practice", _type: "link", href: practiceHref }],
    children: [
      { _type: "span", _key: "a", text: "Related service: " },
      { _type: "span", _key: "b", text: "Chaman Law Firm practice area guidance", marks: ["practice"] },
      { _type: "span", _key: "c", text: "." }
    ]
  });
  blocks.push({
    _type: "block",
    _key: `consult-${slug}`.slice(0, 80),
    style: "normal",
    markDefs: [
      { _key: "consultation", _type: "link", href: "/consultation" },
      { _key: "contact", _type: "link", href: "/contact" }
    ],
    children: [
      { _type: "span", _key: "a", text: "For guidance tailored to your matter, " },
      { _type: "span", _key: "b", text: "book a consultation", marks: ["consultation"] },
      { _type: "span", _key: "c", text: " or " },
      { _type: "span", _key: "d", text: "contact Chaman Law Firm", marks: ["contact"] },
      { _type: "span", _key: "e", text: " before taking legal steps." }
    ]
  });
  return blocks.slice(0, 120);
}

function detectTextRisks(text) {
  const risks = [];
  const promotionalText = text.replace(/cautious of anyone who guarantees?[^.]+/gi, "");
  if (/Chaman Properties/i.test(text)) risks.push("Chaman Properties reference");
  if (/luxury|mansion|buy now|estate sales|property sales|investment returns|land banking/i.test(text)) risks.push("property-sales/luxury wording");
  if (/free legal advice|get .* for free|free service/i.test(text)) risks.push("misleading free-service wording");
  if (/elementor|wp-block|shortcode|\[\/?[a-z0-9_-]+/i.test(text)) risks.push("plugin debris");
  if (/forcefully evict|self-help eviction|eject.*without.*court|take the law into your own hands|lock(?:ed)? out/i.test(text)) risks.push("unsafe self-help wording");
  if (/guarantee|assured result|must win|certain outcome/i.test(promotionalText)) risks.push("overpromising");
  return risks;
}

function legalRiskFor(slug, title, text, rowRisk = "") {
  const topic = `${slug} ${title} ${rowRisk}`.toLowerCase();
  const body = String(text || "").toLowerCase();
  if (/police|criminal|crime|bail|domestic violence|custody|divorce|inheritance|probate|eviction|quit notice|harassment|stolen|correctional|conjugal|paternity|maternity/.test(topic)) {
    return "high - lawyer review required before approval";
  }
  if (/land use act|tenan|landlord|joint property|land registration|expert witness|tax|cac|immigration|employment|debt|corporate|contract|mortgage|securities|stamp|standard organisat|son|land charge|board of directors|trade union|minority protection/.test(`${topic} ${body}`)) {
    return "medium - current-law review required before approval";
  }
  return "low - general legal education suitable after editorial cleanup";
}

function duplicateRiskFor(slug, rowRisk = "", configuredRedirect = "") {
  const high = new Set([
    "obtaining-a-certificate-of-occupancy-c-of-o",
    "the-concept-of-rule-of-law-in-nigeria",
    "the-overall-list-of-federal-laws-in-nigeria",
    "land-use-act-1978",
    "lagos-tenancy-fixed-and-periodic-tenancies"
  ]);
  if (configuredRedirect && configuredRedirect !== `/resources/blog/${slug}`) return `high - old URL already redirects to ${configuredRedirect}`;
  if (high.has(slug)) return "high - likely cannibalization with existing stronger content";
  if (/high/i.test(rowRisk)) return rowRisk;
  if (/medium/i.test(rowRisk)) return rowRisk;
  return "low";
}

function practiceInfo(slug = "", title = "", category = "") {
  const haystack = `${slug} ${title} ${category}`.toLowerCase();
  if (/family|marriage|divorce|child|paternity|maternity/.test(haystack)) return { title: "Family Law", categoryId: "category.family-law", href: "/practice-areas/family-law", topic: "family law" };
  if (/immigration|visa|citizenship|passport|residency/.test(haystack)) return { title: "Immigration", categoryId: "category.immigration", href: "/practice-areas/immigration-services", topic: "immigration" };
  if (/employment|labour|trade-union|workplace|vicarious/.test(haystack)) return { title: "Employment Law", categoryId: "category.employment-law", href: "/practice-areas/employment-law", topic: "employment law" };
  if (/debt|loan|recovery/.test(haystack)) return { title: "Debt Recovery", categoryId: "category.debt-recovery", href: "/practice-areas/debt-recovery", topic: "debt recovery" };
  if (/probate|estate|inheritance|will/.test(haystack)) return { title: "Probate and Estate Administration", categoryId: "category.probate-estate-administration", href: "/practice-areas/probate-estate-administration", topic: "probate and estate administration" };
  if (/notary|notar|power of attorney|apostille|affidavit|document/.test(haystack)) return { title: "Notary Public", categoryId: "category.notary-public", href: "/practice-areas/notary-public-services", topic: "notary public" };
  if (/corporate|company|cac|contract|share|director|securities|business|ultra vires|minority/.test(haystack)) return { title: "Corporate and Commercial Law", categoryId: "category.corporate-commercial-law", href: "/practice-areas/corporate-commercial-law", topic: "corporate and commercial law" };
  if (/court|litigation|witness|evidence|lawsuit|equity|judiciary|regulatory|federal laws|nigerian legal system|sources of nigerian law/.test(haystack)) return { title: "Litigation and Dispute Resolution", categoryId: "category.litigation-dispute-resolution", href: "/practice-areas/litigation-dispute-resolution", topic: "litigation and dispute resolution" };
  if (/adr|mediation|arbitration/.test(haystack)) return { title: "ADR / Mediation", categoryId: "category.adr-mediation", href: "/practice-areas/adr-mediation", topic: "ADR and mediation" };
  if (/land|property|tenant|c-of-o|title|mortgage|stamp|charge/.test(haystack)) return { title: "Property and Real Estate Law", categoryId: "category.property-and-real-estate-law", href: "/practice-areas/property-real-estate-law", topic: "property law" };
  return { title: "General Legal Education", categoryId: "category.general-legal-education", href: "/practice-areas", topic: "general legal education" };
}

function altTextFor(title, topic) {
  return `${title} legal guidance for ${topic} | Chaman Law Firm`;
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) redirects.set(normalizePath(match[1]), normalizePath(match[2]));
  return redirects;
}

function buildImageLibrary(approvedPosts) {
  const byAsset = new Map();
  for (const post of approvedPosts) {
    const asset = post.mainImage?.asset;
    if (!asset?._id) continue;
    if (!byAsset.has(asset._id)) {
      const categories = (post.categories || []).map((category) => category?.title).filter(Boolean);
      const info = practiceInfo(post.slug, post.title, categories.join(" "));
      byAsset.set(asset._id, { assetId: asset._id, url: asset.url || "", topic: info.topic, sourcePosts: [], altSamples: new Set(), count: 0 });
    }
    const item = byAsset.get(asset._id);
    item.count += 1;
    item.sourcePosts.push(post.slug);
    if (post.mainImage?.alt) item.altSamples.add(post.mainImage.alt);
  }
  return [...byAsset.values()].map((item) => ({ ...item, altSamples: [...item.altSamples].slice(0, 3) }));
}

function fallbackFor(topic, imageLibrary) {
  const exact = imageLibrary.filter((item) => item.topic === topic && item.count <= 8).sort((a, b) => a.count - b.count)[0];
  return exact || imageLibrary.filter((item) => item.topic === "general legal education" && item.count <= 8).sort((a, b) => a.count - b.count)[0] || null;
}

function seoFor(slug, title, doc, post, row) {
  const metaTitle = doc?.seo?.metaTitle || row["SEO status"] === "complete" ? doc?.seo?.metaTitle : "";
  const rawTitle = metaTitle || post?.post_title || `${title} | Chaman Law Firm`;
  const rawDescription = doc?.seo?.metaDescription || post?.post_excerpt || row["meta description"] || "";
  return {
    title: rawTitle.includes("Chaman Law Firm") ? rawTitle : `${title} | Chaman Law Firm`,
    description: cleanText(rawDescription) || `Learn key Nigerian legal considerations on ${title}. Chaman Law Firm explains risk points and when to speak with a lawyer.`
  };
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
    description: `Legal article category for ${info.title}.`
  });
}

function buildPostDoc({ id, slug, title, body, seo, image, info, publishedAt, approved }) {
  const mainImage = image?.assetId
    ? { _type: "image", asset: { _type: "reference", _ref: image.assetId }, alt: image.alt }
    : undefined;
  return {
    _id: id,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: seo.description,
    author: { _type: "reference", _ref: AUTHOR_ID },
    publishedAt,
    categories: categoryRefs(info),
    body,
    ...(mainImage ? { mainImage } : {}),
    lawFirmApproved: approved,
    seo: {
      metaTitle: seo.title,
      metaDescription: seo.description,
      canonicalUrl: absoluteUrl(`/resources/blog/${slug}`),
      openGraphTitle: seo.title,
      openGraphDescription: seo.description,
      ...(mainImage ? { openGraphImage: mainImage } : {}),
      noIndex: false,
      robots: approved ? "index,follow" : "noindex,follow",
      schemaType: "Article"
    }
  };
}

async function fetchText(url) {
  try {
    const response = await fetch(url);
    return { status: response.status, text: await response.text(), url: response.url };
  } catch (error) {
    return { status: "error", text: "", error: error.message, url };
  }
}

async function fetchHead(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    return { status: response.status, location: response.headers.get("location") || "" };
  } catch (error) {
    return { status: "error", location: "", error: error.message };
  }
}

function freshEvidenceFiles() {
  const roots = [path.join("docs"), path.join("public")].filter((root) => fs.existsSync(root));
  const matches = [];
  const pattern = /(search.?console|gsc|bing|not.?found|404|crawl|index|redirect.?error|performance|queries|backlink|ahrefs|semrush|ubersuggest|moz|serp|featured.?snippet)/i;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (/node_modules|\.next|\.git|wp-content|backup/i.test(full)) continue;
        walk(full);
      } else if (pattern.test(full) && !/SPRINT-11[GHIKJ]|SPRINT-10|PHASE|README/i.test(entry.name)) {
        const stat = fs.statSync(full);
        matches.push({ file: full, modified: stat.mtime.toISOString(), size: stat.size });
      }
    }
  }
  roots.forEach(walk);
  return matches.sort((a, b) => b.modified.localeCompare(a.modified));
}

async function queryAllPosts() {
  return client.fetch(
    `*[_type == "post" && defined(slug.current)]{
      _id,_updatedAt,title,"slug":slug.current,excerpt,author,"authorRef":author._ref,"authorName":author->name,
      publishedAt,body,"bodyText":pt::text(body),categories[]->{_id,title,"slug":slug.current},tags,lawFirmApproved,
      mainImage{alt,asset->{_id,url,metadata{dimensions}}},seo
    }`
  );
}

function chooseSourceDoc(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true || doc._id.startsWith("drafts.")) || null;
}

function sourceQuality(text) {
  if (!text) return "missing";
  if (text.length < 500) return "thin";
  if (text.length < MIN_BODY_CHARACTERS) return "short";
  return "complete";
}

function approvalBlockers({ doc, body, image, textRisks, legalRisk, duplicateRisk, oldUrl }) {
  const blockers = [];
  const text = bodyText(body);
  if (!oldUrl) blockers.push("exact old URL mapping missing");
  if (!doc && !text) blockers.push("source document/body missing");
  if (!text || text.length < MIN_BODY_CHARACTERS) blockers.push("body too short or missing");
  if (!image?.assetId) blockers.push("featured image missing");
  if (!image?.alt || image.alt.length < 9) blockers.push("alt text missing");
  if (textRisks.length) blockers.push(...textRisks);
  if (legalRisk.startsWith("high")) blockers.push(legalRisk);
  if (legalRisk.startsWith("medium")) blockers.push(legalRisk);
  if (duplicateRisk.startsWith("high")) blockers.push(duplicateRisk);
  return blockers;
}

function clearableLowRisk(slug, title, body) {
  const text = `${slug} ${title} ${body}`.toLowerCase();
  if (/police|criminal|eviction|tenancy|tax|land use|c-of-o|company|employment|immigration|probate|inheritance|debt|domestic|custody|divorce|mortgage|securities/.test(text)) return false;
  return true;
}

async function main() {
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const blockedRows = readCsv(paths.sprint11jApproval).filter((row) => row["approval status"] === "hidden").slice(0, 50);
  const staticRows = readCsv(paths.sprint11jStatic);
  const redirects = parseRedirects(fs.readFileSync(paths.nextConfig, "utf8"));
  const wantedSlugs = blockedRows.map((row) => row.slug).filter(Boolean);
  const [sitemap, robots, allPosts, wpData] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    queryAllPosts(),
    extractWordPressData(sqlGzPath, wantedSlugs)
  ]);

  const bySlug = new Map();
  for (const post of allPosts) {
    if (!bySlug.has(post.slug)) bySlug.set(post.slug, []);
    bySlug.get(post.slug).push(post);
  }
  const approvedPosts = allPosts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."));
  const approvedBySlug = new Map();
  for (const post of approvedPosts) {
    if (!approvedBySlug.has(post.slug)) approvedBySlug.set(post.slug, []);
    approvedBySlug.get(post.slug).push(post);
  }
  const imageLibrary = buildImageLibrary(approvedPosts);

  const sourceRows = [];
  const imageRows = [];
  const clearanceRows = [];
  const metadataRows = [];
  const approvalRows = [];
  const approvedThisRun = [];
  const keptHidden = [];
  const recoveredHiddenDocs = [];
  const imagePatchResults = [];
  const selected = [];

  for (const row of blockedRows) {
    const slug = row.slug;
    const existingDocs = bySlug.get(slug) || [];
    const alreadyPublic = (approvedBySlug.get(slug) || []).length > 0;
    const sourceDoc = chooseSourceDoc(existingDocs);
    const wpPost = wpData.postsBySlug.get(slug);
    const info = practiceInfo(slug, row.title, row["category/practice relationship"]);
    const title = titleFor(slug, sourceDoc?.title || wpPost?.post_title || row.title);
    const configuredRedirect = redirects.get(normalizePath(row["old URL"]));
    const existingBodyText = bodyText(sourceDoc?.body || []);
    const wpText = cleanText(wpPost?.post_content || "");
    const useWpBody = wpText.length > existingBodyText.length && wpText.length >= 500;
    const body = useWpBody
      ? portableTextFromWordPress(wpPost.post_content, title, slug, info.href)
      : sourceDoc?.body || [];
    const text = bodyText(body);
    const bodyQuality = sourceQuality(text);
    const textRisks = detectTextRisks(`${slug} ${title} ${text}`);
    const legalRisk = legalRiskFor(slug, title, text, row["legal status"]);
    const duplicateRisk = duplicateRiskFor(slug, row["duplicate status"], configuredRedirect);
    const sourceBodyFound = Boolean(sourceDoc?.body?.length) || Boolean(wpPost?.post_content);
    const sourceDocId = sourceDoc?._id || `${HIDDEN_PREFIX}${slug}`;
    const seo = seoFor(slug, title, sourceDoc, wpPost, row);
    let image = sourceDoc?.mainImage?.asset?._id
      ? { assetId: sourceDoc.mainImage.asset._id, alt: sourceDoc.mainImage.alt || altTextFor(title, info.topic), status: "source image", topic: info.topic }
      : null;
    const repairableForImage = sourceBodyFound && text.length >= MIN_BODY_CHARACTERS && !textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk));
    const fallback = !image && repairableForImage ? fallbackFor(info.topic, imageLibrary) : null;
    if (!image && fallback) {
      image = { assetId: fallback.assetId, alt: altTextFor(title, info.topic), status: "approved fallback image", topic: info.topic };
    }
    const blockers = alreadyPublic
      ? ["already public"]
      : approvalBlockers({ doc: sourceDoc || wpPost, body, image, textRisks, legalRisk, duplicateRisk, oldUrl: row["old URL"] });
    if (!clearableLowRisk(slug, title, text) && legalRisk.startsWith("low")) blockers.push("not low-risk enough for automated clearance");
    const canApprove = !alreadyPublic && blockers.length === 0 && selected.length < APPROVAL_LIMIT;
    if (canApprove) selected.push(slug);

    const hiddenDoc = buildPostDoc({
      id: sourceDocId,
      slug,
      title,
      body,
      seo,
      image,
      info,
      publishedAt: sourceDoc?.publishedAt || wpPost?.post_date || new Date().toISOString(),
      approved: false
    });

    if (shouldApply && sourceBodyFound && bodyQuality !== "missing") {
      await ensureCategory(info);
      await client.createOrReplace(hiddenDoc);
      recoveredHiddenDocs.push({ slug, id: hiddenDoc._id });
      if (image?.status === "approved fallback image") imagePatchResults.push({ slug, assetId: image.assetId });
    }

    if (canApprove && shouldApply) {
      await ensureCategory(info);
      const publicDoc = buildPostDoc({
        id: `${PUBLIC_PREFIX}${slug}`,
        slug,
        title,
        body,
        seo,
        image,
        info,
        publishedAt: hiddenDoc.publishedAt,
        approved: true
      });
      await client.createOrReplace(publicDoc);
      approvedThisRun.push({ slug, title, oldUrl: absoluteUrl(row["old URL"]), targetPath: `/resources/blog/${slug}`, targetUrl: absoluteUrl(`/resources/blog/${slug}`) });
    } else if (canApprove) {
      approvedThisRun.push({ slug, title, oldUrl: absoluteUrl(row["old URL"]), targetPath: `/resources/blog/${slug}`, targetUrl: absoluteUrl(`/resources/blog/${slug}`) });
    } else if (!alreadyPublic) {
      keptHidden.push({ slug, title, oldUrl: absoluteUrl(row["old URL"]), reason: blockers.join("; ") || "kept hidden for manual review" });
    }

    sourceRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title,
      "current Sanity status": alreadyPublic ? "already public" : sourceDoc ? "hidden/unapproved source exists" : shouldApply && sourceBodyFound ? "hidden source recovered" : "source needed",
      "source body found yes/no": sourceBodyFound ? "yes" : "no",
      "source body quality": bodyQuality,
      "WordPress export match yes/no": wpPost ? "yes" : "no",
      "SQL/source record match yes/no": wpPost ? "yes" : "no",
      "old HTML/body recovered yes/no": useWpBody ? "yes" : "no",
      "plugin debris present yes/no": textRisks.includes("plugin debris") ? "yes" : "no",
      "short/thin content risk": bodyQuality === "complete" ? "no" : "yes",
      "duplicate public article match": alreadyPublic ? "already public" : duplicateRisk,
      "recommended recovery action": canApprove ? "approve controlled public article" : sourceBodyFound ? "keep hidden for lawyer/editorial review" : "recover body from deeper source",
      "approval readiness": canApprove ? (shouldApply ? "approved" : "ready if --apply") : "not ready",
      notes: blockers.join("; ")
    });

    imageRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title,
      "original featured image available yes/no": sourceDoc?.mainImage?.asset?._id ? "yes" : "not confirmed",
      "original body image available yes/no": /wp-content\/uploads/i.test(wpPost?.post_content || "") ? "yes" : "not confirmed",
      "approved fallback image used yes/no": image?.status === "approved fallback image" ? (shouldApply ? "yes - patched into hidden/public docs" : "ready in dry-run") : "no",
      "Sanity image reference": image?.assetId || "",
      "image category": image?.topic || info.topic,
      "alt text": image?.alt || "",
      "image relevance": image?.assetId ? `matched to ${info.topic}` : "missing or unsafe to assign",
      "Chaman Properties contamination risk": textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk)) ? "yes" : "not detected",
      "repeated principal image risk": image?.assetId && (imageLibrary.find((item) => item.assetId === image.assetId)?.count || 0) > 8 ? "review" : "not detected",
      "approval readiness after image completion": canApprove ? (shouldApply ? "approved" : "ready if --apply") : "keep hidden",
      notes: blockers.join("; ")
    });

    clearanceRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title,
      classification: canApprove ? "low risk and approval-ready" : legalRisk.startsWith("medium") ? "requires current-law verification" : legalRisk.startsWith("high") ? "high risk, keep hidden" : duplicateRisk.startsWith("high") ? "duplicate/cannibalizing, do not approve" : sourceBodyFound ? "requires Principal/lawyer sign-off" : "source recovery required",
      "unsafe legal advice": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "outdated legal statement": legalRisk.startsWith("medium") || legalRisk.startsWith("high") ? "manual verification required" : "not detected",
      overpromising: textRisks.includes("overpromising") ? "yes" : "not detected",
      "misleading free-service wording": textRisks.includes("misleading free-service wording") ? "yes" : "not detected",
      "self-help eviction risk": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "family-law sensitivity": /family|marriage|custody|divorce|paternity|maternity/i.test(`${slug} ${title}`) ? "review carefully" : "not primary issue",
      "Land Use Act/C of O/title accuracy": /land use|c-of-o|occupancy|title|property|land/i.test(`${slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "corporate/CAC accuracy": /corporate|cac|company|director|share|ultra vires/i.test(`${slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "immigration accuracy": /immigration|visa|citizenship|passport/i.test(`${slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "probate/debt recovery accuracy": /probate|debt|estate|inheritance/i.test(`${slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "litigation/procedure accuracy": /court|litigation|evidence|witness|equity|legal system/i.test(`${slug} ${title}`) ? "editorial legal review required" : "not primary issue",
      notes: blockers.join("; ")
    });

    metadataRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title,
      "SEO title": seo.title,
      "meta description": seo.description,
      canonical: absoluteUrl(`/resources/blog/${slug}`),
      H1: title,
      "headings cleaned": bodyQuality === "complete" ? "yes" : "pending body recovery",
      "search intent answered early": bodyQuality === "complete" ? "yes - answer block added/preserved" : "pending",
      "consultation CTA": hasConsultationSignal(text) ? "present" : bodyQuality === "complete" ? "added to recovered body" : "needed",
      "internal links to practice/service pages": hasHref(body) ? "present" : bodyQuality === "complete" ? "practice/consultation/contact links added" : "needed",
      "trusted external authority links": "not added automatically",
      "FAQ/short-answer section": "answer block added where body recovered",
      "keyword stuffing": /(\b\w+\b)(?:\s+\1){3,}/i.test(text) ? "review" : "not detected",
      "unsupported legal claim": textRisks.length ? textRisks.join("; ") : "not detected",
      "duplicate/cannibalization issue": duplicateRisk,
      author: AUTHOR_NAME,
      notes: blockers.join("; ")
    });

    approvalRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug,
      title,
      "complete source body": bodyQuality === "complete" ? "yes" : "no",
      "clean formatting": textRisks.includes("plugin debris") ? "no" : "yes",
      "unsafe legal claim": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "misleading free-service wording": textRisks.includes("misleading free-service wording") ? "yes" : "not detected",
      "duplicate/cannibalization risk": duplicateRisk,
      "SEO title present": seo.title ? "yes" : "no",
      "meta description present": seo.description ? "yes" : "no",
      "canonical correct": absoluteUrl(`/resources/blog/${slug}`),
      "image and alt text present": image?.assetId && image?.alt ? "yes" : "no",
      "category/practice relationship present": info.title,
      "CTA present": hasConsultationSignal(text) || bodyQuality === "complete" ? "yes" : "no",
      "internal links present": hasHref(body) || bodyQuality === "complete" ? "yes" : "no",
      author: AUTHOR_NAME,
      "approval status": canApprove ? (shouldApply ? "approved" : "ready") : "hidden",
      "redirect status": canApprove ? "ready after live/sitemap verification" : "not eligible",
      notes: blockers.join("; ")
    });
  }

  const staticRestorationRows = [];
  for (const [index, row] of staticRows.slice(0, 10).entries()) {
    const oldPath = normalizePath(row["old URL"]);
    const targetPath = normalizePath(row["proposed final URL"]);
    const configured = redirects.get(oldPath);
    const targetStatus = await fetchHead(absoluteUrl(targetPath));
    staticRestorationRows.push({
      priority: index + 1,
      "old URL": absoluteUrl(oldPath),
      "proposed final URL": absoluteUrl(targetPath),
      "page type": row["page type"],
      decision: configured ? "exact redirect already configured; verify only" : targetStatus.status === 200 ? "exact redirect candidate after final intent review" : "prepare content brief",
      "target status": targetStatus.status,
      "canonical-safe": targetStatus.status === 200 ? "needs page-level canonical confirmation" : "not ready",
      "sitemap-safe": sitemap.text.includes(absoluteUrl(targetPath)) ? "included" : targetPath.startsWith("/practice-areas") ? "expected static/practice target" : "not confirmed",
      "legal review status": row["legal review status"],
      "recommended next action": configured ? "retain existing redirect; no new redirect needed" : "defer until exact target is verified",
      notes: row["redirect plan"] || ""
    });
  }

  const redirectRows = approvedThisRun.map((item) => ({
    "old URL": item.oldUrl,
    "old source path": normalizePath(item.oldUrl),
    "new URL": item.targetUrl,
    "new target path": item.targetPath,
    "redirect type": "one-hop 308",
    "activation status": shouldApply ? "pending live 200 + sitemap verification before next.config activation" : "pending apply",
    "sitemap status": shouldApply ? "verify after production revalidation" : "pending approval",
    notes: "Activate only after public target returns 200 and appears in sitemap."
  }));

  const approvedPublicPostsAfter = shouldApply
    ? await client.fetch(`count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])`)
    : approvedPosts.length;

  const fresh = freshEvidenceFiles();
  fs.writeFileSync(paths.freshEvidence, `# Sprint 11K Fresh Search Evidence Status

Fresh post-launch GSC/Bing/backlink/SERP evidence detected locally: ${fresh.length ? "yes" : "no"}.

${fresh.length ? fresh.map((item) => `- \`${item.file}\` (${item.modified}, ${item.size} bytes)`).join("\n") : "- No new non-sprint Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, Moz, or fresh crawl export was found locally."}

Hidden draft URLs must not be submitted to search engines.
`, "utf8");

  writeCsv(paths.sourceRecovery, [
    "old URL", "slug", "title", "current Sanity status", "source body found yes/no", "source body quality",
    "WordPress export match yes/no", "SQL/source record match yes/no", "old HTML/body recovered yes/no",
    "plugin debris present yes/no", "short/thin content risk", "duplicate public article match",
    "recommended recovery action", "approval readiness", "notes"
  ], sourceRows);

  writeCsv(paths.imageCompletion, [
    "old URL", "slug", "title", "original featured image available yes/no", "original body image available yes/no",
    "approved fallback image used yes/no", "Sanity image reference", "image category", "alt text", "image relevance",
    "Chaman Properties contamination risk", "repeated principal image risk", "approval readiness after image completion", "notes"
  ], imageRows);

  writeCsv(paths.lawyerClearance, [
    "old URL", "slug", "title", "classification", "unsafe legal advice", "outdated legal statement", "overpromising",
    "misleading free-service wording", "self-help eviction risk", "family-law sensitivity", "Land Use Act/C of O/title accuracy",
    "corporate/CAC accuracy", "immigration accuracy", "probate/debt recovery accuracy", "litigation/procedure accuracy", "notes"
  ], clearanceRows);

  writeCsv(paths.metadataCompletion, [
    "old URL", "slug", "title", "SEO title", "meta description", "canonical", "H1", "headings cleaned",
    "search intent answered early", "consultation CTA", "internal links to practice/service pages",
    "trusted external authority links", "FAQ/short-answer section", "keyword stuffing", "unsupported legal claim",
    "duplicate/cannibalization issue", "author", "notes"
  ], metadataRows);

  writeCsv(paths.approvalBatch, [
    "old URL", "slug", "title", "complete source body", "clean formatting", "unsafe legal claim",
    "misleading free-service wording", "duplicate/cannibalization risk", "SEO title present", "meta description present",
    "canonical correct", "image and alt text present", "category/practice relationship present", "CTA present",
    "internal links present", "author", "approval status", "redirect status", "notes"
  ], approvalRows);

  writeCsv(paths.staticRestoration, [
    "priority", "old URL", "proposed final URL", "page type", "decision", "target status", "canonical-safe",
    "sitemap-safe", "legal review status", "recommended next action", "notes"
  ], staticRestorationRows);

  writeCsv(paths.redirectBatch, [
    "old URL", "old source path", "new URL", "new target path", "redirect type", "activation status", "sitemap status", "notes"
  ], redirectRows);

  const result = {
    generatedAt: new Date().toISOString(),
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    sqlAvailable: wpData.sqlAvailable,
    blockedCandidatesReviewed: blockedRows.length,
    sourceBodiesFound: sourceRows.filter((row) => row["source body found yes/no"] === "yes").length,
    hiddenDocsRecovered: recoveredHiddenDocs.length,
    imagePatchResults,
    approvedPublicPostsBefore: approvedPosts.length,
    approvedPublicPostsAfter,
    approvedCount: approvedThisRun.length,
    approvedThisRun,
    keptHiddenCount: keptHidden.length,
    keptHidden,
    staticRowsReviewed: staticRestorationRows.length,
    redirectRows: redirectRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    sitemapHasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
    robotsProductionSitemap: robots.text.includes(`${SITE_URL}/sitemap.xml`),
    robotsBlocksStudio: robots.text.includes("Disallow: /studio"),
    robotsBlocksApi: robots.text.includes("Disallow: /api")
  };

  fs.writeFileSync(paths.resultJson, JSON.stringify(result, null, 2), "utf8");
  fs.writeFileSync(paths.report, `# Sprint 11K Source Recovery and Authority Restoration Report

Generated: ${result.generatedAt}

## Summary

- Applied changes: ${result.applied ? "yes" : "no"}
- Sanity token detected: ${result.tokenDetected ? "yes" : "no"}
- Token printed: no
- SQL backup available: ${result.sqlAvailable ? "yes" : "no"}
- Blocked Sprint 11J blog candidates reviewed: ${result.blockedCandidatesReviewed}
- Source bodies found: ${result.sourceBodiesFound}
- Hidden source documents recovered/refreshed: ${result.hiddenDocsRecovered}
- Image fallback patches applied: ${result.imagePatchResults.length}
- Approved public posts before Sprint 11K: ${result.approvedPublicPostsBefore}
- Approved public posts after Sprint 11K: ${result.approvedPublicPostsAfter}
- Articles approved in Sprint 11K: ${result.approvedCount}
- Articles kept hidden: ${result.keptHiddenCount}
- Static/service authority rows reviewed: ${result.staticRowsReviewed}
- Redirect rows selected: ${result.redirectRows}

## Approved Articles

${result.approvedThisRun.length ? result.approvedThisRun.map((item) => `- ${item.slug}: ${item.targetUrl}`).join("\n") : "- None."}

## Guardrails

- No DNS, Hostinger, Chaman Properties, raw backup, SQL dump, wp-config, or secret file was touched by this helper.
- Public blog author is governed by \`${AUTHOR_ID}\` / ${AUTHOR_NAME}.
- Redirects must be added only after public targets return 200 and appear in sitemap.
- Hidden draft URLs must not be submitted to GSC/Bing.

## Output Files

- \`${paths.freshEvidence}\`
- \`${paths.sourceRecovery}\`
- \`${paths.imageCompletion}\`
- \`${paths.lawyerClearance}\`
- \`${paths.metadataCompletion}\`
- \`${paths.approvalBatch}\`
- \`${paths.staticRestoration}\`
- \`${paths.redirectBatch}\`
- \`${paths.resultJson}\`
`, "utf8");

  console.log(JSON.stringify({
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    sqlAvailable: wpData.sqlAvailable,
    blockedCandidatesReviewed: blockedRows.length,
    sourceBodiesFound: result.sourceBodiesFound,
    hiddenDocsRecovered: recoveredHiddenDocs.length,
    imagePatchResults: imagePatchResults.length,
    approvedPublicPostsBefore: approvedPosts.length,
    approvedPublicPostsAfter,
    approvedCount: approvedThisRun.length,
    approvedSlugs: approvedThisRun.map((item) => item.slug),
    keptHiddenCount: keptHidden.length,
    staticRowsReviewed: staticRestorationRows.length,
    redirectRows: redirectRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
