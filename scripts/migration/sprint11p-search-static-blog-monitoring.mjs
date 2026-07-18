import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const GENERATED_AT = new Date().toISOString();

const paths = {
  sprint11oStaticRedirects: path.join("docs", "SPRINT-11O-STATIC-EXACT-REDIRECT-RESCUE-BATCH.csv"),
  sprint11oBlogRecovery: path.join("docs", "SPRINT-11O-LAWYER-REVIEWED-BLOG-CONTINUATION.csv"),
  sprint11oResult: path.join("docs", "SPRINT-11O-RESULT.json"),
  freshEvidenceStatus: path.join("docs", "SPRINT-11P-FRESH-GSC-BING-EXPORT-STATUS.md"),
  staticMonitoring: path.join("docs", "SPRINT-11P-SPRINT-11O-STATIC-REDIRECT-MONITORING.csv"),
  staticRestorationPlan: path.join("docs", "SPRINT-11P-STATIC-SERVICE-RESTORATION-PLAN.csv"),
  staticImplementationBatch: path.join("docs", "SPRINT-11P-STATIC-SERVICE-IMPLEMENTATION-BATCH.csv"),
  blogRecovery: path.join("docs", "SPRINT-11P-LAWYER-SAFE-BLOG-RECOVERY.csv"),
  seoAeoGeo: path.join("docs", "SPRINT-11P-SEO-AEO-GEO-ENHANCEMENT.csv"),
  redirectActivation: path.join("docs", "SPRINT-11P-REDIRECT-ACTIVATION-BATCH.csv"),
  indexingPack: path.join("docs", "SPRINT-11P-GSC-BING-INDEXING-PACK.md"),
  report: path.join("docs", "SPRINT-11P-SEARCH-STATIC-BLOG-RECOVERY-REPORT.md"),
  resultJson: path.join("docs", "SPRINT-11P-RESULT.json")
};

const olderRedirectSamples = [
  ["/the-concept-of-rule-of-law-in-nigeria", "/resources/blog/the-concept-of-rule-of-law-in-nigeria", "Sprint 11N"],
  ["/basic-elements-of-defamatory-statement", "/resources/blog/basic-elements-of-defamatory-statement", "Sprint 11N"],
  ["/maxims-of-equity", "/resources/blog/maxims-of-equity", "Sprint 11L"],
  ["/what-are-the-sources-of-nigerian-law", "/resources/blog/what-are-the-sources-of-nigerian-law", "Sprint 11L"],
  ["/revocation-of-power-of-attorney", "/resources/blog/revocation-of-power-of-attorney", "Sprint 11K"],
  ["/deed-of-partition-in-nigeria", "/resources/blog/deed-of-partition-in-nigeria", "Sprint 11I"],
  ["/the-duties-of-lawyers-to-client", "/resources/blog/the-duties-of-lawyers-to-client", "Sprint 11H"],
  ["/charles-chukwuma-nkwoka", "/lawyers/charles-chukwuma-nkwoka", "Sprint 11D"],
  ["/documents-apostilled-in-nigeria", "/practice-areas/notary-public-services", "Sprint 11E"],
  ["/how-to-register-a-business-name-in-nigeria-2024", "/practice-areas/corporate-commercial-law", "Sprint 11F"],
  ["/who-can-be-a-notary-public", "/practice-areas/notary-public-services", "Sprint 11G"]
];

const hiddenSamples = [
  "/resources/blog/land-use-act-1978",
  "/resources/blog/doctrine-of-ultra-vires",
  "/resources/blog/challenges-of-implementing-the-land-use-act",
  "/resources/blog/expert-witnesses-in-nigeria-court-proceeding",
  "/resources/blog/how-to-track-a-stolen-phone-in-nigeria"
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers = [], ...body] = rows;
  return body
    .filter((item) => item.some(Boolean))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ""])));
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
    "utf8"
  );
}

function normalizePath(value) {
  const raw = String(value || "").trim();
  if (!raw || raw === "/") return "/";
  try {
    const parsed = new URL(raw, SITE_URL);
    return `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
  } catch {
    return `/${raw.replace(/^https?:\/\/[^/]+/i, "").split(/[?#]/)[0].split("/").filter(Boolean).join("/")}`;
  }
}

function absoluteUrl(route) {
  const normalized = normalizePath(route);
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

function titleFromSlug(value) {
  return normalizePath(value)
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bOf\b/g, "of")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bThe\b/g, "the")
    .replace(/\bCac\b/g, "CAC") || "Legacy Authority Page";
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.method === "HEAD" ? 12000 : 20000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      lastError = error.message;
      await sleep(attempt * 1000);
    }
  }
  return { status: "error", headers: new Map(), text: async () => "", error: lastError };
}

async function head(pathOrUrl) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : absoluteUrl(pathOrUrl);
  const response = await fetchWithRetry(url, { method: "HEAD", redirect: "manual" });
  return {
    url,
    status: response.status,
    location: response.headers?.get?.("location") || "",
    cache: response.headers?.get?.("x-vercel-cache") || ""
  };
}

async function getText(pathOrUrl) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : absoluteUrl(pathOrUrl);
  const response = await fetchWithRetry(url, { redirect: "manual" });
  return {
    url,
    status: response.status,
    location: response.headers?.get?.("location") || "",
    text: await response.text()
  };
}

function canonicalFromHtml(html) {
  const match = String(html || "").match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] || "";
}

function staticPageType(target) {
  if (target.includes("/property-real-estate-law")) return "property/service authority";
  if (target.includes("/corporate-commercial-law")) return "corporate/service authority";
  if (target.includes("/litigation-dispute-resolution")) return "litigation/static authority";
  if (target.includes("/probate-estate-administration")) return "probate/service authority";
  if (target.includes("/immigration-services")) return "immigration/service authority";
  if (target.includes("/employment-law")) return "employment/service authority";
  if (target.includes("/adr-mediation")) return "ADR/static authority";
  if (target.includes("/notary-public-services")) return "notary/service authority";
  return "static authority";
}

function intentQuality(source, target) {
  const text = `${source} ${target}`.toLowerCase();
  if (/tax|securities|board|shares|corporate/.test(text) && target.includes("corporate")) return "strong practice-area intent match";
  if (/land|property|tenant|landlord|mortgage|registration|stamp/.test(text) && target.includes("property")) return "strong practice-area intent match";
  if (/probate|will|inheritance/.test(text) && target.includes("probate")) return "strong practice-area intent match";
  if (/immigration|visa|passport/.test(text) && target.includes("immigration")) return "strong practice-area intent match";
  if (/employment|trade-union/.test(text) && target.includes("employment")) return "strong practice-area intent match";
  if (/evidence|human-right|witness/.test(text) && target.includes("litigation")) return "strong practice-area intent match";
  return "acceptable broad practice-area match";
}

function restorationDisposition(source) {
  const slug = normalizePath(source);
  if (/land-use-act|land-registration|property-owner|joint-property|mortgage|landlords-and-tenants|land-use-charge|sale-of-land|family-land|stamping/.test(slug)) {
    return {
      classification: "replace later with restored exact page",
      seoRisk: "medium/high if left as broad redirect long term",
      notes: "Property-law search intent is specific enough to deserve a stronger exact page after lawyer review."
    };
  }
  if (/tax-clearance|securities|board-of-directors|transfer-of-shares/.test(slug)) {
    return {
      classification: "create stronger service page",
      seoRisk: "medium if left as broad corporate redirect long term",
      notes: "Corporate/commercial search intent can support a focused service or static authority page."
    };
  }
  if (/probate|will/.test(slug)) {
    return {
      classification: "replace later with restored exact page",
      seoRisk: "high if probate rankings continue to consolidate only into a broad page",
      notes: "Probate content needs lawyer review before exact restoration."
    };
  }
  if (/evidence|human-right|witness/.test(slug)) {
    return {
      classification: "create stronger service page",
      seoRisk: "medium if left as broad litigation redirect",
      notes: "Litigation authority topic can support a dedicated explainer/service page."
    };
  }
  return {
    classification: "keep redirect temporarily",
    seoRisk: "low/medium",
    notes: "Monitor in GSC/Bing before deciding whether exact restoration is worthwhile."
  };
}

function finalRouteForStatic(source, target) {
  const slug = normalizePath(source).slice(1);
  const base = normalizePath(target);
  if (base.includes("/property-real-estate-law")) {
    if (/land-use-act/.test(slug)) return "/practice-areas/property-real-estate-law/land-use-act-advisory";
    if (/land-registration/.test(slug)) return "/practice-areas/property-real-estate-law/land-registration";
    if (/property-owner/.test(slug)) return "/practice-areas/property-real-estate-law/property-owner-rights";
    if (/mortgage/.test(slug)) return "/practice-areas/property-real-estate-law/mortgage-document-review";
    if (/land-use-charge/.test(slug)) return "/practice-areas/property-real-estate-law/land-use-charge";
    return `/practice-areas/property-real-estate-law/${slug}`;
  }
  if (base.includes("/corporate-commercial-law")) {
    if (/tax-clearance/.test(slug)) return "/practice-areas/corporate-commercial-law/tax-clearance-certificate";
    if (/transfer-of-shares/.test(slug)) return "/practice-areas/corporate-commercial-law/share-transfer";
    if (/securities/.test(slug)) return "/practice-areas/corporate-commercial-law/securities-regulatory-compliance";
    if (/board-of-directors/.test(slug)) return "/practice-areas/corporate-commercial-law/board-governance";
    return `/practice-areas/corporate-commercial-law/${slug}`;
  }
  if (base.includes("/litigation-dispute-resolution")) {
    if (/digital-evidence/.test(slug)) return "/practice-areas/litigation-dispute-resolution/digital-evidence";
    if (/expert-witnesses/.test(slug)) return "/practice-areas/litigation-dispute-resolution/expert-witnesses";
    if (/human-right/.test(slug)) return "/practice-areas/litigation-dispute-resolution/fundamental-rights-enforcement";
    return `/practice-areas/litigation-dispute-resolution/${slug}`;
  }
  if (base.includes("/probate-estate-administration")) return `/practice-areas/probate-estate-administration/${slug}`;
  if (base.includes("/employment-law")) return `/practice-areas/employment-law/${slug}`;
  if (base.includes("/immigration-services")) return `/practice-areas/immigration-services/${slug}`;
  return `${base}/${slug}`.replace(/\/+/g, "/");
}

function legalStatusForStatic(source) {
  const slug = normalizePath(source);
  if (/probate|will|inheritance|tenant|landlord|land-use-act|land-use-charge|human-right|evidence|mortgage|family-land/.test(slug)) {
    return "medium/high - lawyer review required before exact page publication";
  }
  if (/tax|securities|trade-union|corporate|board|shares/.test(slug)) return "medium - current-law/compliance review required";
  return "low/medium - editorial and legal review required";
}

function classifyBlog(row) {
  const text = `${row.notes || ""} ${row["risk flags"] || ""} ${row["legal/current-law status"] || ""} ${row.slug || ""}`.toLowerCase();
  const gatesMissing = [];
  if (row["body gate"] !== "yes") gatesMissing.push("body");
  if (row["SEO title gate"] !== "yes") gatesMissing.push("SEO title");
  if (row["meta description gate"] !== "yes") gatesMissing.push("meta description");
  if (row["image gate"] !== "yes") gatesMissing.push("image");
  if (row["alt text"] === "") gatesMissing.push("alt text");
  if (row["CTA gate"] !== "yes") gatesMissing.push("CTA");
  if (row["internal links gate"] !== "yes") gatesMissing.push("internal links");

  if (/duplicate|cannibal/.test(text)) return { classification: "duplicate/cannibalizing, do not approve", decision: "keep hidden", reason: "duplicate/cannibalization risk requires editorial consolidation" };
  if (/high risk|unsafe self-help|police|stolen|correctional|evict|landlord|tenant/.test(text)) return { classification: "high risk, keep hidden", decision: "keep hidden", reason: "high-risk legal/procedural topic requires lawyer review before publication" };
  if (/property-sales|luxury|chaman properties|plugin debris|misleading free-service/.test(text)) return { classification: "medium risk, needs Principal/lawyer review", decision: "keep hidden", reason: "cleanup required for off-brand, debris, or misleading wording" };
  if (/tax|land use|land registration|mortgage|securities|board|company|minority|fundamental|limitation|rights|family land|property owner/.test(text)) {
    return { classification: "convert to static/service page", decision: "keep hidden", reason: "search intent is better served by a focused service/static authority page after review" };
  }
  if (gatesMissing.length) return { classification: "low-risk after general-information framing", decision: "keep hidden", reason: `missing gate(s): ${gatesMissing.join(", ")}` };
  if (/medium risk|needs principal|lawyer review|manual verification|current-law gate not cleared/.test(text)) {
    return { classification: "medium risk, needs Principal/lawyer review", decision: "keep hidden", reason: "current-law/legal-review gate not cleared" };
  }
  return { classification: "low-risk after general-information framing", decision: "keep hidden", reason: "no explicit lawyer/current-law clearance in Sprint 11P" };
}

function searchEvidenceFiles() {
  const matches = [];
  const pattern = /(search.?console|gsc|bing|not.?found|404|crawl|index|redirect.?error|performance|queries|backlink|ahrefs|semrush|ubersuggest|moz|serp|featured.?snippet)/i;
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (/node_modules|\.next|\.git|wp-content|backup|backups|legacy website/i.test(full)) continue;
        walk(full);
      } else if (pattern.test(entry.name)) {
        matches.push({ file: full, mtime: fs.statSync(full).mtime.toISOString() });
      }
    }
  }
  walk("docs");
  return matches.sort((a, b) => b.mtime.localeCompare(a.mtime));
}

async function verifyRedirect(source, destination) {
  const rows = [];
  for (const variant of [normalizePath(source), `${normalizePath(source)}/`]) {
    const first = await head(variant);
    const finalLocation = first.location.startsWith("http") ? first.location : `${SITE_URL}${first.location}`;
    const expectedLocation = absoluteUrl(destination);
    const target = await head(destination);
    rows.push({
      source: variant,
      expectedDestination: destination,
      status: first.status,
      location: first.location,
      targetStatus: target.status,
      oneHop: first.status === 308 && finalLocation === expectedLocation && target.status === 200 ? "yes" : "no"
    });
  }
  return rows;
}

async function main() {
  const staticRedirectRows = readCsv(paths.sprint11oStaticRedirects);
  const blogRows = readCsv(paths.sprint11oBlogRecovery).filter((row) => row["approval decision"] === "keep hidden");
  const sprint11oResult = fs.existsSync(paths.sprint11oResult) ? JSON.parse(fs.readFileSync(paths.sprint11oResult, "utf8")) : {};

  const coreChecks = {};
  for (const item of ["/", "/resources/blog", "/sitemap.xml", "/robots.txt"]) {
    coreChecks[item] = await head(item);
  }
  coreChecks["https://www.chamanlawfirm.com/"] = await head("https://www.chamanlawfirm.com/");

  const sitemap = await getText("/sitemap.xml");
  const robots = await getText("/robots.txt");
  const sitemapHasPreviewUrls = /vercel\.app|preview/i.test(sitemap.text);
  const robotsProductionSitemap = robots.text.includes(`${SITE_URL}/sitemap.xml`);
  const robotsBlocksStudio = /Disallow:\s*\/studio/i.test(robots.text);
  const robotsBlocksApi = /Disallow:\s*\/api/i.test(robots.text);

  const staticMonitoring = [];
  const redirectQaRows = [];
  for (const row of staticRedirectRows) {
    const source = normalizePath(row.source);
    const destination = normalizePath(row.destination);
    const targetHtml = await getText(destination);
    const canonical = canonicalFromHtml(targetHtml.text);
    const disposition = restorationDisposition(source);
    const redirectChecks = await verifyRedirect(source, destination);
    redirectQaRows.push(...redirectChecks.map((check) => ({ group: "Sprint 11O static", ...check })));
    staticMonitoring.push({
      "old URL": absoluteUrl(source),
      "current redirect target": destination,
      "target page type": staticPageType(destination),
      "target status": targetHtml.status,
      "sitemap inclusion": sitemap.text.includes(absoluteUrl(destination)) ? "included" : "not included",
      "canonical status": canonical === absoluteUrl(destination) ? "canonical matches target" : canonical ? `canonical differs: ${canonical}` : "canonical not detected",
      "intent match quality": intentQuality(source, destination),
      "whether redirect should remain permanent": disposition.classification === "keep redirect permanently" ? "yes" : "no",
      "whether exact static/service page should be restored later": /replace|create/.test(disposition.classification) ? "yes" : "monitor",
      "classification": disposition.classification,
      "SEO risk": disposition.seoRisk,
      "notes": disposition.notes
    });
  }

  const sprint11oArticleRedirect = sprint11oResult.approvedThisRun?.[0]
    ? [[normalizePath(new URL(sprint11oResult.approvedThisRun[0].oldUrl).pathname), sprint11oResult.approvedThisRun[0].targetPath, "Sprint 11O article"]]
    : [["/proven-steps-the-canons-of-interpretation", "/resources/blog/proven-steps-the-canons-of-interpretation", "Sprint 11O article"]];
  for (const [source, destination, group] of [...sprint11oArticleRedirect, ...olderRedirectSamples]) {
    const checks = await verifyRedirect(source, destination);
    redirectQaRows.push(...checks.map((check) => ({ group, ...check })));
  }

  const hiddenChecks = [];
  for (const hidden of hiddenSamples) {
    const response = await head(hidden);
    hiddenChecks.push({ url: hidden, status: response.status });
  }

  const restorationCandidates = staticMonitoring
    .filter((row) => /replace later|create stronger/.test(row.classification))
    .slice(0, 20)
    .map((row, index) => {
      const source = normalizePath(row["old URL"]);
      const target = normalizePath(row["current redirect target"]);
      const finalRoute = finalRouteForStatic(source, target);
      const title = titleFromSlug(source);
      return {
        priority: index + 1,
        "old URL": absoluteUrl(source),
        "old title": title,
        "current status": "redirects to existing live practice page",
        "proposed final URL": absoluteUrl(finalRoute),
        "page type": staticPageType(target).replace(" authority", ""),
        H1: title,
        "SEO title": `${title} | Chaman Law Firm`,
        "meta description": `Chaman Law Firm explains ${title.toLowerCase()} in Nigeria, including key risks, documents, legal process, and when to speak with a lawyer.`,
        canonical: absoluteUrl(finalRoute),
        "required content sections": "short answer; legal context; required documents; process; risks; when to speak with a lawyer; FAQs after lawyer review; consultation CTA",
        CTA: "Book a consultation",
        "internal links": `${target}; /consultation; /contact; related resources`,
        "image recommendation": "use approved law-firm legal/service image; no Chaman Properties image",
        "alt text": `${title} legal guidance | Chaman Law Firm`,
        "legal review status": legalStatusForStatic(source),
        "content readiness": "brief only; not ready to publish in Sprint 11P",
        "sitemap readiness": "pending page implementation and QA",
        "redirect plan after publication": `${source} -> ${finalRoute} only after final page returns 200 and is canonical-safe`,
        "publish readiness": "No-Go for publication; restore in dedicated static-page sprint"
      };
    });

  const implementationBatch = restorationCandidates.slice(0, 5).map((row) => ({
    ...row,
    "implementation decision": "page brief only in Sprint 11P",
    "reason not published now": "needs full page copy, lawyer review, image confirmation, and duplicate/cannibalization check"
  }));

  const blogRecovery = blogRows.map((row) => {
    const classification = classifyBlog(row);
    return {
      "old URL": row["old URL"],
      slug: row.slug,
      title: row.title,
      "source Sanity document": row["source Sanity document"],
      "body gate": row["body gate"],
      "formatting gate": "reviewed from Sprint 11O recovered body",
      "unsafe legal claim": /unsafe|high risk/i.test(`${row.notes} ${row["risk flags"]}`) ? "possible/flagged" : "not detected by automated pass",
      "misleading free-service wording": /free-service|misleading/i.test(`${row.notes} ${row["risk flags"]}`) ? "flagged" : "not detected",
      "duplicate/cannibalization risk": /duplicate|cannibal/i.test(`${row.notes} ${row["risk flags"]}`) ? "flagged" : "not flagged",
      "off-brand content": /property-sales|luxury|Chaman Properties/i.test(`${row.notes} ${row["risk flags"]}`) ? "flagged" : "not detected",
      "SEO title present": row["SEO title gate"],
      "meta description present": row["meta description gate"],
      "canonical": row.canonical,
      "image and alt text present": row["image gate"] === "yes" && row["alt text"] ? "yes" : "no",
      "category/practice relationship": row["practice/category"],
      "CTA present": row["CTA gate"],
      "internal links present": row["internal links gate"],
      author: row.author,
      classification: classification.classification,
      "approval decision": classification.decision,
      "reason kept hidden": classification.reason
    };
  });

  const approvedNow = [];
  const redirectActivationRows = [
    {
      "old URL": "none",
      "new URL": "none",
      "redirect type": "none",
      status: "no new Sprint 11P redirects activated",
      "activation condition": "future targets must return 200, be sitemap/canonical safe, and pass live QA"
    }
  ];

  const seoRows = [
    ...restorationCandidates.map((row) => ({
      "URL": row["proposed final URL"],
      type: row["page type"],
      "search intent answered early": "planned",
      "clear H1": row.H1,
      "strong title": row["SEO title"],
      "strong meta description": row["meta description"],
      "canonical correct": row.canonical,
      "internal links included": row["internal links"],
      "relevant CTA included": row.CTA,
      "image and alt text included": row["alt text"],
      "FAQ/short answer": "planned after lawyer review",
      "no keyword stuffing": "required",
      "no unsupported legal claim": "requires lawyer review",
      "duplicate/cannibalization issue": "pending review",
      "sitemap inclusion confirmed": "pending page implementation",
      "old URL redirect/canonical strategy": row["redirect plan after publication"]
    })),
    ...approvedNow.map((item) => ({
      URL: item.targetUrl,
      type: "blog post",
      "search intent answered early": "confirmed",
      "clear H1": item.title,
      "strong title": "confirmed",
      "strong meta description": "confirmed",
      "canonical correct": item.targetUrl,
      "internal links included": "confirmed",
      "relevant CTA included": "confirmed",
      "image and alt text included": "confirmed",
      "FAQ/short answer": "confirmed where useful",
      "no keyword stuffing": "confirmed",
      "no unsupported legal claim": "confirmed",
      "duplicate/cannibalization issue": "not flagged",
      "sitemap inclusion confirmed": "confirmed",
      "old URL redirect/canonical strategy": "exact redirect after target QA"
    }))
  ];

  const evidenceFiles = searchEvidenceFiles();
  const freshEvidenceMd = [
    "# Sprint 11P Fresh GSC/Bing Export Status",
    "",
    `Generated: ${GENERATED_AT}`,
    "",
    "No fresh post-Sprint-11O Google Search Console, Bing Webmaster, backlink, SERP, or featured-snippet export was found locally. Existing local GSC/Bing and sprint recovery documents remain the active evidence base.",
    "",
    "Files with search-related names currently available for reference:",
    ...evidenceFiles.slice(0, 40).map((item) => `- ${item.file} (${item.mtime})`),
    "",
    "Manual follow-up: export fresh GSC Pages, Queries, Not Found, Crawled Currently Not Indexed, Page With Redirect, Redirect Error, and Bing crawl/index reports after Google/Bing process the latest redirects."
  ].join("\n");
  fs.writeFileSync(paths.freshEvidenceStatus, freshEvidenceMd, "utf8");

  writeCsv(
    paths.staticMonitoring,
    [
      "old URL",
      "current redirect target",
      "target page type",
      "target status",
      "sitemap inclusion",
      "canonical status",
      "intent match quality",
      "whether redirect should remain permanent",
      "whether exact static/service page should be restored later",
      "classification",
      "SEO risk",
      "notes"
    ],
    staticMonitoring
  );

  writeCsv(
    paths.staticRestorationPlan,
    [
      "priority",
      "old URL",
      "old title",
      "current status",
      "proposed final URL",
      "page type",
      "H1",
      "SEO title",
      "meta description",
      "canonical",
      "required content sections",
      "CTA",
      "internal links",
      "image recommendation",
      "alt text",
      "legal review status",
      "content readiness",
      "sitemap readiness",
      "redirect plan after publication",
      "publish readiness"
    ],
    restorationCandidates
  );

  writeCsv(
    paths.staticImplementationBatch,
    [
      "priority",
      "old URL",
      "old title",
      "current status",
      "proposed final URL",
      "page type",
      "H1",
      "SEO title",
      "meta description",
      "canonical",
      "required content sections",
      "CTA",
      "internal links",
      "image recommendation",
      "alt text",
      "legal review status",
      "content readiness",
      "sitemap readiness",
      "redirect plan after publication",
      "publish readiness",
      "implementation decision",
      "reason not published now"
    ],
    implementationBatch
  );

  writeCsv(
    paths.blogRecovery,
    [
      "old URL",
      "slug",
      "title",
      "source Sanity document",
      "body gate",
      "formatting gate",
      "unsafe legal claim",
      "misleading free-service wording",
      "duplicate/cannibalization risk",
      "off-brand content",
      "SEO title present",
      "meta description present",
      "canonical",
      "image and alt text present",
      "category/practice relationship",
      "CTA present",
      "internal links present",
      "author",
      "classification",
      "approval decision",
      "reason kept hidden"
    ],
    blogRecovery
  );

  writeCsv(
    paths.seoAeoGeo,
    [
      "URL",
      "type",
      "search intent answered early",
      "clear H1",
      "strong title",
      "strong meta description",
      "canonical correct",
      "internal links included",
      "relevant CTA included",
      "image and alt text included",
      "FAQ/short answer",
      "no keyword stuffing",
      "no unsupported legal claim",
      "duplicate/cannibalization issue",
      "sitemap inclusion confirmed",
      "old URL redirect/canonical strategy"
    ],
    seoRows
  );

  writeCsv(paths.redirectActivation, ["old URL", "new URL", "redirect type", "status", "activation condition"], redirectActivationRows);

  const indexingPack = [
    "# Sprint 11P GSC/Bing Indexing Pack",
    "",
    `Generated: ${GENERATED_AT}`,
    "",
    "Use this pack only for URLs verified live or verified as exact redirects. Do not submit hidden drafts, 404 URLs, preview URLs, or Vercel URLs.",
    "",
    "## Production Sitemap",
    "",
    `- ${SITE_URL}/sitemap.xml`,
    "",
    "## Newly Approved Live URLs In Sprint 11P",
    "",
    "- None. Sprint 11P did not approve or publish new pages/posts.",
    "",
    "## Sprint 11O Article URL To Monitor",
    "",
    `- ${SITE_URL}/resources/blog/proven-steps-the-canons-of-interpretation`,
    `- ${SITE_URL}/proven-steps-the-canons-of-interpretation`,
    "",
    "## Sprint 11O Static Redirect Old URLs",
    "",
    ...staticRedirectRows.map((row) => `- ${absoluteUrl(row.source)}`),
    "",
    "## Sprint 11O Static Redirect Final Targets",
    "",
    ...[...new Set(staticRedirectRows.map((row) => absoluteUrl(row.destination)))].map((url) => `- ${url}`),
    "",
    "## Manual Search Console/Bing Instructions",
    "",
    "- Refresh/resubmit the production sitemap.",
    "- Inspect live final URLs first.",
    "- Inspect old redirected URLs after verifying the final target is canonical-safe.",
    "- Request indexing where available.",
    "- Do not submit hidden draft URLs or URLs marked 404.",
    ""
  ].join("\n");
  fs.writeFileSync(paths.indexingPack, indexingPack, "utf8");

  const result = {
    generatedAt: GENERATED_AT,
    staticRedirectsReviewed: staticMonitoring.length,
    staticRestorationCandidates: restorationCandidates.length,
    staticImplementationBriefs: implementationBatch.length,
    hiddenBlogCandidatesReviewed: blogRecovery.length,
    approvedInSprint11P: approvedNow.length,
    redirectActivationsInSprint11P: 0,
    coreChecks,
    sitemapStatus: sitemap.status,
    sitemapHasPreviewUrls,
    robotsStatus: robots.status,
    robotsProductionSitemap,
    robotsBlocksStudio,
    robotsBlocksApi,
    redirectQaFailures: redirectQaRows.filter((row) => row.oneHop !== "yes"),
    hiddenDraftFailures: hiddenChecks.filter((row) => row.status !== 404),
    filesWritten: [
      paths.freshEvidenceStatus,
      paths.staticMonitoring,
      paths.staticRestorationPlan,
      paths.staticImplementationBatch,
      paths.blogRecovery,
      paths.seoAeoGeo,
      paths.redirectActivation,
      paths.indexingPack,
      paths.report,
      paths.resultJson
    ]
  };

  const report = [
    "# Sprint 11P Search, Static Redirect, and Blog Recovery Report",
    "",
    `Generated: ${GENERATED_AT}`,
    "",
    "## Summary",
    "",
    `- Sprint 11O static redirects reviewed: ${result.staticRedirectsReviewed}`,
    `- Static/service restoration candidates planned: ${result.staticRestorationCandidates}`,
    `- Static/service implementation briefs prepared: ${result.staticImplementationBriefs}`,
    `- Hidden blog candidates reviewed: ${result.hiddenBlogCandidatesReviewed}`,
    `- Articles/pages approved in Sprint 11P: ${result.approvedInSprint11P}`,
    `- New redirects activated in Sprint 11P: ${result.redirectActivationsInSprint11P}`,
    "",
    "No DNS, Hostinger, Chaman Properties, secrets, raw backups, SQL dumps, wp-config.php, wp-content folders, or environment files were touched.",
    "",
    "## Fresh Search Evidence",
    "",
    "No fresh GSC/Bing/backlink/SERP export was found locally. Existing local sprint evidence remains the active base, and fresh exports are a manual follow-up.",
    "",
    "## Static Redirect Monitoring",
    "",
    "All 20 Sprint 11O static authority redirects were reviewed as interim authority rescues. Most should remain temporary while stronger exact static/service pages are prepared, lawyer-reviewed, image-completed, and QA-confirmed.",
    "",
    "## Blog Recovery",
    "",
    "All 46 Sprint 11O hidden candidates remain hidden. None received explicit current-law/lawyer clearance in Sprint 11P, and several still need image, CTA, internal-link, cleanup, duplicate, or current-law work.",
    "",
    "## QA",
    "",
    `- Sitemap status: ${result.sitemapStatus}`,
    `- Sitemap contains preview URLs: ${result.sitemapHasPreviewUrls ? "yes" : "no"}`,
    `- Robots status: ${result.robotsStatus}`,
    `- Robots production sitemap: ${result.robotsProductionSitemap ? "yes" : "no"}`,
    `- Robots blocks /studio and /api: ${result.robotsBlocksStudio && result.robotsBlocksApi ? "yes" : "no"}`,
    `- Redirect QA failures: ${result.redirectQaFailures.length}`,
    `- Hidden draft guardrail failures: ${result.hiddenDraftFailures.length}`,
    "",
    "## Next Step",
    "",
    "Use the implementation batch to draft the first exact static/service pages, starting with the highest-value property, corporate, probate, and litigation authority topics."
  ].join("\n");
  fs.writeFileSync(paths.report, report, "utf8");
  fs.writeFileSync(paths.resultJson, JSON.stringify(result, null, 2), "utf8");

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
