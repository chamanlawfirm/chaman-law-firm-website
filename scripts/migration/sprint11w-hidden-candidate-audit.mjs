import fs from "node:fs";
import { createClient } from "@sanity/client";

const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";

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

function compact(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function classifyRisk(title, body) {
  const text = `${title} ${body}`.toLowerCase();
  const flags = [];
  if (/chaman properties|luxury property|buy now|for sale|property sales|estate listing|apartment for sale/.test(text)) flags.push("off-brand/property-sales wording");
  if (/wp-block|elementor|rank ?math|yoast|\[\/?[a-z][^\]]*\]/.test(text)) flags.push("plugin debris or shortcode residue");
  if (/free legal advice|legal advice for free|get.*legal advice.*free/.test(text)) flags.push("misleading free-service wording");
  if (/self-help|forcefully eject|throw out|lock out|remove the tenant yourself|without court/.test(text)) flags.push("possible unsafe self-help wording");
  if (/report a ?crime|acrime|criminal|police|arrest|detention|restraining order|domestic violence|police bail|criminal implication|tax clearance|taxation|limitation period|statute of limitation|eject|evict|quit notice/.test(text)) flags.push("current-law or procedure-sensitive topic");
  if (/paternity|maternity|illegitimate child|child custody|child support|surname of a child/.test(text)) flags.push("family-status topic requires lawyer review");
  if (/resolve land disputes|land dispute|without going to court|proven steps/.test(text)) flags.push("dispute-resolution wording requires lawyer review");
  if (/guarantee|assured result|must win|certain outcome/.test(text)) flags.push("unsupported outcome claim");
  return flags;
}

loadEnvFile(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw"
});

function pathOnly(value) {
  try {
    const parsed = new URL(value, "https://chamanlawfirm.com");
    const normalized = `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
    return normalized === "/" ? "/" : normalized;
  } catch {
    const normalized = `/${String(value || "").split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
    return normalized === "/" ? "/" : normalized;
  }
}

function extractConfiguredRedirectSources() {
  if (!fs.existsSync("next.config.mjs")) return new Map();
  const content = fs.readFileSync("next.config.mjs", "utf8");
  const map = new Map();
  for (const match of content.matchAll(/\{\s*source:\s*["'`]([^"'`]+)["'`]\s*,\s*destination:\s*["'`]([^"'`]+)["'`]/g)) {
    const source = pathOnly(match[1]);
    map.set(source, match[2]);
    map.set(`${source}/`, match[2]);
  }
  return map;
}

const docs = await client.fetch(
  `*[_type == "post" && lawFirmApproved != true && defined(slug.current)]|order(_updatedAt desc)[0...700]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author,
    mainImage{alt,asset->{_id,url}},
    categories[]->{title},
    seo,
    "bodyBlocks": count(body),
    "bodyText": pt::text(body)
  }`
);
const publicSlugs = new Set(await client.fetch(
  `*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current)]{"slug": slug.current}.slug`
));
const configuredRedirects = extractConfiguredRedirectSources();

const scored = docs
  .map((doc) => {
    const text = compact(doc.bodyText);
    const flags = classifyRisk(doc.title, text);
    const hasImage = Boolean(doc.mainImage?.asset?._id || doc.mainImage?.asset?._ref);
    const alt = doc.mainImage?.alt || "";
    const hasMetadata = Boolean(doc.seo?.metaTitle && doc.seo?.metaDescription && doc.seo?.canonicalUrl);
    const hasCategory = (doc.categories || []).length > 0;
    const authorOk = doc.author?._ref === AUTHOR_ID;
    const completeBody = Number(doc.bodyBlocks || 0) >= 8 && text.length >= 1400;
    const publicExists = publicSlugs.has(doc.slug);
    const oldPath = `/${doc.slug}`;
    const redirectTarget = configuredRedirects.get(oldPath) || configuredRedirects.get(`${oldPath}/`) || "";
    const redirectConflict = Boolean(redirectTarget && redirectTarget !== `/resources/blog/${doc.slug}`);
    const score =
      (completeBody ? 4 : 0) +
      (hasImage ? 3 : 0) +
      (alt.length >= 12 ? 2 : 0) +
      (hasMetadata ? 2 : 0) +
      (hasCategory ? 2 : 0) +
      (authorOk ? 1 : 0) +
      (flags.length === 0 ? 5 : 0) -
      (publicExists ? 8 : 0) -
      (redirectConflict ? 5 : 0);
    return {
      slug: doc.slug,
      title: doc.title,
      bodyBlocks: doc.bodyBlocks,
      bodyChars: text.length,
      hasImage,
      altOk: alt.length >= 12,
      hasMetadata,
      hasCategory,
      authorOk,
      publicExists,
      redirectTarget,
      redirectConflict,
      riskFlags: flags.join("; "),
      score
    };
  })
  .filter((row) => row.bodyBlocks >= 8 && row.bodyChars >= 1400)
  .sort((a, b) => b.score - a.score || b.bodyChars - a.bodyChars);

console.log(JSON.stringify({
  hiddenChecked: docs.length,
  completeBodyCandidates: scored.length,
  lowRiskImageReady: scored.filter((row) => row.hasImage && row.altOk && row.hasMetadata && row.hasCategory && !row.riskFlags).length,
  lowRiskImageReadyNewTargets: scored.filter((row) => row.hasImage && row.altOk && row.hasMetadata && row.hasCategory && !row.riskFlags && !row.publicExists && !row.redirectConflict).length,
  top: scored.slice(0, 60)
}, null, 2));
