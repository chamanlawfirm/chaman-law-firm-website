import fs from "node:fs";
import path from "node:path";

const SITE = "https://chamanlawfirm.com";
const docs = "docs";

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(file, rows, headers) {
  const body = [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
  fs.writeFileSync(path.join(docs, file), `${body}\n`, "utf8");
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((item) => item.length)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function slugFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+|\/+$/g, "").split("/").pop() || "";
  } catch {
    return "";
  }
}

function oldPath(url) {
  try {
    const parsed = new URL(url);
    const pathName = parsed.pathname.replace(/\/+$/g, "");
    return pathName || "/";
  } catch {
    return "";
  }
}

function targetFor(url) {
  const slug = slugFromUrl(url);
  if (!slug) return SITE;
  return `${SITE}/resources/blog/${slug}`;
}

const pagesPath = path.join(docs, "search-console-exports", "Pages.csv");
const pages = fs.existsSync(pagesPath) ? parseCsv(fs.readFileSync(pagesPath, "utf8")) : [];
const topPages = pages.slice(0, 250).map((row) => {
  const clicks = Number.parseInt(String(row.Clicks || "0").replace(/[^\d]/g, ""), 10) || 0;
  const impressions = Number.parseInt(String(row.Impressions || "0").replace(/[^\d]/g, ""), 10) || 0;
  const url = row["Top pages"] || "";
  const pathName = oldPath(url);
  const currentRoute = pathName.startsWith("/resources/") || pathName === "/" ? `${SITE}${pathName}` : targetFor(url);
  return {
    URL: url,
    indexed: "unknown - historical export only",
    current_status: "requires live check",
    clicks,
    impressions,
    average_position: row.Position || "",
    indexing_state: "fresh post-launch export missing",
    redirect_state: "historical URL should be checked against live redirect map",
    crawl_state: "unknown",
    canonical_state: "requires live check",
    recommended_action: pathName === "/" ? "monitor homepage authority" : "rescue if still 404; otherwise validate redirect/live target",
    priority: clicks * 100 + impressions,
    old_url: url,
    proposed_target: currentRoute
  };
});

writeCsv("SPRINT-12G-GSC-EVIDENCE-IMPORT.csv", topPages, [
  "URL",
  "indexed",
  "current_status",
  "clicks",
  "impressions",
  "average_position",
  "indexing_state",
  "redirect_state",
  "crawl_state",
  "canonical_state",
  "recommended_action",
  "priority",
  "old_url",
  "proposed_target"
]);

writeCsv(
  "SPRINT-12G-SEARCH-EVIDENCE-PRIORITY-QUEUE.csv",
  [...topPages].sort((a, b) => b.priority - a.priority).slice(0, 120),
  ["URL", "clicks", "impressions", "average_position", "recommended_action", "priority", "old_url", "proposed_target"]
);

writeCsv("SPRINT-12G-BING-EVIDENCE-IMPORT.csv", [], [
  "URL",
  "indexed",
  "current_status",
  "clicks",
  "impressions",
  "average_position",
  "indexing_state",
  "redirect_state",
  "crawl_state",
  "canonical_state",
  "recommended_action",
  "priority"
]);

writeCsv("SPRINT-12G-IMAGE-FIRST-ARTICLE-RECOVERY.csv", [], [
  "slug",
  "legacy URL",
  "title",
  "body completeness",
  "legal risk",
  "current-law risk",
  "image status",
  "image source",
  "alt text",
  "CTA",
  "metadata",
  "canonical",
  "internal links",
  "duplicate risk",
  "redirect conflict",
  "publication recommendation"
]);

writeCsv("SPRINT-12G-LAWYER-SAFE-CLEARANCE.csv", [], [
  "slug",
  "classification",
  "reason",
  "public author",
  "approval status"
]);

writeCsv("SPRINT-12G-BLOG-PUBLICATION-BATCH.csv", [], [
  "slug",
  "title",
  "old URL",
  "new URL",
  "author",
  "image",
  "alt text",
  "approval status"
]);

writeCsv("SPRINT-12G-STATIC-SERVICE-RECOVERY.csv", [], [
  "old URL",
  "decision",
  "target",
  "reason"
]);

writeCsv("SPRINT-12G-HIGH-VALUE-404-RECOVERY.csv", topPages.slice(0, 50).map((row) => ({
  "old URL": row.old_url,
  clicks: row.clicks,
  impressions: row.impressions,
  decision: "validate live status before new redirect or publication",
  "proposed target": row.proposed_target
})), ["old URL", "clicks", "impressions", "decision", "proposed target"]);

writeCsv("SPRINT-12G-SEO-AEO-GEO-PUBLIC-QUALITY.csv", [], [
  "url",
  "intent answered early",
  "H1",
  "SEO title",
  "meta description",
  "canonical",
  "CTA",
  "internal links",
  "image/alt",
  "FAQ",
  "Nigerian legal context",
  "entity clarity",
  "schema",
  "sitemap inclusion"
]);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-GSC-EVIDENCE-MISSING.md"),
  `# Sprint 12G GSC Evidence Missing\n\nFresh post-launch Google Search Console exports were not found locally.\n\nImported evidence source: \`docs/search-console-exports/Pages.csv\`, modified 2026-06-20. This is historical evidence only and should guide priority, not final indexing claims.\n\nNeeded fresh exports: Pages, Not Found 404, Page with Redirect, Redirect Error, Crawled Currently Not Indexed, Queries, Sitemaps, and URL Inspection samples.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-BING-EVIDENCE-MISSING.md"),
  `# Sprint 12G Bing Evidence Missing\n\nNo fresh Bing Webmaster export was found locally.\n\nNeeded exports: crawl errors, indexed URLs, sitemap status, backlinks, URL inspection, search performance, and blocked URLs.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-GSC-LIVE-VALIDATION.md"),
  `# Sprint 12G GSC Live Validation\n\nManual dashboard validation is still required. Use only production URLs from ${SITE}.\n\nInspect:\n- ${SITE}/\n- ${SITE}/resources/blog\n- ${SITE}/sitemap.xml\n- Newly verified live URLs from this sprint, if any\n- Exact redirected old URLs only after redirect QA passes\n\nDo not inspect hidden Sanity draft URLs or preview URLs.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-BING-LIVE-VALIDATION.md"),
  `# Sprint 12G Bing Live Validation\n\nManual Bing Webmaster validation is still required. Submit/inspect only production URLs and the production sitemap after live QA.\n\nSitemap: ${SITE}/sitemap.xml\n\nDo not submit hidden drafts or unresolved 404 URLs.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-GA4-LIVE-VALIDATION.md"),
  `# Sprint 12G GA4 Live Validation\n\nCode support exists through \`NEXT_PUBLIC_GA_MEASUREMENT_ID\` and the consent-gated CookieConsent component.\n\nCurrent local validation status:\n- GA4/GTM dashboard access was not available.\n- Production tag presence should be verified in browser after accepting analytics cookies.\n- Required Vercel value, if missing: \`NEXT_PUBLIC_GA_MEASUREMENT_ID\`.\n- Do not invent or expose the Measurement ID in chat or committed files.\n\nManual test:\n1. Open ${SITE}/ in a clean browser session.\n2. Accept analytics in the cookie notice.\n3. Confirm gtag script loads from googletagmanager.com.\n4. Confirm Realtime traffic appears in GA4 for production hostname only.\n5. Repeat on /resources/blog and a practice-area page.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-VERCEL-DOMAIN-VALIDATION.md"),
  `# Sprint 12G Vercel Domain Validation\n\nExpected production domain: ${SITE}\n\nValidation checklist:\n- Apex domain returns 200.\n- www redirects to apex.\n- SSL is valid.\n- Sitemap contains production hostname only.\n- No DNS changes were made in Sprint 12G.\n- If Vercel still shows DNS advice, verify in dashboard before changing Hostinger records.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-SANITY-CAPACITY-VALIDATION.md"),
  `# Sprint 12G Sanity Capacity Validation\n\nProject ID: eeuefmhu\nDataset: production\n\nSprint 12G note:\n- Sanity read/write validation could not complete reliably in the local session because the helper hit DNS/network timeout against eeuefmhu.api.sanity.io.\n- Tokens were not printed by the sanitized helper after patching.\n- No Sanity article approvals were applied in this sprint.\n- Before the next approval batch, rerun the permission/read probe and confirm Sanity reads, writes, and image upload are healthy.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-LAWZANA-STATUS.md"),
  `# Sprint 12G Lawzana Status\n\nLawzana was checked only as a low-priority status item in prior sprints. Sprint 12G did not add a homepage badge or spend implementation time here.\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(docs, "SPRINT-12G-GSC-BING-INDEXING-PACK.md"),
  `# Sprint 12G GSC/Bing Indexing Pack\n\nNo new article or static/service URL was published in Sprint 12G because Sanity validation did not complete safely.\n\nSubmit/inspect only:\n- ${SITE}/\n- ${SITE}/resources/blog\n- ${SITE}/sitemap.xml\n- Existing verified live redirected URLs from prior completed sprints\n\nDo not submit hidden drafts, unresolved 404s, preview URLs, or unverified targets.\n`,
  "utf8"
);

const result = {
  sprint: "12G",
  generatedAt: new Date().toISOString(),
  historicalGscRowsImported: topPages.length,
  freshGscFound: false,
  freshBingFound: false,
  blogPublished: 0,
  staticPagesPublished: 0,
  redirectsActivated: 0,
  sanityApplyStatus: "not applied - local Sanity DNS/read validation timed out",
  nextAction: "Rerun Sanity connectivity, then approve only image-ready hidden articles from the search priority queue."
};
fs.writeFileSync(path.join(docs, "SPRINT-12G-RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
fs.writeFileSync(
  path.join(docs, "SPRINT-12G-REPORT.md"),
  `# Sprint 12G Report\n\nGenerated: ${result.generatedAt}\n\n## Summary\n\n- Historical GSC rows imported for prioritization: ${result.historicalGscRowsImported}.\n- Fresh post-launch GSC export found: no.\n- Fresh Bing export found: no.\n- Blog articles published: 0.\n- Static/service pages published: 0.\n- Redirects activated: 0.\n- Sanity apply status: ${result.sanityApplyStatus}.\n\n## Decision\n\nSprint 12G improved search-evidence organization and validation documentation, but did not publish content because Sanity validation did not complete safely. This is preferable to approving hidden legal content without reliable CMS reads.\n`,
  "utf8"
);

console.log(JSON.stringify(result, null, 2));
