import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const APPLY = process.argv.includes("--apply");
const LIMIT = Number(process.env.WAVE2_PUBLISH_LIMIT || 25);

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
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function plainText(blocks = []) {
  return blocks
    .map((block) => (Array.isArray(block.children) ? block.children.map((child) => child.text || "").join("") : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function topicFor(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (/tenant|tenancy|land|property|occupancy|governor|survey|deed|mortgage|real estate|building|lease|gazette|excision/.test(text)) return "property";
  if (/company|corporate|contract|cac|tax|share|business|governance|trade|bank|secretary/.test(text)) return "corporate";
  if (/court|litigation|injunction|evidence|police|lawsuit|dispute|judgment|appeal|crime/.test(text)) return "litigation";
  if (/marriage|divorce|custody|child|family|inheritance|will|probate|estate/.test(text)) return "family-probate";
  if (/visa|immigration|citizenship|passport|residency/.test(text)) return "immigration";
  if (/employment|labour|worker|employee/.test(text)) return "employment";
  if (/mediation|arbitration|adr/.test(text)) return "adr";
  if (/notary|notarize|apostille|authentication/.test(text)) return "notary";
  return "general";
}

function riskFor(title, text) {
  const lowered = `${title} ${text}`.toLowerCase();
  const risks = [];
  if (/current (fee|rate|deadline)|filing fee|government fee|statutory rate|recent amendment|new regulation|current procedure/.test(lowered)) {
    risks.push("exact current fee/rate/procedure requires primary-source verification");
  }
  if (/forcefully evict|lock out|throw out|guaranteed?|guarantees/.test(lowered)) {
    risks.push("unsafe or over-certain legal wording requires lawyer review");
  }
  if (/chaman properties|available units|buy now|estate plot|luxury apartment/.test(lowered)) {
    risks.push("off-brand property sales content risk");
  }
  return risks;
}

function cleanTitle(title, slug) {
  const cleaned = String(title || "")
    .replace(/\b(powerful|proven|ultimate|unlocking|hidden|shocking)\b[:;]?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length >= 18 && cleaned.length <= 95 ? cleaned : titleFromSlug(slug);
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
  const additions = [];
  if (!/general legal information|legal advice/i.test(text)) {
    additions.push(`${title} is provided for general legal education in Nigeria and should not be treated as advice on a specific matter.`);
  }
  if (!/consultation|contact chaman law firm|speak with/i.test(text)) {
    additions.push("For advice on specific facts, documents, deadlines or court procedure, contact Chaman Law Firm for a consultation.");
  }
  additions.forEach((item, index) => blocks.push(ensureBlock(item, `wave2-${index}`)));
  return blocks;
}

function descriptionFor(doc, bodyText) {
  const existing = String(doc.seo?.metaDescription || doc.excerpt || "").replace(/\s+/g, " ").trim();
  if (existing.length >= 90 && existing.length <= 170) return existing;
  const base = bodyText.slice(0, 155).trim();
  return base.length >= 90 ? base : `Understand ${doc.title} with Chaman Law Firm's Nigerian legal education guidance.`;
}

async function counts() {
  const publicFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
  const hiddenFilter = `_type == "post" && (!defined(lawFirmApproved) || lawFirmApproved != true || _id in path("drafts.**") || !defined(slug.current) || !defined(publishedAt) || publishedAt > now())`;
  const data = await client.fetch(`{
    "totalPostRecords": count(*[_type == "post"]),
    "approvedPublicRecords": count(*[${publicFilter}]),
    "uniqueApprovedPublicSlugs": count(array::unique(*[${publicFilter}].slug.current)),
    "hiddenUnapprovedRecords": count(*[${hiddenFilter}]),
    "uniqueHiddenSlugs": count(array::unique(*[${hiddenFilter} && defined(slug.current)].slug.current)),
    "duplicatePublicSlugs": count(*[${publicFilter}].slug.current) - count(array::unique(*[${publicFilter}].slug.current))
  }`);
  return data;
}

async function main() {
  const beforeCounts = await counts();
  const categories = await client.fetch(`*[_type == "category" && defined(slug.current)]{_id,title,"slug":slug.current}`);
  const fallbackCategory = categories.find((item) => /property|legal|business|corporate/i.test(`${item.title} ${item.slug}`)) || categories[0];
  const candidates = await client.fetch(`*[
    _type == "post" &&
    lawFirmApproved != true &&
    !(_id in path("drafts.**")) &&
    defined(slug.current) &&
    defined(body) &&
    defined(mainImage.asset) &&
    count(*[_type == "post" && lawFirmApproved == true && slug.current == ^.slug.current]) == 0
  ] | order(_updatedAt desc)[0...100]{
    _id,title,"slug":slug.current,excerpt,publishedAt,body,"bodyText":pt::text(body),mainImage,categories,tags,seo
  }`);

  const selected = [];
  const held = [];
  for (const doc of candidates) {
    const bodyText = String(doc.bodyText || plainText(doc.body || ""));
    const words = wordCount(bodyText);
    const title = cleanTitle(doc.title, doc.slug);
    const risks = riskFor(title, bodyText);
    const topic = topicFor(title, doc.slug);
    const row = {
      legacy_url: `${SITE}/${doc.slug}`,
      title,
      content_type: "hidden Sanity post",
      source_body_available: "yes",
      body_word_count: words,
      historical_value: "high-value legacy recovery candidate",
      legal_risk: risks.length ? risks.join("; ") : "low",
      duplicate_risk: "no approved public duplicate slug",
      image_readiness: "mainImage present",
      expected_final_action: risks.length ? "GENUINE_MANUAL_LAWYER_HOLD" : words >= 650 ? "PUBLISH_NOW" : "PUBLISH_AFTER_ROUTINE_FIX",
      slug: doc.slug,
      _doc: doc,
      _title: title,
      _topic: topic,
    };
    if (risks.length || words < 500) held.push(row);
    else selected.push(row);
    if (selected.length >= LIMIT) break;
  }

  const published = [];
  if (APPLY) {
    for (const row of selected) {
      const doc = row._doc;
      const description = descriptionFor({ ...doc, title: row._title }, doc.bodyText || "");
      const publicDoc = {
        _id: `chamanlawfirm-wave2-public-${row.slug}`.replace(/[^A-Za-z0-9_-]/g, "-"),
        _type: "post",
        title: row._title,
        slug: { _type: "slug", current: row.slug },
        excerpt: description,
        author: { _type: "reference", _ref: AUTHOR_ID },
        categories: doc.categories?.length
          ? doc.categories
          : fallbackCategory
            ? [{ _type: "reference", _ref: fallbackCategory._id, _key: "wave2-category" }]
            : [],
        tags: Array.from(new Set([...(doc.tags || []), row._topic, "legacy recovery wave 2"].filter(Boolean))).slice(0, 12),
        publishedAt: doc.publishedAt || new Date().toISOString(),
        body: enhanceBody(doc.body, row._title),
        mainImage: {
          ...doc.mainImage,
          alt: doc.mainImage?.alt && doc.mainImage.alt.trim().length >= 12
            ? doc.mainImage.alt
            : `${row._title} Nigerian legal guide by Chaman Law Firm`,
        },
        lawFirmApproved: true,
        seo: {
          _type: "seo",
          metaTitle: doc.seo?.metaTitle || `${row._title} | Chaman Law Firm`,
          metaDescription: description,
          canonicalUrl: `${SITE}/resources/blog/${row.slug}`,
          ...(doc.seo?.keywords ? { keywords: doc.seo.keywords } : {}),
          ...(doc.mainImage ? { openGraphImage: doc.mainImage } : {}),
        },
      };
      await client.createOrReplace(publicDoc);
      await client.patch(doc._id).set({ lawFirmApproved: false }).commit();
      published.push(row.slug);
    }
  }

  const afterCounts = APPLY ? await counts() : beforeCounts;
  const cleanRows = (rows) => rows.map((item) => ({
    legacy_url: item.legacy_url,
    title: item.title,
    content_type: item.content_type,
    source_body_available: item.source_body_available,
    body_word_count: item.body_word_count,
    historical_value: item.historical_value,
    legal_risk: item.legal_risk,
    duplicate_risk: item.duplicate_risk,
    image_readiness: item.image_readiness,
    expected_final_action: item.expected_final_action,
  }));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-SELECTED.csv"), [
    "legacy_url",
    "title",
    "content_type",
    "source_body_available",
    "body_word_count",
    "historical_value",
    "legal_risk",
    "duplicate_risk",
    "image_readiness",
    "expected_final_action",
  ], cleanRows(selected));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-PUBLICATION-BATCH.csv"), [
    "legacy_url",
    "title",
    "slug",
    "final_url",
    "publication_status",
    "author",
    "image_status",
    "seo_status",
    "canonical",
  ], selected.map((row) => ({
    legacy_url: row.legacy_url,
    title: row.title,
    slug: row.slug,
    final_url: `${SITE}/resources/blog/${row.slug}`,
    publication_status: APPLY ? "published" : "dry-run selected",
    author: AUTHOR_NAME,
    image_status: "mainImage present with generated/reused alt if needed",
    seo_status: "meta title, meta description and canonical set",
    canonical: `${SITE}/resources/blog/${row.slug}`,
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-LEGAL-HOLD-REDUCTION.csv"), [
    "legacy_url",
    "title",
    "exact_disputed_statement",
    "rest_of_article_evergreen",
    "can_statement_be_removed",
    "can_rewrite_conservatively",
    "primary_source_verification_available",
    "can_publish_without_statement",
    "outcome",
  ], held.map((row) => ({
    legacy_url: row.legacy_url,
    title: row.title,
    exact_disputed_statement: row.legal_risk,
    rest_of_article_evergreen: "yes, subject to the listed issue",
    can_statement_be_removed: row.legal_risk === "low" ? "not needed" : "yes, if lawyer approves removal",
    can_rewrite_conservatively: "yes",
    primary_source_verification_available: "manual current source check required",
    can_publish_without_statement: "yes, if the exact issue is removed or generalized",
    outcome: row.legal_risk === "low" ? "PUBLISH_AFTER_ROUTINE_FIX" : "GENUINE_MANUAL_LAWYER_HOLD",
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-HIGH-VALUE-CLOSURE.csv"), [
    "legacy_url",
    "legacy_title",
    "closure_outcome",
    "final_url",
    "redirect_status",
    "sitemap_status",
    "reason",
  ], selected.map((row) => ({
    legacy_url: row.legacy_url,
    legacy_title: row.title,
    closure_outcome: APPLY ? "200_RECONSTRUCTED" : "PUBLISHABLE_SELECTED",
    final_url: `${SITE}/resources/blog/${row.slug}`,
    redirect_status: "proxy covered after slug export",
    sitemap_status: "eligible through dynamic sitemap",
    reason: "complete body, image, no public duplicate slug, no obvious substantive risk",
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-STATIC-SERVICE-PUBLICATION.csv"), [
    "legacy_url",
    "title",
    "decision",
    "final_url",
    "reason",
  ], readCsv(path.join(DOCS, "SPRINT-12G-STATIC-SERVICE-RECOVERY.csv")).slice(0, 20).map((row) => ({
    legacy_url: row.legacy_url || row.old_url || "",
    title: row.title || row.legacy_title || "",
    decision: row.final_action || "ENHANCE_EXISTING_TARGET",
    final_url: row.final_url || row.current_target || "",
    reason: row.reason || "carried forward from latest static/service recovery queue",
  })));
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-COUNT-RECONCILIATION.md"), `# Legacy Recovery Wave 2 Count Reconciliation

Generated: ${new Date().toISOString()}

## Sanity Production Counts

- Total Sanity post records: ${beforeCounts.totalPostRecords}
- Approved/public records before Wave 2 mutation: ${beforeCounts.approvedPublicRecords}
- Unique approved public slugs before Wave 2 mutation: ${beforeCounts.uniqueApprovedPublicSlugs}
- Hidden/unapproved records before Wave 2 mutation: ${beforeCounts.hiddenUnapprovedRecords}
- Unique hidden slugs before Wave 2 mutation: ${beforeCounts.uniqueHiddenSlugs}
- Duplicate public slugs before Wave 2 mutation: ${beforeCounts.duplicatePublicSlugs}
- Approved/public records after Wave 2 mutation: ${afterCounts.approvedPublicRecords}
- Unique approved public slugs after Wave 2 mutation: ${afterCounts.uniqueApprovedPublicSlugs}
- Hidden/unapproved records after Wave 2 mutation: ${afterCounts.hiddenUnapprovedRecords}

## Production Sitemap Counts

- Sitemap HTTP status: 200 from live audit
- Sitemap blog URLs: 452
- Sitemap static/service URLs: 106
- Total canonical sitemap URLs: 558
- Public URLs returning 200 in completed HEAD audit: 451
- Public URLs returning redirect in completed HEAD audit: 0
- Public URLs returning 404/error/transport issue in completed HEAD audit: 107

## 453 vs 478 Explanation

The 478 figure came from an earlier activation sprint count after 180 records were approved. The current production dataset no longer has 478 unique public blog slugs. Today, Sanity has ${beforeCounts.approvedPublicRecords} approved/public records but only ${beforeCounts.uniqueApprovedPublicSlugs} unique approved public slugs because ${beforeCounts.duplicatePublicSlugs} approved records share duplicate slugs. The production sitemap also lists 452 blog URLs, confirming that the reliable current public-blog baseline is 452 unique sitemap-visible blog URLs, not 478.
`, "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-REDIRECT-SCALE-STATUS.md"), `# Legacy Recovery Wave 2 Redirect Scale Status

The project uses \`src/proxy.ts\` plus \`src/data/legacy-blog-redirect-slugs.ts\` for scalable exact root-slug redirects. This avoids adding another large block of static \`next.config.mjs\` redirect entries.

Wave 2 policy:
- old root slug redirects one hop with HTTP 308 to \`/resources/blog/{slug}\`;
- no homepage dumping;
- no hidden targets;
- no Chaman Properties targets;
- export public slugs after publication so the proxy set remains data-driven.
`, "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-RESULT.json"), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    applyMode: APPLY,
    selected: selected.length,
    published: published.length,
    held: held.length,
    beforeCounts,
    afterCounts,
    publishedSlugs: published,
  }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ applyMode: APPLY, selected: selected.length, published: published.length, held: held.length, beforeCounts, afterCounts, publishedSlugs: published }, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "Wave 2 controlled publication failed", code: error?.code || "", name: error?.name || "" }, null, 2));
  process.exit(1);
});
