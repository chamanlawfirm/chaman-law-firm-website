import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";

const paths = {
  sprint11eInventory: path.join("docs", "SPRINT-11E-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"),
  sprint11fStaticSelection: path.join("docs", "SPRINT-11F-STATIC-SERVICE-RESTORATION-SELECTION.csv"),
  sprint11fBlogQueue: path.join("docs", "SPRINT-11F-BLOG-RECOVERY-HOLDING-QUEUE.csv"),
  top1000: path.join("docs", "SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv"),
  gscPages: path.join("docs", "search-console-exports", "Pages.csv"),
  gscQueries: path.join("docs", "search-console-exports", "Queries.csv"),
  nextConfig: "next.config.mjs",
  masterQueue: path.join("docs", "SPRINT-11G-MASTER-LEGACY-MIGRATION-QUEUE.csv"),
  top100Batch: path.join("docs", "SPRINT-11G-TOP-100-LEGACY-URL-BATCH.csv"),
  staticBatch: path.join("docs", "SPRINT-11G-STATIC-SERVICE-RESTORATION-BATCH.csv"),
  blogBatch: path.join("docs", "SPRINT-11G-BLOG-RECOVERY-BATCH.csv"),
  seoChecklist: path.join("docs", "SPRINT-11G-SEO-AEO-GEO-OPTIMIZATION-CHECKLIST.csv"),
  imageMap: path.join("docs", "SPRINT-11G-IMAGE-RECOVERY-AND-ASSIGNMENT-MAP.csv"),
  redirectBatch: path.join("docs", "SPRINT-11G-REDIRECT-ACTIVATION-BATCH.csv"),
  evidenceStatus: path.join("docs", "SPRINT-11G-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  report: path.join("docs", "SPRINT-11G-FULL-LEGACY-MIGRATION-FACTORY-REPORT.md")
};

const safeStaticRedirectSources = new Set([
  "/who-can-be-a-notary-public",
  "/corporate-affairs-commission-in-nigeria",
  "/7-step-citizenship-application-in-nigeria",
  "/how-to-open-a-company-bank-account-in-nigeria",
  "/registering-a-private-security-company",
  "/corporate-governance-challenges-in-companies",
  "/registration-of-a-money-lending-company",
  "/how-to-increase-a-company-share",
  "/4-proven-steps-on-how-to-enforce-a-contract",
  "/corporate-governance-and-business-ethics"
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value !== "")) rows.push(row);
  }

  const [headers = [], ...bodyRows] = rows;
  return bodyRows.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), (values[index] || "").trim()])));
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.writeFileSync(filePath, [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n") + "\n");
}

function number(value) {
  const parsed = Number(String(value || "").replace(/[%,$]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePath(value) {
  const withoutHost = String(value || "").replace(/^https?:\/\/(?:www\.)?[^/]+/i, "");
  const clean = withoutHost.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean || "/";
}

function absoluteUrl(route) {
  if (!route) return "";
  if (/^https?:\/\//i.test(route)) return route.replace(/^https:\/\/www\./i, "https://");
  return `${SITE_URL}${route.startsWith("/") ? route : `/${route}`}`;
}

function slugFromUrl(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function titleFromSlug(slug) {
  return String(slug || "Home")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bC O\b/g, "C of O")
    .replace(/\bCac\b/g, "CAC");
}

function routeType(route, slug = "") {
  const text = `${route} ${slug}`.toLowerCase();
  if (route.startsWith("/resources/blog")) return "blog";
  if (route.startsWith("/practice-areas")) {
    if (/governor|consent|debt|notary|immigration|employment|corporate|probate|family|adr|litigation|property/.test(text)) return "service";
    return "practice";
  }
  if (route.startsWith("/lawyers")) return "lawyer profile";
  if (/consultation|contact/.test(route)) return "consultation";
  if (/media|about|privacy|terms|cookie|disclaimer/.test(route)) return "static";
  return "other";
}

function topicFromText(slug, title = "") {
  const text = `${slug} ${title}`.toLowerCase();
  if (/notary|apostille|legalise|legalize|attest|document/.test(text)) return "Notary Public";
  if (/company|corporate|business|startup|contract|share|director|cac|bank|money-lending|trademark|maritime/.test(text)) return "Corporate and Commercial Law";
  if (/visa|immigration|citizenship|residency|passport/.test(text)) return "Immigration";
  if (/employment|labour|employee|trade-union|workplace/.test(text)) return "Employment Law";
  if (/debt|recovery|creditor/.test(text)) return "Debt Recovery";
  if (/probate|will|inheritance|estate|administration/.test(text)) return "Probate and Estate Administration";
  if (/mediator|mediation|arbitr|adr/.test(text)) return "ADR / Mediation";
  if (/court|litigation|dispute|police|bail|injunction/.test(text)) return "Litigation and Dispute Resolution";
  if (/family|marriage|divorce|custody|child/.test(text)) return "Family Law";
  if (/land|tenant|property|real-estate|c-of-o|certificate-of-occupancy|deed|survey|title|rent/.test(text)) return "Property and Real Estate Law";
  return "General Legal Education";
}

function detectRisk(slug, title = "", meta = "") {
  const text = `${slug} ${title} ${meta}`.toLowerCase();
  if (/luxury|lekki.*estate|land banking|property sales|buy now|developer|investment guidance|mansion|gated estate/.test(text)) {
    return "blocked - possible Chaman Properties/property-sales contamination";
  }
  if (/evict|quit notice|self-help|forceful|restraining|criminal|police bail|domestic violence|custody|divorce|inheritance|probate|intestacy/.test(text)) {
    return "high - lawyer review required before publication";
  }
  if (/tax|immigration|visa|employment|debt|contract|property|tenant|land|governor|c-of-o|company|money-lending/.test(text)) {
    return "medium - verify current law and facts before publication";
  }
  return "low/medium - editorial and legal review still required";
}

function duplicateRisk(row) {
  const target = row["recommended final URL"] || row["recommended target"] || "";
  if (target.includes("/practice-areas/")) return "medium - confirm old topic should merge into existing practice/service page";
  if (row["likely page type"] === "blog" && row["Sanity public status"] === "approved public") return "low - already public";
  if (row["Sanity hidden/draft status"] === "hidden/unapproved") return "medium - compare hidden draft against public practice/page before approval";
  return "low/medium - compare against existing live content before publication";
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) {
    redirects.set(normalizePath(match[1]), match[2]);
  }
  return redirects;
}

function redirectTargetFromStatus(value) {
  const text = String(value || "").trim();
  const match = text.match(/^configured to\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function score(row) {
  const clicks = number(row["GSC clicks"]);
  const impressions = number(row["GSC impressions"]);
  const position = number(row["average position"]);
  const target = row["recommended final URL"] || "";
  const routeBoost = /practice-areas|lawyers|consultation|contact|media/.test(target) ? 140 : 0;
  const positionBoost = position && position <= 5 ? 180 : position && position <= 10 ? 120 : position && position <= 20 ? 60 : 0;
  const unresolvedBoost = /404|hidden|not restored|not configured|unknown/.test(`${row["current status"]} ${row["current redirect target"]}`.toLowerCase()) ? 120 : 0;
  const riskPenalty = /^high|blocked/i.test(row["legal risk"]) ? 120 : /medium/i.test(row["legal risk"]) ? 30 : 0;
  return Math.round(clicks * 5 + impressions / 100 + positionBoost + routeBoost + unresolvedBoost - riskPenalty);
}

function addOrMerge(map, input) {
  const pathKey = normalizePath(input["old URL"] || input.oldUrl || input.url);
  if (!pathKey || pathKey === "/") {
    if (!input.allowHome) return;
  }
  const existing = map.get(pathKey) || {
    pathKey,
    "old URL": absoluteUrl(pathKey),
    "old title": titleFromSlug(slugFromUrl(pathKey)),
    "old meta title": "",
    "old meta description": "",
    "old content type": "",
    "current status": "unknown",
    "GSC clicks": 0,
    "GSC impressions": 0,
    "average position": 0,
    "backlink evidence": "not available locally",
    "featured-snippet evidence": "not available locally",
    "ranking evidence": "not available locally",
    "current redirect target": "",
    "Sanity public status": "not public",
    "Sanity hidden/draft status": "none detected",
    "old image availability": "not confirmed",
    "recommended action": "",
    "recommended final URL": "",
    "canonical URL": "",
    "sitemap inclusion status": "not checked",
    "image status": "image recovery needed",
    "legal risk": "",
    "duplicate/cannibalization risk": "",
    "SEO priority score": 0,
    "AEO/GEO opportunity": "",
    notes: ""
  };

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;
    if (["GSC clicks", "GSC impressions"].includes(key)) existing[key] = Math.max(number(existing[key]), number(value));
    else if (key === "average position") existing[key] = number(existing[key]) ? Math.min(number(existing[key]), number(value)) : number(value);
    else if (!existing[key] || existing[key] === "unknown" || existing[key] === "not confirmed" || existing[key] === "not available locally") existing[key] = value;
  }
  map.set(pathKey, existing);
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
  try {
    const response = await fetch(url, { redirect: "follow" });
    return { status: response.status, text: await response.text() };
  } catch (error) {
    return { status: "error", text: "", error: error.message };
  }
}

async function querySanityPosts() {
  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || process.env.SANITY_API_TOKEN;
  if (!token) return { tokenDetected: false, posts: [] };
  const url = new URL(`/v${API_VERSION}/data/query/${DATASET}`, `https://${PROJECT_ID}.api.sanity.io`);
  url.searchParams.set("perspective", "raw");
  url.searchParams.set(
    "query",
    `*[_type == "post"]{
      _id,
      title,
      "slug": slug.current,
      lawFirmApproved,
      publishedAt,
      "authorName": author->name,
      "hasBody": defined(body[0]),
      "bodyBlocks": count(body[]),
      "bodyText": pt::text(body),
      "hasImage": defined(mainImage.asset._ref),
      "hasAlt": defined(mainImage.alt) && length(mainImage.alt) > 8,
      "imageAlt": mainImage.alt,
      "seoTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "canonical": seo.canonicalUrl
    }`
  );
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) return { tokenDetected: true, posts: [], error: `Sanity query failed with ${response.status}` };
  const payload = await response.json();
  return { tokenDetected: true, posts: payload.result || [] };
}

function classifyRecommendedAction(row) {
  const target = normalizePath(row["recommended final URL"]);
  const legalRisk = row["legal risk"] || "";
  if (/blocked/.test(legalRisk)) return "reject/archive";
  if (row["current redirect target"]) return "exact redirect to existing live equivalent";
  if (row["Sanity public status"] === "approved public") return "exact redirect to existing live equivalent";
  if (safeStaticRedirectSources.has(row.pathKey)) return "exact redirect now";
  if (target.startsWith("/practice-areas") || target.startsWith("/lawyers") || target === "/media" || target === "/consultation") {
    return /^high/.test(legalRisk) ? "keep hidden pending legal review" : "merge into existing stronger live page";
  }
  if (target.startsWith("/resources/blog")) {
    if (row["Sanity hidden/draft status"] === "hidden/unapproved") return /^high/.test(legalRisk) ? "keep hidden pending legal review" : "keep hidden pending image/source repair";
    return "restore as blog post";
  }
  return "defer for duplicate/cannibalization review";
}

function contentTypeForTarget(target, slug, title) {
  const route = normalizePath(target);
  const type = routeType(route, slug);
  if (type === "service") return "service";
  if (type === "practice") return "practice";
  if (type === "lawyer profile") return "lawyer profile";
  if (type === "consultation") return "consultation";
  if (type === "static") return "static";
  if (/resources\/blog/.test(route)) return "blog";
  if (/media|gallery/.test(`${slug} ${title}`.toLowerCase())) return "static";
  return "other";
}

function freshEvidenceFiles() {
  const matches = [];
  const stack = ["docs"];
  while (stack.length) {
    const dir = stack.pop();
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (!/gsc|search|bing|404|redirect|backlink|ahrefs|semrush|ubersuggest|moz|snippet|ranking|serp|Pages|Queries|Index|Crawl/i.test(entry.name)) {
        continue;
      }
      if (entry.name.startsWith("SPRINT-11G")) continue;
      const stat = fs.statSync(fullPath);
      if (!entry.name.startsWith("SPRINT-") && stat.mtime >= new Date("2026-07-14T00:00:00")) {
        matches.push({ file: fullPath, modified: stat.mtime.toISOString() });
      }
    }
  }
  return matches;
}

function qaRows(urls, sitemapUrls) {
  return urls.map((url) => ({
    URL: url,
    "sitemap status": sitemapUrls.has(url) ? "included" : "not included",
    "canonical expectation": url.startsWith(SITE_URL) ? "production URL" : "review"
  }));
}

async function main() {
  loadEnvFile(".env.local");

  const inventory = readCsv(paths.sprint11eInventory);
  const staticSelection = readCsv(paths.sprint11fStaticSelection);
  const blogQueue = readCsv(paths.sprint11fBlogQueue);
  const top1000 = readCsv(paths.top1000);
  const gscPages = readCsv(paths.gscPages);
  const configText = fs.readFileSync(paths.nextConfig, "utf8");
  const redirectMap = parseRedirects(configText);
  const [sitemap, robots, sanity] = await Promise.all([
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`),
    querySanityPosts()
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const publicPosts = sanity.posts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."));
  const hiddenPosts = sanity.posts.filter((post) => post.lawFirmApproved !== true || post._id.startsWith("drafts."));
  const publicBySlug = new Map(publicPosts.map((post) => [post.slug, post]));
  const hiddenBySlug = new Map(hiddenPosts.map((post) => [post.slug, post]));

  const queue = new Map();
  for (const row of inventory) {
    const gsc = {
      clicks: number(row["GSC clicks"]),
      impressions: number(row["GSC impressions"]),
      position: number(row["average position"])
    };
    addOrMerge(queue, {
      "old URL": row["old URL"],
      "old title": row["old title"],
      "old meta title": row["old meta title"],
      "old meta description": row["old meta description"],
      "old content type": row["old content type"],
      "current status": row["current live status"],
      "GSC clicks": gsc.clicks,
      "GSC impressions": gsc.impressions,
      "average position": gsc.position,
      "backlink evidence": row["backlink evidence"],
      "featured-snippet evidence": row["featured-snippet evidence"] || row["featured snippet evidence"],
      "current redirect target": redirectTargetFromStatus(row["current redirect status"]),
      "Sanity public status": row["Sanity public status"],
      "Sanity hidden/draft status": row["Sanity hidden/draft status"],
      "old image availability": row["image status"],
      "recommended final URL": row["recommended target"],
      "canonical URL": absoluteUrl(row["recommended target"]),
      "sitemap inclusion status": row["sitemap inclusion"],
      "image status": row["image status"],
      "legal risk": row["legal risk"],
      notes: row.notes
    });
  }

  for (const row of blogQueue) {
    addOrMerge(queue, {
      "old URL": row["old URL"],
      "old title": row.title,
      "old content type": "blog",
      "GSC clicks": row["GSC clicks"],
      "GSC impressions": row["GSC impressions"],
      "average position": row["average position"],
      "current redirect target": redirectTargetFromStatus(row["redirect status"]),
      "recommended final URL": row["recommended target"],
      "canonical URL": absoluteUrl(row["recommended target"]),
      "old image availability": row["image status"],
      "image status": row["image status"],
      "legal risk": row["legal risk"],
      notes: row.notes
    });
  }

  for (const row of staticSelection) {
    addOrMerge(queue, {
      "old URL": row["old URL"],
      "old title": row["old title"],
      "old content type": row["service/practice area"],
      "recommended final URL": row["recommended new route"],
      "canonical URL": absoluteUrl(row["recommended new route"]),
      "legal risk": row["legal review status"],
      "image status": "image recovery needed",
      notes: row.notes
    });
  }

  for (const row of top1000) {
    addOrMerge(queue, {
      "old URL": row["old URL"],
      "old title": row.title,
      "old meta title": row["SEO title"],
      "old meta description": row["meta description"],
      "old content type": row.category || row["practice area"],
      "GSC clicks": row.clicks,
      "GSC impressions": row.impressions,
      "recommended final URL": row["proposed new URL"],
      "canonical URL": absoluteUrl(row["proposed new URL"]),
      "old image availability": row["image status"],
      "image status": row["image status"],
      "legal risk": row["legal review status"],
      notes: row.notes
    });
  }

  for (const row of gscPages) {
    addOrMerge(queue, {
      "old URL": row["Top pages"],
      "GSC clicks": row.Clicks,
      "GSC impressions": row.Impressions,
      "average position": row.Position
    });
  }

  const targetRoutes = new Set();
  for (const row of queue.values()) {
    const pathKey = row.pathKey;
    const slug = slugFromUrl(pathKey);
    const publicDoc = publicBySlug.get(slug);
    const hiddenDoc = hiddenBySlug.get(slug);
    const configured = redirectMap.get(pathKey);
    if (configured) row["current redirect target"] = configured;
    if (publicDoc) {
      row["Sanity public status"] = "approved public";
      row["recommended final URL"] = `/resources/blog/${slug}`;
      row["canonical URL"] = absoluteUrl(row["recommended final URL"]);
      row["old image availability"] = publicDoc.hasImage ? (publicDoc.hasAlt ? "image and alt present in Sanity" : "image present; alt review needed") : row["old image availability"];
      row["image status"] = row["old image availability"];
    }
    if (hiddenDoc && row["Sanity public status"] !== "approved public") {
      row["Sanity hidden/draft status"] = "hidden/unapproved";
      if (hiddenDoc.seoTitle && !row["old meta title"]) row["old meta title"] = hiddenDoc.seoTitle;
      if (hiddenDoc.metaDescription && !row["old meta description"]) row["old meta description"] = hiddenDoc.metaDescription;
      row["old image availability"] = hiddenDoc.hasImage ? (hiddenDoc.hasAlt ? "image and alt present in hidden Sanity draft" : "image present in hidden Sanity draft; alt review needed") : row["old image availability"];
      row["image status"] = row["old image availability"];
    }
    if (!row["recommended final URL"]) {
      row["recommended final URL"] = publicDoc ? `/resources/blog/${slug}` : `/resources/blog/${slug}`;
      row["canonical URL"] = absoluteUrl(row["recommended final URL"]);
    }
    const finalPath = normalizePath(row["recommended final URL"]);
    row["likely page type"] = contentTypeForTarget(finalPath, slug, row["old title"]);
    row["old content type"] = row["old content type"] || topicFromText(slug, row["old title"]);
    row["legal risk"] = row["legal risk"] || detectRisk(slug, row["old title"], row["old meta description"]);
    row["recommended action"] = classifyRecommendedAction(row);
    row["canonical URL"] = row["canonical URL"] || absoluteUrl(finalPath);
    row["sitemap inclusion status"] = sitemapUrls.has(row["canonical URL"]) ? "included" : row["sitemap inclusion status"] || "not included";
    row["duplicate/cannibalization risk"] = duplicateRisk(row);
    row["SEO priority score"] = score(row);
    row["AEO/GEO opportunity"] = row["likely page type"] === "blog" ? "answer block, FAQs, lawyer CTA, practice-area links" : "service answer block, process steps, FAQs, consultation CTA";
    if (finalPath && !finalPath.startsWith("/resources/blog")) targetRoutes.add(finalPath);
  }

  const targetStatuses = new Map();
  for (const route of targetRoutes) {
    targetStatuses.set(route, await fetchHead(absoluteUrl(route)));
  }

  const masterRows = [...queue.values()]
    .filter((row) => row.pathKey)
    .sort((a, b) => number(b["SEO priority score"]) - number(a["SEO priority score"]));

  const top100Rows = masterRows
    .filter((row) => row.pathKey !== "/")
    .filter((row) => !/blocked/.test(row["legal risk"]))
    .filter((row) => !/approved public/.test(row["Sanity public status"]) || !row["current redirect target"])
    .slice(0, 100)
    .map((row, index) => ({
      "priority rank": index + 1,
      "old URL": row["old URL"],
      "old title": row["old title"],
      "likely page type": row["likely page type"],
      "GSC clicks": row["GSC clicks"],
      "GSC impressions": row["GSC impressions"],
      "average position": row["average position"],
      "current status": row["current status"],
      "classification": row["recommended action"],
      "recommended final URL": row["recommended final URL"],
      "canonical URL": row["canonical URL"],
      "sitemap inclusion status": row["sitemap inclusion status"],
      "legal risk": row["legal risk"],
      "image status": row["image status"],
      "approval status": row["Sanity public status"] === "approved public" ? "already public" : "not approved",
      "redirect status": row["current redirect target"] ? `configured to ${row["current redirect target"]}` : "not configured",
      notes: row.notes || ""
    }));

  const staticPool = masterRows
    .filter((row) => ["static", "service", "practice", "lawyer profile", "consultation"].includes(row["likely page type"]))
    .filter((row) => row.pathKey !== "/")
    .filter((row) => !/blocked/.test(row["legal risk"]))
    .sort((a, b) => {
      const aSafe = safeStaticRedirectSources.has(a.pathKey) ? 1 : 0;
      const bSafe = safeStaticRedirectSources.has(b.pathKey) ? 1 : 0;
      if (aSafe !== bSafe) return bSafe - aSafe;
      return number(b["SEO priority score"]) - number(a["SEO priority score"]);
    });

  const staticRows = staticPool
    .slice(0, 20)
    .map((row) => {
      const finalPath = normalizePath(row["recommended final URL"]);
      const targetStatus = targetStatuses.get(finalPath);
      const sourcePath = normalizePath(row["old URL"]);
      const safeTargetReady =
        safeStaticRedirectSources.has(sourcePath) &&
        targetStatus?.status === 200 &&
        sitemapUrls.has(absoluteUrl(finalPath)) &&
        !/^high|blocked/i.test(row["legal risk"]);
      const alreadyConfigured = redirectMap.has(sourcePath);
      return {
        "old URL": row["old URL"],
        "proposed final URL": row["recommended final URL"],
        "page type": row["likely page type"],
        H1: row["old title"],
        "meta title": `${row["old title"]} | Chaman Law Firm`,
        "meta description": row["old title"] ? `Chaman Law Firm guidance on ${row["old title"]}. Speak with our legal team for advice tailored to your matter.` : "",
        canonical: absoluteUrl(finalPath),
        "required sections": "answer block; service overview; legal process; documents/requirements; risks; FAQs; consultation CTA",
        CTA: "Book a consultation",
        "internal links": "relevant practice area; consultation; contact; related resources",
        "external authority links if appropriate": "government/legal authority links only after lawyer review",
        "image recommendation": "approved Chaman Law Firm legal/service image with accurate alt text",
        "legal review status": row["legal risk"],
        "publish readiness": safeTargetReady ? "redirect-only recovery ready; existing target is live" : "content brief only; standalone page not ready",
        "redirect plan": safeTargetReady
          ? alreadyConfigured
            ? "configured in next.config.mjs; verify live after deployment"
            : "activate exact one-hop 308 to existing live equivalent"
          : "defer until final target is live and sitemap-safe"
      };
    });

  const blogRows = masterRows
    .filter((row) => row["likely page type"] === "blog")
    .filter((row) => row["Sanity public status"] !== "approved public")
    .slice(0, 50)
    .map((row, index) => {
      const hidden = row["Sanity hidden/draft status"] === "hidden/unapproved";
      const imageReady = /image and alt present/i.test(row["image status"]);
      const lowRisk = !/^high|blocked/i.test(row["legal risk"]);
      const metadataReady = Boolean(row["old meta title"] && row["old meta description"]);
      const ready = hidden && imageReady && lowRisk && metadataReady;
      return {
        "priority rank": index + 1,
        "old URL": row["old URL"],
        slug: slugFromUrl(row["old URL"]),
        "old title": row["old title"],
        "improved title": row["old title"],
        "GSC clicks": row["GSC clicks"],
        "GSC impressions": row["GSC impressions"],
        "target URL": row["recommended final URL"],
        "draft restoration status": hidden ? "hidden Sanity draft exists; keep hidden until gates pass" : "source recovery needed before draft creation",
        "SEO title status": row["old meta title"] ? "present" : "missing/rewrite needed",
        "meta description status": row["old meta description"] ? "present" : "missing/rewrite needed",
        "canonical": row["canonical URL"],
        "image status": row["image status"],
        "alt text status": /alt present/i.test(row["image status"]) ? "present" : "missing/review needed",
        author: "Charles Chukwuma Nkwoka, Esq.",
        "category/practice relationship": topicFromText(slugFromUrl(row["old URL"]), row["old title"]),
        "consultation CTA": "required before approval",
        "internal links": "required before approval",
        "FAQ/answer sections": "recommended where useful",
        "legal risk": row["legal risk"],
        "duplicate/cannibalization risk": row["duplicate/cannibalization risk"],
        "approval decision": ready ? "candidate for manual lawyer approval; not auto-approved in Sprint 11G" : "keep hidden",
        notes: ready ? "No automatic publication; requires final lawyer/editorial sign-off." : "Fails at least one gate: image, metadata, source, legal, or duplicate review."
      };
    });

  const seoRows = [...top100Rows.slice(0, 100)].map((row) => ({
    "old URL": row["old URL"],
    "target URL": row["recommended final URL"],
    "title/search intent": row["old title"] ? "reviewed for search-intent match" : "title recovery needed",
    "H1": "must be natural and specific",
    "meta title": row["old title"] ? "preserve or improve without losing legacy intent" : "rewrite needed",
    "meta description": "must be accurate, useful, and non-misleading",
    canonical: row["canonical URL"],
    "internal links": "practice area, consultation, contact, related resources",
    "AEO answer block": "add concise answer near top where content is restored",
    "FAQ section": "add only where genuinely useful",
    "GEO/entity signals": "Chaman Law Firm, Nigerian legal context, practice-area entity links",
    "legal safety": row["legal risk"],
    "sitemap rule": "include only final public URLs",
    "redirect rule": "one-hop 308 only after target is public/200/canonical-safe"
  }));

  const imageRows = [...top100Rows.slice(0, 100)].map((row) => ({
    "old URL": row["old URL"],
    slug: slugFromUrl(row["old URL"]),
    "target URL": row["recommended final URL"],
    "image status": row["image status"],
    "preferred image source": "original legacy image first; approved Chaman Law Firm legal/service image second",
    "Chaman Properties image allowed": "no",
    "alt text requirement": `specific factual alt text for ${row["old title"] || slugFromUrl(row["old URL"])}`,
    "caption requirement": "add only if useful and supported by the page/post template",
    "publication rule": row["likely page type"] === "blog" ? "no approval without safe image and alt text" : "static/service redirect can proceed when existing target page is already image/canonical-safe"
  }));

  const redirectRows = staticRows
    .filter((row) => row["redirect plan"].startsWith("activate exact") || row["redirect plan"].startsWith("configured"))
    .map((row) => {
      const source = normalizePath(row["old URL"]);
      const destination = normalizePath(row["proposed final URL"]);
      return {
        "old URL": absoluteUrl(source),
        "old source path": source,
        "new URL": absoluteUrl(destination),
        "new target path": destination,
        "redirect type": "one-hop 308",
        "target status": targetStatuses.get(destination)?.status || "not checked",
        "sitemap status": sitemapUrls.has(absoluteUrl(destination)) ? "included" : "not included",
        "activation status": redirectMap.has(source) ? "configured in next.config.mjs" : "selected for Sprint 11G next.config.mjs activation",
        "no-homepage-dump check": destination !== "/" ? "pass" : "fail",
        "hidden-draft target check": !destination.startsWith("/resources/blog") ? "pass" : "review",
        notes: "Existing target is a live Chaman Law Firm page; no Chaman Properties target; no hidden draft target."
      };
    });

  const masterHeaders = [
    "old URL",
    "old title",
    "old meta title",
    "old meta description",
    "old content type",
    "likely page type",
    "current status",
    "GSC clicks",
    "GSC impressions",
    "average position",
    "backlink evidence",
    "featured-snippet evidence",
    "ranking evidence",
    "current redirect target",
    "Sanity public status",
    "Sanity hidden/draft status",
    "old image availability",
    "recommended action",
    "recommended final URL",
    "canonical URL",
    "sitemap inclusion status",
    "image status",
    "legal risk",
    "duplicate/cannibalization risk",
    "SEO priority score",
    "AEO/GEO opportunity",
    "notes"
  ];

  writeCsv(paths.masterQueue, masterHeaders, masterRows);
  writeCsv(paths.top100Batch, Object.keys(top100Rows[0] || {}), top100Rows);
  writeCsv(paths.staticBatch, Object.keys(staticRows[0] || {}), staticRows);
  writeCsv(paths.blogBatch, Object.keys(blogRows[0] || {}), blogRows);
  writeCsv(paths.seoChecklist, Object.keys(seoRows[0] || {}), seoRows);
  writeCsv(paths.imageMap, Object.keys(imageRows[0] || {}), imageRows);
  writeCsv(paths.redirectBatch, Object.keys(redirectRows[0] || {}), redirectRows);

  const fresh = freshEvidenceFiles();
  fs.writeFileSync(
    paths.evidenceStatus,
    `# Sprint 11G Fresh Search Evidence Status

Fresh post-launch GSC/Bing/backlink/SERP evidence detected locally: ${fresh.length ? "yes" : "no"}.

## Files Detected

${fresh.length ? fresh.map((item) => `- \`${item.file}\` (${item.modified})`).join("\n") : "- No new non-sprint Google Search Console, Bing, backlink, featured-snippet, SERP screenshot, Ahrefs, Semrush, Ubersuggest, or Moz export was found locally."}

## Existing Evidence Used

- \`docs/search-console-exports/Pages.csv\`
- \`docs/search-console-exports/Queries.csv\`
- Sprint 11D/11E/11F legacy authority inventories and redirect reports
- Current \`next.config.mjs\` redirect configuration
- Current production sitemap and robots responses
- Current Sanity post visibility state where the local token allowed read access

## Principal Action Required

Place fresh exports into the project for the next sprint:

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
`
  );

  const liveCore = await Promise.all([
    fetchHead(SITE_URL),
    fetchHead("https://www.chamanlawfirm.com"),
    fetchHead(`${SITE_URL}/resources/blog`),
    fetchHead(`${SITE_URL}/sitemap.xml`),
    fetchHead(`${SITE_URL}/robots.txt`)
  ]);

  fs.writeFileSync(
    paths.report,
    `# Sprint 11G Full Legacy Migration Factory Report

Generated: 2026-07-14

## Resume State

- Production homepage status: ${liveCore[0].status}
- www status: ${liveCore[1].status}${liveCore[1].location ? ` -> ${liveCore[1].location}` : ""}
- Blog index status: ${liveCore[2].status}
- Sitemap status: ${sitemap.status}
- Robots status: ${robots.status}
- Sitemap contains preview/vercel URLs: ${/vercel\.app|preview/i.test(sitemap.text) ? "yes - investigate" : "no"}
- Robots references production sitemap: ${robots.text.includes(`${SITE_URL}/sitemap.xml`) ? "yes" : "no"}
- Robots blocks /studio: ${robots.text.includes("Disallow: /studio") ? "yes" : "no"}
- Robots blocks /api: ${robots.text.includes("Disallow: /api") ? "yes" : "no"}

## Factory Outputs

- Master queue rows: ${masterRows.length}
- Top 100 batch rows: ${top100Rows.length}
- Static/service restoration rows: ${staticRows.length}
- Blog recovery rows: ${blogRows.length}
- Redirect activation rows: ${redirectRows.length}
- Sanity token detected for read query: ${sanity.tokenDetected ? "yes" : "no"}
- Sanity read error: ${sanity.error || "none"}
- Approved public posts read: ${publicPosts.length}
- Hidden/unapproved posts read: ${hiddenPosts.length}

## Publication Decision

- New blog approvals in Sprint 11G: 0
- New standalone static/service pages published in Sprint 11G: 0
- Exact static/service redirects selected for activation: ${redirectRows.length}

Blog posts remain hidden unless they have body, metadata, image/alt text, author governance, no off-brand contamination, no unsafe legal language, duplicate review, and final lawyer/editorial approval.

## QA Notes

${qaRows(redirectRows.map((row) => row["new URL"]), sitemapUrls)
  .map((row) => `- ${row.URL}: sitemap ${row["sitemap status"]}`)
  .join("\n")}
`
  );

  console.log(
    JSON.stringify(
      {
        masterQueueRows: masterRows.length,
        top100Rows: top100Rows.length,
        staticRows: staticRows.length,
        blogRows: blogRows.length,
        redirectRows: redirectRows.length,
        freshEvidenceFiles: fresh.length,
        sanityTokenDetected: sanity.tokenDetected,
        sanityReadError: sanity.error || "",
        approvedPublicPosts: publicPosts.length,
        hiddenPosts: hiddenPosts.length,
        sitemapStatus: sitemap.status,
        robotsStatus: robots.status
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
