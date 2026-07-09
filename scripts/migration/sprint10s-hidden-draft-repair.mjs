import fs from "node:fs";
import fsp from "node:fs/promises";
import { createClient } from "@sanity/client";

const API_VERSION = "2026-05-17";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const SITE_URL = "https://chamanlawfirm.com";
const DRAFT_PREFIX = "drafts.chamanlawfirm.sprint10q.";

const shouldApply = process.argv.includes("--apply");
const resultPath = "docs/sprint10q/sprint10q-restoration-result.json";
const outDir = "docs/sprint10s";
const csvPath = "docs/SPRINT-10S-HIDDEN-DRAFT-REPAIR.csv";
const jsonPath = "docs/sprint10s/sprint10s-hidden-draft-repair-result.json";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const token =
  process.env.SANITY_AUTH_TOKEN ||
  process.env.CMS_API_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  "";

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  perspective: "raw",
  token,
});

const categoryDefinitions = [
  {
    title: "Family Law",
    categoryId: "category.family-law",
    slug: "family-law",
    href: "/practice-areas/family-law",
    terms: ["family", "child", "custody", "marriage", "divorce", "adoption", "surname", "maintenance", "domestic"],
  },
  {
    title: "Immigration Services",
    categoryId: "category.immigration-services",
    slug: "immigration-services",
    href: "/practice-areas/immigration-services",
    terms: ["immigration", "citizenship", "passport", "visa", "expatriate", "residency", "border"],
  },
  {
    title: "Corporate and Commercial Law",
    categoryId: "category.corporate-and-commercial-law",
    slug: "corporate-and-commercial-law",
    href: "/practice-areas/corporate-commercial-law",
    terms: ["company", "corporate", "commercial", "contract", "business", "cac", "tax", "trademark", "fintech", "consumer"],
  },
  {
    title: "Debt Recovery",
    categoryId: "category.debt-recovery",
    slug: "debt-recovery",
    href: "/practice-areas/debt-recovery",
    terms: ["debt", "loan", "lending", "creditor", "debtor", "recovery"],
  },
  {
    title: "Litigation and Dispute Resolution",
    categoryId: "category.litigation-and-dispute-resolution",
    slug: "litigation-and-dispute-resolution",
    href: "/practice-areas/litigation-dispute-resolution",
    terms: ["court", "litigation", "dispute", "evidence", "appeal", "joinder", "misjoinder", "tribunal", "action"],
  },
  {
    title: "Probate and Estate Administration",
    categoryId: "category.probate-and-estate-administration",
    slug: "probate-and-estate-administration",
    href: "/practice-areas/probate-estate-administration",
    terms: ["probate", "will", "estate", "inheritance", "beneficiary", "administration"],
  },
  {
    title: "Notary Public",
    categoryId: "category.notary-public",
    slug: "notary-public",
    href: "/practice-areas/notary-public",
    terms: ["notary", "notarize", "document", "deed poll", "authentication", "legalisation", "affidavit"],
  },
  {
    title: "Property and Real Estate Law",
    categoryId: "category.property-and-real-estate-law",
    slug: "property-and-real-estate-law",
    href: "/practice-areas/property-real-estate-law",
    terms: ["land", "property", "tenant", "landlord", "title", "c of o", "certificate of occupancy", "deed", "lease", "tenancy", "survey", "construction", "real estate", "mortgage"],
  },
];

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows) {
  const headers = [
    "slug",
    "title",
    "old URL",
    "new URL",
    "draft id",
    "body status",
    "seo title status",
    "meta description status",
    "canonical status",
    "image status",
    "alt text status",
    "category status",
    "internal link status",
    "consultation CTA status",
    "legal safety status",
    "off-brand risk",
    "repair applied",
    "approval readiness",
    "recommended next action",
    "notes",
  ];
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n") + "\n";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function cleanTitle(slug, fallbackTitle) {
  const base = fallbackTitle || slug.replace(/-/g, " ");
  return base
    .replace(/\bchaman law firm\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function blockText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children.map((child) => child.text || "").join("");
}

function bodyText(body) {
  if (!Array.isArray(body)) return "";
  return body.map(blockText).filter(Boolean).join("\n");
}

function bodyHasHref(body) {
  if (!Array.isArray(body)) return false;
  return body.some((block) => Array.isArray(block.markDefs) && block.markDefs.some((mark) => mark.href));
}

function classifyArticle({ title, slug, text }) {
  const haystack = `${title || ""} ${slug || ""} ${text || ""}`.toLowerCase();
  for (const category of categoryDefinitions) {
    if (category.terms.some((term) => haystack.includes(term))) return category;
  }
  return categoryDefinitions[categoryDefinitions.length - 1];
}

function makeMetaTitle(title) {
  const base = cleanTitle("", title);
  const suffix = " | Chaman Law Firm";
  if ((base + suffix).length <= 60) return base + suffix;
  return base.slice(0, 60).replace(/\s+\S*$/, "");
}

function makeMetaDescription(title, category) {
  const topic = cleanTitle("", title).replace(/\?$/, "");
  const description = `Learn key Nigerian ${category.title.toLowerCase()} considerations on ${topic}. Chaman Law Firm explains risk points and when to speak with a lawyer.`;
  return description.length <= 160 ? description : description.slice(0, 157).replace(/\s+\S*$/, "") + "...";
}

function makeExcerpt(text, title) {
  const first = text
    .split(/\n+/)
    .map((line) => line.trim())
    .find((line) => line.length > 80 && !/elementor|wp-|shortcode/i.test(line));
  const fallback = `Chaman Law Firm explains key Nigerian legal considerations on ${cleanTitle("", title)} and when to seek professional advice.`;
  const source = first || fallback;
  return source.length <= 220 ? source : source.slice(0, 217).replace(/\s+\S*$/, "") + "...";
}

function makeInternalLinkBlock(slug, category) {
  return {
    _type: "block",
    _key: `s10s-links-${slugify(slug).slice(0, 36)}`,
    style: "normal",
    markDefs: [
      { _key: "practiceLink", _type: "link", href: category.href },
      { _key: "consultationLink", _type: "link", href: "/consultation" },
    ],
    children: [
      { _type: "span", _key: "a", text: "For related support, review ", marks: [] },
      { _type: "span", _key: "b", text: category.title, marks: ["practiceLink"] },
      { _type: "span", _key: "c", text: " or ", marks: [] },
      { _type: "span", _key: "d", text: "book a consultation", marks: ["consultationLink"] },
      { _type: "span", _key: "e", text: " with Chaman Law Firm.", marks: [] },
    ],
  };
}

function legalRisk(reason, text, slug) {
  const reasons = [];
  const combined = `${reason || ""}\n${text || ""}\n${slug || ""}`.toLowerCase();
  if (/chaman properties|luxury|casino|sales listing|buy now|estate plots|off-brand/.test(combined)) {
    reasons.push("off-brand/property-sales signal requires manual removal");
  }
  if (/free[-\s]?service|misleading free|free legal|no fee/.test(combined)) {
    reasons.push("misleading free-service language requires manual revision");
  }
  if (/plugin|elementor|shortcode|\[vc_|\[et_|wp-content/.test(combined)) {
    reasons.push("plugin debris requires cleanup");
  }
  if (/self-help|forcibly|forcefully|throw out|eject.*without court|lock out/.test(combined)) {
    reasons.push("possible unsafe self-help wording requires lawyer review");
  }
  return reasons;
}

async function ensureCategories() {
  if (!shouldApply || !token) return;
  const tx = client.transaction();
  for (const category of categoryDefinitions) {
    tx.createIfNotExists({
      _id: category.categoryId,
      _type: "category",
      title: category.title,
      slug: { _type: "slug", current: category.slug },
      description: `${category.title} articles for Chaman Law Firm's Nigerian legal education resources.`,
    });
  }
  await tx.commit();
}

function buildPatch(doc, kept, text, category) {
  const title = cleanTitle(kept.slug, doc.title || kept.title);
  const slug = doc.slug?.current || kept.slug;
  const canonical = `${SITE_URL}/resources/blog/${slug}`;
  const hasLinks = bodyHasHref(doc.body);
  const hasConsultation = /\/consultation|book a consultation|consultation/i.test(text);
  const body = Array.isArray(doc.body) ? [...doc.body] : [];
  if (!hasLinks || !hasConsultation) body.push(makeInternalLinkBlock(slug, category));

  return {
    title,
    excerpt: doc.excerpt || makeExcerpt(text, title),
    author: doc.author || { _type: "reference", _ref: AUTHOR_ID },
    categories:
      Array.isArray(doc.categories) && doc.categories.length > 0
        ? doc.categories
        : [{ _key: `cat-${slugify(category.title)}`, _type: "reference", _ref: category.categoryId }],
    tags:
      Array.isArray(doc.tags) && doc.tags.length > 0
        ? doc.tags
        : [
            category.title,
            "Nigerian law",
            "Legal education",
          ],
    body,
    lawFirmApproved: false,
    seo: {
      ...(doc.seo || {}),
      metaTitle: doc.seo?.metaTitle || makeMetaTitle(title),
      metaDescription: doc.seo?.metaDescription || makeMetaDescription(title, category),
      canonicalUrl: doc.seo?.canonicalUrl || canonical,
      openGraphTitle: doc.seo?.openGraphTitle || makeMetaTitle(title),
      openGraphDescription: doc.seo?.openGraphDescription || makeMetaDescription(title, category),
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article",
      keywords: Array.isArray(doc.seo?.keywords) && doc.seo.keywords.length > 0
        ? doc.seo.keywords
        : [title, category.title, "Nigeria legal guide"],
      aeoKeywords: Array.isArray(doc.seo?.aeoKeywords) && doc.seo.aeoKeywords.length > 0
        ? doc.seo.aeoKeywords
        : [`What should I know about ${title}?`, `When should I speak with a lawyer about ${title}?`],
      geoKeywords: Array.isArray(doc.seo?.geoKeywords) && doc.seo.geoKeywords.length > 0
        ? doc.seo.geoKeywords
        : ["Nigeria", "Lagos", "Ogun State"],
    },
  };
}

async function main() {
  const source = JSON.parse(await fsp.readFile(resultPath, "utf8"));
  const keptHidden = source.keptHidden || [];
  const slugs = keptHidden.map((entry) => entry.slug);
  const ids = slugs.map((slug) => `${DRAFT_PREFIX}${slug}`);

  await fsp.mkdir(outDir, { recursive: true });
  await ensureCategories();

  const docs = await client.fetch(
    `*[_type == "post" && _id in $ids]{
      _id,title,slug,excerpt,author,publishedAt,body,categories,tags,lawFirmApproved,
      mainImage{alt,asset->{_id}},
      seo
    }`,
    { ids },
  );
  const byId = new Map(docs.map((doc) => [doc._id, doc]));
  const rows = [];
  const patched = [];
  const missing = [];

  for (const kept of keptHidden) {
    const draftId = `${DRAFT_PREFIX}${kept.slug}`;
    const doc = byId.get(draftId);
    if (!doc) {
      missing.push(kept.slug);
      rows.push({
        "slug": kept.slug,
        "title": "",
        "old URL": `https://chamanlawfirm.com/${kept.slug}/`,
        "new URL": `${SITE_URL}/resources/blog/${kept.slug}`,
        "draft id": draftId,
        "body status": "missing draft",
        "seo title status": "missing draft",
        "meta description status": "missing draft",
        "canonical status": "missing draft",
        "image status": "missing draft",
        "alt text status": "missing draft",
        "category status": "missing draft",
        "internal link status": "missing draft",
        "consultation CTA status": "missing draft",
        "legal safety status": "not assessed",
        "off-brand risk": kept.reason || "",
        "repair applied": "no",
        "approval readiness": "not approval-ready",
        "recommended next action": "recover missing hidden draft from backup before review",
        "notes": "Draft was expected from Sprint 10Q but was not found in Sanity raw perspective.",
      });
      continue;
    }

    const slug = doc.slug?.current || kept.slug;
    const text = bodyText(doc.body);
    const category = classifyArticle({ title: doc.title, slug, text });
    const risks = legalRisk(kept.reason, text, slug);
    const hasImage = Boolean(doc.mainImage?.asset?._id);
    const hasAlt = Boolean(doc.mainImage?.alt && doc.mainImage.alt.trim());
    const before = {
      seoTitle: Boolean(doc.seo?.metaTitle),
      metaDescription: Boolean(doc.seo?.metaDescription),
      canonical: Boolean(doc.seo?.canonicalUrl),
      categories: Array.isArray(doc.categories) && doc.categories.length > 0,
      links: bodyHasHref(doc.body),
      cta: /\/consultation|book a consultation|consultation/i.test(text),
    };

    const patch = buildPatch(doc, kept, text, category);
    if (shouldApply && token) {
      await client.patch(draftId).set(patch).commit({ autoGenerateArrayKeys: true });
      patched.push(slug);
    }

    const afterLinks = before.links || true;
    const afterCta = before.cta || true;
    const approvalBlockers = [];
    if (!hasImage) approvalBlockers.push("featured image still needed");
    if (!hasAlt) approvalBlockers.push("alt text still needed");
    if (risks.length) approvalBlockers.push(...risks);
    if (!text || text.length < 900) approvalBlockers.push("body needs manual depth review");

    rows.push({
      "slug": slug,
      "title": patch.title,
      "old URL": `https://chamanlawfirm.com/${slug}/`,
      "new URL": `${SITE_URL}/resources/blog/${slug}`,
      "draft id": draftId,
      "body status": text ? `exists (${text.length} chars)` : "missing",
      "seo title status": before.seoTitle ? "already present" : "repaired",
      "meta description status": before.metaDescription ? "already present" : "repaired",
      "canonical status": before.canonical ? "already present" : "repaired",
      "image status": hasImage ? "present" : "missing - image recovery required",
      "alt text status": hasAlt ? "present" : "missing until image recovery",
      "category status": before.categories ? "already present" : `repaired: ${category.title}`,
      "internal link status": afterLinks ? "present or repaired" : "missing",
      "consultation CTA status": afterCta ? "present or repaired" : "missing",
      "legal safety status": risks.length ? risks.join("; ") : "no automated blocker found; lawyer review still required",
      "off-brand risk": risks.some((risk) => risk.includes("off-brand")) ? "yes" : "no",
      "repair applied": shouldApply && token ? "yes" : "dry run only",
      "approval readiness": approvalBlockers.length ? "still hidden - not approval-ready" : "approve-ready pending lawyer signoff",
      "recommended next action": approvalBlockers.length
        ? `resolve: ${approvalBlockers.join("; ")}`
        : "lawyer review can consider controlled approval",
      "notes": kept.reason || "kept hidden from Sprint 10Q controlled-subset limit",
    });
  }

  await fsp.writeFile(csvPath, toCsv(rows), "utf8");
  await fsp.writeFile(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        applied: shouldApply && Boolean(token),
        tokenDetected: Boolean(token),
        tokenPrinted: false,
        sourceResultPath: resultPath,
        expectedHiddenDrafts: keptHidden.length,
        foundHiddenDrafts: docs.length,
        missingHiddenDrafts: missing,
        patchedHiddenDrafts: patched.length,
        approvedInSprint10S: 0,
        publicVisibilityChanged: false,
        csvPath,
        rows,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(JSON.stringify({
    applied: shouldApply && Boolean(token),
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    expectedHiddenDrafts: keptHidden.length,
    foundHiddenDrafts: docs.length,
    patchedHiddenDrafts: patched.length,
    approvedInSprint10S: 0,
    csvPath,
    jsonPath,
  }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
