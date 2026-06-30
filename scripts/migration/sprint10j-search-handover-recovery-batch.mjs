import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { promisify } from "node:util";
import zlib from "node:zlib";
import { getCliClient } from "sanity/cli";

const execFileAsync = promisify(execFile);

const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const DRAFT_PREFIX = "drafts.chamanlawfirm.sprint10j.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint10j-";
const SOURCE_NAME = "legacy-wordpress-backup-2026-06-28-sprint10j";

const shouldApply = process.argv.includes("--apply");
const selectionLimit = 50;
const draftLimit = 50;
const approvalLimit = 20;

const backupRoot =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026";
const sqlGzPath = path.join(backupRoot, "u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz");
const tarGzPath = path.join(backupRoot, "u169781131.chamanlawfirm-com.20260626153946.tar.gz");
const rankMathPath =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\chamanlawfirmtoplawfirminnigeria_rank-math-2026-06-20_16-32-27.csv";
const extractedImageRoot = "C:\\tmp\\chaman-sprint10j-images";

const top1000Path = "docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv";
const nextConfigPath = "next.config.mjs";
const outDir = "docs/sprint10j";
const selectionCsvPath = "docs/SPRINT-10J-LEGACY-BLOG-BATCH-SELECTION.csv";
const imageMapPath = "docs/SPRINT-10J-LEGACY-IMAGE-RECOVERY-MAP.csv";
const hiddenReviewPath = "docs/SPRINT-10J-HIDDEN-ARTICLE-RISK-REVIEW.csv";
const resultJsonPath = "docs/sprint10j/sprint10j-restoration-result.json";
const sprint10iResultPath = "docs/sprint10i/sprint10i-restoration-result.json";

const controlledApprovalSlugs = [
  "legal-processofobtaininga-deed-of-assignment",
  "land-tenures-and-customary-land-tenure-systems",
  "property-with-existing-tenants-in-nigeria",
  "where-marriage-under-the-act-can-be-conducted",
  "how-nigerian-courts-handle-electronic-evidence",
  "types-of-company-in-nigeria",
  "contract-breach-and-remedies",
  "tax-clearance-certificate-in-nigeria",
  "legalisation-authentication-of-marriage-certificate-in-nigeria",
  "what-is-a-deed-of-assent-in-nigeria",
  "domestic-violence-ground-for-dissolution-of-marriage-and-its-criminal-implications",
  "how-do-i-process-survey-plan-approval-in-ogun",
  "family-courts-and-specialized-tribunals-2",
  "immigration-service-in-border-management",
  "landlord-and-tenant-relationship",
  "how-do-i-regularize-land-documents-in-ogun-state",
  "how-to-file-for-child-custody-in-nigeria-a",
  "rights-of-children-born-outside-wedlock",
  "overview-of-statutory-marriage-in-nigeria",
  "how-to-legally-subdivide-and-develop-land"
];

const titleOverrides = new Map([
  ["is-foreign-marriage-under-the-nigerian-law", "How Valid Is a Foreign Marriage Under Nigerian Law?"],
  ["taxation-of-sole-proprietorship", "Taxation of Sole Proprietorships in Nigeria"],
  ["customary-vs-statutory-marriage-in-nigeria", "Customary vs Statutory Marriage in Nigeria"],
  ["powerful-steps-what-is-trespass-to-land-2", "What Is Trespass to Land in Nigeria?"],
  ["how-to-secure-child-support-and-maintenance", "How to Secure Child Support and Maintenance in Nigeria"],
  ["to-apply-for-and-get-certificate-of-occupancy", "How to Apply For and Obtain a Certificate of Occupancy in Nigeria"],
  ["dissolution-of-marriage-under-the-nigeria-law", "Grounds for Dissolution of Marriage Under Nigerian Law"],
  ["family-property-and-right-of-individual-member-in-family-property", "Family Property and Rights of Individual Family Members in Nigeria"],
  ["annulment-of-marriage-under-the-nigerian-law", "Annulment of Marriage Under Nigerian Law"],
  ["what-are-rights-of-women-to-inheritance-in-nigeria", "Rights of Women to Inheritance in Nigeria"],
  ["communal-land-and-family-land", "Communal Land and Family Land in Nigeria"],
  ["land-ownership-disputes-in-nigeria", "The Role of Courts in Land Ownership Disputes in Nigeria"],
  ["types-of-land-registration-in-nigeria", "Types of Land Registration in Nigeria"],
  ["what-to-know-about-company-resolution", "What to Know About Company Resolutions in Nigeria"],
  ["what-is-the-process-of-land-acquisition", "What Is the Process of Land Acquisition in Nigeria?"],
  ["complete-guide-to-probate-registry-in-lagos", "Complete Guide to the Probate Registry in Lagos"],
  ["how-to-replace-a-lost-a-marriage-certificate", "How to Replace a Lost Marriage Certificate in Nigeria"],
  ["rights-of-tenants-in-ogun-chaman-law-firm", "What Are the Rights of Tenants in Ogun State?"],
  ["taxation-of-the-construction-sector-in-nigeria", "Taxation of the Construction Sector in Nigeria"],
  ["sharing-of-property-after-divorce-in-nigeria", "Sharing of Property After Divorce in Nigeria"],
  [
    "the-role-of-family-court-in-relation-to-child-protect-in-nigeria",
    "The Role of Family Court in Child Protection in Nigeria"
  ],
  ["how-to-calculate-stamp-duty-chaman-law-firm", "How to Calculate Stamp Duty for Property Transactions in Ogun State"],
  ["how-to-legally-sublet-a-property-in-nigeria", "How to Legally Sublet a Property in Nigeria"],
  ["what-governs-contract-in-nigeria", "What Governs Contracts in Nigeria?"],
  ["obtaining-governor-consent-for-land-transactions", "Obtaining Governor's Consent for Land Transactions in Nigeria"],
  ["the-land-use-and-allocation-committee-luac", "The Land Use and Allocation Committee (LUAC) in Nigeria"],
  ["property-insurance-in-nigeria", "Property Insurance in Nigeria"],
  ["insightful-overview-of-family-law-in-nigeria", "Overview of Family Law in Nigeria"],
  ["who-holds-authority-over-land-under-the-land", "Who Holds Authority Over Land Under the Land Use Act?"],
  ["developer-fails-to-deliver-property", "What to Do When a Developer Fails to Deliver Property"],
  ["how-to-conduct-search-at-land-registry", "How to Conduct a Search at the Land Registry in Nigeria"],
  ["importance-of-covenants-in-a-tenancy-agreement", "Importance of Covenants in a Tenancy Agreement"],
  ["how-to-prove-ownership-of-land-in-nigeria", "How to Prove Ownership of Land in Nigeria"],
  ["step-by-step-guide-on-how-to-conduct-a-statutory-marriage-in-nigeria", "How to Conduct a Statutory Marriage in Nigeria"],
  ["legal-obligations-for-debt-collectors", "Legal Obligations for Debt Collectors in Nigeria"],
  ["challenges-facing-the-nigerian-court-system", "Challenges Facing the Nigerian Court System"],
  [
    "domestic-violence-ground-for-dissolution-of-marriage-and-its-criminal-implications",
    "Domestic Violence as a Ground for Dissolution of Marriage in Nigeria"
  ],
  ["how-do-i-process-survey-plan-approval-in-ogun", "How to Process Survey Plan Approval in Ogun State"],
  ["family-courts-and-specialized-tribunals-2", "Family Courts and Specialized Tribunals in Nigeria"],
  ["immigration-service-in-border-management", "The Role of Immigration Service in Border Management"],
  ["landlord-and-tenant-relationship", "Landlord and Tenant Relationship in Nigeria"],
  ["how-do-i-regularize-land-documents-in-ogun-state", "How to Regularize Land Documents in Ogun State"],
  ["how-to-file-for-child-custody-in-nigeria-a", "How to File for Child Custody in Nigeria"],
  ["rights-of-children-born-outside-wedlock", "Rights of Children Born Outside Wedlock in Nigeria"],
  ["overview-of-statutory-marriage-in-nigeria", "Overview of Statutory Marriage in Nigeria"],
  ["how-to-legally-subdivide-and-develop-land", "How to Legally Subdivide and Develop Land in Nigeria"],
  ["difference-between-a-parent-company-and-a-subsidiary", "Difference Between a Parent Company and a Subsidiary"],
  ["how-to-get-international-passport-in-nigeria", "How to Get an International Passport in Nigeria"],
  ["procedures-for-land-registration-in-nigeria", "Procedures for Land Registration in Nigeria"],
  ["the-le-a-legally-binding-contracts-in-nigeri", "Legally Binding Contracts in Nigeria"],
  ["guide-for-transfer-of-land-ownership-and", "Guide to Transfer of Land Ownership and Land Documents in Nigeria"],
  ["registration-of-deed-of-assignment-in-nigeria", "Registration of Deed of Assignment in Nigeria"],
  ["the-basics-of-statutory-right-of-occupancy", "The Basics of Statutory Right of Occupancy in Nigeria"],
  ["overview-of-citizenship-in-nigeria", "Overview of Citizenship in Nigeria"],
  ["how-to-use-cac-public-search-for-your-business", "How to Use CAC Public Search for Your Business"],
  ["effect-of-witness-as-beneficiary-in-will", "Effect of a Witness as Beneficiary in a Will in Nigeria"],
  ["legal-processofobtaininga-deed-of-assignment", "Legal Process for Obtaining a Deed of Assignment in Nigeria"],
  ["land-tenures-and-customary-land-tenure-systems", "Land Tenures and Customary Land Tenure Systems in Nigeria"],
  ["property-with-existing-tenants-in-nigeria", "Buying Property With Existing Tenants in Nigeria"],
  ["where-marriage-under-the-act-can-be-conducted", "Where Marriage Under the Act Can Be Conducted in Nigeria"],
  ["how-nigerian-courts-handle-electronic-evidence", "How Nigerian Courts Handle Electronic Evidence"],
  ["types-of-company-in-nigeria", "Types of Companies in Nigeria"],
  ["contract-breach-and-remedies", "Contract Breach and Remedies in Nigeria"],
  ["tax-clearance-certificate-in-nigeria", "Tax Clearance Certificate in Nigeria"],
  [
    "legalisation-authentication-of-marriage-certificate-in-nigeria",
    "Legalisation and Authentication of Marriage Certificates in Nigeria"
  ],
  ["what-is-a-deed-of-assent-in-nigeria", "What Is a Deed of Assent in Nigeria?"]
]);

const imageEntryOverrides = new Map([
  [
    "what-are-rights-of-women-to-inheritance-in-nigeria",
    "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/inheritance-right-of-women-A0xb5Kax3GcZLZqP.jpeg"
  ]
]);

const disallowedPattern =
  /chaman properties|chamanproperties|luxury estate|luxury estates|luxury homes|property listing|high-net-worth investors|casino|betting|australian players/i;
const riskyFreePattern = /free legal advice|legal advice for free|get.*legal advice.*free|for free/i;
const placeholderPattern = /lorem ipsum|editable placeholder|editorial placeholder|elementor|\[\/?\w+[^\]]*\]/i;
const legalPriorityPattern =
  /property|land|tenant|landlord|c of o|occupancy|title|court|litigation|injunction|probate|inheritance|family|marriage|divorce|child|immigration|citizenship|residency|company|cac|tax|debt|notary|contract/i;
const manualBlockPattern =
  /track-a-stolen-phone|list-of-government-agencies|drivers-licence|free|casino|betting|spin|xenophobia|data-misuse/i;

function decodeEntities(input = "") {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " ",
    rsquo: "'",
    lsquo: "'",
    rdquo: "\"",
    ldquo: "\"",
    ndash: "-",
    mdash: "-",
    hellip: "...",
    copy: "(c)"
  };
  return String(input)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function cleanText(input = "") {
  return decodeEntities(
    String(input)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(rows, headers) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...body] = rows.filter((line) => line.some((field) => field !== ""));
  return body.map((line) => Object.fromEntries(headers.map((header, index) => [header.trim(), (line[index] || "").trim()])));
}

async function readCsv(filePath) {
  return parseCsv(await fsp.readFile(filePath, "utf8"));
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
        return "\x1a";
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
  let inString = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (inString) {
      if (char === "\\") {
        cell += char + (value[index + 1] ?? "");
        index += 1;
      } else if (char === "'") {
        inString = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === "'") inString = true;
    else if (char === ",") {
      fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
      cell = "";
    } else {
      cell += char;
    }
  }

  fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
  return fields;
}

function tableSuffix(tableName) {
  return tableName.replace(/^.*?_/, "");
}

function normalizeWpDate(date, gmtDate) {
  const source = gmtDate && gmtDate !== "0000-00-00 00:00:00" ? gmtDate : date;
  if (!source || source === "0000-00-00 00:00:00") return new Date().toISOString();
  return `${source.replace(" ", "T")}Z`;
}

function normalizeImageUrl(value) {
  if (!value) return "";
  const url = String(value).trim();
  if (/^https?:\/\//i.test(url)) return url.replace(/^http:\/\//i, "https://");
  if (url.startsWith("/wp-content/")) return `https://chamanlawfirm.com${url}`;
  return "";
}

function archiveEntryFromUploadPath(uploadPath = "") {
  if (!uploadPath) return "";
  const clean = String(uploadPath).replace(/^\/+/, "");
  if (!clean || clean.includes("..")) return "";
  return `./domains/chamanlawfirm.com/public_html/wp-content/uploads/${clean}`;
}

function archiveEntryFromImageUrl(url = "") {
  const match = String(url).match(/\/wp-content\/uploads\/([^?#]+)/i);
  if (!match) return "";
  return archiveEntryFromUploadPath(decodeURIComponent(match[1]));
}

function firstBodyImageUrl(html = "") {
  const match = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return normalizeImageUrl(match?.[1]);
}

function excerptFrom(...values) {
  for (const value of values) {
    const cleaned = cleanText(value);
    if (cleaned) return cleaned.slice(0, 218);
  }
  return "";
}

function rewriteSeoTemplate(value, title) {
  const siteTitle = title || "Chaman Law Firm";
  return cleanText(value)
    .replace(/%title%/gi, siteTitle)
    .replace(/%sitename%/gi, "Chaman Law Firm")
    .replace(/%sep%/gi, "|")
    .slice(0, 220);
}

function blockKey(prefix, slug, index) {
  return `${prefix}-${slugify(slug).slice(0, 18)}-${index}`;
}

function textBlock(text, slug, index, style = "normal", markDefs = [], marks = []) {
  return {
    _type: "block",
    _key: blockKey("block", slug, index),
    style,
    markDefs,
    children: [{ _type: "span", _key: blockKey("span", slug, index), marks, text }]
  };
}

function linkBlock(parts, slug, index) {
  const markDefs = [];
  const children = parts.map((part, childIndex) => {
    const child = { _type: "span", _key: blockKey(`span${childIndex}`, slug, index), marks: [], text: part.text };
    if (part.href) {
      const linkKey = blockKey(`link${childIndex}`, slug, index);
      markDefs.push({ _type: "link", _key: linkKey, href: part.href });
      child.marks = [linkKey];
    }
    return child;
  });
  return { _type: "block", _key: blockKey("linked", slug, index), style: "normal", markDefs, children };
}

function practiceInfo(targetUrl = "", slug = "", title = "", category = "") {
  const haystack = `${targetUrl} ${slug} ${title} ${category}`.toLowerCase();
  if (haystack.includes("family") || haystack.includes("marriage") || haystack.includes("divorce") || haystack.includes("child")) {
    return { title: "Family Law", categoryId: "category.family-law", href: "/practice-areas/family-law" };
  }
  if (haystack.includes("immigration") || haystack.includes("citizenship") || haystack.includes("residency") || haystack.includes("visa")) {
    return { title: "Immigration Services", categoryId: "category.immigration-services", href: "/practice-areas/immigration-services" };
  }
  if (haystack.includes("corporate") || haystack.includes("company") || haystack.includes("tax") || haystack.includes("consumer") || haystack.includes("cac") || haystack.includes("contract")) {
    return { title: "Corporate and Commercial Law", categoryId: "category.corporate-and-commercial-law", href: "/practice-areas/corporate-commercial-law" };
  }
  if (haystack.includes("debt")) {
    return { title: "Debt Recovery", categoryId: "category.debt-recovery", href: "/practice-areas/debt-recovery" };
  }
  if (haystack.includes("litigation") || haystack.includes("court") || haystack.includes("injunction") || haystack.includes("joinder") || haystack.includes("bail")) {
    return { title: "Litigation and Dispute Resolution", categoryId: "category.litigation-and-dispute-resolution", href: "/practice-areas/litigation-dispute-resolution" };
  }
  if (haystack.includes("probate") || haystack.includes("inheritance") || haystack.includes("estate")) {
    return { title: "Probate and Estate Administration", categoryId: "category.probate-estate-administration", href: "/practice-areas/probate-estate-administration" };
  }
  if (haystack.includes("notary") || haystack.includes("deed-poll") || haystack.includes("document")) {
    return { title: "Notary Public", categoryId: "category.notary-public", href: "/practice-areas/notary-public" };
  }
  return { title: "Property and Real Estate Law", categoryId: "category.property-and-real-estate-law", href: "/practice-areas/property-real-estate-law" };
}

function portableTextFromWordPress(html, title, slug, practiceHref) {
  const cleaned = String(html || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[caption[^\]]*\]/gi, " ")
    .replace(/\[\/caption\]/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  const blocks = [];
  let index = 1;
  blocks.push(
    textBlock(
      `Quick answer: ${title} is a public legal-education guide. The correct legal step may depend on the facts, documents, location, timing, and current law, so readers should seek tailored legal advice before acting.`,
      slug,
      index++
    )
  );
  blocks.push(textBlock("This article is provided for general legal education only and is not a substitute for advice on a specific matter.", slug, index++));

  const tagRegex = /<(h[1-4]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = tagRegex.exec(cleaned))) {
    const tag = match[1].toLowerCase();
    const text = cleanText(match[2]);
    if (!text || disallowedPattern.test(text)) continue;
    const style = tag.startsWith("h") ? tag : tag === "blockquote" ? "blockquote" : "normal";
    const block = textBlock(text, slug, index++, style);
    if (tag === "li") block.listItem = "bullet";
    blocks.push(block);
  }

  if (blocks.length <= 2) {
    const fallback = cleanText(cleaned);
    if (fallback) blocks.push(textBlock(fallback, slug, index++));
  }

  blocks.push(textBlock("When to speak with a lawyer", slug, index++, "h2"));
  blocks.push(
    linkBlock(
      [
        { text: "Speak with Chaman Law Firm before taking a step that may affect your rights, property, business, family, or dispute position. You can " },
        { text: "book a consultation", href: "/consultation" },
        { text: " or review the relevant " },
        { text: "practice area", href: practiceHref },
        { text: " for more context." }
      ],
      slug,
      index++
    )
  );

  return blocks.slice(0, 120);
}

async function extractWordPressData(sqlPath, wantedSlugs) {
  const wanted = new Set(wantedSlugs);
  const postsBySlug = new Map();
  const postIds = new Set();
  const metaByPostId = new Map();
  const attachmentsById = new Map();
  let activeTable = null;

  const rl = readline.createInterface({
    input: fs.createReadStream(sqlPath).pipe(zlib.createGunzip({ finishFlush: zlib.constants.Z_SYNC_FLUSH })),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const insert = line.match(/^INSERT INTO `([^`]+)` VALUES/);
    if (insert) {
      activeTable = tableSuffix(insert[1]);
      continue;
    }
    if (!activeTable || !line.startsWith("(")) continue;
    const row = parseMysqlTuple(line);

    if (activeTable === "posts") {
      const post = {
        ID: Number(row[0]),
        post_author: Number(row[1]),
        post_date: row[2],
        post_date_gmt: row[3],
        post_content: row[4] || "",
        post_title: row[5] || "",
        post_excerpt: row[6] || "",
        post_status: row[7] || "",
        post_name: row[11] || "",
        post_modified: row[14] || "",
        post_modified_gmt: row[15] || "",
        guid: row[18] || "",
        post_type: row[20] || ""
      };
      if (wanted.has(post.post_name) && ["post", "page"].includes(post.post_type) && ["publish", "draft"].includes(post.post_status)) {
        postsBySlug.set(post.post_name, post);
        postIds.add(post.ID);
      }
      if (post.post_type === "attachment") attachmentsById.set(post.ID, post);
    }

    if (activeTable === "postmeta") {
      const postId = Number(row[1]);
      if (postIds.has(postId) || attachmentsById.has(postId)) {
        if (!metaByPostId.has(postId)) metaByPostId.set(postId, {});
        metaByPostId.get(postId)[row[2]] = row[3] || "";
      }
    }

    if (line.trim().endsWith(";")) activeTable = null;
  }

  return { postsBySlug, metaByPostId, attachmentsById };
}

function rankMathBySlug(rows) {
  const map = new Map();
  for (const row of rows) {
    if (row.slug) map.set(row.slug.trim().toLowerCase(), row);
  }
  return map;
}

function parseRedirects(configText) {
  const map = new Map();
  const regex = /\{\s*source:\s*"([^"]+)",\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(configText))) map.set(match[1].replace(/\/$/, ""), match[2]);
  return map;
}

function titleFrom(post, rank, inventoryTitle) {
  return cleanText(inventoryTitle || rank?.seo_title || post?.post_title || "").replace(/\s+\|\s+Chaman Law Firm$/i, "");
}

function safeExcerpt(post, rank, title) {
  const value = excerptFrom(rank?.seo_description, post?.post_excerpt, post?.post_content);
  if (value && value.length >= 80) return value;
  return `Learn key Nigerian legal issues in ${title}, including practical risks, documentation, deadlines, and when to seek advice from Chaman Law Firm.`;
}

function imageCandidatesFor(post, rank, wpData) {
  const meta = wpData.metaByPostId.get(post.ID) || {};
  const thumbnailId = Number(meta._thumbnail_id || 0);
  const attachment = thumbnailId ? wpData.attachmentsById.get(thumbnailId) : null;
  const attachmentMeta = thumbnailId ? wpData.metaByPostId.get(thumbnailId) || {} : {};
  const attachedFile = attachmentMeta._wp_attached_file || "";
  const urls = [
    attachedFile ? `https://chamanlawfirm.com/wp-content/uploads/${attachedFile}` : "",
    normalizeImageUrl(attachment?.guid),
    normalizeImageUrl(rank?.social_facebook_thumbnail),
    normalizeImageUrl(rank?.social_twitter_thumbnail),
    firstBodyImageUrl(post.post_content)
  ].filter(Boolean);
  const entries = [
    attachedFile ? archiveEntryFromUploadPath(attachedFile) : "",
    ...urls.map(archiveEntryFromImageUrl)
  ].filter(Boolean);
  return {
    thumbnailId,
    attachment,
    attachmentMeta,
    originalUrl: urls[0] || "",
    entries: [...new Set(entries)]
  };
}

function safetyReview({ post, bodyText, seoDescription, imageEntry }) {
  const errors = [];
  const warnings = [];
  const combined = `${post.post_title} ${post.post_content} ${seoDescription}`.toLowerCase();

  if (!cleanText(post.post_content) || cleanText(post.post_content).length < 900) errors.push("Body is too thin for approval.");
  if (disallowedPattern.test(combined)) errors.push("Disallowed Chaman Properties, luxury, casino, or off-brand signal detected.");
  if (riskyFreePattern.test(combined)) errors.push("Misleading free-service language requires manual revision.");
  if (/self[-\s]?help eviction|forceful eviction|lock(?:ing)? out/i.test(combined)) errors.push("Possible eviction self-help language requires lawyer review.");
  if (placeholderPattern.test(combined)) errors.push("Placeholder/plugin debris requires cleanup.");
  if (!seoDescription || seoDescription.length < 100) warnings.push("Meta description may need improvement.");
  if (!imageEntry) warnings.push("No recoverable article-specific image found.");
  if (!/consultation|speak with|legal advice|lawyer/i.test(bodyText)) warnings.push("Legacy body lacks consultation/legal-advice context; migration CTA added.");

  return { errors, warnings };
}

function buildDoc(row, post, rank, wpData, imageAssetId = "", imageAlt = "") {
  const slug = row["old slug"];
  const info = practiceInfo(row["current redirect target"] || row["proposed new URL"], slug, row["old title"], row.category);
  const meta = wpData.metaByPostId.get(post.ID) || {};
  const imageInfo = imageCandidatesFor(post, rank, wpData);
  const title = titleOverrides.get(slug) || titleFrom(post, rank, row["old title"] || row.title);
  const body = portableTextFromWordPress(post.post_content, title, slug, info.href);
  const bodyText = body.map((item) => item.children?.map((child) => child.text).join("") || "").join(" ");
  const excerpt = safeExcerpt(post, rank, title).slice(0, 218);
  const seoTitle = rewriteSeoTemplate(rank?.seo_title || meta.rank_math_title || row["old SEO title"] || title, title);
  const seoDescription = rewriteSeoTemplate(rank?.seo_description || meta.rank_math_description || row["old meta description"] || row["meta description"] || excerpt, title);
  const keywords = [
    ...(rank?.focus_keyword || meta.rank_math_focus_keyword || "")
      .split(/[,|;]/)
      .map((item) => cleanText(item))
      .filter(Boolean),
    info.title,
    "Chaman Law Firm"
  ].slice(0, 12);
  const chosenAlt =
    imageAlt ||
    cleanText(imageInfo.attachmentMeta?._wp_attachment_image_alt || imageInfo.attachment?.post_title || `${title} legal guide | Chaman Law Firm`);
  const mainImage = imageAssetId ? { _type: "image", asset: { _type: "reference", _ref: imageAssetId }, alt: chosenAlt } : undefined;
  const doc = {
    _id: `${DRAFT_PREFIX}${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [{ _key: `cat-${slugify(info.title)}`, _type: "reference", _ref: info.categoryId }],
    tags: keywords,
    isFeatured: false,
    isTrending: false,
    isMostRead: false,
    lawFirmApproved: false,
    publishedAt: normalizeWpDate(post.post_date, post.post_date_gmt),
    body,
    faqs: [
      {
        _key: `faq-${slug}-1`,
        question: `What is the main point of ${title}?`,
        answer: "The main point is to understand the legal issue early, keep relevant documents, and seek tailored advice before taking steps that affect rights or obligations."
      },
      {
        _key: `faq-${slug}-2`,
        question: "Is this article legal advice?",
        answer: "No. It is general legal education. A lawyer should review the facts and documents before advice is applied to a specific matter."
      }
    ],
    seo: {
      metaTitle: seoTitle,
      metaDescription: seoDescription,
      keywords,
      canonicalUrl: `https://chamanlawfirm.com/resources/blog/${slug}`,
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article",
      openGraphTitle: seoTitle,
      openGraphDescription: seoDescription,
      ...(mainImage ? { openGraphImage: mainImage } : {}),
      aeoKeywords: keywords,
      geoKeywords: keywords.filter((keyword) => /(nigeria|lagos|ogun|diaspora)/i.test(keyword))
    },
    ...(mainImage ? { mainImage } : {})
  };

  const review = safetyReview({ post, bodyText, seoDescription, imageEntry: imageInfo.selectedEntry });
  return { doc, info, imageInfo, imageAlt: chosenAlt, bodyText, review, seoTitle, seoDescription };
}

function candidateAllowed(row) {
  const slug = row["old slug"] || row["proposed slug"] || "";
  const title = row.title || row["old title"] || "";
  const decision = row["migration decision"] || "";
  const proposed = row["proposed new URL"] || "";
  if (!slug || slug === "blog" || slug === "2") return false;
  if (!proposed.startsWith("/resources/blog/")) return false;
  if (/redirect only|archive candidate|not article/i.test(decision)) return false;
  if (manualBlockPattern.test(`${slug} ${title}`)) return false;
  if (!legalPriorityPattern.test(`${slug} ${title} ${row["practice area"] || ""} ${row.category || ""}`)) return false;
  return true;
}

function isExtractableImageEntry(entry) {
  const haystack = entry.toLowerCase();
  if (/[^\x00-\x7F]/.test(entry)) return 0;
  if (!/\.(jpe?g|png|webp)$/i.test(haystack)) return 0;
  if (!haystack.includes("/wp-content/uploads/")) return 0;
  if (/canada|trademark|cybersecurity|education|placeholder|logo|favicon/i.test(haystack)) return 0;
  return true;
}

function imageEntryScore(entry, item) {
  const haystack = entry.toLowerCase();
  if (!isExtractableImageEntry(entry)) return 0;
  const titleTokens = slugify(item.row["old title"] || item.post.post_title || "")
    .split("-")
    .filter((token) => token.length >= 4);
  const slugTokens = item.row["old slug"]
    .split("-")
    .filter((token) => token.length >= 4)
    .filter((token) => !["what", "when", "where", "with", "from", "under", "nigeria", "legal", "lawyer", "chaman", "firm", "powerful", "steps"].includes(token));
  const tokens = [...new Set([...slugTokens, ...titleTokens])];
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += token.length >= 8 ? 3 : 1;
  }
  if (/-80x80\./i.test(haystack)) score -= 8;
  if (/-1200x|-1170x|-1024x|-768x|\.webp$/i.test(haystack)) score += 2;
  if (/\.bk\.|updraft-pre-smush|placeholder|logo|favicon/i.test(haystack)) score -= 4;
  return score;
}

async function findArchiveImageEntries(entries, items) {
  const wanted = new Set(entries.filter(Boolean));
  const found = new Set();
  const heuristic = new Map();
  const bestScores = new Map();

  await new Promise((resolve, reject) => {
    const child = spawn("tar", ["-tf", tarGzPath], { stdio: ["ignore", "pipe", "pipe"] });
    let errorText = "";
    const rl = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
    rl.on("line", (line) => {
      const entry = line.trim();
      if (wanted.has(entry) && isExtractableImageEntry(entry)) found.add(entry);
      if (isExtractableImageEntry(entry)) {
        for (const item of items) {
          const slug = item.row["old slug"];
          if (heuristic.has(slug)) {
            const currentScore = bestScores.get(slug) || 0;
            const score = imageEntryScore(entry, item);
            if (score > currentScore) {
              heuristic.set(slug, entry);
              bestScores.set(slug, score);
            }
          } else {
            const score = imageEntryScore(entry, item);
            if (score >= 5) {
              heuristic.set(slug, entry);
              bestScores.set(slug, score);
            }
          }
        }
      }
    });
    child.stderr.on("data", (chunk) => {
      errorText += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code && code !== 1 && found.size === 0) reject(new Error(errorText || `tar exited with ${code}`));
      else resolve();
    });
  });

  return { found, heuristic };
}

function extractedPathFor(entry) {
  return path.join(extractedImageRoot, entry.replace(/^\.\//, "").replace(/\//g, path.sep));
}

async function maybeStat(filePath) {
  try {
    return await fsp.stat(filePath);
  } catch {
    return null;
  }
}

async function ensureSelectedImagesExtracted(entries) {
  const uniqueEntries = [...new Set(entries)];
  const missing = [];
  for (const entry of uniqueEntries) {
    if (!(await maybeStat(extractedPathFor(entry)))) missing.push(entry);
  }
  if (!missing.length) return;
  await fsp.mkdir(extractedImageRoot, { recursive: true });
  await execFileAsync("tar", ["-xf", tarGzPath, "-C", extractedImageRoot, ...missing], { maxBuffer: 1024 * 1024 });
}

function contentTypeFor(entry) {
  const ext = path.extname(entry).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpeg" || ext === ".jpg") return "image/jpeg";
  return "application/octet-stream";
}

function filenameFor(entry) {
  return path.basename(entry).replace(/[^\w.-]+/g, "-");
}

async function ensureImageAsset(client, row) {
  if (!row.imageEntry) return null;
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && source.name == $sourceName && source.id == $sourceId][0]{_id}',
    { sourceName: SOURCE_NAME, sourceId: row.imageEntry }
  );
  if (existing?._id) return { assetId: existing._id, status: "existing_asset_reused" };

  const buffer = await fsp.readFile(extractedPathFor(row.imageEntry));
  const asset = await client.assets.upload("image", buffer, {
    filename: filenameFor(row.imageEntry),
    contentType: contentTypeFor(row.imageEntry),
    title: row.imageAlt,
    source: { name: SOURCE_NAME, id: row.imageEntry, url: row.imageUrl || row.imageEntry }
  });
  return { assetId: asset._id, status: "uploaded" };
}

async function sanityState(client) {
  const [approved, hiddenDrafts] = await Promise.all([
    client.fetch('*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))]{_id,title,"slug":slug.current,author->{name},mainImage{alt,asset->{_id}}}'),
    client.fetch(`*[_type == "post" && lawFirmApproved != true && _id in path("drafts.chamanlawfirm.sprint10i.*")] | order(slug.current asc) {
      _id,
      title,
      "slug": slug.current,
      lawFirmApproved,
      author->{name},
      mainImage{alt,asset->{_id}},
      seo{metaTitle,metaDescription,canonicalUrl},
      body
    }`)
  ]);
  return { approved, hiddenDrafts };
}

function reviewHiddenDrafts(drafts, redirectMap) {
  return drafts
    .filter((draft) => draft.lawFirmApproved !== true)
    .map((draft) => {
      const text = Array.isArray(draft.body) ? draft.body.map((block) => block.children?.map((child) => child.text).join("") || "").join(" ") : "";
      const errors = [];
      const combined = `${draft.title} ${draft.seo?.metaTitle || ""} ${draft.seo?.metaDescription || ""} ${text}`;
      const bodyNeedsRecovery = !Array.isArray(draft.body) || draft.body.length < 20 || text.length < 900;
      const imageMissing = !draft.mainImage?.asset?._id;
      const altMissing = !draft.mainImage?.alt;
      const metadataIncomplete = !draft.seo?.metaTitle || !draft.seo?.metaDescription || !draft.seo?.canonicalUrl;
      const offBrand = disallowedPattern.test(combined);
      const riskyFree = riskyFreePattern.test(combined);
      const placeholder = placeholderPattern.test(combined);
      const evictionRisk = /self-help|forceful|forcibly|lock(?:ed)? out|throw out|eject|evict/i.test(combined) && /tenant|premises|quit notice|recovery of premises/i.test(combined);
      const sourceConfidence = bodyNeedsRecovery
        ? "low - body recovery needed"
        : imageMissing || metadataIncomplete
          ? "medium - source body present; asset/metadata needs completion"
          : "high - source body, metadata, and image evidence present";

      if (bodyNeedsRecovery) errors.push("body recovery/formatting cleanup needed");
      if (imageMissing) errors.push("article-specific image missing");
      if (altMissing) errors.push("alt text missing");
      if (metadataIncomplete) errors.push("SEO metadata incomplete");
      if (offBrand) errors.push("off-brand content signal");
      if (riskyFree) errors.push("misleading free-service wording");
      if (placeholder) errors.push("placeholder/plugin debris");
      if (evictionRisk) errors.push("eviction/self-help legal wording requires lawyer review");

      const slug = draft.slug || "";
      let recommendedAction = "ready for controlled approval review";
      if (offBrand) recommendedAction = "reject/archive from active restoration queue";
      else if (placeholder || bodyNeedsRecovery) recommendedAction = "needs body recovery";
      else if (riskyFree || evictionRisk) recommendedAction = "needs legal wording cleanup";
      else if (metadataIncomplete) recommendedAction = "needs metadata cleanup";
      else if (imageMissing || altMissing) recommendedAction = "ready for image completion";

      return {
        title: draft.title,
        slug,
        "old URL": `https://chamanlawfirm.com/${slug}/`,
        "current redirect target": redirectMap.get(`/${slug}`) || "not currently mapped",
        "body status": bodyNeedsRecovery ? "needs body recovery" : `${draft.body.length} blocks`,
        "image status": imageMissing ? "missing" : altMissing ? "image present; alt missing" : "present with alt",
        "metadata status": metadataIncomplete ? "needs metadata cleanup" : "complete",
        "legal safety status": offBrand || riskyFree || placeholder || evictionRisk ? "needs lawyer/legal cleanup" : "passes automated screen",
        "duplicate/cannibalization risk": bodyNeedsRecovery ? "thin/body completeness review needed" : "no obvious thin risk",
        "source confidence": sourceConfidence,
        "recommended action": recommendedAction,
        "approval readiness": errors.length ? "keep hidden" : "ready for manual approval consideration",
        notes: errors.join("; ")
      };
    });
}

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({ perspective: "raw" });
  await fsp.mkdir(outDir, { recursive: true });

  const [topRows, rankRows, nextConfigText, sprint10iResultText] = await Promise.all([
    readCsv(top1000Path),
    readCsv(rankMathPath),
    fsp.readFile(nextConfigPath, "utf8"),
    fsp.readFile(sprint10iResultPath, "utf8").catch(() => "{}")
  ]);
  const redirectMap = parseRedirects(nextConfigText);
  const rankMap = rankMathBySlug(rankRows);
  const state = await sanityState(client);
  const approvedSlugs = new Set(state.approved.map((doc) => doc.slug).filter(Boolean));
  const sprint10iKeptHiddenSlugs = new Set((JSON.parse(sprint10iResultText).keptHidden || []).map((item) => item.slug).filter(Boolean));
  const sprint10iHiddenDrafts = state.hiddenDrafts.filter((doc) => doc.slug && sprint10iKeptHiddenSlugs.has(doc.slug));
  const sprint10iHiddenSlugs = new Set(sprint10iHiddenDrafts.map((doc) => doc.slug).filter(Boolean));

  const hiddenReviewRows = reviewHiddenDrafts(sprint10iHiddenDrafts, redirectMap);
  await fsp.writeFile(
    hiddenReviewPath,
    `${writeCsv(hiddenReviewRows, [
      "title",
      "slug",
      "old URL",
      "current redirect target",
      "body status",
      "image status",
      "metadata status",
      "legal safety status",
      "duplicate/cannibalization risk",
      "source confidence",
      "recommended action",
      "approval readiness",
      "notes"
    ])}\n`,
    "utf8"
  );

  const rawCandidates = topRows
    .filter(candidateAllowed)
    .filter((row) => !approvedSlugs.has(row["old slug"]) || controlledApprovalSlugs.includes(row["old slug"]))
    .filter((row) => !sprint10iHiddenSlugs.has(row["old slug"]) || controlledApprovalSlugs.includes(row["old slug"]))
    .slice(0, 180)
    .map((row) => ({
      ...row,
      "current redirect target": redirectMap.get(`/${row["old slug"]}`) || "",
      "old title": row.title || row["old title"] || "",
      "old SEO title": row["SEO title"] || "",
      "old meta description": row["meta description"] || ""
    }));

  const wpData = await extractWordPressData(sqlGzPath, rawCandidates.map((row) => row["old slug"]));
  const prepared = [];
  const imageEntryCandidates = [];

  for (const row of rawCandidates) {
    const slug = row["old slug"];
    const post = wpData.postsBySlug.get(slug);
    const rank = rankMap.get(slug) || {};
    if (!post) continue;
    const imageInfo = imageCandidatesFor(post, rank, wpData);
    imageEntryCandidates.push(...imageInfo.entries);
    prepared.push({ row, post, rank, imageInfo });
    if (prepared.length >= selectionLimit) break;
  }
  imageEntryCandidates.push(...imageEntryOverrides.values());

  const archiveMatches = await findArchiveImageEntries([...new Set(imageEntryCandidates)], prepared);
  for (const item of prepared) {
    const overrideEntry = imageEntryOverrides.get(item.row["old slug"]) || "";
    item.imageInfo.selectedEntry =
      (overrideEntry && archiveMatches.found.has(overrideEntry) && isExtractableImageEntry(overrideEntry) ? overrideEntry : "") ||
      item.imageInfo.entries.find((entry) => archiveMatches.found.has(entry) && isExtractableImageEntry(entry)) ||
      archiveMatches.heuristic.get(item.row["old slug"]) ||
      "";
    item.imageInfo.selectedUrl =
      item.imageInfo.selectedEntry ? `https://chamanlawfirm.com/${item.imageInfo.selectedEntry.split("/public_html/")[1]}` : "";
  }

  const selected = prepared.slice(0, selectionLimit);
  const draftItems = selected.slice(0, draftLimit);
  if (shouldApply) {
    const entriesToExtract = draftItems.map((item) => item.imageInfo.selectedEntry).filter(Boolean);
    await ensureSelectedImagesExtracted(entriesToExtract);
    await client.createIfNotExists({ _id: AUTHOR_ID, _type: "author", name: AUTHOR_NAME, slug: { _type: "slug", current: "charles-chukwuma-nkwoka" } });
  }

  const docs = [];
  const imageRows = [];
  const selectionRows = [];
  const approvalCandidates = [];
  const imageResults = new Map();

  for (const [index, item] of selected.entries()) {
    const { row, post, rank, imageInfo } = item;
    const slug = row["old slug"];
    const altTitle = titleOverrides.get(slug) || row["old title"] || post.post_title;
    const imageAlt = cleanText(`${altTitle} legal guide | Chaman Law Firm`);
    let assetResult = null;
    if (shouldApply && index < draftLimit && imageInfo.selectedEntry) {
      assetResult = await ensureImageAsset(client, { imageEntry: imageInfo.selectedEntry, imageAlt, imageUrl: imageInfo.selectedUrl });
      imageResults.set(slug, assetResult);
    }
    const built = buildDoc(row, post, rank, wpData, assetResult?.assetId || "", imageAlt);
    const review = safetyReview({ post, bodyText: built.bodyText, seoDescription: built.seoDescription, imageEntry: imageInfo.selectedEntry });
    const readyForApproval =
      index < draftLimit &&
      review.errors.length === 0 &&
      built.doc.body.length >= 12 &&
      built.seoDescription.length >= 100 &&
      Boolean(imageInfo.selectedEntry) &&
      Boolean(assetResult?.assetId || !shouldApply);

    if (index < draftLimit) docs.push({ built, row, post, imageInfo, imageAlt, assetResult, readyForApproval, review });
    if (readyForApproval) approvalCandidates.push({ built, row, post, imageInfo, imageAlt, assetResult, review });

    selectionRows.push({
      "priority rank": index + 1,
      "legacy post ID": post.ID,
      "old URL": row["old URL"],
      "old slug": slug,
      "old title": built.doc.title,
      "old SEO title": built.seoTitle,
      "old meta description": built.seoDescription,
      clicks: row.clicks,
      impressions: row.impressions,
      "current production status": approvedSlugs.has(slug) ? "already public" : "selected for Sprint 10J recovery",
      "current redirect target": row["current redirect target"] || "not currently redirected",
      "content recovered yes/no": "yes",
      "image recovered yes/no": imageInfo.selectedEntry ? "yes" : "no",
      "proposed Sanity slug": slug,
      "proposed public URL": `/resources/blog/${slug}`,
      "approval status": readyForApproval ? "candidate for controlled approval" : "hidden draft only",
      "redirect replacement status": readyForApproval ? "pending exact article redirect after approval" : "do not replace while hidden",
      notes: review.errors.length ? review.errors.join("; ") : review.warnings.join("; ")
    });

    imageRows.push({
      "old URL": row["old URL"],
      "post title": built.doc.title,
      "image source": imageInfo.selectedEntry || imageInfo.originalUrl || "",
      "image found yes/no": imageInfo.selectedEntry ? "yes" : "no",
      "Sanity image asset": assetResult?.assetId || "",
      "alt text": imageAlt,
      "fallback used yes/no": "no",
      notes: imageInfo.selectedEntry ? assetResult?.status || "ready for upload" : "image not found in archive from SQL/RankMath/body evidence"
    });
  }

  const controlledApprovalSet = new Set(controlledApprovalSlugs);
  const approvedThisRun = approvalCandidates
    .filter((item) => controlledApprovalSet.has(item.row["old slug"]))
    .sort((a, b) => controlledApprovalSlugs.indexOf(a.row["old slug"]) - controlledApprovalSlugs.indexOf(b.row["old slug"]))
    .slice(0, approvalLimit);
  if (shouldApply) {
    const categories = new Map();
    for (const item of docs) {
      for (const ref of item.built.doc.categories || []) {
        const title = ref._ref.replace(/^category\./, "").replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        categories.set(ref._ref, { _id: ref._ref, _type: "category", title, slug: { _type: "slug", current: ref._ref.replace(/^category\./, "") }, description: `Legal article category for ${title}.` });
      }
    }
    for (const category of categories.values()) await client.createIfNotExists(category);

    for (const item of docs) {
      const draftDoc = { ...item.built.doc, lawFirmApproved: false };
      await client.createOrReplace(draftDoc);
    }

    for (const item of approvedThisRun) {
      const slug = item.row["old slug"];
      const publicDoc = {
        ...item.built.doc,
        _id: `${PUBLIC_PREFIX}${slug}`,
        lawFirmApproved: true,
        author: { _type: "reference", _ref: AUTHOR_ID }
      };
      delete publicDoc._rev;
      delete publicDoc._updatedAt;
      delete publicDoc._createdAt;
      await client.createOrReplace(publicDoc);
      await client.patch(`${DRAFT_PREFIX}${slug}`).set({ lawFirmApproved: true }).commit();
    }
  }

  await fsp.writeFile(
    selectionCsvPath,
    `${writeCsv(selectionRows, [
      "priority rank",
      "legacy post ID",
      "old URL",
      "old slug",
      "old title",
      "old SEO title",
      "old meta description",
      "clicks",
      "impressions",
      "current production status",
      "current redirect target",
      "content recovered yes/no",
      "image recovered yes/no",
      "proposed Sanity slug",
      "proposed public URL",
      "approval status",
      "redirect replacement status",
      "notes"
    ])}\n`,
    "utf8"
  );
  await fsp.writeFile(
    imageMapPath,
    `${writeCsv(imageRows, ["old URL", "post title", "image source", "image found yes/no", "Sanity image asset", "alt text", "fallback used yes/no", "notes"])}\n`,
    "utf8"
  );

  const refreshedState = await sanityState(client);
  const result = {
    generatedAt: new Date().toISOString(),
    applied: shouldApply,
    approvedPublicPostCountBefore: state.approved.length,
    approvedPublicPostCountAfter: refreshedState.approved.length,
    hiddenDraftsReviewed: hiddenReviewRows.length,
    selected: selectionRows.length,
    draftsRecoveredOrRefreshed: docs.length,
    approvalCandidates: approvalCandidates.length,
    approvalCandidateSlugs: approvalCandidates.map((item) => ({
      slug: item.row["old slug"],
      title: item.built.doc.title,
      oldUrl: item.row["old URL"],
      currentRedirectTarget: item.row["current redirect target"] || "",
      imageEntry: item.imageInfo.selectedEntry || "",
      warnings: item.review.warnings
    })),
    approvedThisRun: approvedThisRun.map((item) => ({
      slug: item.row["old slug"],
      oldUrl: item.row["old URL"],
      newUrl: `/resources/blog/${item.row["old slug"]}`,
      title: item.built.doc.title,
      imageAssetId: item.assetResult?.assetId || ""
    })),
    keptHidden: docs
      .filter((item) => !approvedThisRun.some((approved) => approved.row["old slug"] === item.row["old slug"]))
      .map((item) => ({ slug: item.row["old slug"], reason: item.review.errors.join("; ") || "not in controlled approval subset" })),
    files: {
      hiddenReviewPath,
      selectionCsvPath,
      imageMapPath,
      resultJsonPath
    }
  };
  await fsp.writeFile(resultJsonPath, JSON.stringify(result, null, 2), "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Sprint 10H pipeline failed: ${error?.message || String(error)}`);
  process.exit(1);
});
