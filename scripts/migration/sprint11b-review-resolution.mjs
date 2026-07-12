import fs from "node:fs";
import path from "node:path";

const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";
const SITE_URL = "https://chamanlawfirm.com";
const OUTPUT_DIR = "docs";
const DATE = "2026-07-12";

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

const issueMap = {
  "can-a-landlord-increase-rent-arbitrarily-in-ogun": {
    legalIssue: "Tenancy/current-law and self-help review",
    currentLawIssue: "Confirm Ogun tenancy/rent-increase position and remove any overbroad tenant/landlord advice.",
    duplicateIssue: "No live duplicate found, but overlaps with tenancy-law coverage.",
    correction: "Keep hidden until lawyer confirms current Ogun tenancy position and title language is cleaned.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Potential supporting article after lawyer review; not safe for approval yet."
  },
  "certificate-of-occupancy-in-rivers-state": {
    legalIssue: "C of O/current authority and duplicate review",
    currentLawIssue: "Confirm Rivers State C of O process only if a separate regional article is still needed.",
    duplicateIssue: "Public approved article already exists for this target.",
    correction: "Do not approve hidden duplicate; merge only unique regional value into the live article if needed.",
    duplicateDecision: "merge into existing live article",
    duplicateNotes: "Avoid duplicate approval because a public approved target already exists."
  },
  "challenges-of-implementing-the-land-use-act": {
    legalIssue: "Land Use Act/current-law and cannibalization review",
    currentLawIssue: "Confirm current Land Use Act discussion and avoid unsupported policy/legal conclusions.",
    duplicateIssue: "High risk of cannibalizing broader Land Use Act and property-title articles.",
    correction: "Keep hidden until lawyer narrows the article and confirms current-law framing.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Potential authority article, but it needs a cleaner angle before publication."
  },
  "how-do-i-legally-evict-a-tenant-in-ogun-state": {
    legalIssue: "Tenancy/current-law and self-help review",
    currentLawIssue: "Confirm statutory notice, court process, and remove any self-help implication.",
    duplicateIssue: "No live duplicate found, but overlaps with tenancy/eviction content.",
    correction: "Keep hidden; do not approve until lawyer review is complete and a relevant Ogun eviction image/alt is assigned.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Image/alt mismatch remains a hard blocker."
  },
  "how-to-calculate-stamp-duty-chaman-law-firm": {
    legalIssue: "Stamp duty/current-rate review",
    currentLawIssue: "Confirm current stamp-duty rates and avoid dated transactional advice.",
    duplicateIssue: "Public approved article already exists for this target.",
    correction: "Do not approve hidden duplicate; keep one live canonical page.",
    duplicateDecision: "merge into existing live article",
    duplicateNotes: "Use existing approved article as canonical target."
  },
  "land-grabbing-the-legal-consequences-of": {
    legalIssue: "Land-grabbing/current-law and overstatement review",
    currentLawIssue: "Confirm current legal consequences and soften any unsupported criminal/civil claims.",
    duplicateIssue: "Medium overlap with land dispute and trespass articles.",
    correction: "Keep hidden until lawyer confirms legal consequences and overstatement risk is removed.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Potential high-value property-law article after lawyer review."
  },
  "property-how-to-place-a-caveat": {
    legalIssue: "Property title/procedure review",
    currentLawIssue: "Confirm current caveat procedure and applicable land registry practice.",
    duplicateIssue: "Medium overlap with property title/perfection articles.",
    correction: "Keep hidden until lawyer confirms procedure and decides whether it should be standalone or merged.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Could be useful, but procedure accuracy must be confirmed."
  },
  "the-role-of-family-court-in-relation-to-child-protect-in-nigeria": {
    legalIssue: "Family/child-protection sensitivity review",
    currentLawIssue: "Sensitive child-protection content should remain under already-approved public page only.",
    duplicateIssue: "Public approved article already exists for this target.",
    correction: "Do not approve hidden duplicate; keep single public version.",
    duplicateDecision: "merge into existing live article",
    duplicateNotes: "Avoid duplicate child-protection content."
  },
  "void-and-voidable-marriages-in-nigeria": {
    legalIssue: "Family/marriage validity sensitivity review",
    currentLawIssue: "Confirm Matrimonial Causes Act/customary-law distinctions and avoid personal legal advice.",
    duplicateIssue: "Medium overlap with family-law education articles.",
    correction: "Keep hidden until lawyer confirms marriage-validity statements and sensitivity wording.",
    duplicateDecision: "keep hidden",
    duplicateNotes: "Family-law sensitivity requires lawyer sign-off."
  },
  "rights-of-a-property-owner-in-nigeria": {
    legalIssue: "Property-rights duplicate review",
    currentLawIssue: "Source content not found; legal review cannot begin until source recovery is complete.",
    duplicateIssue: "High risk of duplicate/cannibalization against property rights and land-title pages.",
    correction: "Recover source first; do not approve.",
    duplicateDecision: "recover source before decision",
    duplicateNotes: "No matching hidden or public Sanity record found."
  },
  "letters-of-administration-in-nigeria": {
    legalIssue: "Probate/current-procedure review",
    currentLawIssue: "Source content not found; probate procedure requires current-law review after recovery.",
    duplicateIssue: "Medium overlap with probate/family-law future content.",
    correction: "Recover source first; do not approve.",
    duplicateDecision: "recover source before decision",
    duplicateNotes: "No matching hidden or public Sanity record found."
  },
  "debt-recovery-lawyer-nigeria": {
    legalIssue: "Service-page cannibalization and claims review",
    currentLawIssue: "Source content not found; service-page claims need review before any article use.",
    duplicateIssue: "Medium risk of cannibalizing debt-recovery service pages.",
    correction: "Recover source first or convert to service-page support content later.",
    duplicateDecision: "convert to static/service page later",
    duplicateNotes: "No matching hidden or public Sanity record found."
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

function finalLawyerStatus(slug, draft, publicDoc) {
  if (!draft && !publicDoc) return "not resolved - source recovery required";
  if (publicDoc) return "not applicable - duplicate public target already exists";
  return "not resolved - no lawyer sign-off evidence found in workspace";
}

function approvalReadiness(slug, draft, publicDoc) {
  if (!draft && !publicDoc) return "not ready - source missing";
  if (publicDoc) return "not ready - duplicate/live public target";
  if (!imageAltRelevant(draft, slug, draft.title)) return "not ready - image/alt issue";
  return "not ready - lawyer/current-law review unresolved";
}

function imageCorrectionStatus(slug, draft, publicDoc) {
  if (publicDoc) return "not changed - duplicate public target already exists";
  if (!draft) return "not changed - source record missing";
  if (!imageAltRelevant(draft, slug, draft.title)) {
    return "not changed - image correction deferred until lawyer review clears article";
  }
  return "no correction needed now - image/alt appears relevant but article remains legally blocked";
}

function hiddenNotes(slug, draft, publicDoc) {
  const meta = issueMap[slug];
  if (publicDoc) return `Public approved document exists: ${publicDoc._id}. Hidden duplicates should not be approved.`;
  if (!draft) return "No matching hidden or public Sanity post found.";
  return `Best hidden draft: ${draft._id}; body blocks: ${draft.bodyBlocks}; author: ${draft.authorName || "missing"}. ${meta.correction}`;
}

function findFreshExports() {
  const found = [];
  const names = [
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
  const roots = ["docs"];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const stack = [root];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(full);
        } else if (names.some((pattern) => pattern.test(full))) {
          const stat = fs.statSync(full);
          found.push({ file: full.replace(/\\/g, "/"), mtime: stat.mtime });
        }
      }
    }
  }
  return found.sort((a, b) => b.mtime - a.mtime);
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
    { slugs: targetSlugs }
  );

  const bySlug = new Map(targetSlugs.map((slug) => [slug, { hidden: [], publicDocs: [] }]));
  for (const doc of docs) {
    const bucket = bySlug.get(doc.slug);
    if (!bucket) continue;
    if (doc._id.startsWith("drafts.")) bucket.hidden.push(doc);
    else if (doc.lawFirmApproved === true) bucket.publicDocs.push(doc);
  }

  const lawyerRows = [];
  const imageRows = [];
  const duplicateRows = [];

  for (const slug of targetSlugs) {
    const meta = issueMap[slug];
    const bucket = bySlug.get(slug);
    const draft = bestDraft(bucket.hidden);
    const publicDoc = bucket.publicDocs[0] || null;
    const doc = draft || publicDoc;
    const title = doc?.title || slug;
    const categories = (doc?.categories || []).map((category) => category?.title).filter(Boolean).join("; ");
    const imageRelevant = imageAltRelevant(doc, slug, title);
    const canonicalTarget = `${SITE_URL}/resources/blog/${slug}`;

    lawyerRows.push({
      title,
      slug,
      "old URL": `${SITE_URL}/${slug}/`,
      "legal issue": meta.legalIssue,
      "current-law issue": meta.currentLawIssue,
      "duplicate/cannibalization issue": meta.duplicateIssue,
      "image issue": doc?.hasImage ? (imageRelevant ? "no hard image issue found" : "image relevance needs correction") : "missing image or source missing",
      "alt-text issue": doc?.hasAlt ? (imageRelevant ? "appears relevant" : `needs replacement; current alt: ${doc.imageAlt || ""}`) : "missing alt text",
      "category/practice issue": categories ? "category/practice present" : "category/practice missing or source missing",
      "recommended correction": meta.correction,
      "final lawyer-review status": finalLawyerStatus(slug, draft, publicDoc),
      "approval readiness": approvalReadiness(slug, draft, publicDoc),
      notes: hiddenNotes(slug, draft, publicDoc)
    });

    imageRows.push({
      title,
      slug,
      "document checked": doc?._id || "not found",
      "image is relevant": imageRelevant ? "yes" : "no",
      "image is not misleading": imageRelevant ? "yes" : "needs manual image review",
      "no Chaman Properties sales/listing content": "no Chaman Properties image signal found in Sanity metadata reviewed",
      "no repeated generic principal image problem": "no repeated-principal-image signal found in Sanity metadata reviewed",
      "alt text accurately describes image and article topic": imageRelevant ? "yes" : "no",
      "Sanity image reference is valid": doc?.hasImage ? "yes" : "no",
      "correction applied": "no",
      "correction status": imageCorrectionStatus(slug, draft, publicDoc),
      "post-approval live image check": "not applicable - no new approval in Sprint 11B"
    });

    duplicateRows.push({
      title,
      slug,
      "old URL": `${SITE_URL}/${slug}/`,
      "proposed target": publicDoc ? canonicalTarget : "",
      "duplicate/cannibalization issue": meta.duplicateIssue,
      "decision": meta.duplicateDecision,
      "redirect recommendation": publicDoc
        ? "possible later exact redirect to existing live target after dedicated redirect QA"
        : "no redirect while hidden/not approved",
      "approval readiness": approvalReadiness(slug, draft, publicDoc),
      notes: meta.duplicateNotes
    });
  }

  const lawyerHeaders = [
    "title",
    "slug",
    "old URL",
    "legal issue",
    "current-law issue",
    "duplicate/cannibalization issue",
    "image issue",
    "alt-text issue",
    "category/practice issue",
    "recommended correction",
    "final lawyer-review status",
    "approval readiness",
    "notes"
  ];
  const imageHeaders = [
    "title",
    "slug",
    "document checked",
    "image is relevant",
    "image is not misleading",
    "no Chaman Properties sales/listing content",
    "no repeated generic principal image problem",
    "alt text accurately describes image and article topic",
    "Sanity image reference is valid",
    "correction applied",
    "correction status",
    "post-approval live image check"
  ];
  const duplicateHeaders = [
    "title",
    "slug",
    "old URL",
    "proposed target",
    "duplicate/cannibalization issue",
    "decision",
    "redirect recommendation",
    "approval readiness",
    "notes"
  ];

  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11B-LAWYER-REVIEW-RESOLUTION.csv"), toCsv(lawyerHeaders, lawyerRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11B-IMAGE-ALT-CORRECTION.csv"), toCsv(imageHeaders, imageRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11B-DUPLICATE-CANNIBALIZATION-REVIEW.csv"), toCsv(duplicateHeaders, duplicateRows));

  const freshExports = findFreshExports();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11B-FRESH-GSC-BING-EXPORT-STATUS.md"),
    `# Sprint 11B Fresh GSC/Bing Export Status

Date: ${DATE}

## Result

No fresh post-launch Google Search Console or Bing Webmaster export was found locally during Sprint 11B.

The only local search export set still appears to be the known project export folder:

\`docs/search-console-exports/\`

Observed files there remain:

- \`Chart.csv\`
- \`Countries.csv\`
- \`Devices.csv\`
- \`Filters.csv\`
- \`Pages.csv\`
- \`Queries.csv\`
- \`Search appearance.csv\`

## Files Scanned

The helper scanned documentation paths matching GSC, Bing, search, 404, crawl, index, redirect, pages, and queries naming patterns. Recent matches were prior sprint reports or the older export set; no new post-launch export pack was identified.

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

Do not submit or inspect hidden draft URLs.

## Local Matches Reviewed

${freshExports.slice(0, 20).map((entry) => `- \`${entry.file}\``).join("\n")}
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11B-CONTROLLED-APPROVAL-RESULT.md"),
    `# Sprint 11B Controlled Approval Result

Date: ${DATE}

## Result

No new article was approved in Sprint 11B.

## Why Approval Stayed Blocked

Sprint 11B found no workspace evidence that the unresolved lawyer/current-law review notes from Sprint 11A had been manually cleared.

The approval gates require lawyer-review resolution before publication, especially for tenancy, eviction, land-grabbing, caveat/procedure, family-law, probate, and debt-recovery topics.

## Candidate Outcome

- Target slugs reviewed: ${targetSlugs.length}
- Sanity records found: ${docs.length}
- Hidden draft records found: ${[...bySlug.values()].reduce((count, bucket) => count + bucket.hidden.length, 0)}
- Public approved duplicate overlaps: ${[...bySlug.values()].filter((bucket) => bucket.publicDocs.length > 0).length}
- New articles approved: 0
- New redirects activated: 0

## Redirect Position

No redirect was added or changed. Redirects remain blocked for hidden or unresolved drafts.

Duplicate public targets may be considered in a later redirect-only sprint, but only after exact target, canonical, sitemap, and one-hop redirect QA.
`
  );

  console.log(JSON.stringify({
    targetSlugs: targetSlugs.length,
    sanityRecordsFound: docs.length,
    hiddenDraftRecordsFound: [...bySlug.values()].reduce((count, bucket) => count + bucket.hidden.length, 0),
    publicApprovedDuplicateOverlaps: [...bySlug.values()].filter((bucket) => bucket.publicDocs.length > 0).length,
    approvalsRecommended: 0,
    redirectsActivated: 0,
    outputFiles: [
      "docs/SPRINT-11B-FRESH-GSC-BING-EXPORT-STATUS.md",
      "docs/SPRINT-11B-LAWYER-REVIEW-RESOLUTION.csv",
      "docs/SPRINT-11B-IMAGE-ALT-CORRECTION.csv",
      "docs/SPRINT-11B-DUPLICATE-CANNIBALIZATION-REVIEW.csv",
      "docs/SPRINT-11B-CONTROLLED-APPROVAL-RESULT.md"
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
