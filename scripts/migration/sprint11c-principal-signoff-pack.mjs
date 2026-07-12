import fs from "node:fs";
import path from "node:path";

const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";
const SITE_URL = "https://chamanlawfirm.com";
const OUTPUT_DIR = "docs";
const DATE = "2026-07-13";

const signoffSlugs = [
  "can-a-landlord-increase-rent-arbitrarily-in-ogun",
  "challenges-of-implementing-the-land-use-act",
  "land-grabbing-the-legal-consequences-of",
  "property-how-to-place-a-caveat"
];

const allReviewSlugs = [
  ...signoffSlugs,
  "how-do-i-legally-evict-a-tenant-in-ogun-state",
  "void-and-voidable-marriages-in-nigeria",
  "certificate-of-occupancy-in-rivers-state",
  "how-to-calculate-stamp-duty-chaman-law-firm",
  "the-role-of-family-court-in-relation-to-child-protect-in-nigeria",
  "rights-of-a-property-owner-in-nigeria",
  "letters-of-administration-in-nigeria",
  "debt-recovery-lawyer-nigeria"
];

const candidateMeta = {
  "can-a-landlord-increase-rent-arbitrarily-in-ogun": {
    legalIssue: "Tenancy/current-law review",
    currentLawIssue: "Confirm Ogun tenancy and rent-increase position; remove any overbroad landlord/tenant advice.",
    duplicateIssue: "No stronger live duplicate found, but overlaps with tenancy-law education.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property and tenancy relationship present.",
    proposedCorrection: "Lawyer to confirm current-law framing, soften title wording, and add public-education disclaimer if needed.",
    seoTitle: "Can a Landlord Increase Rent Arbitrarily in Ogun State?",
    metaDescription: "Learn the legal considerations around rent increases in Ogun State, tenant rights, landlord obligations, and when to speak with a property lawyer.",
    internalLinks: "/practice-areas/property-real-estate-law; /practice-areas/litigation-dispute-resolution; /consultation",
    recommendedAction: "send for Principal sign-off; keep hidden until approved",
    decision: "approve as new article only after Principal sign-off"
  },
  "challenges-of-implementing-the-land-use-act": {
    legalIssue: "Land Use Act/current-law and policy-overstatement review",
    currentLawIssue: "Confirm current Land Use Act analysis and avoid unsupported legal or policy conclusions.",
    duplicateIssue: "High topical overlap with broader land-title and property-law articles; needs narrower angle.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property and Real Estate Law relationship present.",
    proposedCorrection: "Narrow to public legal education, clarify that implementation issues vary by state and facts, and add consultation CTA.",
    seoTitle: "Challenges of Implementing the Land Use Act in Nigeria",
    metaDescription: "A public legal education guide to common Land Use Act implementation challenges, title documentation issues, and when property owners should seek legal advice.",
    internalLinks: "/practice-areas/property-real-estate-law; /practice-areas/property-real-estate-law/property-verification; /consultation",
    recommendedAction: "send for Principal sign-off; keep hidden until approved",
    decision: "approve as new article only after Principal sign-off"
  },
  "land-grabbing-the-legal-consequences-of": {
    legalIssue: "Land-grabbing/current-law and overstatement review",
    currentLawIssue: "Confirm civil/criminal consequence wording and remove unsupported claims.",
    duplicateIssue: "Medium overlap with land-dispute and trespass content.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property and Real Estate Law relationship present.",
    proposedCorrection: "Expand thin body if needed, soften sweeping penalty language, and emphasize lawful remedies through counsel/court process.",
    seoTitle: "Legal Consequences of Land Grabbing in Nigeria",
    metaDescription: "Understand the legal risks of land grabbing in Nigeria, lawful remedies for property owners, and why early legal advice matters in land disputes.",
    internalLinks: "/practice-areas/property-real-estate-law; /practice-areas/litigation-dispute-resolution; /contact",
    recommendedAction: "send for Principal sign-off; keep hidden until approved",
    decision: "approve as new article only after Principal sign-off"
  },
  "property-how-to-place-a-caveat": {
    legalIssue: "Property title/procedure review",
    currentLawIssue: "Confirm caveat procedure and land registry practice before publication.",
    duplicateIssue: "Medium overlap with title-perfection and property-verification articles.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property title/perfection relationship present.",
    proposedCorrection: "Clarify caveat use-cases, procedure limits, jurisdiction sensitivity, and when a lawyer should review title risk.",
    seoTitle: "How to Place a Caveat on Property in Nigeria",
    metaDescription: "A practical legal education guide to property caveats in Nigeria, title protection, registry procedure, and when to consult a real estate lawyer.",
    internalLinks: "/practice-areas/property-real-estate-law; /practice-areas/property-real-estate-law/property-due-diligence; /consultation",
    recommendedAction: "send for Principal sign-off; keep hidden until approved",
    decision: "approve as new article only after Principal sign-off"
  },
  "how-do-i-legally-evict-a-tenant-in-ogun-state": {
    legalIssue: "Tenancy/current-law and self-help review",
    currentLawIssue: "Confirm notices and court process; remove any self-help implication.",
    duplicateIssue: "Overlaps with tenancy/eviction content.",
    imageIssue: "Unrelated image/alt mismatch found in Sprint 11A/11B.",
    altIssue: "Current alt references fixed vs periodic tenancy in Lagos.",
    categoryIssue: "Property and tenancy relationship present.",
    proposedCorrection: "Exclude from tiny pack until lawyer review and image replacement are complete.",
    decision: "keep hidden"
  },
  "void-and-voidable-marriages-in-nigeria": {
    legalIssue: "Family/marriage validity sensitivity review",
    currentLawIssue: "Confirm Matrimonial Causes Act/customary-law distinctions.",
    duplicateIssue: "Medium overlap with family-law education.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Family Law relationship present.",
    proposedCorrection: "Keep hidden until family-law sensitivity review is complete.",
    decision: "keep hidden"
  },
  "certificate-of-occupancy-in-rivers-state": {
    legalIssue: "C of O/current authority and duplicate review",
    currentLawIssue: "Confirm whether unique Rivers State content is needed.",
    duplicateIssue: "Public approved article already exists.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property title/perfection relationship present.",
    proposedCorrection: "Do not approve duplicate; merge unique regional value later if needed.",
    decision: "merge into existing live article"
  },
  "how-to-calculate-stamp-duty-chaman-law-firm": {
    legalIssue: "Stamp duty/current-rate review",
    currentLawIssue: "Confirm rates/current transactional guidance if ever revised.",
    duplicateIssue: "Public approved article already exists.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Property finance/stamp-duty relationship present.",
    proposedCorrection: "Do not approve duplicate; keep one canonical live page.",
    decision: "merge into existing live article"
  },
  "the-role-of-family-court-in-relation-to-child-protect-in-nigeria": {
    legalIssue: "Family/child-protection sensitivity review",
    currentLawIssue: "Sensitive child-protection content already has a public approved page.",
    duplicateIssue: "Public approved article already exists.",
    imageIssue: "No hard image issue found in Sprint 11B.",
    altIssue: "Alt appears relevant in Sprint 11B.",
    categoryIssue: "Family Law relationship present.",
    proposedCorrection: "Do not approve duplicate; keep single public version.",
    decision: "merge into existing live article"
  },
  "rights-of-a-property-owner-in-nigeria": {
    legalIssue: "Property-rights duplicate/source review",
    currentLawIssue: "Source content not found.",
    duplicateIssue: "High risk against existing property-rights/title pages.",
    imageIssue: "Source/image missing.",
    altIssue: "Alt missing.",
    categoryIssue: "Source missing.",
    proposedCorrection: "Recover source first.",
    decision: "recover source before decision"
  },
  "letters-of-administration-in-nigeria": {
    legalIssue: "Probate/current-procedure review",
    currentLawIssue: "Source content not found; probate procedure needs lawyer review.",
    duplicateIssue: "Medium overlap with probate/family-law content.",
    imageIssue: "Source/image missing.",
    altIssue: "Alt missing.",
    categoryIssue: "Source missing.",
    proposedCorrection: "Recover source first.",
    decision: "recover source before decision"
  },
  "debt-recovery-lawyer-nigeria": {
    legalIssue: "Service-page cannibalization and claims review",
    currentLawIssue: "Source content not found.",
    duplicateIssue: "Medium risk against debt-recovery service pages.",
    imageIssue: "Source/image missing.",
    altIssue: "Alt missing.",
    categoryIssue: "Source missing.",
    proposedCorrection: "Recover source first or convert to static/service page support content later.",
    decision: "convert to static/service page later"
  }
};

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

function bestDraft(drafts) {
  return [...drafts].sort((a, b) => {
    const score = (doc) =>
      (doc.hasBody ? 10 : 0) +
      Math.min(doc.bodyBlocks || 0, 100) +
      (doc.hasImage ? 20 : 0) +
      (doc.hasAlt ? 10 : 0) +
      (doc.seoTitle ? 5 : 0) +
      (doc.metaDescription ? 5 : 0) +
      (doc.canonical ? 5 : 0);
    return score(b) - score(a);
  })[0] || null;
}

function currentStatus(draft, publicDoc) {
  if (publicDoc) return `public approved overlap: ${publicDoc._id}`;
  if (draft) return `hidden draft: ${draft._id}`;
  return "not found in Sanity query";
}

function findFreshExports() {
  const patterns = [
    /gsc/i,
    /bing/i,
    /not[-_\s]?found/i,
    /404/i,
    /crawl/i,
    /index/i,
    /redirect/i,
    /page/i,
    /quer/i
  ];
  const found = [];
  const stack = ["docs"];
  while (stack.length) {
    const current = stack.pop();
    if (!fs.existsSync(current)) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (patterns.some((pattern) => pattern.test(full))) {
        const stat = fs.statSync(full);
        found.push({ file: full.replace(/\\/g, "/"), mtime: stat.mtime });
      }
    }
  }
  return found.sort((a, b) => b.mtime - a.mtime);
}

function hasSignoffEvidence() {
  const files = [];
  const stack = ["docs"];
  const exactStatus = /Principal sign-off status"?\s*[:,]\s*"?APPROVED"?/i;
  const exactNote = /SPRINT\s*11C[\s\S]{0,120}(APPROVED|approved)[\s\S]{0,120}(can-a-landlord-increase-rent-arbitrarily-in-ogun|challenges-of-implementing-the-land-use-act|land-grabbing-the-legal-consequences-of|property-how-to-place-a-caveat)/i;

  while (stack.length) {
    const current = stack.pop();
    if (!fs.existsSync(current)) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!/\.(csv|md|txt|json)$/i.test(full)) continue;
      const text = fs.readFileSync(full, "utf8");
      if (exactStatus.test(text) || exactNote.test(text)) {
        files.push(full.replace(/\\/g, "/"));
      }
    }
  }
  return files;
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
      "bodyBlockCount": count(body[_type == "block"])
    }`,
    { slugs: allReviewSlugs }
  );

  const bySlug = new Map(allReviewSlugs.map((slug) => [slug, { hidden: [], publicDocs: [] }]));
  for (const doc of docs) {
    const bucket = bySlug.get(doc.slug);
    if (!bucket) continue;
    if (doc._id.startsWith("drafts.")) bucket.hidden.push(doc);
    else if (doc.lawFirmApproved === true) bucket.publicDocs.push(doc);
  }

  const signoffEvidenceFilesBeforePack = hasSignoffEvidence();

  const signoffRows = signoffSlugs.map((slug) => {
    const meta = candidateMeta[slug];
    const bucket = bySlug.get(slug);
    const draft = bestDraft(bucket.hidden);
    const publicDoc = bucket.publicDocs[0] || null;
    const doc = draft || publicDoc;
    const title = doc?.title || meta.seoTitle;
    const canonical = `${SITE_URL}/resources/blog/${slug}`;
    return {
      title,
      slug,
      "old URL": `${SITE_URL}/${slug}/`,
      "current hidden/public status": currentStatus(draft, publicDoc),
      "legal issue": meta.legalIssue,
      "current-law issue": meta.currentLawIssue,
      "duplicate/cannibalization issue": meta.duplicateIssue,
      "image issue": meta.imageIssue,
      "alt-text issue": meta.altIssue,
      "category/practice issue": meta.categoryIssue,
      "proposed correction": meta.proposedCorrection,
      "proposed SEO title": meta.seoTitle,
      "proposed meta description": meta.metaDescription,
      "proposed canonical": canonical,
      "proposed CTA": "Book a consultation with Chaman Law Firm for matter-specific legal advice.",
      "proposed internal links": meta.internalLinks,
      "exact redirect source": `${SITE_URL}/${slug}/`,
      "recommended action": meta.recommendedAction,
      "Principal sign-off required": "YES",
      "Principal sign-off status": "PENDING",
      notes: `Do not approve until this exact slug is marked APPROVED by the Principal/lawyer. Current author: ${doc?.authorName || "not available"}. Body blocks: ${doc?.bodyBlocks ?? "not available"}.`
    };
  });

  const imageRows = signoffSlugs.map((slug) => {
    const meta = candidateMeta[slug];
    const bucket = bySlug.get(slug);
    const draft = bestDraft(bucket.hidden);
    const publicDoc = bucket.publicDocs[0] || null;
    const doc = draft || publicDoc;
    const title = doc?.title || meta.seoTitle;
    const relevant = imageAltRelevant(doc, slug, title);
    return {
      title,
      slug,
      "document checked": doc?._id || "not found",
      "Principal sign-off status": "PENDING",
      "image is relevant": relevant ? "yes" : "needs review",
      "image is not misleading": relevant ? "yes" : "needs manual review after sign-off",
      "no Chaman Properties sales/listing content": "no Chaman Properties image signal found in Sanity metadata reviewed",
      "no repeated generic principal image problem": "no repeated-principal-image signal found in Sanity metadata reviewed",
      "alt text accurately describes image and article topic": relevant ? "yes" : "needs review",
      "Sanity image reference is valid": doc?.hasImage ? "yes" : "no",
      "correction applied": "no",
      "correction status": "deferred - Principal sign-off not present",
      "live image check": "not applicable - no new approval"
    };
  });

  const duplicateRows = allReviewSlugs.map((slug) => {
    const meta = candidateMeta[slug];
    const bucket = bySlug.get(slug);
    const draft = bestDraft(bucket.hidden);
    const publicDoc = bucket.publicDocs[0] || null;
    return {
      title: draft?.title || publicDoc?.title || slug,
      slug,
      "old URL": `${SITE_URL}/${slug}/`,
      "current hidden/public status": currentStatus(draft, publicDoc),
      "duplicate/cannibalization issue": meta.duplicateIssue,
      decision: meta.decision,
      "redirect recommendation": publicDoc
        ? "possible later exact redirect to existing live target after dedicated redirect QA"
        : "no redirect while hidden/not approved",
      "approval readiness": signoffSlugs.includes(slug)
        ? "ready for Principal review only; not ready for publication"
        : "not selected for Sprint 11C tiny sign-off pack",
      notes: meta.proposedCorrection
    };
  });

  const signoffHeaders = [
    "title",
    "slug",
    "old URL",
    "current hidden/public status",
    "legal issue",
    "current-law issue",
    "duplicate/cannibalization issue",
    "image issue",
    "alt-text issue",
    "category/practice issue",
    "proposed correction",
    "proposed SEO title",
    "proposed meta description",
    "proposed canonical",
    "proposed CTA",
    "proposed internal links",
    "exact redirect source",
    "recommended action",
    "Principal sign-off required",
    "Principal sign-off status",
    "notes"
  ];
  const imageHeaders = [
    "title",
    "slug",
    "document checked",
    "Principal sign-off status",
    "image is relevant",
    "image is not misleading",
    "no Chaman Properties sales/listing content",
    "no repeated generic principal image problem",
    "alt text accurately describes image and article topic",
    "Sanity image reference is valid",
    "correction applied",
    "correction status",
    "live image check"
  ];
  const duplicateHeaders = [
    "title",
    "slug",
    "old URL",
    "current hidden/public status",
    "duplicate/cannibalization issue",
    "decision",
    "redirect recommendation",
    "approval readiness",
    "notes"
  ];

  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11C-PRINCIPAL-LEGAL-SIGNOFF-PACK.csv"), toCsv(signoffHeaders, signoffRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11C-IMAGE-ALT-CORRECTION.csv"), toCsv(imageHeaders, imageRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11C-DUPLICATE-CANNIBALIZATION-REVIEW.csv"), toCsv(duplicateHeaders, duplicateRows));

  const freshExports = findFreshExports();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11C-FRESH-GSC-BING-EXPORT-STATUS.md"),
    `# Sprint 11C Fresh GSC/Bing Export Status

Date: ${DATE}

## Result

No fresh post-launch Google Search Console or Bing Webmaster export was found locally during Sprint 11C.

The only local search export set still appears to be the known folder:

\`docs/search-console-exports/\`

Observed files there remain:

- \`Chart.csv\`
- \`Countries.csv\`
- \`Devices.csv\`
- \`Filters.csv\`
- \`Pages.csv\`
- \`Queries.csv\`
- \`Search appearance.csv\`

## Import Action

No fresh export was imported.

## Principal Action Required

Export the latest post-launch Google Search Console and Bing Webmaster data before the next search-monitoring sprint:

- Google Search Console Pages/Indexing.
- Google Not Found 404.
- Google Crawled Currently Not Indexed.
- Google Page With Redirect.
- Google Redirect Error.
- Google Performance Pages and Queries.
- Bing crawl/index errors.
- Bing sitemap/index warnings.

Do not submit hidden draft URLs.

## Local Matches Reviewed

${freshExports.slice(0, 20).map((entry) => `- \`${entry.file}\``).join("\n")}
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11C-CONTROLLED-APPROVAL-RESULT.md"),
    `# Sprint 11C Controlled Approval Result

Date: ${DATE}

## Result

No article was approved in Sprint 11C.

No redirect was activated in Sprint 11C.

## Sign-Off Evidence

No acceptable Principal/lawyer sign-off evidence was found before generating the Sprint 11C sign-off pack.

The generated sign-off pack deliberately sets every candidate to:

\`Principal sign-off status: PENDING\`

## Tiny Review Pack

The four safest candidates were selected for Principal review only:

- \`can-a-landlord-increase-rent-arbitrarily-in-ogun\`
- \`challenges-of-implementing-the-land-use-act\`
- \`land-grabbing-the-legal-consequences-of\`
- \`property-how-to-place-a-caveat\`

These are property/real-estate aligned, non-public-duplicate candidates with body, image, metadata, category, and author coverage in Sanity. They remain hidden until explicit sign-off is recorded.

## Exclusions

- Ogun eviction article remains excluded because legal review and image/alt correction are unresolved.
- Family/marriage article remains excluded because family-law sensitivity review is unresolved.
- Three duplicate/live-public overlaps remain excluded from new approval.
- Missing-source candidates remain excluded until source recovery.
`
  );

  console.log(JSON.stringify({
    signoffPackCandidates: signoffSlugs.length,
    allReviewSlugs: allReviewSlugs.length,
    sanityRecordsFound: docs.length,
    hiddenDraftRecordsFound: [...bySlug.values()].reduce((count, bucket) => count + bucket.hidden.length, 0),
    publicApprovedDuplicateOverlaps: [...bySlug.values()].filter((bucket) => bucket.publicDocs.length > 0).length,
    signoffEvidenceFilesBeforePack,
    approvalsRecommended: 0,
    redirectsActivated: 0,
    outputFiles: [
      "docs/SPRINT-11C-FRESH-GSC-BING-EXPORT-STATUS.md",
      "docs/SPRINT-11C-PRINCIPAL-LEGAL-SIGNOFF-PACK.csv",
      "docs/SPRINT-11C-IMAGE-ALT-CORRECTION.csv",
      "docs/SPRINT-11C-DUPLICATE-CANNIBALIZATION-REVIEW.csv",
      "docs/SPRINT-11C-CONTROLLED-APPROVAL-RESULT.md"
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
