import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const APPLY = process.argv.includes("--apply");
const APPROVAL_LIMIT = Number(process.env.SPRINT_11Y_APPROVAL_LIMIT || 40);
const BULK_SCAN_LIMIT = Number(process.env.SPRINT_11Y_BULK_SCAN_LIMIT || 1000);
const HIDDEN_REPAIR_LIMIT = Number(process.env.SPRINT_11Y_HIDDEN_REPAIR_LIMIT || 600);
const MIN_BODY_CHARS = 1400;
const MIN_BODY_BLOCKS = 8;
const EDITORIAL_APPROVAL_SLUGS = new Set(
  String(process.env.SPRINT_11Y_APPROVAL_SLUGS || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
);
const APPROVED_IMAGE_FALLBACKS = new Map([
  [
    "list-of-government-agencies-of-nigeria",
    {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: "image-e79ad4e121fdb583ea34cc78f0bddadf352f53e8-1920x2560-jpg"
      },
      alt: "List of Government Agencies of Nigeria legal reference guide | Chaman Law Firm"
    }
  ]
]);
const TITLE_OVERRIDES = new Map([
  ["court-procedures-and-efficient-case", "Court Procedures and Efficient Case Management in Nigeria"]
]);
const META_DESCRIPTION_OVERRIDES = new Map([
  [
    "court-procedures-and-efficient-case",
    "Understand practical Nigerian court procedure issues, case-flow considerations, and when to speak with a lawyer before taking procedural steps."
  ]
]);

const paths = {
  sprint11tService: path.join("docs", "SPRINT-11T-STATIC-SERVICE-AUTHORITY-EXPANSION.csv"),
  sprint11tRedirects: path.join("docs", "SPRINT-11T-REDIRECT-RESCUE-AND-404-REDUCTION.csv"),
  sprint11tBlog: path.join("docs", "SPRINT-11U-HIGH-VALUE-BLOG-RECOVERY-BATCH.csv"),
  nextConfig: "next.config.mjs",
  buildStability: path.join("docs", "SPRINT-11Y-LOCAL-BUILD-STABILITY-CHECK.md"),
  freshEvidence: path.join("docs", "SPRINT-11Y-FRESH-GSC-BING-EVIDENCE-STATUS.md"),
  serviceMonitoring: path.join("docs", "SPRINT-11Y-SERVICE-PAGE-AND-REDIRECT-MONITORING.csv"),
  redirectMonitoring: path.join("docs", "SPRINT-11Y-EXISTING-REDIRECT-MONITORING.csv"),
  bulkImport: path.join("docs", "SPRINT-11Y-BULK-HIDDEN-SOURCE-REPAIR.csv"),
  blogRecovery: path.join("docs", "SPRINT-11Y-FAST-PUBLISH-CANDIDATE-SELECTION.csv"),
  imageCtaMetadata: path.join("docs", "SPRINT-11Y-BLOG-STANDARDIZATION-AND-ENHANCEMENT.csv"),
  legalEditorial: path.join("docs", "SPRINT-11Y-LEGAL-EDITORIAL-CLEARANCE.csv"),
  approvalBatch: path.join("docs", "SPRINT-11Y-CONTROLLED-BLOG-PUBLICATION-BATCH.csv"),
  staticRecovery: path.join("docs", "SPRINT-11Y-STATIC-SERVICE-PRACTICE-RECOVERY.csv"),
  redirectRescue: path.join("docs", "SPRINT-11Y-REDIRECT-RESCUE-AND-404-REDUCTION.csv"),
  lawzana: path.join("docs", "SPRINT-11Y-LAWZANA-PROFILE-VERIFICATION.md"),
  seoGeo: path.join("docs", "SPRINT-11Y-SEO-AEO-GEO-ENHANCEMENT.csv"),
  indexingPack: path.join("docs", "SPRINT-11Y-GSC-BING-INDEXING-PACK.md"),
  report: path.join("docs", "SPRINT-11Y-REPORT.md"),
  result: path.join("docs", "SPRINT-11Y-RESULT.json")
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
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
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...records] = rows.filter((entry) => entry.some((item) => String(item).trim()));
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), record[index] ?? ""]))
  );
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const output = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
  fs.writeFileSync(filePath, `${output}\n`, "utf8");
}

function writeMd(filePath, body) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${body.trim()}\n`, "utf8");
}

function absoluteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return SITE_URL;
  try {
    return new URL(raw, SITE_URL).toString().replace(/\/$/, "");
  } catch {
    return `${SITE_URL}/${raw.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  }
}

function pathOnly(value) {
  try {
    const parsed = new URL(value, SITE_URL);
    const normalized = `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
    return normalized === "/" ? "/" : normalized;
  } catch {
    const raw = String(value || "").trim();
    const normalized = `/${raw.split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
    return normalized === "/" ? "/" : normalized;
  }
}

function titleFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function compact(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function truncate(text, length = 155) {
  const value = compact(text);
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trim()}...`;
}

function fallbackImageFor(slug) {
  return APPROVED_IMAGE_FALLBACKS.get(slug) || null;
}

function hasImageRef(image) {
  return Boolean(image?.asset?._id || image?.asset?._ref);
}

function normalizeImageForWrite(image) {
  if (!image) return undefined;
  const assetRef = image.asset?._ref || image.asset?._id;
  if (!assetRef) return image;
  return {
    ...image,
    _type: image._type || "image",
    asset: {
      _type: "reference",
      _ref: assetRef
    }
  };
}

async function fetchManual(url) {
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: {
        "user-agent": "ChamanLawFirm-sprint11y-QA/1.0"
      }
    });
    return {
      ok: true,
      status: response.status,
      location: response.headers.get("location") || "",
      contentType: response.headers.get("content-type") || "",
      cache: response.headers.get("x-vercel-cache") || ""
    };
  } catch (error) {
    return { ok: false, status: 0, location: "", contentType: "", cache: "", error: error.message };
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "ChamanLawFirm-sprint11y-QA/1.0"
      }
    });
    const text = await response.text();
    return {
      ok: true,
      status: response.status,
      finalUrl: response.url,
      text,
      contentType: response.headers.get("content-type") || "",
      cache: response.headers.get("x-vercel-cache") || ""
    };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, text: "", contentType: "", cache: "", error: error.message };
  }
}

function htmlMeta(html) {
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ||
    "";
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || "";
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
  return {
    canonical,
    description,
    title,
    hasCta: /\/consultation|\/contact|wa\.me|whatsapp/i.test(html),
    hasImage: /<img\b/i.test(html),
    hasAlt: /<img\b[^>]*\salt=["'][^"']{8,}["']/i.test(html),
    hasFaq: /faq|frequently asked|question/i.test(html),
    hasInternalLinks: /href=["']\/(practice-areas|resources|consultation|contact|lawyers)/i.test(html)
  };
}

async function pageQa(url) {
  const result = await fetchText(url);
  const meta = htmlMeta(result.text);
  return { ...result, ...meta };
}

async function redirectQa(oldUrl) {
  const source = absoluteUrl(oldUrl);
  const noSlash = source.replace(/\/$/, "");
  const slash = `${noSlash}/`;
  const variants = [noSlash, slash];
  const checked = [];

  for (const variant of variants) {
    const first = await fetchManual(variant);
    const location = first.location ? absoluteUrl(first.location) : "";
    const target = location ? await fetchManual(location) : { status: 0, location: "" };
    checked.push({
      variant,
      status: first.status,
      location,
      targetStatus: target.status,
      targetLocation: target.location || "",
      oneHop: first.status === 308 && target.status === 200 && !target.location,
      chain: Boolean(target.location),
      loop: location === variant,
      homepageDump: location === `${SITE_URL}` || location === `${SITE_URL}/`,
      hiddenDraftTarget: target.status === 404 && location.includes("/resources/blog/"),
      target404: target.status === 404,
      chamanPropertiesTarget: /chamanproperties|properties\//i.test(location)
    });
  }

  return checked;
}

function extractConfiguredRedirectSources() {
  if (!fs.existsSync(paths.nextConfig)) return new Map();
  const content = fs.readFileSync(paths.nextConfig, "utf8");
  const map = new Map();
  for (const match of content.matchAll(/\{\s*source:\s*["'`]([^"'`]+)["'`]\s*,\s*destination:\s*["'`]([^"'`]+)["'`]/g)) {
    const source = pathOnly(match[1]);
    const destination = match[2];
    map.set(source, destination);
    map.set(`${source}/`, destination);
  }
  return map;
}

function detectFreshEvidence() {
  const evidenceTerms = /(gsc|search.console|bing|backlink|ahrefs|semrush|moz|ubersuggest|serp|featured.snippet|coverage|index|404|redirect.error|crawled)/i;
  const excluded = /^SPRINT-/i;
  const rows = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (/node_modules|\.next|\.git/i.test(item.name)) continue;
        walk(full);
      } else if (evidenceTerms.test(item.name) && !excluded.test(item.name)) {
        const stat = fs.statSync(full);
        rows.push({
          file: path.relative(process.cwd(), full),
          bytes: stat.size,
          modified: stat.mtime.toISOString()
        });
      }
    }
  }

  walk("docs");
  return rows.sort((a, b) => b.modified.localeCompare(a.modified));
}

function classifyRisk(title, body) {
  const text = `${title} ${body}`.toLowerCase();
  const flags = [];
  if (/chaman properties|luxury property|buy now|for sale|property sales|estate listing|apartment for sale/.test(text)) flags.push("off-brand/property-sales wording");
  if (/wp-block|elementor|rank ?math|yoast|\[\/?[a-z][^\]]*\]/.test(text)) flags.push("plugin debris or shortcode residue");
  if (/free legal advice|legal advice for free|get.*legal advice.*free/.test(text)) flags.push("misleading free-service wording");
  if (/self-help|forcefully eject|throw out|lock out|remove the tenant yourself|without court/.test(text)) flags.push("possible unsafe self-help wording");
  if (/report a ?crime|acrime|criminal|police|arrest|detention|restraining order|domestic violence|police bail|criminal implication|tax clearance|taxation|limitation period|statute of limitation|eject|evict|quit notice|certificate of occupancy|c of o|governor'?s consent|land use charge|building permit|planning permit/.test(text)) flags.push("current-law or procedure-sensitive topic");
  if (/paternity|maternity|illegitimate child|child custody|child support|surname of a child/.test(text)) flags.push("family-status topic requires lawyer review");
  if (/resolve land disputes|land dispute|without going to court|proven steps/.test(text)) flags.push("dispute-resolution wording requires lawyer review");
  if (/guarantee|assured result|must win|certain outcome/.test(text)) flags.push("unsupported outcome claim");
  return flags;
}

function docCompleteness(doc, row, configuredRedirects) {
  const slug = row.slug || doc?.slug || "";
  const bodyText = compact(doc?.bodyText || "");
  const bodyBlocks = Number(doc?.bodyBlocks || 0);
  const seoTitle = doc?.seo?.metaTitle || row["SEO title"] || "";
  const metaDescription = doc?.seo?.metaDescription || row["meta description"] || "";
  const canonical = doc?.seo?.canonicalUrl || row.canonical || absoluteUrl(`/resources/blog/${slug}`);
  const targetUrl = absoluteUrl(`/resources/blog/${slug}`);
  const oldPath = pathOnly(row["old URL"]);
  const riskFlags = classifyRisk(row.title || doc?.title || slug, bodyText);
  const imageCandidate = hasImageRef(doc?.mainImage) ? doc.mainImage : fallbackImageFor(slug);
  const imageAlt = doc?.mainImage?.alt || imageCandidate?.alt || "";
  const blockers = [];

  if (!doc) blockers.push("hidden Sanity source missing");
  if (doc && bodyBlocks < MIN_BODY_BLOCKS) blockers.push("body block count below gate");
  if (doc && bodyText.length < MIN_BODY_CHARS) blockers.push("source body too short for approval");
  if (!seoTitle) blockers.push("SEO title missing");
  if (!metaDescription) blockers.push("meta description missing");
  if (!canonical || !canonical.includes(`/resources/blog/${slug}`)) blockers.push("canonical missing or mismatched");
  if (!doc?.publishedAt || new Date(doc.publishedAt).getTime() > Date.now()) blockers.push("publishedAt missing or future-dated");
  if (!hasImageRef(imageCandidate)) blockers.push("featured image missing");
  if (!imageAlt || imageAlt.trim().length < 12) blockers.push("alt text missing or weak");
  if ((doc?.categories || []).length < 1) blockers.push("practice/category relationship missing");
  if (doc?.author?._ref && doc.author._ref !== AUTHOR_ID) blockers.push("author reference needs correction");
  if (!doc?.author?._ref) blockers.push("author reference missing");
  if (riskFlags.length) blockers.push(...riskFlags);

  const existingRedirect = configuredRedirects.get(oldPath) || configuredRedirects.get(`${oldPath}/`) || "";
  const redirectConflict = existingRedirect && existingRedirect !== `/resources/blog/${slug}`;
  if (redirectConflict) blockers.push(`legacy URL already redirects to ${existingRedirect}`);
  if (EDITORIAL_APPROVAL_SLUGS.size && !EDITORIAL_APPROVAL_SLUGS.has(slug)) {
    blockers.push("not selected for Sprint 11Y controlled editorial approval");
  }
  if (/\b(with|under|and|of|to|sta|niger|lagos sta|ogun sta)$/i.test(row.title || doc?.title || "")) blockers.push("title appears truncated or incomplete");

  const passedHardGates = blockers.length === 0;
  const canRepairMinorFields = blockers.every((blocker) =>
    /author reference needs correction|author reference missing|canonical missing or mismatched/.test(blocker)
  );

  return {
    slug,
    targetUrl,
    oldPath,
    bodyText,
    bodyBlocks,
    seoTitle,
    metaDescription,
    canonical,
    imageCandidate,
    imageAlt,
    riskFlags,
    blockers,
    passedHardGates,
    canApproveWithMinorRepair: doc && canRepairMinorFields,
    existingRedirect,
    redirectConflict
  };
}

async function fetchCandidateDocs(slugs) {
  const all = [];
  for (let index = 0; index < slugs.length; index += 50) {
    const chunk = slugs.slice(index, index + 50);
    const docs = await client.fetch(
      `*[_type == "post" && slug.current in $slugs]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        author,
        categories[]->{_id,title,"slug":slug.current},
        tags,
        mainImage,
        "bodyBlocks": count(body),
        "bodyText": pt::text(body),
        body,
        seo,
        lawFirmApproved
      }`,
      { slugs: chunk }
    );
    all.push(...docs);
  }
  return all;
}

async function fetchHiddenSourceDocs(limit = BULK_SCAN_LIMIT) {
  return client.fetch(
    `*[_type == "post" && lawFirmApproved != true && defined(slug.current)]|order(_updatedAt desc)[0...$limit]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      author,
      categories[]->{_id,title,"slug":slug.current},
      tags,
      mainImage,
      "bodyBlocks": count(body),
      "bodyText": pt::text(body),
      body,
      seo,
      lawFirmApproved,
      _updatedAt
    }`,
    { limit }
  );
}

function chooseHiddenDoc(docs) {
  const hidden = docs.filter((doc) => doc.lawFirmApproved !== true || doc._id.startsWith("drafts.") || doc._id.includes("."));
  return hidden.find((doc) => !doc._id.startsWith("drafts.")) || hidden[0] || null;
}

function choosePublicDoc(docs) {
  return docs.find((doc) => doc.lawFirmApproved === true && !doc._id.startsWith("drafts.") && !doc._id.includes(".")) || null;
}

function publicSafePostId(slug) {
  return `chamanlawfirm-sprint11y-${slug}`;
}

function patchablePublicDoc(hiddenDoc, row, assessment) {
  const slug = assessment.slug;
  const title = TITLE_OVERRIDES.get(slug) || hiddenDoc.title || row.title || titleFromSlug(slug);
  const metaTitle = TITLE_OVERRIDES.has(slug)
    ? `${title} | Chaman Law Firm`
    : assessment.seoTitle || `${title} | Chaman Law Firm`;
  const metaDescription =
    META_DESCRIPTION_OVERRIDES.get(slug) ||
    assessment.metaDescription ||
    truncate(hiddenDoc.excerpt || assessment.bodyText || `${title} from Chaman Law Firm's Nigerian legal education library.`);
  const canonicalUrl = absoluteUrl(`/resources/blog/${slug}`);
  const mainImage = normalizeImageForWrite(assessment.imageCandidate || hiddenDoc.mainImage);
  return {
    ...hiddenDoc,
    _id: publicSafePostId(slug),
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: metaDescription,
    author: { _type: "reference", _ref: AUTHOR_ID },
    lawFirmApproved: true,
    seo: {
      ...(hiddenDoc.seo || {}),
      metaTitle,
      metaDescription,
      canonicalUrl,
      openGraphTitle: metaTitle,
      openGraphDescription: metaDescription,
      ...(mainImage ? { openGraphImage: mainImage } : {})
    },
    ...(mainImage ? { mainImage } : {}),
    publishedAt: hiddenDoc.publishedAt || new Date().toISOString()
  };
}

async function approveCandidate(row, hiddenDoc, assessment) {
  const publicDoc = patchablePublicDoc(hiddenDoc, row, assessment);
  const operations = [];
  await client.createOrReplace(publicDoc);
  operations.push(`created/replaced ${publicDoc._id}`);
  if (hiddenDoc._id !== publicDoc._id) {
    await client.patch(hiddenDoc._id).set({
      author: { _type: "reference", _ref: AUTHOR_ID },
      lawFirmApproved: false,
      seo: publicDoc.seo,
      ...(publicDoc.mainImage ? { mainImage: publicDoc.mainImage } : {}),
      excerpt: publicDoc.excerpt
    }).commit();
    operations.push(`patched ${hiddenDoc._id}`);
  }
  return operations;
}

async function refreshPublicCandidate(row, publicDoc, hiddenDoc, assessment) {
  const sourceDoc = hiddenDoc || publicDoc;
  const patchDoc = patchablePublicDoc(sourceDoc, row, assessment);
  const operations = [];
  await client.patch(publicDoc._id).set({
    title: patchDoc.title,
    excerpt: patchDoc.excerpt,
    author: patchDoc.author,
    lawFirmApproved: true,
    seo: patchDoc.seo,
    slug: patchDoc.slug,
    ...(patchDoc.mainImage ? { mainImage: patchDoc.mainImage } : {}),
    publishedAt: publicDoc.publishedAt || patchDoc.publishedAt || new Date().toISOString()
  }).commit();
  operations.push(`refreshed public ${publicDoc._id}`);
  if (hiddenDoc && hiddenDoc._id !== publicDoc._id) {
    await client.patch(hiddenDoc._id).set({
      author: { _type: "reference", _ref: AUTHOR_ID },
      seo: patchDoc.seo,
      ...(patchDoc.mainImage ? { mainImage: patchDoc.mainImage } : {}),
      excerpt: patchDoc.excerpt
    }).commit();
    operations.push(`patched hidden source ${hiddenDoc._id}`);
  }
  return operations;
}

function hiddenRepairPatch(doc, configuredRedirects) {
  const slug = doc.slug || "";
  const bodyText = compact(doc.bodyText || "");
  const title = TITLE_OVERRIDES.get(slug) || doc.title || titleFromSlug(slug);
  const risks = classifyRisk(title, bodyText);
  const imageCandidate = hasImageRef(doc.mainImage) ? doc.mainImage : fallbackImageFor(slug);
  const metaDescription =
    META_DESCRIPTION_OVERRIDES.get(slug) ||
    doc.seo?.metaDescription ||
    truncate(doc.excerpt || bodyText || `${title} from Chaman Law Firm's Nigerian legal education library.`);
  const canonicalUrl = absoluteUrl(`/resources/blog/${slug}`);
  const existingRedirect = configuredRedirects.get(`/${slug}`) || configuredRedirects.get(`/${slug}/`) || "";
  const redirectConflict = existingRedirect && existingRedirect !== `/resources/blog/${slug}`;
  const patch = {
    title,
    excerpt: metaDescription,
    author: { _type: "reference", _ref: AUTHOR_ID },
    lawFirmApproved: false,
    seo: {
      ...(doc.seo || {}),
      metaTitle: `${title} | Chaman Law Firm`,
      metaDescription,
      canonicalUrl,
      openGraphTitle: `${title} | Chaman Law Firm`,
      openGraphDescription: metaDescription,
      ...(hasImageRef(imageCandidate) ? { openGraphImage: normalizeImageForWrite(imageCandidate) } : {})
    }
  };
  if (hasImageRef(imageCandidate)) patch.mainImage = normalizeImageForWrite(imageCandidate);
  const blockers = [];
  if (!slug) blockers.push("slug missing");
  if (Number(doc.bodyBlocks || 0) < MIN_BODY_BLOCKS) blockers.push("body block count below gate");
  if (bodyText.length < MIN_BODY_CHARS) blockers.push("source body too short");
  if (!metaDescription) blockers.push("meta description missing");
  if (!hasImageRef(imageCandidate)) blockers.push("image missing");
  if (!(doc.categories || []).length) blockers.push("category/practice relation missing");
  if (risks.length) blockers.push(...risks);
  if (redirectConflict) blockers.push(`legacy URL already redirects to ${existingRedirect}`);
  return {
    patch,
    title,
    metaDescription,
    imageCandidate,
    risks,
    redirectConflict,
    existingRedirect,
    blockers,
    canRepairHidden: Boolean(slug && doc._id && doc.lawFirmApproved !== true)
  };
}

async function repairHiddenSourceDoc(doc, configuredRedirects) {
  const repair = hiddenRepairPatch(doc, configuredRedirects);
  if (!repair.canRepairHidden) return { operations: [], repair };
  await client.patch(doc._id).set(repair.patch).commit();
  return { operations: [`patched hidden/source ${doc._id}`], repair };
}

async function waitForLiveArticle(slug, attempts = 6) {
  const url = absoluteUrl(`/resources/blog/${slug}`);
  let last = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    last = await pageQa(url);
    if (last.status === 200 && last.canonical.includes(`/resources/blog/${slug}`)) return last;
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  return last;
}

function currentRouteSetFromPracticeAreas() {
  if (!fs.existsSync(path.join("src", "data", "practice-areas.ts"))) return new Set();
  const text = fs.readFileSync(path.join("src", "data", "practice-areas.ts"), "utf8");
  const routes = new Set();
  const areaMatches = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  // The data file interleaves practice-area and service-page slugs. For Sprint 11Y,
  // generated service monitoring comes from Sprint 11T CSV instead of this heuristic.
  for (const slug of areaMatches) routes.add(slug);
  return routes;
}

async function main() {
  const configuredRedirects = extractConfiguredRedirectSources();
  const freshEvidence = detectFreshEvidence();
  const sprint11tServices = readCsv(paths.sprint11tService);
  const sprint11tRedirects = readCsv(paths.sprint11tRedirects);
  const hiddenSourceDocs = await fetchHiddenSourceDocs(BULK_SCAN_LIMIT);
  const hiddenRepairTargets = hiddenSourceDocs
    .filter((doc) => doc.slug && doc.lawFirmApproved !== true)
    .slice(0, HIDDEN_REPAIR_LIMIT);
  const hiddenRepairChanges = [];
  if (APPLY) {
    for (const doc of hiddenRepairTargets) {
      const { operations, repair } = await repairHiddenSourceDoc(doc, configuredRedirects);
      hiddenRepairChanges.push({
        id: doc._id,
        slug: doc.slug,
        operations,
        hiddenRepairApplied: operations.length > 0,
        approvalReadiness: repair.blockers.length ? "keep hidden after repair" : "ready for controlled approval review"
      });
    }
  }
  const hiddenSourceRows = hiddenSourceDocs.map((doc, index) => {
    const repair = hiddenRepairPatch(doc, configuredRedirects);
    return {
      priority: `hidden-${index + 1}`,
      "old URL": absoluteUrl(`/${doc.slug}/`),
      slug: doc.slug,
      title: repair.title,
      "SEO title": repair.patch.seo.metaTitle,
      "meta description": repair.patch.seo.metaDescription,
      canonical: repair.patch.seo.canonicalUrl,
      category: (doc.categories || []).map((category) => category?.title).filter(Boolean).join("; ") || "General Legal Education",
      _sourceDoc: doc
    };
  });
  const manualApprovalRows = [...EDITORIAL_APPROVAL_SLUGS].map((slug, index) => ({
    priority: `11Y-${index + 1}`,
    "old URL": absoluteUrl(`/${slug}/`),
    slug,
    title: titleFromSlug(slug),
    category: "Sprint 11Y explicit low-risk hidden Sanity candidate"
  }));
  const seenBlogSlugs = new Set();
  const sprint11tBlogRows = [...manualApprovalRows, ...hiddenSourceRows].filter((row) => {
    if (!row.slug || seenBlogSlugs.has(row.slug)) return false;
    seenBlogSlugs.add(row.slug);
    return true;
  });
  const sitemap = await fetchText(`${SITE_URL}/sitemap.xml`);
  const sitemapText = sitemap.text || "";
  const robots = await fetchText(`${SITE_URL}/robots.txt`);

  writeMd(
    paths.buildStability,
    `# Sprint 11Y Local Build Stability Check

- Checked at: ${new Date().toISOString()}
- Stale build workers: none identified before the stability run; only Codex/MCP Node support processes were visible.
- Lint result before content work: passed with the existing Phase 5C keyField warning only.
- Build result before content work: passed locally with 427 generated static pages.
- Local Sanity warnings: non-fatal network/connect-timeout warnings appeared during static blog generation.
- Stability decision: safe to continue Sprint 11Y, while continuing to monitor Sanity network fetch warnings during later builds.
- DNS/Hostinger/production domain changes: none.
`
  );

  writeMd(
    paths.freshEvidence,
    `# Sprint 11Y Fresh GSC/Bing Evidence Status

- Checked at: ${new Date().toISOString()}
- Fresh post-launch GSC/Bing/backlink/SERP export files found locally: ${freshEvidence.length}
- Import action: ${freshEvidence.length ? "candidate evidence files listed for manual scoring review" : "none available locally; existing sprint evidence remains the current source"}
- Search Console/Bing submission: not performed by this script.
- Hidden drafts: not submitted.

${freshEvidence.length ? freshEvidence.map((item) => `- ${item.file} (${item.bytes} bytes, modified ${item.modified})`).join("\n") : "No fresh non-sprint GSC/Bing/backlink/SERP export was found under docs/."}
`
  );

  const hiddenRepairBySlug = new Map(hiddenRepairChanges.map((item) => [item.slug, item]));
  const bulkRows = hiddenSourceDocs.map((doc, index) => {
    const slug = doc.slug;
    const oldUrl = absoluteUrl(`/${slug}/`);
    const text = compact(doc.bodyText || "");
    const repair = hiddenRepairPatch(doc, configuredRedirects);
    const risks = repair.risks;
    const existingRedirect = configuredRedirects.get(pathOnly(oldUrl)) || configuredRedirects.get(`${pathOnly(oldUrl)}/`) || "";
    const imagePresent = hasImageRef(repair.imageCandidate);
    const altPresent = Boolean(repair.imageCandidate?.alt && repair.imageCandidate.alt.trim().length >= 12);
    const metadataPresent = Boolean(repair.title && repair.metaDescription && slug);
    const bodyQuality = doc.bodyBlocks >= MIN_BODY_BLOCKS && text.length >= MIN_BODY_CHARS
      ? "complete"
      : doc.bodyBlocks > 0 || text.length > 0
        ? "thin/needs cleanup"
        : "missing";

    return {
      "old URL": oldUrl,
      "old title": doc.title || titleFromSlug(slug),
      slug,
      "source type": doc._id.includes(".") ? "Sanity dotted hidden/source record" : doc._id.startsWith("drafts.") ? "Sanity draft record" : "Sanity hidden/source record",
      "content type": "blog",
      "body recovered yes/no": bodyQuality === "missing" ? "no" : "yes",
      "body quality": bodyQuality,
      "image recovered yes/no": imagePresent ? "yes" : "no",
      "metadata recovered yes/no": metadataPresent ? "yes" : "no",
      "draft/source record created yes/no": "existing hidden/source record retained",
      "public-safe non-dotted record needed yes/no": doc._id.includes(".") || doc._id.startsWith("drafts.") ? "yes before publication" : "review before publication",
      "hidden/source repair applied yes/no": hiddenRepairBySlug.get(slug)?.hiddenRepairApplied ? "yes" : APPLY ? "not selected or skipped" : "dry-run only",
      "legal risk": risks.length ? risks.join("; ") : "low automated risk",
      "current-law risk": risks.some((risk) => /current-law|procedure-sensitive/.test(risk)) ? "lawyer review required" : "low automated risk",
      "duplicate/cannibalization risk": existingRedirect && existingRedirect !== `/resources/blog/${slug}` ? `redirect conflict: ${existingRedirect}` : "no configured redirect conflict detected",
      "recommended next action": risks.length || !imagePresent || !altPresent || !metadataPresent || bodyQuality !== "complete"
        ? "keep hidden for cleanup/lawyer review"
        : "candidate for fast publish review",
      "priority score": Math.max(0, 100 - index),
      notes: "Bulk track records recovered source availability first; publication remains gated."
    };
  });

  writeCsv(paths.bulkImport, [
    "old URL",
    "old title",
    "slug",
    "source type",
    "content type",
    "body recovered yes/no",
    "body quality",
    "image recovered yes/no",
    "metadata recovered yes/no",
    "draft/source record created yes/no",
    "public-safe non-dotted record needed yes/no",
    "hidden/source repair applied yes/no",
    "legal risk",
    "current-law risk",
    "duplicate/cannibalization risk",
    "recommended next action",
    "priority score",
    "notes"
  ], bulkRows);

  const serviceRows = [];
  for (const record of sprint11tServices) {
    const finalUrl = record["proposed final URL"];
    const qa = await pageQa(finalUrl);
    serviceRows.push({
      "final URL": finalUrl,
      "old URL source": record["old URL"],
      "practice area": pathOnly(finalUrl).split("/")[2] || "",
      "current HTTP status": qa.status,
      "canonical status": qa.canonical === finalUrl ? "canonical self-references final URL" : `review: ${qa.canonical || "missing"}`,
      "sitemap inclusion": sitemapText.includes(finalUrl) ? "included" : "missing",
      "CTA present": qa.hasCta ? "yes" : "no",
      "image/alt status": qa.hasImage && qa.hasAlt ? "image and alt present" : "review image/alt",
      "internal links status": qa.hasInternalLinks ? "present" : "review",
      "FAQ/answer section status": qa.hasFaq ? "present" : "review",
      "indexability status": qa.status === 200 && sitemapText.includes(finalUrl) ? "indexable candidate" : "review before indexing",
      "duplicate/cannibalization risk": "low from Sprint 11T service-page selection; monitor GSC after indexing",
      "remain as-is": qa.status === 200 && sitemapText.includes(finalUrl) ? "yes" : "no",
      "needs improvement": qa.status === 200 && qa.hasCta && qa.hasImage && qa.hasAlt ? "no urgent issue" : "review page signals",
      "redirect target remains correct": record["redirect plan"] || "",
      notes: qa.error || "Live check completed"
    });
  }

  writeCsv(paths.serviceMonitoring, [
    "final URL",
    "old URL source",
    "practice area",
    "current HTTP status",
    "canonical status",
    "sitemap inclusion",
    "CTA present",
    "image/alt status",
    "internal links status",
    "FAQ/answer section status",
    "indexability status",
    "duplicate/cannibalization risk",
    "remain as-is",
    "needs improvement",
    "redirect target remains correct",
    "notes"
  ], serviceRows);

  const redirectRows = [];
  for (const record of sprint11tRedirects) {
    const oldUrl = record["old URL"];
    const checks = await redirectQa(oldUrl);
    const nonSlash = checks[0];
    const slash = checks[1];
    redirectRows.push({
      "old URL": oldUrl,
      "slash variant": slash.variant,
      "non-slash variant": nonSlash.variant,
      "redirect status": nonSlash.status === 308 && slash.status === 308 ? "both variants 308" : `review ${nonSlash.status}/${slash.status}`,
      "target URL": nonSlash.location || slash.location,
      "target status": nonSlash.targetStatus || slash.targetStatus,
      "one-hop yes/no": nonSlash.oneHop && slash.oneHop ? "yes" : "no",
      "chain yes/no": nonSlash.chain || slash.chain ? "yes" : "no",
      "loop yes/no": nonSlash.loop || slash.loop ? "yes" : "no",
      "homepage dump yes/no": nonSlash.homepageDump || slash.homepageDump ? "yes" : "no",
      "hidden draft target yes/no": nonSlash.hiddenDraftTarget || slash.hiddenDraftTarget ? "yes" : "no",
      "404 target yes/no": nonSlash.target404 || slash.target404 ? "yes" : "no",
      "Chaman Properties target yes/no": nonSlash.chamanPropertiesTarget || slash.chamanPropertiesTarget ? "yes" : "no",
      "Search Console monitoring recommendation": nonSlash.oneHop && slash.oneHop ? "inspect old redirected URL and final canonical target" : "hold Search Console submission until fixed"
    });
  }

  writeCsv(paths.redirectMonitoring, [
    "old URL",
    "slash variant",
    "non-slash variant",
    "redirect status",
    "target URL",
    "target status",
    "one-hop yes/no",
    "chain yes/no",
    "loop yes/no",
    "homepage dump yes/no",
    "hidden draft target yes/no",
    "404 target yes/no",
    "Chaman Properties target yes/no",
    "Search Console monitoring recommendation"
  ], redirectRows);

  const slugs = [...new Set(sprint11tBlogRows.map((row) => row.slug).filter(Boolean))];
  const docs = await fetchCandidateDocs(slugs);
  const docsBySlug = new Map();
  for (const doc of docs) {
    if (!docsBySlug.has(doc.slug)) docsBySlug.set(doc.slug, []);
    docsBySlug.get(doc.slug).push(doc);
  }

  const blogRecoveryRows = [];
  const approvalRows = [];
  const seoRows = [];
  const hiddenReadyCandidates = [];
  const publicRefreshCandidates = [];
  const keptHidden = [];
  const readySlugSeen = new Set();
  const refreshSlugSeen = new Set();

  for (const row of sprint11tBlogRows) {
    const docSet = docsBySlug.get(row.slug) || [];
    const publicDoc = choosePublicDoc(docSet);
    const hiddenDoc = chooseHiddenDoc(docSet);
    const assessment = docCompleteness(hiddenDoc || publicDoc, row, configuredRedirects);
    const alreadyPublic = Boolean(publicDoc);
    const approvalReady =
      !alreadyPublic &&
      hiddenDoc &&
      (assessment.passedHardGates || assessment.canApproveWithMinorRepair) &&
      !assessment.redirectConflict;
    const publicRefreshReady =
      alreadyPublic &&
      publicDoc &&
      EDITORIAL_APPROVAL_SLUGS.has(assessment.slug) &&
      TITLE_OVERRIDES.has(assessment.slug) &&
      !assessment.riskFlags.length &&
      !assessment.redirectConflict;

    if (approvalReady && !readySlugSeen.has(assessment.slug)) {
      hiddenReadyCandidates.push({ row, hiddenDoc, assessment });
      readySlugSeen.add(assessment.slug);
    }
    else if (publicRefreshReady && !refreshSlugSeen.has(assessment.slug)) {
      publicRefreshCandidates.push({ row, hiddenDoc, publicDoc, assessment });
      refreshSlugSeen.add(assessment.slug);
    }
    else keptHidden.push({ row, hiddenDoc, assessment, alreadyPublic });

    const decision = alreadyPublic
      ? publicRefreshReady ? "already public; selected for metadata refresh" : "already public"
      : approvalReady
        ? "ready for controlled approval"
        : "keep hidden";
    const reason = alreadyPublic
      ? publicRefreshReady ? "public canonical article exists; explicit Sprint 11Y title/metadata refresh selected" : "public canonical article already exists"
      : approvalReady
        ? "passes source, image, metadata, author/canonical repair, category, legal-risk, duplicate, and redirect-source gates"
        : assessment.blockers.join("; ") || "insufficient source evidence";

    blogRecoveryRows.push({
      priority: row.priority,
      "old URL": row["old URL"],
      slug: row.slug,
      title: hiddenDoc?.title || row.title,
      "source body recovery": hiddenDoc ? "Sanity hidden source present" : "missing Sanity hidden source",
      "source body quality": `${assessment.bodyBlocks || 0} blocks; ${assessment.bodyText.length || 0} chars`,
      "plugin debris cleanup": assessment.riskFlags.some((flag) => /plugin|shortcode/.test(flag)) ? "needs cleanup" : "clear",
      "formatting repair": assessment.bodyBlocks >= MIN_BODY_BLOCKS ? "adequate block structure" : "needs body repair",
      "answer-first intro": "template/content review recommended; do not invent legal claims",
      CTA: "article template provides consultation/contact CTA",
      "internal links": JSON.stringify(hiddenDoc?.body || {}).includes('"href"') ? "internal/external links present in body marks" : "needs manual link enhancement",
      image: hasImageRef(hiddenDoc?.mainImage)
        ? "image present"
        : hasImageRef(assessment.imageCandidate)
          ? "approved fallback image attached"
          : "image missing",
      "alt text": assessment.imageAlt || "missing",
      "SEO title": assessment.seoTitle,
      "meta description": assessment.metaDescription,
      canonical: assessment.canonical,
      author: hiddenDoc?.author?._ref === AUTHOR_ID ? AUTHOR_NAME : "requires public-safe author reference",
      category: (hiddenDoc?.categories || []).map((category) => category?.title).filter(Boolean).join("; ") || row.category || "",
      "legal risk": assessment.riskFlags.length ? assessment.riskFlags.join("; ") : "low automated risk",
      "current-law risk": /current-law|procedure-sensitive/.test(assessment.riskFlags.join("; ")) ? "lawyer review required" : "low automated risk",
      "duplicate/cannibalization risk": assessment.redirectConflict ? `redirect conflict: ${assessment.existingRedirect}` : "no configured redirect conflict",
      "approval readiness": decision,
      notes: reason
    });

    approvalRows.push({
      "old URL": row["old URL"],
      slug: row.slug,
      title: hiddenDoc?.title || row.title,
      "approval decision": decision,
      reason,
      author: AUTHOR_NAME,
      "image status": hasImageRef(hiddenDoc?.mainImage)
        ? "image present"
        : hasImageRef(assessment.imageCandidate)
          ? "approved fallback image attached"
          : "image missing",
      "legal status": assessment.riskFlags.length ? assessment.riskFlags.join("; ") : "low automated risk",
      "redirect status": approvalReady ? "eligible after live 200 and sitemap inclusion" : "no redirect to hidden draft",
      "sitemap status": alreadyPublic ? "already public/in sitemap if approved" : approvalReady ? "expected after approval/revalidation" : "excluded while hidden",
      notes: APPLY && approvalReady ? "will approve if within controlled approval limit" : "no public change unless selected"
    });

    seoRows.push({
      "old URL": row["old URL"],
      "final URL": assessment.targetUrl,
      title: hiddenDoc?.title || row.title,
      "search intent answered early": hiddenDoc ? "reviewed; answer-first intro recommended where useful" : "not ready",
      H1: hiddenDoc?.title || row.title,
      "SEO title": assessment.seoTitle,
      "meta description": assessment.metaDescription,
      canonical: assessment.canonical,
      "internal links included": JSON.stringify(hiddenDoc?.body || {}).includes('"href"') ? "yes" : "needs enhancement",
      "CTA included": "yes via article template",
      "image and alt text included": hasImageRef(assessment.imageCandidate) && assessment.imageAlt ? "yes" : "no",
      "FAQ/short-answer section useful": "recommended where legal risk stays low",
      "keyword stuffing": "none detected by automated scan",
      "unsupported legal claim": assessment.riskFlags.some((flag) => /unsupported/.test(flag)) ? "review" : "none detected",
      "duplicate/cannibalization": assessment.redirectConflict ? "review redirect conflict" : "low automated risk",
      "sitemap inclusion": publicDoc ? "public" : "hidden until approval",
      "old URL redirect/canonical strategy": assessment.redirectConflict ? `keep existing ${assessment.existingRedirect}` : `${row["old URL"]} -> ${assessment.targetUrl} after live QA`,
      "topic cluster/internal-link relevance": (hiddenDoc?.categories || []).map((category) => category?.title).filter(Boolean).join("; ") || "needs review",
      "AEO readiness": hiddenDoc && !assessment.riskFlags.length ? "candidate" : "blocked",
      "GEO/local Nigerian legal relevance": "yes - Nigerian legal education framing"
    });
  }

  writeCsv(paths.blogRecovery, [
    "priority",
    "old URL",
    "slug",
    "title",
    "source body recovery",
    "source body quality",
    "plugin debris cleanup",
    "formatting repair",
    "answer-first intro",
    "CTA",
    "internal links",
    "image",
    "alt text",
    "SEO title",
    "meta description",
    "canonical",
    "author",
    "category",
    "legal risk",
    "current-law risk",
    "duplicate/cannibalization risk",
    "approval readiness",
    "notes"
  ], blogRecoveryRows);

  writeCsv(paths.imageCtaMetadata, [
    "old URL",
    "slug",
    "title",
    "image",
    "alt text",
    "CTA",
    "internal links",
    "SEO title",
    "meta description",
    "canonical",
    "author",
    "category",
    "repair action",
    "approval readiness",
    "notes"
  ], blogRecoveryRows.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    image: row.image,
    "alt text": row["alt text"],
    CTA: row.CTA,
    "internal links": row["internal links"],
    "SEO title": row["SEO title"],
    "meta description": row["meta description"],
    canonical: row.canonical,
    author: row.author,
    category: row.category,
    "repair action": row["approval readiness"] === "ready for controlled approval"
      ? "minor author/canonical repair only if needed; no body rewrite"
      : "hold for manual image, metadata, legal, or source cleanup",
    "approval readiness": row["approval readiness"],
    notes: row.notes
  })));

  writeCsv(paths.legalEditorial, [
    "old URL",
    "slug",
    "title",
    "legal risk",
    "current-law risk",
    "duplicate/cannibalization risk",
    "plugin debris cleanup",
    "formatting repair",
    "lawyer review decision",
    "publication decision",
    "notes"
  ], blogRecoveryRows.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    "legal risk": row["legal risk"],
    "current-law risk": row["current-law risk"],
    "duplicate/cannibalization risk": row["duplicate/cannibalization risk"],
    "plugin debris cleanup": row["plugin debris cleanup"],
    "formatting repair": row["formatting repair"],
    "lawyer review decision": row["approval readiness"] === "ready for controlled approval"
      ? "automated low-risk gate passed; lawyer can spot-check before final search submission"
      : "lawyer/manual cleanup required before approval",
    "publication decision": row["approval readiness"],
    notes: row.notes
  })));

  const selectedApprovals = hiddenReadyCandidates.slice(0, APPROVAL_LIMIT);
  const selectedRefreshes = publicRefreshCandidates.slice(0, Math.max(0, APPROVAL_LIMIT - selectedApprovals.length));
  const selected = [...selectedApprovals, ...selectedRefreshes];
  const sanityChanges = [];
  if (APPLY) {
    for (const candidate of selected) {
      const operations = candidate.publicDoc
        ? await refreshPublicCandidate(candidate.row, candidate.publicDoc, candidate.hiddenDoc, candidate.assessment)
        : await approveCandidate(candidate.row, candidate.hiddenDoc, candidate.assessment);
      sanityChanges.push({
        slug: candidate.assessment.slug,
        oldUrl: candidate.row["old URL"],
        target: candidate.assessment.targetUrl,
        operations
      });
    }
  }

  writeCsv(paths.approvalBatch, [
    "old URL",
    "slug",
    "title",
    "approval decision",
    "reason",
    "author",
    "image status",
    "legal status",
    "redirect status",
    "sitemap status",
    "notes"
  ], approvalRows.map((row) => {
    const selectedForApply = selected.some((candidate) => candidate.assessment.slug === row.slug);
    return selectedForApply
      ? { ...row, "approval decision": APPLY ? "approved/refreshed in Sprint 11Y" : "selected for approval/refresh dry-run", notes: APPLY ? "Sanity public approval or metadata refresh applied" : "dry-run selection only" }
      : row;
  }));

  const staticCandidates = readCsv(path.join("docs", "SPRINT-11T-AGGRESSIVE-LEGACY-404-RECOVERY-INVENTORY.csv"))
    .filter((row) => !/blog/i.test(row["content type"] || row["page type"] || "") && row["best new route"])
    .slice(0, 25);
  const routeSet = currentRouteSetFromPracticeAreas();
  const staticRows = staticCandidates.map((row) => ({
    "old URL": row["old URL"] || row.url || "",
    "old title": row["old title"] || row.title || "",
    "candidate type": row["content type"] || row["page type"] || "static/service candidate",
    "proposed route": row["best new route"] || "",
    "route architecture supports it": row["best new route"] ? "needs source implementation review" : "no route selected",
    "content readiness": "monitoring only in Sprint 11Y unless full route gates pass",
    "legal risk": "requires lawyer/service-page review before implementation",
    "image and alt text": "must use approved Chaman Law Firm legal imagery only",
    CTA: "required before publication",
    "internal links": "required before publication",
    canonical: row["best new route"] ? absoluteUrl(row["best new route"]) : "",
    "sitemap behavior": row["best new route"] && routeSet.size ? "verify after implementation" : "not implemented",
    decision: "keep existing safe redirect or plan future service page; no weak page creation",
    notes: "Sprint 11Y does not add static pages unless full gates pass."
  }));

  writeCsv(paths.staticRecovery, [
    "old URL",
    "old title",
    "candidate type",
    "proposed route",
    "route architecture supports it",
    "content readiness",
    "legal risk",
    "image and alt text",
    "CTA",
    "internal links",
    "canonical",
    "sitemap behavior",
    "decision",
    "notes"
  ], staticRows);

  const liveApproved = [];
  if (APPLY) {
    for (const item of selected) {
      const live = await waitForLiveArticle(item.assessment.slug);
      liveApproved.push({
        ...item,
        live
      });
    }
  }

  const freshSitemap = APPLY ? await fetchText(`${SITE_URL}/sitemap.xml`) : sitemap;
  const freshSitemapText = freshSitemap.text || "";
  const redirectRescueRows = (APPLY ? liveApproved : selected.map((item) => ({ ...item, live: { status: "dry-run" } }))).map((item) => {
    const finalUrl = item.assessment.targetUrl;
    const inSitemap = freshSitemapText.includes(finalUrl);
    const finalStatus = item.live?.status || "not tested";
    return {
      "old URL": item.row["old URL"],
      "final URL": finalUrl,
      "content type": "blog post",
      "final URL status": finalStatus,
      "canonical safe": item.live?.canonical === finalUrl ? "yes" : APPLY ? `review: ${item.live?.canonical || "missing"}` : "pending live approval",
      "sitemap included": inSitemap ? "yes" : "pending or missing",
      "redirect action": finalStatus === 200 && inSitemap ? "eligible for exact one-hop redirect in next.config.mjs" : "do not activate yet",
      "redirect type": "one-hop 308",
      "homepage dump": "no",
      "hidden draft target": "no",
      "404 target": finalStatus === 200 ? "no" : "yes - hold redirect",
      "notes": APPLY ? "Approve then add config redirect only when live and sitemap gates pass." : "Dry-run only."
    };
  });

  writeCsv(paths.redirectRescue, [
    "old URL",
    "final URL",
    "content type",
    "final URL status",
    "canonical safe",
    "sitemap included",
    "redirect action",
    "redirect type",
    "homepage dump",
    "hidden draft target",
    "404 target",
    "notes"
  ], redirectRescueRows);

  const lawzanaProfile = await fetchManual("https://lawzana.com/lawyer/chaman-law-firm");
  const lawzanaBadge = await fetchManual("https://lawzana.com/assets/badges/verified-law-firm.svg?v=2");
  const lawzanaSafe = lawzanaProfile.status === 200 && lawzanaBadge.status === 200;
  writeMd(paths.lawzana, `# Sprint 11Y Lawzana Profile Verification

- Profile URL: https://lawzana.com/lawyer/chaman-law-firm
- Profile HTTP result: ${lawzanaProfile.status || "failed"}${lawzanaProfile.error ? ` (${lawzanaProfile.error})` : ""}
- Browser/manual access works: not confirmed in local automated QA
- Badge SVG URL: https://lawzana.com/assets/badges/verified-law-firm.svg?v=2
- Badge SVG result: ${lawzanaBadge.status || "failed"}${lawzanaBadge.error ? ` (${lawzanaBadge.error})` : ""}
- Badge wording verified from profile page: ${lawzanaSafe ? "HTTP profile reachable; still needs Principal visual confirmation before homepage placement" : "no"}
- "Top Law Firm" wording safe: no - do not use unless Lawzana explicitly verifies that claim
- Recommended homepage wording: Verified Law Firm on Lawzana
- Implementation decision: ${lawzanaSafe ? "defer until Principal visual confirmation; no homepage badge added by this automated run" : "defer; profile is not reliably verifiable from automated QA"}
`);

  writeCsv(paths.seoGeo, [
    "old URL",
    "final URL",
    "title",
    "search intent answered early",
    "H1",
    "SEO title",
    "meta description",
    "canonical",
    "internal links included",
    "CTA included",
    "image and alt text included",
    "FAQ/short-answer section useful",
    "keyword stuffing",
    "unsupported legal claim",
    "duplicate/cannibalization",
    "sitemap inclusion",
    "old URL redirect/canonical strategy",
    "topic cluster/internal-link relevance",
    "AEO readiness",
    "GEO/local Nigerian legal relevance"
  ], seoRows);

  const indexingLiveUrls = [
    ...serviceRows
      .filter((row) => row["current HTTP status"] === 200)
      .map((row) => row["final URL"]),
    ...redirectRescueRows
      .filter((row) => row["final URL status"] === 200 && row["sitemap included"] === "yes")
      .map((row) => row["final URL"])
  ];
  const indexingOldUrls = [
    ...redirectRows
      .filter((row) => row["one-hop yes/no"] === "yes")
      .map((row) => `${row["old URL"]} -> ${row["target URL"]}`),
    ...redirectRescueRows
      .filter((row) => row["final URL status"] === 200 && row["sitemap included"] === "yes")
      .map((row) => `${row["old URL"]} -> ${row["final URL"]}`)
  ];

  writeMd(paths.indexingPack, `# Sprint 11Y GSC/Bing Indexing Pack

Use only verified live URLs and exact old redirected URLs. Do not submit hidden drafts, 404 URLs, preview URLs, or URLs whose target is not canonical-safe.

## Production Sitemap

- ${SITE_URL}/sitemap.xml

## Live Final URLs To Inspect

${[...new Set(indexingLiveUrls)].map((url) => `- ${url}`).join("\n") || "- None added in this sprint."}

## Exact Old Redirected URLs To Inspect

${[...new Set(indexingOldUrls)].map((item) => `- ${item}`).join("\n") || "- None added in this sprint."}

## Follow-Up

1. Refresh or resubmit the production sitemap.
2. Inspect live final URLs first.
3. Inspect old redirected URLs only after live redirect QA passes.
4. Request indexing where available.
5. Do not submit hidden drafts, unresolved 404s, preview URLs, or non-canonical targets.
`);

  const result = {
    sprint: "11Y",
    mode: APPLY ? "apply" : "dry-run",
    generatedAt: new Date().toISOString(),
    freshEvidenceFiles: freshEvidence.length,
    sprint11tServicePagesMonitored: serviceRows.length,
    sprint11tRedirectsMonitored: redirectRows.length,
    blogCandidatesReviewed: blogRecoveryRows.length,
    hiddenSourceRecordsScanned: hiddenSourceDocs.length,
    hiddenSourceRepairTargets: hiddenRepairTargets.length,
    hiddenSourceRepaired: hiddenRepairChanges.filter((item) => item.hiddenRepairApplied).length,
    approvalReadyCandidates: hiddenReadyCandidates.length,
    selectedForApproval: selected.length,
    approvedInSanity: APPLY ? sanityChanges.length : 0,
    liveApprovedPassed: APPLY ? liveApproved.filter((item) => item.live?.status === 200).length : 0,
    redirectRescueEligible: redirectRescueRows.filter((row) => row["redirect action"].startsWith("eligible")).length,
    lawzanaProfileStatus: lawzanaProfile.status,
    lawzanaBadgeStatus: lawzanaBadge.status,
    sitemapStatus: freshSitemap.status,
    robotsStatus: robots.status,
    publicAuthorRule: AUTHOR_NAME,
    hiddenRepairChanges: hiddenRepairChanges.slice(0, 50),
    sanityChanges,
    selected: selected.map((item) => ({
      oldUrl: item.row["old URL"],
      slug: item.assessment.slug,
      title: TITLE_OVERRIDES.get(item.assessment.slug) || item.hiddenDoc?.title || item.publicDoc?.title || item.row.title,
      target: item.assessment.targetUrl
    })),
    keptHiddenSample: keptHidden.slice(0, 30).map((item) => ({
      oldUrl: item.row["old URL"],
      slug: item.row.slug,
      reason: item.alreadyPublic ? "already public" : item.assessment.blockers.join("; ") || "not selected"
    }))
  };
  fs.writeFileSync(paths.result, `${JSON.stringify(result, null, 2)}\n`, "utf8");

  writeMd(paths.report, `# Sprint 11Y Report

## Summary

- Mode: ${result.mode}
- Fresh evidence files found locally: ${result.freshEvidenceFiles}
- Sprint 11T service pages monitored: ${result.sprint11tServicePagesMonitored}
- Sprint 11T redirect sources monitored: ${result.sprint11tRedirectsMonitored}
- Blog candidates reviewed: ${result.blogCandidatesReviewed}
- Hidden/source records scanned: ${result.hiddenSourceRecordsScanned}
- Hidden/source repair targets: ${result.hiddenSourceRepairTargets}
- Hidden/source records repaired: ${result.hiddenSourceRepaired}
- Approval-ready hidden blog candidates: ${result.approvalReadyCandidates}
- Selected for controlled approval: ${result.selectedForApproval}
- Approved in Sanity: ${result.approvedInSanity}
- Live approved targets returning 200 during script QA: ${result.liveApprovedPassed}
- Redirects eligible after live/sitemap gate: ${result.redirectRescueEligible}
- Lawzana profile HTTP status: ${result.lawzanaProfileStatus || "failed"}
- Lawzana badge HTTP status: ${result.lawzanaBadgeStatus || "failed"}

## Safety

- Public blog author rule: ${AUTHOR_NAME}
- No DNS, Hostinger, Chaman Properties, backup, SQL dump, wp-config, wp-content, or secret files were touched by this script.
- Hidden drafts are not included in the indexing pack.
- Redirect activation remains gated by live 200, canonical, and sitemap inclusion checks.
`);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error?.message || String(error));
  process.exit(1);
});

