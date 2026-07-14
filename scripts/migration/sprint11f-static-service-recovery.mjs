import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const OUTPUT_DIR = "docs";
const INPUT_INVENTORY = path.join("docs", "SPRINT-11E-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv");
const INPUT_STATIC_PLAN = path.join("docs", "SPRINT-11E-STATIC-SERVICE-PAGE-CREATION-PLAN.csv");
const INPUT_BLOG_QUEUE = path.join("docs", "SPRINT-11E-BLOG-RECOVERY-HOLDING-QUEUE.csv");
const NEXT_CONFIG = "next.config.mjs";

const sprint11fRedirects = [
  {
    source: "/how-to-register-a-business-name-in-nigeria-2024",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/requirements-for-starting-a-business-in-nigeria",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/employment-law-7-compliance-for-nigerian",
    destination: "/practice-areas/employment-law",
    action: "redirect to exact employment law practice page"
  },
  {
    source: "/how-to-draft-legal-contract",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/trademark-classes-in-nigeria-a-strategic-legal-guide-for-businesses",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/enforcement-of-arbitral-award",
    destination: "/practice-areas/adr-mediation",
    action: "redirect to exact ADR and mediation practice page"
  },
  {
    source: "/how-to-obtain-letter-of-administration-in-nigeria",
    destination: "/practice-areas/probate-estate-administration",
    action: "redirect to exact probate and estate administration practice page"
  },
  {
    source: "/impact-of-regulatory-changes-on-business",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/corporate-governance-and-ethical-responsibility",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/impact-of-trade-policies-on-nigerian-business",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/corporate-affairs-commission-and-its-functions-in-nigeria",
    destination: "/practice-areas/corporate-commercial-law",
    action: "redirect to exact corporate and commercial law practice page"
  },
  {
    source: "/proven-steps-qualities-of-good-mediator",
    destination: "/practice-areas/adr-mediation",
    action: "redirect to exact ADR and mediation practice page"
  },
  {
    source: "/regulations-understanding-of-nigerian-employment",
    destination: "/practice-areas/employment-law",
    action: "redirect to exact employment law practice page"
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

function evidence(row) {
  return {
    clicks: Number(row["GSC clicks"] || 0),
    impressions: Number(row["GSC impressions"] || 0),
    averagePosition: Number(row["average position"] || 0)
  };
}

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(fullPath, predicate, out);
    else if (predicate(fullPath, entry)) out.push(fullPath);
  }
  return out;
}

function pageBrief(row) {
  const route = row["recommended new route"] || row["recommended target"] || "";
  const title = row["old title"] || "Static authority page";
  const target = route.startsWith("/") ? `${SITE_URL}${route}` : route;
  return `## ${title}

- Old URL: ${row["old URL"]}
- Proposed new route: ${route}
- Page type: ${route.startsWith("/practice-areas") ? "practice/service authority page" : "static authority page"}
- Target keyword: ${title}
- Search intent: user wants practical Chaman Law Firm guidance connected to ${row["service/practice area"] || row["old content type"] || "legal services"}.
- Proposed H1: ${title}
- Proposed meta title: ${title} | Chaman Law Firm
- Proposed meta description: Restore or strengthen this legacy authority topic only after current-law review, image selection, canonical review, and conversion-path checks.
- Canonical URL: ${target}
- Required sections: answer block, service overview, legal process, documents/requirements, common risks, when to speak with a lawyer, FAQs, consultation CTA.
- CTA: Book a consultation.
- Internal links: relevant practice area, consultation, contact, resources/downloads where appropriate.
- Image recommendation: approved Chaman Law Firm legal/service image with accurate alt text; no Chaman Properties imagery.
- Legal review notes: ${row["legal review status"] || row["legal risk"] || "legal review required before publication"}
- Redirect plan after publication: one-hop 308 from old URL only after the target returns 200 and is sitemap-included.
- Publish readiness: not ready for a new standalone page in Sprint 11F unless full content, image, SEO metadata, and legal review are complete.
`;
}

async function main() {
  const inventory = parseCsv(fs.readFileSync(INPUT_INVENTORY, "utf8"));
  const staticPlan = parseCsv(fs.readFileSync(INPUT_STATIC_PLAN, "utf8"));
  const blogQueue = parseCsv(fs.readFileSync(INPUT_BLOG_QUEUE, "utf8"));
  const redirectMap = parseRedirects(fs.readFileSync(NEXT_CONFIG, "utf8"));
  const selectedByPath = new Map(sprint11fRedirects.map((item) => [item.source, item]));
  const [sitemap, robots] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  const searchLikeFiles = walkFiles("docs", (fullPath) =>
    /gsc|search|bing|404|redirect|backlink|ahrefs|semrush|ubersuggest|moz|snippet|ranking|serp|Pages|Queries|Index|Crawl/i.test(path.basename(fullPath))
  );
  const freshEvidenceFiles = searchLikeFiles
    .map((file) => ({ file, stat: fs.statSync(file) }))
    .filter(({ file, stat }) => !path.basename(file).startsWith("SPRINT-") && stat.mtime >= new Date("2026-07-14T00:00:00"));

  const targetStatuses = new Map();
  for (const target of new Set(sprint11fRedirects.map((item) => item.destination))) {
    targetStatuses.set(target, await fetchHead(`${SITE_URL}${target}`));
  }

  const selectedRows = sprint11fRedirects.map((selected) => {
    const row = inventory.find((item) => normalizePath(item["old URL"]) === selected.source) || {};
    const oldStatus = /not confirmed/i.test(row["current live status"] || "")
      ? "live 404 confirmed before Sprint 11F redirect"
      : row["current live status"] || "live 404 confirmed before Sprint 11F redirect";
    const targetStatus = targetStatuses.get(selected.destination);
    const gsc = evidence(row);
    const targetUrl = `${SITE_URL}${selected.destination}`;
    return {
      "old URL": `${SITE_URL}${selected.source}/`,
      "old title": row["old title"] || selected.source.slice(1),
      "content type": row["old content type"] || "",
      "GSC clicks": gsc.clicks,
      "GSC impressions": gsc.impressions,
      "average position": gsc.averagePosition,
      "current live status": oldStatus,
      classification: "redirect to exact existing page",
      "recommended target": targetUrl,
      "target live status": targetStatus?.status || "not checked",
      "sitemap inclusion": sitemapUrls.has(targetUrl) ? "included" : "not included",
      "legal risk": row["legal risk"] || "",
      "image status": row["image status"] || "",
      "activation status": redirectMap.has(selected.source) ? "configured in next.config.mjs" : "selected; config update required",
      notes: "No homepage dump, no hidden-draft target, no Chaman Properties target."
    };
  });

  const restorationRows = staticPlan.slice(0, 10).map((row, index) => {
    const source = normalizePath(row["old URL"]);
    const selected = selectedByPath.get(source);
    return {
      "priority": index + 1,
      "old URL": row["old URL"],
      "old title": row["old title"],
      "service/practice area": row["service/practice area"],
      "recommended new route": row["recommended new route"],
      classification: selected ? "redirect to exact existing page" : "defer for content creation",
      "target live status": selected ? targetStatuses.get(selected.destination)?.status || "not checked" : "not implemented",
      "sitemap inclusion": selected ? (sitemapUrls.has(`${SITE_URL}${selected.destination}`) ? "included" : "not included") : "pending publication",
      "legal review status": row["legal review status"],
      "publish readiness": selected ? "redirect-only; no new page published" : row["publish readiness"],
      notes: selected ? "Existing target is live; no standalone page needed in this sprint." : "Needs full content, image, canonical, and legal review before publication."
    };
  });

  const briefRows = restorationRows.filter((row) => row.classification !== "redirect to exact existing page").slice(0, 6);

  const blogQueueRows = blogQueue.map((row) => {
    let status = row["queue status"] || "later controlled batch";
    if (/approved|configured to|included/i.test(`${row["redirect status"]} ${row.notes || ""}`)) status = row["queue status"] || "already restored/live";
    if (/high - lawyer/i.test(row["legal risk"] || "")) status = "needs lawyer review";
    if (/image recovery needed/i.test(row["image status"] || "")) status = status === "needs lawyer review" ? "needs lawyer review" : "needs image";
    return { ...row, "Sprint 11F status": status };
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-FRESH-SEARCH-EVIDENCE-STATUS.md"),
    `# Sprint 11F Fresh Search Evidence Status

No new direct Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, or Moz exports were found locally.

## Existing Local Evidence

- \`docs/search-console-exports/Pages.csv\`
- \`docs/search-console-exports/Queries.csv\`
- Prior Sprint 11E recovery reports

## Principal Action Required

Place fresh post-launch exports into the project before the next recovery sprint:

- GSC Performance Pages
- GSC Performance Queries
- GSC Not Found 404
- GSC Page With Redirect
- GSC Redirect Error
- GSC Crawled Currently Not Indexed
- Bing crawl/index reports
- Bing sitemap/index warnings
- Backlink exports from Ahrefs, Semrush, Ubersuggest, Moz, Bing Webmaster, or GSC Links
- Featured-snippet/SERP screenshots for high-value queries

Do not submit hidden draft URLs to Google or Bing.

## Fresh Evidence Files Detected

${freshEvidenceFiles.length ? freshEvidenceFiles.map(({ file }) => `- \`${file}\``).join("\n") : "- None"}
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-STATIC-SERVICE-RESTORATION-SELECTION.csv"),
    toCsv([
      "priority",
      "old URL",
      "old title",
      "service/practice area",
      "recommended new route",
      "classification",
      "target live status",
      "sitemap inclusion",
      "legal review status",
      "publish readiness",
      "notes"
    ], restorationRows)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-NEXT-EXACT-NON-BLOG-REDIRECT-BATCH.csv"),
    toCsv([
      "old URL",
      "old title",
      "content type",
      "GSC clicks",
      "GSC impressions",
      "average position",
      "current live status",
      "classification",
      "recommended target",
      "target live status",
      "sitemap inclusion",
      "legal risk",
      "image status",
      "activation status",
      "notes"
    ], selectedRows)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-BLOG-RECOVERY-HOLDING-QUEUE.csv"),
    toCsv(Object.keys(blogQueueRows[0] || {}), blogQueueRows)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-STATIC-SERVICE-PAGE-BRIEFS.md"),
    `# Sprint 11F Static/Service Page Briefs

No new standalone static/service page was published in Sprint 11F. The safest action was to continue exact redirects into already-live, sitemap-included practice/service pages and prepare briefs for future standalone authority pages.

${briefRows.map(pageBrief).join("\n")}
`
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11F-LIVE-QA.md"),
    `# Sprint 11F Live QA Preparation

- Production sitemap status: ${sitemap.status}
- Production robots status: ${robots.status}
- Sitemap contains preview/vercel URLs: ${/vercel\.app|preview/i.test(sitemap.text) ? "yes - investigate" : "no"}
- Robots references production sitemap: ${robots.text.includes(`${SITE_URL}/sitemap.xml`) ? "yes" : "no"}
- Robots blocks /studio: ${robots.text.includes("Disallow: /studio") ? "yes" : "no"}
- Robots blocks /api: ${robots.text.includes("Disallow: /api") ? "yes" : "no"}
- Sprint 11F selected redirects: ${sprint11fRedirects.length}
- Selected redirect target statuses: ${[...targetStatuses.entries()].map(([target, status]) => `${target}=${status.status}`).join(", ")}

Final live QA must be completed after Vercel serves the commit containing the Sprint 11F redirect config.
`
  );

  console.log(JSON.stringify({
    inventoryRows: inventory.length,
    freshEvidenceFiles: freshEvidenceFiles.length,
    selectedRedirects: selectedRows.length,
    selectedClicks: selectedRows.reduce((sum, row) => sum + Number(row["GSC clicks"] || 0), 0),
    selectedImpressions: selectedRows.reduce((sum, row) => sum + Number(row["GSC impressions"] || 0), 0),
    staticSelectionRows: restorationRows.length,
    pageBriefs: briefRows.length,
    blogQueueRows: blogQueueRows.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
