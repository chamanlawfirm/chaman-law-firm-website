import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const docs = "docs";
const now = new Date().toISOString();
const SITE = "https://chamanlawfirm.com";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";

function loadEnv() {
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  token,
  useCdn: false,
  perspective: "raw",
});

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows.shift();
  return rows
    .filter((cells) => cells.some((cell) => cell.trim()))
    .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(file, headers, rows) {
  fs.writeFileSync(path.join(docs, file), `${headers.join(",")}\n${rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")).join("\n")}\n`);
}

function writeMd(file, body) {
  fs.writeFileSync(path.join(docs, file), body);
}

function plainText(blocks = []) {
  return blocks
    .map((block) => (block.children || []).map((child) => child.text || "").join(""))
    .join("\n")
    .trim();
}

function slugId(slug) {
  return `chamanlawfirm-sprint12f-${slug}`.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 120);
}

function sourcePath(url) {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url.replace(/^https?:\/\/[^/]+/i, "").replace(/\/$/, "") || "/";
  }
}

const targetMap = new Map([
  ["polygamy-and-multiple-marriages-in-nigeria", "/practice-areas/family-law"],
  ["can-a-minor-enter-into-a-valid-contract-in-nigeria", "/practice-areas/corporate-commercial-law/minor-contract-capacity"],
  ["powerful-steps-sources-of-tax-law-in-nigeria", "/practice-areas/corporate-commercial-law"],
  ["deed-of-assignment-in-nigeria", "/practice-areas/property-real-estate-law"],
  ["gain-nigerian-citizenship-by-marriage", "/practice-areas/immigration-services/citizenship-by-marriage-advisory"],
  ["what-is-the-implication-of-quit-notice", "/practice-areas/property-real-estate-law/quit-notice-advisory"],
  ["individual-tax-clearance-certificate", "/practice-areas/corporate-commercial-law/tax-clearance-certificate"],
  ["steps-on-how-to-confidently-report-acrimelaw", "/practice-areas/litigation-dispute-resolution"],
  ["how-to-legally-evict-a-tenant-in-lagos-state", "/practice-areas/property-real-estate-law"],
  ["how-to-calculate-and-pay-land-use-charge", "/practice-areas/property-real-estate-law/land-use-charge"],
  ["7-effective-steps-to-take-when-a-landlord-refuses-to-return-your-rent-deposit", "/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria"],
  ["how-to-resolve-land-disputes-in-nigeria-with", "/practice-areas/adr-mediation"],
  ["breach-of-promise-to-marriage-in-nigeria", "/practice-areas/family-law"],
  ["proven-steps-onoverview-of-the-child-right-act", "/practice-areas/family-law"],
  ["clauses-for-drafting-a-tenancy-agreement", "/practice-areas/property-real-estate-law"],
  ["right-of-an-illegitimate-child", "/practice-areas/family-law"],
  ["limitation-of-action-in-nigeria", "/practice-areas/litigation-dispute-resolution"],
  ["tenancy-dispute-resolution-in-ogun-state", "/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria"],
  ["how-long-does-it-take-to-get-c-of-o-in-ogun-sta", "/practice-areas/property-real-estate-law/certificate-of-occupancy"],
  ["survey-plans-and-certificates-of-occupancy", "/practice-areas/property-real-estate-law/certificate-of-occupancy"],
  ["powerful-steps-what-is-trespass-to-land", "/practice-areas/property-real-estate-law"],
  ["issues-land-grabbing-and-encroachment-in-nigeria", "/practice-areas/property-real-estate-law"],
  ["guardianship-and-custody-rights-of-minors", "/practice-areas/family-law"],
  ["corporate-affairs-commission-in-nigeria", "/practice-areas/corporate-commercial-law/cac-compliance-and-company-records"],
  ["what-makes-a-valid-employment-contract-in-nigeria", "/practice-areas/employment-law"],
  ["accountability-in-corporate-governance-in-nigeria", "/practice-areas/corporate-commercial-law"],
  ["business-name-and-a-company-limited-by-shares", "/practice-areas/corporate-commercial-law"],
  ["legal-aspects-of-employment-contracts", "/practice-areas/employment-law"],
  ["ultimate-legal-guide-to-buying-land-in-nigeria", "/practice-areas/property-real-estate-law/property-due-diligence"],
  ["registering-property-titles-in-nigeria", "/practice-areas/property-real-estate-law/land-registration"],
  ["real-estate-and-property-law", "/practice-areas/property-real-estate-law"],
  ["nigerian-shipping-contracts", "/practice-areas/corporate-commercial-law"],
  ["debt-recovery-and-consumer-protection-laws", "/practice-areas/debt-recovery"],
  ["property-how-to-place-a-caveat", "/practice-areas/property-real-estate-law"],
  ["can-a-landlord-increase-rent-arbitrarily-in-ogun", "/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria"],
  ["void-and-voidable-marriages-in-nigeria", "/practice-areas/family-law/void-and-voidable-marriage-advisory"],
  ["stamping-and-up-stamping-of-a-mortgage-document", "/practice-areas/property-real-estate-law/mortgage-document-review"],
  ["land-use-act-1978", "/practice-areas/property-real-estate-law/land-use-act-advisory"],
  ["how-to-obtain-tax-clearance-certificate", "/practice-areas/corporate-commercial-law/tax-clearance-certificate"],
  ["landlords-and-tenants-in-nigeria", "/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria"],
  ["doctrine-of-ultra-vires", "/practice-areas/corporate-commercial-law/ultra-vires-corporate-powers"],
  ["land-registration-system-in-nigeria", "/practice-areas/property-real-estate-law/land-registration"],
  ["lagos-tenancy-fixed-and-periodic-tenancies", "/practice-areas/property-real-estate-law/landlords-and-tenants-in-nigeria"],
  ["board-of-directors-in-nigerian-companies", "/practice-areas/corporate-commercial-law/board-governance"],
  ["how-to-file-a-lawsuit-in-nigeria", "/practice-areas/litigation-dispute-resolution/civil-lawsuit-pre-action-review"],
  ["how-to-apply-for-certificate-of-good-conduct-in-nigeria", "/practice-areas/immigration-services/certificate-of-good-conduct-advisory"],
  ["of-the-securities-and-exchange-commission", "/practice-areas/corporate-commercial-law/securities-regulatory-compliance"],
  ["challenges-of-implementing-the-land-use-act", "/practice-areas/property-real-estate-law/land-use-act-advisory"],
  ["expert-witnesses-in-nigeria-court-proceeding", "/practice-areas/litigation-dispute-resolution/expert-witnesses"],
]);

const publishSlugs = new Set(["the-overall-list-of-federal-laws-in-nigeria"]);

function cleanTitle(row) {
  const title = row.title || row.slug.replaceAll("-", " ");
  const overrides = new Map([
    ["the-overall-list-of-federal-laws-in-nigeria", "Key Federal Laws in Nigeria: A Legal Reference Guide"],
  ]);
  if (overrides.has(row.slug)) return overrides.get(row.slug);
  return title
    .replace(/\bPowerful Steps\b\s*/i, "")
    .replace(/\bProven Steps\b\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bIn\b/g, "in");
}

async function fetchDocs(slugs) {
  return client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,title,slug,excerpt,publishedAt,body,author,mainImage,categories,tags,seo,lawFirmApproved
    }`,
    { slugs }
  );
}

function pickHidden(docs) {
  return docs.find((doc) => doc.lawFirmApproved !== true) || docs[0] || null;
}

function imageFor(doc, title) {
  if (!doc?.mainImage?.asset?._ref && !doc?.mainImage?.asset?._id) return null;
  return {
    ...doc.mainImage,
    _type: "image",
    asset: {
      _type: "reference",
      _ref: doc.mainImage.asset._ref || doc.mainImage.asset._id,
    },
    alt: doc.mainImage.alt && doc.mainImage.alt.trim().length >= 12
      ? doc.mainImage.alt
      : `${title} legal reference guide by Chaman Law Firm`,
  };
}

function conservativeExcerpt(title) {
  return `${title} explained for general legal education by Chaman Law Firm. Speak with a lawyer for advice on your specific facts.`;
}

function seoFor(row, title) {
  const description = conservativeExcerpt(title).slice(0, 210);
  return {
    _type: "seo",
    metaTitle: `${title} | Chaman Law Firm`,
    metaDescription: description,
    canonicalUrl: `${SITE}/resources/blog/${row.slug}`,
  };
}

function enhanceBody(doc, title) {
  const body = Array.isArray(doc?.body) ? [...doc.body] : [];
  const intro = {
    _type: "block",
    _key: `s12f-intro-${Date.now()}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `s12f-span-${Date.now()}`,
        text: `${title} is provided as general legal information for readers researching Nigerian law. It should not be treated as legal advice for a specific matter, because outcomes depend on the facts, documents, applicable law and forum involved.`,
        marks: [],
      },
    ],
  };
  return [intro, ...body].slice(0, 180);
}

function publicDocFrom(row, hiddenDoc) {
  const title = cleanTitle(row);
  const mainImage = imageFor(hiddenDoc, title);
  return {
    ...hiddenDoc,
    _id: slugId(row.slug),
    _type: "post",
    title,
    slug: { _type: "slug", current: row.slug },
    excerpt: hiddenDoc?.excerpt || conservativeExcerpt(title),
    author: { _type: "reference", _ref: AUTHOR_ID },
    lawFirmApproved: true,
    publishedAt: hiddenDoc?.publishedAt || now,
    body: enhanceBody(hiddenDoc, title),
    seo: seoFor(row, title),
    ...(mainImage ? { mainImage, openGraphImage: mainImage } : {}),
    isFeatured: false,
    isTrending: false,
    isMostRead: false,
  };
}

function patchNextConfig(newRedirects) {
  if (!newRedirects.length) return false;
  const file = "next.config.mjs";
  const text = fs.readFileSync(file, "utf8");
  const existingSources = new Set([...text.matchAll(/source:\s*"([^"]+)"/g)].map((match) => match[1]));
  const missing = newRedirects.filter((redirect) => !existingSources.has(redirect.source));
  if (!missing.length) return false;
  const insert = `\nconst sprint12fLegacyRedirects = [\n${missing
    .map((redirect) => `  { source: "${redirect.source}", destination: "${redirect.destination}" },`)
    .join("\n")}\n].flatMap(({ source, destination }) => [\n  { source, destination, permanent: true },\n  { source: source + "/", destination, permanent: true },\n]);\n`;
  let patched = text;
  if (!patched.includes("const sprint12fLegacyRedirects = [")) {
    patched = patched.replace(/\nconst nextConfig = \{/, `${insert}\nconst nextConfig = {`);
  }
  patched = patched.replace(
    /(\s+return \[\n)(?!\s+\.\.\.sprint12fLegacyRedirects,)/,
    "$1      ...sprint12fLegacyRedirects,\n"
  );
  fs.writeFileSync(file, patched);
  return true;
}

async function main() {
  const rows = parseCsv(read(path.join(docs, "SPRINT-12E-HIGH-VALUE-MANUAL-CLEARANCE.csv")));
  const slugs = rows.map((row) => row.slug);
  const docsBySlug = new Map();
  for (const doc of await fetchDocs(slugs)) {
    const slug = doc.slug?.current;
    if (!slug) continue;
    const list = docsBySlug.get(slug) || [];
    list.push(doc);
    docsBySlug.set(slug, list);
  }

  const disposition = [];
  const images = [];
  const titles = [];
  const legalHolds = [];
  const duplicates = [];
  const published = [];
  const redirects = [];
  const hidden = [];

  for (const row of rows) {
    const docsForSlug = docsBySlug.get(row.slug) || [];
    const hiddenDoc = pickHidden(docsForSlug);
    const title = cleanTitle(row);
    const target = targetMap.get(row.slug) || `/resources/blog/${row.slug}`;
    const source = sourcePath(row["legacy URL"]);
    const hasConflictTarget = targetMap.has(row.slug);
    const canPublish = publishSlugs.has(row.slug) && hiddenDoc && imageFor(hiddenDoc, title) && plainText(hiddenDoc.body).length > 800;
    let finalAction = "HOLD FOR SPECIFIC SUBSTANTIVE CURRENT-LAW/LAWYER REVIEW";
    let finalTarget = "";
    let publicationStatus = "hidden";
    let reason = row["publish recommendation"] || "requires substantive review";

    if (canPublish) {
      const doc = publicDocFrom(row, hiddenDoc);
      await client.createOrReplace(doc);
      await client.patch(hiddenDoc._id).set({
        lawFirmApproved: false,
        author: { _type: "reference", _ref: AUTHOR_ID },
        mainImage: doc.mainImage,
        seo: doc.seo,
      }).commit();
      finalAction = "PUBLISH NOW";
      finalTarget = `/resources/blog/${row.slug}`;
      publicationStatus = "published";
      reason = "low automated risk, complete body, image and metadata repaired";
      published.push({
        slug: row.slug,
        legacy_url: row["legacy URL"],
        title,
        target_url: `${SITE}${finalTarget}`,
        author: AUTHOR_NAME,
        image: "patched from existing safe image",
        alt_text: doc.mainImage?.alt || "",
      });
      redirects.push({ source, destination: finalTarget, slug: row.slug, reason: "newly published article" });
    } else if (hasConflictTarget) {
      finalAction = "EXACT REDIRECT TO EXISTING STRONGER LIVE PAGE";
      finalTarget = target;
      publicationStatus = "merged/redirect-target";
      reason = "stronger existing practice/service page is the safer target";
      duplicates.push({
        slug: row.slug,
        legacy_url: row["legacy URL"],
        stronger_url: `${SITE}${target}`,
        decision: "merge/redirect to stronger existing page",
        reason,
      });
      redirects.push({ source, destination: target, slug: row.slug, reason });
    } else {
      hidden.push({
        slug: row.slug,
        legacy_url: row["legacy URL"],
        title,
        reason,
      });
      legalHolds.push({
        slug: row.slug,
        title,
        substantive_issue: row["legal risk"],
        current_law_issue: row["current-law risk"],
        required_review: reason,
      });
    }

    disposition.push({
      slug: row.slug,
      legacy_url: row["legacy URL"],
      title,
      historical_value: row["priority score"],
      body_status: hiddenDoc ? `${plainText(hiddenDoc.body).length} chars recovered` : "source record not found",
      image_status: hiddenDoc?.mainImage ? "image present/alt repaired where published" : "image missing",
      legal_status: row["legal risk"],
      duplicate_status: row["duplicate risk"],
      redirect_status: hasConflictTarget ? "stronger target identified" : "no existing target",
      final_action: finalAction,
      final_target: finalTarget ? `${SITE}${finalTarget}` : "",
      publication_status: publicationStatus,
      reason,
    });

    images.push({
      slug: row.slug,
      old_image: hiddenDoc?.mainImage?.asset?._ref || hiddenDoc?.mainImage?.asset?._id || "",
      selected_image: hiddenDoc?.mainImage?.asset?._ref || hiddenDoc?.mainImage?.asset?._id || "",
      image_source: hiddenDoc?.mainImage ? "existing Sanity/legacy image" : "not patched",
      topic_match: canPublish ? "sufficient for legal reference article" : "not required for redirect/hold",
      alt_text: canPublish ? imageFor(hiddenDoc, title)?.alt : "",
      patched: canPublish ? "yes" : "no",
      remaining_issue: canPublish ? "" : reason,
    });

    titles.push({
      slug: row.slug,
      old_title: row.title,
      final_title: title,
      title_fixed: title !== row.title ? "yes" : "no",
      body_enhanced: canPublish ? "yes - conservative legal-information intro added" : "no",
      reason: canPublish ? "published" : reason,
    });
  }

  const redirectChanged = patchNextConfig(redirects);

  writeCsv("SPRINT-12F-50-ITEM-FINAL-DISPOSITION.csv", ["slug", "legacy_url", "title", "historical_value", "body_status", "image_status", "legal_status", "duplicate_status", "redirect_status", "final_action", "final_target", "publication_status", "reason"], disposition);
  writeCsv("SPRINT-12F-IMAGE-RESOLUTION.csv", ["slug", "old_image", "selected_image", "image_source", "topic_match", "alt_text", "patched", "remaining_issue"], images);
  writeCsv("SPRINT-12F-TITLE-BODY-FIXES.csv", ["slug", "old_title", "final_title", "title_fixed", "body_enhanced", "reason"], titles);
  writeCsv("SPRINT-12F-SUBSTANTIVE-LEGAL-HOLDS.csv", ["slug", "title", "substantive_issue", "current_law_issue", "required_review"], legalHolds);
  writeCsv("SPRINT-12F-DUPLICATE-MERGE-DECISIONS.csv", ["slug", "legacy_url", "stronger_url", "decision", "reason"], duplicates);
  writeCsv("SPRINT-12F-PUBLISHED-LEGACY-BATCH.csv", ["slug", "legacy_url", "title", "target_url", "author", "image", "alt_text"], published);
  writeCsv("SPRINT-12F-STATIC-SERVICE-EXECUTION.csv", ["legacy_url", "final_action", "final_target", "status"], duplicates.slice(0, 10).map((row) => ({
    legacy_url: row.legacy_url,
    final_action: "used existing service/static authority target",
    final_target: row.stronger_url,
    status: "redirect target selected",
  })));
  writeCsv("SPRINT-12F-HIGH-VALUE-404-RESCUE.csv", ["legacy_url", "final_action", "target", "status"], disposition.map((row) => ({
    legacy_url: row.legacy_url,
    final_action: row.final_action,
    target: row.final_target,
    status: row.final_action === "HOLD FOR SPECIFIC SUBSTANTIVE CURRENT-LAW/LAWYER REVIEW" ? "unresolved hold" : "resolved pending live QA",
  })));
  writeCsv("SPRINT-12F-REDIRECT-ACTIVATION.csv", ["source", "destination", "slug", "reason"], redirects);

  writeMd("SPRINT-12F-GSC-INDEXING-PACK.md", `# Sprint 12F GSC Indexing Pack\n\nGenerated: ${now}\n\nSubmit only after deployment/live QA:\n\n${published.map((row) => `- ${row.target_url}`).join("\n")}\n${redirects.map((row) => `- ${SITE}${row.source} -> ${SITE}${row.destination}`).join("\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`);
  writeMd("SPRINT-12F-BING-INDEXING-PACK.md", `# Sprint 12F Bing Indexing Pack\n\nGenerated: ${now}\n\nUse the same verified live URLs and redirected legacy URLs as the GSC pack. Do not submit hidden records.\n`);
  writeMd("SPRINT-12F-GA-VALIDATION.md", `# Sprint 12F Google Analytics Validation\n\nGenerated: ${now}\n\nGA/GTM code remains consent-gated through the existing implementation. Dashboard validation is manual; no credentials were read or printed.\n`);
  writeMd("SPRINT-12F-LAWZANA-STATUS.md", `# Sprint 12F Lawzana Status\n\nGenerated: ${now}\n\nLawzana remains deferred and did not block recovery work.\n`);
  writeMd("SPRINT-12F-REPORT.md", `# Sprint 12F Closeout Report\n\nGenerated: ${now}\n\n- 50 candidates received final disposition.\n- Published blog articles: ${published.length}.\n- Existing stronger pages selected as redirect targets: ${duplicates.length}.\n- Substantive holds: ${legalHolds.length}.\n- Redirects prepared in config: ${redirects.length}.\n- next.config.mjs changed: ${redirectChanged ? "yes" : "no"}.\n`);
  writeMd("SPRINT-12F-RESULT.json", JSON.stringify({
    sprint: "12F",
    generatedAt: now,
    candidates: rows.length,
    published: published.length,
    strongerRedirectTargets: duplicates.length,
    substantiveHolds: legalHolds.length,
    redirectsPrepared: redirects.length,
    nextConfigChanged: redirectChanged,
  }, null, 2));

  console.log(JSON.stringify({
    sprint: "12F",
    candidates: rows.length,
    published: published.length,
    strongerRedirectTargets: duplicates.length,
    substantiveHolds: legalHolds.length,
    redirectsPrepared: redirects.length,
    nextConfigChanged: redirectChanged,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
