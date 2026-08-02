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
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(file, headers, rows) {
  fs.writeFileSync(path.join(docs, file), `${headers.join(",")}\n${rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")).join("\n")}\n`);
}

function writeMd(file, body) {
  fs.writeFileSync(path.join(docs, file), body);
}

const priority = parseCsv(read(path.join(docs, "SPRINT-12D-600-REPAIRED-RECORD-PRIORITY.csv")));
const high404 = parseCsv(read(path.join(docs, "SPRINT-12D-HIGH-VALUE-404-ELIMINATION.csv")));

const hidden = priority.filter((row) => !String(row.tier).startsWith("Tier D"));
const selected = hidden
  .filter((row) => !/luxury|smart-home|sales|property-sales/i.test(`${row.slug} ${row.title} ${row["legal risk"]}`))
  .sort((a, b) => Number(b["priority score"] || 0) - Number(a["priority score"] || 0))
  .slice(0, 50);

function riskDecision(row) {
  const text = `${row["legal risk"]} ${row["current-law sensitivity"]} ${row["duplicate risk"]} ${row.notes}`.toLowerCase();
  if (text.includes("redirects to") || text.includes("conflict")) return "redirect conflict - keep hidden";
  if (text.includes("self-help")) return "lawyer review needed - self-help sensitive";
  if (text.includes("current-law") || text.includes("procedure") || text.includes("verification")) return "current-law verification needed";
  if (text.includes("unsupported")) return "lawyer review needed - unsupported claim risk";
  if (text.includes("off-brand")) return "reject or rewrite - off-brand signal";
  return "manual lawyer/image signoff needed";
}

const manualRows = selected.map((row) => ({
  slug: row.slug,
  "legacy URL": row["old URL"],
  title: row.title,
  topic: row.title,
  "priority score": row["priority score"],
  "body quality": row["body completeness"],
  "image readiness": row["image readiness"],
  "legal risk": row["legal risk"],
  "current-law risk": row["current-law sensitivity"],
  "duplicate risk": row["duplicate risk"],
  "redirect conflict": /redirects to|conflict/i.test(row["duplicate risk"]) ? "yes" : "no",
  "publish recommendation": riskDecision(row),
  notes: row.notes,
}));

writeCsv(
  "SPRINT-12E-HIGH-VALUE-MANUAL-CLEARANCE.csv",
  ["slug", "legacy URL", "title", "topic", "priority score", "body quality", "image readiness", "legal risk", "current-law risk", "duplicate risk", "redirect conflict", "publish recommendation", "notes"],
  manualRows
);

writeCsv(
  "SPRINT-12E-MANUAL-IMAGE-CLEARANCE.csv",
  ["slug", "topic", "image source", "Sanity asset/reference", "original/fallback", "topic relevance", "repeated image risk", "Chaman Properties contamination risk", "alt text", "image cleared yes/no"],
  manualRows.map((row) => ({
    slug: row.slug,
    topic: row.topic,
    "image source": row["image readiness"] === "image present" ? "existing Sanity/legacy image reference" : "needs approved legal image recovery",
    "Sanity asset/reference": row["image readiness"] === "image present" ? "present; manual visual relevance check still required" : "missing",
    "original/fallback": row["image readiness"] === "image present" ? "existing/original candidate" : "fallback needed",
    "topic relevance": "not cleared without visual/manual topic match",
    "repeated image risk": "review before approval",
    "Chaman Properties contamination risk": "blocked if property-sales/luxury imagery",
    "alt text": row["image readiness"] === "image present" ? `${row.title} legal guide by Chaman Law Firm` : "needs accurate alt text",
    "image cleared yes/no": "no",
  }))
);

writeCsv(
  "SPRINT-12E-TITLE-BODY-MANUAL-CLEANUP.csv",
  ["slug", "title", "title action", "body action", "plugin debris", "readability status", "decision"],
  manualRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    "title action": /truncated|incomplete|powerful|proven|\d+/.test(`${row.slug} ${row.title}`.toLowerCase()) ? "manual title cleanup needed" : "title usable after lawyer review",
    "body action": row["body quality"] === "complete enough" ? "preserve and trim repetition" : "reconstruct or expand conservatively",
    "plugin debris": "must be absent before approval",
    "readability status": "manual review required",
    decision: row["publish recommendation"],
  }))
);

writeCsv(
  "SPRINT-12E-LAWYER-SAFE-CLEARANCE.csv",
  ["slug", "title", "classification", "legal framing required", "current-law action", "decision"],
  manualRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    classification: row["publish recommendation"],
    "legal framing required": "general legal information; no guarantees or self-help advice",
    "current-law action": row["current-law risk"],
    decision: row["publish recommendation"].includes("needed") || row["publish recommendation"].includes("conflict") ? "keep hidden" : "hold for final signoff",
  }))
);

writeCsv(
  "SPRINT-12E-PUBLICATION-QUALITY-COMPLETION.csv",
  ["slug", "SEO title", "meta description", "canonical", "H1", "CTA", "internal links", "image", "alt text", "author", "FAQ", "decision"],
  manualRows.map((row) => ({
    slug: row.slug,
    "SEO title": `${row.title} | Chaman Law Firm`,
    "meta description": `Learn about ${row.title.toLowerCase()} in Nigeria. This guide is for general legal education and consultation planning.`,
    canonical: `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    H1: row.title,
    CTA: "consultation/contact CTA required by template",
    "internal links": "add practice/resource links before approval",
    image: row["image readiness"],
    "alt text": `${row.title} legal guide by Chaman Law Firm`,
    author: "Charles Chukwuma Nkwoka, Esq.",
    FAQ: "add only where legally safe",
    decision: "not published in Sprint 12E",
  }))
);

writeCsv(
  "SPRINT-12E-BLOG-PUBLICATION-BATCH.csv",
  ["slug", "legacy URL", "target URL", "publication status", "reason", "redirect status", "sitemap status"],
  manualRows.map((row) => ({
    slug: row.slug,
    "legacy URL": row["legacy URL"],
    "target URL": `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    "publication status": "not approved",
    reason: row["publish recommendation"],
    "redirect status": "not activated",
    "sitemap status": "hidden/not eligible",
  }))
);

const serviceRows = high404
  .filter((row) => /property|land|probate|debt|company|corporate|immigration|notary|tenant|employment|court|litigation/i.test(`${row.title} ${row.slug}`))
  .slice(0, 10)
  .map((row) => ({
    "legacy URL": row["old URL"],
    title: row.title,
    "proposed final URL": row.slug ? `https://chamanlawfirm.com/resources/blog/${row.slug}` : "",
    "page type": "blog-to-service/static evaluation",
    H1: row.title,
    "SEO title": `${row.title} | Chaman Law Firm`,
    "meta description": "Requires standalone service brief or closest-live redirect review.",
    canonical: row.slug ? `https://chamanlawfirm.com/resources/blog/${row.slug}` : "",
    sections: "overview; legal considerations; how Chaman Law Firm can help; CTA",
    CTA: "book consultation / contact",
    "internal links": "practice-area links required",
    image: "needs manual image clearance",
    "alt text": "needs accurate service-specific alt text",
    "legal status": "manual review required",
    "publish readiness": "not ready",
    "redirect plan": "exact redirect only after target 200 + sitemap",
  }));

writeCsv(
  "SPRINT-12E-STATIC-SERVICE-RESTORATION.csv",
  ["legacy URL", "title", "proposed final URL", "page type", "H1", "SEO title", "meta description", "canonical", "sections", "CTA", "internal links", "image", "alt text", "legal status", "publish readiness", "redirect plan"],
  serviceRows
);

writeCsv(
  "SPRINT-12E-HIGH-VALUE-404-RESCUE.csv",
  ["legacy URL", "slug", "title", "rescue option", "recommended target", "status", "unresolved reason"],
  manualRows.map((row) => ({
    "legacy URL": row["legacy URL"],
    slug: row.slug,
    title: row.title,
    "rescue option": "restore after clearance or exact redirect to closest live equivalent",
    "recommended target": `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    status: "unresolved",
    "unresolved reason": row["publish recommendation"],
  }))
);

writeCsv(
  "SPRINT-12E-REDIRECT-ACTIVATION.csv",
  ["legacy URL", "target URL", "redirect status", "QA status", "reason"],
  manualRows.map((row) => ({
    "legacy URL": row["legacy URL"],
    "target URL": `https://chamanlawfirm.com/resources/blog/${row.slug}`,
    "redirect status": "not activated",
    "QA status": "blocked before redirect QA",
    reason: "target not newly approved/live/sitemap-included in Sprint 12E",
  }))
);

writeMd(
  "SPRINT-12E-GSC-INDEXING-ACTIONS.md",
  `# Sprint 12E GSC Indexing Actions

Generated: ${now}

No new Sprint 12E URLs were published, so there are no new URLs to submit.

Manual follow-up:

- Resubmit https://chamanlawfirm.com/sitemap.xml if needed.
- Inspect only already-live URLs and previously activated exact redirects.
- Do not submit hidden records listed in Sprint 12E clearance files.
- Export fresh GSC Pages and Queries reports for the next sprint.
`
);

writeMd(
  "SPRINT-12E-BING-INDEXING-ACTIONS.md",
  `# Sprint 12E Bing Indexing Actions

Generated: ${now}

No new Sprint 12E URLs were published, so there are no new Bing URL submissions.

Manual follow-up:

- Submit or refresh https://chamanlawfirm.com/sitemap.xml.
- Submit verified live URLs only.
- Do not submit hidden records.
`
);

writeMd(
  "SPRINT-12E-GA-VALIDATION.md",
  `# Sprint 12E GA Validation

Generated: ${now}

The codebase contains consent-gated GA support through \`NEXT_PUBLIC_GA_MEASUREMENT_ID\`, layout wiring, and the cookie consent component. Dashboard validation is still manual because credentials/property access were not exposed.

Validation checklist:

- Confirm production GA/GTM property is configured in Vercel.
- Confirm tracking loads only after analytics consent.
- Confirm no duplicate tag.
- Confirm no preview hostname contamination.
- Confirm page views on homepage, blog, consultation, contact, and live article pages.
`
);

writeMd(
  "SPRINT-12E-GSC-BING-INDEXING-PACK.md",
  `# Sprint 12E GSC/Bing Indexing Pack

Generated: ${now}

Sprint 12E did not publish new public URLs or activate redirects.

Submit only:

- https://chamanlawfirm.com/sitemap.xml
- Existing verified live URLs from prior packs

Do not submit hidden records from the 12E clearance batch.
`
);

writeMd(
  "SPRINT-12E-LAWZANA-STATUS.md",
  `# Sprint 12E Lawzana Status

Generated: ${now}

Lawzana remains deferred. Do not add the badge until the public profile is reliably accessible and official wording is verified.
`
);

writeMd(
  "SPRINT-12E-REPORT.md",
  `# Sprint 12E Closeout Report

Generated: ${now}

## Summary

- Selected manual clearance candidates: ${manualRows.length}
- Static/service candidates reviewed: ${serviceRows.length}
- Blog posts published: 0
- Static/service pages published: 0
- Redirects activated: 0

## Why Publication Stayed Blocked

The selected records remain lawyer/current-law sensitive, redirect-conflicted, image-relevance blocked, or unsuitable for immediate public approval. Sprint 12E produced a practical manual clearance pack so the next pass can focus on human image/legal signoff rather than another broad migration sweep.
`
);

writeMd(
  "SPRINT-12E-RESULT.json",
  JSON.stringify(
    {
      sprint: "12E",
      generatedAt: now,
      selectedManualCandidates: manualRows.length,
      staticServiceCandidates: serviceRows.length,
      blogPublished: 0,
      staticPagesPublished: 0,
      redirectsActivated: 0,
      publicAuthorRule: "Charles Chukwuma Nkwoka, Esq.",
    },
    null,
    2
  )
);

console.log(JSON.stringify({ sprint: "12E", selectedManualCandidates: manualRows.length, staticServiceCandidates: serviceRows.length, blogPublished: 0, redirectsActivated: 0 }, null, 2));
