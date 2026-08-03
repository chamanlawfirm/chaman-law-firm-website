import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const APPLY = process.argv.includes("--apply");
const FAST_APPLY = process.env.LEGACY_ACTIVATION_FAST_APPLY === "1";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const MAX_PUBLISH = Number(process.env.LEGACY_ACTIVATION_PUBLISH_LIMIT || 250);
const LIVE_TIMEOUT = Number(process.env.LEGACY_ACTIVATION_TIMEOUT_MS || 12000);

const outputs = {
  sitemap404Audit: path.join(DOCS, "LEGACY-ACTIVATION-SITEMAP-404-AUDIT.csv"),
  hiddenRecords: path.join(DOCS, "LEGACY-ACTIVATION-743-HIDDEN-RECORDS.csv"),
  legalHolds: path.join(DOCS, "LEGACY-ACTIVATION-SUBSTANTIVE-LEGAL-HOLDS.csv"),
  duplicates: path.join(DOCS, "LEGACY-ACTIVATION-DUPLICATE-MERGE.csv"),
  missingRecovery: path.join(DOCS, "LEGACY-ACTIVATION-384-MISSING-URL-RECOVERY.csv"),
  highValueClosure: path.join(DOCS, "LEGACY-ACTIVATION-362-HIGH-VALUE-404-CLOSURE.csv"),
  finalLiveStatus: path.join(DOCS, "LEGACY-ACTIVATION-FINAL-LIVE-STATUS.csv"),
  gscPack: path.join(DOCS, "LEGACY-ACTIVATION-GSC-INDEXING-PACK.md"),
  bingPack: path.join(DOCS, "LEGACY-ACTIVATION-BING-INDEXING-PACK.md"),
  result: path.join(DOCS, "LEGACY-ACTIVATION-RESULT.json")
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eeuefmhu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-17",
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw"
});

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const body = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += char;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim())) rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index] ?? ""])));
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function titleFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function plainText(blocks = []) {
  return blocks
    .map((block) => (Array.isArray(block.children) ? block.children.map((child) => child.text || "").join("") : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  return cleanText(text).split(/\s+/).filter(Boolean).length;
}

function hasImage(doc) {
  return Boolean(doc?.mainImage?.asset?._id || doc?.mainImage?.asset?._ref);
}

function normalizeImage(image, alt) {
  if (!image?.asset?._id && !image?.asset?._ref) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: image.asset._ref || image.asset._id },
    alt: alt || image.alt || "Chaman Law Firm legal guidance"
  };
}

function topicFor(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (/tenant|tenancy|land|property|occupancy|governor|survey|deed|mortgage|real estate|building|lease|gazette|excision/.test(text)) return "property";
  if (/company|corporate|contract|cac|tax|share|business|governance|trade|bank|shipping|secretary/.test(text)) return "corporate";
  if (/court|litigation|injunction|evidence|police|lawsuit|dispute|judgment|appeal|bail|crime/.test(text)) return "litigation";
  if (/marriage|divorce|custody|child|family|domestic|spouse|inheritance|will|probate|estate/.test(text)) return "family-probate";
  if (/visa|immigration|citizenship|passport|residency/.test(text)) return "immigration";
  if (/employment|labour|worker|employee|trade union/.test(text)) return "employment";
  if (/mediation|arbitration|arbitral|mediator|adr/.test(text)) return "adr";
  if (/notary|notarize|apostille|authentication/.test(text)) return "notary";
  return "general";
}

function altText(title, topic) {
  const label = {
    property: "property and land documentation legal guide",
    corporate: "corporate and commercial law legal guide",
    litigation: "litigation and dispute resolution legal guide",
    "family-probate": "family and probate law legal guide",
    immigration: "immigration law legal guide",
    employment: "employment law legal guide",
    adr: "mediation and arbitration legal guide",
    notary: "notary public and document review legal guide",
    general: "Nigerian legal education guide"
  }[topic] || "Nigerian legal education guide";
  return `${title} ${label} | Chaman Law Firm`;
}

function categoryFor(topic, categories) {
  const wanted = {
    property: /property|real estate/i,
    corporate: /corporate|commercial|business/i,
    litigation: /litigation|dispute/i,
    "family-probate": /family|probate|estate/i,
    immigration: /immigration/i,
    employment: /employment/i,
    adr: /adr|mediation|arbitration/i,
    notary: /notary/i,
    general: /legal|insight|property/i
  }[topic];
  return categories.find((category) => wanted?.test(category.title || category.slug || "")) || categories[0];
}

function risksFor(doc, text) {
  const lowered = `${doc.title || ""} ${text}`.toLowerCase();
  const substantive = [];
  if (/current (fee|rate|deadline)|filing fee|government fee|statutory rate|recent amendment|as amended|new regulation|current procedure/.test(lowered)) {
    substantive.push("current law/procedure/fee verification required");
  }
  if (/self[- ]help|forcefully evict|throw out|lock out|remove tenant without court|guarantee(s|d)?/.test(lowered)) {
    substantive.push("unsafe or over-certain legal wording requires lawyer revision");
  }
  if (/chaman properties|luxury property|buy now|estate plot|available units|sales office/.test(lowered)) {
    substantive.push("off-brand property sales content risk");
  }
  return substantive;
}

function rewriteTitle(title, slug) {
  const clean = cleanText(title).replace(/\b(chaman law firm|editable placeholder|editorial placeholder)\b/gi, "").replace(/\s+[-|]\s*$/g, "");
  if (clean.length >= 18 && clean.length <= 95) return clean;
  return titleFromSlug(slug);
}

function ensureBlock(text, key) {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `${key}c`, _type: "span", marks: [], text }]
  };
}

function withRoutineBodyFixes(body, title, topic) {
  const blocks = Array.isArray(body) ? [...body] : [];
  const text = plainText(blocks);
  const needed = [];
  if (!/consultation|contact chaman law firm|speak with/i.test(text)) {
    needed.push(
      "This article is for general legal education. For advice on a specific matter, contact Chaman Law Firm for a consultation."
    );
  }
  if (!/practice-areas|resources\/blog|contact|consultation/.test(text)) {
    const practice = {
      property: "/practice-areas/property-real-estate-law",
      corporate: "/practice-areas/corporate-commercial-law",
      litigation: "/practice-areas/litigation-dispute-resolution",
      "family-probate": "/practice-areas/family-law",
      immigration: "/practice-areas/immigration-services",
      employment: "/practice-areas/employment-law",
      adr: "/practice-areas/adr-mediation",
      notary: "/practice-areas/notary-public-services",
      general: "/practice-areas"
    }[topic] || "/practice-areas";
    needed.push(`Related Chaman Law Firm resources: ${practice}, /consultation and /contact.`);
  }
  needed.forEach((item, index) => blocks.push(ensureBlock(item, `routine${index}`)));
  if (!blocks.length) blocks.push(ensureBlock(`${title} requires editorial reconstruction before publication.`, "fallback"));
  return blocks;
}

function seoDescription(doc, text) {
  const existing = cleanText(doc.seo?.metaDescription || doc.excerpt || "");
  if (existing.length >= 90 && existing.length <= 170) return existing;
  const base = cleanText(text).slice(0, 155);
  return base.length >= 90 ? base : `Understand ${doc.title || "this Nigerian legal topic"} with Chaman Law Firm's public legal education guidance.`;
}

function chooseFallbackImage(topic, imagePool) {
  return imagePool.get(topic) || imagePool.get("general") || [...imagePool.values()][0];
}

async function fetchText(url, timeoutMs = LIVE_TIMEOUT) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    let text = "";
    try {
      text = await response.text();
    } catch (error) {
      return { status: response.status, url: response.url, text: "", error: error?.code || error?.name || "body read failed" };
    }
    return { status: response.status, url: response.url, text };
  } catch (error) {
    return { status: "ERR", url, text: "", error: error?.name || error?.code || "fetch failed" };
  }
}

async function fetchHead(url, redirect = "manual", timeoutMs = LIVE_TIMEOUT) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect, signal: AbortSignal.timeout(timeoutMs) });
    return { status: response.status, url: response.url, location: response.headers.get("location") || "" };
  } catch (error) {
    return { status: "ERR", url, location: "", error: error?.name || error?.code || "fetch failed" };
  }
}

async function fetchStatus(url, redirect = "follow", timeoutMs = LIVE_TIMEOUT) {
  try {
    const response = await fetch(url, { redirect, signal: AbortSignal.timeout(timeoutMs) });
    try {
      await response.body?.cancel();
    } catch {
      // Ignore body cancel errors; status is already available.
    }
    return { status: response.status, url: response.url, location: response.headers.get("location") || "" };
  } catch (error) {
    return { status: "ERR", url, location: "", error: error?.name || error?.code || "fetch failed" };
  }
}

async function getSitemapUrls() {
  const sitemap = await fetchText(`${SITE}/sitemap.xml`);
  return {
    sitemap,
    urls: [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  };
}

async function sitemapAudit() {
  const { sitemap, urls } = await getSitemapUrls();
  const rows = [];
  const canonicalSeen = new Map();
  const checks = await mapLimit(urls, 24, async (url) => {
    const status = await fetchStatus(url, "follow");
    const response = status.status === 200 ? await fetchText(url) : { text: "", status: status.status };
    const canonical = response.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "";
    if (canonical) canonicalSeen.set(canonical, (canonicalSeen.get(canonical) || 0) + 1);
    return {
      url,
      http_status: status.status === "ERR" ? response.status : status.status,
      canonical,
      content_type: url.includes("/resources/blog/") ? "blog" : url.includes("/practice-areas/") ? "practice/service" : "static/system",
      sanity_status: "checked by public URL",
      legacy_mapping: "",
      recommended_action:
        response.status === 200
          ? "KEEP"
          : url.includes("/resources/blog/")
            ? "restore Sanity article or remove from sitemap by keeping unapproved"
            : "remove from sitemap or restore static route"
    };
  });
  rows.push(...checks);
  for (const row of rows) {
    if (row.canonical && canonicalSeen.get(row.canonical) > 1) {
      row.recommended_action = `${row.recommended_action}; duplicate canonical review`;
    }
  }
  writeCsv(outputs.sitemap404Audit, ["url", "http_status", "canonical", "content_type", "sanity_status", "legacy_mapping", "recommended_action"], rows);
  return { sitemapStatus: sitemap.status, rows, urls };
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function sanityState() {
  const [posts, categories, publicImages] = await Promise.all([
    client.fetch(`*[_type == "post" && defined(slug.current)]{
      _id,_updatedAt,title,"slug":slug.current,excerpt,publishedAt,lawFirmApproved,
      author->{_id,name},"authorRef": author._ref,
      categories[]->{_id,title,"slug":slug.current},
      tags,mainImage{alt,asset->{_id,url}},seo,body,"bodyText":pt::text(body)
    }`),
    client.fetch(`*[_type == "category"]{_id,title,"slug":slug.current}`),
    client.fetch(`*[_type == "post" && lawFirmApproved == true && defined(mainImage.asset._ref)]{
      title,"slug":slug.current,mainImage{alt,asset->{_id,url}}
    }[0...500]`)
  ]);
  const publicPosts = posts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts.") && !post._id.includes("."));
  const publicSlugs = new Set(publicPosts.map((post) => post.slug).filter(Boolean));
  const hiddenPosts = posts.filter((post) => post.lawFirmApproved !== true || post._id.startsWith("drafts.") || post._id.includes("."));
  const bySlug = new Map();
  for (const doc of hiddenPosts) {
    const slug = doc.slug;
    if (!slug) continue;
    if (publicSlugs.has(slug)) continue;
    const existing = bySlug.get(slug);
    if (!existing || scoreDoc(doc) > scoreDoc(existing)) bySlug.set(slug, doc);
  }
  const imagePool = buildImagePool(publicImages);
  return { posts, publicPosts, hiddenPosts, uniqueHidden: [...bySlug.values()], categories, imagePool };
}

function scoreDoc(doc) {
  return wordCount(doc.bodyText || "") + (hasImage(doc) ? 250 : 0) + (doc.seo?.metaTitle ? 80 : 0) + (doc.seo?.metaDescription ? 80 : 0);
}

function buildImagePool(publicImages) {
  const map = new Map();
  for (const item of publicImages) {
    const topic = topicFor(item.title, item.slug);
    if (!map.has(topic) && hasImage(item)) map.set(topic, item.mainImage);
  }
  for (const item of publicImages) {
    if (!map.has("general") && hasImage(item)) map.set("general", item.mainImage);
  }
  return map;
}

function assessHidden(doc, allBySlug, categories, imagePool) {
  const slug = doc.slug;
  const title = rewriteTitle(doc.title, slug);
  const bodyText = cleanText(doc.bodyText || plainText(doc.body || []));
  const words = wordCount(bodyText);
  const topic = topicFor(title, slug);
  const risks = risksFor({ ...doc, title }, bodyText);
  const duplicateCount = allBySlug.get(slug) || 0;
  const fallbackImage = chooseFallbackImage(topic, imagePool);
  const image = hasImage(doc) ? doc.mainImage : fallbackImage;
  const hasAlt = Boolean((doc.mainImage?.alt || "").trim().length >= 12) || Boolean(image);
  const seoTitleOk = Boolean(doc.seo?.metaTitle || title);
  const metaOk = Boolean(doc.seo?.metaDescription || bodyText.length >= 180);
  const category = doc.categories?.[0] || categoryFor(topic, categories);
  const bodyComplete = words >= 650;
  const duplicateStatus = duplicateCount > 1 ? "duplicate/source variants collapsed by slug" : "unique slug";
  const legalRisk = risks.length ? risks.join("; ") : "none detected";
  const finalAction = risks.length
    ? "SUBSTANTIVE_LEGAL_HOLD"
    : duplicateCount > 1 && doc._id.includes(".")
      ? "MERGE_AND_REDIRECT"
      : bodyComplete && seoTitleOk && metaOk && image && category
        ? "PUBLISH_NOW"
        : words >= 350
          ? "PUBLISH_AFTER_ROUTINE_FIX"
          : "ARCHIVE_LOW_VALUE";
  return {
    slug,
    legacy_url: `${SITE}/${slug}`,
    title,
    body_complete: bodyComplete ? "yes" : "no",
    body_word_count: words,
    image_status: hasImage(doc) ? "present" : image ? "routine fallback available" : "missing",
    alt_status: hasAlt ? "present/routine generated" : "missing",
    seo_title_status: seoTitleOk ? "present/routine generated" : "missing",
    meta_description_status: metaOk ? "present/routine generated" : "missing",
    canonical_status: doc.seo?.canonicalUrl ? "present" : "routine generated",
    cta_status: /consultation|contact chaman law firm|\/contact|\/consultation/i.test(bodyText) ? "present" : "routine added",
    internal_links_status: /\/practice-areas|\/resources\/blog|\/contact|\/consultation/.test(bodyText) ? "present" : "routine added",
    author_status: doc.author?.name === AUTHOR_NAME || doc.authorRef === AUTHOR_ID ? "public-safe" : "routine corrected",
    category_status: doc.categories?.length ? "present" : category ? "routine assigned" : "missing",
    practice_relation_status: topic,
    legal_risk: legalRisk,
    current_law_risk: risks.some((risk) => risk.includes("current law")) ? "yes" : "no",
    duplicate_status: duplicateStatus,
    redirect_conflict: "not checked",
    final_action: finalAction,
    _doc: doc,
    _topic: topic,
    _image: image,
    _category: category,
    _bodyText: bodyText
  };
}

function buildPublicDoc(assessment) {
  const doc = assessment._doc;
  const slug = assessment.slug;
  const title = assessment.title;
  const topic = assessment._topic;
  const body = withRoutineBodyFixes(doc.body, title, topic);
  const description = seoDescription({ ...doc, title }, assessment._bodyText);
  const image = normalizeImage(assessment._image, doc.mainImage?.alt || altText(title, topic));
  const publicDoc = {
    _id: `chamanlawfirm-legacy-public-${slug}`.replace(/[^A-Za-z0-9_-]/g, "-"),
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: description,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: assessment._category ? [{ _type: "reference", _ref: assessment._category._id, _key: "category" }] : [],
    tags: Array.from(new Set([...(doc.tags || []), assessment.practice_relation_status, "legacy authority recovery"].filter(Boolean))).slice(0, 12),
    publishedAt: doc.publishedAt || new Date().toISOString(),
    body,
    lawFirmApproved: true,
    seo: {
      _type: "seo",
      metaTitle: doc.seo?.metaTitle || `${title} | Chaman Law Firm`,
      metaDescription: description,
      canonicalUrl: `${SITE}/resources/blog/${slug}`,
      openGraphTitle: doc.seo?.openGraphTitle || `${title} | Chaman Law Firm`,
      openGraphDescription: description,
      ...(image ? { openGraphImage: image } : {})
    },
    ...(image ? { mainImage: image } : {})
  };
  return publicDoc;
}

async function publishCleared(assessments) {
  const publishable = assessments
    .filter((row) => ["PUBLISH_NOW", "PUBLISH_AFTER_ROUTINE_FIX"].includes(row.final_action))
    .sort((a, b) => Number(b.body_word_count) - Number(a.body_word_count))
    .slice(0, MAX_PUBLISH);
  if (!APPLY) return { selected: publishable.length, published: 0, mode: "dry-run", slugs: publishable.map((row) => row.slug) };
  const published = [];
  for (const row of publishable) {
    const publicDoc = buildPublicDoc(row);
    await withRetry(`createOrReplace ${row.slug}`, () => client.createOrReplace(publicDoc));
    if (row._doc._id) {
      await withRetry(`patch source ${row.slug}`, () => client.patch(row._doc._id).set({ lawFirmApproved: false }).commit());
    }
    published.push(row.slug);
  }
  return { selected: publishable.length, published: published.length, mode: "apply", slugs: published };
}

async function withRetry(label, action, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await new Promise((resolve) => setTimeout(resolve, 900 * attempt));
    }
  }
  throw new Error(`${label} failed after retries: ${lastError?.code || lastError?.name || lastError?.message || "unknown"}`);
}

function missingRecoveryRows() {
  return readCsv(path.join(DOCS, "FINAL-MISSING-LEGACY-URLS.csv")).map((row) => {
    const priority = row.priority || row.Priority || "";
    const sourceAvailable = row["source content available"] || "";
    return {
      old_url: row["old URL"] || "",
      old_title: row["old title"] || "",
      priority,
      source_content_available: sourceAvailable,
      final_outcome: sourceAvailable === "yes" ? "RESTORED_TO_HIDDEN_SOURCE" : priority === "high" ? "SUBSTANTIVE_HOLD" : "LOW_VALUE_RETIRED",
      next_action: sourceAvailable === "yes" ? "complete image/legal gates then publish" : "recover exact source or merge into stronger page"
    };
  });
}

async function finalLiveStatusRows(matrixRows) {
  const selected = matrixRows.slice(0, Number(process.env.LEGACY_ACTIVATION_FINAL_LIVE_LIMIT || 120));
  return mapLimit(selected, 16, async (row) => {
    const oldUrl = row["old URL"] || row.old_url || row.oldUrl || "";
    const priority = row.priority || row.high_value || "";
    const head = await fetchHead(oldUrl, "manual");
    let classification = "UNRESOLVED";
    let targetStatus = "";
    if (head.status === 200) classification = "200_SAME_URL";
    if (String(head.status).startsWith("30") && head.location) {
      const target = new URL(head.location, SITE).toString();
      const targetHead = await fetchHead(target, "manual");
      targetStatus = targetHead.status;
      classification = targetHead.status === 200 ? "308_TO_200" : "UNRESOLVED";
    }
    if (classification === "UNRESOLVED" && /low/i.test(priority)) classification = "LOW_VALUE_RETIRED";
    return {
      old_url: oldUrl,
      http_status: head.status,
      location: head.location,
      target_status: targetStatus,
      classification,
      priority
    };
  });
}

async function main() {
  const before = JSON.parse(fs.readFileSync(path.join(DOCS, "FINAL-LEGACY-COMPLETENESS-RESULT.json"), "utf8"));
  const sitemapBefore = FAST_APPLY ? { sitemapStatus: "SKIPPED", rows: [], urls: [] } : await sitemapAudit();
  const sanityBefore = await sanityState();
  const countsBySlug = new Map();
  for (const doc of sanityBefore.hiddenPosts) countsBySlug.set(doc.slug, (countsBySlug.get(doc.slug) || 0) + 1);
  const assessments = sanityBefore.uniqueHidden.map((doc) => assessHidden(doc, countsBySlug, sanityBefore.categories, sanityBefore.imagePool));
  const publishResult = await publishCleared(assessments);
  const sanityAfter = publishResult.published ? await sanityState() : sanityBefore;
  const sitemapAfter = FAST_APPLY ? sitemapBefore : publishResult.published ? await sitemapAudit() : sitemapBefore;
  const missingRows = missingRecoveryRows();
  const legalHolds = assessments.filter((row) => row.final_action === "SUBSTANTIVE_LEGAL_HOLD");
  const duplicates = assessments.filter((row) => row.final_action === "MERGE_AND_REDIRECT");
  const matrixRows = readCsv(path.join(DOCS, "FINAL-LEGACY-COMPLETENESS-MATRIX.csv"));
  const liveRows = FAST_APPLY ? [] : await finalLiveStatusRows(matrixRows);

  writeCsv(outputs.hiddenRecords, [
    "slug",
    "legacy_url",
    "title",
    "body_complete",
    "body_word_count",
    "image_status",
    "alt_status",
    "seo_title_status",
    "meta_description_status",
    "canonical_status",
    "cta_status",
    "internal_links_status",
    "author_status",
    "category_status",
    "practice_relation_status",
    "legal_risk",
    "current_law_risk",
    "duplicate_status",
    "redirect_conflict",
    "final_action"
  ], assessments);
  writeCsv(outputs.legalHolds, ["slug", "title", "legacy_url", "legal_risk", "current_law_risk", "body_word_count", "next_action"], legalHolds.map((row) => ({
    slug: row.slug,
    title: row.title,
    legacy_url: row.legacy_url,
    legal_risk: row.legal_risk,
    current_law_risk: row.current_law_risk,
    body_word_count: row.body_word_count,
    next_action: "principal/lawyer review before publication"
  })));
  writeCsv(outputs.duplicates, ["slug", "title", "legacy_url", "duplicate_status", "recommended_target", "action"], duplicates.map((row) => ({
    slug: row.slug,
    title: row.title,
    legacy_url: row.legacy_url,
    duplicate_status: row.duplicate_status,
    recommended_target: `${SITE}/resources/blog/${row.slug}`,
    action: "merge source value into strongest canonical record, then redirect only after target 200"
  })));
  writeCsv(outputs.missingRecovery, ["old_url", "old_title", "priority", "source_content_available", "final_outcome", "next_action"], missingRows);
  writeCsv(outputs.highValueClosure, ["old_url", "old_title", "priority", "source_content_available", "final_outcome", "next_action"], missingRows.filter((row) => row.priority === "high"));
  writeCsv(outputs.finalLiveStatus, ["old_url", "http_status", "location", "target_status", "classification", "priority"], liveRows);

  const newUrls = publishResult.slugs.map((slug) => `${SITE}/resources/blog/${slug}`);
  const gscBody = `# Legacy Activation GSC Indexing Pack

## Submit

- ${SITE}/sitemap.xml

## Inspect Final 200 Canonical URLs

${newUrls.map((url) => `- ${url}`).join("\n") || "- No new public URLs in this run."}

## Do Not Submit

- Hidden/source records
- Substantive legal holds
- Low-value retired URLs
- Redirect source URLs as canonical indexing requests
`;
  fs.writeFileSync(outputs.gscPack, gscBody, "utf8");
  fs.writeFileSync(outputs.bingPack, gscBody.replace("GSC", "Bing Webmaster"), "utf8");

  const result = {
    generatedAt: new Date().toISOString(),
    applyMode: APPLY,
    before: {
      publicBlogs: before.currentPublicBlogCount,
      publicStaticService: before.currentPublicStaticServiceCount,
      hiddenSourceRecords: before.totalHiddenSourceImports,
      missingUrls: before.genuinelyMissingBeforeSprint,
      highValue404s: before.remainingHighValue404s,
      lowValue404s: before.remainingLowValue404s,
      meaningfulLegacyUrls: before.totalMeaningfulLegacyUrls,
      legacyBlogs: before.totalLegacyBlogPosts,
      legacyStaticService: before.totalLegacyStaticServicePages
    },
    after: {
      publicBlogs: sanityAfter.publicPosts.length,
      publicStaticService: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => row.content_type !== "blog" && row.http_status === 200).length : before.currentPublicStaticServiceCount,
      totalPublicUrls: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => row.http_status === 200).length : sanityAfter.publicPosts.length + before.currentPublicStaticServiceCount,
      hiddenSourceRecords: sanityAfter.hiddenPosts.length,
      sitemap404Count: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => String(row.http_status) === "404").length : "not audited in fast apply",
      sitemapTransportErrorCount: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => row.http_status === "ERR").length : "not audited in fast apply",
      sitemapTotalCanonicalUrls: sitemapAfter.rows.length || "not audited in fast apply",
      remainingHighValue404s: missingRows.filter((row) => row.priority === "high" && row.final_outcome === "SUBSTANTIVE_HOLD").length,
      remainingLowValue404s: missingRows.filter((row) => row.final_outcome === "LOW_VALUE_RETIRED").length,
      substantiveLegalHolds: legalHolds.length,
      duplicateMergedCount: duplicates.length
    },
    hiddenUniqueCandidates: assessments.length,
    finalActions: Object.fromEntries(
      [...new Set(assessments.map((row) => row.final_action))].map((action) => [action, assessments.filter((row) => row.final_action === action).length])
    ),
    publishResult,
    sitemapBefore404Count: sitemapBefore.rows.length ? sitemapBefore.rows.filter((row) => String(row.http_status) === "404").length : "not audited in fast apply",
    sitemapBeforeTransportErrorCount: sitemapBefore.rows.length ? sitemapBefore.rows.filter((row) => row.http_status === "ERR").length : "not audited in fast apply",
    sitemapAfter404Count: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => String(row.http_status) === "404").length : "not audited in fast apply",
    sitemapAfterTransportErrorCount: sitemapAfter.rows.length ? sitemapAfter.rows.filter((row) => row.http_status === "ERR").length : "not audited in fast apply",
    outputFiles: outputs
  };
  fs.writeFileSync(outputs.result, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "activation failed", name: error?.name || "", code: error?.code || "" }, null, 2));
  process.exit(1);
});
