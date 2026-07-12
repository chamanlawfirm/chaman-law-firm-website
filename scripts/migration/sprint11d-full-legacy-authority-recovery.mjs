import fs from "node:fs";
import path from "node:path";

const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";
const SITE_URL = "https://chamanlawfirm.com";
const DATE = "2026-07-13";
const OUTPUT_DIR = "docs";
const GSC_PAGES = path.join("docs", "search-console-exports", "Pages.csv");
const NEXT_CONFIG = "next.config.mjs";

const urgentStaticRedirects = [
  {
    source: "/charles-chukwuma-nkwoka",
    destination: "/lawyers/charles-chukwuma-nkwoka",
    type: "lawyer profile",
    reason: "Legacy Managing Partner profile URL has GSC clicks and exact live lawyer profile target."
  },
  {
    source: "/governors-consent",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    type: "service landing page",
    reason: "Legacy Governor's Consent URL has GSC clicks and exact live service-page target."
  },
  {
    source: "/duration-to-get-governors-consent",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    type: "service landing page",
    reason: "Legacy Governor's Consent timing URL is same search intent as live Governor's Consent service page."
  },
  {
    source: "/how-to-apply-and-get-a-governors-consent",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    type: "service landing page",
    reason: "Legacy application-process URL maps directly to the live Governor's Consent service page."
  },
  {
    source: "/why-is-governors-consent-compulsory",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    type: "service landing page",
    reason: "Legacy informational Governor's Consent URL maps to the live Governor's Consent service page."
  },
  {
    source: "/governors-consent-how-long-does-it-take",
    destination: "/practice-areas/property-real-estate-law/governors-consent",
    type: "service landing page",
    reason: "Legacy timing-intent URL maps to the live Governor's Consent service page."
  },
  {
    source: "/labour-relations-and-employment-law",
    destination: "/practice-areas/employment-law",
    type: "practice-area page",
    reason: "Legacy employment-law authority URL maps to live Employment Law practice page."
  },
  {
    source: "/labour-relations-in-nigerian-construction",
    destination: "/practice-areas/employment-law",
    type: "practice-area page",
    reason: "Legacy labour-relations URL maps safely to live Employment Law practice page pending article recovery."
  },
  {
    source: "/employment-disputes-and-grievances",
    destination: "/practice-areas/employment-law",
    type: "practice-area page",
    reason: "Legacy employment-dispute URL maps to live Employment Law practice page."
  },
  {
    source: "/notary-services-chaman-law-firm",
    destination: "/practice-areas/notary-public-services",
    type: "practice-area page",
    reason: "Legacy notary-services URL maps to live Notary Public Services page."
  },
  {
    source: "/nigerian-visa-requirements-and-legal-guide",
    destination: "/practice-areas/immigration-services",
    type: "practice-area page",
    reason: "Legacy Nigerian visa guide URL maps to live Immigration Services page pending exact article recovery."
  },
  {
    source: "/startup-legal-services-in-nigeria",
    destination: "/practice-areas/corporate-commercial-law",
    type: "practice-area page",
    reason: "Legacy startup legal-services URL maps to live Corporate & Commercial Law page."
  },
  {
    source: "/banking-and-finance-law-in-lagos",
    destination: "/practice-areas/corporate-commercial-law",
    type: "practice-area page",
    reason: "Legacy banking and finance legal URL maps to live Corporate & Commercial Law page."
  },
  {
    source: "/roles-of-a-mediator",
    destination: "/practice-areas/adr-mediation",
    type: "practice-area page",
    reason: "Legacy mediator-role URL maps to live ADR / Mediation practice page."
  },
  {
    source: "/enforcement-of-arbitral-awards",
    destination: "/practice-areas/adr-mediation",
    type: "practice-area page",
    reason: "Legacy arbitral-awards URL maps to live ADR / Mediation practice page pending exact article recovery."
  },
  {
    source: "/gallery",
    destination: "/media",
    type: "static authority page",
    reason: "Legacy gallery/media URL maps to live Media page."
  }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(headers, rows) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n") + "\n";
}

function slugFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    if (!pathname) return "";
    return pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return String(url || "").replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
  }
}

function pathFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    return pathname || "/";
  } catch {
    const cleaned = String(url || "").replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0].replace(/\/+$/, "");
    return cleaned || "/";
  }
}

function titleFromSlug(slug) {
  return String(slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bC O\b/g, "C of O")
    .replace(/\bCac\b/g, "CAC");
}

function number(value) {
  const parsed = Number(String(value || "").replace(/[%,$]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseRedirects(configText) {
  const redirects = new Map();
  const objectPattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = objectPattern.exec(configText))) {
    redirects.set(match[1].replace(/\/+$/, "") || "/", match[2]);
  }
  return redirects;
}

function topicBucket(slug, title = "") {
  const text = `${slug} ${title}`.toLowerCase();
  if (/governor|c-of-o|certificate-of-occupancy|land|tenant|property|real-estate|deed|survey|title|rent|premises|caveat/.test(text)) return "property/title";
  if (/company|corporate|contract|business|startup|banking|finance|tax|cac|shares|director/.test(text)) return "corporate/commercial";
  if (/litigation|court|dispute|injunction|judiciary|police|bail|arbitr|mediator|mediation|adr/.test(text)) return "litigation/ADR";
  if (/debt|recovery|creditor/.test(text)) return "debt recovery";
  if (/probate|estate|will|inheritance|administration/.test(text)) return "probate/estate";
  if (/immigration|visa|citizenship|residency|passport/.test(text)) return "immigration";
  if (/marriage|divorce|child|custody|family|wife|husband/.test(text)) return "family law";
  if (/employment|labour|employee|workplace|termination/.test(text)) return "employment law";
  if (/notary|apostille|legalisation|authentication|document/.test(text)) return "notary/documentation";
  return "general legal education";
}

function legalRisk(slug, title = "") {
  const text = `${slug} ${title}`.toLowerCase();
  if (/evict|quit-notice|self-help|restraining|police|criminal|domestic-violence|child|custody|divorce|marriage|inheritance|will|probate/.test(text)) {
    return "high - lawyer review required before publication";
  }
  if (/tax|immigration|land-use-act|governor|c-of-o|employment|debt|contract|property|tenant|land|dispute/.test(text)) {
    return "medium - verify current law and facts before publication";
  }
  return "low/medium - editorial and legal review still required";
}

function disallowedSignal(slug, title = "") {
  const text = `${slug} ${title}`.toLowerCase();
  return /casino|bonus|games|spin|luxury|lekki.*luxury|mansion|gated-estate|property-sales|estate-developer/.test(text);
}

async function querySanity(query, params = {}) {
  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN;
  if (!token) return [];
  const url = new URL(`/v${API_VERSION}/data/query/${DATASET}`, `https://${PROJECT_ID}.api.sanity.io`);
  url.searchParams.set("perspective", "raw");
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Sanity query failed: ${response.status}`);
  const payload = await response.json();
  return payload.result || [];
}

async function fetchStatus(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 10000);
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

function currentLiveStatus({ pathname, redirectMap, publicSlugs, hiddenSlugs, sitemapUrls, liveStatus }) {
  const redirectTarget = redirectMap.get(pathname);
  if (pathname === "/" || pathname === "") return "live canonical/static";
  if (redirectTarget) return `redirect configured to ${redirectTarget}`;
  const slug = pathname.split("/").filter(Boolean).pop() || "";
  if (pathname.startsWith("/resources/blog/") && publicSlugs.has(slug)) return "live approved blog URL";
  if (publicSlugs.has(slug) && sitemapUrls.has(`${SITE_URL}/resources/blog/${slug}`)) return "approved Sanity post; missing old-url redirect";
  if (hiddenSlugs.has(slug)) return "hidden Sanity draft; do not redirect";
  if (liveStatus?.status === 404) return "live 404";
  if (liveStatus?.redirect) return `live redirect to ${liveStatus.location}`;
  if (liveStatus?.ok) return "live 200";
  return "not confirmed";
}

function classifyAction(row, context) {
  const slug = row.slug;
  const pathname = row.pathname;
  const redirectTarget = context.redirectMap.get(pathname);
  const urgent = context.urgentMap.get(pathname);

  if (pathname === "/" || pathname === "") return "merge into existing stronger live page";
  if (/^\/category|^\/tag|^\/author|^\/blog\/?$/.test(pathname)) return "redirect one-hop to closest exact live equivalent";
  if (urgent) return "redirect one-hop to closest exact live equivalent";
  if (redirectTarget) {
    if (redirectTarget.startsWith("/practice-areas")) return "merge into existing stronger live page";
    if (redirectTarget.startsWith("/resources/blog")) return "restore as blog post";
    return "redirect one-hop to closest exact live equivalent";
  }
  if (context.publicSlugs.has(slug)) return "redirect one-hop to closest exact live equivalent";
  if (context.hiddenSlugs.has(slug)) return "keep hidden only if legally unsafe, duplicate, or genuinely unsuitable";
  if (disallowedSignal(slug, row.title)) return "reject/archive only if there is no SEO value and no safe legal value";
  if (/governor|verification|due-diligence|notary|employment|immigration|debt-recovery|corporate|contract|probate|consultation|lawyer|property-law|real-estate/.test(slug)) {
    return "restore as service landing page";
  }
  if (/about|contact|gallery|media|team|charles/.test(slug)) return "restore as static authority page";
  return "restore as blog post";
}

function bestRoute(row, context) {
  const pathname = row.pathname;
  const slug = row.slug;
  const urgent = context.urgentMap.get(pathname);
  if (pathname === "/" || pathname === "") return "/";
  if (urgent) return urgent.destination;
  const existing = context.redirectMap.get(pathname);
  if (existing) return existing;
  if (context.publicSlugs.has(slug)) return `/resources/blog/${slug}`;
  if (/about-us|about-chaman-law-firm/.test(slug)) return "/about";
  if (/contact-for-legal-consultation/.test(slug)) return "/consultation";
  if (/charles-chukwuma-nkwoka/.test(slug)) return "/lawyers/charles-chukwuma-nkwoka";
  if (/governor/.test(slug)) return "/practice-areas/property-real-estate-law/governors-consent";
  if (/notary|apostille|legalisation|authentication/.test(slug)) return "/practice-areas/notary-public-services";
  if (/employment|labour/.test(slug)) return "/practice-areas/employment-law";
  if (/immigration|visa|citizenship|residency/.test(slug)) return "/practice-areas/immigration-services";
  if (/debt-recovery/.test(slug)) return "/practice-areas/debt-recovery";
  if (/mediator|mediation|arbitr/.test(slug)) return "/practice-areas/adr-mediation";
  if (/corporate|contract|startup|banking|finance|company|business/.test(slug)) return "/practice-areas/corporate-commercial-law";
  if (/property|land|tenant|c-of-o|certificate-of-occupancy|deed|survey|title|rent/.test(slug)) return `/resources/blog/${slug}`;
  if (/probate|will|inheritance|administration/.test(slug)) return "/practice-areas/probate-estate-administration";
  return `/resources/blog/${slug}`;
}

async function main() {
  loadEnvFile(".env.local");

  const pages = parseCsv(fs.readFileSync(GSC_PAGES, "utf8"))
    .map((row, index) => {
      const slug = slugFromUrl(row["Top pages"]);
      const pathname = pathFromUrl(row["Top pages"]);
      return {
        rank: index + 1,
        oldUrl: row["Top pages"],
        pathname,
        slug,
        title: titleFromSlug(slug || "Home"),
        clicks: number(row.Clicks),
        impressions: number(row.Impressions),
        ctr: row.CTR || "",
        position: number(row.Position)
      };
    })
    .filter((row) => row.oldUrl.includes("chamanlawfirm.com"));

  const uniquePages = [];
  const seen = new Set();
  for (const row of pages) {
    const key = row.pathname;
    if (seen.has(key)) continue;
    seen.add(key);
    uniquePages.push(row);
  }

  const configText = fs.readFileSync(NEXT_CONFIG, "utf8");
  const redirectMap = parseRedirects(configText);
  const urgentMap = new Map(urgentStaticRedirects.map((item) => [item.source, item]));

  const [sanityPosts, sitemap, robots] = await Promise.all([
    querySanity(`*[_type == "post"]{
      _id,
      title,
      "slug": slug.current,
      lawFirmApproved,
      publishedAt,
      "authorName": author->name,
      "hasBody": defined(body[0]),
      "bodyBlocks": count(body[]),
      "hasImage": defined(mainImage.asset._ref),
      "hasAlt": defined(mainImage.alt) && length(mainImage.alt) > 8,
      "imageAlt": mainImage.alt,
      "seoTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "canonical": seo.canonicalUrl
    }`),
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`)
  ]);

  const publicPosts = sanityPosts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."));
  const hiddenPosts = sanityPosts.filter((post) => post.lawFirmApproved !== true || post._id.startsWith("drafts."));
  const publicBySlug = new Map(publicPosts.map((post) => [post.slug, post]));
  const hiddenBySlug = new Map(hiddenPosts.map((post) => [post.slug, post]));
  const publicSlugs = new Set(publicBySlug.keys());
  const hiddenSlugs = new Set(hiddenBySlug.keys());
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  const topForLiveCheck = uniquePages.slice(0, 250);
  const liveStatusByPath = new Map();
  for (let index = 0; index < topForLiveCheck.length; index += 8) {
    const chunk = topForLiveCheck.slice(index, index + 8);
    const results = await Promise.all(chunk.map((row) => fetchStatus(`${SITE_URL}${row.pathname}`)));
    results.forEach((result, itemIndex) => liveStatusByPath.set(chunk[itemIndex].pathname, result));
  }

  const context = { redirectMap, urgentMap, publicSlugs, hiddenSlugs, sitemapUrls };
  const inventoryRows = uniquePages.map((row) => {
    const liveStatus = liveStatusByPath.get(row.pathname);
    const publicDoc = publicBySlug.get(row.slug);
    const hiddenDoc = hiddenBySlug.get(row.slug);
    const bestNewRoute = bestRoute(row, context);
    const action = classifyAction(row, context);
    const redirectTarget = action.includes("redirect") || urgentMap.has(row.pathname) || publicDoc ? bestNewRoute : "";
    const canonical = bestNewRoute.startsWith("http") ? bestNewRoute : `${SITE_URL}${bestNewRoute}`;
    const sitemapIncluded = sitemapUrls.has(canonical);

    return {
      "priority rank": row.rank,
      "old URL": row.oldUrl,
      "old title": row.title,
      "old meta title": publicDoc?.seoTitle || hiddenDoc?.seoTitle || "",
      "old meta description": publicDoc?.metaDescription || hiddenDoc?.metaDescription || "",
      "old content type": topicBucket(row.slug, row.title),
      "current live status": currentLiveStatus({ pathname: row.pathname, redirectMap, publicSlugs, hiddenSlugs, sitemapUrls, liveStatus }),
      "Google ranking/impression/click evidence": `${row.clicks} clicks; ${row.impressions} impressions; avg position ${row.position || "n/a"} from local GSC Pages.csv`,
      "featured snippet evidence": row.position > 0 && row.position <= 3 ? "possible high-ranking candidate; no local featured-snippet export" : "not available locally",
      "old image availability": publicDoc?.hasImage || hiddenDoc?.hasImage ? "Sanity image present" : "legacy image not confirmed",
      "best new route": bestNewRoute,
      "whether to preserve same URL or redirect": row.pathname === bestNewRoute ? "preserve same URL" : "redirect old URL to best new route",
      "redirect target": redirectTarget,
      "canonical URL": canonical,
      "sitemap inclusion": sitemapIncluded ? "included" : "not included until restored/approved or static target exists",
      "legal safety status": disallowedSignal(row.slug, row.title) ? "blocked - off-brand/spam/luxury signal" : legalRisk(row.slug, row.title),
      "image status": publicDoc?.hasImage || hiddenDoc?.hasImage ? (publicDoc?.hasAlt || hiddenDoc?.hasAlt ? "image and alt present in Sanity" : "image present; alt review needed") : "image recovery needed",
      "approval status": publicDoc ? "approved public" : hiddenDoc ? "hidden/not approved" : "not restored",
      "recovery classification": action,
      notes: urgentMap.has(row.pathname) ? urgentMap.get(row.pathname).reason : ""
    };
  });

  const highPriorityRows = inventoryRows
    .filter((row) => /live 404|missing old-url redirect|not confirmed|not restored|hidden/i.test(`${row["current live status"]} ${row["approval status"]}`))
    .filter((row) => !/blocked - off-brand/.test(row["legal safety status"]))
    .slice(0, 120);

  const rankingRows = inventoryRows
    .filter((row) => Number(row["priority rank"]) <= 250 || /possible high-ranking candidate/.test(row["featured snippet evidence"]))
    .slice(0, 150);

  const staticRows = inventoryRows.filter((row) =>
    /practice-area page|service landing page|static authority page|merge into existing stronger live page/.test(row["recovery classification"])
  );
  const blogRows = inventoryRows.filter((row) => /blog post|keep hidden/.test(row["recovery classification"]));

  const redirectRows = urgentStaticRedirects.map((item) => {
    const gsc = uniquePages.find((row) => row.pathname === item.source);
    const targetUrl = `${SITE_URL}${item.destination}`;
    return {
      "old URL": `${SITE_URL}${item.source}/`,
      "old slug": item.source.slice(1),
      "new route": item.destination,
      "redirect target": targetUrl,
      "redirect type": "one-hop 308 via Next.js permanent redirect",
      status: redirectMap.has(item.source) ? "already configured" : "selected for first urgent batch",
      "target live/sitemap status": sitemapUrls.has(targetUrl) ? "target in sitemap" : "target live-check required",
      clicks: gsc?.clicks || 0,
      impressions: gsc?.impressions || 0,
      notes: item.reason
    };
  });

  const imageRows = inventoryRows
    .filter((row) => row["approval status"] !== "approved public")
    .slice(0, 250)
    .map((row) => ({
      "old URL": row["old URL"],
      slug: row["old URL"].split("/").filter(Boolean).pop() || "",
      "image status": row["image status"],
      "preferred image action": row["image status"].includes("present") ? "verify image/alt relevance before approval" : "recover original from legacy media, then use approved legal fallback if needed",
      "Chaman Properties image allowed": "no",
      "alt text requirement": "specific, factual alt text matching article/page topic"
    }));

  const riskRows = inventoryRows.slice(0, 300).map((row) => ({
    "old URL": row["old URL"],
    "old content type": row["old content type"],
    "legal safety status": row["legal safety status"],
    "approval status": row["approval status"],
    "recommended legal action": row["legal safety status"].startsWith("high")
      ? "Principal/lawyer review before approval"
      : row["legal safety status"].startsWith("blocked")
        ? "reject/archive or manually sanitize from original source"
        : "editorial review plus current-law check",
    "redirect guardrail": row["redirect target"] ? "redirect only if target returns 200 and is not hidden" : "do not redirect yet"
  }));

  const commonHeaders = [
    "priority rank",
    "old URL",
    "old title",
    "old meta title",
    "old meta description",
    "old content type",
    "current live status",
    "Google ranking/impression/click evidence",
    "featured snippet evidence",
    "old image availability",
    "best new route",
    "whether to preserve same URL or redirect",
    "redirect target",
    "canonical URL",
    "sitemap inclusion",
    "legal safety status",
    "image status",
    "approval status",
    "recovery classification",
    "notes"
  ];

  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"), toCsv(commonHeaders, inventoryRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-HIGH-PRIORITY-404-RESCUE-LIST.csv"), toCsv(commonHeaders, highPriorityRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-FEATURED-SNIPPET-RANKING-RESCUE-LIST.csv"), toCsv(commonHeaders, rankingRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-STATIC-SERVICE-PAGE-RESTORATION-PLAN.csv"), toCsv(commonHeaders, staticRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-BLOG-RESTORATION-PLAN.csv"), toCsv(commonHeaders, blogRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-REDIRECT-MAP.csv"), toCsv(["old URL", "old slug", "new route", "redirect target", "redirect type", "status", "target live/sitemap status", "clicks", "impressions", "notes"], redirectRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-IMAGE-RECOVERY-MAP.csv"), toCsv(["old URL", "slug", "image status", "preferred image action", "Chaman Properties image allowed", "alt text requirement"], imageRows));
  fs.writeFileSync(path.join(OUTPUT_DIR, "SPRINT-11D-LEGAL-REVIEW-RISK-MAP.csv"), toCsv(["old URL", "old content type", "legal safety status", "approval status", "recommended legal action", "redirect guardrail"], riskRows));

  const urgentClicks = redirectRows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const urgentImpressions = redirectRows.reduce((sum, row) => sum + Number(row.impressions || 0), 0);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "SPRINT-11D-FIRST-URGENT-BATCH-QA.md"),
    `# Sprint 11D First Urgent Batch QA

Date: ${DATE}

## Strategy

This sprint pivots legacy recovery beyond blog migration. The first urgent implementation batch is intentionally limited to exact, low-risk old URLs that already have live equivalents:

- Lawyer profile URL to live lawyer profile.
- Governor's Consent authority URLs to the live Governor's Consent service page.
- Employment, notary, immigration, corporate, ADR, and media URLs to exact live practice/static pages.

No hidden draft is used as a redirect target.
No homepage fallback is used.
No Chaman Properties image/content is used.

## Batch Size

- Redirect sources selected: ${urgentStaticRedirects.length}
- GSC evidence covered by this urgent batch: ${urgentClicks} clicks and ${urgentImpressions} impressions in the local Pages.csv export.

## Sitemap / Robots Baseline

- Sitemap fetch status: ${sitemap.status}
- Robots fetch status: ${robots.status}
- Sitemap contains preview URLs: ${/vercel\.app/i.test(sitemap.text) ? "yes - investigate" : "no"}
- Robots references production sitemap: ${robots.text.includes(`${SITE_URL}/sitemap.xml`) ? "yes" : "no"}

## Important Limitation

The workspace does not contain fresh post-launch GSC/Bing exports or a featured-snippet export. Featured-snippet evidence is therefore marked as unavailable unless inferred only as a high-ranking candidate from average position.
`
  );

  console.log(JSON.stringify({
    totalGscRows: pages.length,
    uniqueLegacyUrls: uniquePages.length,
    inventoryRows: inventoryRows.length,
    publicApprovedPosts: publicPosts.length,
    hiddenOrUnapprovedPosts: hiddenPosts.length,
    urgentRedirectSources: urgentStaticRedirects.length,
    urgentClicks,
    urgentImpressions,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    outputFiles: [
      "docs/SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv",
      "docs/SPRINT-11D-HIGH-PRIORITY-404-RESCUE-LIST.csv",
      "docs/SPRINT-11D-FEATURED-SNIPPET-RANKING-RESCUE-LIST.csv",
      "docs/SPRINT-11D-STATIC-SERVICE-PAGE-RESTORATION-PLAN.csv",
      "docs/SPRINT-11D-BLOG-RESTORATION-PLAN.csv",
      "docs/SPRINT-11D-REDIRECT-MAP.csv",
      "docs/SPRINT-11D-IMAGE-RECOVERY-MAP.csv",
      "docs/SPRINT-11D-LEGAL-REVIEW-RISK-MAP.csv",
      "docs/SPRINT-11D-FIRST-URGENT-BATCH-QA.md"
    ]
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
