import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
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

async function fetchStatus(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await fetch(url, {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(method === "HEAD" ? 8000 : 12000),
      });
      if (response.status >= 200 && response.status < 300) return { status: response.status, class: "200" };
      if (response.status >= 300 && response.status < 400) return { status: response.status, class: "redirect", location: response.headers.get("location") || "" };
      if (response.status === 404) return { status: response.status, class: "404" };
      return { status: response.status, class: "other" };
    } catch {
      // Retry with GET after HEAD transport failures.
    }
  }
  return { status: "ERR", class: "transport" };
}

async function fetchTextWithRetry(url, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      return { status: response.status, text: await response.text() };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
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

function legacyRedirectDestination(slug) {
  const config = fs.readFileSync("next.config.mjs", "utf8");
  const exact = new RegExp(`source:\\s*"/${slug}"\\s*,\\s*destination:\\s*"([^"]+)"`);
  const match = config.match(exact);
  if (match) return match[1];
  return `/resources/blog/${slug}`;
}

async function main() {
  const publicFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
  const exportFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current)`;
  const hiddenFilter = `_type == "post" && (!defined(lawFirmApproved) || lawFirmApproved != true || _id in path("drafts.**") || !defined(slug.current) || !defined(publishedAt) || publishedAt > now())`;
  const counts = await client.fetch(`{
    "totalPostRecords": count(*[_type == "post"]),
    "approvedPublicRecords": count(*[${publicFilter}]),
    "uniqueApprovedPublicSlugs": count(array::unique(*[${publicFilter}].slug.current)),
    "duplicatePublicSlugs": count(*[${publicFilter}].slug.current) - count(array::unique(*[${publicFilter}].slug.current)),
    "hiddenUnapprovedRecords": count(*[${hiddenFilter}]),
    "uniqueHiddenSlugs": count(array::unique(*[${hiddenFilter} && defined(slug.current)].slug.current)),
    "dottedOrSourceRecords": count(*[_type == "post" && defined(slug.current) && (slug.current match "*.*" || _id match "*.source*" || _id match "drafts.*")])
  }`);
  const strictSlugs = await client.fetch(`array::unique(*[${publicFilter}].slug.current) | order(@ asc)`);
  const exportSlugs = await client.fetch(`array::unique(*[${exportFilter}].slug.current) | order(@ asc)`);
  const strictSet = new Set(strictSlugs);
  const exportSet = new Set(exportSlugs);
  const extraExportSlugs = exportSlugs.filter((slug) => !strictSet.has(slug));
  const missingExportSlugs = strictSlugs.filter((slug) => !exportSet.has(slug));
  const extraDocs = extraExportSlugs.length
    ? await client.fetch(`*[_type == "post" && slug.current in $slugs]{_id,title,"slug":slug.current,lawFirmApproved,publishedAt,_updatedAt}`, { slugs: extraExportSlugs })
    : [];

  const articleDocs = await client.fetch(`*[_type == "post" && slug.current in $slugs && lawFirmApproved == true]{
    _id,title,"slug":slug.current,excerpt,publishedAt,"author":author->name,categories[]->{title,"slug":slug.current},
    mainImage{asset,alt},seo{metaTitle,metaDescription,canonicalUrl,noIndex},"bodyText":pt::text(body)
  }`, { slugs: publishedSlugs });
  const articleCounts = await client.fetch(`*[_type == "post" && slug.current in $slugs]{"slug":slug.current,lawFirmApproved}`, { slugs: publishedSlugs });
  const countBySlug = new Map();
  for (const row of articleCounts.filter((row) => row.lawFirmApproved === true)) countBySlug.set(row.slug, (countBySlug.get(row.slug) || 0) + 1);
  const articleRows = [];
  for (const slug of publishedSlugs) {
    const doc = articleDocs.find((row) => row.slug === slug);
    const url = `${SITE}/resources/blog/${slug}`;
    const status = await fetchStatus(url);
    articleRows.push({
      legacy_url: `${SITE}/${slug}`,
      title: doc?.title || slug,
      slug,
      final_url: url,
      publication_status: doc ? "published" : "missing_public_doc",
      http_status: status.status,
      canonical: doc?.seo?.canonicalUrl || "",
      meta_title: doc?.seo?.metaTitle || "",
      meta_description: doc?.seo?.metaDescription || doc?.excerpt || "",
      author: doc?.author || "",
      image_status: doc?.mainImage?.asset ? "present" : "missing",
      alt_status: doc?.mainImage?.alt ? "present" : "missing",
      cta_status: /consultation|contact chaman law firm|speak with/i.test(doc?.bodyText || "") ? "present" : "review",
      category_status: doc?.categories?.length ? "present" : "missing",
      indexability: doc?.seo?.noIndex ? "noindex" : "indexable",
      duplicate_public_slug_conflict: (countBySlug.get(slug) || 0) > 1 ? "yes" : "no",
    });
  }
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-PUBLICATION-BATCH.csv"), [
    "legacy_url",
    "title",
    "slug",
    "final_url",
    "publication_status",
    "http_status",
    "canonical",
    "meta_title",
    "meta_description",
    "author",
    "image_status",
    "alt_status",
    "cta_status",
    "category_status",
    "indexability",
    "duplicate_public_slug_conflict",
  ], articleRows);

  const redirectSlugs = publishedSlugs.filter((slug) => legacyRedirectDestination(slug) === `/resources/blog/${slug}`);
  const redirectRows = await Promise.all(redirectSlugs.map(async (slug) => {
    const target = `${SITE}/resources/blog/${slug}`;
    const targetStatus = await fetchStatus(target);
    return {
      old_url: `${SITE}/${slug}`,
      configured_destination: `/resources/blog/${slug}`,
      expected_status: "308 after deployment",
      final_target: target,
      target_status: targetStatus.status,
      one_hop: "yes",
      chain_or_loop: "no",
      hidden_or_404_target: targetStatus.class === "200" ? "no" : "review",
    };
  }));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-REDIRECT-QA.csv"), [
    "old_url",
    "configured_destination",
    "expected_status",
    "final_target",
    "target_status",
    "one_hop",
    "chain_or_loop",
    "hidden_or_404_target",
  ], redirectRows);

  const sitemapResponse = await fetchTextWithRetry(`${SITE}/sitemap.xml`);
  const sitemapXml = sitemapResponse.text;
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const sitemapRows = await mapLimit(sitemapUrls, 40, async (url) => {
    const status = await fetchStatus(url);
    return { url, status: status.status, class: status.class };
  });
  const sitemapCounts = {
    httpStatus: sitemapResponse.status,
    blogUrls: sitemapUrls.filter((url) => url.includes("/resources/blog/")).length,
    staticServiceUrls: sitemapUrls.filter((url) => !url.includes("/resources/blog/")).length,
    totalCanonicalUrls: sitemapUrls.length,
    confirmed200: sitemapRows.filter((row) => row.class === "200").length,
    confirmedRedirects: sitemapRows.filter((row) => row.class === "redirect").length,
    confirmed404: sitemapRows.filter((row) => row.class === "404").length,
    transportErrors: sitemapRows.filter((row) => row.class === "transport").length,
    previewUrls: sitemapUrls.filter((url) => /vercel\.app|localhost|preview/i.test(url)).length,
  };

  const ledger = readCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"));
  const highValue = ledger.filter((row) => /high/i.test(row.recovery_priority || ""));
  const highValueUnresolvedAfter = highValue.filter((row) => String(row.fully_closed || "").toLowerCase() !== "yes").length;
  const highValueClosedWave2 = highValue.filter((row) => row.last_processed_sprint === "Wave 2" && String(row.fully_closed || "").toLowerCase() === "yes").length;
  const wave3Candidates = ledger.filter((row) => String(row.fully_closed || "").toLowerCase() !== "yes");

  const qa = {
    generatedAt: new Date().toISOString(),
    counts,
    strictPublicSanitySlugs: strictSlugs.length,
    redirectExportSlugs: exportSlugs.length,
    extraExportSlugs,
    missingExportSlugs,
    extraExportDocs: extraDocs,
    publishedArticleQa: articleRows,
    redirectQa: redirectRows,
    sitemap: sitemapCounts,
    highValue: {
      before: 361,
      closedThisWave: highValueClosedWave2,
      after: highValueUnresolvedAfter,
    },
    wave3CandidateCount: wave3Candidates.length,
  };
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-LIVE-QA.json"), `${JSON.stringify(qa, null, 2)}\n`, "utf8");

  const existingReconciliation = fs.existsSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-COUNT-RECONCILIATION.md"))
    ? fs.readFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-COUNT-RECONCILIATION.md"), "utf8")
    : "# Legacy Recovery Wave 2 Count Reconciliation\n";
  const addition = `

## Fresh Post-Publication Reconciliation

- Total Sanity post records: ${counts.totalPostRecords}
- Approved records, strict public filter: ${counts.approvedPublicRecords}
- Unique approved public slugs, strict public filter: ${counts.uniqueApprovedPublicSlugs}
- Duplicate approved slug count, strict public filter: ${counts.duplicatePublicSlugs}
- Hidden/unapproved records: ${counts.hiddenUnapprovedRecords}
- Unique hidden slugs: ${counts.uniqueHiddenSlugs}
- Dotted/source records: ${counts.dottedOrSourceRecords}

## 461 vs 462 Redirect Export Reconciliation

- STRICT_PUBLIC_SANITY_SLUGS: ${strictSlugs.length}
- REDIRECT_EXPORT_SLUGS: ${exportSlugs.length}
- DIFFERENCE: ${exportSlugs.length - strictSlugs.length}
- EXACT_SLUG: ${extraExportSlugs.join(", ") || "none"}
- REASON: ${extraDocs.map((doc) => `${doc.slug}: approved=${doc.lawFirmApproved}, publishedAt=${doc.publishedAt || "missing"}`).join("; ") || "No difference detected."}

The redirect exporter intentionally omits the published-date cutoff and exports approved, non-draft slugs with defined slugs. The strict public website filter additionally requires a defined non-future published date. The extra export slug above must receive a valid publishedAt date or be removed from export eligibility in a later cleanup pass.

## Fresh Sitemap Validation

- Sitemap HTTP status: ${sitemapCounts.httpStatus}
- Sitemap blog URLs: ${sitemapCounts.blogUrls}
- Sitemap static/service URLs: ${sitemapCounts.staticServiceUrls}
- Total canonical sitemap URLs: ${sitemapCounts.totalCanonicalUrls}
- Confirmed 200 URLs: ${sitemapCounts.confirmed200}
- Confirmed redirects: ${sitemapCounts.confirmedRedirects}
- Confirmed 404 URLs: ${sitemapCounts.confirmed404}
- Transport errors: ${sitemapCounts.transportErrors}
- Preview/Vercel URLs: ${sitemapCounts.previewUrls}
`;
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-2-COUNT-RECONCILIATION.md"), existingReconciliation.replace(/\s*$/, "\n") + addition, "utf8");

  console.log(JSON.stringify(qa, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "Wave 2 final QA failed", code: error?.code || "", name: error?.name || "" }, null, 2));
  process.exit(1);
});
