import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const SITE_URL = "https://chamanlawfirm.com";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";

const paths = {
  nextConfig: "next.config.mjs",
  gscPages: path.join("docs", "search-console-exports", "Pages.csv"),
  gscQueries: path.join("docs", "search-console-exports", "Queries.csv"),
  sprint11dInventory: path.join("docs", "SPRINT-11D-FULL-LEGACY-URL-RECOVERY-INVENTORY.csv"),
  sprint11gMaster: path.join("docs", "SPRINT-11G-MASTER-LEGACY-MIGRATION-QUEUE.csv"),
  sprint11lApproval: path.join("docs", "SPRINT-11L-BLOG-APPROVAL-BATCH.csv"),
  freshEvidence: path.join("docs", "SPRINT-11M-FRESH-SEARCH-EVIDENCE-STATUS.md"),
  fullBatch: path.join("docs", "SPRINT-11M-FULL-LEGACY-100-URL-RECOVERY-BATCH.csv"),
  blogScale: path.join("docs", "SPRINT-11M-BLOG-RECOVERY-SCALE-UP.csv"),
  staticBatch: path.join("docs", "SPRINT-11M-STATIC-SERVICE-PAGE-RECOVERY-BATCH.csv"),
  redirectBatch: path.join("docs", "SPRINT-11M-EXACT-REDIRECT-RESCUE-BATCH.csv"),
  seoChecklist: path.join("docs", "SPRINT-11M-SEO-AEO-GEO-ENHANCEMENT-CHECKLIST.csv"),
  indexingPack: path.join("docs", "SPRINT-11M-GSC-BING-INDEXING-PACK.md"),
  resultJson: path.join("docs", "SPRINT-11M-RESULT.json")
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    if (process.env[key]) continue;
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

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
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
  }
  const [headers = [], ...bodyRows] = rows;
  return bodyRows.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index] || ""])));
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

function number(value) {
  const parsed = Number(String(value || "").replace(/[%,$]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePath(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  try {
    const parsed = new URL(raw, SITE_URL);
    const cleaned = `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
    return cleaned === "/" ? "/" : cleaned.replace(/\/+$/, "");
  } catch {
    const withoutHost = raw.replace(/^https?:\/\/(?:www\.)?[^/]+/i, "");
    const cleaned = `/${withoutHost.split(/[?#]/)[0].split("/").filter(Boolean).join("/")}`;
    return cleaned === "/" ? "/" : cleaned.replace(/\/+$/, "");
  }
}

function absoluteUrl(value) {
  const route = normalizePath(value);
  return `${SITE_URL}${route === "/" ? "" : route}`;
}

function slugFromPath(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function titleFromSlug(slug) {
  return String(slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bC O\b/g, "C of O")
    .replace(/\bCac\b/g, "CAC")
    .trim();
}

function parseRedirects(configText) {
  const redirects = new Map();
  const pattern = /\{\s*source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g;
  let match;
  while ((match = pattern.exec(configText))) {
    redirects.set(normalizePath(match[1]), normalizePath(match[2]));
  }
  const setPattern = /const\s+(\w+ExactArticleRedirectSources)\s*=\s*new Set\(\[\s*([\s\S]*?)\s*\]\);/g;
  let setMatch;
  while ((setMatch = setPattern.exec(configText))) {
    const body = setMatch[2];
    const sourcePattern = /"([^"]+)"/g;
    let sourceMatch;
    while ((sourceMatch = sourcePattern.exec(body))) {
      const source = normalizePath(sourceMatch[1]);
      redirects.set(source, normalizePath(`/resources/blog${source}`));
      redirects.set(normalizePath(`${source}/`), normalizePath(`/resources/blog${source}`));
    }
  }
  return redirects;
}

function blockText(block) {
  if (!block) return "";
  if (typeof block === "string") return block;
  if (Array.isArray(block.children)) return block.children.map((child) => child.text || "").join("");
  return "";
}

function bodyText(body) {
  return Array.isArray(body) ? body.map(blockText).join("\n").trim() : "";
}

function hasHref(body) {
  return Array.isArray(body) && body.some((block) =>
    Array.isArray(block.markDefs) && block.markDefs.some((mark) => mark._type === "link" && mark.href)
  );
}

function hasConsultationSignal(text) {
  return /consultation|contact chaman law firm|speak with|book.*consultation|lawyer/i.test(text);
}

function pageType(sourcePath, targetPath, title = "") {
  const text = `${sourcePath} ${targetPath} ${title}`.toLowerCase();
  if (targetPath.startsWith("/resources/blog")) return "blog";
  if (targetPath.startsWith("/practice-areas")) return /governor|consent|notary|employment|immigration|corporate|probate|family|adr|litigation|property|debt/.test(text) ? "service" : "practice";
  if (targetPath.startsWith("/lawyers")) return "lawyer profile";
  if (/consultation|contact/.test(targetPath)) return "consultation";
  if (/about|media|privacy|terms|cookie|disclaimer/.test(targetPath)) return "static";
  return "other";
}

function practiceArea(slug, title = "") {
  const text = `${slug} ${title}`.toLowerCase();
  if (/notary|apostille|legalis|attest|document/.test(text)) return "Notary Public";
  if (/company|corporate|business|startup|contract|share|director|cac|bank|finance|tax|sec|securities|mortgage/.test(text)) return "Corporate and Commercial Law";
  if (/visa|immigration|citizenship|passport|residency/.test(text)) return "Immigration";
  if (/employment|labour|employee|trade-union|workplace/.test(text)) return "Employment Law";
  if (/debt|recovery|creditor/.test(text)) return "Debt Recovery";
  if (/probate|will|inheritance|estate|administration/.test(text)) return "Probate and Estate Administration";
  if (/mediator|mediation|arbitr|adr/.test(text)) return "ADR / Mediation";
  if (/court|litigation|dispute|police|bail|injunction|evidence|judiciary/.test(text)) return "Litigation and Dispute Resolution";
  if (/family|marriage|divorce|custody|child|paternity|maternity/.test(text)) return "Family Law";
  if (/land|tenant|property|real-estate|c-of-o|certificate-of-occupancy|deed|survey|title|rent|mortgage/.test(text)) return "Property and Real Estate Law";
  return "General Legal Education";
}

function legalRisk(slug, title = "", text = "") {
  const haystack = `${slug} ${title} ${text}`.toLowerCase();
  if (/chaman properties|luxury|property sales|buy now|mansion|estate developer|casino|bonus|spin|betting/.test(haystack)) {
    return "blocked - off-brand/property-sales or spam signal";
  }
  if (/forcefully evict|self-help|lock.*tenant|throw.*tenant|domestic violence|child custody|police harassment|criminal|bail|restraining order/.test(haystack)) {
    return "high - lawyer review required before publication";
  }
  if (/evict|quit notice|tax|immigration|employment|probate|will|inheritance|land use act|governor|c-of-o|debt|tenant|family land|dispute|litigation|court/.test(haystack)) {
    return "medium - current-law verification required before publication";
  }
  return "low/medium - editorial legal review required";
}

function editorialRisk(slug, title = "", text = "") {
  const haystack = `${slug} ${title} ${text}`.toLowerCase();
  const risks = [];
  if (/free legal|for free|get.*legal advice.*free/.test(haystack)) risks.push("misleading free-service wording");
  if (/powerful|shocking|ultimate|hidden strengths|revolutionizing|cracking the code|unmasking/.test(haystack)) risks.push("editorial hype/overclaim");
  if (/wp-block|elementor|yoast|rankmath|\[\/?[a-z]+/.test(haystack)) risks.push("plugin debris/shortcode risk");
  return risks;
}

async function fetchHead(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: controller.signal });
    return {
      status: response.status,
      location: response.headers.get("location") || "",
      cache: response.headers.get("x-vercel-cache") || ""
    };
  } catch (error) {
    return { status: "error", location: "", cache: "", error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url);
    return { status: response.status, text: await response.text() };
  } catch (error) {
    return { status: "error", text: "", error: error.message };
  }
}

function freshnessCandidates() {
  const matches = [];
  const pattern = /(search.?console|gsc|bing|404|crawl|coverage|index|redirect|backlink|ahrefs|semrush|ubersuggest|moz|serp|featured.?snippet)/i;
  const ignoreSprint11m = /SPRINT-11M/i;
  const stack = ["docs"];
  while (stack.length) {
    const dir = stack.pop();
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (pattern.test(fullPath) && !ignoreSprint11m.test(fullPath)) {
        const stat = fs.statSync(fullPath);
        matches.push({ file: fullPath, modified: stat.mtime.toISOString() });
      }
    }
  }
  return matches.sort((a, b) => a.file.localeCompare(b.file));
}

function addOrMerge(queue, input) {
  const sourcePath = normalizePath(input.oldUrl || input["old URL"]);
  if (!sourcePath || sourcePath === "/resources/blog") return;
  const existing = queue.get(sourcePath) || {
    sourcePath,
    oldUrl: absoluteUrl(sourcePath),
    title: titleFromSlug(slugFromPath(sourcePath)),
    metaTitle: "",
    metaDescription: "",
    oldContentType: "",
    currentStatus: "unknown",
    clicks: 0,
    impressions: 0,
    position: 0,
    recommendedTarget: "",
    notes: ""
  };
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === "") continue;
    if (key === "clicks") existing.clicks = Math.max(existing.clicks, number(value));
    else if (key === "impressions") existing.impressions = Math.max(existing.impressions, number(value));
    else if (key === "position") existing.position = existing.position ? Math.min(existing.position, number(value)) : number(value);
    else if (!existing[key] || existing[key] === "unknown") existing[key] = value;
  }
  queue.set(sourcePath, existing);
}

async function querySanityPosts(client) {
  return client.fetch(`*[_type == "post"]{
    _id,title,slug,lawFirmApproved,publishedAt,author,categories,tags,mainImage,body,seo,
    "bodyText": pt::text(body),
    "authorName": author->name
  }`);
}

function chooseHiddenDoc(docs = []) {
  return docs.find((doc) => doc.lawFirmApproved !== true && !doc._id.startsWith("drafts.")) ||
    docs.find((doc) => doc._id.startsWith("drafts.")) ||
    null;
}

function approvalGate(doc, slug, sourcePath, redirectMap) {
  const text = bodyText(doc?.body) || doc?.bodyText || "";
  const title = doc?.title || titleFromSlug(slug);
  const risk = legalRisk(slug, title, text);
  const editorialRisks = editorialRisk(slug, title, text);
  const canonical = doc?.seo?.canonicalUrl || "";
  const blockers = [];
  if (!doc) blockers.push("hidden/public-safe Sanity document missing");
  if ((text || "").length < 900) blockers.push("body too short or missing");
  if (!doc?.publishedAt || new Date(doc.publishedAt).getTime() > Date.now()) blockers.push("publishedAt missing or future-dated");
  if (!doc?.mainImage?.asset?._ref) blockers.push("featured image missing");
  if (!doc?.mainImage?.alt || doc.mainImage.alt.length < 9) blockers.push("alt text missing or too thin");
  if (!doc?.seo?.metaTitle) blockers.push("SEO title missing");
  if (!doc?.seo?.metaDescription) blockers.push("meta description missing");
  if (canonical && normalizePath(canonical) !== `/resources/blog/${slug}`) blockers.push("canonical does not match target URL");
  if (!doc?.categories?.length) blockers.push("category/practice relationship missing");
  if (!hasConsultationSignal(text)) blockers.push("consultation CTA missing");
  if (!hasHref(doc?.body)) blockers.push("internal link missing");
  if (redirectMap.has(sourcePath)) blockers.push(`old source already redirects to ${redirectMap.get(sourcePath)}`);
  if (/^blocked|^high|^medium/.test(risk)) blockers.push(risk);
  blockers.push(...editorialRisks);
  return { blockers: [...new Set(blockers)], risk, text };
}

function publicDocFromHidden(doc, slug) {
  return {
    ...doc,
    _id: `chamanlawfirm-sprint11m-${slug}`,
    _type: "post",
    slug: { _type: "slug", current: slug },
    author: { _type: "reference", _ref: AUTHOR_ID },
    lawFirmApproved: true,
    seo: {
      ...(doc.seo || {}),
      canonicalUrl: `${SITE_URL}/resources/blog/${slug}`,
      noIndex: false
    }
  };
}

async function main() {
  const shouldApply = process.argv.includes("--apply");
  loadEnvFile(".env.local");
  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "";
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
    token,
    useCdn: false,
    perspective: "raw"
  });
  if (shouldApply && !token) throw new Error("Missing Sanity write token. Set CMS_API_TOKEN or SANITY_AUTH_TOKEN locally.");

  const configText = fs.readFileSync(paths.nextConfig, "utf8");
  const redirectMap = parseRedirects(configText);
  const [posts, sitemap, robots] = await Promise.all([
    querySanityPosts(client),
    fetchText(`${SITE_URL}/sitemap.xml`),
    fetchText(`${SITE_URL}/robots.txt`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const postsBySlug = new Map();
  for (const post of posts) {
    const slug = post.slug?.current;
    if (!slug) continue;
    if (!postsBySlug.has(slug)) postsBySlug.set(slug, []);
    postsBySlug.get(slug).push(post);
  }
  const publicBySlug = new Map(
    posts
      .filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts."))
      .map((post) => [post.slug?.current, post])
  );
  const hiddenBySlug = new Map();
  for (const [slug, docs] of postsBySlug.entries()) {
    const hidden = chooseHiddenDoc(docs);
    if (hidden) hiddenBySlug.set(slug, hidden);
  }

  const queue = new Map();
  for (const row of readCsv(paths.sprint11gMaster)) {
    addOrMerge(queue, {
      oldUrl: row["old URL"],
      title: row["old title"],
      metaTitle: row["old meta title"],
      metaDescription: row["old meta description"],
      oldContentType: row["old content type"],
      currentStatus: row["current status"],
      clicks: row["GSC clicks"],
      impressions: row["GSC impressions"],
      position: row["average position"],
      recommendedTarget: row["recommended final URL"],
      notes: row.notes
    });
  }
  for (const row of readCsv(paths.sprint11dInventory)) {
    addOrMerge(queue, {
      oldUrl: row["old URL"],
      title: row["old title"],
      metaTitle: row["old meta title"],
      metaDescription: row["old meta description"],
      oldContentType: row["old content type"],
      currentStatus: row["current live status"],
      clicks: String(row["Google ranking/impression/click evidence"] || "").match(/(\d+)\s+clicks/)?.[1] || 0,
      impressions: String(row["Google ranking/impression/click evidence"] || "").match(/;\s+(\d+)\s+impressions/)?.[1] || 0,
      recommendedTarget: row["best new route"],
      notes: row.notes
    });
  }
  for (const row of readCsv(paths.gscPages)) {
    addOrMerge(queue, {
      oldUrl: row["Top pages"],
      clicks: row.Clicks,
      impressions: row.Impressions,
      position: row.Position
    });
  }
  for (const row of readCsv(paths.sprint11lApproval)) {
    addOrMerge(queue, {
      oldUrl: row["old URL"],
      title: row.title,
      metaTitle: row["SEO title present"] === "yes" ? `${row.title} | Chaman Law Firm` : "",
      metaDescription: row["meta description present"] === "yes" ? "present in prior migration review" : "",
      oldContentType: practiceArea(row.slug, row.title),
      recommendedTarget: `/resources/blog/${row.slug}`,
      notes: row.notes
    });
  }

  const enriched = [...queue.values()]
    .map((row) => {
      const sourcePath = normalizePath(row.sourcePath);
      const slug = slugFromPath(sourcePath);
      const publicDoc = publicBySlug.get(slug);
      const hiddenDoc = hiddenBySlug.get(slug);
      const approvedTarget = publicDoc ? `/resources/blog/${slug}` : "";
      const recommendedTarget = normalizePath(row.recommendedTarget || approvedTarget || `/resources/blog/${slug}`);
      const targetUrl = absoluteUrl(recommendedTarget);
      const type = pageType(sourcePath, recommendedTarget, row.title);
      const redirectTarget = redirectMap.get(sourcePath) || "";
      const legal = legalRisk(slug, row.title, bodyText(hiddenDoc?.body));
      const targetInSitemap = sitemapUrls.has(targetUrl);
      const sourceConfigured = redirectMap.has(sourcePath);
      const publicStatus = publicDoc ? "approved public" : "not public";
      const hiddenStatus = hiddenDoc && hiddenDoc.lawFirmApproved !== true ? "hidden/unapproved" : "none detected";
      const score =
        row.clicks * 6 +
        row.impressions / 100 +
        (row.position && row.position <= 5 ? 180 : row.position && row.position <= 10 ? 100 : 0) +
        (sourceConfigured ? -30 : 120) +
        (publicDoc && !sourceConfigured ? 200 : 0);
      let action = "defer for lawyer review";
      if (sourceConfigured) action = "already redirected";
      else if (publicDoc && targetInSitemap) action = "exact redirect to live equivalent";
      else if (hiddenDoc) action = type === "blog" ? "restore as blog after review" : "defer for static/service review";
      else if (type !== "blog" && targetInSitemap) action = "exact redirect to existing static/service equivalent";
      else action = "defer for source/image recovery";
      return {
        ...row,
        sourcePath,
        slug,
        publicDoc,
        hiddenDoc,
        pageType: type,
        recommendedTarget,
        targetUrl,
        targetInSitemap,
        redirectTarget,
        sourceConfigured,
        publicStatus,
        hiddenStatus,
        legal,
        score: Math.round(score),
        action
      };
    })
    .filter((row) => row.sourcePath && row.sourcePath !== "/" && !row.sourcePath.startsWith("/resources/blog"))
    .sort((a, b) => b.score - a.score);

  const top100 = enriched.slice(0, 100);
  const blogCandidates = enriched.filter((row) => row.pageType === "blog" && row.publicStatus !== "approved public").slice(0, 100);
  const staticCandidates = enriched
    .filter((row) => ["static", "service", "practice", "lawyer profile", "consultation"].includes(row.pageType))
    .slice(0, 20);
  const redirectCandidates = enriched
    .filter((row) => row.action === "exact redirect to live equivalent")
    .filter((row) => !row.sourceConfigured)
    .filter((row) => row.targetInSitemap)
    .filter((row) => !row.targetUrl.includes("vercel.app"))
    .slice(0, 30);

  const approved = [];
  const hidden = [];
  const blogRows = blogCandidates.map((row, index) => {
    const gate = approvalGate(row.hiddenDoc, row.slug, row.sourcePath, redirectMap);
    const ready = gate.blockers.length === 0;
    if (ready) {
      approved.push(row);
    } else {
      hidden.push({ row, reason: gate.blockers.join("; ") || "manual review required" });
    }
    return {
      "priority rank": index + 1,
      "old URL": absoluteUrl(row.sourcePath),
      slug: row.slug,
      title: row.hiddenDoc?.title || row.title,
      "GSC clicks": row.clicks,
      "GSC impressions": row.impressions,
      "target URL": row.targetUrl,
      "body/source status": row.hiddenDoc ? ((bodyText(row.hiddenDoc.body) || row.hiddenDoc.bodyText || "").length >= 900 ? "source body present" : "source body thin/missing") : "source recovery needed",
      "SEO title": row.hiddenDoc?.seo?.metaTitle ? "present" : "missing/rewrite needed",
      "meta description": row.hiddenDoc?.seo?.metaDescription ? "present" : "missing/rewrite needed",
      canonical: row.hiddenDoc?.seo?.canonicalUrl || row.targetUrl,
      "image status": row.hiddenDoc?.mainImage?.asset?._ref ? "present" : "missing",
      "alt text": row.hiddenDoc?.mainImage?.alt || "",
      author: AUTHOR_NAME,
      "practice/category": practiceArea(row.slug, row.title),
      "CTA": hasConsultationSignal(bodyText(row.hiddenDoc?.body)) ? "present" : "missing",
      "internal links": hasHref(row.hiddenDoc?.body) ? "present" : "missing",
      "legal risk": gate.risk,
      "approval readiness": ready ? (shouldApply ? "approved in Sanity" : "ready if --apply") : "keep hidden",
      notes: gate.blockers.join("; ") || "passes automated Sprint 11M gates; still suitable for final lawyer spot-check"
    };
  });

  if (shouldApply) {
    for (const row of approved.slice(0, 10)) {
      await client
        .patch(row.hiddenDoc._id)
        .set({
          author: { _type: "reference", _ref: AUTHOR_ID },
          lawFirmApproved: false,
          "seo.canonicalUrl": row.targetUrl,
          "seo.noIndex": false
        })
        .commit();
      await client.createOrReplace(publicDocFromHidden(row.hiddenDoc, row.slug));
    }
  }

  const fullRows = top100.map((row, index) => ({
    "priority rank": index + 1,
    "old URL": absoluteUrl(row.sourcePath),
    "old title": row.title,
    "old content type": row.oldContentType || practiceArea(row.slug, row.title),
    "page type": row.pageType,
    "current status": row.sourceConfigured ? `redirect configured to ${row.redirectTarget}` : row.publicDoc ? "approved target exists; old URL not redirected" : row.hiddenDoc ? "hidden Sanity record; old URL unresolved" : "unresolved/source recovery needed",
    "GSC clicks": row.clicks,
    "GSC impressions": row.impressions,
    "average position": row.position,
    "source body available": row.hiddenDoc || row.publicDoc ? "yes" : "not confirmed",
    "image available": row.hiddenDoc?.mainImage?.asset?._ref || row.publicDoc?.mainImage?.asset?._ref ? "yes" : "not confirmed",
    "current redirect status": row.sourceConfigured ? `configured to ${row.redirectTarget}` : "not configured",
    "Sanity public status": row.publicStatus,
    "Sanity hidden/draft status": row.hiddenStatus,
    "duplicate/cannibalization risk": row.publicDoc ? "low - public canonical target exists" : row.hiddenDoc ? "medium - compare against live practice/blog pages" : "unknown",
    "legal/current-law risk": row.legal,
    "recommended action": row.action,
    "recommended final URL": row.targetUrl,
    "canonical URL": row.targetUrl,
    "sitemap status": row.targetInSitemap ? "included" : "not included",
    "SEO/AEO/GEO opportunity": row.pageType === "blog" ? "answer block; FAQs where useful; practice-area links; consultation CTA" : "service answer block; process steps; FAQs; contact CTA",
    "priority score": row.score,
    notes: row.notes || ""
  }));

  const staticRows = staticCandidates.map((row, index) => ({
    priority: index + 1,
    "old URL": absoluteUrl(row.sourcePath),
    "old title": row.title,
    "proposed final route": row.recommendedTarget,
    "page type": row.pageType,
    H1: row.title || titleFromSlug(row.slug),
    "SEO title": `${row.title || titleFromSlug(row.slug)} | Chaman Law Firm`,
    "meta description": `Chaman Law Firm guidance on ${row.title || titleFromSlug(row.slug)}. Contact our legal team for advice tailored to your matter.`,
    canonical: row.targetUrl,
    "required content sections": "answer block; legal context; process/requirements; risks; FAQs; consultation CTA",
    CTA: "Book a consultation",
    "internal links": "practice area; consultation; contact; related resources",
    "image recommendation": "approved legal/service image with accurate alt text",
    "legal review status": row.legal,
    "publish readiness": row.targetInSitemap && row.sourceConfigured ? "existing redirect/page live" : "brief only; do not publish standalone page yet",
    "redirect plan": row.targetInSitemap && !row.sourceConfigured ? "candidate exact redirect after target live QA" : row.sourceConfigured ? "already configured" : "defer"
  }));

  const redirectRows = redirectCandidates.map((row, index) => ({
    priority: index + 1,
    "old URL": absoluteUrl(row.sourcePath),
    "old source path": row.sourcePath,
    "new URL": row.targetUrl,
    "new target path": row.recommendedTarget,
    "redirect type": "one-hop 308",
    "target public status": row.publicStatus,
    "target sitemap status": row.targetInSitemap ? "included" : "not included",
    "activation status": "selected for Sprint 11M next.config.mjs activation",
    "no-homepage-dump check": row.recommendedTarget !== "/" ? "pass" : "fail",
    "hidden-draft target check": row.publicDoc ? "pass" : "fail",
    notes: "Target is already approved public content and appears in sitemap."
  }));

  const seoRows = [...fullRows.slice(0, 100)].map((row) => ({
    "old URL": row["old URL"],
    "target URL": row["recommended final URL"],
    "search intent answered early": "required for restored content",
    H1: "must be clear and specific",
    "SEO title": "preserve or improve legacy intent",
    "meta description": "accurate and non-misleading",
    canonical: row["canonical URL"],
    "internal links": "practice area; consultation; related resources",
    CTA: "consultation/contact CTA required",
    "image and alt text": row["image available"] === "yes" ? "available; verify relevance" : "recover before publication",
    "FAQ/short answer": "use only where genuinely helpful",
    "AEO/GEO entity signals": "Chaman Law Firm; Nigerian legal context; practice-area terms",
    "legal safety": row["legal/current-law risk"],
    "sitemap inclusion": row["sitemap status"],
    "redirect/canonical strategy": row["recommended action"]
  }));

  writeCsv(paths.fullBatch, [
    "priority rank", "old URL", "old title", "old content type", "page type", "current status", "GSC clicks", "GSC impressions",
    "average position", "source body available", "image available", "current redirect status", "Sanity public status",
    "Sanity hidden/draft status", "duplicate/cannibalization risk", "legal/current-law risk", "recommended action",
    "recommended final URL", "canonical URL", "sitemap status", "SEO/AEO/GEO opportunity", "priority score", "notes"
  ], fullRows);
  writeCsv(paths.blogScale, [
    "priority rank", "old URL", "slug", "title", "GSC clicks", "GSC impressions", "target URL", "body/source status",
    "SEO title", "meta description", "canonical", "image status", "alt text", "author", "practice/category", "CTA",
    "internal links", "legal risk", "approval readiness", "notes"
  ], blogRows);
  writeCsv(paths.staticBatch, [
    "priority", "old URL", "old title", "proposed final route", "page type", "H1", "SEO title", "meta description",
    "canonical", "required content sections", "CTA", "internal links", "image recommendation", "legal review status",
    "publish readiness", "redirect plan"
  ], staticRows);
  writeCsv(paths.redirectBatch, [
    "priority", "old URL", "old source path", "new URL", "new target path", "redirect type", "target public status",
    "target sitemap status", "activation status", "no-homepage-dump check", "hidden-draft target check", "notes"
  ], redirectRows);
  writeCsv(paths.seoChecklist, [
    "old URL", "target URL", "search intent answered early", "H1", "SEO title", "meta description", "canonical",
    "internal links", "CTA", "image and alt text", "FAQ/short answer", "AEO/GEO entity signals", "legal safety",
    "sitemap inclusion", "redirect/canonical strategy"
  ], seoRows);

  const fresh = freshnessCandidates();
  const freshManualMissing = !fresh.some((item) => !/SPRINT-|search-console-exports/i.test(item.file));
  fs.writeFileSync(paths.freshEvidence, [
    "# Sprint 11M Fresh Search Evidence Status",
    "",
    `Fresh post-launch GSC/Bing/backlink/SERP export detected locally: ${freshManualMissing ? "no" : "yes"}.`,
    "",
    "## Evidence Used",
    "",
    "- Existing local Google Search Console exports in `docs/search-console-exports/`.",
    "- Sprint 11D-11L recovery inventories and redirect reports.",
    "- Current production sitemap and robots responses.",
    "- Current Sanity production post visibility state.",
    "",
    "## Files Detected",
    "",
    fresh.length ? fresh.slice(0, 80).map((item) => `- \`${item.file}\` (${item.modified})`).join("\n") : "- None.",
    "",
    "## Principal Action Still Needed",
    "",
    "- Export fresh post-launch GSC Pages, Queries, Not Found, Page With Redirect, Redirect Error, and Crawled Currently Not Indexed reports.",
    "- Export Bing crawl/index and sitemap reports.",
    "- Export backlink evidence from Ahrefs, Semrush, Moz, Ubersuggest, Bing Webmaster, or GSC Links.",
    "- Add featured-snippet or SERP screenshots for URLs still ranking.",
    "- Do not submit hidden drafts to search engines."
  ].join("\n"), "utf8");

  fs.writeFileSync(paths.indexingPack, [
    "# Sprint 11M GSC/Bing Indexing Pack",
    "",
    "Use this pack only after the Sprint 11M deployment is live and redirect QA passes.",
    "",
    "## Sitemap",
    "",
    `- ${SITE_URL}/sitemap.xml`,
    "",
    "## Newly Approved Live Article URLs",
    "",
    approved.length
      ? approved.slice(0, 10).map((row) => `- ${row.targetUrl}`).join("\n")
      : "- None approved in Sanity during this Sprint 11M run.",
    "",
    "## Newly Restored Static/Service URLs",
    "",
    "- None published as new standalone static/service pages in this Sprint 11M run.",
    "",
    "## Newly Redirected Old URLs",
    "",
    redirectRows.length ? redirectRows.map((row) => `- ${row["old URL"]} -> ${row["new URL"]}`).join("\n") : "- None selected.",
    "",
    "## Manual GSC/Bing Instructions",
    "",
    "1. Refresh or resubmit the production sitemap.",
    "2. Inspect each final target URL that returns 200.",
    "3. Inspect each old redirected URL after confirming one-hop 308 behaviour.",
    "4. Request indexing only for live canonical targets and valuable redirected old URLs.",
    "5. Do not submit hidden drafts, 404s, preview URLs, or URLs whose canonical/redirect status has not passed QA."
  ].join("\n"), "utf8");

  const coreChecks = await Promise.all([
    fetchHead(`${SITE_URL}/`),
    fetchHead("https://www.chamanlawfirm.com/"),
    fetchHead(`${SITE_URL}/resources/blog`),
    fetchHead(`${SITE_URL}/sitemap.xml`),
    fetchHead(`${SITE_URL}/robots.txt`)
  ]);
  const result = {
    applied: shouldApply,
    tokenDetected: Boolean(token),
    tokenPrinted: false,
    totalSanityPosts: posts.length,
    approvedPublicPosts: publicBySlug.size,
    hiddenOrDraftSlugs: [...hiddenBySlug.keys()].length,
    fullBatchRows: fullRows.length,
    blogRecoveryRows: blogRows.length,
    staticRows: staticRows.length,
    redirectRows: redirectRows.length,
    sanityApprovalsApplied: shouldApply ? approved.slice(0, 10).length : 0,
    keptHiddenCount: hidden.length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    coreChecks
  };
  fs.writeFileSync(paths.resultJson, `${JSON.stringify({ result, approved: approved.map((row) => row.slug), hidden: hidden.map((item) => ({ slug: item.row.slug, reason: item.reason })), redirectRows }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
