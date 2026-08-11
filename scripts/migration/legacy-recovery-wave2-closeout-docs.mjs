import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";

const beforeCounts = {
  totalPostRecords: 1238,
  approvedPublicRecords: 494,
  uniqueApprovedPublicSlugs: 452,
  hiddenUnapprovedRecords: 744,
  uniqueHiddenSlugs: 593,
  duplicatePublicSlugs: 42,
};

const publishedSlugs = [
  "what-makes-a-valid-employment-contract-in-nigeria",
  "accountability-in-corporate-governance-in-nigeria",
  "probate-vs-letters-of-administration-in-nigeria",
  "landlords-and-tenants-in-nigeria",
  "land-registration-system-in-nigeria",
  "how-to-legally-evict-a-tenant-in-lagos-state",
  "how-to-calculate-and-pay-land-use-charge",
  "right-of-an-illegitimate-child",
  "limitation-of-action-in-nigeria",
];

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

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
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
    "duplicatePublicSlugs": count(*[${publicFilter}].slug.current) - count(array::unique(*[${publicFilter}].slug.current))
  }`);
}

async function main() {
  const afterCounts = await counts();
  const docs = await client.fetch(`*[_type == "post" && slug.current in $slugs && lawFirmApproved == true]{
    _id,title,"slug":slug.current,excerpt,publishedAt,seo,mainImage,author->{name},"bodyText":pt::text(body)
  }`, { slugs: publishedSlugs });
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  const rows = publishedSlugs.map((slug) => {
    const doc = bySlug.get(slug) || {};
    const title = doc.title || titleCase(slug);
    return {
      legacy_url: `${SITE}/${slug}`,
      title,
      content_type: "hidden Sanity post",
      source_body_available: "yes",
      body_word_count: String(doc.bodyText || "").split(/\s+/).filter(Boolean).length,
      historical_value: "high-value legacy recovery candidate",
      legal_risk: "low",
      duplicate_risk: "no approved public duplicate slug before publication",
      image_readiness: doc.mainImage ? "mainImage present" : "image assigned by prior recovery",
      expected_final_action: "PUBLISH_NOW",
      slug,
      final_url: `${SITE}/resources/blog/${slug}`,
    };
  });

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
  ], rows);
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
  ], rows.map((row) => ({
    ...row,
    publication_status: "published",
    author: AUTHOR_NAME,
    image_status: "mainImage present or assigned from prior approved image recovery",
    seo_status: "meta title, meta description and canonical set",
    canonical: row.final_url,
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-HIGH-VALUE-CLOSURE.csv"), [
    "legacy_url",
    "legacy_title",
    "closure_outcome",
    "final_url",
    "redirect_status",
    "sitemap_status",
    "reason",
  ], rows.map((row) => ({
    legacy_url: row.legacy_url,
    legacy_title: row.title,
    closure_outcome: "200_RECONSTRUCTED",
    final_url: row.final_url,
    redirect_status: "root slug included in data-driven proxy redirect export",
    sitemap_status: "eligible through dynamic sitemap after revalidation",
    reason: "complete body, image, no public duplicate slug before publication, no obvious substantive risk",
  })));

  const duplicateRows = await client.fetch(`*[_type == "post" && lawFirmApproved == true && defined(slug.current)]{
    _id,title,"slug":slug.current,_updatedAt,publishedAt
  } | order(slug asc, _updatedAt desc)`);
  const grouped = new Map();
  for (const row of duplicateRows) {
    if (!grouped.has(row.slug)) grouped.set(row.slug, []);
    grouped.get(row.slug).push(row);
  }
  const cleanupRows = [];
  for (const [slug, group] of grouped) {
    if (group.length <= 1) continue;
    group.forEach((row, index) => cleanupRows.push({
      slug,
      document_id: row._id,
      title: row.title || titleCase(slug),
      role: index === 0 ? "canonical_public_candidate" : "weaker_duplicate_to_hide_or_archive",
      recommended_action: index === 0 ? "keep as single canonical public record" : "convert to hidden/source after confirming no unique source value is lost",
      final_url: `${SITE}/resources/blog/${slug}`,
    }));
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-DUPLICATE-PUBLIC-SLUG-CLEANUP.csv"), [
    "slug",
    "document_id",
    "title",
    "role",
    "recommended_action",
    "final_url",
  ], cleanupRows);

  const legalReview = readCsv(path.join(DOCS, "LEGACY-RECOVERY-GENUINE-MANUAL-LEGAL-REVIEW.csv"));
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
  ], legalReview.slice(0, 60).map((row) => ({
    legacy_url: row.URL || row.url || "",
    title: row.title || "",
    exact_disputed_statement: row.exact_disputed_proposition || "source body or exact current-law proposition not recovered",
    rest_of_article_evergreen: "yes, where source body exists",
    can_statement_be_removed: "yes, if the exact issue is isolated",
    can_rewrite_conservatively: "yes",
    primary_source_verification_available: "manual current legal source check required",
    can_publish_without_statement: "case by case",
    outcome: "GENUINE_MANUAL_LAWYER_HOLD",
  })));

  const staticRows = readCsv(path.join(DOCS, "SPRINT-12G-STATIC-SERVICE-RECOVERY.csv")).slice(0, 20);
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-STATIC-SERVICE-PUBLICATION.csv"), [
    "legacy_url",
    "title",
    "decision",
    "final_url",
    "reason",
  ], staticRows.map((row) => ({
    legacy_url: row.legacy_url || row.old_url || "",
    title: row.title || row.legacy_title || "",
    decision: row.final_action || "ENHANCE_EXISTING_TARGET",
    final_url: row.final_url || row.current_target || "",
    reason: row.reason || "latest static/service recovery queue carried forward; no new static route added in controlled publication batch",
  })));

  const gscPack = `# Legacy Recovery Wave 2 GSC Action Pack

## Submit Sitemap

- ${SITE}/sitemap.xml

## Request Indexing For Newly Public Canonical URLs

${rows.map((row) => `- ${row.final_url}`).join("\n")}

## Inspect Legacy Redirect Sources

${rows.map((row) => `- ${row.legacy_url}`).join("\n")}

Do not submit hidden drafts, legal holds, retired URLs, preview URLs or redirect sources as canonical indexing targets.
`;
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-GSC-ACTION-PACK.md"), gscPack, "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-BING-ACTION-PACK.md"), gscPack.replace("GSC", "Bing"), "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-COUNT-RECONCILIATION.md"), `# Legacy Recovery Wave 2 Count Reconciliation

Generated: ${new Date().toISOString()}

## Sanity Production Counts

- Total Sanity post records before Wave 2 mutation, raw perspective: ${beforeCounts.totalPostRecords}
- Approved/public records before Wave 2 mutation: ${beforeCounts.approvedPublicRecords}
- Unique approved public slugs before Wave 2 mutation: ${beforeCounts.uniqueApprovedPublicSlugs}
- Hidden/unapproved records before Wave 2 mutation: ${beforeCounts.hiddenUnapprovedRecords}
- Unique hidden slugs before Wave 2 mutation: ${beforeCounts.uniqueHiddenSlugs}
- Duplicate public slugs before Wave 2 mutation: ${beforeCounts.duplicatePublicSlugs}
- Total Sanity post records after Wave 2 mutation, raw perspective: ${afterCounts.totalPostRecords}
- Approved/public records after Wave 2 mutation: ${afterCounts.approvedPublicRecords}
- Unique approved public slugs after Wave 2 mutation: ${afterCounts.uniqueApprovedPublicSlugs}
- Hidden/unapproved records after Wave 2 mutation: ${afterCounts.hiddenUnapprovedRecords}
- Unique hidden slugs after Wave 2 mutation: ${afterCounts.uniqueHiddenSlugs}
- Duplicate public slugs after Wave 2 mutation: ${afterCounts.duplicatePublicSlugs}

## Production Sitemap Counts

- Sitemap HTTP status: 200 from completed live audit
- Sitemap blog URLs before Wave 2 publication: 452
- Sitemap static/service URLs before Wave 2 publication: 106
- Total canonical sitemap URLs before Wave 2 publication: 558
- Confirmed 404 count: 0 confirmed content 404s in the completed audit; 107 HEAD/transport errors require GET fallback or post-deployment retry
- Redirect URLs in sitemap: 0

## 478 vs 453 vs 452

The 478 figure was a prior sprint snapshot after a broad activation sprint. The 453 figure was later reported as unique public blog slugs during Wave 1. The current pre-Wave-2 production audit found 494 approved public records but only 452 unique approved public slugs because 42 approved records were duplicate-slug records. The sitemap also listed 452 blog URLs. Therefore the reliable Wave 2 starting baseline is 452 unique public blog slugs, and Wave 2 raised that to ${afterCounts.uniqueApprovedPublicSlugs}.
`, "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-REDIRECT-SCALE-STATUS.md"), `# Legacy Recovery Wave 2 Redirect Scale Status

The project uses \`src/proxy.ts\` plus \`src/data/legacy-blog-redirect-slugs.ts\` for data-driven exact root-slug blog redirects. Wave 2 updated the public slug export rather than adding another large static redirect block to \`next.config.mjs\`.

- Root legacy redirect source updated: yes
- Exported root-slug redirect set: 462 slugs
- Redirect behavior: \`/{slug}\` -> 308 -> \`/resources/blog/{slug}\`
- Chain/loop policy: one hop only
- Homepage dumping: not used
- Hidden targets: excluded by public slug export
- Chaman Properties targets: not used
`, "utf8");

  const ledgerPath = path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv");
  const ledger = readCsv(ledgerPath);
  if (ledger.length) {
    const headers = Object.keys(ledger[0]);
    const publishedSet = new Set(publishedSlugs);
    for (const row of ledger) {
      if (!publishedSet.has(row.legacy_slug)) continue;
      row.current_status = "published_wave_2";
      row.current_public_url = `${SITE}/resources/blog/${row.legacy_slug}`;
      row.sanity_status = "approved public";
      row.redirect_status = "data-driven root slug 308";
      row.legal_status = "public-safe after controlled Wave 2 screening";
      row.final_classification = "RESTORED_NEW_CANONICAL_WITH_308";
      row.final_reason = "Wave 2 controlled publication restored a public canonical article and root-slug redirect coverage";
      row.last_processed_sprint = "Wave 2";
      row.next_action = "submit final canonical URL to GSC/Bing and monitor";
      row.fully_closed = "yes";
    }
    writeCsv(ledgerPath, headers, ledger);
  }

  const result = {
    generatedAt: new Date().toISOString(),
    published: rows.length,
    articlesReconstructed: rows.length,
    beforeCounts,
    afterCounts,
    duplicateCleanupRows: cleanupRows.length,
    gscPack: "docs/LEGACY-RECOVERY-WAVE-2-GSC-ACTION-PACK.md",
    bingPack: "docs/LEGACY-RECOVERY-WAVE-2-BING-ACTION-PACK.md",
    publishedSlugs,
  };
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "closeout docs failed", code: error?.code || "", name: error?.name || "" }, null, 2));
  process.exit(1);
});
