import { execFile } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { createClient } from "@sanity/client";

const execFileAsync = promisify(execFile);

const API_VERSION = "2026-05-17";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const SITE_URL = "https://chamanlawfirm.com";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const DRAFT_PREFIX = "drafts.chamanlawfirm.sprint10q.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint10t-";
const SOURCE_NAME = "legacy-wordpress-backup-2026-06-28-sprint10t";

const shouldApply = process.argv.includes("--apply");
const uploadAllImages = process.argv.includes("--all-images");
const backupRoot =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026";
const tarGzPath = path.join(backupRoot, "u169781131.chamanlawfirm-com.20260626153946.tar.gz");
const extractedImageRoot = path.join(process.cwd(), ".tmp", "chaman-sprint10t-images");

const sprint10sRepairPath = "docs/SPRINT-10S-HIDDEN-DRAFT-REPAIR.csv";
const sprint10qImageMapPath = "docs/SPRINT-10Q-IMAGE-RECOVERY-AND-REFRESH-MAP.csv";
const outDir = "docs/sprint10t";
const approvalReviewPath = "docs/SPRINT-10T-REPAIRED-DRAFT-APPROVAL-REVIEW.csv";
const imageMapOutPath = "docs/SPRINT-10T-IMAGE-RECOVERY-COMPLETION-MAP.csv";
const legalReviewPath = "docs/SPRINT-10T-LEGAL-CLEANUP-REVIEW.csv";
const resultJsonPath = "docs/sprint10t/sprint10t-approval-result.json";

const controlledApprovalSlugs = new Set([
  "ultimate-legal-guide-to-buying-land-in-niger",
  "managing-corporate-reputation",
  "land-registration-in-lagos",
  "what-property-taxes-must-i-pay-when-buying",
  "enhancing-nigerian-immigration-security-2",
  "challenge-a-fraudulent-probate-application",
  "corporate-debt-management-practices",
  "of-immigration-compliance-lawyers",
  "top-10-legal-mistakes-property-buyers-make-i",
  "debt-recovery-and-consumer-protection-laws",
]);

const titleOverrides = new Map([
  ["ultimate-legal-guide-to-buying-land-in-niger", "Ultimate Legal Guide to Buying Land in Nigeria"],
  ["what-property-taxes-must-i-pay-when-buying", "Property Taxes to Consider When Buying Real Estate in Nigeria"],
  ["enhancing-nigerian-immigration-security-2", "Enhancing Nigerian Immigration Security"],
  ["of-immigration-compliance-lawyers", "Role of Immigration Compliance Lawyers in Nigeria"],
  ["top-10-legal-mistakes-property-buyers-make-i", "Top Legal Mistakes Property Buyers Make in Nigeria"],
]);

const seoOverrides = new Map([
  [
    "ultimate-legal-guide-to-buying-land-in-niger",
    {
      title: "Ultimate Guide to Buying Land in Nigeria | Chaman Law Firm",
      description:
        "Learn key legal checks before buying land in Nigeria, including title review, due diligence, documentation, and when to speak with a property lawyer.",
    },
  ],
  [
    "managing-corporate-reputation",
    {
      title: "Managing Corporate Reputation in Nigeria | Chaman Law Firm",
      description:
        "Understand legal strategies for protecting corporate reputation in Nigeria, managing disputes, and responding to regulatory or commercial risks.",
    },
  ],
  [
    "land-registration-in-lagos",
    {
      title: "Land Registration in Lagos | Chaman Law Firm",
      description:
        "Learn the legal basics of land registration in Lagos, documents to review, perfection steps, and when to get property-law support.",
    },
  ],
  [
    "what-property-taxes-must-i-pay-when-buying",
    {
      title: "Property Taxes When Buying Real Estate in Nigeria",
      description:
        "Review common property tax and transaction cost issues buyers should consider in Nigeria before completing a real estate purchase.",
    },
  ],
  [
    "enhancing-nigerian-immigration-security-2",
    {
      title: "Enhancing Nigerian Immigration Security | Chaman Law Firm",
      description:
        "Explore Nigerian immigration security, compliance obligations, border-management issues, and when businesses or individuals should seek legal guidance.",
    },
  ],
  [
    "challenge-a-fraudulent-probate-application",
    {
      title: "Challenge a Fraudulent Probate Application | Chaman Law Firm",
      description:
        "Learn general legal steps for challenging suspected fraudulent probate applications in Nigeria and protecting estate or inheritance interests.",
    },
  ],
  [
    "corporate-debt-management-practices",
    {
      title: "Corporate Debt Management in Nigeria | Chaman Law Firm",
      description:
        "Understand corporate debt management practices in Nigeria, risk control, negotiation, compliance, and when legal support may be needed.",
    },
  ],
  [
    "of-immigration-compliance-lawyers",
    {
      title: "Immigration Compliance Lawyers in Nigeria | Chaman Law Firm",
      description:
        "Learn how immigration compliance lawyers help Nigerian businesses and foreign nationals manage documentation, workforce, and regulatory obligations.",
    },
  ],
  [
    "top-10-legal-mistakes-property-buyers-make-i",
    {
      title: "Legal Mistakes Property Buyers Make in Nigeria",
      description:
        "Review common legal mistakes property buyers make in Nigeria, from title checks to documentation gaps, and when to consult a property lawyer.",
    },
  ],
  [
    "debt-recovery-and-consumer-protection-laws",
    {
      title: "Debt Recovery and Consumer Protection in Nigeria",
      description:
        "Understand how debt recovery interacts with consumer protection rules in Nigeria and why lawful, documented recovery steps matter.",
    },
  ],
]);

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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0];
  return rows.slice(1).map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])),
  );
}

async function readCsv(filePath) {
  return parseCsv(await fsp.readFile(filePath, "utf8"));
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(rows, headers) {
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

function bodyHasConsultation(body) {
  return /\/consultation|book a consultation|consultation/i.test(bodyText(body));
}

function hasLegalEducationFrame(body) {
  return /general legal education|does not replace legal advice|specific legal advice/i.test(bodyText(body));
}

function legalEducationBlock(slug) {
  return {
    _type: "block",
    _key: `s10t-frame-${slugify(slug).slice(0, 36)}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "a",
        text:
          "This article is provided for general legal education in Nigeria and should not be treated as legal advice for a specific matter.",
        marks: [],
      },
    ],
  };
}

function sanitizeBody(body = []) {
  return body.map((block) => {
    if (!block || block._type !== "block" || !Array.isArray(block.children)) return block;
    return {
      ...block,
      children: block.children.map((child) => {
        if (!child?.text) return child;
        return {
          ...child,
          text: child.text
            .replace(/free legal advice/gi, "legal guidance")
            .replace(/free service/gi, "legal service")
            .replace(/Chaman Properties/gi, "Chaman Law Firm"),
        };
      }),
    };
  });
}

function sourceIsLocalArchive(source = "") {
  return source.startsWith("./domains/chamanlawfirm.com/public_html/wp-content/uploads/");
}

function extractedPathFor(entry) {
  return path.join(extractedImageRoot, entry.replace(/^\.\//, "").replace(/\//g, path.sep));
}

async function fileExists(filePath) {
  try {
    await fsp.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function extractImage(entry) {
  if (!sourceIsLocalArchive(entry)) return false;
  const target = extractedPathFor(entry);
  if (await fileExists(target)) return true;
  return false;
}

async function batchExtractImages(entries) {
  const unique = [...new Set(entries.filter(sourceIsLocalArchive))];
  const missing = [];
  for (const entry of unique) {
    if (!(await fileExists(extractedPathFor(entry)))) missing.push(entry);
  }
  if (!missing.length) return;
  await fsp.mkdir(extractedImageRoot, { recursive: true });
  try {
    await execFileAsync("tar", ["-xf", tarGzPath, "-C", extractedImageRoot, ...missing], {
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch (error) {
    const stderr = String(error?.stderr || "");
    const notFound = new Set(
      [...stderr.matchAll(/tar: (.+?): Not found in archive/g)].map((match) => match[1]),
    );
    const retry = missing.filter((entry) => !notFound.has(entry));
    if (retry.length && retry.length !== missing.length) {
      await execFileAsync("tar", ["-xf", tarGzPath, "-C", extractedImageRoot, ...retry], {
        maxBuffer: 20 * 1024 * 1024,
      });
    } else if (!notFound.size) {
      throw error;
    }
  }
}

async function ensureImageAsset(imageSource, altText) {
  const sourceId = `${SOURCE_NAME}:${imageSource}`;
  const existing = await client.fetch('*[_type == "sanity.imageAsset" && source.id == $sourceId][0]{_id}', { sourceId });
  if (existing?._id) return { assetId: existing._id, uploaded: false, reused: true };
  const extracted = await extractImage(imageSource);
  if (!extracted) return { assetId: "", uploaded: false, reused: false };
  const filePath = extractedPathFor(imageSource);
  const buffer = await fsp.readFile(filePath);
  const filename = path.basename(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    source: {
      id: sourceId,
      name: SOURCE_NAME,
      url: `legacy:${imageSource}`,
    },
    label: altText,
  });
  return { assetId: asset._id, uploaded: true, reused: false };
}

function riskFromRepairRow(row) {
  const combined = [
    row["legal safety status"],
    row["off-brand risk"],
    row["notes"],
    row["recommended next action"],
    row.title,
    row.slug,
  ]
    .join(" ")
    .toLowerCase();
  const risks = [];
  if (/off-brand|chaman properties|luxury|sales signal/.test(combined)) risks.push("off-brand/property-sales risk");
  if (/free-service|misleading free|free legal/.test(combined)) risks.push("misleading free-service risk");
  if (/plugin debris|shortcode|elementor/.test(combined)) risks.push("plugin debris risk");
  if (/self-help|unsafe|eviction/.test(combined)) risks.push("legal self-help/procedure risk");
  return risks;
}

function duplicateRisk(slug) {
  const highRisk = new Map([
    ["breach-of-property-contracts-in-lekki", "high - overlaps approved breach/remedies article"],
    ["real-estate-and-property-law", "high - broad practice-area duplicate"],
    ["can-a-foreigner-buy-property-chaman-law-firm", "medium - overlaps diaspora/property buyer content"],
    ["land-use-act-in-nigeria", "high - overlaps existing Land Use Act article and has legal-risk flag"],
    ["powerful-ways-on-property-ownership-in-nigeria", "medium - overlaps ownership/title guide content"],
    ["force-majeure-clauses-in-business-contracts", "medium - image/topic overlaps existing contract content"],
  ]);
  return highRisk.get(slug) || "low";
}

function titleFor(slug, fallback) {
  return titleOverrides.get(slug) || fallback;
}

function seoFor(slug, title) {
  return seoOverrides.get(slug) || {
    title: `${title} | Chaman Law Firm`,
    description: `Learn key Nigerian legal considerations on ${title}. Chaman Law Firm explains risk points and when to speak with a lawyer.`,
  };
}

function canonicalFor(slug) {
  return `${SITE_URL}/resources/blog/${slug}`;
}

function approvalBlockers({ row, imageAssetId, draft, selected }) {
  const blockers = [];
  const risks = riskFromRepairRow(row);
  blockers.push(...risks);
  if (!selected) blockers.push("not selected for Sprint 10T controlled batch");
  if (!draft) blockers.push("draft missing in Sanity");
  if (!bodyText(draft?.body).trim()) blockers.push("body missing");
  if (!draft?.seo?.metaTitle) blockers.push("SEO title missing");
  if (!draft?.seo?.metaDescription) blockers.push("meta description missing");
  if (!draft?.seo?.canonicalUrl) blockers.push("canonical missing");
  if (!imageAssetId) blockers.push("article-specific image missing");
  if (!Array.isArray(draft?.categories) || draft.categories.length === 0) blockers.push("category/practice relationship missing");
  if (!bodyHasConsultation(draft?.body)) blockers.push("consultation CTA missing");
  if (!bodyHasHref(draft?.body)) blockers.push("internal link missing");
  if (duplicateRisk(row.slug).startsWith("high")) blockers.push(duplicateRisk(row.slug));
  const publishedAt = draft?.publishedAt ? new Date(draft.publishedAt) : null;
  if (!publishedAt || Number.isNaN(publishedAt.valueOf())) blockers.push("publishedAt missing");
  if (publishedAt && publishedAt.getTime() > Date.now()) blockers.push("publishedAt future-dated");
  return blockers;
}

function buildApprovedDoc(draft, row, imageAssetId, altText) {
  const slug = row.slug;
  const title = titleFor(slug, draft.title || row.title);
  const seo = seoFor(slug, title);
  const body = sanitizeBody(draft.body || []);
  if (!hasLegalEducationFrame(body)) body.unshift(legalEducationBlock(slug));
  const mainImage = {
    _type: "image",
    asset: { _type: "reference", _ref: imageAssetId },
    alt: altText,
  };
  return {
    ...draft,
    _id: `${PUBLIC_PREFIX}${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    author: { _type: "reference", _ref: AUTHOR_ID },
    body,
    mainImage,
    lawFirmApproved: true,
    isFeatured: Boolean(draft.isFeatured),
    isTrending: Boolean(draft.isTrending),
    isMostRead: Boolean(draft.isMostRead),
    seo: {
      ...(draft.seo || {}),
      metaTitle: seo.title,
      metaDescription: seo.description,
      canonicalUrl: canonicalFor(slug),
      openGraphTitle: seo.title,
      openGraphDescription: seo.description,
      openGraphImage: mainImage,
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article",
    },
  };
}

async function main() {
  await fsp.mkdir(outDir, { recursive: true });
  const repairRows = await readCsv(sprint10sRepairPath);
  const imageRows = await readCsv(sprint10qImageMapPath);
  const imageBySlug = new Map(imageRows.map((row) => [row["old URL"].split("/").filter(Boolean).pop(), row]));
  const ids = repairRows.map((row) => `${DRAFT_PREFIX}${row.slug}`);
  const drafts = await client.fetch(
    `*[_type == "post" && _id in $ids]{
      _id,_createdAt,_updatedAt,title,slug,excerpt,author,publishedAt,body,categories,tags,lawFirmApproved,
      isFeatured,isTrending,isMostRead,
      mainImage{alt,asset->{_id}},
      seo
    }`,
    { ids },
  );
  const draftById = new Map(drafts.map((draft) => [draft._id, draft]));
  const publicBefore = await client.fetch('count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])');
  const imageSourcesToExtract = repairRows
    .filter((row) => uploadAllImages || controlledApprovalSlugs.has(row.slug))
    .map((row) => imageBySlug.get(row.slug))
    .filter((row) => row?.["image found yes/no"] === "yes")
    .map((row) => row["image source"])
    .filter(sourceIsLocalArchive);

  if (shouldApply) {
    await batchExtractImages(imageSourcesToExtract);
  }

  const imageResults = new Map();
  const approved = [];
  const keptHidden = [];
  const approvalRows = [];
  const imageCompletionRows = [];
  const legalRows = [];

  for (const row of repairRows) {
    const draftId = `${DRAFT_PREFIX}${row.slug}`;
    const draft = draftById.get(draftId);
    const imageRow = imageBySlug.get(row.slug) || {};
    const imageSource = imageRow["image source"] || "";
    const imageFound = imageRow["image found yes/no"] === "yes" && sourceIsLocalArchive(imageSource);
    const altText = `${titleFor(row.slug, row.title)} legal guide | Chaman Law Firm`;
    let imageResult = {
      assetId: draft?.mainImage?.asset?._id || "",
      uploaded: false,
      reused: Boolean(draft?.mainImage?.asset?._id),
    };

    if (
      imageFound &&
      !imageResult.assetId &&
      shouldApply &&
      token &&
      (uploadAllImages || controlledApprovalSlugs.has(row.slug))
    ) {
      imageResult = await ensureImageAsset(imageSource, altText);
    }
    imageResults.set(row.slug, imageResult);

    if (draft && imageResult.assetId && shouldApply && token) {
      const mainImage = {
        _type: "image",
        asset: { _type: "reference", _ref: imageResult.assetId },
        alt: altText,
      };
      await client.patch(draftId).set({
        title: titleFor(row.slug, draft.title || row.title),
        mainImage,
        lawFirmApproved: false,
        seo: {
          ...(draft.seo || {}),
          canonicalUrl: canonicalFor(row.slug),
          openGraphImage: mainImage,
          noIndex: false,
          robots: "index,follow",
          schemaType: "Article",
        },
      }).commit({ autoGenerateArrayKeys: true });
    }

    const selected = controlledApprovalSlugs.has(row.slug);
    const blockers = approvalBlockers({ row, imageAssetId: imageResult.assetId, draft, selected });
    const canApprove = selected && blockers.length === 0;

    if (canApprove && shouldApply && token) {
      const approvedDoc = buildApprovedDoc(draft, row, imageResult.assetId, altText);
      await client.createOrReplace(approvedDoc);
      await client.patch(draftId).set({ lawFirmApproved: true }).commit({ autoGenerateArrayKeys: true });
      approved.push({
        title: approvedDoc.title,
        slug: row.slug,
        oldUrl: row["old URL"],
        newUrl: `/resources/blog/${row.slug}`,
        imageAssetId: imageResult.assetId,
      });
    } else {
      keptHidden.push({
        title: titleFor(row.slug, row.title),
        slug: row.slug,
        oldUrl: row["old URL"],
        reason: blockers.join("; ") || "kept hidden pending manual review",
      });
    }

    approvalRows.push({
      title: titleFor(row.slug, row.title),
      slug: row.slug,
      "old URL": row["old URL"],
      "body status": row["body status"],
      "SEO title status": row["seo title status"],
      "meta description status": row["meta description status"],
      "canonical status": row["canonical status"],
      "image status": imageResult.assetId ? "present in Sanity" : "missing",
      "alt text status": imageResult.assetId ? "present" : "missing",
      "category/practice relationship": row["category status"],
      "CTA status": row["consultation CTA status"],
      "internal links status": row["internal link status"],
      "legal safety status": blockers.filter((blocker) => /risk|debris|unsafe|free-service|off-brand/.test(blocker)).join("; ") || "no automated legal blocker found",
      "duplicate/cannibalization risk": duplicateRisk(row.slug),
      "approval readiness": canApprove ? "approved in Sprint 10T" : "kept hidden",
      notes: canApprove ? "passed controlled approval gates" : blockers.join("; "),
    });

    imageCompletionRows.push({
      title: titleFor(row.slug, row.title),
      slug: row.slug,
      "old URL": row["old URL"],
      "image source": imageSource,
      "image found yes/no": imageFound ? "yes" : "no",
      "image uploaded to Sanity yes/no": imageResult.assetId ? (imageResult.uploaded ? "yes" : "already present/reused") : "no",
      "Sanity image asset reference": imageResult.assetId,
      "alt text": imageResult.assetId ? altText : "",
      "fallback used yes/no": "no",
      "repeated image risk": duplicateRisk(row.slug).includes("image") ? "yes" : "not detected",
      notes: imageResult.assetId
        ? "image attached to hidden draft; public only if approved"
        : imageFound
          ? "image evidence found; upload deferred because article stayed outside Sprint 10T controlled approval batch"
          : "image still requires recovery or approved fallback",
    });

    legalRows.push({
      title: titleFor(row.slug, row.title),
      slug: row.slug,
      "old URL": row["old URL"],
      "selected for approval": selected ? "yes" : "no",
      "cleanup action": canApprove ? "general-information framing added; public author enforced; unsafe/free/off-brand checks passed" : "kept hidden; no public legal cleanup approval",
      "risk findings": riskFromRepairRow(row).join("; ") || "no automated risk flag",
      "lawyer review status": canApprove ? "approved for preview/publication gate in Sprint 10T" : "lawyer review still required before approval",
      "final decision": canApprove ? "approve" : "keep hidden",
      notes: blockers.join("; "),
    });
  }

  const publicAfter = await client.fetch('count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])');

  await fsp.writeFile(
    approvalReviewPath,
    writeCsv(approvalRows, [
      "title",
      "slug",
      "old URL",
      "body status",
      "SEO title status",
      "meta description status",
      "canonical status",
      "image status",
      "alt text status",
      "category/practice relationship",
      "CTA status",
      "internal links status",
      "legal safety status",
      "duplicate/cannibalization risk",
      "approval readiness",
      "notes",
    ]),
    "utf8",
  );
  await fsp.writeFile(
    imageMapOutPath,
    writeCsv(imageCompletionRows, [
      "title",
      "slug",
      "old URL",
      "image source",
      "image found yes/no",
      "image uploaded to Sanity yes/no",
      "Sanity image asset reference",
      "alt text",
      "fallback used yes/no",
      "repeated image risk",
      "notes",
    ]),
    "utf8",
  );
  await fsp.writeFile(
    legalReviewPath,
    writeCsv(legalRows, [
      "title",
      "slug",
      "old URL",
      "selected for approval",
      "cleanup action",
      "risk findings",
      "lawyer review status",
      "final decision",
      "notes",
    ]),
    "utf8",
  );
  await fsp.writeFile(
    resultJsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        applied: shouldApply && Boolean(token),
        tokenDetected: Boolean(token),
        tokenPrinted: false,
        publicPostCountBefore: publicBefore,
        publicPostCountAfter: publicAfter,
        repairedDraftsReviewed: repairRows.length,
        imagesAttachedOrReused: imageCompletionRows.filter((row) => row["Sanity image asset reference"]).length,
        approvedCount: approved.length,
        approved,
        keptHidden,
        files: {
          approvalReviewPath,
          imageMapOutPath,
          legalReviewPath,
          resultJsonPath,
        },
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
    publicPostCountBefore: publicBefore,
    publicPostCountAfter: publicAfter,
    repairedDraftsReviewed: repairRows.length,
    imagesAttachedOrReused: imageCompletionRows.filter((row) => row["Sanity image asset reference"]).length,
    approvedCount: approved.length,
    approvedSlugs: approved.map((item) => item.slug),
    approvalReviewPath,
    imageMapOutPath,
    legalReviewPath,
    resultJsonPath,
  }, null, 2));
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
