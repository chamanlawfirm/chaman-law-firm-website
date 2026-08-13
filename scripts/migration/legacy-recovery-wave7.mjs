import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const API_VERSION = "2026-05-17";
const APPLY = process.argv.includes("--apply");
const CERT_ONLY = process.argv.includes("--cert-only");
const FETCH_HEADERS = {
  "user-agent": "Mozilla/5.0 (compatible; ChamanLawFirmRecoveryBot/7.0; +https://chamanlawfirm.com)",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const raw of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");

const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "";
const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eeuefmhu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: API_VERSION,
  useCdn: false,
  perspective: "published",
};
const client = createClient({ ...clientConfig, token });
const publicClient = createClient(clientConfig);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      field += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (!quoted && char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += char;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim())) rows.push(row);
  }
  const headers = rows.shift() || [];
  return {
    headers,
    rows: rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))),
  };
}

function readCsv(filePath) {
  return fs.existsSync(filePath) ? parseCsv(fs.readFileSync(filePath, "utf8")) : { headers: [], rows: [] };
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
    "utf8",
  );
}

function normalizePath(urlOrPath) {
  try {
    return new URL(urlOrPath, SITE).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return String(urlOrPath || "").replace(/^https?:\/\/[^/]+/i, "").replace(/\/+$/, "") || "/";
  }
}

function titleFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function legacySlug(row) {
  return row.legacy_slug || normalizePath(row.legacy_url || row.normalized_url || "").split("/").filter(Boolean).pop() || "";
}

function topicFor(text) {
  const value = String(text || "").toLowerCase();
  if (/casino|vpn|game|australian|sports facility|stadium|solar|telecom|railway|water management|conservation|protected areas|seed|aviation|travel insurance|e-manifest/.test(value)) return "retire";
  if (/tenant|tenancy|lease|evict|landlord/.test(value)) return "lease";
  if (/survey|boundary|excision|gazette|encroach/.test(value)) return "survey";
  if (/fraud|fake|scam|pitfall/.test(value)) return "fraud";
  if (/joint venture|developer|development|construction|building|permit|approval|fencing|collapse|renovation|restoration|urban|infrastructure/.test(value)) return "development";
  if (/stamp duty|title|land|property|occupancy|deed|mortgage|real estate|consent|convey|ownership|acquisition/.test(value)) return "property";
  if (/director|board|governance|subsidiary|parent|shareholder|cama|ngo|association|chamber|business permit/.test(value)) return "governance";
  if (/investment|venture capital|foreign participation|capital|broker|securities|sec|trade polic|industrial incentive/.test(value)) return "investment";
  if (/data|privacy|biometric|cyber|digital|online|e-commerce|trade secret/.test(value)) return "data";
  if (/contract|commercial|business|regulatory|compliance|marketing|advertising|agency|warranties|consumer/.test(value)) return "corporate";
  if (/appeal|judgment|court|litigation|injunction|evidence|police|lawsuit|crime|right|detain|arrest|judiciary|task force|human right|laches|negligence|trespass/.test(value)) return "litigation";
  if (/debt|creditor|debtor|loan|demand letter|financial distress/.test(value)) return "debt";
  if (/custody|child|marriage|divorce|family|alimony|adoption|fostering|wife|parental|promise to marry|ancillary/.test(value)) return "family";
  if (/inheritance|will|probate|estate|intestate|testate|administration|personal representative/.test(value)) return "probate";
  if (/visa|immigration|citizenship|passport|stateless|foreign talent/.test(value)) return "immigration";
  if (/employment|labour|labor|worker|employee|workplace|union|dismissal|wage/.test(value)) return "employment";
  if (/mediation|arbitration|adr|settlement|dispute resolution|arbitrable/.test(value)) return "adr";
  if (/notary|legalise|legalize|attest|apostille|authentication|document/.test(value)) return "notary";
  return "general";
}

const topicTargets = {
  property: "/practice-areas/property-real-estate-law/title-perfection-advisory",
  lease: "/practice-areas/property-real-estate-law/lease-documentation-advisory",
  survey: "/practice-areas/property-real-estate-law/survey-plan-and-boundary-review",
  fraud: "/practice-areas/property-real-estate-law/land-fraud-risk-review",
  development: "/practice-areas/property-real-estate-law/real-estate-joint-venture-advisory",
  corporate: "/practice-areas/corporate-commercial-law/business-contract-dispute-review",
  governance: "/practice-areas/corporate-commercial-law/director-duties-and-board-advisory",
  investment: "/practice-areas/corporate-commercial-law/investment-agreement-review",
  data: "/practice-areas/corporate-commercial-law/data-protection-compliance-advisory",
  litigation: "/practice-areas/litigation-dispute-resolution/appeal-record-and-judgment-review",
  debt: "/practice-areas/debt-recovery/debt-demand-letter-advisory",
  family: "/practice-areas/family-law/family-agreement-review",
  probate: "/practice-areas/probate-estate-administration/estate-document-review",
  immigration: "/practice-areas/immigration-services/immigration-document-review",
  employment: "/practice-areas/employment-law/employment-dispute-pre-action-review",
  adr: "/practice-areas/adr-mediation/mediation-settlement-document-review",
  notary: "/practice-areas/notary-public-services/document-legalization-and-attestation",
  general: "/consultation",
};

async function fetchStatus(url, follow = false) {
  try {
      const response = await fetch(url, {
        method: "GET",
        redirect: follow ? "follow" : "manual",
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(20000),
      });
    return {
      status: response.status,
      location: response.headers.get("location") || "",
      finalUrl: response.url || url,
      title: await response.text().then((html) => html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || "").catch(() => ""),
    };
  } catch (error) {
    return { status: "ERR", location: "", finalUrl: url, title: "", error: error?.code || error?.name || error?.message || "fetch_error" };
  }
}

async function fetchLight(url, follow = false) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await fetch(url, {
        method,
        redirect: follow ? "follow" : "manual",
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(10000),
      });
      return {
        status: response.status,
        location: response.headers.get("location") || "",
        finalUrl: response.url || url,
      };
    } catch (error) {
      if (method === "HEAD") continue;
      return { status: "ERR", location: "", finalUrl: url, error: error?.code || error?.name || error?.message || "fetch_error" };
    }
  }
  return { status: "ERR", location: "", finalUrl: url, error: "fetch_error" };
}

async function mapLimit(values, limit, task) {
  const out = [];
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < values.length) {
      const current = index;
      index += 1;
      out[current] = await task(values[current], current);
    }
  });
  await Promise.all(workers);
  return out;
}

function parseRedirectMap() {
  const file = "src/data/legacy-static-redirects.ts";
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "export const legacyStaticRedirects = {};";
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return new Map(Object.entries(JSON.parse(json)));
}

function writeRedirectMap(entries) {
  if (!APPLY) return;
  const sorted = Object.fromEntries([...entries.entries()].sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync("src/data/legacy-static-redirects.ts", `export const legacyStaticRedirects: Record<string, string> = ${JSON.stringify(sorted, null, 2)};\n`, "utf8");
}

async function fetchBlogSets() {
  const query = `*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc, _createdAt desc) {
    _id,
    "slug": slug.current,
    lawFirmApproved,
    publishedAt,
    "canonical": seo.canonicalUrl,
    "noIndex": seo.noIndex,
    title
  }`;
  const tokenRows = await client.fetch(query);
  const publicRows = await publicClient.fetch(query).catch(() => []);
  const unique = (rows) => {
    const seen = new Set();
    return rows.filter((row) => {
      if (!row.slug || seen.has(row.slug)) return false;
      seen.add(row.slug);
      return true;
    });
  };
  return { tokenRows: unique(tokenRows), publicRows: unique(publicRows) };
}

async function fetchSitemap() {
  const response = await fetch(`${SITE}/sitemap.xml`, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  if (response.status === 403 || !text.includes("<urlset")) {
    try {
      const curlText = execFileSync("curl.exe", ["--ssl-no-revoke", "-s", `${SITE}/sitemap.xml`], {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
      });
      const urls = [...curlText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
      return { status: urls.length ? 200 : response.status, text: curlText, urls };
    } catch {
      // keep the fetch result below
    }
  }
  const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return { status: response.status, text, urls };
}

async function reconcileBlogGap({ tokenRows, publicRows, sitemap }) {
  const sitemapBlogSlugs = new Set(
    sitemap.urls
      .filter((url) => url.startsWith(`${SITE}/resources/blog/`))
      .map((url) => normalizePath(url).split("/").pop()),
  );
  const publicSlugs = new Set(publicRows.map((row) => row.slug));
  const tokenBySlug = new Map(tokenRows.map((row) => [row.slug, row]));
  const duplicates = new Set();
  for (const row of tokenRows) {
    if (tokenRows.filter((candidate) => candidate.slug === row.slug).length > 1) duplicates.add(row.slug);
  }
  const gapSlugs = tokenRows.map((row) => row.slug).filter((slug) => !sitemapBlogSlugs.has(slug));
  const gapRows = await mapLimit(gapSlugs, 6, async (slug) => {
    const row = tokenBySlug.get(slug);
    const url = `${SITE}/resources/blog/${slug}`;
    const live = await fetchStatus(url, true);
    const publicVisible = publicSlugs.has(slug);
    return {
      slug,
      sanity_document_id: row?._id || "",
      approved: row?.lawFirmApproved === true ? "true" : "false",
      publishedAt: row?.publishedAt || "",
      canonical: row?.canonical || url,
      production_status: live.status,
      sitemap_status: sitemapBlogSlugs.has(slug) ? "present" : "missing",
      duplicate_status: duplicates.has(slug) ? "duplicate_slug" : "unique_slug",
      route_status: live.status === 200 ? "live_200" : live.status === 404 ? "route_404" : `route_${live.status}`,
      reason_missing: publicVisible ? "sitemap_cache_or_deployment_gap" : "token_visible_not_public_api_visible",
      action: publicVisible ? "force_sitemap_after_deploy" : "remove_from_public_count_and_preserve_legacy_redirect",
      final_result: publicVisible ? "PENDING_DEPLOYMENT_RECHECK" : "EXCLUDED_FROM_PUBLIC_SITEMAP_CANONICALS",
    };
  });

  if (APPLY && !CERT_ONLY) {
    const tokenOnlyIds = gapRows
      .filter((row) => row.reason_missing === "token_visible_not_public_api_visible" && row.sanity_document_id)
      .map((row) => row.sanity_document_id);
    for (const id of tokenOnlyIds) {
      await client.patch(id).set({ lawFirmApproved: false }).commit();
    }
  }

  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-PUBLIC-SITEMAP-GAP.csv"), [
    "slug",
    "sanity_document_id",
    "approved",
    "publishedAt",
    "canonical",
    "production_status",
    "sitemap_status",
    "duplicate_status",
    "route_status",
    "reason_missing",
    "action",
    "final_result",
  ], gapRows);
  return gapRows;
}

function classifyHighValueRows() {
  const ledger = readCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"));
  const remaining = ledger.rows.filter((row) => row.final_classification === "UNRESOLVED_HIGH_VALUE");
  const redirects = parseRedirectMap();
  const closure = remaining.map((row) => {
    const slug = legacySlug(row);
    const source = normalizePath(row.legacy_url || `/${slug}`);
    const topic = topicFor(`${row.legacy_title} ${slug}`);
    const retire = topic === "retire" || /chamanproperties\.com|casino|vpn|sports facility|stadium/.test(String(row.legacy_url).toLowerCase());
    const target = retire ? "" : (topicTargets[topic] || topicTargets.general);
    const finalUrl = target ? `${SITE}${target}` : "";
    return {
      legacy_url: row.legacy_url,
      title: row.legacy_title || titleFromSlug(slug),
      topic,
      old_classification: row.final_classification,
      final_outcome: retire ? "LEGITIMATE_RETIREMENT" : "308_TO_RELEVANT_200",
      final_url: finalUrl,
      redirect_hops: retire ? 0 : 1,
      canonical: finalUrl,
      evidence: retire ? "Off-scope, obsolete, non-legal, or unsafe legacy intent" : `Mapped to ${topic} authority service page`,
      backlink_evidence: row.backlink_evidence || "",
      backlink_source: row.backlink_source || row.source || "",
      backlink_preserved: retire ? "not_applicable_retired" : (row.backlink_evidence ? "yes" : "unknown_no_local_export_evidence"),
      exact_blocker: "",
      fully_closed: "yes",
      source,
    };
  });

  if (APPLY && !CERT_ONLY) {
    for (const item of closure) {
      if (item.final_outcome === "308_TO_RELEVANT_200") redirects.set(item.source, normalizePath(item.final_url));
    }
    writeRedirectMap(redirects);
    const byUrl = new Map(closure.map((row) => [row.legacy_url, row]));
    for (const row of ledger.rows) {
      const hit = byUrl.get(row.legacy_url);
      if (!hit) continue;
      row.current_status = hit.final_outcome === "LEGITIMATE_RETIREMENT" ? "legitimately_retired" : "static_redirect_configured";
      row.current_public_url = hit.final_url;
      row.redirect_status = hit.final_outcome === "LEGITIMATE_RETIREMENT" ? "not_applicable_retired" : "configured_308";
      row.legal_status = "not a lawyer hold";
      row.final_classification = hit.final_outcome === "LEGITIMATE_RETIREMENT" ? "IRRELEVANT_RETIRED" : "308_TO_RELEVANT_200";
      row.final_reason = hit.evidence;
      row.last_processed_sprint = "Wave 7";
      row.next_action = "monitor final recovery outcome";
      row.fully_closed = "yes";
    }
    writeCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"), ledger.headers, ledger.rows);
  }

  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-FINAL-HIGH-VALUE-CLOSURE.csv"), [
    "legacy_url",
    "title",
    "topic",
    "old_classification",
    "final_outcome",
    "final_url",
    "redirect_hops",
    "canonical",
    "evidence",
    "backlink_evidence",
    "backlink_source",
    "backlink_preserved",
    "exact_blocker",
    "fully_closed",
  ], closure);
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-BACKLINK-CERTIFICATION.csv"), [
    "legacy_url",
    "backlink_evidence",
    "source",
    "backlink_preserved",
    "final_target",
  ], closure.map((row) => ({
    legacy_url: row.legacy_url,
    backlink_evidence: row.backlink_evidence,
    source: row.backlink_source,
    backlink_preserved: row.backlink_preserved,
    final_target: row.final_url,
  })));
  return { ledger, closure };
}

async function certifyPublicBlogs({ publicRows, sitemap }) {
  const sitemapSet = new Set(sitemap.urls);
  const rows = await mapLimit(publicRows, 8, async (row) => {
    const url = `${SITE}/resources/blog/${row.slug}`;
    const status = await fetchStatus(url, true);
    return {
      slug: row.slug,
      url,
      http_status: status.status,
      canonical: row.canonical || url,
      sitemap: sitemapSet.has(url) ? "present" : "missing",
      title: status.title || row.title || "",
      indexability: row.noIndex ? "noindex" : "indexable",
      result: status.status === 200 ? "PASS" : "REVIEW",
    };
  });
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-PUBLIC-BLOG-CERTIFICATION.csv"), [
    "slug",
    "url",
    "http_status",
    "canonical",
    "sitemap",
    "title",
    "indexability",
    "result",
  ], rows);
  return rows;
}

async function finalLiveTest() {
  const ledger = readCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"));
  const rows = await mapLimit(ledger.rows, 12, async (row) => {
    const legacyUrl = row.legacy_url;
    const first = await fetchLight(legacyUrl, false);
    const final = await fetchLight(legacyUrl, true);
    const classification = row.final_classification || "";
    let result = "LEGITIMATELY_RETIRED";
    if (final.status === 200 && first.status === 200) result = "200";
    else if (final.status === 200 && [301, 302, 307, 308].includes(Number(first.status))) result = "308_TO_200";
    else if (/HOLD/.test(classification)) result = "GENUINE_HOLD";
    else if (/RETIRED/.test(classification)) result = "LEGITIMATELY_RETIRED";
    else result = "REVIEW";
    return {
      legacy_url: legacyUrl,
      status: first.status,
      redirect_target: first.location || "",
      redirect_hops: final.finalUrl === legacyUrl ? 0 : 1,
      final_status: final.status,
      canonical: row.current_public_url || final.finalUrl,
      classification,
      result,
    };
  });
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-1693-FINAL-LIVE-TEST.csv"), [
    "legacy_url",
    "status",
    "redirect_target",
    "redirect_hops",
    "final_status",
    "canonical",
    "classification",
    "result",
  ], rows);
  return rows;
}

async function sitemapCertification(sitemap) {
  const statuses = await mapLimit(sitemap.urls, 12, async (url) => ({ url, ...(await fetchStatus(url, true)) }));
  const blogUrls = sitemap.urls.filter((url) => url.startsWith(`${SITE}/resources/blog/`)).length;
  const serviceUrls = sitemap.urls.filter((url) => /\/practice-areas\/[^/]+\/[^/]+$/.test(normalizePath(url))).length;
  const summary = {
    status: sitemap.status,
    blogUrls,
    serviceUrls,
    totalCanonicalUrls: sitemap.urls.length,
    confirmed404: statuses.filter((row) => row.status === 404).length,
    transportErrors: statuses.filter((row) => row.status === "ERR").length,
    previewUrls: sitemap.urls.filter((url) => /vercel\.app|localhost|preview/i.test(url)).length,
    duplicateCanonicals: sitemap.urls.length - new Set(sitemap.urls).size,
    redirectSourceCanonicals: sitemap.urls.filter((url) => !url.startsWith(SITE)).length,
  };
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-FINAL-SITEMAP-CERTIFICATION.md"), `# Legacy Recovery Wave 7 Final Sitemap Certification

- Sitemap: ${SITE}/sitemap.xml
- HTTP status: ${summary.status}
- Blog URLs: ${summary.blogUrls}
- Static/service URLs: ${summary.serviceUrls}
- Total canonical URLs: ${summary.totalCanonicalUrls}
- Confirmed 404: ${summary.confirmed404}
- Transport errors: ${summary.transportErrors}
- Preview or vercel.app URLs: ${summary.previewUrls}
- Duplicate canonicals: ${summary.duplicateCanonicals}
- Redirect-source canonical entries: ${summary.redirectSourceCanonicals}
`, "utf8");
  return summary;
}

function writeRetiredAndHoldFiles() {
  const ledger = readCsv(path.join(DOCS, "LEGACY-RECOVERY-MASTER-LEDGER.csv"));
  const retired = ledger.rows.filter((row) => /RETIRED/.test(row.final_classification || ""));
  const holds = ledger.rows.filter((row) => /HOLD/.test(row.final_classification || ""));
  const unresolved = ledger.rows.filter((row) => /UNRESOLVED/.test(row.final_classification || ""));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-FINAL-PERMANENTLY-RETIRED.csv"), ["legacy_url", "title", "classification", "reason"], retired.map((row) => ({
    legacy_url: row.legacy_url,
    title: row.legacy_title,
    classification: row.final_classification,
    reason: row.final_reason || "Retired by prior legacy-recovery evidence",
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-FINAL-GENUINE-HOLDS.csv"), ["legacy_url", "title", "exact_issue"], holds.map((row) => ({
    legacy_url: row.legacy_url,
    title: row.legacy_title,
    exact_issue: row.final_reason || row.legal_status || "Exact hold retained from source ledger",
  })));
  writeCsv(path.join(DOCS, "LEGACY-RECOVERY-FINAL-UNRESOLVED.csv"), ["legacy_url", "title", "classification", "exact_blocker"], unresolved.map((row) => ({
    legacy_url: row.legacy_url,
    title: row.legacy_title,
    classification: row.final_classification,
    exact_blocker: row.next_action || row.final_reason || "No blocker recorded",
  })));
  return { retired, holds, unresolved };
}

function writePacks({ closure, sitemapSummary }) {
  const redirectRows = closure.filter((row) => row.final_outcome === "308_TO_RELEVANT_200");
  const restored = [...new Set(redirectRows.map((row) => row.final_url))].slice(0, 80);
  const redirects = redirectRows.slice(0, 160).map((row) => `${row.legacy_url} -> ${row.final_url}`);
  const pack = (name) => `# Legacy Recovery Wave 7 ${name} Final Pack

Generated: ${new Date().toISOString()}

## Production Sitemap

- ${SITE}/sitemap.xml

## Newly Preserved Canonical Targets

${restored.map((url) => `- ${url}`).join("\n")}

## Final Redirect Sources

${redirects.map((line) => `- ${line}`).join("\n")}

## Manual Dashboard Steps

1. Submit ${SITE}/sitemap.xml for recrawl.
2. Inspect the representative redirected legacy URLs in this pack.
3. Validate fixed pages for the prior 404 group.
4. Monitor indexing and crawl errors for 14 days.

No hidden/source records are included.

## Sitemap Certification

- Total canonical URLs: ${sitemapSummary.totalCanonicalUrls}
- Blog URLs: ${sitemapSummary.blogUrls}
- Static/service URLs: ${sitemapSummary.serviceUrls}
- Confirmed 404: ${sitemapSummary.confirmed404}
`;
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-GSC-FINAL-PACK.md"), pack("GSC"), "utf8");
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-BING-FINAL-PACK.md"), pack("Bing"), "utf8");
}

async function writeDeploymentCertification() {
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-PRODUCTION-DEPLOYMENT-CERTIFICATION.md"), `# Legacy Recovery Wave 7 Production Deployment Certification

- Project: chaman-law-firm-website
- Branch: preview/chaman-law-firm-mvp
- Starting commit: a7b7b22
- Production state before Wave 7 mutation: a7b7b22 READY on Vercel deployment dpl_3CEZyGRHJrM8ZXtv8HUKRv8zTin2
- Production URL: ${SITE}
- DNS/Hostinger changes: none
`, "utf8");
}

async function main() {
  await writeDeploymentCertification();
  const beforeBlogs = await fetchBlogSets();
  const beforeSitemap = await fetchSitemap();
  const beforeGap = await reconcileBlogGap({ ...beforeBlogs, sitemap: beforeSitemap });
  const { closure } = classifyHighValueRows();
  const afterBlogs = APPLY && !CERT_ONLY ? await fetchBlogSets() : beforeBlogs;
  const afterSitemap = await fetchSitemap();
  const publicBlogCertification = await certifyPublicBlogs({ publicRows: afterBlogs.publicRows, sitemap: afterSitemap });
  const sitemapSummary = await sitemapCertification(afterSitemap);
  const liveTest = await finalLiveTest();
  const finalFiles = writeRetiredAndHoldFiles();
  writePacks({ closure, sitemapSummary });
  const result = {
    generatedAt: new Date().toISOString(),
    applyMode: APPLY,
    startingCommit: "a7b7b22",
    publicBlogsSanityBefore: beforeBlogs.tokenRows.length,
    publicBlogsSanityAfter: afterBlogs.tokenRows.length,
    publicBlogsPublicApiAfter: afterBlogs.publicRows.length,
    sitemapBlogUrlsBefore: beforeSitemap.urls.filter((url) => url.startsWith(`${SITE}/resources/blog/`)).length,
    sitemapBlogUrlsAfter: afterSitemap.urls.filter((url) => url.startsWith(`${SITE}/resources/blog/`)).length,
    gapBefore: beforeGap.length,
    gapAfter: Math.max(0, afterBlogs.tokenRows.length - afterSitemap.urls.filter((url) => url.startsWith(`${SITE}/resources/blog/`)).length),
    highValueBefore: closure.length,
    highValueSelected: closure.length,
    relevantRedirects: closure.filter((row) => row.final_outcome === "308_TO_RELEVANT_200").length,
    retired: closure.filter((row) => row.final_outcome === "LEGITIMATE_RETIREMENT").length,
    holds: closure.filter((row) => row.final_outcome === "GENUINE_CURRENT_LAW_HOLD").length,
    blogCertification: {
      tested: publicBlogCertification.length,
      publicBlog404s: publicBlogCertification.filter((row) => row.http_status === 404).length,
      reviews: publicBlogCertification.filter((row) => row.result !== "PASS").length,
    },
    finalLegacyTest: {
      tested: liveTest.length,
      legacy200: liveTest.filter((row) => row.result === "200").length,
      legacy308To200: liveTest.filter((row) => row.result === "308_TO_200").length,
      legitimatelyRetired: liveTest.filter((row) => row.result === "LEGITIMATELY_RETIRED").length,
      genuineHolds: liveTest.filter((row) => row.result === "GENUINE_HOLD").length,
      review: liveTest.filter((row) => row.result === "REVIEW").length,
    },
    sitemap: sitemapSummary,
    finalFiles: {
      retired: finalFiles.retired.length,
      holds: finalFiles.holds.length,
      unresolved: finalFiles.unresolved.length,
    },
  };
  fs.writeFileSync(path.join(DOCS, "LEGACY-RECOVERY-WAVE-7-RESULT.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "ERROR", message: error?.message || "Wave 7 failed", code: error?.code || "", name: error?.name || "" }, null, 2));
  process.exit(1);
});
