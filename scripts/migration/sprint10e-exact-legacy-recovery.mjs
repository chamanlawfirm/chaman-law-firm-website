import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import zlib from "node:zlib";
import { getCliClient } from "sanity/cli";

const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const DOC_PREFIX = "drafts.chamanlawfirm.sprint10e.";

const oldFooterPattern =
  /chamanlawfirm@gmail\.com|08065553671|0806\s*555|080242|080968|nigerian lawyers cent|written by\s*chaman law firm team|for more enquiry|115,\s*obafemi|your right,\s*we protect|book a consultation now:www/i;
const disallowedPattern =
  /chaman properties|chamanproperties|luxury estate|luxury estates|luxury homes|property listing|high-net-worth investors|casino|betting|australian players/i;
const riskyFreePattern = /free legal advice|legal advice for free|for free/i;

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const shouldImport = process.argv.includes("--import");
const shouldApprove = process.argv.includes("--approve");
const dumpPath = argValue("--dump");
const rankMathPath = argValue("--rankmath");
const inventoryPath = argValue("--inventory", "docs/SPRINT-10D-DEEP-LEGACY-404-INVENTORY.csv");
const outDir = argValue("--out", "docs/sprint10e");
const selectionPath = argValue("--selection", "docs/SPRINT-10E-EXACT-RECOVERY-SELECTION.csv");
const selectionLimit = Number(argValue("--selection-limit", "25"));
const draftLimit = Number(argValue("--draft-limit", "20"));
const approvalLimit = Number(argValue("--approval-limit", "0"));

if (!dumpPath || !rankMathPath) {
  console.error(
    "Usage: npx sanity exec scripts/migration/sprint10e-exact-legacy-recovery.mjs --with-user-token -- --dump <wp.sql.gz> --rankmath <rankmath.csv> [--import]"
  );
  process.exit(1);
}

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
    } else if (char !== "\r") cell += char;
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
    children: [
      {
        _type: "span",
        _key: blockKey("span", slug, index),
        marks,
        text
      }
    ]
  };
}

function linkBlock(parts, slug, index) {
  const markDefs = [];
  const children = parts.map((part, childIndex) => {
    const child = {
      _type: "span",
      _key: blockKey(`span${childIndex}`, slug, index),
      marks: [],
      text: part.text
    };
    if (part.href) {
      const linkKey = blockKey(`link${childIndex}`, slug, index);
      markDefs.push({ _type: "link", _key: linkKey, href: part.href });
      child.marks = [linkKey];
    }
    return child;
  });

  return {
    _type: "block",
    _key: blockKey("linked", slug, index),
    style: "normal",
    markDefs,
    children
  };
}

function practiceInfo(targetUrl = "", slug = "") {
  const haystack = `${targetUrl} ${slug}`.toLowerCase();
  if (haystack.includes("family")) return { title: "Family Law", categoryId: "category.family-law", href: "/practice-areas/family-law" };
  if (haystack.includes("immigration") || haystack.includes("citizenship") || haystack.includes("residency")) {
    return { title: "Immigration Services", categoryId: "category.immigration-services", href: "/practice-areas/immigration-services" };
  }
  if (haystack.includes("corporate") || haystack.includes("company") || haystack.includes("tax") || haystack.includes("consumer")) {
    return { title: "Corporate and Commercial Law", categoryId: "category.corporate-and-commercial-law", href: "/practice-areas/corporate-commercial-law" };
  }
  if (haystack.includes("litigation") || haystack.includes("court") || haystack.includes("injunction") || haystack.includes("joinder")) {
    return { title: "Litigation and Dispute Resolution", categoryId: "category.litigation-and-dispute-resolution", href: "/practice-areas/litigation-dispute-resolution" };
  }
  if (haystack.includes("probate") || haystack.includes("inheritance")) {
    return { title: "Probate and Estate Administration", categoryId: "category.probate-and-estate-administration", href: "/practice-areas/probate-estate-administration" };
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
  const quickAnswer =
    `Quick answer: ${title} is a public legal-education guide. The correct legal step may depend on the facts, documents, location, timing, and current law, so readers should seek tailored legal advice before acting.`;
  blocks.push(textBlock(quickAnswer, slug, index++));
  blocks.push(textBlock("This article is provided for general legal education only and is not a substitute for advice on a specific matter.", slug, index++));

  const tagRegex = /<(h[1-4]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = tagRegex.exec(cleaned))) {
    const tag = match[1].toLowerCase();
    const text = cleanText(match[2]);
    if (!text || oldFooterPattern.test(text) || disallowedPattern.test(text)) continue;
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

      if (post.post_type === "attachment") {
        attachmentsById.set(post.ID, post);
      }
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

function titleFrom(post, rank, inventoryTitle) {
  return cleanText(inventoryTitle || rank?.seo_title || post?.post_title || "").replace(/\s+\|\s+Chaman Law Firm$/i, "");
}

function safeExcerpt(post, rank, title) {
  const value = excerptFrom(rank?.seo_description, post?.post_excerpt, post?.post_content);
  if (value && value.length >= 80) return value;
  return `Learn key Nigerian legal issues in ${title}, including practical risks, documentation, deadlines, and when to seek advice from Chaman Law Firm.`;
}

function safetyReview({ post, bodyText, seoDescription, imageUrl }) {
  const errors = [];
  const warnings = [];
  const combined = `${post.post_title} ${post.post_content} ${seoDescription}`.toLowerCase();

  if (!cleanText(post.post_content) || cleanText(post.post_content).length < 800) errors.push("Body is too thin for approval.");
  if (disallowedPattern.test(combined)) errors.push("Disallowed Chaman Properties, luxury, casino, or off-brand signal detected.");
  if (riskyFreePattern.test(combined)) errors.push("Misleading free-service language requires manual revision.");
  if (/self[-\s]?help eviction|forceful eviction|lock(?:ing)? out/i.test(combined)) {
    errors.push("Possible eviction self-help language requires lawyer review.");
  }
  if (!seoDescription || seoDescription.length < 100) warnings.push("Meta description may need improvement.");
  if (!imageUrl) warnings.push("No recoverable image source found; approved fallback image is recommended before publication.");
  if (!/consultation|speak with|legal advice|lawyer/i.test(bodyText)) warnings.push("Legacy body lacks consultation/legal-advice context; migration CTA added.");

  return { errors, warnings };
}

function buildDoc(row, post, rank, wpData) {
  const slug = row["old slug"];
  const info = practiceInfo(row["target URL"], slug);
  const meta = wpData.metaByPostId.get(post.ID) || {};
  const thumbnailId = Number(meta._thumbnail_id || 0);
  const attachment = thumbnailId ? wpData.attachmentsById.get(thumbnailId) : null;
  const attachmentMeta = thumbnailId ? wpData.metaByPostId.get(thumbnailId) || {} : {};
  const imageUrl =
    normalizeImageUrl(attachment?.guid) ||
    normalizeImageUrl(rank?.social_facebook_thumbnail) ||
    normalizeImageUrl(rank?.social_twitter_thumbnail) ||
    firstBodyImageUrl(post.post_content);
  const title = titleFrom(post, rank, row["old title"]);
  const body = portableTextFromWordPress(post.post_content, title, slug, info.href);
  const bodyText = body.map((item) => item.children?.map((child) => child.text).join("") || "").join(" ");
  const excerpt = safeExcerpt(post, rank, title).slice(0, 218);
  const seoTitle = rewriteSeoTemplate(rank?.seo_title || meta.rank_math_title || title, title);
  const seoDescription = rewriteSeoTemplate(rank?.seo_description || meta.rank_math_description || excerpt, title);
  const keywords = [
    ...(rank?.focus_keyword || meta.rank_math_focus_keyword || "")
      .split(/[,|;]/)
      .map((item) => cleanText(item))
      .filter(Boolean),
    info.title,
    "Chaman Law Firm"
  ].slice(0, 12);
  const review = safetyReview({ post, bodyText, seoDescription, imageUrl });
  const automatedContentChecksPassed =
    review.errors.length === 0 &&
    body.length >= 8 &&
    seoTitle &&
    seoDescription &&
    seoDescription.length >= 100 &&
    imageUrl &&
    !riskyFreePattern.test(bodyText);
  const canApprove = false;

  const doc = {
    _id: `${DOC_PREFIX}${slug}`,
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
      aeoKeywords: keywords,
      geoKeywords: keywords.filter((keyword) => /(nigeria|lagos|ogun|diaspora)/i.test(keyword))
    }
  };

  return {
    doc,
    info,
    imageUrl,
    imageAlt: cleanText(attachmentMeta._wp_attachment_image_alt || attachment?.post_title || `${title} legal guide | Chaman Law Firm`),
    review,
    automatedContentChecksPassed,
    canApprove
  };
}

async function main() {
  const [inventoryRows, rankRows] = await Promise.all([readCsv(inventoryPath), readCsv(rankMathPath)]);
  const rankMap = rankMathBySlug(rankRows);
  const candidateRows = inventoryRows
    .filter((row) => row["old slug"])
    .filter((row) => !String(row["target URL"] || "").startsWith("/resources/blog/"))
    .filter((row) => !/free|top-legal-services|lawyer-near-me/i.test(`${row["old slug"]} ${row["old title"]}`))
    .sort((a, b) => Number(b.clicks || 0) - Number(a.clicks || 0));
  const wpData = await extractWordPressData(dumpPath, candidateRows.map((row) => row["old slug"]));
  const selected = [];
  const docs = [];
  const draftReports = [];

  for (const row of candidateRows) {
    const slug = row["old slug"];
    const post = wpData.postsBySlug.get(slug);
    const rank = rankMap.get(slug) || {};
    const imageUrl =
      post &&
      (normalizeImageUrl(wpData.attachmentsById.get(Number((wpData.metaByPostId.get(post.ID) || {})._thumbnail_id || 0))?.guid) ||
        normalizeImageUrl(rank.social_facebook_thumbnail) ||
        normalizeImageUrl(rank.social_twitter_thumbnail) ||
        firstBodyImageUrl(post.post_content));

    const selection = {
      "priority rank": selected.length + 1,
      "old URL": row["old URL"],
      "old slug": slug,
      "current redirect target": row["target URL"],
      "current redirect status": row["redirect status"],
      "old title": post ? cleanText(post.post_title || row["old title"]) : row["old title"],
      "old meta description": rewriteSeoTemplate(rank.seo_description || (post ? (wpData.metaByPostId.get(post.ID) || {}).rank_math_description : "") || row["old meta description"] || "", post?.post_title || row["old title"]),
      clicks: row.clicks,
      impressions: row.impressions,
      "evidence source": row["evidence source"],
      "content source found": post ? `Yes - WordPress SQL ${post.post_type} ${post.ID}` : "No",
      "image source found": imageUrl ? "Yes" : "No",
      "proposed Sanity slug": slug,
      "proposed new URL": `/resources/blog/${slug}`,
      "recommended action": post ? "Recover exact body as hidden Sanity draft" : "Keep temporary redirect until source body is recovered",
      "review status": post ? "Automated recovery review pending" : "Blocked - body missing",
      "approval status": "not approved",
      notes: post ? "Use Charles Chukwuma Nkwoka, Esq. as public author; keep hidden until approved." : "No matching post/page found in SQL dump."
    };
    selected.push(selection);

    if (post && docs.length < draftLimit) {
      const built = buildDoc(row, post, rank, wpData);
      docs.push(built.doc);
      draftReports.push({
        slug,
        title: built.doc.title,
        documentId: built.doc._id,
        bodyBlocks: built.doc.body.length,
        imageSource: built.imageUrl || "",
        imageAlt: built.imageAlt,
        author: AUTHOR_NAME,
        lawFirmApproved: false,
        automatedContentChecksPassed: built.automatedContentChecksPassed,
        canApprove: built.canApprove,
        approvalErrors: built.review.errors,
        approvalWarnings: [
          ...built.review.warnings,
          "Kept hidden: recovered image source was not attached to the Sanity document and lawyer approval is still required before publication."
        ],
        currentRedirectTarget: row["target URL"],
        proposedRedirectTarget: `/resources/blog/${slug}`
      });
    }

    if (selected.length >= selectionLimit) break;
  }

  const selectedForApproval = draftReports.filter((row) => row.canApprove).slice(0, approvalLimit);
  for (const report of selectedForApproval) {
    const doc = docs.find((item) => item.slug.current === report.slug);
    if (doc) doc.lawFirmApproved = true;
  }

  await fsp.mkdir(outDir, { recursive: true });
  const selectionHeaders = [
    "priority rank",
    "old URL",
    "old slug",
    "current redirect target",
    "current redirect status",
    "old title",
    "old meta description",
    "clicks",
    "impressions",
    "evidence source",
    "content source found",
    "image source found",
    "proposed Sanity slug",
    "proposed new URL",
    "recommended action",
    "review status",
    "approval status",
    "notes"
  ];
  await fsp.writeFile(selectionPath, `${writeCsv(selected, selectionHeaders)}\n`, "utf8");
  await fsp.writeFile(path.join(outDir, "sprint10e-prepared-drafts.json"), JSON.stringify(docs, null, 2), "utf8");
  await fsp.writeFile(path.join(outDir, "sprint10e-draft-review.json"), JSON.stringify(draftReports, null, 2), "utf8");
  await fsp.writeFile(path.join(outDir, "sprint10e-approval-candidates.json"), JSON.stringify(selectedForApproval, null, 2), "utf8");

  const importResult = { importedDrafts: 0, approved: 0, categoriesEnsured: 0 };
  if (shouldImport) {
    const client = getCliClient({ apiVersion: API_VERSION });
    const categories = new Map();
    for (const doc of docs) {
      for (const ref of doc.categories || []) {
        const title = ref._ref.replace(/^category\./, "").replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
        categories.set(ref._ref, {
          _id: ref._ref,
          _type: "category",
          title,
          slug: { _type: "slug", current: ref._ref.replace(/^category\./, "") },
          description: `Legal article category for ${title}.`
        });
      }
    }
    for (const category of categories.values()) {
      await client.createIfNotExists(category);
      importResult.categoriesEnsured += 1;
    }
    await client.createIfNotExists({
      _id: AUTHOR_ID,
      _type: "author",
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    });
    for (const doc of docs) {
      await client.createOrReplace(doc);
      importResult.importedDrafts += 1;
      if (doc.lawFirmApproved) importResult.approved += 1;
    }
  }

  console.log(JSON.stringify({ selected: selected.length, preparedDrafts: docs.length, approvalCandidates: selectedForApproval.length, shouldImport, shouldApprove, importResult }, null, 2));
}

main().catch((error) => {
  console.error(`Sprint 10E recovery failed: ${error?.message || String(error)}`);
  process.exit(1);
});
