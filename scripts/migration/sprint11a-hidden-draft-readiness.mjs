import fs from "node:fs";

const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";

const targetSlugs = [
  "can-a-landlord-increase-rent-arbitrarily-in-ogun",
  "certificate-of-occupancy-in-rivers-state",
  "challenges-of-implementing-the-land-use-act",
  "how-do-i-legally-evict-a-tenant-in-ogun-state",
  "how-to-calculate-stamp-duty-chaman-law-firm",
  "land-grabbing-the-legal-consequences-of",
  "property-how-to-place-a-caveat",
  "the-role-of-family-court-in-relation-to-child-protect-in-nigeria",
  "void-and-voidable-marriages-in-nigeria",
  "rights-of-a-property-owner-in-nigeria",
  "letters-of-administration-in-nigeria",
  "debt-recovery-lawyer-nigeria"
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(headers, rows) {
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n") + "\n";
}

async function querySanity(query, params = {}) {
  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN;
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const url = new URL(`/v${API_VERSION}/data/query/${DATASET}`, `https://${PROJECT_ID}.api.sanity.io`);
  url.searchParams.set("perspective", "raw");
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sanity query failed: ${response.status} ${text.slice(0, 300)}`);
  }
  const payload = await response.json();
  return payload.result;
}

function bestDraft(drafts) {
  return [...drafts].sort((a, b) => {
    const score = (doc) =>
      (doc.hasBody ? 10 : 0) +
      Math.min(doc.bodyBlocks || 0, 100) +
      (doc.hasImage ? 20 : 0) +
      (doc.hasAlt ? 10 : 0) +
      (doc.hasSeoTitle ? 5 : 0) +
      (doc.hasMetaDescription ? 5 : 0) +
      (doc.hasCanonical ? 5 : 0);
    return score(b) - score(a);
  })[0] || null;
}

function keywordSet(text) {
  const stop = new Set([
    "and",
    "the",
    "for",
    "with",
    "from",
    "that",
    "this",
    "what",
    "how",
    "legal",
    "guide",
    "chaman",
    "law",
    "firm",
    "nigeria",
    "state"
  ]);
  return new Set(
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((word) => word.length > 3 && !stop.has(word))
  );
}

function imageAltRelevant(doc, slug, title) {
  if (!doc?.hasImage || !doc?.hasAlt) return false;
  const expected = new Set([...keywordSet(slug), ...keywordSet(title)]);
  const actual = keywordSet(doc.imageAlt);
  let overlap = 0;
  for (const word of expected) {
    if (actual.has(word)) overlap += 1;
  }
  return overlap >= 2;
}

function issueFor(slug) {
  if (slug.includes("landlord") || slug.includes("evict")) return "Tenancy/current-law and self-help review";
  if (slug.includes("certificate-of-occupancy")) return "C of O/current authority and duplicate review";
  if (slug.includes("land-use-act")) return "Land Use Act/current-law and cannibalization review";
  if (slug.includes("stamp-duty")) return "Stamp duty/current-rate review";
  if (slug.includes("land-grabbing")) return "Land-grabbing/current-law and overstatement review";
  if (slug.includes("caveat")) return "Property title/procedure review";
  if (slug.includes("family-court")) return "Family/child-protection sensitivity review";
  if (slug.includes("void-and-voidable")) return "Family/marriage validity sensitivity review";
  if (slug.includes("rights-of-a-property-owner")) return "Property-rights duplicate review";
  if (slug.includes("letters-of-administration")) return "Probate/current-procedure review";
  if (slug.includes("debt-recovery")) return "Service-page cannibalization and claims review";
  return "Legal/editorial review";
}

function recommendedAction(slug, draft, publicDoc) {
  if (!draft) return "recover source before approval";
  if (publicDoc) return "keep hidden; public version already exists";
  if (!imageAltRelevant(draft, slug, draft.title)) return "keep hidden; image or alt relevance incomplete";
  return "keep hidden until lawyer-current-law review is manually confirmed";
}

function approvalReadiness(slug, draft, publicDoc) {
  if (!draft) return "not ready";
  if (publicDoc) return "blocked by duplicate/live public target";
  if (!imageAltRelevant(draft, slug, draft.title)) return "blocked by image/alt relevance";
  return "blocked by unresolved lawyer review";
}

async function main() {
  loadEnvFile(".env.local");

  const docs = await querySanity(
    `*[_type == "post" && slug.current in $slugs] | order(slug.current asc, _id asc) {
      _id,
      title,
      "slug": slug.current,
      lawFirmApproved,
      publishedAt,
      "authorName": author->name,
      "categories": categories[]->{title, "slug": slug.current},
      "hasBody": defined(body[0]),
      "bodyBlocks": count(body[]),
      "hasImage": defined(mainImage.asset._ref),
      "hasAlt": defined(mainImage.alt) && length(mainImage.alt) > 8,
      "imageAlt": mainImage.alt,
      "seoTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "canonical": seo.canonicalUrl,
      "bodyBlockCount": count(body[_type == "block"]),
      "faqCount": count(faqs[])
    }`,
    { slugs: targetSlugs }
  );

  const bySlug = new Map(targetSlugs.map((slug) => [slug, { hidden: [], publicDocs: [] }]));
  for (const doc of docs) {
    const bucket = bySlug.get(doc.slug);
    if (!bucket) continue;
    if (doc._id.startsWith("drafts.")) bucket.hidden.push(doc);
    else if (doc.lawFirmApproved === true) bucket.publicDocs.push(doc);
  }

  const resolutionRows = [];
  const imageSeoRows = [];

  for (const slug of targetSlugs) {
    const bucket = bySlug.get(slug);
    const draft = bestDraft(bucket.hidden);
    const publicDoc = bucket.publicDocs[0] || null;
    const title = draft?.title || publicDoc?.title || slug;
    const oldUrl = `https://chamanlawfirm.com/${slug}/`;
    const categories = (draft?.categories || publicDoc?.categories || []).map((category) => category?.title).filter(Boolean).join("; ");
    const canonical = draft?.canonical || publicDoc?.canonical || "";
    const exactCanonical = canonical === `https://chamanlawfirm.com/resources/blog/${slug}`;

    resolutionRows.push({
      title,
      slug,
      "old URL": oldUrl,
      "issue category": issueFor(slug),
      "legal sensitivity": issueFor(slug),
      "duplicate/cannibalization risk": publicDoc ? "high - public approved version already exists" : (slug.includes("certificate-of-occupancy") || slug.includes("land-use-act") || slug.includes("rights-of-a-property-owner") ? "high" : "medium"),
      "current-law verification needed": "yes",
      "title cleanup needed": title === title.toUpperCase() || /\bA\b|\bOf\b|\bIn\b|\bTo\b/.test(title) ? "yes" : "review",
      "image/alt issue": draft ? (!imageAltRelevant(draft, slug, title) ? "yes" : "no") : "unknown",
      "category/practice issue": categories ? "repaired or already aligned" : "unknown",
      "recommended action": recommendedAction(slug, draft, publicDoc),
      "approval readiness": approvalReadiness(slug, draft, publicDoc),
      notes: publicDoc
        ? `Approved public document exists: ${publicDoc._id}. Do not approve duplicate hidden drafts.`
        : draft
          ? `Best hidden draft: ${draft._id}; body blocks: ${draft.bodyBlocks}; categories: ${categories || "none"}.`
          : "No matching hidden or public Sanity post found in this Sprint 11A query."
    });

    imageSeoRows.push({
      title,
      slug,
      "document checked": draft?._id || publicDoc?._id || "not found",
      "public already approved": publicDoc ? "yes" : "no",
      "body exists": draft?.hasBody || publicDoc?.hasBody ? "yes" : "no",
      "body blocks": draft?.bodyBlocks ?? publicDoc?.bodyBlocks ?? "",
      "image exists": draft?.hasImage || publicDoc?.hasImage ? "yes" : "no",
      "alt text exists": draft?.hasAlt || publicDoc?.hasAlt ? "yes" : "no",
      "alt text relevance": imageAltRelevant(draft || publicDoc, slug, title) ? "likely relevant" : "needs review",
      "alt text": draft?.imageAlt || publicDoc?.imageAlt || "",
      "SEO title exists": draft?.seoTitle || publicDoc?.seoTitle ? "yes" : "no",
      "meta description exists": draft?.metaDescription || publicDoc?.metaDescription ? "yes" : "no",
      "canonical": canonical,
      "canonical exact": exactCanonical ? "yes" : "no",
      "category/practice relationship": categories,
      "internal links status": (draft?.bodyBlockCount || publicDoc?.bodyBlockCount || 0) > 0 ? "manual check required" : "needs manual check",
      "CTA status": "template CTA expected; verify after approval",
      author: draft?.authorName || publicDoc?.authorName || "",
      "approval gate result": approvalReadiness(slug, draft, publicDoc),
      notes: recommendedAction(slug, draft, publicDoc)
    });
  }

  fs.writeFileSync(
    "docs/SPRINT-11A-LAWYER-REVIEW-RESOLUTION.csv",
    toCsv([
      "title",
      "slug",
      "old URL",
      "issue category",
      "legal sensitivity",
      "duplicate/cannibalization risk",
      "current-law verification needed",
      "title cleanup needed",
      "image/alt issue",
      "category/practice issue",
      "recommended action",
      "approval readiness",
      "notes"
    ], resolutionRows)
  );

  fs.writeFileSync(
    "docs/SPRINT-11A-IMAGE-SEO-COMPLETION.csv",
    toCsv([
      "title",
      "slug",
      "document checked",
      "public already approved",
      "body exists",
      "body blocks",
      "image exists",
      "alt text exists",
      "alt text relevance",
      "alt text",
      "SEO title exists",
      "meta description exists",
      "canonical",
      "canonical exact",
      "category/practice relationship",
      "internal links status",
      "CTA status",
      "author",
      "approval gate result",
      "notes"
    ], imageSeoRows)
  );

  console.log(JSON.stringify({
    targetSlugs: targetSlugs.length,
    sanityRecordsFound: docs.length,
    publicApprovedTargets: [...bySlug.values()].reduce((count, bucket) => count + bucket.publicDocs.length, 0),
    hiddenDraftsFound: [...bySlug.values()].reduce((count, bucket) => count + bucket.hidden.length, 0),
    outputFiles: [
      "docs/SPRINT-11A-LAWYER-REVIEW-RESOLUTION.csv",
      "docs/SPRINT-11A-IMAGE-SEO-COMPLETION.csv"
    ],
    approvalsRecommended: 0,
    reason: "Sprint 10Z lawyer/current-law review notes remain unresolved; approval gates require confirmed resolution."
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
