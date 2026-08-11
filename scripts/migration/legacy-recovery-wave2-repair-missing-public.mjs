import fs from "node:fs";
import { createClient } from "@sanity/client";

for (const raw of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = raw.match(/^([^#=]+)=(.*)$/);
  if (!match) continue;
  const key = match[1].trim();
  const value = match[2].trim().replace(/^['"]|['"]$/g, "");
  if (key && !process.env[key]) process.env[key] = value;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eeuefmhu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-17",
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw",
});

const SITE = "https://chamanlawfirm.com";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const repairs = [
  {
    slug: "land-registration-system-in-nigeria",
    sourceSlug: "land-registration-system-in-nigeria",
    title: "Land Registration System in Nigeria",
  },
  {
    slug: "how-to-legally-evict-a-tenant-in-lagos-state",
    sourceSlug: "how-to-legally-evict-a-tenant-in-lagos-state",
    title: "How to Legally Evict a Tenant in Lagos State",
  },
  {
    slug: "how-to-calculate-and-pay-land-use-charge",
    sourceSlug: "how-to-calculate-and-pay-land-use-charge",
    title: "How to Calculate and Pay Land Use Charge",
  },
  {
    slug: "right-of-an-illegitimate-child",
    sourceSlug: "rights-of-children-born-outside-wedlock",
    title: "Rights of Children Born Outside Wedlock in Nigeria",
  },
  {
    slug: "limitation-of-action-in-nigeria",
    sourceSlug: "limitation-of-action-in-nigeria",
    title: "Limitation of Action in Nigeria",
  },
];

function textFromBlocks(blocks = []) {
  return blocks
    .map((block) => (Array.isArray(block.children) ? block.children.map((child) => child.text || "").join("") : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionFor(source, title) {
  const existing = String(source.seo?.metaDescription || source.excerpt || "").replace(/\s+/g, " ").trim();
  if (existing.length >= 80 && existing.length <= 180) return existing;
  const text = textFromBlocks(source.body || []);
  const fromBody = text.slice(0, 155).trim();
  return fromBody.length >= 80 ? fromBody : `${title} explained for general legal education by Chaman Law Firm in Nigeria.`;
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

function bodyFor(source, title) {
  const body = Array.isArray(source.body) ? [...source.body] : [];
  const text = textFromBlocks(body);
  if (!/consultation|contact chaman law firm|speak with/i.test(text)) {
    body.push(ensureBlock("For advice on specific facts, documents or deadlines, contact Chaman Law Firm for a consultation.", "wave2-repair-cta"));
  }
  if (!/general legal information|legal advice/i.test(text)) {
    body.unshift(ensureBlock(`${title} is published as general legal information for readers in Nigeria and should not be treated as advice on a specific matter.`, "wave2-repair-intro"));
  }
  return body;
}

const results = [];

for (const repair of repairs) {
  const existingPublic = await client.fetch(
    `*[_type == "post" && slug.current == $slug && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(publishedAt) && publishedAt <= now()][0]{_id}`,
    { slug: repair.slug },
  );
  if (existingPublic?._id) {
    results.push({ slug: repair.slug, action: "skipped_existing_public", id: existingPublic._id });
    continue;
  }

  const source = await client.fetch(
    `*[_type == "post" && slug.current == $sourceSlug] | order(_updatedAt desc)[0]{
      _id,title,excerpt,publishedAt,body,mainImage,categories,tags,seo
    }`,
    { sourceSlug: repair.sourceSlug },
  );
  if (!source?._id) {
    results.push({ slug: repair.slug, action: "missing_source" });
    continue;
  }

  const description = descriptionFor(source, repair.title);
  const publicDoc = {
    _id: `chamanlawfirm-wave2-public-${repair.slug}`.replace(/[^A-Za-z0-9_-]/g, "-"),
    _type: "post",
    title: repair.title,
    slug: { _type: "slug", current: repair.slug },
    excerpt: description,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: source.categories || [],
    tags: Array.from(new Set([...(source.tags || []), "legacy recovery wave 2"].filter(Boolean))).slice(0, 12),
    publishedAt: source.publishedAt && new Date(source.publishedAt) <= new Date() ? source.publishedAt : new Date().toISOString(),
    body: bodyFor(source, repair.title),
    mainImage: source.mainImage
      ? {
          ...source.mainImage,
          alt:
            source.mainImage.alt && source.mainImage.alt.trim().length >= 12
              ? source.mainImage.alt
              : `${repair.title} Nigerian legal guide by Chaman Law Firm`,
        }
      : undefined,
    lawFirmApproved: true,
    seo: {
      _type: "seo",
      metaTitle: source.seo?.metaTitle || `${repair.title} | Chaman Law Firm`,
      metaDescription: description,
      canonicalUrl: `${SITE}/resources/blog/${repair.slug}`,
      ...(source.seo?.keywords ? { keywords: source.seo.keywords } : {}),
      ...(source.mainImage ? { openGraphImage: source.mainImage } : {}),
    },
  };
  await client.createOrReplace(publicDoc);
  results.push({ slug: repair.slug, action: "created_public", source: source._id, id: publicDoc._id });
}

console.log(JSON.stringify({ repaired: results }, null, 2));
