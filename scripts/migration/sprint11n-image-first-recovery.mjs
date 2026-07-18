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
const HIDDEN_PREFIX = "chamanlawfirm-sprint11n-hidden-";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11n-";
const REPAIR_LIMIT = 50;
const STATIC_LIMIT = 20;
const APPROVAL_LIMIT = 12;
const MIN_BODY_CHARACTERS = 900;
const shouldApply = process.argv.includes("--apply");

const backupRoot =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026";
const sqlGzPath = path.join(backupRoot, "u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz");

const paths = {
  sprint11mFullBatch: path.join("docs", "SPRINT-11M-FULL-LEGACY-100-URL-RECOVERY-BATCH.csv"),
  sprint11mBlogBatch: path.join("docs", "SPRINT-11M-BLOG-RECOVERY-SCALE-UP.csv"),
  sprint11mStaticBatch: path.join("docs", "SPRINT-11M-STATIC-SERVICE-PAGE-RECOVERY-BATCH.csv"),
  imageLibrary: path.join("docs", "SPRINT-11J-APPROVED-LEGAL-IMAGE-LIBRARY.csv"),
  nextConfig: "next.config.mjs",
  freshEvidence: path.join("docs", "SPRINT-11N-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  selection: path.join("docs", "SPRINT-11N-BLOCKER-REPAIR-SELECTION.csv"),
  sourceRepair: path.join("docs", "SPRINT-11N-SOURCE-BODY-REPAIR.csv"),
  imageRepair: path.join("docs", "SPRINT-11N-IMAGE-ALT-REPAIR.csv"),
  legalClearance: path.join("docs", "SPRINT-11N-LEGAL-CURRENT-LAW-CLEARANCE.csv"),
  seoEnhancement: path.join("docs", "SPRINT-11N-SEO-AEO-GEO-ENHANCEMENT.csv"),
  approvalBatch: path.join("docs", "SPRINT-11N-BLOG-APPROVAL-BATCH.csv"),
  staticRecovery: path.join("docs", "SPRINT-11N-STATIC-SERVICE-RECOVERY-BATCH.csv"),
  redirectBatch: path.join("docs", "SPRINT-11N-EXACT-REDIRECT-RESCUE-BATCH.csv"),
  indexingPack: path.join("docs", "SPRINT-11N-GSC-BING-INDEXING-PACK.md"),
  report: path.join("docs", "SPRINT-11N-IMAGE-FIRST-RECOVERY-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11N-RESULT.json")
};

const mergeTargets = new Map([
  ["analysis-of-the-nigerian-legal-system", "/resources/blog/the-nigerian-legal-system"],
  ["methods-of-transfer-of-shares", "/resources/blog/transfer-of-company-shares-in-nigeria"],
  ["successfully-obtain-a-building-plan-approval", "/resources/blog/building-permit-approval-in-ogun-state"],
  ["how-do-i-get-building-approval-in-ogun-state", "/resources/blog/building-permit-approval-in-ogun-state"],
  ["what-is-the-importance-of-certifi-occupancy", "/resources/blog/why-you-need-a-certificate-of-occupancy-in-nigeria"],
  ["how-to-obtain-certificate-of-occupancy-in-ogun", "/resources/blog/obtaining-a-c-of-o-in-ogun-state"],
  ["how-do-i-resolve-landlord-tenant-disputes", "/resources/blog/proper-steps-to-eviction-of-tenants"]
]);

const lowRiskConceptSlugs = new Set([
  "the-concept-of-rule-of-law-in-nigeria",
  "the-overall-list-of-federal-laws-in-nigeria",
  "proven-steps-the-canons-of-interpretation",
  "the-nigerian-legal-system",
  "challenges-facing-the-nigerian-court-system",
  "analysis-of-the-nigerian-legal-system",
  "basic-elements-of-defamatory-statement",
  "5-reasonsthe-importance-of-pleading"
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
  const base = value || slug.replace(/-/g, " ");
  return titleCase(
    base
      .replace(/\b(powerful|critical|shocking|essential|ultimate|hidden|unlocking|revolutionizing|cracking the code|proven steps?)\b[:;]?\s*/gi, "")
      .replace(/\s+/g, " ")
      .trim()
  )
    .replace(/^the\b/, "The")
    .replace(/^a\b/, "A");
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
    .replace(/\[caption[^\]]*\]/gi, " ")
    .replace(/\[\/caption\]/gi, " ")
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
  return /\/consultation|book a consultation|speak with (a|our) lawyer|contact chaman law firm|consultation/i.test(text);
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

function practiceInfo(slug = "", title = "", category = "") {
  const haystack = `${slug} ${title} ${category}`.toLowerCase();
  if (/family|marriage|divorce|child|paternity|maternity|surname/.test(haystack)) {
    return { title: "Family Law", categoryId: "category.family-law", href: "/practice-areas/family-law", topic: "family law" };
  }
  if (/immigration|visa|citizenship|passport|residency|travel/.test(haystack)) {
    return { title: "Immigration", categoryId: "category.immigration", href: "/practice-areas/immigration-services", topic: "immigration" };
  }
  if (/employment|labour|trade-union|workplace|vicarious|collective agreement/.test(haystack)) {
    return { title: "Employment Law", categoryId: "category.employment-law", href: "/practice-areas/employment-law", topic: "employment law" };
  }
  if (/debt|loan|recovery/.test(haystack)) {
    return { title: "Debt Recovery", categoryId: "category.debt-recovery", href: "/practice-areas/debt-recovery", topic: "debt recovery" };
  }
  if (/probate|estate|inheritance|will|testamentary/.test(haystack)) {
    return { title: "Probate and Estate Administration", categoryId: "category.probate-estate-administration", href: "/practice-areas/probate-estate-administration", topic: "probate and estate administration" };
  }
  if (/notary|notar|power of attorney|apostille|affidavit|document|deed poll/.test(haystack)) {
    return { title: "Notary Public", categoryId: "category.notary-public", href: "/practice-areas/notary-public-services", topic: "notary public" };
  }
  if (/corporate|company|cac|contract|share|director|securities|business|ultra vires|minority|private placement/.test(haystack)) {
    return { title: "Corporate and Commercial Law", categoryId: "category.corporate-commercial-law", href: "/practice-areas/corporate-commercial-law", topic: "corporate and commercial law" };
  }
  if (/court|litigation|witness|evidence|lawsuit|equity|judiciary|regulatory|federal laws|nigerian legal system|rule of law|sources of nigerian law|pleading|defamatory|laches/.test(haystack)) {
    return { title: "Litigation and Dispute Resolution", categoryId: "category.litigation-dispute-resolution", href: "/practice-areas/litigation-dispute-resolution", topic: "litigation and dispute resolution" };
  }
  if (/adr|mediation|arbitration|conflict resolution/.test(haystack)) {
    return { title: "ADR / Mediation", categoryId: "category.adr-mediation", href: "/practice-areas/adr-mediation", topic: "ADR and mediation" };
  }
  if (/land|property|tenant|c-of-o|certificate|governor|occupancy|mortgage|stamp|charge|building|permit|title/.test(haystack)) {
    return { title: "Property and Real Estate Law", categoryId: "category.property-and-real-estate-law", href: "/practice-areas/property-real-estate-law", topic: "property law" };
  }
  return { title: "General Legal Education", categoryId: "category.general-legal-education", href: "/practice-areas", topic: "general legal education" };
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
    makeBlock(`answer-${slug}`, `${title} is a public legal education topic. Chaman Law Firm explains the key issues, documents, risks, and decision points readers should understand before acting.`),
    makeBlock(`legal-frame-${slug}`, "This article is for general legal education only. It does not replace advice from a lawyer who has reviewed the facts, documents, deadlines, and applicable law.")
  ];
  fragments.forEach((fragment, index) => {
    const tag = fragment.match(/<\s*(h[1-6]|blockquote|li|p|div)\b/i)?.[1]?.toLowerCase() || "p";
    const text = cleanText(fragment)
      .replace(/\b(powerful|shocking|ultimate|hidden)\b[:;]?\s*/gi, "")
      .replace(/Chaman Properties/gi, "Chaman Law Firm")
      .replace(/free legal advice/gi, "legal guidance");
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
  return blocks.slice(0, 140);
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

function enrichPortableBody(body, slug, title, practiceHref) {
  const cleanBody = sanitizePortableBody(body);
  const text = bodyText(cleanBody);
  const nextBody = [...cleanBody];
  if (!/public legal education topic/i.test(text)) {
    nextBody.unshift(makeBlock(`answer-${slug}`, `${title} is a public legal education topic. Chaman Law Firm explains the key issues, documents, risks, and decision points readers should understand before acting.`));
  }
  if (!/general legal education|does not replace advice/i.test(text)) {
    nextBody.unshift(makeBlock(`legal-frame-${slug}`, "This article is for general legal education only. It does not replace advice from a lawyer who has reviewed the facts, documents, deadlines, and applicable law."));
  }
  if (!hasHref(nextBody)) {
    nextBody.push({
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
  }
  if (!hasConsultationSignal(text)) {
    nextBody.push({
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
  return [...new Set(risks)];
}

function sourceQuality(text) {
  if (!text || text.length < 500) return "missing/thin";
  if (text.length < MIN_BODY_CHARACTERS) return "short/review needed";
  if (text.length < 1800) return "usable";
  return "complete";
}

function legalRiskFor(slug, title, text, priorRisk = "") {
  const topic = `${slug} ${title}`.toLowerCase();
  if (lowRiskConceptSlugs.has(slug)) return "low-risk after general-information framing";
  if (/police|criminal|crime|bail|domestic violence|custody|divorce|inheritance|probate|eviction|quit notice|harassment|stolen|correctional|conjugal|paternity|maternity|tenant|landlord/.test(topic)) {
    return "high risk, keep hidden";
  }
  if (/land use act|land registration|land charge|mortgage|stamp|tax|cac|immigration|employment|debt|corporate|contract|securities|building permit|standard organisat|son|board of directors|trade union|minority protection/.test(`${topic} ${text}`.toLowerCase())) {
    return "medium risk, needs Principal/lawyer review";
  }
  if (/blocked|high/i.test(priorRisk)) return "high risk, keep hidden";
  return "low-risk after general-information framing";
}

function duplicateRiskFor(slug, row, configuredRedirect, publicBySlug) {
  if (publicBySlug.has(slug)) return "already public canonical target exists";
  if (configuredRedirect && configuredRedirect !== `/resources/blog/${slug}`) return `merge/duplicate already redirected to ${configuredRedirect}`;
  if (mergeTargets.has(slug)) return `merge into stronger live equivalent ${mergeTargets.get(slug)}`;
  if (/cannibal|duplicate/i.test(row.notes || "")) return "manual cannibalization review required";
  return "not flagged";
}

function imageTopic(slug, title, category) {
  return practiceInfo(slug, title, category).topic;
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

function libraryTopicMatches(candidateTopic, articleTopic) {
  const candidate = String(candidateTopic || "").toLowerCase();
  const article = String(articleTopic || "").toLowerCase();
  if (candidate === article) return true;
  if (/litigation|dispute/.test(article) && /litigation|court/.test(candidate)) return true;
  if (/property|land/.test(article) && /property|land/.test(candidate)) return true;
  if (/corporate|commercial/.test(article) && /corporate|cac|company/.test(candidate)) return true;
  if (/probate|estate/.test(article) && /probate|estate/.test(candidate)) return true;
  if (/family/.test(article) && /family/.test(candidate)) return true;
  if (/immigration/.test(article) && /immigration/.test(candidate)) return true;
  if (/debt/.test(article) && /debt/.test(candidate)) return true;
  if (/notary/.test(article) && /notary/.test(candidate)) return true;
  return false;
}

function normalizeImageLibrary(libraryRows) {
  return libraryRows
    .map((row) => ({
      assetId: row["Sanity asset reference if available"] || "",
      topic: row["topic category"] || "",
      source: row["image source"] || "",
      repeatedRisk: row["repeated-use risk"] || "",
      contamination: row["Chaman Properties contamination risk"] || "",
      existingCount: Number(row.notes?.match(/Used by (\d+)/i)?.[1] || 0),
      notes: row.notes || ""
    }))
    .filter((row) => row.assetId);
}

function sourceImageNeedsReplacement(assetId, topic, imageLibrary) {
  const row = imageLibrary.find((item) => item.assetId === assetId);
  if (!row) return false;
  if (/yes|review/i.test(row.contamination)) return true;
  if (/high/i.test(row.repeatedRisk)) return true;
  if (!libraryTopicMatches(row.topic, topic)) return true;
  return false;
}

function chooseFallbackImage(topic, imageLibrary, useCounts) {
  const rows = imageLibrary
    .filter((row) => !/yes|review/i.test(row.contamination) && !/high/i.test(row.repeatedRisk))
    .filter((row) => libraryTopicMatches(row.topic, topic))
    .sort((a, b) => (useCounts.get(a.assetId) || 0) - (useCounts.get(b.assetId) || 0) || a.existingCount - b.existingCount);
  return rows[0] || null;
}

function seoFor(slug, title, doc, wpPost) {
  const existingTitle = doc?.seo?.metaTitle || "";
  const existingDescription = doc?.seo?.metaDescription || "";
  const wpTitle = cleanText(wpPost?.post_title || "");
  const wpExcerpt = cleanText(wpPost?.post_excerpt || "");
  return {
    title: existingTitle || `${title} | Chaman Law Firm`,
    description:
      existingDescription ||
      wpExcerpt ||
      `Learn key Nigerian legal considerations on ${wpTitle || title}. Chaman Law Firm explains risks, documents, and when to speak with a lawyer.`
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
    description: `${info.title} insights from Chaman Law Firm.`
  });
}

function buildPostDoc({ id, slug, title, body, seo, image, info, publishedAt, approved }) {
  return {
    _id: id,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: seo.description,
    publishedAt: publishedAt || new Date().toISOString(),
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
    lawFirmApproved: approved
  };
}

async function queryPostsBySlugs(slugs) {
  return client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,_updatedAt,title,"slug":slug.current,excerpt,publishedAt,author,
      "authorRef":author._ref,"authorName":author->name,
      categories[]->{_id,title,"slug":slug.current},tags,mainImage{alt,asset->{_id,url}},
      body,"bodyText":pt::text(body),seo,lawFirmApproved
    }`,
    { slugs }
  );
}

function chooseHiddenSource(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true && !doc._id.startsWith("drafts.")) ||
    docs.find((doc) => doc._id.startsWith("drafts.")) ||
    null;
}

async function fetchHead(url, attempts = 3) {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: controller.signal });
      clearTimeout(timeout);
      return { status: response.status, location: response.headers.get("location") || "", cache: response.headers.get("x-vercel-cache") || "" };
    } catch (error) {
      lastError = error.message;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  return { status: "error", location: "", error: lastError };
}

async function fetchText(url, attempts = 3) {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(url, { signal: controller.signal });
      const text = await response.text();
      clearTimeout(timeout);
      return { status: response.status, text };
    } catch (error) {
      lastError = error.message;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  return { status: "error", text: "", error: lastError };
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
      } else if (pattern.test(full) && !/SPRINT-11[MN]|SPRINT-10|PHASE/i.test(entry.name)) {
        const stat = fs.statSync(full);
        matches.push({ file: full, modified: stat.mtime.toISOString(), size: stat.size });
      }
    }
  }
  walk("docs");
  return matches.sort((a, b) => b.modified.localeCompare(a.modified));
}

function selectionScore(row) {
  const clicks = Number(row["GSC clicks"] || row.clicks || 0);
  const impressions = Number(row["GSC impressions"] || row.impressions || 0);
  const sourceBonus = /present|yes/i.test(`${row["body/source status"] || ""} ${row["source body available"] || ""}`) ? 500 : 0;
  const imageBonus = /present|yes/i.test(`${row["image status"] || ""} ${row["image available"] || ""}`) ? 300 : 0;
  const legalBonus = lowRiskConceptSlugs.has(row.slug) ? 800 : 0;
  return clicks * 5 + impressions * 0.02 + sourceBonus + imageBonus + legalBonus;
}

function buildCandidateRows() {
  const fullRows = readCsv(paths.sprint11mFullBatch);
  const blogRows = readCsv(paths.sprint11mBlogBatch);
  const bySlug = new Map();
  for (const row of fullRows) {
    const slug = slugFromUrl(row["old URL"]);
    if (!slug) continue;
    bySlug.set(slug, {
      slug,
      "old URL": row["old URL"],
      title: row["old title"],
      pageType: row["page type"],
      "GSC clicks": row["GSC clicks"],
      "GSC impressions": row["GSC impressions"],
      "body/source status": row["source body available"] === "yes" ? "source body present" : "source recovery needed",
      "image status": row["image available"] === "yes" ? "present" : "missing",
      "legal risk": row["legal/current-law risk"],
      notes: row.notes || ""
    });
  }
  for (const row of blogRows) {
    const slug = row.slug || slugFromUrl(row["old URL"]);
    if (!slug) continue;
    bySlug.set(slug, { ...(bySlug.get(slug) || {}), ...row, slug, pageType: "blog" });
  }
  return [...bySlug.values()]
    .filter((row) => row.pageType === "blog")
    .sort((a, b) => selectionScore(b) - selectionScore(a))
}

function readinessDecision({ canApprove, sourceFound, image, legalRisk, duplicateRisk, textRisks, targetMerge }) {
  if (canApprove) return "approve controlled public article";
  if (targetMerge) return "merge by exact redirect after live-target QA";
  if (!sourceFound) return "recover body from deeper source";
  if (!image?.assetId) return "repair image/alt before approval";
  if (/high/.test(legalRisk)) return "keep hidden for lawyer review";
  if (/medium/.test(legalRisk)) return "keep hidden for current-law review";
  if (/merge|duplicate|already public/i.test(duplicateRisk)) return "keep hidden; merge/canonical review";
  if (textRisks.length) return "keep hidden for editorial cleanup";
  return "keep hidden pending Principal review";
}

async function main() {
  if (shouldApply && !token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const configText = fs.readFileSync(paths.nextConfig, "utf8");
  const redirects = parseRedirects(configText);
  const imageLibraryRows = normalizeImageLibrary(readCsv(paths.imageLibrary));
  const rawCandidates = buildCandidateRows();
  const slugs = [...new Set(rawCandidates.map((row) => row.slug))];
  const [docs, sitemap, robots, homepage, www, blogIndex] = await Promise.all([
    queryPostsBySlugs(slugs),
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    fetchHead(`${SITE_URL}/`),
    fetchHead(`https://www.chamanlawfirm.com/`),
    fetchHead(`${SITE_URL}/resources/blog`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const docsBySlug = new Map();
  const publicBySlug = new Map();
  for (const doc of docs) {
    if (!doc.slug) continue;
    if (!docsBySlug.has(doc.slug)) docsBySlug.set(doc.slug, []);
    docsBySlug.get(doc.slug).push(doc);
    if (doc.lawFirmApproved === true && !doc._id.startsWith("drafts.")) publicBySlug.set(doc.slug, doc);
  }
  const activeCandidates = rawCandidates
    .filter((row) => {
      const slug = row.slug;
      const oldPath = normalizePath(row["old URL"]);
      const configured = redirects.get(oldPath);
      if (publicBySlug.has(slug)) return false;
      if (configured && configured !== `/resources/blog/${slug}`) return false;
      return true;
    })
    .slice(0, REPAIR_LIMIT);
  const wpData = await extractWordPressData(sqlGzPath, [...new Set(activeCandidates.map((row) => row.slug))]);

  const selectionRows = [];
  const sourceRows = [];
  const imageRows = [];
  const legalRows = [];
  const seoRows = [];
  const approvalRows = [];
  const redirectRows = [];
  const approvedThisRun = [];
  const keptHidden = [];
  const hiddenRepairs = [];
  const imagePatches = [];
  const mergeRedirectCandidates = [];
  const fallbackUseCounts = new Map();

  for (const [index, row] of activeCandidates.entries()) {
    const slug = row.slug;
    const oldPath = normalizePath(row["old URL"]);
    const targetPath = `/resources/blog/${slug}`;
    const targetUrl = absoluteUrl(targetPath);
    const info = practiceInfo(slug, row.title, row["practice/category"] || row.category || "");
    const hiddenSource = chooseHiddenSource(docsBySlug.get(slug) || []);
    const alreadyPublic = publicBySlug.has(slug);
    const wpPost = wpData.postsBySlug.get(slug);
    const existingText = bodyText(hiddenSource?.body || []);
    const wpText = cleanText(wpPost?.post_content || "");
    const title = cleanTitle(hiddenSource?.title || wpPost?.post_title || row.title, slug);
    const useWpBody = wpText.length > existingText.length && wpText.length >= 500;
    const body = useWpBody
      ? portableTextFromWordPress(wpPost.post_content, title, slug, info.href)
      : enrichPortableBody(hiddenSource?.body || [], slug, title, info.href);
    const text = bodyText(body);
    const bodyQuality = sourceQuality(text);
    const sourceFound = Boolean(hiddenSource?.body?.length) || Boolean(wpPost?.post_content);
    const configuredRedirect = redirects.get(oldPath);
    const textRisks = detectTextRisks(`${slug} ${title} ${text}`);
    const legalRisk = legalRiskFor(slug, title, text, row["legal risk"] || row["legal/current-law risk"] || "");
    const duplicateRisk = duplicateRiskFor(slug, row, configuredRedirect, publicBySlug);
    const targetMerge = mergeTargets.get(slug) || "";
    const topic = imageTopic(slug, title, info.title);
    let image = hiddenSource?.mainImage?.asset?._id
      ? {
          assetId: hiddenSource.mainImage.asset._id,
          alt: hiddenSource.mainImage.alt || altTextFor(title, topic),
          status: "source image",
          topic
        }
      : null;
    if (image && sourceImageNeedsReplacement(image.assetId, topic, imageLibraryRows)) {
      image = null;
    }
    const fallback = !image && sourceFound && bodyQuality !== "missing/thin" && !textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk))
      ? chooseFallbackImage(topic, imageLibraryRows, fallbackUseCounts)
      : null;
    if (!image && fallback) {
      image = {
        assetId: fallback.assetId,
        alt: altTextFor(title, topic),
        status: "approved fallback image",
        topic
      };
      fallbackUseCounts.set(fallback.assetId, (fallbackUseCounts.get(fallback.assetId) || 0) + 1);
    }

    const seo = seoFor(slug, title, hiddenSource, wpPost);
    const blockers = [];
    if (alreadyPublic) blockers.push("already public");
    if (!sourceFound || bodyQuality === "missing/thin") blockers.push("source body missing/thin");
    if (bodyQuality === "short/review needed") blockers.push("source body short");
    if (!image?.assetId) blockers.push("featured image missing");
    if (!image?.alt || image.alt.length < 10) blockers.push("alt text missing/review needed");
    if (!seo.title) blockers.push("SEO title missing");
    if (!seo.description) blockers.push("meta description missing");
    if (!oldPath || oldPath === "/") blockers.push("exact old URL mapping missing");
    if (!hasHref(body)) blockers.push("internal link missing");
    if (!hasConsultationSignal(text)) blockers.push("consultation CTA missing");
    if (textRisks.length) blockers.push(...textRisks);
    if (/medium|high/.test(legalRisk)) blockers.push(legalRisk);
    if (/already public|merge|duplicate/i.test(duplicateRisk)) blockers.push(duplicateRisk);
    if (targetMerge) blockers.push(`merge target preferred: ${targetMerge}`);
    if (!lowRiskConceptSlugs.has(slug)) blockers.push("not in Sprint 11N low-risk concept subset");

    const canApprove = blockers.length === 0 && approvedThisRun.length < APPROVAL_LIMIT;
    const recoveryAction = readinessDecision({ canApprove, sourceFound, image, legalRisk, duplicateRisk, textRisks, targetMerge });

    const hiddenDoc = sourceFound && !alreadyPublic
      ? buildPostDoc({
          id: hiddenSource?._id && !hiddenSource._id.startsWith("drafts.") ? hiddenSource._id : `${HIDDEN_PREFIX}${slug}`,
          slug,
          title,
          body,
          seo,
          image,
          info,
          publishedAt: hiddenSource?.publishedAt || wpPost?.post_date || new Date().toISOString(),
          approved: false
        })
      : null;

    if (shouldApply && hiddenDoc) {
      await ensureCategory(info);
      await client.createOrReplace(hiddenDoc);
      hiddenRepairs.push({ slug, id: hiddenDoc._id });
      if (image?.status === "approved fallback image") imagePatches.push({ slug, assetId: image.assetId });
    }

    if (canApprove) {
      const publicDoc = buildPostDoc({
        id: `${PUBLIC_PREFIX}${slug}`,
        slug,
        title,
        body,
        seo,
        image,
        info,
        publishedAt: hiddenDoc?.publishedAt || hiddenSource?.publishedAt || wpPost?.post_date || new Date().toISOString(),
        approved: true
      });
      if (shouldApply) {
        await ensureCategory(info);
        await client.createOrReplace(publicDoc);
      }
      approvedThisRun.push({ slug, title, oldUrl: absoluteUrl(oldPath), targetPath, targetUrl });
    } else if (!alreadyPublic) {
      keptHidden.push({ slug, title, oldUrl: absoluteUrl(oldPath), reason: blockers.join("; ") || "kept hidden for manual review" });
    }

    if (targetMerge && !configuredRedirect && !alreadyPublic) {
      const finalTarget = absoluteUrl(targetMerge);
      const targetStatus = await fetchHead(finalTarget);
      const targetInSitemap = sitemapUrls.has(finalTarget);
      if (targetStatus.status === 200 && targetInSitemap) {
        mergeRedirectCandidates.push({ slug, oldPath, oldUrl: absoluteUrl(oldPath), targetPath: targetMerge, targetUrl: finalTarget });
      }
    }

    selectionRows.push({
      priority: index + 1,
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      clicks: row["GSC clicks"] || row.clicks || "",
      impressions: row["GSC impressions"] || row.impressions || "",
      "current status": alreadyPublic ? "already public" : configuredRedirect ? `redirect configured to ${configuredRedirect}` : hiddenSource ? "hidden Sanity record" : wpPost ? "source found in SQL only" : "source recovery needed",
      "source repairability": sourceFound ? bodyQuality : "source missing",
      "image repairability": image?.assetId ? image.status : "image missing",
      "legal risk": legalRisk,
      "duplicate/cannibalization risk": duplicateRisk,
      "recommended Sprint 11N action": recoveryAction,
      notes: blockers.join("; ")
    });

    sourceRows.push({
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      "source body recovered yes/no": sourceFound ? "yes" : "no",
      "source used": useWpBody ? "WordPress SQL body" : hiddenSource ? "existing Sanity hidden body" : "none",
      "body quality": bodyQuality,
      "plugin debris removed yes/no": "yes - shortcodes/scripts/styles stripped during recovery",
      "headings improved yes/no": sourceFound ? "yes - heading tags normalized into portable text" : "no",
      "answer-first paragraph added yes/no": sourceFound ? "yes" : "no",
      "consultation CTA added yes/no": sourceFound ? "yes" : "no",
      "internal links added yes/no": sourceFound ? "practice, consultation and contact links added" : "no",
      "approval readiness": canApprove ? (shouldApply ? "approved" : "ready") : "not ready",
      notes: blockers.join("; ")
    });

    imageRows.push({
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      "original featured image found yes/no": hiddenSource?.mainImage?.asset?._id ? "yes" : "no",
      "original body image found yes/no": /wp-content\/uploads/i.test(wpPost?.post_content || "") ? "yes" : "not confirmed",
      "fallback image assigned yes/no": image?.status === "approved fallback image" ? (shouldApply ? "yes - patched" : "ready in dry-run") : "no",
      "Sanity image reference": image?.assetId || "",
      "image topic category": image?.topic || topic,
      "alt text": image?.alt || "",
      "image relevance": image?.assetId ? `matched to ${topic}` : "missing or unsafe to assign",
      "repeated image risk": image?.assetId && /high/i.test(imageLibraryRows.find((item) => item.assetId === image.assetId)?.repeatedRisk || "") ? "high - blocked/replaced" : "not detected",
      "Chaman Properties contamination risk": textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk)) ? "yes" : "not detected",
      "approval readiness": canApprove ? (shouldApply ? "approved" : "ready") : "keep hidden",
      notes: blockers.join("; ")
    });

    legalRows.push({
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      classification: canApprove ? "low-risk and approval-ready" : legalRisk,
      "public legal education suitability": /high/.test(legalRisk) ? "no - lawyer review first" : "yes with general-information framing",
      "unsafe legal advice": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "outdated/current-law concern": /medium|high/.test(legalRisk) ? "manual verification required" : "not detected",
      "off-brand/property-sales content": textRisks.some((risk) => /property-sales|Chaman Properties/.test(risk)) ? "yes" : "not detected",
      "misleading free-service wording": textRisks.includes("misleading free-service wording") ? "yes" : "not detected",
      "duplicate/cannibalization": duplicateRisk,
      "approval recommendation": canApprove ? "approve" : "keep hidden",
      notes: blockers.join("; ")
    });

    seoRows.push({
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      "SEO title present": seo.title ? "yes" : "no",
      "meta description present": seo.description ? "yes" : "no",
      canonical: targetUrl,
      H1: title,
      "headings cleaned": sourceFound ? "yes" : "pending source recovery",
      "search intent answered early": sourceFound ? "yes - answer block added" : "pending",
      "consultation CTA": sourceFound ? "present or added" : "needed",
      "internal links": sourceFound ? "practice/consultation/contact links added" : "needed",
      "FAQ/short answer": "answer-first block added where recovered",
      "AEO/GEO entity signals": "Chaman Law Firm; Nigeria; relevant practice-area entity",
      "legal safety": canApprove ? "passed low-risk gates" : legalRisk,
      "sitemap inclusion expected": canApprove ? "yes after approval and revalidation" : "no while hidden",
      notes: blockers.join("; ")
    });

    approvalRows.push({
      "old URL": absoluteUrl(oldPath),
      slug,
      title,
      "complete source body": bodyQuality === "complete" || bodyQuality === "usable" ? "yes" : "no",
      "clean formatting": textRisks.includes("plugin debris") ? "cleaned but needs review" : "yes",
      "unsafe legal claim": textRisks.includes("unsafe self-help wording") ? "flagged" : "not detected",
      "misleading free-service wording": textRisks.includes("misleading free-service wording") ? "flagged" : "not detected",
      "duplicate/cannibalization risk": duplicateRisk,
      "SEO title present": seo.title ? "yes" : "no",
      "meta description present": seo.description ? "yes" : "no",
      "canonical correct": targetUrl,
      "image and alt text present": image?.assetId && image?.alt ? "yes" : "no",
      "category/practice relationship present": info.title,
      "CTA present": sourceFound ? "yes" : "no",
      "internal links present": sourceFound ? "yes" : "no",
      author: AUTHOR_NAME,
      "approval status": canApprove ? (shouldApply ? "approved" : "ready") : "hidden",
      "redirect status": canApprove ? "pending live/sitemap verification" : targetMerge ? "merge redirect candidate if target verified" : "not eligible",
      notes: blockers.join("; ")
    });
  }

  for (const item of [...approvedThisRun, ...mergeRedirectCandidates]) {
    if (redirects.has(normalizePath(item.oldUrl))) continue;
    redirectRows.push({
      "old URL": item.oldUrl,
      "old source path": normalizePath(item.oldUrl),
      "new URL": item.targetUrl,
      "new target path": item.targetPath,
      "redirect type": "one-hop 308",
      "target public status": "must verify live 200 before activation",
      "target sitemap status": sitemapUrls.has(item.targetUrl) ? "included" : "verify after approval/revalidation",
      "activation status": "pending next.config activation after live target QA",
      "no-homepage-dump check": item.targetPath === "/" ? "fail" : "pass",
      "hidden-draft target check": item.targetPath.startsWith("/resources/blog/") ? "verify target public first" : "service/static live target",
      notes: "Activate only after final URL returns 200 and is sitemap/canonical safe."
    });
  }

  const staticRows = readCsv(paths.sprint11mStaticBatch).slice(0, STATIC_LIMIT).map((row, index) => {
    const oldPath = normalizePath(row["old URL"]);
    const targetPath = normalizePath(row["proposed final route"]);
    const configured = redirects.get(oldPath);
    const targetUrl = absoluteUrl(targetPath);
    return {
      priority: index + 1,
      "old URL": absoluteUrl(oldPath),
      "proposed final URL": targetUrl,
      "page type": row["page type"] || "service/static authority",
      H1: row.H1 || row["old title"],
      "SEO title": row["SEO title"] || `${row.H1 || row["old title"]} | Chaman Law Firm`,
      "meta description": row["meta description"] || `Chaman Law Firm guidance on ${row.H1 || row["old title"]}.`,
      canonical: targetUrl,
      "required sections": row["required content sections"] || "answer block; legal context; risks; CTA",
      CTA: row.CTA || "Book a consultation",
      "internal links": row["internal links"] || "practice area; consultation; contact",
      "image recommendation": row["image recommendation"] || "approved law-firm image",
      "legal review status": row["legal review status"],
      "publish readiness": configured ? "already redirected to existing live page; no new static page published" : "defer for content architecture",
      "redirect plan": configured ? `already configured to ${configured}` : "defer until exact target is live and approved"
    };
  });

  writeCsv(paths.selection, [
    "priority", "old URL", "slug", "title", "clicks", "impressions", "current status", "source repairability",
    "image repairability", "legal risk", "duplicate/cannibalization risk", "recommended Sprint 11N action", "notes"
  ], selectionRows);
  writeCsv(paths.sourceRepair, [
    "old URL", "slug", "title", "source body recovered yes/no", "source used", "body quality",
    "plugin debris removed yes/no", "headings improved yes/no", "answer-first paragraph added yes/no",
    "consultation CTA added yes/no", "internal links added yes/no", "approval readiness", "notes"
  ], sourceRows);
  writeCsv(paths.imageRepair, [
    "old URL", "slug", "title", "original featured image found yes/no", "original body image found yes/no",
    "fallback image assigned yes/no", "Sanity image reference", "image topic category", "alt text", "image relevance",
    "repeated image risk", "Chaman Properties contamination risk", "approval readiness", "notes"
  ], imageRows);
  writeCsv(paths.legalClearance, [
    "old URL", "slug", "title", "classification", "public legal education suitability", "unsafe legal advice",
    "outdated/current-law concern", "off-brand/property-sales content", "misleading free-service wording",
    "duplicate/cannibalization", "approval recommendation", "notes"
  ], legalRows);
  writeCsv(paths.seoEnhancement, [
    "old URL", "slug", "title", "SEO title present", "meta description present", "canonical", "H1",
    "headings cleaned", "search intent answered early", "consultation CTA", "internal links", "FAQ/short answer",
    "AEO/GEO entity signals", "legal safety", "sitemap inclusion expected", "notes"
  ], seoRows);
  writeCsv(paths.approvalBatch, [
    "old URL", "slug", "title", "complete source body", "clean formatting", "unsafe legal claim",
    "misleading free-service wording", "duplicate/cannibalization risk", "SEO title present", "meta description present",
    "canonical correct", "image and alt text present", "category/practice relationship present", "CTA present",
    "internal links present", "author", "approval status", "redirect status", "notes"
  ], approvalRows);
  writeCsv(paths.staticRecovery, [
    "priority", "old URL", "proposed final URL", "page type", "H1", "SEO title", "meta description", "canonical",
    "required sections", "CTA", "internal links", "image recommendation", "legal review status", "publish readiness", "redirect plan"
  ], staticRows);
  writeCsv(paths.redirectBatch, [
    "old URL", "old source path", "new URL", "new target path", "redirect type", "target public status",
    "target sitemap status", "activation status", "no-homepage-dump check", "hidden-draft target check", "notes"
  ], redirectRows);

  const fresh = freshEvidenceFiles();
  fs.writeFileSync(paths.freshEvidence, [
    "# Sprint 11N Fresh Search Evidence Status",
    "",
    `Fresh post-launch GSC/Bing/backlink/SERP evidence detected locally: ${fresh.length ? "yes" : "no"}.`,
    "",
    fresh.length
      ? fresh.map((item) => `- \`${item.file}\` (${item.modified}, ${item.size} bytes)`).join("\n")
      : "- No new non-sprint Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, Moz, or fresh crawl export was found locally.",
    "",
    "Do not submit hidden drafts or unresolved 404 URLs. Use only live canonical targets and old URLs whose redirects pass QA."
  ].join("\n"), "utf8");

  fs.writeFileSync(paths.indexingPack, [
    "# Sprint 11N GSC/Bing Indexing Pack",
    "",
    "Use this pack only after deployment and live redirect QA pass.",
    "",
    "## Sitemap",
    "",
    `- ${SITE_URL}/sitemap.xml`,
    "",
    "## Newly Approved Live Article URLs",
    "",
    approvedThisRun.length ? approvedThisRun.map((item) => `- ${item.targetUrl}`).join("\n") : "- None approved in this run.",
    "",
    "## Newly Redirected Old URLs",
    "",
    redirectRows.length ? redirectRows.map((row) => `- ${row["old URL"]} -> ${row["new URL"]}`).join("\n") : "- None selected for activation yet.",
    "",
    "## Instructions",
    "",
    "1. Refresh or resubmit the production sitemap.",
    "2. Inspect each new final URL only after it returns 200 and its canonical points to itself.",
    "3. Inspect each old redirected URL only after one-hop 308 redirect QA passes.",
    "4. Do not submit hidden drafts, unresolved 404 URLs, preview URLs, or URLs with non-canonical targets."
  ].join("\n"), "utf8");

  const approvedPublicPostsAfter = shouldApply
    ? await client.fetch(`count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])`)
    : publicBySlug.size;

  const result = {
    generatedAt: new Date().toISOString(),
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    sqlAvailable: wpData.sqlAvailable,
    homepage,
    www,
    blogIndex,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    sitemapHasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
    robotsProductionSitemap: robots.text.includes(`${SITE_URL}/sitemap.xml`),
    robotsBlocksStudio: robots.text.includes("Disallow: /studio"),
    robotsBlocksApi: robots.text.includes("Disallow: /api"),
    candidatesReviewed: activeCandidates.length,
    sourceBodiesFound: sourceRows.filter((row) => row["source body recovered yes/no"] === "yes").length,
    hiddenDocsRepaired: hiddenRepairs.length,
    imagePatches,
    approvedPublicPostsAfter,
    approvedCount: approvedThisRun.length,
    approvedThisRun,
    keptHiddenCount: keptHidden.length,
    keptHidden,
    staticRowsReviewed: staticRows.length,
    redirectRows: redirectRows.length,
    redirectRowsData: redirectRows
  };
  fs.writeFileSync(paths.resultJson, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(paths.report, [
    "# Sprint 11N Image-First Recovery Report",
    "",
    `Generated: ${result.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Applied changes: ${shouldApply ? "yes" : "no - dry run"}`,
    `- Sanity token detected: ${Boolean(token) ? "yes" : "no"}`,
    "- Token printed: no",
    `- SQL backup available: ${wpData.sqlAvailable ? "yes" : "no"}`,
    `- Sprint 11M candidates reviewed: ${activeCandidates.length}`,
    `- Source bodies found/recovered: ${result.sourceBodiesFound}`,
    `- Hidden docs repaired/refreshed: ${hiddenRepairs.length}`,
    `- Image fallback patches applied: ${imagePatches.length}`,
    `- Articles approved: ${approvedThisRun.length}`,
    `- Items kept hidden: ${keptHidden.length}`,
    `- Static/service rows reviewed: ${staticRows.length}`,
    `- Redirect rows prepared: ${redirectRows.length}`,
    "",
    "## Approved Articles",
    "",
    approvedThisRun.length ? approvedThisRun.map((item) => `- ${item.slug}: ${item.targetUrl}`).join("\n") : "- None.",
    "",
    "## Guardrails",
    "",
    "- No DNS, Hostinger, Chaman Properties, raw backup, SQL dump, wp-config, wp-content, or secret file was touched.",
    "- Public blog author remains Charles Chukwuma Nkwoka, Esq.",
    "- Redirects must be activated only after target URLs return 200 and appear in sitemap.",
    "- Hidden drafts must not be submitted to Google Search Console or Bing."
  ].join("\n"), "utf8");

  console.log(JSON.stringify({
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    sqlAvailable: wpData.sqlAvailable,
    candidatesReviewed: activeCandidates.length,
    sourceBodiesFound: result.sourceBodiesFound,
    hiddenDocsRepaired: hiddenRepairs.length,
    imagePatches: imagePatches.length,
    approvedPublicPostsAfter,
    approvedCount: approvedThisRun.length,
    approvedSlugs: approvedThisRun.map((item) => item.slug),
    keptHiddenCount: keptHidden.length,
    staticRowsReviewed: staticRows.length,
    redirectRows: redirectRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
