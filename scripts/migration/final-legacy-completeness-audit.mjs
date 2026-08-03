import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import { createClient } from "@sanity/client";

const SITE = "https://chamanlawfirm.com";
const DOCS = "docs";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2026-05-17";
const AUTHOR_ID = "author-charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";
const APPLY = process.argv.includes("--apply");
const LIVE_TEST_LIMIT = Number(process.env.FINAL_LEGACY_LIVE_TEST_LIMIT || 140);
const IMPORT_LIMIT = Number(process.env.FINAL_LEGACY_IMPORT_LIMIT || 5000);
const LEGACY_BACKUP_SQL =
  "C:\\Users\\Progressive\\OneDrive - CHAMAN LAW FIRM\\CHAMAN DIGITAL ASSETS\\WEBSITES PROJECTS\\Legacy website (Old Wordpress backup) - June 28, 2026\\u169781131_YXuxS.chamanlawfirm-com.20260626153946.sql.gz";

const outputs = {
  universe: path.join(DOCS, "FINAL-LEGACY-AUTHORITATIVE-URL-UNIVERSE.csv"),
  currentPublic: path.join(DOCS, "FINAL-CURRENT-PUBLIC-URL-INVENTORY.csv"),
  sanityCounts: path.join(DOCS, "FINAL-SANITY-CONTENT-COUNTS.json"),
  redirects: path.join(DOCS, "FINAL-CURRENT-REDIRECT-INVENTORY.csv"),
  matrix: path.join(DOCS, "FINAL-LEGACY-COMPLETENESS-MATRIX.csv"),
  missing: path.join(DOCS, "FINAL-MISSING-LEGACY-URLS.csv"),
  backlinks: path.join(DOCS, "FINAL-LEGACY-BACKLINK-TARGET-RECOVERY.csv"),
  liveStatus: path.join(DOCS, "FINAL-LEGACY-LIVE-STATUS-TEST.csv"),
  pack: path.join(DOCS, "FINAL-LEGACY-RECOVERY-GSC-BING-PACK.md"),
  result: path.join(DOCS, "FINAL-LEGACY-COMPLETENESS-RESULT.json")
};

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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw"
});

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, headers, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const body = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");
  fs.writeFileSync(filePath, `${body}\n`, "utf8");
}

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
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header.trim(), values[index] ?? ""])));
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function normalizePath(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw, SITE);
    const parts = parsed.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part).toLowerCase());
    return parts.length ? `/${parts.join("/")}` : "/";
  } catch {
    const parts = raw.split("?")[0].split("#")[0].split("/").filter(Boolean).map((part) => part.toLowerCase());
    return parts.length ? `/${parts.join("/")}` : "/";
  }
}

function slugFromPath(value) {
  return normalizePath(value).split("/").filter(Boolean).pop() || "";
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function excerptFrom(text, fallback) {
  const clean = stripHtml(text || fallback);
  return clean.length > 210 ? `${clean.slice(0, 207).trim()}...` : clean || fallback;
}

function paragraphBlocks(html) {
  const clean = stripHtml(html);
  const sentences = clean.split(/(?<=[.!?])\s+/).filter((part) => part.length > 35);
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length > 650 && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = `${current} ${sentence}`.trim();
    }
    if (chunks.length >= 36) break;
  }
  if (current && chunks.length < 36) chunks.push(current.trim());
  const selected = chunks.length ? chunks : [clean || "Legacy source content requires editorial review before publication."];
  return selected.map((childText, index) => ({
    _key: `b${index.toString(36)}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `c${index.toString(36)}`, _type: "span", marks: [], text: childText }]
  }));
}

function isExcludedPath(p) {
  if (!p || p === "/") return true;
  const lowered = p.toLowerCase();
  if (/[?&=]/.test(lowered)) return true;
  return [
    "/wp-admin",
    "/wp-login",
    "/wp-json",
    "/xmlrpc",
    "/feed",
    "/comments",
    "/search",
    "/tag/",
    "/tags/",
    "/category/",
    "/author/",
    "/page/",
    "/cdn-cgi/",
    "/wp-content/",
    "/wp-includes/",
    "/wp-admin/"
  ].some((prefix) => lowered === prefix.replace(/\/$/g, "") || lowered.startsWith(prefix));
}

function splitSqlTuples(valuesText) {
  const tuples = [];
  let current = "";
  let inString = false;
  let escape = false;
  let depth = 0;
  for (const char of valuesText) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escape = true;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      current += char;
      continue;
    }
    if (!inString && char === "(") {
      depth += 1;
      if (depth === 1) {
        current = "";
        continue;
      }
    }
    if (!inString && char === ")") {
      depth -= 1;
      if (depth === 0) {
        tuples.push(current);
        current = "";
        continue;
      }
    }
    if (depth > 0) current += char;
  }
  return tuples;
}

function splitSqlFields(tupleText) {
  const fields = [];
  let current = "";
  let inString = false;
  let escape = false;
  for (const char of tupleText) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escape = true;
      continue;
    }
    if (char === "'") {
      inString = !inString;
      current += char;
      continue;
    }
    if (!inString && char === ",") {
      fields.push(sqlValue(current));
      current = "";
      continue;
    }
    current += char;
  }
  fields.push(sqlValue(current));
  return fields;
}

function sqlValue(raw) {
  const trimmed = String(raw || "").trim();
  if (trimmed.toUpperCase() === "NULL") return "";
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r");
  }
  return trimmed;
}

function parseWpPostsFromSql(sqlGzPath) {
  if (!fs.existsSync(sqlGzPath)) return [];
  const sql = zlib.gunzipSync(fs.readFileSync(sqlGzPath)).toString("utf8");
  const posts = [];
  const defaultPostColumns = [
    "ID",
    "post_author",
    "post_date",
    "post_date_gmt",
    "post_content",
    "post_title",
    "post_excerpt",
    "post_status",
    "comment_status",
    "ping_status",
    "post_password",
    "post_name",
    "to_ping",
    "pinged",
    "post_modified",
    "post_modified_gmt",
    "post_content_filtered",
    "post_parent",
    "guid",
    "menu_order",
    "post_type",
    "post_mime_type",
    "comment_count"
  ];
  const insertRegex = /INSERT INTO `([^`]*posts)`(?: \(([^)]+)\))? VALUES\s*([\s\S]*?);/g;
  let match;
  while ((match = insertRegex.exec(sql))) {
    const columns = match[2] ? match[2].split(",").map((col) => col.replace(/[` ]/g, "")) : defaultPostColumns;
    for (const tuple of splitSqlTuples(match[3])) {
      const values = splitSqlFields(tuple);
      const row = Object.fromEntries(columns.map((col, index) => [col, values[index] ?? ""]));
      posts.push(row);
    }
  }
  const byId = new Map(posts.map((post) => [post.ID, post]));
  function pagePath(post) {
    const parts = [post.post_name].filter(Boolean);
    let parent = byId.get(post.post_parent);
    const guard = new Set([post.ID]);
    while (parent && parent.post_name && !guard.has(parent.ID)) {
      guard.add(parent.ID);
      parts.unshift(parent.post_name);
      parent = byId.get(parent.post_parent);
    }
    return `/${parts.join("/")}`;
  }
  return posts
    .filter((post) => post.post_status === "publish")
    .filter((post) => ["post", "page"].includes(post.post_type))
    .filter((post) => post.post_name && !isExcludedPath(`/${post.post_name}`))
    .map((post) => ({
      id: post.ID,
      oldPath: normalizePath(post.post_type === "page" ? pagePath(post) : `/${post.post_name}`),
      slug: post.post_name,
      title: stripHtml(post.post_title) || titleCase(post.post_name),
      type: post.post_type === "post" ? "blog post" : "static/service page",
      postType: post.post_type,
      publishedAt: post.post_date && post.post_date !== "0000-00-00 00:00:00" ? `${post.post_date.replace(" ", "T")}Z` : "",
      bodyHtml: post.post_content || "",
      bodyText: stripHtml(post.post_content || ""),
      excerpt: excerptFrom(post.post_excerpt || post.post_content, stripHtml(post.post_title) || titleCase(post.post_name)),
      source: "wordpress_sql"
    }));
}

async function currentRedirects() {
  const configModule = await import(pathToFileURL(path.resolve("next.config.mjs")).href);
  const config = configModule.default || configModule;
  const redirects = typeof config.redirects === "function" ? await config.redirects() : [];
  const seen = new Set();
  return redirects
    .filter((row) => row.source && row.destination)
    .map((row) => ({
      source: normalizePath(row.source.replace(/:path\*|:slug/g, "")),
      rawSource: row.source,
      destination: normalizePath(row.destination.replace(/:path\*|:slug/g, "")),
      rawDestination: row.destination,
      permanent: row.permanent !== false ? "true" : "false"
    }))
    .filter((row) => {
      if (!row.source || row.source.includes(":")) return false;
      const key = `${row.rawSource}->${row.rawDestination}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function fetchText(url, timeoutMs = 15000) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    return { ok: true, status: response.status, url: response.url, text: await response.text() };
  } catch (error) {
    return { ok: false, status: "ERR", url, text: "", error: error?.name || error?.code || "fetch failed" };
  }
}

async function fetchHead(url, redirect = "manual", timeoutMs = 12000) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect, signal: AbortSignal.timeout(timeoutMs) });
    return { ok: true, status: response.status, location: response.headers.get("location") || "", url: response.url };
  } catch (error) {
    return { ok: false, status: "ERR", location: "", url, error: error?.name || error?.code || "fetch failed" };
  }
}

function gscEvidence() {
  const map = new Map();
  for (const row of readCsv(path.join(DOCS, "search-console-exports", "Pages.csv"))) {
    const url = row["Top pages"] || row.Page || row.URL || "";
    const p = normalizePath(url);
    if (!p || p === "/") continue;
    map.set(p, {
      clicks: Number(String(row.Clicks || "0").replace(/[^\d.-]/g, "")) || 0,
      impressions: Number(String(row.Impressions || "0").replace(/[^\d.-]/g, "")) || 0,
      position: row.Position || ""
    });
  }
  return map;
}

function existingLegacyUniverseRows() {
  const rows = [];
  const files = [
    "FINAL-MASTER-LEGACY-URL-RECONCILIATION.csv",
    "SPRINT-12C-MASTER-LEGACY-URL-INVENTORY.csv",
    "SPRINT-9M-TOP-1000-LEGACY-BLOG-SELECTION.csv"
  ];
  for (const file of files) {
    for (const row of readCsv(path.join(DOCS, file))) {
      const old = row["old URL"] || row.old_url || row.legacy_url || row.url || row.URL || row["legacy URL"] || "";
      const pathOnly = normalizePath(old);
      if (!pathOnly || isExcludedPath(pathOnly)) continue;
      rows.push({
        oldPath: pathOnly,
        title: row.title || row.Title || row["old title"] || titleCase(slugFromPath(pathOnly)),
        type: pathOnly.startsWith("/resources/blog") ? "blog post" : row["content type"] || row.type || "",
        source: file,
        clicks: row.clicks || row.Clicks || "",
        impressions: row.impressions || row.Impressions || ""
      });
    }
  }
  return rows;
}

function classifyPracticeArea(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (/tenant|tenancy|land|property|occupancy|c of o|governor|survey|deed|mortgage|real estate|building|lease/.test(text)) return "Property & Real Estate Law";
  if (/company|corporate|contract|cac|tax|share|business|governance|trade|bank|shipping/.test(text)) return "Corporate & Commercial Law";
  if (/court|litigation|injunction|evidence|police|lawsuit|dispute|judgment|appeal|bail/.test(text)) return "Litigation & Dispute Resolution";
  if (/mediation|arbitration|arbitral|mediator|adr/.test(text)) return "ADR / Mediation";
  if (/debt|recovery|demand letter|creditor/.test(text)) return "Debt Recovery";
  if (/visa|immigration|citizenship|passport|residency/.test(text)) return "Immigration";
  if (/marriage|divorce|custody|child|family|domestic|spouse/.test(text)) return "Family Law";
  if (/employment|labour|worker|employee|trade union/.test(text)) return "Employment Law";
  if (/notary|notarize|apostille|document authentication/.test(text)) return "Notary Public";
  return "General Legal Education";
}

function makeHiddenDoc(post) {
  const slug = post.slug || slugFromPath(post.oldPath);
  const title = post.title || titleCase(slug);
  const canonical = `${SITE}/resources/blog/${slug}`;
  return {
    _id: `chamanlawfirm-final-source-${slug}`.replace(/[^A-Za-z0-9_-]/g, "-"),
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: excerptFrom(post.excerpt || post.bodyText, title),
    author: { _type: "reference", _ref: AUTHOR_ID },
    publishedAt: post.publishedAt || "2026-06-01T00:00:00Z",
    body: paragraphBlocks(post.bodyHtml || post.bodyText),
    tags: [classifyPracticeArea(title, slug), "legacy source recovery"],
    lawFirmApproved: false,
    seo: {
      _type: "seo",
      metaTitle: `${title} | Chaman Law Firm`,
      metaDescription: excerptFrom(post.excerpt || post.bodyText, title),
      canonicalUrl: canonical,
      openGraphTitle: `${title} | Chaman Law Firm`,
      openGraphDescription: excerptFrom(post.excerpt || post.bodyText, title)
    }
  };
}

async function sanityState() {
  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{
    _id,title,"slug":slug.current,lawFirmApproved,publishedAt,author->{_id,name},
    "hasImage": defined(mainImage.asset._ref) || defined(mainImage.asset._id),
    "hasAlt": defined(mainImage.alt) && length(mainImage.alt) > 8,
    "canonical": seo.canonicalUrl
  }`);
  const publicPosts = posts.filter((post) => post.lawFirmApproved === true && !post._id.startsWith("drafts.") && !post._id.includes("."));
  const hiddenPosts = posts.filter((post) => post.lawFirmApproved !== true || post._id.startsWith("drafts.") || post._id.includes("."));
  return {
    posts,
    publicPosts,
    hiddenPosts,
    publicSlugs: new Set(publicPosts.map((post) => post.slug).filter(Boolean)),
    hiddenSlugs: new Set(hiddenPosts.map((post) => post.slug).filter(Boolean)),
    counts: {
      totalPostRecords: posts.length,
      approvedPublicPosts: publicPosts.length,
      hiddenOrSourcePosts: hiddenPosts.length,
      dottedOrSourceRecords: posts.filter((post) => post._id.includes(".")).length,
      draftRecords: posts.filter((post) => post._id.startsWith("drafts.")).length,
      publicAuthorSafe: publicPosts.filter((post) => post.author?.name === AUTHOR_NAME || post.author?._id === AUTHOR_ID).length,
      publicWithImage: publicPosts.filter((post) => post.hasImage).length,
      publicWithAlt: publicPosts.filter((post) => post.hasAlt).length
    }
  };
}

function mergeUniverse(sqlPosts, docRows, gscMap, redirects) {
  const byPath = new Map();
  function upsert(row) {
    const p = normalizePath(row.oldPath || row.url || row.legacy_url || row["old URL"]);
    if (!p || isExcludedPath(p)) return;
    const previous = byPath.get(p) || {};
    const gsc = gscMap.get(p) || gscMap.get(`${p}/`) || {};
    byPath.set(p, {
      oldPath: p,
      oldUrl: `${SITE}${p}`,
      slug: row.slug || previous.slug || slugFromPath(p),
      title: row.title || previous.title || titleCase(slugFromPath(p)),
      contentType: normalizeContentType(row.type || previous.contentType || (sqlPosts.find((post) => post.oldPath === p)?.type ?? "legacy URL")),
      sourceEvidence: Array.from(new Set([previous.sourceEvidence, row.source].filter(Boolean).join("; ").split("; ").filter(Boolean))).join("; "),
      clicks: Number(row.clicks || gsc.clicks || previous.clicks || 0),
      impressions: Number(row.impressions || gsc.impressions || previous.impressions || 0),
      position: gsc.position || previous.position || "",
      sqlRecord: row.bodyHtml ? "yes" : previous.sqlRecord || "no",
      publishedAt: row.publishedAt || previous.publishedAt || "",
      bodyText: row.bodyText || previous.bodyText || "",
      bodyHtml: row.bodyHtml || previous.bodyHtml || ""
    });
  }
  sqlPosts.forEach(upsert);
  docRows.forEach(upsert);
  for (const [p, gsc] of gscMap) upsert({ oldPath: p, source: "gsc_pages_export", clicks: gsc.clicks, impressions: gsc.impressions });
  for (const redirect of redirects) upsert({ oldPath: redirect.source, source: "next_config_redirects" });
  return [...byPath.values()].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions || a.oldPath.localeCompare(b.oldPath));
}

function normalizeContentType(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("blog") || text === "post") return "blog post";
  if (text.includes("page") || text.includes("service") || text.includes("practice") || text.includes("static")) return "static/service page";
  return "legacy URL";
}

function classifyMatrix(row, sitemapSet, redirectsBySource, sanity, liveStatusByPath) {
  const slug = row.slug || slugFromPath(row.oldPath);
  const blogTarget = `/resources/blog/${slug}`;
  const redirect = redirectsBySource.get(row.oldPath);
  const target = redirect?.destination || (sanity.publicSlugs.has(slug) ? blogTarget : "");
  const liveSame = sitemapSet.has(row.oldPath) || liveStatusByPath.get(row.oldPath)?.status === 200;
  const targetInSitemap = target ? sitemapSet.has(target) : false;
  const publicBlog = sanity.publicSlugs.has(slug);
  const hidden = sanity.hiddenSlugs.has(slug);
  const highValue = Number(row.clicks) > 0 || Number(row.impressions) >= 100;
  let status = "missing_not_imported";
  let action = "recover source content into hidden Sanity record, then review";
  if (liveSame) {
    status = "live_same_url";
    action = "monitor";
  } else if (redirect && targetInSitemap) {
    status = redirect.destination.startsWith("/resources/blog/") ? "redirected_to_live_blog" : "merged_redirected_to_live_page";
    action = "monitor redirect and target indexing";
  } else if (publicBlog) {
    status = "public_blog_needs_or_has_redirect";
    action = redirect ? "monitor" : "add exact redirect after verification";
  } else if (hidden) {
    status = "hidden_source_imported";
    action = "lawyer/image review before publication";
  } else if (!highValue && !row.bodyText && !redirect) {
    status = "low_value_retired_or_unknown";
    action = "leave as 404 unless new GSC/backlink evidence appears";
  }
  return {
    ...row,
    old_title: row.title,
    old_meta_title: row.title ? `${row.title} | Chaman Law Firm` : "",
    old_meta_description: row.bodyText ? excerptFrom(row.bodyText, row.title) : "",
    current_live_status: status,
    best_new_route: target || blogTarget,
    preserve_same_url_or_redirect: liveSame ? "preserve same URL" : "redirect after target live",
    redirect_target: redirect?.destination || "",
    canonical_url: target ? `${SITE}${target}` : `${SITE}${blogTarget}`,
    sitemap_inclusion: targetInSitemap || liveSame ? "included" : "not included",
    legal_safety_status: "requires lawyer review before publication",
    image_status: "not audited at completeness level",
    approval_status: publicBlog ? "approved public" : hidden ? "hidden/source" : "not imported",
    high_value: highValue ? "yes" : "no",
    recommended_action: action
  };
}

async function importMissingSources(missingRows, sqlByPath) {
  if (!APPLY) return { attempted: 0, imported: 0, skipped: missingRows.length, mode: "dry-run" };
  const candidates = missingRows
    .map((row) => sqlByPath.get(row.oldPath))
    .filter(Boolean)
    .filter((post) => post.postType === "post" && post.bodyText.length >= 350)
    .slice(0, IMPORT_LIMIT);
  let imported = 0;
  for (const post of candidates) {
    const doc = makeHiddenDoc(post);
    await client.createIfNotExists(doc);
    imported += 1;
  }
  return { attempted: candidates.length, imported, skipped: Math.max(0, missingRows.length - candidates.length), mode: "apply" };
}

async function liveStatusRows(rows) {
  const selected = rows
    .filter((row) => row.high_value === "yes" || row.current_live_status.includes("missing") || row.current_live_status.includes("redirect"))
    .slice(0, LIVE_TEST_LIMIT);
  const out = [];
  for (const row of selected) {
    const head = await fetchHead(row.oldUrl, "manual");
    const locationPath = normalizePath(head.location || "");
    const targetHead = row.redirect_target ? await fetchHead(`${SITE}${row.redirect_target}`, "manual") : { status: "" };
    out.push({
      old_url: row.oldUrl,
      expected_status: row.current_live_status,
      http_status: head.status,
      location: head.location,
      location_path: locationPath,
      target_url: row.redirect_target ? `${SITE}${row.redirect_target}` : "",
      target_status: targetHead.status,
      result:
        head.status === 200 ||
        (String(head.status).startsWith("30") && row.redirect_target && locationPath === row.redirect_target && targetHead.status === 200)
          ? "PASS"
          : "REVIEW"
    });
  }
  return out;
}

async function main() {
  const [sitemap, robots, redirects, sanity] = await Promise.all([
    fetchText(`${SITE}/sitemap.xml`),
    fetchText(`${SITE}/robots.txt`),
    currentRedirects(),
    sanityState()
  ]);
  const sitemapUrls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => normalizePath(match[1]));
  const sitemapSet = new Set(sitemapUrls);
  const gscMap = gscEvidence();
  const sqlPosts = parseWpPostsFromSql(LEGACY_BACKUP_SQL);
  const sqlByPath = new Map(sqlPosts.map((post) => [post.oldPath, post]));
  const docRows = existingLegacyUniverseRows();
  const universe = mergeUniverse(sqlPosts, docRows, gscMap, redirects);
  const redirectsBySource = new Map(redirects.map((row) => [row.source, row]));
  const liveStatusByPath = new Map();
  const matrix = universe.map((row) => classifyMatrix(row, sitemapSet, redirectsBySource, sanity, liveStatusByPath));
  const missing = matrix.filter((row) => row.current_live_status === "missing_not_imported");
  const importResult = await importMissingSources(missing, sqlByPath);
  const refreshedSanity = importResult.imported ? await sanityState() : sanity;
  const refreshedMatrix = importResult.imported
    ? universe.map((row) => classifyMatrix(row, sitemapSet, redirectsBySource, refreshedSanity, liveStatusByPath))
    : matrix;
  const refreshedMissing = refreshedMatrix.filter((row) => row.current_live_status === "missing_not_imported");
  const liveRows = await liveStatusRows(refreshedMatrix);

  const currentPublicRows = [
    ...sitemapUrls.map((p) => ({
      public_url: `${SITE}${p === "/" ? "" : p}`,
      path: p,
      type: p.startsWith("/resources/blog/") ? "blog" : p.startsWith("/practice-areas/") ? "practice/static service" : "static/system",
      sitemap_status: "included"
    })),
    ...sanity.publicPosts
      .filter((post) => !sitemapSet.has(`/resources/blog/${post.slug}`))
      .map((post) => ({
        public_url: `${SITE}/resources/blog/${post.slug}`,
        path: `/resources/blog/${post.slug}`,
        type: "blog",
        sitemap_status: "missing from sitemap review"
      }))
  ];

  const backlinkRows = refreshedMatrix
    .filter((row) => row.high_value === "yes" || row.redirect_target || row.current_live_status.includes("missing"))
    .map((row) => ({
      old_url: row.oldUrl,
      evidence: Number(row.clicks) || Number(row.impressions) ? "GSC clicks/impressions available" : "legacy inventory/redirect evidence",
      clicks: row.clicks,
      impressions: row.impressions,
      recovery_status: row.current_live_status,
      target: row.redirect_target || row.best_new_route,
      next_action: row.recommended_action
    }));

  writeCsv(outputs.universe, [
    "old_url",
    "old_path",
    "old_slug",
    "old_title",
    "old_meta_title",
    "old_meta_description",
    "old_content_type",
    "source_evidence",
    "google_clicks",
    "google_impressions",
    "featured_snippet_evidence",
    "old_image_availability"
  ], universe.map((row) => ({
    old_url: row.oldUrl,
    old_path: row.oldPath,
    old_slug: row.slug,
    old_title: row.title,
    old_meta_title: row.title ? `${row.title} | Chaman Law Firm` : "",
    old_meta_description: row.bodyText ? excerptFrom(row.bodyText, row.title) : "",
    old_content_type: row.contentType,
    source_evidence: row.sourceEvidence,
    google_clicks: row.clicks,
    google_impressions: row.impressions,
    featured_snippet_evidence: "",
    old_image_availability: /<img\b/i.test(row.bodyHtml || "") ? "inline/source image evidence" : "not confirmed"
  })));

  writeCsv(outputs.currentPublic, ["public_url", "path", "type", "sitemap_status"], currentPublicRows);
  writeCsv(outputs.redirects, ["source", "destination", "permanent"], redirects.map((row) => ({
    source: row.rawSource,
    destination: row.rawDestination,
    permanent: row.permanent
  })));
  writeCsv(outputs.matrix, [
    "old URL",
    "old title",
    "old meta title",
    "old meta description",
    "old content type",
    "current live status",
    "Google clicks",
    "Google impressions",
    "featured snippet evidence",
    "old image availability",
    "best new route",
    "preserve same URL or redirect",
    "redirect target",
    "canonical URL",
    "sitemap inclusion",
    "legal safety status",
    "image status",
    "approval status",
    "recommended action"
  ], refreshedMatrix.map((row) => ({
    "old URL": row.oldUrl,
    "old title": row.old_title,
    "old meta title": row.old_meta_title,
    "old meta description": row.old_meta_description,
    "old content type": row.contentType,
    "current live status": row.current_live_status,
    "Google clicks": row.clicks,
    "Google impressions": row.impressions,
    "featured snippet evidence": "",
    "old image availability": /<img\b/i.test(row.bodyHtml || "") ? "inline/source image evidence" : "not confirmed",
    "best new route": row.best_new_route,
    "preserve same URL or redirect": row.preserve_same_url_or_redirect,
    "redirect target": row.redirect_target,
    "canonical URL": row.canonical_url,
    "sitemap inclusion": row.sitemap_inclusion,
    "legal safety status": row.legal_safety_status,
    "image status": row.image_status,
    "approval status": row.approval_status,
    "recommended action": row.recommended_action
  })));
  writeCsv(outputs.missing, [
    "old URL",
    "old title",
    "old content type",
    "Google clicks",
    "Google impressions",
    "source content available",
    "recommended recovery action",
    "priority"
  ], refreshedMissing.map((row) => ({
    "old URL": row.oldUrl,
    "old title": row.old_title,
    "old content type": row.contentType,
    "Google clicks": row.clicks,
    "Google impressions": row.impressions,
    "source content available": sqlByPath.has(row.oldPath) ? "yes" : "not in parsed SQL",
    "recommended recovery action": row.recommended_action,
    priority: row.high_value === "yes" ? "high" : "low"
  })));
  writeCsv(outputs.backlinks, ["old_url", "evidence", "clicks", "impressions", "recovery_status", "target", "next_action"], backlinkRows);
  writeCsv(outputs.liveStatus, ["old_url", "expected_status", "http_status", "location", "location_path", "target_url", "target_status", "result"], liveRows);

  const counts = {
    generatedAt: new Date().toISOString(),
    applyMode: APPLY,
    totalMeaningfulLegacyUrls: refreshedMatrix.length,
    totalLegacyBlogPosts: refreshedMatrix.filter((row) => row.contentType === "blog post").length,
    totalLegacyStaticServicePages: refreshedMatrix.filter((row) => row.contentType !== "blog post").length,
    currentPublicBlogCount: currentPublicRows.filter((row) => row.type === "blog").length,
    currentPublicStaticServiceCount: currentPublicRows.filter((row) => row.type !== "blog").length,
    totalRedirects: redirects.length,
    totalHiddenSourceImports: refreshedSanity.counts.hiddenOrSourcePosts,
    totalDuplicatesMerged: refreshedMatrix.filter((row) => row.current_live_status === "merged_redirected_to_live_page").length,
    totalIntentionallyRetired: refreshedMatrix.filter((row) => row.current_live_status === "low_value_retired_or_unknown").length,
    genuinelyMissingBeforeSprint: missing.length,
    missingUrlsImportedThisSprint: importResult.imported,
    missingStaticPagesRestoredThisSprint: 0,
    newPublicArticlesPublished: 0,
    newPublicStaticPagesPublished: 0,
    newRedirectsActivated: 0,
    remainingHiddenSourceRecords: refreshedSanity.counts.hiddenOrSourcePosts,
    remainingHighValue404s: refreshedMissing.filter((row) => row.high_value === "yes").length,
    remainingLowValue404s: refreshedMissing.filter((row) => row.high_value !== "yes").length,
    sitemapStatus: sitemap.status,
    robotsStatus: robots.status,
    sitemapUrlCount: sitemapUrls.length,
    sitemapHasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
    robotsPointsToProductionSitemap: robots.text.includes(`${SITE}/sitemap.xml`),
    robotsBlocksStudioApi: /Disallow:\s*\/studio/i.test(robots.text) && /Disallow:\s*\/api/i.test(robots.text),
    sanity: refreshedSanity.counts,
    importResult,
    outputFiles: outputs
  };
  fs.writeFileSync(outputs.sanityCounts, `${JSON.stringify(refreshedSanity.counts, null, 2)}\n`, "utf8");
  fs.writeFileSync(outputs.result, `${JSON.stringify(counts, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    outputs.pack,
    `# Final Legacy Recovery GSC/Bing Pack

Generated: ${counts.generatedAt}

## Submit / Inspect Now

- Production sitemap: ${SITE}/sitemap.xml
- Homepage: ${SITE}/
- Blog index: ${SITE}/resources/blog
- Live redirected legacy targets: inspect rows marked \`redirected_to_live_blog\` or \`merged_redirected_to_live_page\` in \`FINAL-LEGACY-COMPLETENESS-MATRIX.csv\`.

## Do Not Submit

- Hidden/source-only Sanity records.
- URLs listed as \`missing_not_imported\`.
- URLs listed as \`low_value_retired_or_unknown\` unless new GSC/Bing/backlink evidence appears.

## Manual Evidence Still Needed

- Fresh post-launch GSC 404 export.
- Fresh Bing crawl/indexing export.
- Backlink export from a backlink tool if available.
- Featured-snippet evidence screenshots or query export when available.
`
  );

  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        status: "ERROR",
        message: error?.message || "final legacy completeness audit failed",
        name: error?.name || "",
        code: error?.code || ""
      },
      null,
      2
    )
  );
  process.exit(1);
});
