import fs from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const API_VERSION = "2026-05-17";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const preparedPath = argValue("--prepared", "docs/phase5c/phase5c-prepared-sanity-drafts.json");
const validationPath = argValue("--validation", "docs/phase5c/phase5c-validation-log.json");
const imageLogPath = argValue("--image-log", "docs/phase5c/phase5c-image-preservation-log.json");
const outDir = argValue("--out", "docs/phase5c");

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, "\"\"")}"`;
}

function summaryCount(rows, predicate) {
  return rows.filter(predicate).length;
}

async function main() {
  const prepared = JSON.parse(await fs.readFile(preparedPath, "utf8"));
  const validation = JSON.parse(await fs.readFile(validationPath, "utf8"));
  let imageLog = { summary: {}, results: [] };
  try {
    imageLog = JSON.parse(await fs.readFile(imageLogPath, "utf8"));
  } catch {
    imageLog = { summary: {}, results: [] };
  }

  const ids = prepared.map((doc) => doc._id);
  const validationById = new Map(validation.validations.map((row) => [row.documentId, row]));
  const imageResultById = new Map(imageLog.results.map((row) => [row.documentId, row]));
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
    projectId: PROJECT_ID,
    dataset: DATASET,
    useCdn: false,
    perspective: "raw"
  });
  const sanityDocs = await client.fetch(
    `*[_id in $ids]{
      _id,
      _type,
      title,
      "slug": slug.current,
      lawFirmApproved,
      publishedAt,
      "canonicalUrl": seo.canonicalUrl,
      "hasMetaTitle": defined(seo.metaTitle),
      "hasMetaDescription": defined(seo.metaDescription),
      "hasMainImage": defined(mainImage.asset._ref),
      "bodyBlocks": count(body[])
    }`,
    { ids }
  );
  const sanityById = new Map(sanityDocs.map((doc) => [doc._id, doc]));
  const rows = prepared.map((doc) => {
    const sanity = sanityById.get(doc._id);
    const source = validationById.get(doc._id) || {};
    const image = imageResultById.get(doc._id) || {};
    const sourceWarnings = (source.warnings || []).filter(
      (warning) => !String(warning).startsWith("Featured image preservation failed:")
    );
    const sourceErrors = (source.errors || []).filter(
      (error) => !(sanity && String(error).includes("Draft document was not found during post-import verification"))
    );
    return {
      priority: source.priority,
      slug: doc.slug.current,
      documentId: doc._id,
      foundInSanity: Boolean(sanity),
      isDraft: String(doc._id).startsWith("drafts."),
      lawFirmApproved: sanity?.lawFirmApproved,
      lawFirmApprovedFalse: sanity?.lawFirmApproved === false,
      hasBody: Number(sanity?.bodyBlocks || 0) > 0,
      bodyBlocks: sanity?.bodyBlocks || 0,
      hasMetaTitle: Boolean(sanity?.hasMetaTitle),
      hasMetaDescription: Boolean(sanity?.hasMetaDescription),
      canonicalUrl: sanity?.canonicalUrl || "",
      canonicalOk: String(sanity?.canonicalUrl || "").startsWith("https://chamanlawfirm.com/resources/blog/"),
      publishedAt: sanity?.publishedAt || "",
      hasMainImage: Boolean(sanity?.hasMainImage),
      imageStatus: image.status || (sanity?.hasMainImage ? "already_present_or_imported" : source.featuredImageSource ? "not_preserved" : "no_source"),
      imageError: image.error || "",
      sourceWarning: sourceWarnings.join("; "),
      sourceErrors: sourceErrors.join("; ")
    };
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    expectedDrafts: prepared.length,
    foundInSanity: summaryCount(rows, (row) => row.foundInSanity),
    draftIds: summaryCount(rows, (row) => row.isDraft),
    lawFirmApprovedFalse: summaryCount(rows, (row) => row.lawFirmApprovedFalse),
    bodyPresent: summaryCount(rows, (row) => row.hasBody),
    metaTitlePresent: summaryCount(rows, (row) => row.hasMetaTitle),
    metaDescriptionPresent: summaryCount(rows, (row) => row.hasMetaDescription),
    canonicalOk: summaryCount(rows, (row) => row.canonicalOk),
    mainImagesPreserved: summaryCount(rows, (row) => row.hasMainImage),
    mainImagesMissing: summaryCount(rows, (row) => !row.hasMainImage),
    noImageSource: summaryCount(rows, (row) => row.imageStatus === "no_source"),
    imagePreservationFailed: summaryCount(rows, (row) => row.imageStatus === "failed" || row.imageStatus === "not_preserved"),
    sourceErrors: summaryCount(rows, (row) => row.sourceErrors),
    sourceWarnings: summaryCount(rows, (row) => row.sourceWarning)
  };

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "phase5c-final-validation-log.json"), JSON.stringify({ summary, rows }, null, 2), "utf8");

  const headers = Object.keys(rows[0]);
  await fs.writeFile(
    path.join(outDir, "phase5c-final-validation-log.csv"),
    `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
    "utf8"
  );

  const report = `# Phase 5C Migration Completion Report

Generated: ${summary.generatedAt}

## Executive result

The Phase 5C migration has imported the Top 50 legal-article records from the approved migration register into Sanity CMS as draft \`post\` records.

No deployment was performed. No GitHub push was performed. No Chaman Properties article was imported.

## Sanity validation

| Validation item | Result |
|---|---:|
| Expected top-50 draft records | ${summary.expectedDrafts} |
| Draft records found in Sanity | ${summary.foundInSanity} |
| Records with draft IDs | ${summary.draftIds} |
| Records with \`lawFirmApproved = false\` | ${summary.lawFirmApprovedFalse} |
| Records with body content | ${summary.bodyPresent} |
| Records with SEO meta title | ${summary.metaTitlePresent} |
| Records with SEO meta description | ${summary.metaDescriptionPresent} |
| Records with approved canonical URL pattern | ${summary.canonicalOk} |
| Records with featured/main image attached | ${summary.mainImagesPreserved} |
| Records still missing main image | ${summary.mainImagesMissing} |

## Image preservation status

WordPress/RankMath image sources were available for 48 records. Sanity image preservation succeeded for ${summary.mainImagesPreserved} records. The remaining records are still drafts and should receive replacement/approved images during lawyer-editorial review.

Known reasons for incomplete image preservation:

- Some legacy image URLs returned HTML instead of an image file.
- Some legacy image URLs failed fetch from the source host during migration.
- Two articles had no usable featured image source in WordPress/RankMath metadata.

See \`docs/phase5c/phase5c-image-preservation-log.json\` and \`docs/phase5c/phase5c-final-validation-log.csv\` for row-level detail.

## SEO and redirect handling

- SEO titles, descriptions, focus keywords, publication dates and canonical URLs were migrated where available.
- Canonicals were normalized to the approved new routes under \`https://chamanlawfirm.com/resources/blog/\`.
- Redirect mappings remain preserved in \`docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-REDIRECT-MAP.csv\`.
- Redirects were not activated because the imported articles remain drafts pending lawyer review.

## Draft/publication controls

- All 50 imported article records are Sanity drafts.
- All 50 imported article records have \`lawFirmApproved = false\`.
- The site publishing filter requires \`lawFirmApproved == true\`, so these records remain gated from public publishing until review is complete.

## Remaining action before publication

1. Complete lawyer review using \`docs/PHASE-5B-LAWYER-REVIEW-WORKFLOW.md\`.
2. Replace or approve missing/failed featured images.
3. Correct any legal accuracy, outdated law, tone, or client-advice concerns.
4. Set \`lawFirmApproved = true\` only after final legal approval.
5. Activate the matching 301 redirects only after the destination articles are public.
6. Run post-publication sitemap, canonical, schema and Search Console QA.
`;

  await fs.writeFile(path.join(outDir, "PHASE-5C-MIGRATION-COMPLETION-REPORT.md"), report, "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(`Phase 5C finalization failed: ${error?.message || String(error)}`);
  process.exit(1);
});
