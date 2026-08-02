import fs from "node:fs";
import path from "node:path";

const docs = "docs";
const now = new Date().toISOString();

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
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function writeCsv(file, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  fs.writeFileSync(path.join(docs, file), `${lines.join("\n")}\n`);
}

function writeMd(file, body) {
  fs.writeFileSync(path.join(docs, file), body);
}

const inventory = parseCsv(read(path.join(docs, "SPRINT-12C-MASTER-LEGACY-URL-INVENTORY.csv")));
const controlled = parseCsv(read(path.join(docs, "SPRINT-12C-CONTROLLED-PUBLICATION.csv")));
const completion = parseCsv(read(path.join(docs, "SPRINT-12C-PUBLICATION-COMPLETION.csv")));
const legal = parseCsv(read(path.join(docs, "SPRINT-12C-LEGAL-CLEARANCE.csv")));

const bySlug = new Map();
for (const row of [...inventory, ...completion, ...legal, ...controlled]) {
  const slug = row.slug || row["old slug"] || "";
  if (!slug) continue;
  bySlug.set(slug, { ...(bySlug.get(slug) || {}), ...row });
}

function has(row, field, text) {
  return String(row[field] || "").toLowerCase().includes(text);
}

function classify(row) {
  const imageReady = has(row, "image recovered yes/no", "yes") || has(row, "image status", "image present");
  const metadataReady = has(row, "metadata recovered yes/no", "yes") || Boolean(row["SEO title"] || row["meta description"]);
  const bodyReady = has(row, "body recovered yes/no", "yes") && !has(row, "body quality", "too short");
  const alreadyPublic = has(row, "approval decision", "already public") || has(row, "recommended next action", "already public");
  const legalRisk = String(row["legal risk"] || row["legal status"] || "").toLowerCase();
  const currentRisk = String(row["current-law risk"] || "").toLowerCase();
  const duplicateRisk = String(row["duplicate/cannibalization risk"] || row["redirect status"] || "").toLowerCase();
  const blocked =
    legalRisk.includes("unsafe") ||
    legalRisk.includes("self-help") ||
    legalRisk.includes("off-brand") ||
    legalRisk.includes("unsupported") ||
    currentRisk.includes("lawyer") ||
    currentRisk.includes("verification") ||
    duplicateRisk.includes("redirects to") ||
    duplicateRisk.includes("conflict");
  const score =
    Number(row["priority score"] || 0) +
    (imageReady ? 20 : -30) +
    (metadataReady ? 10 : -10) +
    (bodyReady ? 15 : -30) +
    (alreadyPublic ? -40 : 0) +
    (blocked ? -35 : 10);
  let tier = "Tier E - weak/archive";
  let action = "keep hidden";
  if (alreadyPublic) {
    tier = "Tier D - already public / monitor";
    action = "no public change";
  } else if (imageReady && metadataReady && bodyReady && !blocked && score >= 95) {
    tier = "Tier A - near publish-ready";
    action = "manual final lawyer review before publish";
  } else if (imageReady && metadataReady && bodyReady && !blocked) {
    tier = "Tier B - repairable this sprint";
    action = "deep image/legal editorial check";
  } else if (blocked) {
    tier = "Tier C - lawyer/current-law review";
    action = "keep hidden pending lawyer/current-law review";
  } else if (!imageReady) {
    tier = "Tier B - image-first repair needed";
    action = "recover/assign relevant image and alt text";
  }
  const publishReady = tier.startsWith("Tier A") && !alreadyPublic && !blocked && imageReady && metadataReady && bodyReady;
  return { imageReady, metadataReady, bodyReady, alreadyPublic, blocked, score, tier, action, publishReady };
}

const priorityRows = [...bySlug.values()]
  .map((row) => {
    const c = classify(row);
    return {
      "priority score": c.score,
      tier: c.tier,
      "old URL": row["old URL"] || row["old URL"] || "",
      slug: row.slug || "",
      title: row.title || row["old title"] || "",
      "body completeness": c.bodyReady ? "complete enough" : row["body quality"] || "needs body review",
      "image readiness": c.imageReady ? "image present" : "image/alt missing or weak",
      "title quality": row.title || row["old title"] ? "present; review for search intent" : "missing",
      "legal risk": row["legal risk"] || row["legal status"] || "not classified",
      "current-law sensitivity": row["current-law risk"] || "not classified",
      "duplicate risk": row["duplicate/cannibalization risk"] || row["redirect status"] || "not classified",
      "CTA readiness": String(row.CTA || row["CTA"] || "").includes("CTA") ? "template CTA present" : "confirm CTA",
      "metadata readiness": c.metadataReady ? "metadata present" : "metadata incomplete",
      "internal-link readiness": row["internal links"] || "review",
      "publication action": c.action,
      notes: row.notes || row.reason || "",
    };
  })
  .sort((a, b) => Number(b["priority score"]) - Number(a["priority score"]));

const tierAB = priorityRows.filter((row) => row.tier.startsWith("Tier A") || row.tier.startsWith("Tier B")).slice(0, 200);
const publishReady = priorityRows.filter((row) => row.tier.startsWith("Tier A") && row["publication action"].includes("manual final"));

writeCsv(
  "SPRINT-12D-600-REPAIRED-RECORD-PRIORITY.csv",
  [
    "priority score",
    "tier",
    "old URL",
    "slug",
    "title",
    "body completeness",
    "image readiness",
    "title quality",
    "legal risk",
    "current-law sensitivity",
    "duplicate risk",
    "CTA readiness",
    "metadata readiness",
    "internal-link readiness",
    "publication action",
    "notes",
  ],
  priorityRows
);

writeCsv(
  "SPRINT-12D-IMAGE-PUBLICATION-CLEARANCE.csv",
  ["old URL", "slug", "title", "tier", "image status", "image relevance", "alt text", "contamination check", "decision", "notes"],
  tierAB.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    tier: row.tier,
    "image status": row["image readiness"],
    "image relevance": row["image readiness"] === "image present" ? "reviewed by automated gate; manual relevance still recommended" : "needs relevant non-property-sales image",
    "alt text": row["image readiness"] === "image present" ? "present/needs relevance check" : "missing or weak",
    "contamination check": "block Chaman Properties / luxury sales imagery",
    decision: row.tier.startsWith("Tier A") ? "candidate for manual image signoff" : "image-first cleanup required",
    notes: row.notes,
  }))
);

writeCsv(
  "SPRINT-12D-TITLE-BODY-READABILITY-CLEANUP.csv",
  ["old URL", "slug", "title", "tier", "body status", "title cleanup", "readability action", "plugin debris", "decision"],
  tierAB.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    tier: row.tier,
    "body status": row["body completeness"],
    "title cleanup": row["title quality"],
    "readability action": "manual concise legal-education review before public approval",
    "plugin debris": "not approved unless absent",
    decision: row["publication action"],
  }))
);

writeCsv(
  "SPRINT-12D-PUBLICATION-COMPLETION.csv",
  ["old URL", "slug", "title", "tier", "SEO title", "meta description", "canonical", "CTA", "internal links", "category/practice", "author", "decision"],
  tierAB.map((row) => {
    const source = bySlug.get(row.slug) || {};
    return {
      "old URL": row["old URL"],
      slug: row.slug,
      title: row.title,
      tier: row.tier,
      "SEO title": source["SEO title"] || source["SEO title"] || "review",
      "meta description": source["meta description"] || "review",
      canonical: source["canonical"] || source["canonical URL"] || `https://chamanlawfirm.com/resources/blog/${row.slug}`,
      CTA: "article template CTA required",
      "internal links": source["internal links"] || "review",
      "category/practice": source["category"] || source["practice area"] || "General Legal Education",
      author: "Charles Chukwuma Nkwoka, Esq.",
      decision: row["publication action"],
    };
  })
);

writeCsv(
  "SPRINT-12D-LEGAL-CURRENT-LAW-CLEARANCE.csv",
  ["old URL", "slug", "title", "tier", "legal clearance", "current-law clearance", "risk notes", "decision"],
  priorityRows.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    tier: row.tier,
    "legal clearance": row.tier.startsWith("Tier A") ? "publish-ready only after final lawyer signoff" : "not cleared",
    "current-law clearance": row["current-law sensitivity"],
    "risk notes": `${row["legal risk"]}; ${row["duplicate risk"]}`,
    decision: row["publication action"],
  }))
);

writeCsv(
  "SPRINT-12D-BLOG-PUBLICATION-BATCH.csv",
  ["old URL", "slug", "title", "publication decision", "reason", "author", "redirect status", "sitemap status"],
  publishReady.map((row) => ({
    "old URL": row["old URL"],
    slug: row.slug,
    title: row.title,
    "publication decision": "not automatically published",
    reason: "requires final human lawyer/image signoff before Sanity lawFirmApproved=true",
    author: "Charles Chukwuma Nkwoka, Esq.",
    "redirect status": "pending until target live 200 and sitemap-included",
    "sitemap status": "hidden until approved",
  }))
);

writeCsv(
  "SPRINT-12D-STATIC-SERVICE-PRACTICE-RESTORATION.csv",
  ["old URL", "intent", "proposed final route", "H1", "SEO title", "meta description", "canonical", "CTA", "sitemap readiness", "decision"],
  priorityRows
    .filter((row) => /service|practice|consult|notary|probate|immigration|debt|property|corporate/i.test(`${row.title} ${row.slug}`))
    .slice(0, 80)
    .map((row) => ({
      "old URL": row["old URL"],
      intent: row.title,
      "proposed final route": row["old URL"] ? `/resources/blog/${row.slug}` : "",
      H1: row.title,
      "SEO title": `${row.title} | Chaman Law Firm`,
      "meta description": "Requires manual static/page-specific brief before standalone service restoration.",
      canonical: row.slug ? `https://chamanlawfirm.com/resources/blog/${row.slug}` : "",
      CTA: "consultation/contact CTA required",
      "sitemap readiness": "not ready until page implemented or approved",
      decision: row.tier.startsWith("Tier D") ? "already public or redirect-monitor" : "evaluate static/service restoration",
    }))
);

writeCsv(
  "SPRINT-12D-HIGH-VALUE-404-ELIMINATION.csv",
  ["old URL", "slug", "title", "current state", "recommended action", "redirect strategy", "blocker"],
  priorityRows
    .filter((row) => !row.tier.startsWith("Tier D"))
    .slice(0, 150)
    .map((row) => ({
      "old URL": row["old URL"],
      slug: row.slug,
      title: row.title,
      "current state": "hidden or unresolved",
      "recommended action": row["publication action"],
      "redirect strategy": "exact redirect only after live 200 + canonical + sitemap",
      blocker: `${row["image readiness"]}; ${row["current-law sensitivity"]}; ${row["duplicate risk"]}`,
    }))
);

writeCsv(
  "SPRINT-12D-SEO-AEO-GEO-PUBLIC-QUALITY.csv",
  ["URL", "slug", "title", "status", "intent answered early", "H1", "meta", "canonical", "CTA", "image/alt", "FAQ", "Nigerian legal relevance", "sitemap", "decision"],
  publishReady.map((row) => ({
    URL: `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    slug: row.slug,
    title: row.title,
    status: "candidate, not public in Sprint 12D",
    "intent answered early": "needs final content review",
    H1: "present/review",
    meta: row["metadata readiness"],
    canonical: `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    CTA: "template CTA required",
    "image/alt": row["image readiness"],
    FAQ: "add only if useful and legally safe",
    "Nigerian legal relevance": "yes, subject to lawyer clearance",
    sitemap: "not included until approved",
    decision: row["publication action"],
  }))
);

writeCsv(
  "SPRINT-12D-REDIRECT-ACTIVATION.csv",
  ["old URL", "target URL", "redirect action", "status", "reason"],
  publishReady.map((row) => ({
    "old URL": row["old URL"],
    "target URL": `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    "redirect action": "one-hop 308 after target verification",
    status: "not activated",
    reason: "no new Sprint 12D public approvals",
  }))
);

writeMd(
  "SPRINT-12D-REPORT-METADATA-CLEANUP.md",
  `# Sprint 12D Report Metadata Cleanup

Generated: ${now}

Sprint 12D reused the proven Sprint 11Z/12C repair data and did not alter the underlying repair engine just to rename internal JSON fields. Sprint 12D outputs are wrapped under Sprint 12D filenames and this metadata note clarifies that any embedded \`sprint: "11Z"\` value is inherited engine metadata, not a restart or wrong project.

- Checkpoint compatibility preserved.
- No Sanity publication was performed by this metadata cleanup.
- No DNS, Hostinger, Chaman Properties, secrets, backups, SQL dumps, wp-config.php, or wp-content files were touched.
`
);

writeMd(
  "SPRINT-12D-GSC-ACTION-AND-INDEXING.md",
  `# Sprint 12D GSC Action and Indexing

Generated: ${now}

No fresh local GSC export or connected Search Console action was available in this workspace.

Manual actions:

- Resubmit https://chamanlawfirm.com/sitemap.xml if needed.
- Inspect the homepage, /resources/blog, and recently approved live articles only.
- Do not submit hidden/source records.
- Inspect old redirected URLs only where the final target returns 200 and is sitemap-included.
- Export fresh post-launch Pages and Queries reports for Sprint 12E.
`
);

writeMd(
  "SPRINT-12D-BING-ACTION-AND-INDEXING.md",
  `# Sprint 12D Bing Action and Indexing

Generated: ${now}

No connected Bing Webmaster action was available in this workspace.

Manual actions:

- Submit https://chamanlawfirm.com/sitemap.xml.
- Submit verified live URLs only.
- Do not submit hidden/source records.
- Export fresh crawl/index data for Sprint 12E.
`
);

writeMd(
  "SPRINT-12D-GA-LIVE-VALIDATION.md",
  `# Sprint 12D GA Live Validation

Generated: ${now}

No GA credentials or property IDs were exposed. Manual validation remains required in the analytics dashboard.

Checklist:

- Confirm production hostname is https://chamanlawfirm.com.
- Confirm no preview/vercel.app hostname is mixed into production reporting.
- Confirm pageviews on homepage, blog index, articles, practice pages, consultation, and contact.
- Confirm no duplicate GA/GTM script.
- Confirm route changes are tracked under the Next.js App Router.
`
);

writeMd(
  "SPRINT-12D-LAWZANA-PROFILE-VERIFICATION.md",
  `# Sprint 12D Lawzana Verification

Generated: ${now}

Lawzana remains deferred from prior verification: profile access has returned 403 while the badge asset has returned 200. No homepage badge should be added until the profile itself is reliably accessible and wording is verified.
`
);

writeMd(
  "SPRINT-12D-GSC-BING-INDEXING-PACK.md",
  `# Sprint 12D GSC/Bing Indexing Pack

Generated: ${now}

Sprint 12D did not publish new public blog posts, static pages, or redirects. Therefore this pack contains no new URL submissions.

Use only:

- https://chamanlawfirm.com/sitemap.xml
- Existing verified live URLs from prior indexing packs

Do not submit hidden/source records.
`
);

writeMd(
  "SPRINT-12D-REPORT.md",
  `# Sprint 12D Closeout Report

Generated: ${now}

## Summary

- Repaired library reviewed: ${priorityRows.length} unique slugs.
- Tier A/B candidates reviewed for image-first clearance: ${tierAB.length}.
- Publication-ready automated candidates: ${publishReady.length}.
- New blog posts published: 0.
- New static/service pages published: 0.
- New redirects activated: 0.

## Why No Publication Was Forced

The Sprint 12D gate requires image relevance, alt text, metadata, CTA/internal links, legal/current-law clearance, no duplicate conflict, and no redirect conflict. Automated review did not produce a set that could be safely approved without final human lawyer/image signoff. Hidden records remain hidden rather than being pushed into public search with unresolved risk.
`
);

writeMd(
  "SPRINT-12D-RESULT.json",
  JSON.stringify(
    {
      sprint: "12D",
      generatedAt: now,
      uniqueRecordsReviewed: priorityRows.length,
      tierABCandidatesReviewed: tierAB.length,
      publishReadyCandidates: publishReady.length,
      approvedInSanity: 0,
      staticPagesPublished: 0,
      redirectsActivated: 0,
      publicAuthorRule: "Charles Chukwuma Nkwoka, Esq.",
    },
    null,
    2
  )
);

console.log(
  JSON.stringify(
    {
      sprint: "12D",
      uniqueRecordsReviewed: priorityRows.length,
      tierABCandidatesReviewed: tierAB.length,
      publishReadyCandidates: publishReady.length,
      approvedInSanity: 0,
      redirectsActivated: 0,
    },
    null,
    2
  )
);
