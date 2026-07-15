import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11i-";
const APPROVAL_LIMIT = 10;
const CONTROLLED_APPROVAL_SLUGS = new Set(["deed-of-partition-in-nigeria"]);

const shouldApply = process.argv.includes("--apply");

const paths = {
  blogBatch: path.join("docs", "SPRINT-11G-BLOG-RECOVERY-BATCH.csv"),
  staticBatch: path.join("docs", "SPRINT-11G-STATIC-SERVICE-RESTORATION-BATCH.csv"),
  masterQueue: path.join("docs", "SPRINT-11G-MASTER-LEGACY-MIGRATION-QUEUE.csv"),
  nextConfig: "next.config.mjs",
  freshEvidence: path.join("docs", "SPRINT-11I-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  authorAudit: path.join("docs", "SPRINT-11I-PUBLIC-SAFE-AUTHOR-AUDIT.csv"),
  imageLibrary: path.join("docs", "SPRINT-11I-APPROVED-LEGAL-IMAGE-LIBRARY.csv"),
  hiddenImageCleanup: path.join("docs", "SPRINT-11I-HIDDEN-BLOG-IMAGE-ALT-CLEANUP.csv"),
  legalReview: path.join("docs", "SPRINT-11I-LEGAL-CONTENT-QUALITY-REVIEW.csv"),
  approvalBatch: path.join("docs", "SPRINT-11I-BLOG-RECOVERY-APPROVAL-BATCH.csv"),
  staticContinuation: path.join("docs", "SPRINT-11I-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  redirectBatch: path.join("docs", "SPRINT-11I-REDIRECT-ACTIVATION-BATCH.csv"),
  report: path.join("docs", "SPRINT-11I-PUBLIC-SAFE-AUTHOR-IMAGE-RECOVERY-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11I-RESULT.json")
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
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
  return `${SITE_URL}${normalizePath(route) === "/" ? "" : normalizePath(route)}`;
}

function slugFromUrl(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function titleFor(slug, fallback) {
  return fallback || slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bCac\b/g, "CAC");
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
    _key: key,
    style,
    markDefs,
    children: [{ _type: "span", _key: `${key}-span`, text, marks }]
  };
}

function answerBlock(slug, title) {
  return makeBlock(
    `answer-${slug}`.slice(0, 80),
    `${title} is a public legal education topic. Chaman Law Firm explains the key risks, documents, and decision points so readers know when to seek advice before acting.`,
    "normal"
  );
}

function legalFrameBlock(slug) {
  return makeBlock(
    `legal-frame-${slug}`.slice(0, 80),
    "This article is for general legal education only. It does not replace advice from a lawyer who has reviewed the facts, documents, deadlines, and applicable law."
  );
}

function consultationBlock(slug) {
  return {
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
  };
}

function sanitizeBody(body) {
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
              .replace(/free service/gi, "legal service")
          }))
        : []
    }));
}

function enrichBody(body, slug, title) {
  const cleanBody = sanitizeBody(body);
  const text = bodyText(cleanBody);
  const nextBody = [...cleanBody];
  if (!/public legal education|not legal advice|does not replace advice/i.test(text)) nextBody.unshift(legalFrameBlock(slug));
  if (!/public legal education topic/i.test(text)) nextBody.unshift(answerBlock(slug, title));
  if (!hasConsultationSignal(text)) nextBody.push(consultationBlock(slug));
  return nextBody;
}

function detectTextRisks(text) {
  const risks = [];
  const promotionalText = text.replace(/cautious of anyone who guarantees?[^.]+/gi, "");
  if (/Chaman Properties/i.test(text)) risks.push("Chaman Properties reference");
  if (/luxury|mansion|buy now|estate sales|property sales|investment returns|land banking/i.test(text)) risks.push("property-sales/luxury wording");
  if (/free legal advice|get .* for free|free service/i.test(text)) risks.push("misleading free-service wording");
  if (/elementor|wp-block|shortcode|\[\/?[a-z0-9_-]+/i.test(text)) risks.push("plugin debris");
  if (/forcefully evict|self-help eviction|eject.*without.*court|take the law into your own hands/i.test(text)) risks.push("unsafe self-help wording");
  if (/guarantee|assured result|must win|certain outcome/i.test(promotionalText)) risks.push("overpromising");
  return risks;
}

function legalRiskFor(slug, title, body, rowRisk = "") {
  const topic = `${slug} ${title} ${rowRisk}`.toLowerCase();
  const text = `${topic} ${body}`.toLowerCase();
  if (/police|criminal|crime|bail|domestic violence|custody|divorce|inheritance|probate|eviction|quit notice|harassment|stolen|correctional|conjugal/.test(topic)) {
    return "high - lawyer review required before approval";
  }
  if (/land use act|tenan|landlord|joint property|land registration|expert witness|tax|cac|immigration|employment|debt|corporate|contract|mortgage|securities/.test(text)) {
    return "medium - current-law review required but no automated unsafe wording detected";
  }
  return "low/medium - editorial legal review required";
}

function duplicateRiskFor(slug, rowRisk = "") {
  const high = new Set([
    "obtaining-a-certificate-of-occupancy-c-of-o",
    "the-concept-of-rule-of-law-in-nigeria",
    "the-overall-list-of-federal-laws-in-nigeria",
    "land-use-act-1978",
    "lagos-tenancy-fixed-and-periodic-tenancies"
  ]);
  if (high.has(slug)) return "high - likely cannibalization with existing stronger content";
  if (/high/i.test(rowRisk)) return rowRisk;
  if (/medium/i.test(rowRisk)) return rowRisk;
  return "low";
}

function topicFromText(slug, title = "", categories = []) {
  const text = `${slug} ${title} ${categories.join(" ")}`.toLowerCase();
  if (/tenant|tenancy|landlord|quit|eviction/.test(text)) return "tenancy / eviction";
  if (/property|land|title|c-of-o|certificate|governor|occupancy|mortgage|deed/.test(text)) return "property law / land title";
  if (/cac|company|corporate|share|director|contract|securities|trade union|employment/.test(text)) return "corporate / CAC / company law";
  if (/debt|loan|recovery/.test(text)) return "debt recovery";
  if (/probate|estate|inheritance|will/.test(text)) return "probate / estate administration";
  if (/family|marriage|custody|divorce|conjugal/.test(text)) return "family law";
  if (/immigration|citizenship|visa|passport/.test(text)) return "immigration";
  if (/court|litigation|dispute|evidence|witness|lawsuit|judiciary|equity/.test(text)) return "litigation / court";
  if (/notary|notar|power of attorney|apostille|affidavit/.test(text)) return "notary public";
  if (/adr|mediation|arbitration/.test(text)) return "ADR / mediation";
  if (/consult/.test(text)) return "consultation";
  return "general legal advisory";
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

async function fetchText(url) {
  try {
    const response = await fetch(url);
    return { status: response.status, text: await response.text(), url: response.url };
  } catch (error) {
    return { status: "error", text: "", error: error.message, url };
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
      } else if (pattern.test(full) && !/SPRINT-11[GHIK]|SPRINT-10|PHASE|README/i.test(entry.name)) {
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
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      excerpt,
      author,
      "authorRef": author._ref,
      "authorName": author->name,
      "authorSlug": author->slug.current,
      publishedAt,
      body,
      "bodyText": pt::text(body),
      categories[]->{_id,title,"slug":slug.current},
      tags,
      lawFirmApproved,
      mainImage{alt,asset->{_id,url,source,metadata{dimensions}}},
      seo
    }`
  );
}

function chooseSourceDoc(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true || doc._id.startsWith("drafts.")) || null;
}

function sortPreferredPublicDocs(docs) {
  return [...docs].sort((a, b) => {
    const aPublicSafe = a.authorRef === AUTHOR_ID ? 1 : 0;
    const bPublicSafe = b.authorRef === AUTHOR_ID ? 1 : 0;
    if (aPublicSafe !== bPublicSafe) return bPublicSafe - aPublicSafe;
    return String(b._updatedAt || "").localeCompare(String(a._updatedAt || ""));
  });
}

function buildImageLibrary(approvedPosts) {
  const byAsset = new Map();
  for (const post of approvedPosts) {
    const asset = post.mainImage?.asset;
    if (!asset?._id) continue;
    if (!byAsset.has(asset._id)) {
      const categories = (post.categories || []).map((category) => category?.title).filter(Boolean);
      const topic = topicFromText(post.slug, post.title, categories);
      byAsset.set(asset._id, {
        assetId: asset._id,
        url: asset.url || "",
        topic,
        sourcePosts: [],
        altSamples: new Set(),
        count: 0
      });
    }
    const item = byAsset.get(asset._id);
    item.count += 1;
    item.sourcePosts.push(post.slug);
    if (post.mainImage?.alt) item.altSamples.add(post.mainImage.alt);
  }
  return [...byAsset.values()].map((item) => ({
    ...item,
    altSamples: [...item.altSamples].slice(0, 3)
  }));
}

function fallbackFor(topic, imageLibrary) {
  const exact = imageLibrary
    .filter((item) => item.topic === topic)
    .sort((a, b) => a.count - b.count)[0];
  return exact || imageLibrary.filter((item) => item.topic === "general legal advisory").sort((a, b) => a.count - b.count)[0] || null;
}

function seoFor(slug, title, doc) {
  return {
    title: doc?.seo?.metaTitle || `${title} | Chaman Law Firm`,
    description:
      doc?.seo?.metaDescription ||
      `Learn key Nigerian legal considerations on ${title}. Chaman Law Firm explains risk points and when to speak with a lawyer.`
  };
}

function categoryRefs(doc) {
  return (doc?.categories || [])
    .filter((category) => category?._id)
    .map((category) => ({ _type: "reference", _key: category._id.replace(/[^a-z0-9_-]/gi, "-"), _ref: category._id }));
}

function buildApprovedDoc(doc, row, image) {
  const slug = row.slug;
  const title = titleFor(slug, row["improved title"] || doc.title || row["old title"]);
  const seo = seoFor(slug, title, doc);
  const mainImage = {
    _type: "image",
    asset: { _type: "reference", _ref: image.assetId },
    alt: image.alt || altTextFor(title, image.topic)
  };
  const cleanDoc = { ...doc };
  delete cleanDoc._rev;
  delete cleanDoc._createdAt;
  delete cleanDoc._updatedAt;
  return {
    ...cleanDoc,
    _id: `${PUBLIC_PREFIX}${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt:
      doc.excerpt ||
      seo.description,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: categoryRefs(doc),
    body: enrichBody(doc.body || [], slug, title),
    mainImage,
    lawFirmApproved: true,
    seo: {
      ...(doc.seo || {}),
      metaTitle: seo.title,
      metaDescription: seo.description,
      canonicalUrl: absoluteUrl(`/resources/blog/${slug}`),
      openGraphTitle: seo.title,
      openGraphDescription: seo.description,
      openGraphImage: mainImage,
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article"
    }
  };
}

function candidateBlockers({ row, doc, selected, image, textRisks, legalRisk, duplicateRisk }) {
  const blockers = [];
  const text = bodyText(doc?.body || []);
  if (!selected) blockers.push("outside Sprint 11I controlled approval subset");
  if (!doc) blockers.push("hidden/unapproved Sanity source document missing");
  if (!text || text.length < 900) blockers.push("body too short or missing");
  if (!doc?.publishedAt || new Date(doc.publishedAt).getTime() > Date.now()) blockers.push("publishedAt missing or future-dated");
  if (!image?.assetId) blockers.push("featured image missing");
  if (!image?.alt || image.alt.length < 9) blockers.push("alt text missing/review needed");
  if (!Array.isArray(doc?.categories) || doc.categories.length === 0) blockers.push("category/practice relationship missing");
  if (!row["old URL"]) blockers.push("exact old URL mapping missing");
  if (!doc?.seo?.metaTitle && row["SEO title status"] !== "present") blockers.push("SEO title missing");
  if (!doc?.seo?.metaDescription && row["meta description status"] !== "present") blockers.push("meta description missing");
  if (!hasHref(doc?.body || [])) blockers.push("internal link missing in source; CTA will be added, but manual link review recommended");
  if (textRisks.length) blockers.push(...textRisks);
  if (legalRisk.startsWith("high")) blockers.push(legalRisk);
  if (duplicateRisk.startsWith("high")) blockers.push(duplicateRisk);
  return blockers;
}

async function main() {
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const blogRows = readCsv(paths.blogBatch).slice(0, 50).map((row) => ({
    ...row,
    slug: row.slug || slugFromUrl(row["old URL"])
  }));
  const staticRows = readCsv(paths.staticBatch);
  const masterRows = readCsv(paths.masterQueue);
  const redirects = parseRedirects(fs.readFileSync(paths.nextConfig, "utf8"));

  const [sitemap, robots, allPosts] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    queryAllPosts()
  ]);

  if (shouldApply) {
    await client.createIfNotExists({
      _id: AUTHOR_ID,
      _type: "author",
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    });
    await client.patch(AUTHOR_ID).set({
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    }).commit();
  }

  const approvedBefore = allPosts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."));
  const byPublicSlug = new Map();
  for (const post of approvedBefore) {
    if (!byPublicSlug.has(post.slug)) byPublicSlug.set(post.slug, []);
    byPublicSlug.get(post.slug).push(post);
  }

  const authorCorrections = [];
  const duplicateDemotions = [];
  if (shouldApply) {
    for (const post of approvedBefore) {
      if (post.authorRef !== AUTHOR_ID || post.authorName !== AUTHOR_NAME) {
        await client.patch(post._id).set({ author: { _type: "reference", _ref: AUTHOR_ID } }).commit();
        authorCorrections.push(post._id);
      }
    }
    for (const docs of byPublicSlug.values()) {
      if (docs.length <= 1) continue;
      const [keep, ...extras] = sortPreferredPublicDocs(docs);
      for (const extra of extras) {
        await client.patch(extra._id).set({ lawFirmApproved: false }).commit();
        duplicateDemotions.push({ _id: extra._id, slug: extra.slug, kept: keep._id });
      }
    }
  }

  const refreshedPosts = shouldApply ? await queryAllPosts() : allPosts;
  const approvedPosts = refreshedPosts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."));
  const refreshedBySlug = new Map();
  for (const post of refreshedPosts) {
    if (!refreshedBySlug.has(post.slug)) refreshedBySlug.set(post.slug, []);
    refreshedBySlug.get(post.slug).push(post);
  }
  const approvedBySlug = new Map();
  for (const post of approvedPosts) {
    if (!approvedBySlug.has(post.slug)) approvedBySlug.set(post.slug, []);
    approvedBySlug.get(post.slug).push(post);
  }

  const authorAuditRows = approvedPosts.map((post) => {
    const duplicates = approvedBySlug.get(post.slug) || [];
    return {
      slug: post.slug,
      title: post.title,
      "public Sanity document ID": post._id,
      "author reference": post.authorRef || "",
      "visible author name": post.authorName || "",
      "author is Charles Chukwuma Nkwoka, Esq.": post.authorRef === AUTHOR_ID && post.authorName === AUTHOR_NAME ? "yes" : "no",
      "duplicate public document risk": duplicates.length > 1 ? `yes - ${duplicates.length} public docs share this slug` : "no",
      "duplicate sitemap risk": duplicates.length > 1 ? "yes" : "no",
      "correction needed yes/no": post.authorRef === AUTHOR_ID && post.authorName === AUTHOR_NAME && duplicates.length === 1 ? "no" : "yes",
      "correction applied yes/no": authorCorrections.includes(post._id) ? "yes" : duplicateDemotions.some((item) => item._id === post._id) ? "demoted duplicate" : "no",
      notes: duplicates.length > 1 ? "duplicate slug requires public visibility cleanup" : ""
    };
  });

  const imageLibrary = buildImageLibrary(approvedPosts);
  const imageRows = imageLibrary.map((image) => ({
    "image source": image.sourcePosts.slice(0, 5).join("; "),
    "Sanity asset reference if available": image.assetId,
    "topic category": image.topic,
    "approved use cases": `Fallback for ${image.topic} articles and closely related law-firm education pages`,
    "alt-text template": `${image.topic} legal guidance | Chaman Law Firm`,
    "repeated-use risk": image.count > 8 ? "high" : image.count > 4 ? "medium" : "low",
    "Chaman Properties contamination risk": /property listing|luxury|mansion|sale/i.test(`${image.sourcePosts.join(" ")} ${image.altSamples.join(" ")}`) ? "review" : "not detected",
    notes: `Used by ${image.count} approved public post(s). Sample alt: ${image.altSamples.join(" | ")}`
  }));

  const selectedRows = [];
  const hiddenImageRows = [];
  const legalRows = [];
  const approvalRows = [];
  const approvedThisRun = [];
  const keptHidden = [];
  const imagePatchResults = [];

  for (const row of blogRows) {
    const docs = refreshedBySlug.get(row.slug) || [];
    const alreadyPublic = (approvedBySlug.get(row.slug) || []).length > 0;
    const sourceDoc = chooseSourceDoc(docs);
    const title = titleFor(row.slug, row["improved title"] || row["old title"] || sourceDoc?.title);
    const categories = (sourceDoc?.categories || []).map((category) => category?.title).filter(Boolean);
    const topic = topicFromText(row.slug, title, categories);
    const text = bodyText(sourceDoc?.body || []);
    const textRisks = detectTextRisks(`${row.slug} ${title} ${text}`);
    const legalRisk = legalRiskFor(row.slug, title, text, row["legal risk"]);
    const duplicateRisk = duplicateRiskFor(row.slug, row["duplicate/cannibalization risk"]);
    let image = sourceDoc?.mainImage?.asset?._id
      ? {
          assetId: sourceDoc.mainImage.asset._id,
          alt: sourceDoc.mainImage.alt || altTextFor(title, topic),
          topic,
          status: "source image"
        }
      : null;
    const prelimRepairable =
      sourceDoc &&
      !alreadyPublic &&
      text.length >= 900 &&
      !legalRisk.startsWith("high") &&
      !duplicateRisk.startsWith("high") &&
      textRisks.length === 0;
    const fallback = !image && prelimRepairable ? fallbackFor(topic, imageLibrary) : null;
    if (!image && fallback) {
      image = {
        assetId: fallback.assetId,
        alt: altTextFor(title, topic),
        topic,
        status: "fallback image"
      };
      if (shouldApply) {
        await client.patch(sourceDoc._id).set({
          mainImage: {
            _type: "image",
            asset: { _type: "reference", _ref: fallback.assetId },
            alt: image.alt
          }
        }).commit();
        imagePatchResults.push({ slug: row.slug, assetId: fallback.assetId });
      }
    }

    const candidateReady =
      !alreadyPublic &&
      CONTROLLED_APPROVAL_SLUGS.has(row.slug) &&
      prelimRepairable &&
      Boolean(image?.assetId);
    if (candidateReady && selectedRows.length < APPROVAL_LIMIT) selectedRows.push(row.slug);
    const selected = selectedRows.includes(row.slug);
    const blockers = alreadyPublic
      ? ["already public"]
      : candidateBlockers({ row, doc: sourceDoc, selected, image, textRisks, legalRisk, duplicateRisk });
    const canApprove = !alreadyPublic && selected && blockers.length === 0;

    if (canApprove && shouldApply) {
      const publicDoc = buildApprovedDoc(sourceDoc, row, image);
      await client.createOrReplace(publicDoc);
      const sourceIsPublicDoc = sourceDoc._id === publicDoc._id;
      await client.patch(sourceDoc._id).set({
        title: publicDoc.title,
        author: { _type: "reference", _ref: AUTHOR_ID },
        mainImage: publicDoc.mainImage,
        seo: publicDoc.seo,
        lawFirmApproved: sourceIsPublicDoc || sourceDoc._id.startsWith("drafts.") ? true : false
      }).commit({ autoGenerateArrayKeys: true });
      approvedThisRun.push({
        slug: row.slug,
        title: publicDoc.title,
        oldUrl: absoluteUrl(row["old URL"]),
        targetPath: `/resources/blog/${row.slug}`,
        targetUrl: absoluteUrl(`/resources/blog/${row.slug}`)
      });
    } else if (canApprove) {
      approvedThisRun.push({
        slug: row.slug,
        title,
        oldUrl: absoluteUrl(row["old URL"]),
        targetPath: `/resources/blog/${row.slug}`,
        targetUrl: absoluteUrl(`/resources/blog/${row.slug}`)
      });
    } else if (!alreadyPublic) {
      keptHidden.push({ slug: row.slug, title, oldUrl: absoluteUrl(row["old URL"]), reason: blockers.join("; ") || "kept hidden" });
    }

    hiddenImageRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug: row.slug,
      title,
      "current image status": image?.assetId ? image.status : "missing",
      "original legacy image available yes/no": sourceDoc?.mainImage?.asset?._id ? "yes" : "no",
      "fallback image assigned yes/no": image?.status === "fallback image" ? (shouldApply ? "yes - patched" : "ready in dry-run") : "no",
      "image relevance status": image?.assetId ? `matched to ${topic}` : "missing or unsafe to assign",
      "alt text": image?.alt || "",
      "Chaman Properties contamination risk": textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk)) ? "yes" : "not detected",
      "repeated principal image risk": image?.assetId && (imageLibrary.find((item) => item.assetId === image.assetId)?.count || 0) > 8 ? "review" : "not detected",
      "approval readiness after image cleanup": canApprove ? (shouldApply ? "approved" : "ready if --apply is used") : "keep hidden",
      notes: blockers.join("; ")
    });

    legalRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug: row.slug,
      title,
      "complete body": text.length >= 900 ? "yes" : "no",
      "short/thin body risk": text.length >= 900 ? "no" : "yes",
      "plugin debris": textRisks.includes("plugin debris") ? "yes" : "not detected",
      "unsafe legal advice": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "outdated legal statement": legalRisk.startsWith("medium") || legalRisk.startsWith("high") ? "manual review required" : "not detected",
      overpromising: textRisks.includes("overpromising") ? "yes" : "not detected",
      "misleading free-service wording": textRisks.includes("misleading free-service wording") ? "yes" : "not detected",
      "self-help eviction risk": textRisks.includes("unsafe self-help wording") ? "yes" : "not detected",
      "family-law sensitivity": /family|marriage|custody|divorce|conjugal/i.test(`${row.slug} ${title}`) ? "review carefully" : "not primary issue",
      "property-law accuracy": /property|land|tenant|mortgage/i.test(`${row.slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "corporate/CAC accuracy": /corporate|cac|company|contract|director/i.test(`${row.slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "immigration accuracy": /immigration|citizenship|visa/i.test(`${row.slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "probate/debt recovery accuracy": /probate|debt|estate|inheritance/i.test(`${row.slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "litigation/procedure accuracy": /court|litigation|evidence|witness|lawsuit|judiciary/i.test(`${row.slug} ${title}`) ? "lawyer review required" : "not primary issue",
      "duplicate/cannibalization risk": duplicateRisk,
      "approval readiness": canApprove ? (shouldApply ? "approved" : "ready if --apply is used") : "not ready",
      notes: blockers.join("; ")
    });

    approvalRows.push({
      "old URL": absoluteUrl(row["old URL"]),
      slug: row.slug,
      title,
      "selected for Sprint 11I": selected ? "yes" : "no",
      "body status": text.length >= 900 ? "present" : text ? "short/review needed" : "missing",
      "image status": image?.assetId ? "present" : "missing",
      "alt text status": image?.alt ? "present" : "missing",
      "SEO status": docSeoStatus(sourceDoc, row),
      "canonical": absoluteUrl(`/resources/blog/${row.slug}`),
      "author governance": AUTHOR_NAME,
      "category/practice relationship": categories.join("; ") || row["category/practice relationship"] || "missing",
      "consultation CTA": canApprove ? "present or added" : hasConsultationSignal(text) ? "present in source" : "needed before approval",
      "internal links": hasHref(sourceDoc?.body || []) ? "present" : canApprove ? "CTA/internal links added" : "needed before approval",
      "legal status": legalRisk,
      "duplicate status": duplicateRisk,
      "approval status": canApprove ? (shouldApply ? "approved" : "ready") : alreadyPublic ? "already public" : "hidden",
      "redirect status": canApprove ? "ready for exact redirect after target is live and sitemap-included" : "not eligible",
      notes: blockers.join("; ")
    });
  }

  const staticContinuationRows = selectStaticContinuation(masterRows, staticRows, redirects);
  const redirectRows = approvedThisRun.map((item) => ({
    "old URL": item.oldUrl,
    "old source path": normalizePath(item.oldUrl),
    "new URL": item.targetUrl,
    "new target path": item.targetPath,
    "redirect type": "one-hop 308",
    "activation status": shouldApply ? "selected for next.config.mjs activation after code patch/deploy" : "pending apply",
    "sitemap status": shouldApply ? "verify after production deploy/cache refresh" : "pending approval",
    notes: "Activate only after public target returns 200 and appears in sitemap."
  }));

  writeOutputFiles({
    fresh: freshEvidenceFiles(),
    authorAuditRows,
    imageRows,
    hiddenImageRows,
    legalRows,
    approvalRows,
    staticContinuationRows,
    redirectRows,
    result: {
      generatedAt: new Date().toISOString(),
      applied: shouldApply,
      tokenDetected: Boolean(token),
      tokenPrinted: false,
      approvedPublicPostsBefore: approvedBefore.length,
      approvedPublicPostsAfter: approvedPosts.length,
      authorCorrections: authorCorrections.length,
      duplicateDemotions,
      imageLibraryCount: imageRows.length,
      imagePatchResults,
      blogCandidatesReviewed: blogRows.length,
      approvedCount: approvedThisRun.length,
      approvedThisRun,
      keptHiddenCount: keptHidden.length,
      keptHidden,
      staticContinuationRows: staticContinuationRows.length,
      redirectRows: redirectRows.length,
      sitemapStatus: sitemap.status,
      robotsStatus: robots.status,
      sitemapHasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
      robotsProductionSitemap: robots.text.includes(`${SITE_URL}/sitemap.xml`)
    }
  });

  console.log(JSON.stringify({
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    approvedPublicPostsBefore: approvedBefore.length,
    approvedPublicPostsAfter: approvedPosts.length,
    authorCorrections: authorCorrections.length,
    duplicateDemotions: duplicateDemotions.length,
    imageLibraryCount: imageRows.length,
    imagePatchResults: imagePatchResults.length,
    blogCandidatesReviewed: blogRows.length,
    approvedCount: approvedThisRun.length,
    approvedSlugs: approvedThisRun.map((item) => item.slug),
    keptHiddenCount: keptHidden.length,
    staticContinuationRows: staticContinuationRows.length,
    redirectRows: redirectRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

function docSeoStatus(doc, row) {
  if (doc?.seo?.metaTitle && doc?.seo?.metaDescription) return "complete";
  if (row["SEO title status"] === "present" && row["meta description status"] === "present") return "restorable from migration row";
  return "missing/rewrite needed";
}

function selectStaticContinuation(masterRows, staticRows, redirects) {
  const seen = new Set(staticRows.map((row) => normalizePath(row["old URL"])));
  return masterRows
    .filter((row) => ["static", "service", "practice", "consultation", "lawyer profile"].includes(row["likely page type"]))
    .filter((row) => !seen.has(normalizePath(row["old URL"])))
    .filter((row) => !/^high|blocked/i.test(row["legal risk"] || ""))
    .slice(0, 10)
    .map((row, index) => {
      const oldPath = normalizePath(row["old URL"]);
      const target = normalizePath(row["recommended final URL"]);
      const configured = redirects.get(oldPath);
      return {
        priority: index + 1,
        "old URL": absoluteUrl(oldPath),
        "proposed final URL": absoluteUrl(target),
        "page type": row["likely page type"],
        H1: row["old title"],
        "meta title": `${row["old title"] || titleFor(slugFromUrl(oldPath), "")} | Chaman Law Firm`,
        "meta description": row["old title"] ? `Chaman Law Firm guidance on ${row["old title"]}. Speak with our legal team for advice tailored to your matter.` : "",
        canonical: absoluteUrl(target),
        "required sections": "answer block; service overview; legal process; documents/requirements; risks; FAQs; consultation CTA",
        CTA: "Book a consultation",
        "internal links": "relevant practice area; consultation; contact; related resources",
        "image recommendation": "approved Chaman Law Firm legal/service image with accurate alt text",
        "legal review status": row["legal risk"],
        "publish readiness": configured ? "already configured; verify only" : "content/redirect decision requires final review",
        "redirect plan": configured ? `configured to ${configured}` : "defer until target is verified as exact live equivalent"
      };
    });
}

function writeOutputFiles(data) {
  const freshMd = `# Sprint 11I Fresh Search Evidence Status

Fresh post-launch GSC/Bing/backlink/SERP evidence detected locally: ${data.fresh.length ? "yes" : "no"}.

## Files Detected

${data.fresh.length ? data.fresh.map((item) => `- \`${item.file}\` (${item.modified}, ${item.size} bytes)`).join("\n") : "- No new non-sprint Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, Moz, or fresh crawl export was found locally."}

## Current Rule

Use only approved, live, sitemap-included URLs for search engine inspection. Do not submit hidden draft URLs to Google or Bing.
`;
  fs.writeFileSync(paths.freshEvidence, freshMd, "utf8");

  writeCsv(paths.authorAudit, [
    "slug",
    "title",
    "public Sanity document ID",
    "author reference",
    "visible author name",
    "author is Charles Chukwuma Nkwoka, Esq.",
    "duplicate public document risk",
    "duplicate sitemap risk",
    "correction needed yes/no",
    "correction applied yes/no",
    "notes"
  ], data.authorAuditRows);

  writeCsv(paths.imageLibrary, [
    "image source",
    "Sanity asset reference if available",
    "topic category",
    "approved use cases",
    "alt-text template",
    "repeated-use risk",
    "Chaman Properties contamination risk",
    "notes"
  ], data.imageRows);

  writeCsv(paths.hiddenImageCleanup, [
    "old URL",
    "slug",
    "title",
    "current image status",
    "original legacy image available yes/no",
    "fallback image assigned yes/no",
    "image relevance status",
    "alt text",
    "Chaman Properties contamination risk",
    "repeated principal image risk",
    "approval readiness after image cleanup",
    "notes"
  ], data.hiddenImageRows);

  writeCsv(paths.legalReview, [
    "old URL",
    "slug",
    "title",
    "complete body",
    "short/thin body risk",
    "plugin debris",
    "unsafe legal advice",
    "outdated legal statement",
    "overpromising",
    "misleading free-service wording",
    "self-help eviction risk",
    "family-law sensitivity",
    "property-law accuracy",
    "corporate/CAC accuracy",
    "immigration accuracy",
    "probate/debt recovery accuracy",
    "litigation/procedure accuracy",
    "duplicate/cannibalization risk",
    "approval readiness",
    "notes"
  ], data.legalRows);

  writeCsv(paths.approvalBatch, [
    "old URL",
    "slug",
    "title",
    "selected for Sprint 11I",
    "body status",
    "image status",
    "alt text status",
    "SEO status",
    "canonical",
    "author governance",
    "category/practice relationship",
    "consultation CTA",
    "internal links",
    "legal status",
    "duplicate status",
    "approval status",
    "redirect status",
    "notes"
  ], data.approvalRows);

  writeCsv(paths.staticContinuation, [
    "priority",
    "old URL",
    "proposed final URL",
    "page type",
    "H1",
    "meta title",
    "meta description",
    "canonical",
    "required sections",
    "CTA",
    "internal links",
    "image recommendation",
    "legal review status",
    "publish readiness",
    "redirect plan"
  ], data.staticContinuationRows);

  writeCsv(paths.redirectBatch, [
    "old URL",
    "old source path",
    "new URL",
    "new target path",
    "redirect type",
    "activation status",
    "sitemap status",
    "notes"
  ], data.redirectRows);

  fs.writeFileSync(paths.report, `# Sprint 11I Public-Safe Author and Image-Ready Recovery Report

Generated: ${new Date().toISOString()}

## Summary

- Applied changes: ${data.result.applied ? "yes" : "no"}
- Sanity token detected: ${data.result.tokenDetected ? "yes" : "no"}
- Token printed: no
- Approved public posts before audit: ${data.result.approvedPublicPostsBefore}
- Approved public posts after audit: ${data.result.approvedPublicPostsAfter}
- Author reference corrections applied: ${data.result.authorCorrections}
- Duplicate public posts demoted: ${data.result.duplicateDemotions.length}
- Approved image-library assets catalogued: ${data.result.imageLibraryCount}
- Hidden image patches applied: ${data.result.imagePatchResults.length}
- Blog candidates reviewed: ${data.result.blogCandidatesReviewed}
- Blog articles approved in Sprint 11I: ${data.result.approvedCount}
- Blog articles kept hidden: ${data.result.keptHiddenCount}
- Static/service continuation rows: ${data.result.staticContinuationRows}
- Redirect rows selected: ${data.result.redirectRows}

## Approved Articles

${data.result.approvedThisRun.length ? data.result.approvedThisRun.map((item) => `- ${item.slug}: ${item.targetUrl}`).join("\n") : "- None."}

## Guardrails

- No DNS, Hostinger, Chaman Properties, raw backup, SQL dump, wp-config, or secret file was touched by this helper.
- Public blog author is governed by \`${AUTHOR_ID}\` / ${AUTHOR_NAME}.
- Redirects must be added only for public, 200, canonical-safe, sitemap-included targets.
- Hidden draft URLs must not be submitted to GSC/Bing.

## Output Files

- \`${paths.freshEvidence}\`
- \`${paths.authorAudit}\`
- \`${paths.imageLibrary}\`
- \`${paths.hiddenImageCleanup}\`
- \`${paths.legalReview}\`
- \`${paths.approvalBatch}\`
- \`${paths.staticContinuation}\`
- \`${paths.redirectBatch}\`
- \`${paths.resultJson}\`
`, "utf8");

  fs.writeFileSync(paths.resultJson, JSON.stringify(data.result, null, 2), "utf8");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
