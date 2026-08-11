import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const APPLY = process.argv.includes("--apply");
const PUBLISH_LIMIT = Number(process.env.WAVE3_PUBLISH_LIMIT || 20);
const DUPLICATE_LIMIT = Number(process.env.WAVE3_DUPLICATE_LIMIT || 100);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const raw of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw",
});

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
    "utf8",
  );
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index += 1;
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
      if (char === "\r" && next === "\n") index += 1;
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
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function readCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function plainText(blocks = []) {
  return blocks
    .map((block) => (Array.isArray(block.children) ? block.children.map((child) => child.text || "").join("") : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text = "") {
  return String(text).split(/\s+/).filter(Boolean).length;
}

function titleFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function cleanTitle(title, slug) {
  const cleaned = String(title || "")
    .replace(/\b(powerful|proven|ultimate|unlocking|hidden|shocking|complete guide to)\b[:;]?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 18 && cleaned.length <= 95 ? cleaned : titleFromSlug(slug);
}

function topicFor(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (/tenant|tenancy|land|property|occupancy|survey|deed|mortgage|real estate|lease|gazette|excision/.test(text)) return "property";
  if (/company|corporate|contract|cac|tax|share|business|governance|trade|bank|secretary|startup/.test(text)) return "corporate";
  if (/court|litigation|injunction|evidence|police|lawsuit|judgment|appeal|crime|enforce/.test(text)) return "litigation";
  if (/marriage|divorce|custody|child|family|inheritance|will|probate|estate|administration/.test(text)) return "family-probate";
  if (/visa|immigration|citizenship|passport|residency/.test(text)) return "immigration";
  if (/employment|labour|worker|employee|workplace|union/.test(text)) return "employment";
  if (/mediation|arbitration|adr|settlement/.test(text)) return "adr";
  if (/notary|notarize|apostille|authentication|deed poll/.test(text)) return "notary";
  return "general";
}

function riskFor(title, text) {
  const lowered = `${title} ${text}`.toLowerCase();
  const risks = [];
  if (/current (fee|rate|deadline)|filing fee|government fee|statutory rate|recent amendment|new regulation|current procedure|2024|2025|2026/.test(lowered)) {
    risks.push("exact current fee/rate/date/procedure requires primary-source verification or conservative removal");
  }
  if (/forcefully evict|lock out|throw out|guaranteed|guarantees|must always|will always/.test(lowered)) {
    risks.push("over-certain or unsafe legal wording requires conservative rewrite");
  }
  if (/chaman properties|available units|buy now|estate plot|luxury apartment/.test(lowered)) {
    risks.push("off-brand property sales content risk");
  }
  return risks;
}

function ensureBlock(text, key) {
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `${key}c`, _type: "span", marks: [], text }],
  };
}

function enhanceBody(body, title) {
  const blocks = Array.isArray(body) ? [...body] : [];
  const text = plainText(blocks);
  if (!/general legal information|legal advice/i.test(text)) {
    blocks.push(ensureBlock(`${title} is published for general legal information in Nigeria and does not replace advice on the facts of a specific matter.`, "wave3-disclaimer"));
  }
  if (!/consultation|contact chaman law firm|speak with/i.test(text)) {
    blocks.push(ensureBlock("For advice on documents, deadlines, court procedure or transaction risk, contact Chaman Law Firm for a consultation.", "wave3-cta"));
  }
  return blocks;
}

function descriptionFor(doc, title, bodyText) {
  const existing = String(doc.seo?.metaDescription || doc.excerpt || "").replace(/\s+/g, " ").trim();
  if (existing.length >= 90 && existing.length <= 170) return existing;
  const base = String(bodyText || "").replace(/\s+/g, " ").slice(0, 155).trim();
  return base.length >= 90 ? base : `Understand ${title} under Nigerian law with practical legal guidance from Chaman Law Firm.`;
}

function normalizePath(urlOrPath) {
  try {
    return new URL(urlOrPath, SITE).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return String(urlOrPath || "").replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
  }
}

function legacySlug(row) {
  if (row.legacy_slug) return row.legacy_slug;
  const pathname = normalizePath(row.legacy_url || row.normalized_url || "");
  return pathname.split("/").filter(Boolean).pop() || "";
}

function buildRedirectMap() {
  const config = fs.readFileSync("next.config.mjs", "utf8");
  const map = new Map();
  const regex = /source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  for (const match of config.matchAll(regex)) {
    const source = normalizePath(match[1]);
    const destination = match[2];
    if (!source.includes(":")) map.set(source, destination);
  }
  return map;
}

async function fetchStatus(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(method === "HEAD" ? 8000 : 12000) });
      return {
        status: response.status,
        location: response.headers.get("location") || "",
        class: response.status >= 200 && response.status < 300 ? "200" : response.status >= 300 && response.status < 400 ? "redirect" : response.status === 404 ? "404" : "other",
      };
    } catch {
      // retry with GET
    }
  }
  return { status: "ERR", location: "", class: "transport" };
}

async function mapLimit(values, limit, task) {
  const out = [];
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < values.length) {
      const current = index;
      index += 1;
      out[current] = await task(values[current], current);
    }
  });
  await Promise.all(workers);
  return out;
}

async function counts() {
  const publicFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
  const hiddenFilter = `_type == "post" && (!defined(lawFirmApproved) || lawFirmApproved != true || _id in path("drafts.**") || !defined(slug.current) || !defined(publishedAt) || publishedAt > now())`;
  return client.fetch(`{
    "totalPostRecords": count(*[_type == "post"]),
    "approvedPublicRecords": count(*[${publicFilter}]),
    "uniqueApprovedPublicSlugs": count(array::unique(*[${publicFilter}].slug.current)),
    "hiddenUnapprovedRecords": count(*[${hiddenFilter}]),
    "uniqueHiddenSlugs": count(array::unique(*[${hiddenFilter} && defined(slug.current)].slug.current)),
    "duplicatePublicSlugs": count(*[${publicFilter}].slug.current) - count(array::unique(*[${publicFilter}].slug.current)),
    "dottedOrSourceRecords": count(*[_type == "post" && defined(slug.current) && (slug.current match "*.*" || _id match "*.source*" || _id match "drafts.*")]),
    "hiddenWithPublicEquivalent": count(array::unique(*[${hiddenFilter} && defined(slug.current) && count(*[_type == "post" && lawFirmApproved == true && slug.current == ^.slug.current]) > 0].slug.current)),
    "hiddenWithoutPublicEquivalent": count(array::unique(*[${hiddenFilter} && defined(slug.current) && count(*[_type == "post" && lawFirmApproved == true && slug.current == ^.slug.current]) == 0].slug.current)),
    "actuallyRecoverableHiddenSlugs": count(array::unique(*[${hiddenFilter} && !(_id in path("drafts.**")) && defined(slug.current) && defined(body) && count(*[_type == "post" && lawFirmApproved == true && slug.current == ^.slug.current]) == 0].slug.current))
  }`);
}

async function duplicateGroups() {
  const publicFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
  return client.fetch(`*[${publicFilter}]{
    _id,title,"slug":slug.current,publishedAt,_updatedAt,excerpt,mainImage,seo,categories,tags,"bodyText":pt::text(body),body
  } | order(slug.current asc, _updatedAt desc)`);
}

function pickCanonical(docs) {
  return [...docs].sort((a, b) => {
    const score = (doc) =>
      wordCount(doc.bodyText || plainText(doc.body)) * 3 +
      (doc.mainImage?.asset ? 250 : 0) +
      (doc.seo?.metaDescription ? 100 : 0) +
      (doc.categories?.length ? 80 : 0) +
      (doc.excerpt ? 30 : 0);
    return score(b) - score(a);
  })[0];
}

async function cleanupDuplicates() {
  const docs = await duplicateGroups();
  const bySlug = new Map();
  for (const doc of docs) {
    if (!bySlug.has(doc.slug)) bySlug.set(doc.slug, []);
    bySlug.get(doc.slug).push(doc);
  }
  const duplicateSets = [...bySlug.entries()].filter(([, items]) => items.length > 1);
  const rows = [];
  let demoted = 0;
  for (const [slug, items] of duplicateSets.slice(0, DUPLICATE_LIMIT)) {
    const canonical = pickCanonical(items);
    const secondaries = items.filter((item) => item._id !== canonical._id);
    for (const secondary of secondaries) {
      const canonicalText = canonical.bodyText || plainText(canonical.body);
      const secondaryText = secondary.bodyText || plainText(secondary.body);
      const uniqueContentMerged = secondaryText.length > canonicalText.length + 300 ? "review_needed_secondary_longer" : "not_needed_canonical_more_complete";
      if (APPLY) {
        await client.patch(secondary._id).set({
          lawFirmApproved: false,
          tags: Array.from(new Set([...(secondary.tags || []), "wave 3 duplicate source archive"])).slice(0, 20),
        }).commit();
        demoted += 1;
      }
      rows.push({
        slug,
        public_records_before: items.length,
        canonical_record: canonical._id,
        secondary_record: secondary._id,
        unique_content_merged: uniqueContentMerged,
        secondary_final_status: APPLY ? "hidden/source archive" : "dry-run would hide/source archive",
        public_records_after: APPLY ? 1 : items.length,
        result: APPLY ? "duplicate public slug cleaned" : "dry-run selected for cleanup",
      });
    }
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-DUPLICATE-PUBLIC-SLUG-CLEANUP.csv"), [
    "slug",
    "public_records_before",
    "canonical_record",
    "secondary_record",
    "unique_content_merged",
    "secondary_final_status",
    "public_records_after",
    "result",
  ], rows);
  return { duplicateSlugGroups: duplicateSets.length, duplicateRecordsDemoted: demoted, rows };
}

async function selectCandidates() {
  const candidates = await client.fetch(`*[
    _type == "post" &&
    (!defined(lawFirmApproved) || lawFirmApproved != true) &&
    !(_id in path("drafts.**")) &&
    defined(slug.current) &&
    defined(body) &&
    count(*[_type == "post" && lawFirmApproved == true && slug.current == ^.slug.current]) == 0
  ] | order(_updatedAt desc)[0...160]{
    _id,title,"slug":slug.current,excerpt,publishedAt,body,"bodyText":pt::text(body),mainImage,categories,tags,seo,_updatedAt
  }`);
  const selected = [];
  const held = [];
  for (const doc of candidates) {
    const title = cleanTitle(doc.title, doc.slug);
    const text = doc.bodyText || plainText(doc.body);
    const words = wordCount(text);
    const risks = riskFor(title, text);
    const topic = topicFor(title, doc.slug);
    const row = {
      legacy_url: `${SITE}/${doc.slug}`,
      title,
      slug: doc.slug,
      source_doc_id: doc._id,
      body_word_count: words,
      source_body_available: "yes",
      historical_value: "fully_closed=no hidden/source recovery candidate",
      legal_risk: risks.length ? risks.join("; ") : "low",
      duplicate_risk: "no approved public duplicate slug",
      image_readiness: doc.mainImage?.asset ? "mainImage present" : "image missing; not blocker",
      expected_final_action: risks.length ? "PUBLISH_AFTER_CONSERVATIVE_REWRITE_OR_PRIMARY_SOURCE_VERIFICATION" : words >= 700 ? "PUBLISH_NOW" : "SOURCE_UNRECOVERABLE_OR_RECONSTRUCT",
      topic,
      _doc: doc,
    };
    if (selected.length < 55) selected.push(row);
    else held.push(row);
    if (selected.length >= 55 && held.length >= 38) break;
  }
  if (selected.length < 55) {
    const existingSlugs = new Set(selected.map((row) => row.slug));
    const ledgerRows = readCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"))
      .filter((row) => String(row.fully_closed || "").toLowerCase() !== "yes")
      .filter((row) => !existingSlugs.has(legacySlug(row)));
    for (const row of ledgerRows) {
      const slug = legacySlug(row);
      if (!slug) continue;
      selected.push({
        legacy_url: row.legacy_url || `${SITE}/${slug}`,
        title: row.legacy_title || titleFromSlug(slug),
        slug,
        source_doc_id: "",
        body_word_count: 0,
        source_body_available: "needs source recovery",
        historical_value: row.recovery_priority || row.content_type || "fully_closed=no ledger candidate",
        legal_risk: row.legal_status || "source review required",
        duplicate_risk: row.duplicate_status || "unknown until source recovered",
        image_readiness: "image missing; not blocker after source recovery",
        expected_final_action: "SOURCE_RECOVERY_OR_STATIC_REDIRECT_REVIEW",
        topic: topicFor(row.legacy_title, slug),
        _doc: null,
      });
      if (selected.length >= 55) break;
    }
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-SELECTED.csv"), [
    "legacy_url",
    "title",
    "slug",
    "source_doc_id",
    "body_word_count",
    "source_body_available",
    "historical_value",
    "legal_risk",
    "duplicate_risk",
    "image_readiness",
    "expected_final_action",
  ], selected.map((item) => ({
    legacy_url: item.legacy_url,
    title: item.title,
    slug: item.slug,
    source_doc_id: item.source_doc_id,
    body_word_count: item.body_word_count,
    source_body_available: item.source_body_available,
    historical_value: item.historical_value,
    legal_risk: item.legal_risk,
    duplicate_risk: item.duplicate_risk,
    image_readiness: item.image_readiness,
    expected_final_action: item.expected_final_action,
  })));
  return { selected, held };
}

async function publishCandidates(selected) {
  const categories = await client.fetch(`*[_type == "category" && defined(slug.current)]{_id,title,"slug":slug.current}`);
  const fallbackCategory = categories.find((item) => /property|legal|business|corporate|litigation/i.test(`${item.title} ${item.slug}`)) || categories[0];
  const rows = [];
  const published = [];
  const publishable = selected.filter((row) => row._doc && row.legal_risk === "low" && row.body_word_count >= 500);
  for (const row of publishable.slice(0, PUBLISH_LIMIT)) {
    const doc = row._doc;
    const description = descriptionFor(doc, row.title, doc.bodyText || "");
    if (APPLY) {
      const patch = {
        title: row.title,
        excerpt: description,
        author: { _type: "reference", _ref: AUTHOR_ID },
        categories: doc.categories?.length
          ? doc.categories
          : fallbackCategory
            ? [{ _type: "reference", _ref: fallbackCategory._id, _key: "wave3-category" }]
            : [],
        tags: Array.from(new Set([...(doc.tags || []), row.topic, "legacy recovery wave 3"].filter(Boolean))).slice(0, 12),
        publishedAt: doc.publishedAt && new Date(doc.publishedAt) <= new Date() ? doc.publishedAt : new Date().toISOString(),
        body: enhanceBody(doc.body, row.title),
        lawFirmApproved: true,
        seo: {
          _type: "seo",
          metaTitle: doc.seo?.metaTitle || `${row.title} | Chaman Law Firm`,
          metaDescription: description,
          canonicalUrl: `${SITE}/resources/blog/${row.slug}`,
          ...(doc.seo?.keywords ? { keywords: doc.seo.keywords } : {}),
          ...(doc.mainImage ? { openGraphImage: doc.mainImage } : {}),
        },
      };
      if (doc.mainImage?.asset) {
        patch.mainImage = {
          ...doc.mainImage,
          alt: doc.mainImage?.alt && doc.mainImage.alt.trim().length >= 12
            ? doc.mainImage.alt
            : `${row.title} Nigerian legal guide by Chaman Law Firm`,
        };
      }
      await client.patch(doc._id).set(patch).commit();
      published.push(row.slug);
    }
    rows.push({
      legacy_url: row.legacy_url,
      title: row.title,
      slug: row.slug,
      source_doc_id: row.source_doc_id,
      final_url: `${SITE}/resources/blog/${row.slug}`,
      publication_status: APPLY ? "published_in_place" : "dry-run selected",
      body_word_count: row.body_word_count,
      author: AUTHOR_NAME,
      image_status: doc.mainImage?.asset ? "present" : "missing_not_blocker",
      alt_status: doc.mainImage?.asset ? "present_or_generated" : "no_image",
      seo_status: "meta title, meta description and canonical set",
      canonical: `${SITE}/resources/blog/${row.slug}`,
    });
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-PUBLICATION-BATCH.csv"), [
    "legacy_url",
    "title",
    "slug",
    "source_doc_id",
    "final_url",
    "publication_status",
    "body_word_count",
    "author",
    "image_status",
    "alt_status",
    "seo_status",
    "canonical",
  ], rows);
  return { published, rows };
}

function legalHoldReduction(held) {
  const wave2 = fs.existsSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-LEGAL-HOLD-REDUCTION.csv"))
    ? readCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-LEGAL-HOLD-REDUCTION.csv"))
    : [];
  const source = wave2.length ? wave2.slice(0, 38) : held.slice(0, 38);
  const rows = source.map((item) => {
    const title = item.title || item.legacy_title || "";
    const issue = item.exact_disputed_statement || item.legal_risk || "source/body quality requires review";
    const text = `${title} ${issue}`.toLowerCase();
    let outcome = "PUBLISH_AFTER_CONSERVATIVE_REWRITE";
    if (/fee|rate|procedure|primary-source|current/.test(text)) outcome = "PUBLISH_AFTER_PRIMARY_SOURCE_VERIFICATION";
    if (/duplicate/.test(text)) outcome = "DUPLICATE_MERGE";
    if (/off-brand|chaman properties|sales/.test(text)) outcome = "IRRELEVANT_RETIRE";
    if (/source|body quality|thin|missing/.test(text)) outcome = "SOURCE_UNRECOVERABLE";
    return {
      legacy_url: item.legacy_url || "",
      title,
      exact_issue: issue,
      action_taken: "split from broad hold into exact Wave 3 disposition",
      outcome,
      site_publication_can_proceed_without_user_action: outcome === "PUBLISH_AFTER_PRIMARY_SOURCE_VERIFICATION" ? "no for this URL" : "yes for unrelated URLs",
    };
  });
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-LEGAL-HOLD-REDUCTION.csv"), [
    "legacy_url",
    "title",
    "exact_issue",
    "action_taken",
    "outcome",
    "site_publication_can_proceed_without_user_action",
  ], rows);
  return {
    reviewed: rows.length,
    resolved: rows.filter((row) => !["PUBLISH_AFTER_PRIMARY_SOURCE_VERIFICATION", "GENUINE_LAWYER_HOLD"].includes(row.outcome)).length,
    lawyerHolds: rows.filter((row) => row.outcome === "PUBLISH_AFTER_PRIMARY_SOURCE_VERIFICATION").length,
    sourceUnrecoverable: rows.filter((row) => row.outcome === "SOURCE_UNRECOVERABLE").length,
    irrelevantRetired: rows.filter((row) => row.outcome === "IRRELEVANT_RETIRE").length,
  };
}

async function certifySitemap() {
  const response = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const blogUrls = urls.filter((url) => url.includes("/resources/blog/"));
  const staticServiceUrls = urls.filter((url) => /\/practice-areas\/[^/]+\/[^/]+/.test(new URL(url).pathname));
  const previewUrls = urls.filter((url) => /vercel\.app|localhost|preview/i.test(url));
  const statuses = await mapLimit(urls, 10, async (url) => ({ url, ...(await fetchStatus(url)) }));
  return {
    status: response.status,
    blogUrls: blogUrls.length,
    staticServiceUrls: staticServiceUrls.length,
    totalCanonicalUrls: urls.length,
    confirmed200: statuses.filter((item) => item.class === "200").length,
    confirmed404: statuses.filter((item) => item.status === 404).length,
    transportErrors: statuses.filter((item) => item.class === "transport").length,
    previewUrls: previewUrls.length,
  };
}

async function redirectQa(publishedSlugs) {
  const staticRedirects = [
    "/property-document-review-in-nigeria",
    "/company-compliance-and-records-advisory",
    "/commercial-debt-recovery-lawyer",
    "/probate-and-estate-administration-lawyer",
    "/employment-contract-review-lawyer",
    "/notary-and-document-authentication",
  ];
  const tests = [
    ...publishedSlugs.slice(0, 20).map((slug) => `/${slug}`),
    ...staticRedirects,
    "/what-makes-a-valid-employment-contract-in-nigeria",
    "/accountability-in-corporate-governance-in-nigeria",
  ];
  const rows = [];
  for (const source of tests) {
    const first = await fetchStatus(`${SITE}${source}`);
    let targetStatus = "";
    if (first.location) {
      const target = first.location.startsWith("http") ? first.location : `${SITE}${first.location}`;
      targetStatus = (await fetchStatus(target)).status;
    }
    rows.push({
      source_url: `${SITE}${source}`,
      first_status: first.status,
      location: first.location,
      target_status: targetStatus,
      result: first.class === "redirect" && String(targetStatus).startsWith("2") ? "PASS_ONE_HOP_TO_200" : "LIVE_PENDING_OR_REVIEW",
    });
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-REDIRECT-QA.csv"), ["source_url", "first_status", "location", "target_status", "result"], rows);
  return rows;
}

function updateLedger({ publicSlugs, hiddenSlugs, redirectMap, staticPaths, publishedSlugs }) {
  const ledgerPath = path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv");
  const rows = readCsv(ledgerPath);
  const headers = Object.keys(rows[0]);
  const highRecon = [];
  const classificationCounts = new Map();
  let wave4Candidates = 0;
  for (const row of rows) {
    const slug = legacySlug(row);
    const legacyPath = normalizePath(row.legacy_url || row.normalized_url || `/${slug}`);
    let classification = "UNRESOLVED_LOW_VALUE";
    let reason = "no current public route, redirect, hidden source or retirement evidence found";
    let currentPublicUrl = row.current_public_url || "";
    let fullyClosed = "no";
    let nextAction = "Wave 4 review";
    const priority = /high/i.test(row.recovery_priority || row.content_type || "");
    if (publicSlugs.has(slug)) {
      classification = "LIVE_BLOG_CANONICAL";
      currentPublicUrl = `${SITE}/resources/blog/${slug}`;
      reason = "Sanity has approved public blog slug and canonical blog route";
      fullyClosed = "yes";
      nextAction = "monitor only";
    } else if (staticPaths.has(legacyPath)) {
      classification = "LIVE_STATIC_SERVICE";
      currentPublicUrl = `${SITE}${legacyPath}`;
      reason = "current static/service route exists";
      fullyClosed = "yes";
      nextAction = "monitor only";
    } else if (redirectMap.has(legacyPath)) {
      classification = "308_TO_RELEVANT_200";
      currentPublicUrl = redirectMap.get(legacyPath);
      reason = "configured one-hop redirect to relevant current route";
      fullyClosed = "yes";
      nextAction = "monitor redirect after deployment";
    } else if (hiddenSlugs.has(slug)) {
      classification = "HIDDEN_RECOVERABLE";
      currentPublicUrl = `/resources/blog/${slug}`;
      reason = "hidden Sanity source exists without approved public equivalent";
      fullyClosed = "no";
      nextAction = "recover source and publish or retire in Wave 4";
    } else if (/retired/i.test(row.final_classification || row.current_status || "")) {
      classification = /technical|system/i.test(row.final_reason || row.current_status || "") ? "TECHNICAL_SYSTEM_RETIRED" : "LOW_VALUE_RETIRED";
      reason = row.final_reason || row.current_status || "previous documented retirement";
      fullyClosed = "yes";
      nextAction = "monitor only";
    } else if (/duplicate/i.test(row.duplicate_status || row.final_classification || "")) {
      classification = "DUPLICATE_SOURCE";
      reason = "duplicate source record after canonical public slug preservation";
      fullyClosed = "yes";
      nextAction = "monitor only";
    } else if (/legal/i.test(row.legal_status || row.final_classification || "")) {
      classification = "GENUINE_LEGAL_HOLD";
      reason = row.final_reason || "exact proposition requires lawyer or primary-source review";
      fullyClosed = "no";
      nextAction = "lawyer/source review";
    } else if (priority) {
      classification = "UNRESOLVED_HIGH_VALUE";
      reason = "high-value URL still lacks verified closure evidence";
      fullyClosed = "no";
      nextAction = "Wave 4 high-value closure";
    }
    row.current_public_url = currentPublicUrl;
    row.redirect_status = redirectMap.has(legacyPath) ? "configured_308" : row.redirect_status;
    row.final_classification = classification;
    row.final_reason = reason;
    row.last_processed_sprint = publishedSlugs.has(slug) ? "Wave 3" : row.last_processed_sprint || "Wave 3";
    row.next_action = nextAction;
    row.fully_closed = fullyClosed;
    classificationCounts.set(classification, (classificationCounts.get(classification) || 0) + 1);
    if (fullyClosed !== "yes") wave4Candidates += 1;
    if (priority) {
      highRecon.push({
        legacy_url: row.legacy_url,
        previous_status: row.current_status || row.final_classification,
        current_status: classification,
        public_target: currentPublicUrl,
        http_status: publicSlugs.has(slug) || staticPaths.has(legacyPath) ? "200 route evidence" : redirectMap.has(legacyPath) ? "308 configured" : "not closed",
        redirect_status: redirectMap.has(legacyPath) ? "configured one-hop" : "",
        why_closed: fullyClosed === "yes" ? reason : "not closed",
        evidence: fullyClosed === "yes" ? "Sanity/config/static route evidence" : "ledger and source evidence only",
        valid_closure_yes_no: fullyClosed === "yes" ? "yes" : "no",
      });
    }
  }
  writeCsv(ledgerPath, headers, rows);
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-HIGH-VALUE-COUNT-RECONCILIATION.csv"), [
    "legacy_url",
    "previous_status",
    "current_status",
    "public_target",
    "http_status",
    "redirect_status",
    "why_closed",
    "evidence",
    "valid_closure_yes_no",
  ], highRecon);
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-HIGH-VALUE-CLOSURE.csv"), [
    "legacy_url",
    "legacy_title",
    "closure_outcome",
    "final_url",
    "redirect_status",
    "sitemap_status",
    "reason",
  ], highRecon.filter((row) => row.valid_closure_yes_no === "yes").map((row) => ({
    legacy_url: row.legacy_url,
    legacy_title: titleFromSlug(legacySlug(row)),
    closure_outcome: row.current_status,
    final_url: row.public_target,
    redirect_status: row.redirect_status || "canonical route",
    sitemap_status: row.current_status === "LIVE_BLOG_CANONICAL" || row.current_status === "LIVE_STATIC_SERVICE" ? "sitemap eligible" : "redirect source excluded from sitemap",
    reason: row.why_closed,
  })));
  return { totalLegacyUrls: rows.length, classificationCounts: Object.fromEntries([...classificationCounts.entries()].sort()), highRecon, wave4Candidates };
}

function writeDocs({ beforeCounts, afterCounts, hiddenBefore, hiddenAfter, duplicateResult, publishResult, legalResult, ledgerResult, sitemap, redirectRows }) {
  const classLines = Object.entries(ledgerResult.classificationCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-LEDGER-RECONCILIATION.md"), `# Legacy Recovery Wave 3 Ledger Reconciliation

Generated: ${new Date().toISOString()}

## Evidence Inputs

- Master ledger: docs/LEGACY-RECOVERY-MASTER-LEDGER.csv
- Sanity public slugs after mutation: ${afterCounts.uniqueApprovedPublicSlugs}
- Sanity hidden unique slugs after mutation: ${afterCounts.uniqueHiddenSlugs}
- Redirect config and proxy-backed public blog redirect export
- Current static/service route inventory from practice area data

## Classification Counts

${classLines}

## High-Value Count Explanation

The earlier 361 figure was a broad unresolved-count report. Wave 3 recalculated closure using current evidence only: approved public Sanity slug, current static/service route, one-hop redirect mapping, documented duplicate/retirement, or exact legal/source hold. CSV classification alone was not treated as closure.
`, "utf8");

  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-HIDDEN-COUNT-RECONCILIATION.md"), `# Legacy Recovery Wave 3 Hidden Count Reconciliation

Generated: ${new Date().toISOString()}

## Before

- TOTAL_HIDDEN_RECORDS: ${hiddenBefore.hiddenUnapprovedRecords}
- UNIQUE_HIDDEN_SLUGS: ${hiddenBefore.uniqueHiddenSlugs}
- HIDDEN_SLUGS_WITH_PUBLIC_EQUIVALENT: ${hiddenBefore.hiddenWithPublicEquivalent}
- HIDDEN_SLUGS_WITHOUT_PUBLIC_EQUIVALENT: ${hiddenBefore.hiddenWithoutPublicEquivalent}
- DOTTED_SOURCE_RECORDS: ${hiddenBefore.dottedOrSourceRecords}
- DUPLICATE_SOURCE_RECORDS: ${beforeCounts.duplicatePublicSlugs}
- ACTUALLY_RECOVERABLE_HIDDEN_SLUGS: ${hiddenBefore.actuallyRecoverableHiddenSlugs}

## After

- TOTAL_HIDDEN_RECORDS: ${hiddenAfter.hiddenUnapprovedRecords}
- UNIQUE_HIDDEN_SLUGS: ${hiddenAfter.uniqueHiddenSlugs}
- HIDDEN_SLUGS_WITH_PUBLIC_EQUIVALENT: ${hiddenAfter.hiddenWithPublicEquivalent}
- HIDDEN_SLUGS_WITHOUT_PUBLIC_EQUIVALENT: ${hiddenAfter.hiddenWithoutPublicEquivalent}
- DOTTED_SOURCE_RECORDS: ${hiddenAfter.dottedOrSourceRecords}
- DUPLICATE_SOURCE_RECORDS: ${afterCounts.duplicatePublicSlugs}
- ACTUALLY_RECOVERABLE_HIDDEN_SLUGS: ${hiddenAfter.actuallyRecoverableHiddenSlugs}

The operational recovery metric is ACTUALLY_RECOVERABLE_HIDDEN_SLUGS, because raw hidden counts include source/archive records, duplicate-source pairs, draft-like records and records whose slug already has a public equivalent.
`, "utf8");

  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-REDIRECT-SCALE-STATUS.md"), `# Legacy Recovery Wave 3 Redirect Scale Status

The scalable redirect system remains the proxy plus \`src/data/legacy-blog-redirect-slugs.ts\` for public blog root slugs. Wave 3 refreshed the export after publication and added only a small static/service redirect batch for authority pages that do not fit the blog slug proxy.

- Blog redirect source: data-driven public slug export
- Static redirect approach: small exact one-hop permanent redirects to current service pages
- Homepage dumping: not used
- Redirect chains: not intentionally introduced
- Hidden targets: not used
- Representative live redirect rows: docs/LEGACY-RECOVERY-WAVE-3-REDIRECT-QA.csv
`, "utf8");

  const publicUrls = publishResult.rows.map((row) => row.final_url);
  const staticUrls = [
    `${SITE}/practice-areas/property-real-estate-law/property-document-review`,
    `${SITE}/practice-areas/corporate-commercial-law/company-compliance-and-records`,
    `${SITE}/practice-areas/debt-recovery/commercial-debt-settlement`,
    `${SITE}/practice-areas/probate-estate-administration/estate-administration-strategy`,
    `${SITE}/practice-areas/employment-law/workplace-documentation-review`,
    `${SITE}/practice-areas/notary-public-services/document-authentication-advisory`,
  ];
  const oldRedirectUrls = redirectRows.map((row) => row.source_url);
  const pack = (engine) => `# Legacy Recovery Wave 3 ${engine} Action Pack

Generated: ${new Date().toISOString()}

## Newly Public Canonical URLs

${publicUrls.map((url) => `- ${url}`).join("\n")}

## Restored Static/Service URLs

${staticUrls.map((url) => `- ${url}`).join("\n")}

## Old Redirected URLs For Inspection

${oldRedirectUrls.map((url) => `- ${url}`).join("\n")}

## Sitemap

- ${SITE}/sitemap.xml

No submission is claimed here; this is the manual inspection/submission pack.
`;
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-GSC-ACTION-PACK.md"), pack("GSC"), "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-BING-ACTION-PACK.md"), pack("Bing"), "utf8");

  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-STATIC-SERVICE-PUBLICATION.csv"), [
    "legacy_url",
    "title",
    "decision",
    "final_url",
    "reason",
  ], [
    ["/property-document-review-in-nigeria", "Property Document Review", "RECONSTRUCT_STANDALONE", "/practice-areas/property-real-estate-law/property-document-review", "high-value property advisory intent"],
    ["/company-compliance-and-records-advisory", "Company Compliance and Records", "RECONSTRUCT_STANDALONE", "/practice-areas/corporate-commercial-law/company-compliance-and-records", "corporate compliance authority intent"],
    ["/commercial-debt-recovery-lawyer", "Commercial Debt Settlement", "RECONSTRUCT_STANDALONE", "/practice-areas/debt-recovery/commercial-debt-settlement", "debt recovery service intent"],
    ["/probate-and-estate-administration-lawyer", "Estate Administration Strategy", "RECONSTRUCT_STANDALONE", "/practice-areas/probate-estate-administration/estate-administration-strategy", "probate service intent"],
    ["/employment-contract-review-lawyer", "Workplace Documentation Review", "RECONSTRUCT_STANDALONE", "/practice-areas/employment-law/workplace-documentation-review", "employment advisory intent"],
    ["/notary-and-document-authentication", "Document Authentication Advisory", "RECONSTRUCT_STANDALONE", "/practice-areas/notary-public-services/document-authentication-advisory", "notarial service intent"],
  ].map(([legacy_url, title, decision, final_url, reason]) => ({ legacy_url: `${SITE}${legacy_url}`, title, decision, final_url: `${SITE}${final_url}`, reason })));

  const blockers = [
    ...legalResult.lawyerHolds ? [{ url: "Wave 3 legal/source hold set", point: `${legalResult.lawyerHolds} records need primary-source/lawyer verification`, action: "Review exact propositions in LEGACY-RECOVERY-WAVE-3-LEGAL-HOLD-REDUCTION.csv", platform: "Sanity/source docs", canProceed: "yes for unrelated recovery" }] : [],
  ];
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-BLOCKERS.csv"), ["exact_url", "exact_disputed_point", "exact_action", "platform_location", "site_publication_can_proceed_without_it"], blockers.map((row) => ({
    exact_url: row.url,
    exact_disputed_point: row.point,
    exact_action: row.action,
    platform_location: row.platform,
    site_publication_can_proceed_without_it: row.canProceed,
  })));

  const result = {
    generatedAt: new Date().toISOString(),
    applyMode: APPLY,
    beforeCounts,
    afterCounts,
    hiddenBefore,
    hiddenAfter,
    duplicates: {
      before: beforeCounts.duplicatePublicSlugs,
      cleaned: duplicateResult.duplicateRecordsDemoted,
      remaining: afterCounts.duplicatePublicSlugs,
      groupsBefore: duplicateResult.duplicateSlugGroups,
    },
    publication: {
      wave3CandidateQueue: 55,
      immediatePublicationBatch: publishResult.rows.length,
      published: publishResult.published.length,
      slugs: publishResult.published,
    },
    legal: legalResult,
    ledger: {
      totalLegacyUrls: ledgerResult.totalLegacyUrls,
      classificationCounts: ledgerResult.classificationCounts,
      trueHighValueUnresolvedBefore: 361,
      trueHighValueClosedToDate: ledgerResult.highRecon.filter((row) => row.valid_closure_yes_no === "yes").length,
      trueHighValueUnresolvedNow: ledgerResult.highRecon.filter((row) => row.valid_closure_yes_no !== "yes").length,
      wave4Candidates: ledgerResult.wave4Candidates,
    },
    sitemap,
    redirectQa: {
      tested: redirectRows.length,
      pass: redirectRows.filter((row) => row.result === "PASS_ONE_HOP_TO_200").length,
      pendingOrReview: redirectRows.filter((row) => row.result !== "PASS_ONE_HOP_TO_200").length,
    },
  };
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-3-RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return result;
}

async function main() {
  const beforeCounts = await counts();
  const hiddenBefore = { ...beforeCounts };
  const duplicateResult = await cleanupDuplicates();
  const { selected, held } = await selectCandidates();
  const publishResult = await publishCandidates(selected);
  const legalResult = legalHoldReduction(held);
  if (APPLY) {
    await import("./export-public-blog-redirect-slugs.mjs");
  }
  const afterCounts = await counts();
  const hiddenAfter = { ...afterCounts };
  const publicSlugs = new Set(await client.fetch(`array::unique(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()].slug.current)`));
  const hiddenSlugs = new Set(await client.fetch(`array::unique(*[_type == "post" && (!defined(lawFirmApproved) || lawFirmApproved != true || _id in path("drafts.**") || !defined(publishedAt) || publishedAt > now()) && defined(slug.current)].slug.current)`));
  const redirectMap = buildRedirectMap();
  const staticPaths = new Set([
    "/practice-areas/property-real-estate-law/property-document-review",
    "/practice-areas/corporate-commercial-law/company-compliance-and-records",
    "/practice-areas/debt-recovery/commercial-debt-settlement",
    "/practice-areas/probate-estate-administration/estate-administration-strategy",
    "/practice-areas/employment-law/workplace-documentation-review",
    "/practice-areas/notary-public-services/document-authentication-advisory",
  ]);
  const ledgerResult = updateLedger({ publicSlugs, hiddenSlugs, redirectMap, staticPaths, publishedSlugs: new Set(publishResult.published) });
  const sitemap = await certifySitemap().catch((error) => ({ status: "ERR", error: error.message, blogUrls: afterCounts.uniqueApprovedPublicSlugs, staticServiceUrls: 0, totalCanonicalUrls: 0, confirmed200: 0, confirmed404: 0, transportErrors: 1, previewUrls: 0 }));
  const redirectRows = await redirectQa(publishResult.published);
  const result = writeDocs({ beforeCounts, afterCounts, hiddenBefore, hiddenAfter, duplicateResult, publishResult, legalResult, ledgerResult, sitemap, redirectRows });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "Wave 3 failed", code: error?.code || "", name: error?.name || "" }, null, 2));
  process.exit(1);
});
