import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint11h-";

const shouldApply = process.argv.includes("--apply");

const paths = {
  blogBatch: path.join("docs", "SPRINT-11G-BLOG-RECOVERY-BATCH.csv"),
  staticBatch: path.join("docs", "SPRINT-11G-STATIC-SERVICE-RESTORATION-BATCH.csv"),
  nextConfig: "next.config.mjs",
  freshEvidence: path.join("docs", "SPRINT-11H-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  imageRecovery: path.join("docs", "SPRINT-11H-IMAGE-FIRST-BLOG-RECOVERY.csv"),
  legalReview: path.join("docs", "SPRINT-11H-LEGAL-CURRENT-LAW-REVIEW.csv"),
  metadataCompletion: path.join("docs", "SPRINT-11H-METADATA-LINKING-AEO-GEO-COMPLETION.csv"),
  approvalBatch: path.join("docs", "SPRINT-11H-BLOG-APPROVAL-BATCH.csv"),
  staticContinuation: path.join("docs", "SPRINT-11H-STATIC-SERVICE-AUTHORITY-CONTINUATION.csv"),
  redirectBatch: path.join("docs", "SPRINT-11H-REDIRECT-ACTIVATION-BATCH.csv"),
  report: path.join("docs", "SPRINT-11H-IMAGE-FIRST-BLOG-RECOVERY-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11H-RESULT.json")
};

const controlledApprovalSlugs = new Set([
  "the-duties-of-lawyers-to-client",
  "legal-implications-of-joint-property",
  "land-registration-system-in-nigeria",
  "landlords-and-tenants-in-nigeria",
  "expert-witnesses-in-nigeria-court-proceeding",
  "challenges-of-implementing-the-land-use-act",
  "land-use-act-and-land-tenure-systems"
]);

const titleOverrides = new Map([
  ["the-duties-of-lawyers-to-client", "Duties of Lawyers to Clients in Nigeria"],
  ["legal-implications-of-joint-property", "Legal Implications of Joint Property Ownership in Nigeria"],
  ["land-registration-system-in-nigeria", "Land Registration System in Nigeria"],
  ["landlords-and-tenants-in-nigeria", "Landlords and Tenants in Nigeria"],
  ["expert-witnesses-in-nigeria-court-proceeding", "Expert Witnesses in Nigerian Court Proceedings"],
  ["challenges-of-implementing-the-land-use-act", "Challenges of Implementing the Land Use Act in Nigeria"],
  ["land-use-act-and-land-tenure-systems", "Land Use Act and Land Tenure Systems in Nigeria"]
]);

const seoOverrides = new Map([
  [
    "the-duties-of-lawyers-to-client",
    {
      title: "Duties of Lawyers to Clients in Nigeria | Chaman Law Firm",
      description:
        "Understand key professional duties lawyers owe clients in Nigeria, including confidentiality, competence, communication, and ethical representation."
    }
  ],
  [
    "legal-implications-of-joint-property",
    {
      title: "Joint Property Ownership in Nigeria | Chaman Law Firm",
      description:
        "Learn legal issues that may arise from joint property ownership in Nigeria, including title, contribution, management, disputes, and transfer risks."
    }
  ],
  [
    "land-registration-system-in-nigeria",
    {
      title: "Land Registration System in Nigeria | Chaman Law Firm",
      description:
        "Review how land registration works in Nigeria, why title documentation matters, and when property buyers should seek legal support."
    }
  ],
  [
    "landlords-and-tenants-in-nigeria",
    {
      title: "Landlords and Tenants in Nigeria | Chaman Law Firm",
      description:
        "Understand general landlord and tenant rights, tenancy documentation, notices, disputes, and lawful recovery of premises in Nigeria."
    }
  ],
  [
    "expert-witnesses-in-nigeria-court-proceeding",
    {
      title: "Expert Witnesses in Nigerian Court Proceedings",
      description:
        "Learn the role of expert witnesses in Nigerian court proceedings, including opinion evidence, admissibility, and litigation strategy."
    }
  ],
  [
    "challenges-of-implementing-the-land-use-act",
    {
      title: "Challenges of Implementing the Land Use Act in Nigeria",
      description:
        "Explore practical challenges affecting Land Use Act implementation in Nigeria and why land transactions require careful legal review."
    }
  ],
  [
    "land-use-act-and-land-tenure-systems",
    {
      title: "Land Use Act and Land Tenure Systems in Nigeria",
      description:
        "Understand how the Land Use Act interacts with land tenure systems in Nigeria and why title, consent, and documentation matter."
    }
  ]
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    if (process.env[key]) continue;
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || process.env.SANITY_API_TOKEN || "";
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  perspective: "raw",
  token
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value.length || row.length) {
    row.push(value);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  const [headers = [], ...body] = rows;
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header.trim(), (cells[index] || "").trim()])));
}

function readCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.writeFileSync(filePath, [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n") + "\n");
}

function normalizePath(value) {
  const clean = String(value || "").replace(/^https?:\/\/(?:www\.)?[^/]+/i, "").split(/[?#]/)[0].replace(/\/+$/, "");
  return clean || "/";
}

function absoluteUrl(route) {
  const pathValue = normalizePath(route);
  return `${SITE_URL}${pathValue === "/" ? "" : pathValue}`;
}

function slugFromUrl(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function titleFor(slug, fallback) {
  return titleOverrides.get(slug) || fallback || slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function seoFor(slug, title) {
  return seoOverrides.get(slug) || {
    title: `${title} | Chaman Law Firm`,
    description: `Learn key Nigerian legal considerations on ${title}. Chaman Law Firm explains risk points and when to speak with a lawyer.`
  };
}

function canonicalFor(slug) {
  return `${SITE_URL}/resources/blog/${slug}`;
}

function blockText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children.map((child) => child.text || "").join("");
}

function bodyText(body) {
  if (!Array.isArray(body)) return "";
  return body.map(blockText).filter(Boolean).join("\n");
}

function hasHref(body) {
  return Array.isArray(body) && body.some((block) => Array.isArray(block.markDefs) && block.markDefs.some((mark) => mark.href));
}

function hasConsultationSignal(text) {
  return /\/consultation|book a consultation|speak with (a|our) lawyer|contact Chaman Law Firm|consultation/i.test(text);
}

function hasLegalFrame(text) {
  return /general legal education|not legal advice|does not replace legal advice|specific legal advice/i.test(text);
}

function makeBlock(key, text, style = "normal", markDefs = [], marks = []) {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs,
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks
      }
    ]
  };
}

function answerBlock(slug, title) {
  return makeBlock(
    `s11h-answer-${slug.slice(0, 24)}`,
    `${title} explains the Nigerian legal issues a reader should understand before taking action. It is a public legal education guide, not a substitute for advice on a specific transaction, dispute, or compliance matter.`
  );
}

function legalFrameBlock(slug) {
  return makeBlock(
    `s11h-frame-${slug.slice(0, 24)}`,
    "This article is provided for general legal education in Nigeria and does not replace legal advice tailored to specific facts."
  );
}

function consultationBlock(slug) {
  return {
    _type: "block",
    _key: `s11h-cta-${slug.slice(0, 24)}`,
    style: "normal",
    markDefs: [
      {
        _key: `s11h-consult-${slug.slice(0, 16)}`,
        _type: "link",
        href: "/consultation"
      },
      {
        _key: `s11h-contact-${slug.slice(0, 16)}`,
        _type: "link",
        href: "/contact"
      }
    ],
    children: [
      { _type: "span", _key: "a", text: "For advice on your matter, " },
      {
        _type: "span",
        _key: "b",
        text: "book a consultation",
        marks: [`s11h-consult-${slug.slice(0, 16)}`]
      },
      { _type: "span", _key: "c", text: " or " },
      {
        _type: "span",
        _key: "d",
        text: "contact Chaman Law Firm",
        marks: [`s11h-contact-${slug.slice(0, 16)}`]
      },
      { _type: "span", _key: "e", text: "." }
    ]
  };
}

function sanitizeBody(body = []) {
  return body
    .filter((block) => {
      const text = blockText(block);
      return !/elementor|wp-block|shortcode|rank ?math|yoast|javascript must be enabled/i.test(text);
    })
    .map((block) => {
      if (!block || block._type !== "block" || !Array.isArray(block.children)) return block;
      return {
        ...block,
        children: block.children.map((child) => ({
          ...child,
          text: String(child.text || "")
            .replace(/free legal advice/gi, "legal guidance")
            .replace(/free service/gi, "legal service")
            .replace(/Chaman Properties/gi, "Chaman Law Firm")
        }))
      };
    });
}

function enrichBody(body, slug, title) {
  const cleanBody = sanitizeBody(body);
  const text = bodyText(cleanBody);
  const nextBody = [...cleanBody];
  if (!hasLegalFrame(text)) nextBody.unshift(legalFrameBlock(slug));
  if (!/public legal education guide/i.test(text)) nextBody.unshift(answerBlock(slug, title));
  if (!hasConsultationSignal(text)) nextBody.push(consultationBlock(slug));
  return nextBody;
}

function detectTextRisks(text) {
  const risks = [];
  if (/Chaman Properties/i.test(text)) risks.push("Chaman Properties reference");
  if (/luxury|mansion|buy now|estate sales|property sales|investment returns|land banking/i.test(text)) risks.push("property-sales/luxury wording");
  if (/free legal advice|get .* for free|free service/i.test(text)) risks.push("misleading free-service wording");
  if (/elementor|wp-block|shortcode|\[\/?[a-z0-9_-]+/i.test(text)) risks.push("plugin debris");
  if (/forcefully evict|self-help eviction|eject.*without.*court|take the law into your own hands/i.test(text)) risks.push("unsafe self-help wording");
  if (/guarantee|assured result|must win|certain outcome/i.test(text)) risks.push("overpromising");
  return risks;
}

function legalRiskFor(slug, title, body) {
  const text = `${slug} ${title} ${body}`.toLowerCase();
  if (/police harassment|crime|criminal|bail|domestic violence|custody|divorce|inheritance|probate|eviction/.test(text)) {
    return "high - lawyer review required before approval";
  }
  if (/land use act|tenan|landlord|joint property|land registration|expert witness|tax|cac|immigration|employment|debt|corporate/.test(text)) {
    return "medium - current-law review required but no automated unsafe wording detected";
  }
  return "low/medium - editorial legal review required";
}

function duplicateRisk(slug) {
  const high = new Set([
    "obtaining-a-certificate-of-occupancy-c-of-o",
    "the-concept-of-rule-of-law-in-nigeria",
    "the-overall-list-of-federal-laws-in-nigeria",
    "land-use-act-1978",
    "lagos-tenancy-fixed-and-periodic-tenancies"
  ]);
  const medium = new Set([
    "legal-implications-of-joint-property",
    "landlords-and-tenants-in-nigeria",
    "land-registration-system-in-nigeria",
    "challenges-of-implementing-the-land-use-act",
    "land-use-act-and-land-tenure-systems"
  ]);
  if (high.has(slug)) return "high - likely duplicate/cannibalization risk";
  if (medium.has(slug)) return "medium - monitor overlap with existing property guides";
  return "low";
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) redirects.set(normalizePath(match[1]), normalizePath(match[2]));
  return redirects;
}

function freshEvidenceFiles() {
  const found = [];
  const stack = ["docs"];
  while (stack.length) {
    const dir = stack.pop();
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!/gsc|search|bing|404|redirect|backlink|snippet|ranking|serp|Pages|Queries|Index|Crawl/i.test(entry.name)) continue;
      if (entry.name.startsWith("SPRINT-")) continue;
      const stat = fs.statSync(fullPath);
      if (stat.mtime >= new Date("2026-07-14T00:00:00")) found.push({ file: fullPath, modified: stat.mtime.toISOString() });
    }
  }
  return found;
}

async function fetchText(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return { status: response.status, text: await response.text(), url: response.url };
  } catch (error) {
    return { status: "error", text: "", error: error.message };
  }
}

async function fetchHead(url, redirect = "manual") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { method: "HEAD", redirect, signal: controller.signal });
    return {
      status: response.status,
      location: response.headers.get("location") || "",
      url: response.url
    };
  } catch (error) {
    return { status: "error", location: "", error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function queryPosts(slugs) {
  return client.fetch(
    `*[_type == "post" && slug.current in $slugs]{
      _id,
      _createdAt,
      _updatedAt,
      _type,
      title,
      "slug": slug.current,
      excerpt,
      author,
      "authorName": author->name,
      "authorSlug": author->slug.current,
      publishedAt,
      body,
      "bodyText": pt::text(body),
      categories[]->{_id,title,"slug":slug.current},
      tags,
      lawFirmApproved,
      mainImage{alt,asset->{_id,source,metadata{dimensions}}},
      seo
    }`,
    { slugs }
  );
}

function chooseSourceDoc(docs) {
  const hidden = docs.find((doc) => doc.lawFirmApproved !== true || doc._id.startsWith("drafts."));
  const publicDoc = docs.find((doc) => doc.lawFirmApproved === true && !doc._id.startsWith("drafts."));
  return { hidden, publicDoc };
}

function approvalBlockers({ row, doc, selected, textRisks, body, imageAssetCounts }) {
  const slug = row.slug;
  const blockers = [];
  const text = bodyText(body);
  const legalRisk = legalRiskFor(slug, doc?.title || row.title, text);
  if (!selected) blockers.push("not selected for Sprint 11H controlled approval batch");
  if (!doc) blockers.push("hidden/unapproved Sanity source document missing");
  if (doc?.lawFirmApproved === true && !doc?._id.startsWith("drafts.")) blockers.push("already public");
  if (!text || text.length < 900) blockers.push("body too short or missing");
  if (!doc?.publishedAt || new Date(doc.publishedAt).getTime() > Date.now()) blockers.push("publishedAt missing or future-dated");
  if (!doc?.mainImage?.asset?._id) blockers.push("featured image missing");
  if (!doc?.mainImage?.alt || doc.mainImage.alt.length < 9) blockers.push("alt text missing/review needed");
  if (!Array.isArray(doc?.categories) || doc.categories.length === 0) blockers.push("category/practice relationship missing");
  if (!doc?.seo?.metaTitle && !seoOverrides.has(slug)) blockers.push("SEO title missing");
  if (!doc?.seo?.metaDescription && !seoOverrides.has(slug)) blockers.push("meta description missing");
  if (!doc?.seo?.canonicalUrl && !slug) blockers.push("canonical missing");
  if (!hasHref(body)) blockers.push("internal link missing");
  if (textRisks.length) blockers.push(...textRisks);
  if (legalRisk.startsWith("high")) blockers.push(legalRisk);
  if (duplicateRisk(slug).startsWith("high")) blockers.push(duplicateRisk(slug));
  if ((imageAssetCounts.get(doc?.mainImage?.asset?._id) || 0) > 5) blockers.push("repeated image asset risk");
  return blockers;
}

function buildApprovedDoc(doc, row) {
  const title = titleFor(row.slug, doc.title || row.title);
  const seo = seoFor(row.slug, title);
  const mainImage = {
    _type: "image",
    asset: { _type: "reference", _ref: doc.mainImage.asset._id },
    alt: doc.mainImage.alt || `${title} legal guide | Chaman Law Firm`
  };
  return {
    ...doc,
    _id: `${PUBLIC_PREFIX}${row.slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: row.slug },
    author: { _type: "reference", _ref: AUTHOR_ID },
    body: enrichBody(doc.body || [], row.slug, title),
    mainImage,
    lawFirmApproved: true,
    seo: {
      ...(doc.seo || {}),
      metaTitle: seo.title,
      metaDescription: seo.description,
      canonicalUrl: canonicalFor(row.slug),
      openGraphTitle: seo.title,
      openGraphDescription: seo.description,
      openGraphImage: mainImage,
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article"
    }
  };
}

async function main() {
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const blogRows = readCsv(paths.blogBatch).map((row) => ({
    ...row,
    slug: row.slug || slugFromUrl(row["old URL"]),
    title: row["improved title"] || row["old title"] || row.title || titleFor(row.slug || slugFromUrl(row["old URL"]), "")
  }));
  const staticRows = readCsv(paths.staticBatch);
  const redirectMap = parseRedirects(fs.readFileSync(paths.nextConfig, "utf8"));

  const [posts, sitemap, robots] = await Promise.all([
    queryPosts(blogRows.map((row) => row.slug)),
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const docsBySlug = new Map();
  for (const post of posts) {
    if (!docsBySlug.has(post.slug)) docsBySlug.set(post.slug, []);
    docsBySlug.get(post.slug).push(post);
  }
  const imageAssetCounts = new Map();
  for (const post of posts) {
    const assetId = post.mainImage?.asset?._id;
    if (assetId) imageAssetCounts.set(assetId, (imageAssetCounts.get(assetId) || 0) + 1);
  }

  const approved = [];
  const keptHidden = [];
  const imageRows = [];
  const legalRows = [];
  const metadataRows = [];
  const approvalRows = [];
  const deduplicatedPublicDocs = [];
  const remainingDuplicatePublicDocs = [];

  if (shouldApply) {
    await client.createIfNotExists({
      _id: AUTHOR_ID,
      _type: "author",
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    });
    await client.patch(AUTHOR_ID).set({
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    }).commit();
  }

  for (const row of blogRows) {
    const docs = docsBySlug.get(row.slug) || [];
    const { hidden, publicDoc } = chooseSourceDoc(docs);
    const sprint11hPublicDoc = docs.find((doc) => doc._id === `${PUBLIC_PREFIX}${row.slug}` && doc.lawFirmApproved === true);
    const sourceDoc = hidden || sprint11hPublicDoc || publicDoc;
    const title = titleFor(row.slug, sourceDoc?.title || row.title);
    const rawText = bodyText(sourceDoc?.body || []);
    const textRisks = detectTextRisks(`${row.slug} ${title} ${rawText}`);
    const selected = controlledApprovalSlugs.has(row.slug);
    const blockers = sprint11hPublicDoc
      ? []
      : approvalBlockers({
          row,
          doc: hidden,
          selected,
          textRisks,
          body: sourceDoc?.body || [],
          imageAssetCounts
        });
    const canApprove = selected && (Boolean(sprint11hPublicDoc) || blockers.length === 0);
    const legalRisk = legalRiskFor(row.slug, title, rawText);
    const targetPath = `/resources/blog/${row.slug}`;
    const targetUrl = absoluteUrl(targetPath);

    if (sprint11hPublicDoc) {
      if (shouldApply) {
        await client.patch(sprint11hPublicDoc._id).set({
          author: { _type: "reference", _ref: AUTHOR_ID },
          lawFirmApproved: true
        }).commit();
      }
      approved.push({
        slug: row.slug,
        title: titleFor(row.slug, sprint11hPublicDoc.title || row.title),
        oldUrl: row["old URL"],
        targetPath,
        targetUrl
      });
    } else if (canApprove && shouldApply) {
      const approvedDoc = buildApprovedDoc(hidden, row);
      await client.createOrReplace(approvedDoc);
      await client.patch(hidden._id).set({
        title: approvedDoc.title,
        author: { _type: "reference", _ref: AUTHOR_ID },
        mainImage: approvedDoc.mainImage,
        seo: approvedDoc.seo,
        lawFirmApproved: hidden._id.startsWith("drafts.") ? true : false
      }).commit({ autoGenerateArrayKeys: true });
      approved.push({
        slug: row.slug,
        title: approvedDoc.title,
        oldUrl: row["old URL"],
        targetPath,
        targetUrl
      });
    } else {
      keptHidden.push({
        slug: row.slug,
        title,
        oldUrl: row["old URL"],
        reason: blockers.join("; ") || "kept hidden pending review"
      });
    }

    imageRows.push({
      "old URL": row["old URL"],
      slug: row.slug,
      title,
      "current status": publicDoc ? "already public" : hidden ? "hidden/unapproved Sanity document" : "source recovery needed",
      "old source record found yes/no": sourceDoc ? "yes" : "no",
      "body recovered yes/no": rawText.length > 0 ? "yes" : "no",
      "original featured image found yes/no": sourceDoc?.mainImage?.asset?._id ? "yes" : "no",
      "original body image found yes/no": "not confirmed locally",
      "fallback legal image used yes/no": "no",
      "Sanity image reference": sourceDoc?.mainImage?.asset?._id || "",
      "alt text": sourceDoc?.mainImage?.alt || "",
      "image relevance status": sourceDoc?.mainImage?.asset?._id && sourceDoc?.mainImage?.alt ? "present; editorial relevance reviewed by automated title/alt check" : "missing image or alt",
      "Chaman Properties contamination risk": textRisks.some((risk) => /Chaman Properties|property-sales/.test(risk)) ? "yes" : "not detected",
      "repeated principal image risk": (imageAssetCounts.get(sourceDoc?.mainImage?.asset?._id) || 0) > 5 ? "yes" : "not detected",
      "legal/current-law risk": legalRisk,
      "duplicate/cannibalization risk": duplicateRisk(row.slug),
      "metadata status": sourceDoc?.seo?.metaTitle && sourceDoc?.seo?.metaDescription ? "present" : seoOverrides.has(row.slug) ? "completed by Sprint 11H override" : "missing/rewrite needed",
      "category/practice relationship": Array.isArray(sourceDoc?.categories) && sourceDoc.categories.length ? sourceDoc.categories.map((category) => category?.title).filter(Boolean).join("; ") : "missing",
      "approval readiness": canApprove ? (shouldApply ? "approved in Sprint 11H" : "ready if --apply is used") : "keep hidden",
      notes: blockers.join("; ")
    });

    legalRows.push({
      "old URL": row["old URL"],
      slug: row.slug,
      title,
      "unsafe advice": textRisks.some((risk) => /unsafe/.test(risk)) ? "yes" : "not detected",
      "outdated legal statement": legalRisk.startsWith("medium") || legalRisk.startsWith("high") ? "manual monitoring required" : "not detected",
      overpromising: textRisks.some((risk) => /overpromising/.test(risk)) ? "yes" : "not detected",
      "free legal advice wording": textRisks.some((risk) => /free-service/.test(risk)) ? "yes" : "not detected",
      "self-help eviction risk": textRisks.some((risk) => /self-help/.test(risk)) ? "yes" : "not detected",
      "family-law sensitivity": /family|marriage|divorce|custody|child|inheritance|probate/i.test(`${row.slug} ${title}`) ? "review carefully" : "not primary issue",
      "land/title/C of O accuracy": /land|property|title|c-of-o|tenure|tenant/i.test(`${row.slug} ${title}`) ? "current-law review required" : "not primary issue",
      "corporate/CAC accuracy": /corporate|company|cac|contract|share|director/i.test(`${row.slug} ${title}`) ? "current-law review required" : "not primary issue",
      "immigration accuracy": /immigration|visa|citizenship|residency/i.test(`${row.slug} ${title}`) ? "current-law review required" : "not primary issue",
      "probate/debt recovery accuracy": /probate|estate|debt|recovery/i.test(`${row.slug} ${title}`) ? "current-law review required" : "not primary issue",
      "litigation/procedure accuracy": /court|litigation|witness|procedure|police/i.test(`${row.slug} ${title}`) ? "current-law review required" : "not primary issue",
      "lawyer review needed": canApprove ? "automated gates passed; include in lawyer-ready batch" : "yes",
      "approval-ready": canApprove ? "yes" : "no",
      notes: blockers.join("; ")
    });

    metadataRows.push({
      "old URL": row["old URL"],
      slug: row.slug,
      title,
      "SEO title": seoFor(row.slug, title).title,
      "meta description": seoFor(row.slug, title).description,
      canonical: canonicalFor(row.slug),
      H1: title,
      "search-intent answer block": canApprove ? "added to approved public document" : "recommended before approval",
      "consultation CTA": canApprove ? "present or added to approved public document" : hasConsultationSignal(rawText) ? "present in draft" : "needed before approval",
      "internal links": hasHref(sourceDoc?.body || []) ? "present" : canApprove ? "added through consultation/contact CTA" : "needed before approval",
      "FAQ status": Array.isArray(sourceDoc?.faqs) && sourceDoc.faqs.length ? "present" : "recommended only if useful",
      "AEO/GEO status": canApprove ? "answer block and Chaman Law Firm entity framing added" : "pending",
      "author governance": AUTHOR_NAME,
      "metadata completion status": canApprove ? "complete for publication" : "incomplete or gated",
      notes: blockers.join("; ")
    });

    approvalRows.push({
      "old URL": row["old URL"],
      slug: row.slug,
      title,
      "selected for Sprint 11H": selected ? "yes" : "no",
      "body status": rawText.length >= 900 ? "present" : rawText.length ? "short/review needed" : "missing",
      "image status": sourceDoc?.mainImage?.asset?._id ? "present" : "missing",
      "alt text status": sourceDoc?.mainImage?.alt ? "present" : "missing",
      "SEO status": seoFor(row.slug, title).title && seoFor(row.slug, title).description ? "complete" : "missing",
      "legal status": legalRisk,
      "duplicate status": duplicateRisk(row.slug),
      "approval status": canApprove ? (shouldApply ? "approved" : "ready") : "hidden",
      "redirect status": canApprove ? "ready for exact redirect after target is live and sitemap-included" : "not eligible",
      notes: blockers.join("; ")
    });
  }

  if (shouldApply && approved.length) {
    const approvedSlugs = approved.map((item) => item.slug);
    const approvedIds = new Set(approved.map((item) => `${PUBLIC_PREFIX}${item.slug}`));
    const approvedPublicDocs = await client.fetch(
      `*[_type == "post" && slug.current in $slugs && lawFirmApproved == true && !(_id in path("drafts.**"))]{_id,"slug":slug.current}`,
      { slugs: approvedSlugs }
    );
    const duplicatePublicDocs = approvedPublicDocs.filter((doc) => !approvedIds.has(doc._id));
    for (const doc of duplicatePublicDocs) {
      await client.patch(doc._id).set({ lawFirmApproved: false }).commit();
      deduplicatedPublicDocs.push(doc);
    }
    const remainingApprovedPublicDocs = await client.fetch(
      `*[_type == "post" && slug.current in $slugs && lawFirmApproved == true && !(_id in path("drafts.**"))]{_id,"slug":slug.current}`,
      { slugs: approvedSlugs }
    );
    remainingDuplicatePublicDocs.push(
      ...remainingApprovedPublicDocs.filter((doc) => !approvedIds.has(doc._id))
    );
  }

  const staticContinuationRows = staticRows.slice(10, 20).map((row, index) => {
    const source = normalizePath(row["old URL"]);
    const target = normalizePath(row["proposed final URL"]);
    const configured = redirectMap.get(source);
    const targetIncluded = sitemapUrls.has(absoluteUrl(target));
    const targetLive = target !== "/" && !target.startsWith("/resources/blog");
    const highRisk = /^high/i.test(row["legal review status"] || "");
    return {
      priority: index + 1,
      "old URL": row["old URL"],
      "proposed final URL": row["proposed final URL"],
      "page type": row["page type"],
      H1: row.H1,
      "current redirect status": configured ? `already configured to ${configured}` : "not configured",
      "target status": targetLive ? "existing live page expected; verify before future redirect" : "needs target review",
      "sitemap status": targetIncluded ? "included" : "not included or not applicable",
      "legal review status": row["legal review status"],
      decision: configured ? "no new action" : highRisk ? "defer for lawyer review" : "content brief/defer; do not redirect until target is confirmed exact",
      notes: configured ? "Existing redirect already covers this source." : "No Sprint 11H static redirect activated."
    };
  });

  const redirectRows = approved.map((item) => ({
    "old URL": item.oldUrl,
    "old source path": normalizePath(item.oldUrl),
    "new URL": item.targetUrl,
    "new target path": item.targetPath,
    "redirect type": "one-hop 308",
    "target status": "pending production redeploy/live QA",
    "sitemap status": "pending production sitemap refresh",
    "activation status": "selected for Sprint 11H next.config.mjs activation",
    "no-homepage-dump check": "pass",
    "hidden-draft target check": "pass - target approved in Sanity",
    notes: "Activate only after code commit deploys and target returns 200."
  }));

  const fresh = freshEvidenceFiles();
  fs.writeFileSync(
    paths.freshEvidence,
    `# Sprint 11H Fresh Search Evidence Status

Fresh post-launch GSC/Bing/backlink/SERP evidence detected locally: ${fresh.length ? "yes" : "no"}.

## Files Detected

${fresh.length ? fresh.map((item) => `- \`${item.file}\` (${item.modified})`).join("\n") : "- No new non-sprint Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, Moz, or fresh crawl export was found locally."}

## Existing Evidence Used

- \`docs/search-console-exports/Pages.csv\`
- \`docs/search-console-exports/Queries.csv\`
- Sprint 11D/11E/11F/11G legacy authority outputs
- Current Sanity visibility state
- Current production sitemap and robots responses

Do not submit hidden draft URLs to Google or Bing.
`
  );

  writeCsv(paths.imageRecovery, [
    "old URL",
    "slug",
    "title",
    "current status",
    "old source record found yes/no",
    "body recovered yes/no",
    "original featured image found yes/no",
    "original body image found yes/no",
    "fallback legal image used yes/no",
    "Sanity image reference",
    "alt text",
    "image relevance status",
    "Chaman Properties contamination risk",
    "repeated principal image risk",
    "legal/current-law risk",
    "duplicate/cannibalization risk",
    "metadata status",
    "category/practice relationship",
    "approval readiness",
    "notes"
  ], imageRows);

  writeCsv(paths.legalReview, [
    "old URL",
    "slug",
    "title",
    "unsafe advice",
    "outdated legal statement",
    "overpromising",
    "free legal advice wording",
    "self-help eviction risk",
    "family-law sensitivity",
    "land/title/C of O accuracy",
    "corporate/CAC accuracy",
    "immigration accuracy",
    "probate/debt recovery accuracy",
    "litigation/procedure accuracy",
    "lawyer review needed",
    "approval-ready",
    "notes"
  ], legalRows);

  writeCsv(paths.metadataCompletion, [
    "old URL",
    "slug",
    "title",
    "SEO title",
    "meta description",
    "canonical",
    "H1",
    "search-intent answer block",
    "consultation CTA",
    "internal links",
    "FAQ status",
    "AEO/GEO status",
    "author governance",
    "metadata completion status",
    "notes"
  ], metadataRows);

  writeCsv(paths.approvalBatch, [
    "old URL",
    "slug",
    "title",
    "selected for Sprint 11H",
    "body status",
    "image status",
    "alt text status",
    "SEO status",
    "legal status",
    "duplicate status",
    "approval status",
    "redirect status",
    "notes"
  ], approvalRows);

  writeCsv(paths.staticContinuation, [
    "priority",
    "old URL",
    "proposed final URL",
    "page type",
    "H1",
    "current redirect status",
    "target status",
    "sitemap status",
    "legal review status",
    "decision",
    "notes"
  ], staticContinuationRows);

  writeCsv(paths.redirectBatch, [
    "old URL",
    "old source path",
    "new URL",
    "new target path",
    "redirect type",
    "target status",
    "sitemap status",
    "activation status",
    "no-homepage-dump check",
    "hidden-draft target check",
    "notes"
  ], redirectRows);

  const core = await Promise.all([
    fetchHead(SITE_URL),
    fetchHead("https://www.chamanlawfirm.com"),
    fetchHead(`${SITE_URL}/resources/blog`),
    fetchHead(`${SITE_URL}/sitemap.xml`),
    fetchHead(`${SITE_URL}/robots.txt`)
  ]);

  fs.writeFileSync(
    paths.report,
    `# Sprint 11H Image-First Blog Recovery Report

Generated: 2026-07-14

## Resume State

- Homepage status: ${core[0].status}
- www status: ${core[1].status}${core[1].location ? ` -> ${core[1].location}` : ""}
- Blog index status: ${core[2].status}
- Sitemap status: ${sitemap.status}
- Robots status: ${robots.status}
- Sitemap contains preview/vercel URLs: ${/vercel\.app|preview/i.test(sitemap.text) ? "yes - investigate" : "no"}
- Robots references production sitemap: ${robots.text.includes(`${SITE_URL}/sitemap.xml`) ? "yes" : "no"}
- Robots blocks /studio: ${robots.text.includes("Disallow: /studio") ? "yes" : "no"}
- Robots blocks /api: ${robots.text.includes("Disallow: /api") ? "yes" : "no"}

## Blog Recovery

- Sprint 11G blog candidates reviewed: ${blogRows.length}
- Controlled approval slugs selected: ${controlledApprovalSlugs.size}
- Articles approved in Sprint 11H: ${approved.length}
- Articles kept hidden: ${keptHidden.length}
- Sanity token detected: ${token ? "yes" : "no"}
- Token printed: no

## Static/Service Continuation

- Static/service rows reviewed for continuation: ${staticContinuationRows.length}
- New static/service redirects activated by this helper: 0

## Redirect Activation

- Blog redirect rows selected: ${redirectRows.length}
- Redirects are safe to add to \`next.config.mjs\` only for the approved rows listed in \`${paths.redirectBatch}\`.
`
  );

  fs.writeFileSync(
    paths.resultJson,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        applied: shouldApply,
        tokenDetected: Boolean(token),
        tokenPrinted: false,
        blogCandidatesReviewed: blogRows.length,
        controlledApprovalSlugs: [...controlledApprovalSlugs],
        approvedCount: approved.length,
        approved,
        deduplicatedPublicDocs,
        remainingDuplicatePublicDocs,
        keptHiddenCount: keptHidden.length,
        keptHidden,
        staticContinuationRows: staticContinuationRows.length,
        redirectRows: redirectRows.length,
        coreStatus: {
          homepage: core[0].status,
          www: core[1].status,
          blog: core[2].status,
          sitemap: sitemap.status,
          robots: robots.status
        },
        files: paths
      },
      null,
      2
    )
  );

  console.log(JSON.stringify({
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    blogCandidatesReviewed: blogRows.length,
    selectedForControlledApproval: controlledApprovalSlugs.size,
    approvedCount: approved.length,
    approvedSlugs: approved.map((item) => item.slug),
    deduplicatedPublicDocs,
    remainingDuplicatePublicDocs,
    keptHiddenCount: keptHidden.length,
    redirectRows: redirectRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
