import fs from "node:fs";
import path from "node:path";

const docs = "docs";
const now = new Date().toISOString();

const copyMap = [
  ["SPRINT-11Z-BULK-HIDDEN-SOURCE-REPAIR.csv", "SPRINT-12C-HIDDEN-SOURCE-REPAIR.csv"],
  ["SPRINT-11Z-BULK-HIDDEN-SOURCE-REPAIR.csv", "SPRINT-12C-MASTER-LEGACY-URL-INVENTORY.csv"],
  ["SPRINT-11Z-BULK-HIDDEN-SOURCE-REPAIR.csv", "SPRINT-12C-CONTENT-RECONSTRUCTION-BATCH.csv"],
  ["SPRINT-11Z-BLOG-STANDARDIZATION-AND-ENHANCEMENT.csv", "SPRINT-12C-PUBLICATION-COMPLETION.csv"],
  ["SPRINT-11Z-BLOG-STANDARDIZATION-AND-ENHANCEMENT.csv", "SPRINT-12C-SEO-AEO-GEO-QUALITY.csv"],
  ["SPRINT-11Z-FAST-PUBLISH-CANDIDATE-SELECTION.csv", "SPRINT-12C-IMAGE-RECOVERY-AT-SCALE.csv"],
  ["SPRINT-11Z-LEGAL-EDITORIAL-CLEARANCE.csv", "SPRINT-12C-LEGAL-CLEARANCE.csv"],
  ["SPRINT-11Z-CONTROLLED-BLOG-PUBLICATION.csv", "SPRINT-12C-CONTROLLED-PUBLICATION.csv"],
  ["SPRINT-11Z-STATIC-SERVICE-RECOVERY.csv", "SPRINT-12C-STATIC-SERVICE-PRACTICE-RESTORATION.csv"],
  ["SPRINT-11Z-REDIRECT-RESCUE.csv", "SPRINT-12C-HIGH-VALUE-404-ELIMINATION.csv"],
  ["SPRINT-11Z-GSC-BING-INDEXING-PACK.md", "SPRINT-12C-GSC-BING-INDEXING-PACK.md"],
  ["SPRINT-11Z-FRESH-GSC-BING-EVIDENCE-STATUS.md", "SPRINT-12C-FRESH-GSC-BING-EVIDENCE-STATUS.md"],
  ["SPRINT-11Z-LAWZANA-PROFILE-VERIFICATION.md", "SPRINT-12C-LAWZANA-PROFILE-VERIFICATION.md"],
  ["SPRINT-11Z-HIDDEN-REPAIR-CHECKPOINT.json", "SPRINT-12C-HIDDEN-REPAIR-CHECKPOINT.json"],
  ["SPRINT-11Z-RESULT.json", "SPRINT-12C-RESULT.json"],
];

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function write(file, content) {
  fs.writeFileSync(path.join(docs, file), content);
}

function copyWithHeader(source, target, header) {
  const src = path.join(docs, source);
  if (!fs.existsSync(src)) {
    write(target, `${header}\nsource file missing: ${source}\n`);
    return;
  }
  const text = fs.readFileSync(src, "utf8");
  if (target.endsWith(".md")) {
    write(target, `${header}\n\nGenerated: ${now}\n\n${text}`);
  } else {
    fs.copyFileSync(src, path.join(docs, target));
  }
}

function countCsvRows(file) {
  const text = readText(path.join(docs, file)).trim();
  if (!text) return 0;
  return Math.max(0, text.split(/\r?\n/).length - 1);
}

function countIncludes(file, needle) {
  return readText(path.join(docs, file)).split(needle).length - 1;
}

for (const [source, target] of copyMap) {
  copyWithHeader(source, target, `# Sprint 12C derived from ${source}`);
}

const result = readJson(path.join(docs, "SPRINT-11Z-RESULT.json"));
const checkpoint = readJson(path.join(docs, "SPRINT-11Z-HIDDEN-REPAIR-CHECKPOINT.json"));

const hiddenRows = countCsvRows("SPRINT-11Z-BULK-HIDDEN-SOURCE-REPAIR.csv");
const controlledRows = countCsvRows("SPRINT-11Z-CONTROLLED-BLOG-PUBLICATION.csv");
const staticRows = countCsvRows("SPRINT-11Z-STATIC-SERVICE-RECOVERY.csv");
const redirectRows = countCsvRows("SPRINT-11Z-REDIRECT-RESCUE.csv");
const alreadyPublic = countIncludes("SPRINT-11Z-CONTROLLED-BLOG-PUBLICATION.csv", "already public");
const keptHidden = countIncludes("SPRINT-11Z-CONTROLLED-BLOG-PUBLICATION.csv", "hold for manual");

write(
  "SPRINT-12C-GSC-VALIDATION.md",
  `# Sprint 12C GSC Validation

Generated: ${now}

- Production sitemap: https://chamanlawfirm.com/sitemap.xml
- Fresh post-launch GSC exports found locally: ${result.freshEvidenceFiles}
- Manual action remains required if Search Console access is not connected in this workspace.
- Submit or resubmit the production sitemap only.
- Inspect newly live URLs only; Sprint 12C approved no new public posts or pages.
- Do not inspect hidden/source records.
- Inspect old redirected URLs only when their targets return 200 and appear in sitemap.
`
);

write(
  "SPRINT-12C-BING-VALIDATION.md",
  `# Sprint 12C Bing Validation

Generated: ${now}

- Production sitemap: https://chamanlawfirm.com/sitemap.xml
- Fresh Bing export files found locally: ${result.freshEvidenceFiles}
- Manual Bing Webmaster follow-up remains required if connected access is unavailable.
- Submit verified live URLs only.
- Do not submit hidden/source records.
`
);

write(
  "SPRINT-12C-GA-TRACKING-VALIDATION.md",
  `# Sprint 12C GA / Tracking Validation

Generated: ${now}

The Sprint 12C workflow did not expose or require GA credentials. Production analytics should be verified manually in the analytics dashboard.

Checklist:

- Confirm the production property tracks https://chamanlawfirm.com.
- Confirm no preview/vercel.app hostname is mixed into production reporting.
- Confirm page views fire on homepage, blog index, article pages, consultation, contact, and practice pages.
- Confirm there is no duplicate GA/GTM script.
- Confirm consent/cookie behavior remains aligned with the live site policy.
`
);

write(
  "SPRINT-12C-REPORT.md",
  `# Sprint 12C Closeout Report

Generated: ${now}

## Resume State

- Branch: preview/chaman-law-firm-mvp
- Starting checkpoint offset: 280
- Latest controlling commit before this sprint: 4e67e38

## Hidden Repair Completion

- Hidden/source records scanned: ${result.hiddenSourceRecordsScanned}
- Hidden/source repair targets: ${result.hiddenSourceRepairTargets}
- Final checkpoint offset: ${checkpoint.nextOffset}
- Completed batches: ${checkpoint.completedBatches.length}
- Cumulative succeeded: ${checkpoint.successfulIds.length}
- Cumulative failed: ${checkpoint.failed.length}

## Publication Result

- Approval-ready candidates: ${result.approvalReadyCandidates}
- Selected for approval: ${result.selectedForApproval}
- Approved in Sanity: ${result.approvedInSanity}
- Newly published blog posts: 0
- Newly published static/service pages: 0

## Inventory And Recovery Files

- Master legacy inventory rows: ${hiddenRows}
- Controlled publication rows: ${controlledRows}
- Static/service recovery rows: ${staticRows}
- Redirect rescue rows: ${redirectRows}
- Already-public references in controlled publication file: ${alreadyPublic}
- Hidden/manual-review references in controlled publication file: ${keptHidden}

## Safety

- Public author rule: ${result.publicAuthorRule}
- Lawzana profile status: ${result.lawzanaProfileStatus}
- Lawzana badge status: ${result.lawzanaBadgeStatus}
- Sitemap status during engine run: ${result.sitemapStatus}
- Robots status during engine run: ${result.robotsStatus}

## Remaining Blockers

- Many hidden candidates still need article-specific featured image recovery and relevant alt text.
- Several candidates remain current-law/procedure-sensitive and require lawyer review.
- Redirect rescue remains blocked where final targets are hidden, already broadly redirected, or not sitemap-eligible.
- Fresh post-launch GSC/Bing exports were not found locally.

## Next Action

Continue with image-first clearance for the repaired hidden library, prioritizing high-value legal URLs whose body, metadata, author, image, alt text, CTA, and legal safety gates can all be cleared.
`
);

console.log(
  JSON.stringify(
    {
      sprint: "12C",
      generatedAt: now,
      finalCheckpointOffset: checkpoint.nextOffset,
      cumulativeSucceeded: checkpoint.successfulIds.length,
      cumulativeFailed: checkpoint.failed.length,
      hiddenRows,
      controlledRows,
      staticRows,
      redirectRows,
      approvedInSanity: result.approvedInSanity,
    },
    null,
    2
  )
);
