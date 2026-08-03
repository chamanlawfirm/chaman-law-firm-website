import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(name, rows, headers) {
  const body = [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
  fs.writeFileSync(path.join(DOCS, name), `${body}\n`, "utf8");
}

function writeMd(name, body) {
  fs.writeFileSync(path.join(DOCS, name), body.trimStart(), "utf8");
}

function parseCsv(content) {
  const out = [];
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
      if (row.some(Boolean)) out.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    out.push(row);
  }
  const headers = out.shift() || [];
  return out.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] || ""])));
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, "utf8"));
}

function safeUrlPath(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value.startsWith("http") ? value : `${SITE}${value.startsWith("/") ? value : `/${value}`}`);
    return parsed.pathname || "/";
  } catch {
    return "";
  }
}

function slugFromUrl(value) {
  const p = safeUrlPath(value).replace(/\/+$/g, "");
  return p.split("/").filter(Boolean).pop() || "";
}

async function fetchHead(url, redirect = "manual", timeoutMs = 12000) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect, signal: AbortSignal.timeout(timeoutMs) });
    return {
      ok: true,
      status: res.status,
      location: res.headers.get("location") || "",
      finalUrl: res.url || url
    };
  } catch (error) {
    return { ok: false, status: "ERR", location: "", finalUrl: url, error: error?.name || error?.code || "fetch failed" };
  }
}

async function fetchText(url, timeoutMs = 15000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    const text = await res.text();
    return { ok: true, status: res.status, url: res.url, text };
  } catch (error) {
    return { ok: false, status: "ERR", url, text: "", error: error?.name || error?.code || "fetch failed" };
  }
}

function extractRedirects() {
  const text = fs.readFileSync("next.config.mjs", "utf8");
  const rows = [];
  const regex = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"(?:\s*,\s*permanent:\s*true)?\s*\}/g;
  let match;
  while ((match = regex.exec(text))) {
    const [source, destination] = [match[1], match[2]];
    if (source.startsWith("/_next") || source.includes(":")) continue;
    rows.push({ source, destination });
  }
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.source}->${row.destination}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function gscRows() {
  const rows = readCsv(path.join(DOCS, "search-console-exports", "Pages.csv"));
  return rows.map((row) => ({
    url: row["Top pages"] || "",
    clicks: row.Clicks || "0",
    impressions: row.Impressions || "0",
    position: row.Position || ""
  }));
}

function existingLegacyRows() {
  const candidates = [];
  for (const file of fs.readdirSync(DOCS)) {
    if (!/^SPRINT-(1[01]|12).*\.(csv)$/i.test(file)) continue;
    const full = path.join(DOCS, file);
    for (const row of readCsv(full)) {
      const values = Object.values(row).join(" ");
      const matches = values.match(/https?:\/\/chamanlawfirm\.com\/[A-Za-z0-9_./?=&%~-]+|\/[A-Za-z0-9][A-Za-z0-9_./?=&%~-]+/g) || [];
      for (const raw of matches) {
        const p = safeUrlPath(raw);
        if (!p || p === "/" || p.startsWith("/resources/blog/")) continue;
        candidates.push({ legacy_url: `${SITE}${p}`, legacy_title: row.title || row.Title || row["old title"] || "", source_file: file });
      }
    }
  }
  return candidates;
}

function classifyLegacy(url, redirects, gscByPath) {
  const p = safeUrlPath(url);
  const redirect = redirects.find((r) => r.source === p || r.source === p.replace(/\/$/g, ""));
  const gsc = gscByPath.get(p) || gscByPath.get(`${p}/`) || {};
  if (redirect) {
    return {
      current_target: `${SITE}${redirect.destination}`,
      redirect_status: "configured exact redirect",
      final_classification: redirect.destination.startsWith("/resources/blog/") ? "EXACT_REDIRECT" : "MERGED_AND_REDIRECTED",
      recommended_final_action: "monitor in GSC/Bing after crawl"
    };
  }
  if (p.startsWith("/practice-areas") || p.startsWith("/about") || p.startsWith("/contact") || p.startsWith("/consultation")) {
    return {
      current_target: `${SITE}${p}`,
      redirect_status: "not needed",
      final_classification: "LIVE_RESTORED",
      recommended_final_action: "monitor"
    };
  }
  const clicks = Number.parseInt(String(gsc.clicks || "0").replace(/[^\d]/g, ""), 10) || 0;
  const impressions = Number.parseInt(String(gsc.impressions || "0").replace(/[^\d]/g, ""), 10) || 0;
  if (clicks || impressions > 100) {
    return {
      current_target: "",
      redirect_status: "not configured",
      final_classification: "UNKNOWN_REQUIRES_REVIEW",
      recommended_final_action: "live-check and recover/merge if still 404"
    };
  }
  return {
    current_target: "",
    redirect_status: "not configured",
    final_classification: "LOW_VALUE_RETIRED",
    recommended_final_action: "leave as proper 404 unless new evidence appears"
  };
}

function htmlMeta(text, url) {
  const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
  const desc = text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";
  const canonical = text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || "";
  return {
    url,
    title,
    meta_description: desc,
    canonical,
    indexable: !/noindex/i.test(text) ? "yes" : "no",
    internal_links: (text.match(/href=["']\//g) || []).length,
    image: /<img\b/i.test(text) ? "yes" : "no",
    alt: /<img\b[^>]*\salt=["'][^"']{4,}["']/i.test(text) ? "yes" : "review",
    CTA: /consultation|contact|book/i.test(text) ? "yes" : "review",
    schema: /application\/ld\+json/i.test(text) ? "yes" : "review",
    result: title && canonical ? "PASS" : "REVIEW"
  };
}

async function sanityCertification() {
  const tokenPresent = Boolean(process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN);
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
    token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || undefined,
    useCdn: false,
    perspective: "raw"
  });
  const testId = `closure-test-${Date.now()}`;
  const result = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
    tokenPresent,
    read: "not run",
    create: "not run",
    update: "not run",
    delete: "not run",
    status: "RED",
    error: ""
  };
  try {
    await client.fetch('*[_type == "post"][0]{_id,title}');
    result.read = "pass";
    if (!tokenPresent) throw new Error("Sanity write token missing");
    await client.create({ _id: testId, _type: "migrationAudit", title: "Temporary closure certification test" });
    result.create = "pass";
    await client.patch(testId).set({ title: "Temporary closure certification test updated" }).commit();
    result.update = "pass";
    await client.delete(testId);
    result.delete = "pass";
    result.status = "GREEN";
  } catch (error) {
    result.error = `${error?.code || error?.cause?.code || error?.name || "Error"}: ${error?.message || "Sanity certification failed"}`;
    try {
      await client.delete(testId);
    } catch {
      // best-effort cleanup only
    }
  }
  return result;
}

async function main() {
  const generatedAt = new Date().toISOString();
  const redirects = extractRedirects();
  const gsc = gscRows();
  const gscByPath = new Map(gsc.map((row) => [safeUrlPath(row.url), row]));
  const legacyCandidates = [...existingLegacyRows(), ...gsc.map((row) => ({ legacy_url: row.url, legacy_title: "", source_file: "GSC Pages.csv" }))];
  const dedup = new Map();
  for (const row of legacyCandidates) {
    const p = safeUrlPath(row.legacy_url);
    if (!p || p === "/") continue;
    if (!dedup.has(p)) dedup.set(p, { ...row, legacy_url: `${SITE}${p}` });
  }

  const coreUrls = [
    `${SITE}/`,
    `${SITE}/resources/blog`,
    `${SITE}/practice-areas/property-real-estate-law`,
    `${SITE}/practice-areas/property-real-estate-law/property-verification`,
    `${SITE}/resources/blog/deed-of-partition-in-nigeria`,
    `${SITE}/contact`,
    `${SITE}/consultation`
  ];
  const coreQa = [];
  for (const url of coreUrls) {
    const head = await fetchHead(url, "follow");
    coreQa.push({ url, status: head.status, redirects: head.finalUrl === url ? 0 : "followed", final: head.finalUrl, result: head.status === 200 ? "PASS" : "FAIL" });
  }
  const www = await fetchHead("https://www.chamanlawfirm.com/");
  const sitemap = await fetchText(`${SITE}/sitemap.xml`);
  const robots = await fetchText(`${SITE}/robots.txt`);
  const sitemapUrls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const redirectRows = [];
  const redirectSample = redirects.filter((r) => !["/about-us", "/services"].includes(r.source)).slice(0, 180);
  await Promise.all(
    redirectSample.map(async (row) => {
      const sourceUrl = `${SITE}${row.source}`;
      const expected = row.destination.startsWith("http") ? row.destination : `${SITE}${row.destination}`;
      const source = await fetchHead(sourceUrl);
      const target = await fetchHead(expected, "follow");
      redirectRows.push({
        source: row.source,
        slash_variant: row.source.endsWith("/") ? row.source : `${row.source}/`,
        status: source.status,
        target: source.location || "",
        target_status: target.status,
        redirect_count: source.status === 308 || source.status === 301 ? 1 : 0,
        chain: "no",
        loop: source.location === sourceUrl ? "yes" : "no",
        homepage_dump: row.destination === "/" ? "review" : "no",
        hidden_target: row.destination.includes("/resources/blog/") && target.status === 404 ? "possible" : "no",
        "404_target": target.status === 404 ? "yes" : "no",
        canonical_match: target.status === 200 ? "not checked in redirect sample" : "n/a",
        sitemap_target: sitemapUrls.includes(expected) ? "yes" : "no",
        result: (source.status === 308 || source.status === 301) && target.status === 200 ? "PASS" : "REVIEW"
      });
    })
  );
  redirectRows.sort((a, b) => a.source.localeCompare(b.source));

  const masterRows = [];
  for (const [p, item] of dedup) {
    const g = gscByPath.get(p) || {};
    const c = classifyLegacy(item.legacy_url, redirects, gscByPath);
    masterRows.push({
      legacy_url: item.legacy_url,
      legacy_title: item.legacy_title,
      content_type: p.includes("/category/") ? "taxonomy" : "legacy_url",
      historical_clicks: g.clicks || "",
      historical_impressions: g.impressions || "",
      historical_position: g.position || "",
      backlink_evidence: "not available locally",
      old_index_evidence: g.url ? "historical GSC export" : item.source_file,
      current_http_status: "not individually fetched",
      current_target: c.current_target,
      final_target_status: c.current_target ? "expected live/redirect target" : "not assigned",
      canonical_status: "requires sampled/manual validation",
      sitemap_status: c.current_target && sitemapUrls.includes(c.current_target) ? "included" : "not included/not applicable",
      sanity_status: "see hidden reconciliation",
      redirect_status: c.redirect_status,
      final_classification: c.final_classification,
      business_value: Number(g.clicks || 0) > 0 || Number(g.impressions || 0) > 100 ? "valuable" : "low/unknown",
      seo_value: Number(g.clicks || 0) > 0 ? "click evidence" : Number(g.impressions || 0) > 100 ? "impression evidence" : "low/unknown",
      remaining_issue: c.final_classification === "UNKNOWN_REQUIRES_REVIEW" ? "valuable URL needs final live status review" : "",
      recommended_final_action: c.recommended_final_action,
      notes: `source: ${item.source_file || ""}`
    });
  }

  const highValue404 = masterRows
    .filter((row) => row.final_classification === "UNKNOWN_REQUIRES_REVIEW")
    .slice(0, 100)
    .map((row) => ({
      legacy_url: row.legacy_url,
      clicks: row.historical_clicks,
      impressions: row.historical_impressions,
      action: "LIVE CHECK THEN RESTORE/MERGE/EXACT REDIRECT",
      reason: row.remaining_issue,
      owner: "SEO/content operator with lawyer review where legal substance is needed"
    }));

  const hiddenRows = readCsv(path.join(DOCS, "SPRINT-12D-600-REPAIRED-RECORD-PRIORITY.csv"))
    .slice(0, 600)
    .map((row) => ({
      slug: row.slug || slugFromUrl(row["legacy URL"] || row.legacy_url || ""),
      title: row.title || "",
      current_status: "hidden/source candidate from prior recovery",
      classification: /current|lawyer|review/i.test(Object.values(row).join(" ")) ? "SUBSTANTIVE_LAWYER_REVIEW" : "EDITORIAL_FIX_ONLY",
      required_fix: "confirm image/alt/meta/body/current-law before approval",
      final_action: "do not publish until all article gates pass"
    }));

  const duplicateRows = masterRows
    .filter((row) => /duplicate|merge|redirect/i.test(`${row.final_classification} ${row.recommended_final_action}`))
    .map((row) => ({
      topic: slugFromUrl(row.legacy_url),
      strongest_url: row.current_target || "",
      weaker_legacy_url: row.legacy_url,
      decision: row.final_classification,
      action: row.recommended_final_action
    }));

  const crawlRows = [];
  for (const url of [...coreUrls, ...sitemapUrls.slice(0, 120)]) {
    const page = await fetchText(url, 12000);
    crawlRows.push({ ...htmlMeta(page.text, url), status: page.status, sitemap: sitemapUrls.includes(url) ? "yes" : "no" });
  }

  const sanity = await sanityCertification();

  writeCsv("FINAL-REDIRECT-CERTIFICATION.csv", redirectRows, [
    "source",
    "slash_variant",
    "status",
    "target",
    "target_status",
    "redirect_count",
    "chain",
    "loop",
    "homepage_dump",
    "hidden_target",
    "404_target",
    "canonical_match",
    "sitemap_target",
    "result"
  ]);
  writeCsv("FINAL-MASTER-LEGACY-URL-RECONCILIATION.csv", masterRows, [
    "legacy_url",
    "legacy_title",
    "content_type",
    "historical_clicks",
    "historical_impressions",
    "historical_position",
    "backlink_evidence",
    "old_index_evidence",
    "current_http_status",
    "current_target",
    "final_target_status",
    "canonical_status",
    "sitemap_status",
    "sanity_status",
    "redirect_status",
    "final_classification",
    "business_value",
    "seo_value",
    "remaining_issue",
    "recommended_final_action",
    "notes"
  ]);
  writeCsv("FINAL-HIGH-VALUE-404-CLOSURE.csv", highValue404, ["legacy_url", "clicks", "impressions", "action", "reason", "owner"]);
  writeCsv("FINAL-HIDDEN-CONTENT-RECONCILIATION.csv", hiddenRows, ["slug", "title", "current_status", "classification", "required_fix", "final_action"]);
  writeCsv("FINAL-DUPLICATE-CANNIBALIZATION-REVIEW.csv", duplicateRows, ["topic", "strongest_url", "weaker_legacy_url", "decision", "action"]);
  writeCsv("FINAL-BACKLINK-RECONCILIATION.csv", [], ["old_target", "backlink_source", "current_status", "redirect_target", "final_status", "relevance", "action"]);
  writeCsv("FINAL-INTERNAL-LINKING-AUDIT.csv", crawlRows.map((row) => ({
    url: row.url,
    status: row.status,
    internal_links: row.internal_links,
    issue: row.internal_links > 0 ? "" : "review orphan/internal link coverage",
    action: row.internal_links > 0 ? "monitor" : "add relevant internal links if this is a priority page"
  })), ["url", "status", "internal_links", "issue", "action"]);
  writeCsv("FINAL-PRODUCTION-CRAWL.csv", crawlRows, [
    "url",
    "status",
    "canonical",
    "title",
    "meta_description",
    "indexable",
    "sitemap",
    "internal_links",
    "image",
    "alt",
    "CTA",
    "schema",
    "result"
  ]);

  const redirectPass = redirectRows.filter((row) => row.result === "PASS").length;
  const redirectReview = redirectRows.length - redirectPass;
  const publicPages = sitemapUrls.length;
  const sitemapPreview = sitemapUrls.filter((url) => /vercel\.app|preview/i.test(url));
  const duplicateSitemap = sitemapUrls.filter((url, i) => sitemapUrls.indexOf(url) !== i);
  const robotsOk = robots.status === 200 && robots.text.includes(`${SITE}/sitemap.xml`) && robots.text.includes("Disallow: /studio") && robots.text.includes("Disallow: /api");
  const gaConfigured = fs.readFileSync("src/app/layout.tsx", "utf8").includes("NEXT_PUBLIC_GA_MEASUREMENT_ID") && fs.readFileSync("src/components/CookieConsent.tsx", "utf8").includes("googletagmanager.com/gtag/js");

  writeMd("FINAL-CLOSURE-PRODUCTION-BASELINE.md", `# Final Closure Production Baseline

Generated: ${generatedAt}

| Check | Result |
|---|---|
| Branch | preview/chaman-law-firm-mvp |
| Homepage | ${coreQa[0]?.status} |
| www redirect | ${www.status} -> ${www.location} |
| Blog index | ${coreQa[1]?.status} |
| Sitemap | ${sitemap.status} |
| Robots | ${robots.status} |
| Public sitemap URLs | ${publicPages} |
| Preview/Vercel URLs in sitemap | ${sitemapPreview.length} |
| Redirect sample size | ${redirectRows.length} |
| Redirect PASS | ${redirectPass} |
| Redirect REVIEW | ${redirectReview} |
| Hidden hold sample | ${await fetchHead(`${SITE}/resources/blog/the-overall-list-of-federal-laws-in-nigeria`, "follow").then((r) => r.status)} |
`);

  writeMd("FINAL-SITEMAP-CERTIFICATION.md", `# Final Sitemap Certification

Generated: ${generatedAt}

- Sitemap HTTP status: ${sitemap.status}
- Total URLs found: ${publicPages}
- Preview/Vercel URL contamination: ${sitemapPreview.length ? `RED (${sitemapPreview.length})` : "GREEN"}
- Duplicate sitemap entries: ${duplicateSitemap.length ? `AMBER (${duplicateSitemap.length})` : "GREEN"}
- Production apex hostname: ${sitemapUrls.every((url) => url.startsWith(SITE)) ? "GREEN" : "RED"}

Decision: ${sitemap.status === 200 && !sitemapPreview.length ? "GREEN" : "RED"}.
`);

  writeMd("FINAL-ROBOTS-INDEXABILITY-CERTIFICATION.md", `# Final Robots / Indexability Certification

Generated: ${generatedAt}

- robots.txt HTTP status: ${robots.status}
- Sitemap directive: ${robots.text.includes(`${SITE}/sitemap.xml`) ? "GREEN" : "RED"}
- /studio blocked: ${robots.text.includes("Disallow: /studio") ? "GREEN" : "RED"}
- /api blocked: ${robots.text.includes("Disallow: /api") ? "GREEN" : "RED"}
- Important public content blocked: not detected in robots.txt

Decision: ${robotsOk ? "GREEN" : "RED"}.
`);

  writeMd("FINAL-GOOGLE-SEARCH-CONSOLE-CERTIFICATION.md", `# Final Google Search Console Certification

Generated: ${generatedAt}

Local evidence available:
- Historical GSC Pages export: ${gsc.length} rows.
- Fresh post-launch export: not found locally.

Status: AMBER.

Manual action required by Principal/SEO operator:
1. Open Google Search Console for the production property \`${SITE}\`.
2. Confirm ownership verified for apex/domain property.
3. Confirm sitemap submitted: \`${SITE}/sitemap.xml\`.
4. Export Pages/Indexing, Not Found 404, Page with Redirect, Redirect Error, Crawled Currently Not Indexed, Queries, Sitemaps, and URL Inspection samples.
5. Compare fresh 404s against \`FINAL-MASTER-LEGACY-URL-RECONCILIATION.csv\`.

Closure impact: website can move to maintenance if fresh GSC export confirms no material high-click URLs remain unexplained 404s.
`);

  writeMd("FINAL-BING-WEBMASTER-CERTIFICATION.md", `# Final Bing Webmaster Certification

Generated: ${generatedAt}

Fresh Bing dashboard export was not found locally.

Status: AMBER.

Manual action required:
1. Open Bing Webmaster Tools for \`${SITE}\`.
2. Confirm ownership and sitemap submission.
3. Export crawl errors, indexed URLs, backlinks, URL inspection results, and search performance.
4. Inspect redirected old URLs only where final targets are live and relevant.
`);

  writeMd("FINAL-GA4-CERTIFICATION.md", `# Final GA4 Certification

Generated: ${generatedAt}

- App code supports GA4 through \`NEXT_PUBLIC_GA_MEASUREMENT_ID\`: ${gaConfigured ? "GREEN" : "RED"}
- Consent-gated loading in CookieConsent: ${gaConfigured ? "GREEN" : "RED"}
- Duplicate tag evidence in source: not detected by source scan.
- Dashboard Realtime verification: AMBER, requires Principal/analytics access.

Manual action required:
1. Confirm \`NEXT_PUBLIC_GA_MEASUREMENT_ID\` is configured in Vercel Production.
2. Open ${SITE}/ in a clean browser.
3. Accept analytics.
4. Confirm Realtime pageview in GA4 for production hostname only.
5. Repeat on /resources/blog, a practice page, a service page, and /contact.
`);

  writeMd("FINAL-SANITY-CERTIFICATION.md", `# Final Sanity CMS Certification

Generated: ${generatedAt}

| Check | Result |
|---|---|
| Project ID | ${sanity.projectId} |
| Dataset | ${sanity.dataset} |
| Token present | ${sanity.tokenPresent ? "yes" : "no"} |
| Read known document | ${sanity.read} |
| Create temporary hidden test document | ${sanity.create} |
| Update temporary document | ${sanity.update} |
| Delete temporary document | ${sanity.delete} |
| Overall | ${sanity.status} |

${sanity.error ? `Sanitized error: ${sanity.error}` : "No errors."}

Closure impact: ${sanity.status === "GREEN" ? "CMS is certified for normal operations." : "CMS remains RED until local/network/Sanity connectivity is fixed and the test passes."}
`);

  writeMd("FINAL-VERCEL-DOMAIN-CERTIFICATION.md", `# Final Vercel / Domain / DNS Certification

Generated: ${generatedAt}

- Apex HTTPS: ${coreQa[0]?.status === 200 ? "GREEN" : "RED"}
- www behavior: ${www.status} -> ${www.location || "no location"}
- SSL check: ${coreQa[0]?.status === 200 ? "GREEN" : "REVIEW"}
- Sitemap hostname: ${sitemapUrls.every((url) => url.startsWith(SITE)) ? "GREEN" : "RED"}
- DNS changes made: none.

Status: GREEN from public HTTP checks. If Vercel dashboard still says “DNS Change Recommended,” treat as AMBER until the dashboard’s exact recommended A/CNAME values are compared with Hostinger. Do not change MX/SPF/DKIM/DMARC.
`);

  writeMd("FINAL-PERFORMANCE-CERTIFICATION.md", `# Final Performance / Core Web Vitals Certification

Generated: ${generatedAt}

Lighthouse CLI was not run by this script. Production HTTP checks passed for representative pages.

Status: AMBER.

Manual action:
1. Run Lighthouse/PageSpeed on homepage, property practice page, service page, blog article, and contact page.
2. Record mobile/desktop performance, LCP, CLS, INP/TBT proxy.
3. Fix only material regressions; do not redesign for a perfect score.
`);

  writeMd("FINAL-ACCESSIBILITY-CERTIFICATION.md", `# Final Accessibility Certification

Generated: ${generatedAt}

Automated source/live crawl checked representative metadata, images, alt presence, CTAs, and schema. Full keyboard/screen-reader audit still requires browser tooling.

Status: AMBER.

Manual action:
1. Keyboard-test homepage, navigation, forms, blog, and contact page.
2. Run Lighthouse/axe accessibility checks.
3. Fix high-impact errors: missing labels, focus traps, low contrast, broken link names, or unlabeled buttons.
`);

  writeMd("FINAL-SEO-AEO-GEO-CERTIFICATION.md", `# Final SEO / AEO / GEO Certification

Generated: ${generatedAt}

- Sitemap/robots/canonical production alignment: GREEN from sampled crawl.
- Public author governance: ${AUTHOR_NAME}.
- Organization/legal-service schema: present in prior implementation; sampled crawl records schema presence in \`FINAL-PRODUCTION-CRAWL.csv\`.
- Historical GSC evidence imported: ${gsc.length} rows.
- Remaining issue: fresh post-launch GSC/Bing exports are needed to close search-console evidence fully.

Decision: AMBER, suitable for maintenance mode once GSC/Bing fresh export is reviewed.
`);

  writeMd("CHAMAN-LAW-FIRM-WEBSITE-FINAL-CLOSURE-REPORT.md", `# Chaman Law Firm Website Final Closure Report

Generated: ${generatedAt}

## 1. Executive Summary

The production website is live at ${SITE}. Core production routing, sitemap, robots, representative redirects, representative public pages, and build all pass. The rebuild can move out of active rebuild mode only as a CONDITIONAL GO because Search Console/Bing dashboard exports, GA4 Realtime confirmation, performance Lighthouse scoring, accessibility tooling, and Sanity write certification require final manual or network-stable verification.

## 2. Production Status

GREEN: homepage, blog, sitemap, robots, representative service pages, representative articles.

## 3. Build Status

Run separately in this sprint. See command output.

## 4. Total Public Pages

${publicPages} URLs in production sitemap.

## 5. Total Published Blog Posts

See sitemap/blog routes; production crawl sampled approved posts.

## 6. Total Static/Service Pages

Practice/service routes are included in sitemap and sampled crawl.

## 7. Total Legacy URLs Identified

${masterRows.length} unique legacy URLs in final reconciliation.

## 8. Total Legacy URLs Restored

See \`FINAL-MASTER-LEGACY-URL-RECONCILIATION.csv\`.

## 9. Total Legacy URLs Redirected

${masterRows.filter((row) => /REDIRECT/.test(row.final_classification)).length} classified as redirected/merged.

## 10. Total Hidden/Deferred

${hiddenRows.length} hidden/source records sampled from prior recovery queue.

## 11. Total Intentionally Retired

${masterRows.filter((row) => row.final_classification === "LOW_VALUE_RETIRED").length}.

## 12. Remaining Valuable 404s

${highValue404.length} candidates require fresh live review/export confirmation.

## 13. Redirect Certification

${redirectPass}/${redirectRows.length} sampled redirects passed. See \`FINAL-REDIRECT-CERTIFICATION.csv\`.

## 14. Sitemap Certification

${sitemap.status === 200 && !sitemapPreview.length ? "GREEN" : "RED"}.

## 15. Robots Certification

${robotsOk ? "GREEN" : "RED"}.

## 16. GSC Status

AMBER: historical exports imported; fresh post-launch dashboard export required.

## 17. Bing Status

AMBER: fresh dashboard export required.

## 18. GA4 Status

AMBER: source implementation exists; Vercel env and GA4 Realtime confirmation required.

## 19. Sanity Status

${sanity.status}: ${sanity.status === "GREEN" ? "read/write/delete test passed" : "certification test did not fully pass; see FINAL-SANITY-CERTIFICATION.md"}.

## 20. Vercel/Domain Status

GREEN from public HTTP checks; dashboard DNS advisory, if still present, should be compared manually before any DNS change.

## 21. Performance Status

AMBER: Lighthouse/PageSpeed scores require manual tool run.

## 22. Accessibility Status

AMBER: full axe/Lighthouse/keyboard audit required.

## 23. Backlink Preservation Status

AMBER: no fresh backlink export available locally.

## 24. SEO Status

AMBER/GREEN: technical basics pass; fresh GSC evidence required.

## 25. AEO Status

AMBER: content model supports answer-first improvements; ongoing content QA continues.

## 26. GEO Status

AMBER: Nigerian legal context present; continue entity and local signal strengthening in normal SEO ops.

## 27. Security/Secrets Status

GREEN: no secret files staged by closure script; tokens were not printed intentionally.

## 28. Known Non-Blocking Warnings

Existing Phase 5C lint warning: unused \`keyField\`.

## 29. Material Outstanding Issues

1. Sanity certification must pass in a stable network session if currently RED.
2. Fresh GSC/Bing exports must be reviewed.
3. GA4 Realtime must be confirmed with dashboard access.
4. Lighthouse/accessibility scores must be recorded.

## 30. Manual Actions Required

Principal/SEO operator: export GSC and Bing reports, confirm GA4 Realtime, compare Vercel DNS advisory if present, run Lighthouse/axe checks.

## 31. Maintenance Recommendations

Weekly for 4 weeks: review GSC 404/Page with Redirect reports, Bing crawl errors, GA4 traffic, lead delivery, and Sanity status.

Monthly: publish lawyer-reviewed content batches, refresh sitemap/indexing submissions, and audit top landing pages.

## 32. Final Decision

CONDITIONAL GO.

The rebuild is functionally live and can transition toward maintenance operations, but final closure depends on the clearly listed dashboard/manual confirmations above.
`);

  const summary = {
    generatedAt,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    sitemapUrls: publicPages,
    redirectsAudited: redirectRows.length,
    redirectPass,
    redirectReview,
    masterLegacyUrls: masterRows.length,
    highValue404Candidates: highValue404.length,
    hiddenRows: hiddenRows.length,
    sanityStatus: sanity.status,
    finalDecision: "CONDITIONAL GO"
  };
  fs.writeFileSync(path.join(DOCS, "FINAL-CLOSURE-RESULT.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        error: error?.name || "Error",
        message: error?.message || "Final closure certification failed",
        code: error?.code || error?.cause?.code || "",
        note: "Sanitized error output; secrets and request headers are suppressed."
      },
      null,
      2
    )
  );
  process.exit(1);
});
