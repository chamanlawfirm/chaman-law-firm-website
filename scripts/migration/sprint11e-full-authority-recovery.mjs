import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const INPUT_INVENTORY = path.join("docs", "SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv");
const NEXT_CONFIG = "next.config.mjs";
const OUTPUT_DIR = "docs";

const sprint11eRedirects = [
  {
    source: "/documents-apostilled-in-nigeria",
    destination: "/practice-areas/notary-public-services",
    action: "redirect to exact current notary public services page"
  },
  {
    source: "/letter-of-administration-in-ogun-state",
    destination: "/practice-areas/probate-estate-administration",
    action: "redirect to exact probate and estate administration practice page"
  },
  {
    source: "/how-to-legalize-or-attest-a-document-in-nigeria",
    destination: "/practice-areas/notary-public-services",
    action: "redirect to exact current notary public services page"
  },
  {
    source: "/role-of-shareholder-in-corporate-decision-making",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/how-to-apply-for-letter-of-administration",
    destination: "/practice-areas/probate-estate-administration",
    action: "redirect to exact probate and estate administration practice page"
  },
  {
    source: "/appointment-of-arbitrators-in-nigeria",
    destination: "/practice-areas/adr-mediation",
    action: "redirect to exact ADR and mediation practice page"
  },
  {
    source: "/rules-and-regulations-of-doing-business-in-niger",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/obtain-letter-of-administration",
    destination: "/practice-areas/probate-estate-administration",
    action: "redirect to exact probate and estate administration practice page"
  },
  {
    source: "/poven-steps-on-what-are-the-stages-of-mediation",
    destination: "/practice-areas/adr-mediation",
    action: "redirect to exact ADR and mediation practice page"
  },
  {
    source: "/when-is-summary-dismissal-appropriate-in-nigeria-labour-law",
    destination: "/practice-areas/employment-law",
    action: "redirect to exact employment law practice page"
  },
  {
    source: "/labour-and-employment-law-in-nigeria",
    destination: "/practice-areas/employment-law",
    action: "redirect to exact employment law practice page"
  },
  {
    source: "/secure-governors-consent-in-ikoyi",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    action: "redirect to exact Governor's Consent service page"
  }
];

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
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows.filter((item) => item.some((value) => value !== ""));
  return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(headers, rows) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n") + "\n";
}

function normalizePath(value) {
  const withoutHost = String(value || "").replace(/^https?:\/\/[^/]+/i, "");
  const pathname = withoutHost.split(/[?#]/)[0].replace(/\/+$/, "");
  return pathname || "/";
}

function parseRedirects(configText) {
  const redirects = new Map();
  const objectPattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = objectPattern.exec(configText))) {
    redirects.set(normalizePath(match[1]), match[2]);
  }
  return redirects;
}

function evidenceFromGsc(text) {
  const match = String(text || "").match(/([\d.]+)\s+clicks;\s+([\d.]+)\s+impressions;\s+avg position\s+([\d.]+)/i);
  return {
    clicks: match ? Number(match[1]) : 0,
    impressions: match ? Number(match[2]) : 0,
    averagePosition: match ? Number(match[3]) : 0
  };
}

function slugFromUrl(url) {
  return normalizePath(url).split("/").filter(Boolean).pop() || "home";
}

function priorityScore(row) {
  const gsc = evidenceFromGsc(row["Google ranking/impression/click evidence"]);
  const positionBoost = gsc.averagePosition && gsc.averagePosition <= 10 ? 100 : gsc.averagePosition <= 20 ? 50 : 0;
  const staticBoost = /^\/practice-areas|^\/lawyers|^\/consultation|^\/contact|^\/media|^\/about/.test(row["best new route"] || "") ? 150 : 0;
  const riskPenalty = /high/i.test(row["legal safety status"] || "") ? 75 : 0;
  return Math.round(gsc.clicks * 5 + gsc.impressions / 100 + positionBoost + staticBoost - riskPenalty);
}

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, predicate, out);
    } else if (predicate(fullPath, entry)) {
      out.push(fullPath);
    }
  }
  return out;
}

async function fetchHead(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: controller.signal });
    return {
      status: response.status,
      location: response.headers.get("location") || "",
      ok: response.status >= 200 && response.status < 300,
      redirect: response.status >= 300 && response.status < 400
    };
  } catch (error) {
    return { status: "error", location: "", ok: false, redirect: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  return { status: response.status, text: await response.text() };
}

function classifyBlogQueue(row) {
  if ((row["approval status"] || "").includes("approved public")) return "already restored/live";
  if ((row["image status"] || "").includes("image recovery needed")) return "needs image";
  if ((row["legal safety status"] || "").includes("high")) return "needs lawyer review";
  if ((row["approval status"] || "").includes("hidden")) return "hidden but repairable";
  if ((row["current live status"] || "").includes("live 404")) return "later batch";
  return "later batch";
}

async function main() {
  if (!fs.existsSync(INPUT_INVENTORY)) throw new Error(`Missing ${INPUT_INVENTORY}`);

  const inventory = parseCsv(fs.readFileSync(INPUT_INVENTORY, "utf8"));
  const redirects = parseRedirects(fs.readFileSync(NEXT_CONFIG, "utf8"));
  const selectedByPath = new Map(sprint11eRedirects.map((item) => [item.source, item]));
  const [sitemap, robots] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  const searchLikeFiles = walkFiles("docs", (fullPath) => /gsc|search|bing|404|redirect|Pages|Queries|Index|Crawl/i.test(path.basename(fullPath)));
  const freshSearchFiles = searchLikeFiles
    .map((file) => ({ file, stat: fs.statSync(file) }))
    .filter(({ file, stat }) => !path.basename(file).startsWith("SPRINT-") && stat.mtime >= new Date("2026-07-13T00:00:00"));

  const backlinkEvidenceFiles = walkFiles("docs", (fullPath) =>
    /backlink|ahrefs|semrush|ubersuggest|snippet|ranking|serp/i.test(path.basename(fullPath))
  );
  const directBacklinkFiles = backlinkEvidenceFiles.filter((file) =>
    /backlink|ahrefs|semrush|ubersuggest/i.test(path.basename(file)) && !path.basename(file).startsWith("SPRINT-")
  );
  const directFeaturedSnippetFiles = backlinkEvidenceFiles.filter((file) => /snippet/i.test(path.basename(file)) && !path.basename(file).startsWith("SPRINT-"));
  const directRankingScreenshotFiles = backlinkEvidenceFiles.filter((file) => /serp|screenshot/i.test(path.basename(file)));

  const headers = [
    "old URL",
    "old title",
    "old meta title",
    "old meta description",
    "old content type",
    "current live status",
    "GSC clicks",
    "GSC impressions",
    "average position",
    "backlink evidence",
    "featured-snippet evidence",
    "current redirect status",
    "current 404 status",
    "Sanity public status",
    "Sanity hidden/draft status",
    "recommended action",
    "recommended target",
    "target live status",
    "sitemap inclusion",
    "canonical status",
    "legal risk",
    "image status",
    "priority score",
    "notes"
  ];

  const nextBatchTargetStatuses = new Map();
  const uniqueTargets = [...new Set(sprint11eRedirects.map((item) => item.destination))];
  for (const target of uniqueTargets) {
    nextBatchTargetStatuses.set(target, await fetchHead(`${SITE_URL}${target}`));
  }

  const updatedInventory = inventory.map((row) => {
    const pathname = normalizePath(row["old URL"]);
    const configuredTarget = redirects.get(pathname);
    const selected = selectedByPath.get(pathname);
    const gsc = evidenceFromGsc(row["Google ranking/impression/click evidence"]);
    const recommendedTarget = selected?.destination || configuredTarget || row["best new route"] || "";
    const absoluteTarget = recommendedTarget.startsWith("http") ? recommendedTarget : `${SITE_URL}${recommendedTarget}`;
    const targetHead = selected ? nextBatchTargetStatuses.get(selected.destination) : null;
    const sitemapIncluded = sitemapUrls.has(absoluteTarget);
    const publicStatus = /approved public/i.test(row["approval status"] || "") ? "approved public" : "not public";
    const hiddenStatus = /hidden|not approved/i.test(row["approval status"] || "") ? "hidden/unapproved" : "none detected";
    const recommendedAction = selected
      ? selected.action
      : configuredTarget
        ? "monitor existing redirect"
        : (row["best new route"] || "").startsWith("/resources/blog")
          ? "hold for controlled blog restoration"
          : /hidden/i.test(row["current live status"] || "")
            ? "defer until legal/image review"
            : "evaluate for static/service restoration";

    return {
      "old URL": row["old URL"],
      "old title": row["old title"],
      "old meta title": row["old meta title"],
      "old meta description": row["old meta description"],
      "old content type": row["old content type"],
      "current live status": row["current live status"],
      "GSC clicks": gsc.clicks,
      "GSC impressions": gsc.impressions,
      "average position": gsc.averagePosition,
      "backlink evidence": "not available locally",
      "featured-snippet evidence": row["featured snippet evidence"] || "not available locally",
      "current redirect status": configuredTarget ? `configured to ${configuredTarget}` : selected ? "selected for Sprint 11E redirect" : "not configured",
      "current 404 status": /404/i.test(row["current live status"] || "") ? "currently 404 or previously confirmed 404" : "not confirmed as 404 in this pass",
      "Sanity public status": publicStatus,
      "Sanity hidden/draft status": hiddenStatus,
      "recommended action": recommendedAction,
      "recommended target": recommendedTarget,
      "target live status": targetHead ? `${targetHead.status}` : sitemapIncluded ? "sitemap-included target" : "not live-checked in Sprint 11E",
      "sitemap inclusion": sitemapIncluded ? "included" : "not included",
      "canonical status": absoluteTarget.startsWith(SITE_URL) ? "production canonical target" : "review canonical",
      "legal risk": row["legal safety status"],
      "image status": row["image status"],
      "priority score": priorityScore(row),
      notes: selected ? "Sprint 11E urgent non-blog rescue candidate; target is existing public service/practice page." : row.notes || ""
    };
  });

  const batchHeaders = [
    "priority rank",
    "old URL",
    "old title",
    "GSC clicks",
    "GSC impressions",
    "average position",
    "old content type",
    "current live status",
    "action",
    "recommended target",
    "target live status",
    "sitemap inclusion",
    "legal risk",
    "activation status",
    "notes"
  ];

  const batchRows = sprint11eRedirects.map((selected) => {
    const row = inventory.find((item) => normalizePath(item["old URL"]) === selected.source) || {};
    const gsc = evidenceFromGsc(row["Google ranking/impression/click evidence"]);
    const targetHead = nextBatchTargetStatuses.get(selected.destination);
    const absoluteTarget = `${SITE_URL}${selected.destination}`;
    return {
      "priority rank": row["priority rank"] || "",
      "old URL": `${SITE_URL}${selected.source}/`,
      "old title": row["old title"] || slugFromUrl(selected.source),
      "GSC clicks": gsc.clicks,
      "GSC impressions": gsc.impressions,
      "average position": gsc.averagePosition,
      "old content type": row["old content type"] || "",
      "current live status": row["current live status"] || "not confirmed",
      action: selected.action,
      "recommended target": absoluteTarget,
      "target live status": targetHead ? `${targetHead.status}` : "not checked",
      "sitemap inclusion": sitemapUrls.has(absoluteTarget) ? "included" : "not included",
      "legal risk": row["legal safety status"] || "",
      "activation status": redirects.get(selected.source) ? "configured in next.config.mjs" : "selected; config update required",
      notes: "No hidden draft target; no homepage fallback; Chaman Law Firm public route only."
    };
  });

  const staticPlanRows = updatedInventory
    .filter((row) => {
      const target = row["recommended target"] || "";
      return (
        !row["current redirect status"].startsWith("configured") &&
        !row["current redirect status"].startsWith("selected") &&
        !target.startsWith("/resources/blog") &&
        row["old URL"] !== `${SITE_URL}/`
      );
    })
    .sort((a, b) => Number(b["priority score"]) - Number(a["priority score"]))
    .slice(0, 80)
    .map((row) => ({
      "old URL": row["old URL"],
      "old title": row["old title"],
      "service/practice area": row["old content type"],
      "recommended new route": row["recommended target"],
      "required page template": row["recommended target"].startsWith("/practice-areas") ? "existing practice/service page or dedicated static authority page" : "static authority page",
      "required content sections": "H1, answer block, scope of service, process, documents/requirements, FAQs, consultation CTA, internal links",
      "proposed H1": row["old title"],
      "proposed meta title": `${row["old title"]} | Chaman Law Firm`,
      "proposed meta description": row["old meta description"] || "Recover and review legacy authority content before publication.",
      "canonical plan": `${SITE_URL}${row["recommended target"]}`,
      CTA: "Book a consultation",
      "internal links": "Practice area, consultation, contact, related downloads where relevant",
      "image recommendation": row["image status"],
      "legal review status": row["legal risk"],
      "publish readiness": "not ready until content, image, canonical, and lawyer review are complete",
      "redirect plan after publication": "one-hop 308 only after target returns 200 and is sitemap-included"
    }));

  const blogRows = updatedInventory
    .filter((row) => (row["recommended target"] || "").startsWith("/resources/blog"))
    .map((row) => ({
      "old URL": row["old URL"],
      slug: slugFromUrl(row["old URL"]),
      title: row["old title"],
      "GSC clicks": row["GSC clicks"],
      "GSC impressions": row["GSC impressions"],
      "average position": row["average position"],
      "queue status": classifyBlogQueue({
        "approval status": `${row["Sanity public status"]} ${row["Sanity hidden/draft status"]}`,
        "image status": row["image status"],
        "legal safety status": row["legal risk"],
        "current live status": row["current live status"]
      }),
      "recommended target": row["recommended target"],
      "redirect status": row["current redirect status"],
      "legal risk": row["legal risk"],
      "image status": row["image status"],
      notes: "Broad blog migration remains on hold; restore only through controlled lawyer-reviewed batches."
    }));

  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11E-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"), toCsv(headers, updatedInventory));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11E-NEXT-URGENT-NON-BLOG-404-RESCUE-BATCH.csv"), toCsv(batchHeaders, batchRows));
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11E-STATIC-SERVICE-PAGE-CREATION-PLAN.csv"),
    toCsv([
      "old URL",
      "old title",
      "service/practice area",
      "recommended new route",
      "required page template",
      "required content sections",
      "proposed H1",
      "proposed meta title",
      "proposed meta description",
      "canonical plan",
      "CTA",
      "internal links",
      "image recommendation",
      "legal review status",
      "publish readiness",
      "redirect plan after publication"
    ], staticPlanRows)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11E-BLOG-RECOVERY-HOLDING-QUEUE.csv"),
    toCsv([
      "old URL",
      "slug",
      "title",
      "GSC clicks",
      "GSC impressions",
      "average position",
      "queue status",
      "recommended target",
      "redirect status",
      "legal risk",
      "image status",
      "notes"
    ], blogRows)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11E-FRESH-GSC-BING-EXPORT-STATUS.md"),
    `# Sprint 11E Fresh GSC/Bing Export Status

Fresh post-launch Google Search Console or Bing exports were not found locally.

## Local Evidence Found

- Existing GSC Pages export: \`docs/search-console-exports/Pages.csv\`
- Existing GSC Queries export: \`docs/search-console-exports/Queries.csv\`
- Latest local search-data source remains the June 20, 2026 export set.
- Sprint 11E generated files are reports derived from existing local data, not fresh platform exports.

## Principal Action Required

Export and place fresh post-launch files in the project before the next recovery pass:

- Google Search Console Performance Pages export
- Google Search Console Performance Queries export
- Google Search Console Not Found 404 export
- Google Search Console Page With Redirect export
- Google Search Console Redirect Error export
- Google Search Console Crawled Currently Not Indexed export
- Bing Webmaster crawl/index report
- Bing sitemap/index warning report

Do not submit hidden draft URLs for inspection.
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11E-BACKLINK-FEATURED-SNIPPET-EVIDENCE-STATUS.md"),
    `# Sprint 11E Backlink and Featured-Snippet Evidence Status

- Backlink evidence available locally: ${directBacklinkFiles.length ? "yes" : "no"}
- Featured-snippet evidence available locally: ${directFeaturedSnippetFiles.length ? "yes" : "no"}
- Ranking screenshot evidence available locally: ${directRankingScreenshotFiles.length ? "yes" : "no"}

## Files Considered

${backlinkEvidenceFiles.length ? backlinkEvidenceFiles.map((file) => `- \`${file}\``).join("\n") : "- No backlink, Ahrefs, Semrush, Ubersuggest, SERP screenshot, or featured-snippet evidence files were found."}

The files considered include historical ranking-priority sprint reports, but those are not direct backlink exports, featured-snippet exports, or SERP screenshots. They should not be treated as proof of current backlink or featured-snippet ownership.

## Manual Evidence Needed

For the next sprint, collect:

- Top linked legacy URLs from Ahrefs, Semrush, Ubersuggest, Bing Webmaster, or Search Console Links.
- Screenshots or exports for Google featured snippets.
- Manual SERP evidence for high-value queries where Chaman Law Firm still appears.
- Any backlink reports showing old URLs that currently return 404.

Use the evidence to prioritize rescue order; do not infer backlinks from impressions alone.
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11E-LIVE-QA.md"),
    `# Sprint 11E Live QA Preparation

Generated from the Sprint 11D inventory and current production sitemap/robots.

- Production sitemap status: ${sitemap.status}
- Production robots status: ${robots.status}
- Sitemap contains preview/vercel URLs: ${/vercel\.app|preview/i.test(sitemap.text) ? "yes - investigate" : "no"}
- Robots references production sitemap: ${robots.text.includes(`${SITE_URL}/sitemap.xml`) ? "yes" : "no"}
- Robots blocks /studio: ${robots.text.includes("Disallow: /studio") ? "yes" : "no"}
- Robots blocks /api: ${robots.text.includes("Disallow: /api") ? "yes" : "no"}
- Sprint 11E selected redirects: ${sprint11eRedirects.length}
- Selected redirect target statuses: ${[...nextBatchTargetStatuses.entries()].map(([target, status]) => `${target}=${status.status}`).join(", ")}

Final live QA must be run after Vercel deploys the commit containing the redirect config.
`
  );

  const totalBatchClicks = batchRows.reduce((sum, row) => sum + Number(row["GSC clicks"] || 0), 0);
  const totalBatchImpressions = batchRows.reduce((sum, row) => sum + Number(row["GSC impressions"] || 0), 0);

  console.log(JSON.stringify({
    inputRows: inventory.length,
    updatedInventoryRows: updatedInventory.length,
    freshSearchEvidenceFiles: freshSearchFiles.length,
    backlinkEvidenceFiles: backlinkEvidenceFiles.length,
    nextBatchRows: batchRows.length,
    nextBatchClicks: totalBatchClicks,
    nextBatchImpressions: totalBatchImpressions,
    staticPlanRows: staticPlanRows.length,
    blogQueueRows: blogRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
