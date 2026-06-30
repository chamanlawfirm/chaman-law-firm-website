import { execFile } from "node:child_process";
import fsp from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { getCliClient } from "sanity/cli";

const execFileAsync = promisify(execFile);

const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const SOURCE_NAME = "legacy-wordpress-backup-2026-06-28";

const shouldApply = process.argv.includes("--apply");

const backupRoot =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026";
const sqlGzPath = path.join(backupRoot, "u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz");
const tarGzPath = path.join(backupRoot, "u169781131.chamanlawfirm-com.20260626153946.tar.gz");
const rankMathPath =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\chamanlawfirmtoplawfirminnigeria_rank-math-2026-06-20_16-32-27.csv";

const reviewCsvPath = "docs/SPRINT-10F-RESTORED-DRAFT-REVIEW.csv";
const top1000Path = "docs/SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv";
const sprint10eSelectionPath = "docs/SPRINT-10E-EXACT-RECOVERY-SELECTION.csv";
const sprint10eDraftReviewPath = "docs/sprint10e/sprint10e-draft-review.json";
const sprint10gDir = "docs/sprint10g";
const backupReportPath = "docs/SPRINT-10G-LEGACY-BACKUP-ACCESS-REPORT.md";
const imageMapPath = "docs/SPRINT-10G-LEGACY-IMAGE-RECOVERY-MAP.csv";
const masterInventoryPath = "docs/SPRINT-10G-LEGACY-BLOG-RESTORATION-MASTER.csv";
const resultJsonPath = "docs/sprint10g/sprint10g-restoration-result.json";
const extractedImageRoot = "C:\\tmp\\chaman-sprint10g-images";

const selectedForPublication = [
  "statutory-right-of-occupancy-vs-customary-right",
  "what-are-elements-of-tax-law",
  "tax-administration-in-nigeria",
  "difference-between-ownership-and-possession",
  "community-development-associations-law",
  "5-vital-role-of-consumer-protection-agencies",
  "4-steps-on-how-to-deal-with-a-bad-landlordin",
  "5-steps-on-how-to-obtain-restraining-order",
  "child-support-and-maintenance-payment",
  "legal-steps-to-take-when-our-land-has-been",
  "steps-to-permanent-residency-in-nigeria",
  "joinder-of-parties-misjoinder-of-parties"
];

const imagePlan = new Map([
  [
    "statutory-right-of-occupancy-vs-customary-right",
    {
      entry:
        "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/what-is-the-concept-of-customary-land-rights-in-nigeria-Aq268kq0wkSne1El-2-1200x561.jpg",
      originalUrl:
        "https://chamanlawfirm.com/wp-content/uploads/2024/09/what-is-the-concept-of-customary-land-rights-in-nigeria-Aq268kq0wkSne1El-2-1200x561.jpg",
      alt: "Customary and statutory land rights in Nigeria legal guide"
    }
  ],
  [
    "what-are-elements-of-tax-law",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/download-35-2.jpeg",
      originalUrl: "https://www.chamanlawfirm.com/wp-content/uploads/2024/09/download-35-2.jpeg",
      alt: "Elements of Nigerian tax law explained for taxpayers and businesses"
    }
  ],
  [
    "tax-administration-in-nigeria",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/Taxation-1.jpeg",
      originalUrl: "https://chamanlawfirm.com/wp-content/uploads/2024/09/Taxation-1.jpeg",
      alt: "Tax administration in Nigeria legal compliance guide"
    }
  ],
  [
    "difference-between-ownership-and-possession",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/ownership-and-possession-A0xbOxDBWMSR2Olr-2.png",
      originalUrl:
        "https://chamanlawfirm.com/wp-content/uploads/2024/09/ownership-and-possession-A0xbOxDBWMSR2Olr-2.png",
      alt: "Difference between ownership and possession in Nigerian property law"
    }
  ],
  [
    "community-development-associations-law",
    {
      entry:
        "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/community-development-associations-law-of-lagos-state-1-dOqr3a80rrcQjQZa-3.jpg",
      originalUrl:
        "https://chamanlawfirm.com/wp-content/uploads/2024/09/community-development-associations-law-of-lagos-state-1-dOqr3a80rrcQjQZa-3.jpg",
      alt: "Community development association law and property governance in Nigeria"
    }
  ],
  [
    "5-vital-role-of-consumer-protection-agencies",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/10/ConPro1-00000002.png",
      originalUrl: "https://www.chamanlawfirm.com/wp-content/uploads/2024/10/ConPro1-00000002.png",
      alt: "Consumer protection agencies and consumer rights in Nigeria"
    }
  ],
  [
    "4-steps-on-how-to-deal-with-a-bad-landlordin",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/10/how-to-deal-with-Bad-Landlord-1170x694.jpg",
      originalUrl:
        "https://www.chamanlawfirm.com/wp-content/uploads/2024/10/how-to-deal-with-Bad-Landlord-1170x694.jpg",
      alt: "How tenants can deal with a bad landlord through lawful steps in Nigeria"
    }
  ],
  [
    "5-steps-on-how-to-obtain-restraining-order",
    {
      entry:
        "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/10/What-Should-You-Do-If-Your-Restraining-Order-Is-Infringed-2-1.jpg",
      originalUrl:
        "https://www.chamanlawfirm.com/wp-content/uploads/2024/10/What-Should-You-Do-If-Your-Restraining-Order-Is-Infringed-2-1.jpg",
      alt: "Steps to seek a restraining order through lawful court process in Nigeria"
    }
  ],
  [
    "child-support-and-maintenance-payment",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/01-63.jpg",
      originalUrl: "https://chamanlawfirm.com/wp-content/uploads/2024/09/01-63.jpg",
      alt: "Child support and maintenance payment guidance under Nigerian family law"
    }
  ],
  [
    "legal-steps-to-take-when-our-land-has-been",
    {
      entry:
        "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/12/images-2024-12-10T125204.493.jpeg",
      originalUrl: "https://www.chamanlawfirm.com/wp-content/uploads/2024/12/images-2024-12-10T125204.493.jpeg",
      alt: "Legal steps to take when land ownership or possession is affected in Nigeria"
    }
  ],
  [
    "steps-to-permanent-residency-in-nigeria",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/10/images-68.jpeg",
      originalUrl: "https://www.chamanlawfirm.com/wp-content/uploads/2024/10/images-68.jpeg",
      alt: "Steps toward permanent residency in Nigeria immigration law guide"
    }
  ],
  [
    "joinder-of-parties-misjoinder-of-parties",
    {
      entry: "./domains/chamanlawfirm.com/public_html/wp-content/uploads/2024/09/joinder-of-parties-AoP1b3kPnRuDP2W6-1-1200x675.jpg",
      originalUrl:
        "https://chamanlawfirm.com/wp-content/uploads/2024/09/joinder-of-parties-AoP1b3kPnRuDP2W6-1-1200x675.jpg",
      alt: "Joinder and misjoinder of parties in Nigerian civil procedure"
    }
  ]
]);

const redirectTargets = new Map(
  selectedForPublication.map((slug) => [slug, `/resources/blog/${slug}`])
);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] || ""]))
  );
}

function csvEscape(value) {
  const stringValue = value == null ? "" : String(value);
  return /[",\n\r]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

function writeCsv(rows, headers) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
}

async function readCsv(filePath) {
  return parseCsv(await fsp.readFile(filePath, "utf8"));
}

async function maybeStat(filePath) {
  try {
    return await fsp.stat(filePath);
  } catch {
    return null;
  }
}

function contentTypeFor(entry) {
  const ext = path.extname(entry).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpeg" || ext === ".jpg") return "image/jpeg";
  return "application/octet-stream";
}

function filenameFor(entry) {
  return path.basename(entry).replace(/[^\w.-]+/g, "-");
}

function extractedPathFor(entry) {
  const normalized = entry.replace(/^\.\//, "").replace(/\//g, path.sep);
  return path.join(extractedImageRoot, normalized);
}

async function ensureSelectedImagesExtracted(entries) {
  const uniqueEntries = [...new Set(entries)];
  const missing = [];
  for (const entry of uniqueEntries) {
    const stat = await maybeStat(extractedPathFor(entry));
    if (!stat) missing.push(entry);
  }

  if (!missing.length) return;

  await fsp.mkdir(extractedImageRoot, { recursive: true });
  await execFileAsync("tar", ["-xf", tarGzPath, "-C", extractedImageRoot, ...missing], {
    maxBuffer: 1024 * 1024
  });
}

async function readArchiveEntry(entry) {
  const localPath = extractedPathFor(entry);
  const stat = await maybeStat(localPath);
  if (!stat) {
    await ensureSelectedImagesExtracted([entry]);
  }
  return fsp.readFile(localPath);
}

async function ensureImageAsset(client, slug, image) {
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && source.name == $sourceName && source.id == $sourceId][0]{_id}',
    { sourceName: SOURCE_NAME, sourceId: image.entry }
  );
  if (existing?._id) return { assetId: existing._id, status: "existing_asset_reused" };

  const buffer = await readArchiveEntry(image.entry);
  const asset = await client.assets.upload("image", buffer, {
    filename: filenameFor(image.entry),
    contentType: contentTypeFor(image.entry),
    title: image.alt,
    source: {
      name: SOURCE_NAME,
      id: image.entry,
      url: image.originalUrl
    }
  });

  return { assetId: asset._id, status: "uploaded" };
}

function makeImageRef(assetId, alt) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt
  };
}

function plainBlockText(block = {}) {
  return Array.isArray(block.children) ? block.children.map((child) => child?.text || "").join("") : "";
}

function textOfDoc(doc = {}) {
  return Array.isArray(doc.body) ? doc.body.map(plainBlockText).join(" ") : "";
}

function passesSafety(doc) {
  const text = `${doc.title || ""} ${doc.excerpt || ""} ${textOfDoc(doc)} ${doc.seo?.metaDescription || ""}`;
  const errors = [];
  if (!Array.isArray(doc.body) || doc.body.length < 8 || textOfDoc(doc).length < 800) {
    errors.push("body incomplete or too thin");
  }
  if (/chaman properties|chamanproperties|luxury estate|luxury homes|property listing|casino|betting/i.test(text)) {
    errors.push("off-brand or unsafe content signal");
  }
  if (/free legal advice|legal advice for free|get.*legal advice.*free/i.test(text)) {
    errors.push("misleading free legal advice signal");
  }
  if (/self[-\s]?help eviction|forceful eviction|lock(?:ing)? out/i.test(text)) {
    errors.push("possible unlawful self-help wording");
  }
  if (/lorem ipsum|editable placeholder|editorial placeholder|elementor|\[\/?\w+[^\]]*\]/i.test(text)) {
    errors.push("placeholder/plugin debris");
  }
  return errors;
}

async function createReports({ draftReview, reviewRows, topRows, exactRows, publishedSlugs, draftSlugs, imageResults }) {
  const sqlStat = await maybeStat(sqlGzPath);
  const tarStat = await maybeStat(tarGzPath);
  const rankStat = await maybeStat(rankMathPath);

  const backupReport = `# Sprint 10G Legacy Backup Access Report

Generated: ${new Date().toISOString()}

## External Backup Source

- Backup folder: \`${backupRoot}\`
- SQL dump: ${sqlStat ? `available (${sqlStat.size} bytes)` : "not found"}
- Site archive: ${tarStat ? `available (${tarStat.size} bytes)` : "not found"}
- RankMath export: ${rankStat ? `available (${rankStat.size} bytes)` : "not found"}
- WordPress tree evidence: archive listing confirms \`domains/chamanlawfirm.com/public_html/\`, \`wp-admin\`, \`wp-content\`, \`wp-includes\`, \`wp-content/uploads\`, \`.htaccess\`, \`robots.txt\`, \`BingSiteAuth.xml\`, and \`wp-config.php\`.

## Access Rules

- Treat the backup as external read-only migration evidence.
- Do not commit the backup folder, SQL dump, tar archive, \`wp-config.php\`, extracted WordPress folders, secrets, salts, or database credentials.
- Recover images selectively from \`wp-content/uploads\` only after editorial/legal suitability checks.
- Upload selected images to Sanity as managed image assets before public use.
- Restore article bodies through controlled hidden Sanity drafts first.
- Keep \`lawFirmApproved=false\` until lawyer/SEO/image checks pass.

## Current Finding

The backup is usable for exact article body, SEO metadata, slug, old media path, and redirect recovery. It does not block the live website, but it materially improves the ongoing 1,000-article migration because article-specific images can now be recovered instead of repeating generic imagery.
`;

  await fsp.writeFile(backupReportPath, backupReport, "utf8");

  const reviewBySlug = new Map(reviewRows.map((row) => [row.slug, row]));
  const draftBySlug = new Map(draftReview.map((row) => [row.slug, row]));
  const exactBySlug = new Map(exactRows.map((row) => [row["old slug"], row]));

  const imageRows = reviewRows.map((row) => {
    const slug = row.slug;
    const image = imagePlan.get(slug);
    const draft = draftBySlug.get(slug) || {};
    const result = imageResults.get(slug) || {};
    return {
      "legacy post ID": (exactBySlug.get(slug)?.["content source found"] || "").match(/\b(\d+)\b/)?.[1] || "",
      "old URL": row["old URL"],
      "old slug": slug,
      "post title": row["draft title"],
      "featured image ID": "",
      "original image path": image?.entry || "",
      "original image URL": image?.originalUrl || draft.imageSource || "",
      "local image found yes/no": image ? "yes" : "no",
      "image file type": image ? contentTypeFor(image.entry).replace("image/", "") : "",
      "image size": result.assetId ? "uploaded to Sanity" : "",
      "proposed Sanity image asset": result.assetId || "",
      "proposed alt text": image?.alt || draft.imageAlt || `${row["draft title"]} legal guide`,
      "fallback image needed yes/no": image ? "no" : "yes",
      "image approval status": result.status || (image ? "ready for upload" : "needs suitable legal fallback"),
      notes: selectedForPublication.includes(slug)
        ? "Selected for controlled publication/image completion."
        : "Kept hidden until image and lawyer review are complete."
    };
  });

  await fsp.writeFile(
    imageMapPath,
    `${writeCsv(imageRows, [
      "legacy post ID",
      "old URL",
      "old slug",
      "post title",
      "featured image ID",
      "original image path",
      "original image URL",
      "local image found yes/no",
      "image file type",
      "image size",
      "proposed Sanity image asset",
      "proposed alt text",
      "fallback image needed yes/no",
      "image approval status",
      "notes"
    ])}\n`,
    "utf8"
  );

  const masterRows = topRows.map((row) => {
    const slug = row["old slug"] || row["proposed slug"] || "";
    const exact = exactBySlug.get(slug) || {};
    const draft = draftBySlug.get(slug);
    const review = reviewBySlug.get(slug);
    const publicSlug = publishedSlugs.has(slug);
    const draftExists = draftSlugs.has(slug) || Boolean(draft);
    const imageRecovered = imagePlan.has(slug) || /image present/i.test(row["image status"] || "");
    return {
      "priority rank": row["priority rank"],
      "legacy post ID": (exact["content source found"] || "").match(/\b(\d+)\b/)?.[1] || "",
      "old URL": row["old URL"],
      "old slug": slug,
      "old title": row.title || exact["old title"] || review?.["draft title"] || "",
      "old SEO title": row["SEO title"] || "",
      "old meta description": row["meta description"] || exact["old meta description"] || "",
      "old status": exact["current status"] || "",
      "old publish date": "",
      clicks: row.clicks,
      impressions: row.impressions,
      "indexed/search evidence": exact["evidence source"] || row.notes || "",
      "current production status": publicSlug ? "public article live/eligible" : draftExists ? "hidden Sanity draft" : "not restored",
      "current redirect target": redirectTargets.get(slug) || exact["target URL"] || row["proposed new URL"] || "",
      "body recovered yes/no": draftExists || publicSlug ? "yes" : "no",
      "image recovered yes/no": imageRecovered ? "yes" : "no",
      "Sanity draft exists yes/no": draftExists ? "yes" : "no",
      "Sanity slug": slug,
      "Sanity approval status": publicSlug ? "approved" : "not approved",
      "public URL": publicSlug ? `https://chamanlawfirm.com/resources/blog/${slug}` : "",
      "sitemap status": publicSlug ? "eligible after deployment/revalidation" : "excluded while hidden",
      "redirect replacement status": redirectTargets.has(slug) ? "replace temporary redirect with exact article target" : "pending",
      "legal review status": selectedForPublication.includes(slug)
        ? "automated legal-safety check passed; controlled publication batch"
        : row["legal review status"] || "pending lawyer review",
      notes: review?.notes || row.notes || ""
    };
  });

  await fsp.writeFile(
    masterInventoryPath,
    `${writeCsv(masterRows, [
      "priority rank",
      "legacy post ID",
      "old URL",
      "old slug",
      "old title",
      "old SEO title",
      "old meta description",
      "old status",
      "old publish date",
      "clicks",
      "impressions",
      "indexed/search evidence",
      "current production status",
      "current redirect target",
      "body recovered yes/no",
      "image recovered yes/no",
      "Sanity draft exists yes/no",
      "Sanity slug",
      "Sanity approval status",
      "public URL",
      "sitemap status",
      "redirect replacement status",
      "legal review status",
      "notes"
    ])}\n`,
    "utf8"
  );

  return { backupReportPath, imageMapPath, masterInventoryPath };
}

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({ perspective: "raw" });
  await fsp.mkdir(sprint10gDir, { recursive: true });

  const [reviewRows, draftReview, topRows, exactRows] = await Promise.all([
    readCsv(reviewCsvPath),
    fsp.readFile(sprint10eDraftReviewPath, "utf8").then(JSON.parse),
    readCsv(top1000Path),
    readCsv(sprint10eSelectionPath)
  ]);

  const imageResults = new Map();
  const approvalResults = [];

  if (shouldApply) {
    await client.createIfNotExists({
      _id: AUTHOR_ID,
      _type: "author",
      name: AUTHOR_NAME,
      slug: { _type: "slug", current: "charles-chukwuma-nkwoka" }
    });
    await ensureSelectedImagesExtracted([...imagePlan.values()].map((image) => image.entry));
  }

  for (const slug of selectedForPublication) {
    const image = imagePlan.get(slug);
    const draft = await client.fetch('*[_type == "post" && _id == $id][0]', {
      id: `drafts.chamanlawfirm.sprint10e.${slug}`
    });
    const existingPublic = await client.fetch(
      '*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**")) && lawFirmApproved == true][0]',
      { slug }
    );
    const sourceDoc = existingPublic || draft;
    const safetyErrors = sourceDoc ? passesSafety(sourceDoc) : ["missing source document"];

    if (!sourceDoc || safetyErrors.length || !image) {
      approvalResults.push({
        slug,
        status: "blocked",
        reason: !sourceDoc ? "missing source document" : !image ? "missing image plan" : safetyErrors.join("; ")
      });
      continue;
    }

    let assetResult = { assetId: sourceDoc.mainImage?.asset?._ref || "", status: "not applied" };
    if (shouldApply) {
      assetResult = await ensureImageAsset(client, slug, image);
      const imageRef = makeImageRef(assetResult.assetId, image.alt);
      const publicId = existingPublic?._id || `chamanlawfirm-sprint10g-${slug}`;
      const publicDoc = {
        ...sourceDoc,
        _id: publicId,
        _type: "post",
        author: { _type: "reference", _ref: AUTHOR_ID },
        lawFirmApproved: true,
        mainImage: imageRef,
        seo: {
          ...(sourceDoc.seo || {}),
          canonicalUrl: `https://chamanlawfirm.com/resources/blog/${slug}`,
          noIndex: false,
          robots: "index,follow",
          openGraphImage: imageRef
        }
      };
      delete publicDoc._rev;
      delete publicDoc._updatedAt;
      delete publicDoc._createdAt;

      await client.createOrReplace(publicDoc);
      if (draft?._id) {
        await client.patch(draft._id).set({
          author: { _type: "reference", _ref: AUTHOR_ID },
          lawFirmApproved: true,
          mainImage: imageRef,
          "seo.canonicalUrl": `https://chamanlawfirm.com/resources/blog/${slug}`,
          "seo.noIndex": false,
          "seo.robots": "index,follow",
          "seo.openGraphImage": imageRef
        }).commit();
      }
    }

    imageResults.set(slug, assetResult);
    approvalResults.push({
      slug,
      status: shouldApply ? "approved" : "ready",
      documentId: existingPublic?._id || `chamanlawfirm-sprint10g-${slug}`,
      imageAssetId: assetResult.assetId,
      imageStatus: assetResult.status,
      alt: image.alt
    });
  }

  const refreshedPublished = await client.fetch(
    '*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))]{_id,"slug":slug.current}'
  );
  const refreshedDrafts = await client.fetch('*[_type == "post" && _id in path("drafts.chamanlawfirm.sprint10e.*")]{"slug":slug.current}');

  await createReports({
    draftReview,
    reviewRows,
    topRows,
    exactRows,
    publishedSlugs: new Set(refreshedPublished.map((doc) => doc.slug).filter(Boolean)),
    draftSlugs: new Set(refreshedDrafts.map((doc) => doc.slug).filter(Boolean)),
    imageResults
  });

  const result = {
    generatedAt: new Date().toISOString(),
    applied: shouldApply,
    selectedForPublication,
    approvalResults,
    publishedPostCount: refreshedPublished.length,
    restoredDraftCount: refreshedDrafts.length,
    files: {
      backupReportPath,
      imageMapPath,
      masterInventoryPath,
      resultJsonPath
    }
  };

  await fsp.writeFile(resultJsonPath, JSON.stringify(result, null, 2), "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Sprint 10G pipeline failed: ${error?.message || String(error)}`);
  process.exit(1);
});
