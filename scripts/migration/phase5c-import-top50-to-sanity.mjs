import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import zlib from "node:zlib";

const API_VERSION = "2026-05-17";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const SOURCE_NAME = "phase5c-wp-top50-migration";
const SOURCE_SLUG_OVERRIDES = new Map([
  ["obtaining-a-certificate-of-occupancy-c-of-o", "obtaining-a-certificate-of-occupancy"],
  ["cac-public-search-guide-nigeria", "how-to-use-cac-public-search-for-your-business"]
]);

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const dryRun = process.argv.includes("--dry-run");
const skipImages = process.argv.includes("--skip-images");
const dumpPath = argValue("--dump");
const rankMathPath = argValue("--rankmath");
const registerPath = argValue("--register", "docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-MIGRATION-REGISTER.csv");
const redirectPath = argValue("--redirect", "docs/PHASE-5B-TOP-50-LEGAL-ARTICLE-REDIRECT-MAP.csv");
const outDir = argValue("--out", "docs/phase5c");

if (!dumpPath || !rankMathPath) {
  console.error("Usage: npx sanity exec scripts/migration/phase5c-import-top50-to-sanity.mjs --with-user-token -- --dump <wp.sql.gz> --rankmath <rankmath.csv> [--dry-run]");
  process.exit(1);
}

function hashKey(...parts) {
  return crypto.createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 12);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePathSlug(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\/(?:www\.)?chamanlawfirm\.com/i, "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

function normalizeWpDate(date, gmtDate) {
  const source = gmtDate && gmtDate !== "0000-00-00 00:00:00" ? gmtDate : date;
  if (!source || source === "0000-00-00 00:00:00") return new Date().toISOString();
  return `${source.replace(" ", "T")}Z`;
}

function decodeEntities(input = "") {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " ",
    rsquo: "'",
    lsquo: "'",
    rdquo: "\"",
    ldquo: "\"",
    ndash: "-",
    mdash: "-",
    hellip: "...",
    copy: "(c)"
  };

  return String(input)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function stripTags(input = "") {
  return decodeEntities(
    String(input)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function cleanText(input = "") {
  return decodeEntities(String(input).replace(/\s+/g, " ").trim());
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...body] = rows.filter((item) => item.some((cellValue) => cellValue !== ""));
  return body.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""])));
}

async function readCsv(filePath) {
  return parseCsv(await fsp.readFile(filePath, "utf8"));
}

function mysqlUnescape(value) {
  return value.replace(/\\([0btnrZ"'\\%_])/g, (_, code) => {
    switch (code) {
      case "0":
        return "\0";
      case "b":
        return "\b";
      case "t":
        return "\t";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "Z":
        return "\x1a";
      default:
        return code;
    }
  });
}

function parseMysqlTuple(line) {
  let value = line.trim();
  value = value.replace(/[;,]\s*$/, "");
  if (value.startsWith("(") && value.endsWith(")")) {
    value = value.slice(1, -1);
  }

  const fields = [];
  let cell = "";
  let inString = false;

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    if (inString) {
      if (char === "\\") {
        cell += char + (value[i + 1] ?? "");
        i += 1;
      } else if (char === "'") {
        inString = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === "'") {
      inString = true;
    } else if (char === ",") {
      fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
      cell = "";
    } else {
      cell += char;
    }
  }

  fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
  return fields;
}

function tableSuffix(tableName) {
  return tableName.replace(/^.*?_/, "");
}

function splitKeywords(value) {
  return String(value || "")
    .split(/[,|;]/)
    .map((item) => cleanText(item))
    .filter(Boolean)
    .filter((item, index, arr) => arr.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index);
}

function rewriteSeoTemplate(value, title) {
  return cleanText(value)
    .replace(/%title%/gi, title)
    .replace(/%sep%/gi, "-")
    .replace(/%sitename%/gi, "Chaman Law Firm")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFrom(...values) {
  const text = values.map(stripTags).find(Boolean) || "Legal guidance from Chaman Law Firm.";
  return text.length > 220 ? `${text.slice(0, 217).trim()}...` : text;
}

function normalizeImageUrl(raw) {
  const value = decodeEntities(String(raw || "").trim());
  if (!value) return "";
  try {
    return value.startsWith("/") ? new URL(value, "https://chamanlawfirm.com").toString() : new URL(value).toString();
  } catch {
    return "";
  }
}

function firstBodyImageUrl(html) {
  const match = String(html || "").match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i);
  return normalizeImageUrl(match?.[1]);
}

function titleFromPost(post, rank) {
  const raw = cleanText(post?.post_title || "") || rewriteSeoTemplate(rank?.seo_title || "", "Chaman Law Firm Legal Article");
  return raw || "Chaman Law Firm Legal Article";
}

function buildRankMathMap(rows) {
  const map = new Map();
  for (const row of rows) {
    const slug = normalizePathSlug(row.slug || row.permalink || row.url || "");
    if (slug) map.set(slug, row);
  }
  return map;
}

function safeDraftId(slug) {
  return `drafts.chamanlawfirm.phase5c.${slug}`.slice(0, 127);
}

function block(style, text, index, children = null, markDefs = []) {
  const safeText = cleanText(text);
  if (!safeText) return null;
  return {
    _key: hashKey("block", style, index, safeText),
    _type: "block",
    style,
    markDefs,
    children:
      children && children.length
        ? children
        : [
            {
              _key: hashKey("span", style, index, safeText),
              _type: "span",
              text: safeText,
              marks: []
            }
          ]
  };
}

function rewriteHref(href, top50RouteBySlug, linkStats) {
  const raw = decodeEntities(String(href || "").trim());
  if (!raw) return null;

  if (/chamanproperties\.com/i.test(raw)) {
    linkStats.propertyLinksRemoved += 1;
    return null;
  }

  let url;
  try {
    url = raw.startsWith("/") ? new URL(raw, "https://chamanlawfirm.com") : new URL(raw);
  } catch {
    return raw;
  }

  if (/^(www\.)?chamanlawfirm\.com$/i.test(url.hostname)) {
    const slug = normalizePathSlug(url.pathname);
    if (top50RouteBySlug.has(slug)) {
      linkStats.linksRewritten += 1;
      return top50RouteBySlug.get(slug);
    }

    if (/(luxury|real-estate-investment|property-investment|investment-returns|investment-financing|gated-communities|hospitality-real-estate)/i.test(slug)) {
      linkStats.propertyLinksRemoved += 1;
      return null;
    }

    linkStats.internalLinksPreserved += 1;
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return raw;
}

function inlineChildren(html, index, top50RouteBySlug, linkStats) {
  const markDefs = [];
  const children = [];
  const linkRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let cursor = 0;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const before = stripTags(html.slice(cursor, match.index));
    if (before) {
      children.push({
        _key: hashKey("span", index, children.length, before),
        _type: "span",
        text: before,
        marks: []
      });
    }

    const linkText = stripTags(match[2]);
    const href = rewriteHref(match[1], top50RouteBySlug, linkStats);
    linkStats.linksFound += 1;

    if (linkText) {
      if (href) {
        const markKey = `link${markDefs.length + 1}`;
        markDefs.push({ _key: markKey, _type: "link", href });
        children.push({
          _key: hashKey("span", index, children.length, linkText, href),
          _type: "span",
          text: linkText,
          marks: [markKey]
        });
      } else {
        children.push({
          _key: hashKey("span", index, children.length, linkText),
          _type: "span",
          text: linkText,
          marks: []
        });
      }
    }

    cursor = match.index + match[0].length;
  }

  const after = stripTags(html.slice(cursor));
  if (after) {
    children.push({
      _key: hashKey("span", index, children.length, after),
      _type: "span",
      text: after,
      marks: []
    });
  }

  return { children, markDefs };
}

function portableTextFromWordPress(html, fallback, top50RouteBySlug, linkStats) {
  const cleaned = String(html || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\[caption[^\]]*\]/gi, " ")
    .replace(/\[\/caption\]/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  const blocks = [];
  const tagRegex = /<(h[1-4]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  let index = 0;

  while ((match = tagRegex.exec(cleaned)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];
    const text = stripTags(inner);
    if (!text || /^&nbsp;$/i.test(text)) continue;

    const style = tag === "h1" ? "h2" : tag === "h2" || tag === "h3" || tag === "h4" ? tag : tag === "blockquote" ? "blockquote" : "normal";
    const { children, markDefs } = inlineChildren(inner, index, top50RouteBySlug, linkStats);
    const nextBlock = block(style, text, index, children, markDefs);
    if (nextBlock) {
      if (tag === "li") nextBlock.listItem = "bullet";
      blocks.push(nextBlock);
      index += 1;
    }
  }

  if (blocks.length) return blocks;

  const fallbackText = stripTags(cleaned) || fallback || "This legacy article has been migrated as a draft for lawyer review.";
  return fallbackText
    .split(/\n{2,}/)
    .map((paragraph, paragraphIndex) => block("normal", paragraph, paragraphIndex))
    .filter(Boolean);
}

async function extractWordPress({ registerRows, rankMathMap }) {
  const targetSlugs = new Set(
    registerRows.flatMap((row) => {
      const destinationSlug = normalizePathSlug(row.legacy_path);
      return [destinationSlug, SOURCE_SLUG_OVERRIDES.get(destinationSlug)].filter(Boolean);
    })
  );
  const targetIds = new Set();
  const postsBySlug = new Map();
  const attachmentsById = new Map();
  const usersById = new Map();
  const metaByPostId = new Map();
  const termRelByPostId = new Map();
  const termsById = new Map();
  const taxById = new Map();

  let activeTable = null;
  const rl = readline.createInterface({
    input: fs.createReadStream(dumpPath).pipe(zlib.createGunzip({ finishFlush: zlib.constants.Z_SYNC_FLUSH })),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const insert = line.match(/^INSERT INTO `([^`]+)` VALUES/);
    if (insert) {
      activeTable = tableSuffix(insert[1]);
      continue;
    }

    if (!activeTable || !line.startsWith("(")) {
      continue;
    }

    const values = parseMysqlTuple(line);

    if (activeTable === "posts") {
      const post = {
        ID: Number(values[0]),
        post_author: Number(values[1]),
        post_date: values[2],
        post_date_gmt: values[3],
        post_content: values[4] || "",
        post_title: values[5] || "",
        post_excerpt: values[6] || "",
        post_status: values[7] || "",
        post_name: values[11] || "",
        post_modified: values[14],
        post_modified_gmt: values[15],
        guid: values[18] || "",
        post_type: values[20] || "",
        post_mime_type: values[21] || ""
      };

      if (post.post_type === "post" && targetSlugs.has(post.post_name)) {
        postsBySlug.set(post.post_name, post);
        targetIds.add(post.ID);
      }

      if (post.post_type === "attachment") {
        attachmentsById.set(post.ID, post);
      }
    } else if (activeTable === "postmeta") {
      const postId = Number(values[1]);
      const key = values[2] || "";
      if (
        key === "_thumbnail_id" ||
        key === "_wp_attachment_image_alt" ||
        key.startsWith("rank_math_") ||
        key.startsWith("_yoast_wpseo_")
      ) {
        const entry = metaByPostId.get(postId) || {};
        entry[key] = values[3] || "";
        metaByPostId.set(postId, entry);
      }
    } else if (activeTable === "term_relationships") {
      const postId = Number(values[0]);
      if (targetIds.has(postId)) {
        const current = termRelByPostId.get(postId) || [];
        current.push(Number(values[1]));
        termRelByPostId.set(postId, current);
      }
    } else if (activeTable === "term_taxonomy") {
      taxById.set(Number(values[0]), {
        term_taxonomy_id: Number(values[0]),
        term_id: Number(values[1]),
        taxonomy: values[2],
        description: values[3]
      });
    } else if (activeTable === "terms") {
      termsById.set(Number(values[0]), {
        term_id: Number(values[0]),
        name: values[1],
        slug: values[2]
      });
    } else if (activeTable === "users") {
      usersById.set(Number(values[0]), {
        ID: Number(values[0]),
        user_login: values[1],
        user_nicename: values[3],
        display_name: values[9] || values[3] || values[1]
      });
    }

    if (line.trim().endsWith(";")) {
      activeTable = null;
    }
  }

  return {
    postsBySlug,
    attachmentsById,
    usersById,
    metaByPostId,
    termRelByPostId,
    termsById,
    taxById,
    rankMathMap
  };
}

function categoriesFor(row, post, extracted) {
  const categories = [row.pillar, row.topic].filter(Boolean);
  const relationships = extracted.termRelByPostId.get(post.ID) || [];
  for (const rel of relationships) {
    const taxonomy = extracted.taxById.get(rel);
    if (!taxonomy || taxonomy.taxonomy !== "category") continue;
    const term = extracted.termsById.get(taxonomy.term_id);
    if (term?.name && !/^(blog|uncategorized)$/i.test(term.name)) {
      categories.push(cleanText(term.name));
    }
  }

  return categories
    .map((category) => cleanText(category))
    .filter(Boolean)
    .filter((category, index, arr) => arr.findIndex((item) => item.toLowerCase() === category.toLowerCase()) === index)
    .slice(0, 3);
}

function buildDocs(registerRows, extracted) {
  const routeBySlug = new Map(registerRows.map((row) => [normalizePathSlug(row.legacy_path), row.new_route]));
  const authors = new Map();
  const categories = new Map();
  const posts = [];
  const validations = [];
  const imageSources = new Map();

  for (const row of registerRows) {
    const slug = normalizePathSlug(row.legacy_path);
    const rank = extracted.rankMathMap.get(slug) || {};
    const sourceSlug = SOURCE_SLUG_OVERRIDES.get(slug) || slug;
    const post = extracted.postsBySlug.get(sourceSlug);
    const rowValidation = {
      priority: Number(row.priority),
      slug,
      legacyUrl: row.legacy_url,
      newRoute: row.new_route,
      sourceSlug,
      status: "prepared",
      errors: [],
      warnings: [],
      linksFound: 0,
      linksRewritten: 0,
      internalLinksPreserved: 0,
      propertyLinksRemoved: 0
    };

    if (!post) {
      rowValidation.status = "not_imported";
      rowValidation.errors.push("Legacy WordPress post was not found in approved SQL backup.");
      validations.push(rowValidation);
      continue;
    }

    const disallowedSignals = [row.legacy_url, post.post_title, rank.seo_title]
      .join(" ")
      .toLowerCase();

    if (/(chamanproperties\.com|luxury real estate|real estate investment|property investment|investment returns|investment financing|gated communities|hospitality real estate)/i.test(disallowedSignals)) {
      rowValidation.status = "excluded";
      rowValidation.errors.push("Property-company/investment signal detected; article excluded.");
      validations.push(rowValidation);
      continue;
    }

    const title = titleFromPost(post, rank);
    const authorName = cleanText(extracted.usersById.get(post.post_author)?.display_name || "Chaman Law Firm");
    const authorSlug = slugify(authorName || "Chaman Law Firm");
    const categoryTitles = categoriesFor(row, post, extracted);
    const categoryRefs = [];
    const keywords = [
      ...splitKeywords(rank.focus_keyword || extracted.metaByPostId.get(post.ID)?.rank_math_focus_keyword),
      cleanText(row.topic),
      cleanText(row.pillar)
    ]
      .filter(Boolean)
      .filter((item, index, arr) => arr.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index)
      .slice(0, 12);

    authors.set(authorSlug, { _id: `author.${authorSlug}`, _type: "author", name: authorName, slug: { _type: "slug", current: authorSlug } });
    for (const categoryTitle of categoryTitles) {
      const categorySlug = slugify(categoryTitle);
      categories.set(categorySlug, {
        _id: `category.${categorySlug}`,
        _type: "category",
        title: categoryTitle,
        slug: { _type: "slug", current: categorySlug },
        description: `Migrated legal article category for ${categoryTitle}.`
      });
      categoryRefs.push({ _key: hashKey("category", slug, categorySlug), _type: "reference", _ref: `category.${categorySlug}` });
    }

    const linkStats = rowValidation;
    const body = portableTextFromWordPress(post.post_content, post.post_excerpt || title, routeBySlug, linkStats);
    const meta = extracted.metaByPostId.get(post.ID) || {};
    const thumbnailId = Number(meta._thumbnail_id || 0);
    const attachment = thumbnailId ? extracted.attachmentsById.get(thumbnailId) : null;
    const attachmentMeta = thumbnailId ? extracted.metaByPostId.get(thumbnailId) || {} : {};
    const featuredImageUrl =
      normalizeImageUrl(attachment?.guid) ||
      normalizeImageUrl(rank.social_facebook_thumbnail) ||
      normalizeImageUrl(rank.social_twitter_thumbnail) ||
      firstBodyImageUrl(post.post_content);
    const excerpt = excerptFrom(post.post_excerpt, rank.seo_description, post.post_content);
    const seoTitle = rewriteSeoTemplate(rank.seo_title || meta.rank_math_title || title, title);
    const seoDescription = rewriteSeoTemplate(rank.seo_description || meta.rank_math_description || excerpt, title);
    const noIndex = /noindex/i.test(`${rank.robots || ""} ${rank.advanced_robots || ""} ${meta.rank_math_robots || ""}`);

    if (featuredImageUrl) {
      const imageUrl = new URL(featuredImageUrl);
      imageSources.set(slug, {
        url: featuredImageUrl,
        alt: cleanText(attachmentMeta._wp_attachment_image_alt || attachment?.post_title || title),
        filename: path.basename(imageUrl.pathname || `${slug}.jpg`)
      });
      rowValidation.featuredImageSource = featuredImageUrl;
      rowValidation.featuredImageStatus = "pending_upload";
    } else {
      rowValidation.warnings.push("No featured image source found in WordPress _thumbnail_id metadata.");
      rowValidation.featuredImageStatus = "missing_source";
    }

    if (!body.length) {
      rowValidation.errors.push("Converted body is empty.");
    }

    const doc = {
      _id: safeDraftId(slug),
      _type: "post",
      title,
      slug: { _type: "slug", current: slug },
      excerpt,
      author: { _type: "reference", _ref: `author.${authorSlug}` },
      categories: categoryRefs,
      tags: keywords,
      isFeatured: false,
      isTrending: false,
      isMostRead: false,
      lawFirmApproved: false,
      publishedAt: normalizeWpDate(post.post_date, post.post_date_gmt),
      body,
      seo: {
        metaTitle: seoTitle,
        metaDescription: seoDescription,
        keywords,
        canonicalUrl: row.new_canonical,
        noIndex,
        robots: noIndex ? "noindex,follow" : "index,follow",
        schemaType: "Article",
        openGraphTitle: seoTitle,
        openGraphDescription: seoDescription,
        aeoKeywords: keywords,
        geoKeywords: keywords.filter((keyword) => /(nigeria|lagos|ogun|diaspora)/i.test(keyword))
      }
    };

    rowValidation.documentId = doc._id;
    rowValidation.title = title;
    rowValidation.author = authorName;
    rowValidation.categories = categoryTitles.join("; ");
    rowValidation.wordPressPostId = post.ID;
    if (sourceSlug !== slug) {
      rowValidation.warnings.push(`Used alternate approved WordPress source body slug: ${sourceSlug}`);
    }
    rowValidation.publishedAt = doc.publishedAt;
    rowValidation.bodyBlocks = body.length;
    rowValidation.metaTitlePresent = Boolean(seoTitle);
    rowValidation.metaDescriptionPresent = Boolean(seoDescription);
    rowValidation.lawFirmApproved = false;
    rowValidation.draftId = doc._id;
    validations.push(rowValidation);
    posts.push(doc);
  }

  return {
    authors: Array.from(authors.values()),
    categories: Array.from(categories.values()),
    posts,
    validations,
    imageSources
  };
}

async function ensureReferences(client, docs, typeName, keyField = "slug") {
  if (!docs.length) return { created: 0, existing: 0 };

  const slugs = docs.map((doc) => doc.slug.current);
  const existing = await withRetry(`Fetch existing ${typeName} references`, () =>
    client.fetch(`*[_type == $type && slug.current in $slugs]{_id, "slug": slug.current}`, {
      type: typeName,
      slugs
    })
  );
  const existingBySlug = new Map(existing.map((doc) => [doc.slug, doc._id]));
  let created = 0;

  for (const doc of docs) {
    const existingId = existingBySlug.get(doc.slug.current);
    if (existingId) {
      doc._id = existingId;
      created += 0;
      continue;
    }

    await withRetry(`Create ${typeName} ${doc.slug.current}`, () => client.createIfNotExists(doc));
    created += 1;
  }

  return { created, existing: existing.length };
}

function remapReferenceIds(posts, authors, categories) {
  const authorBySlug = new Map(authors.map((author) => [author.slug.current, author._id]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug.current, category._id]));

  for (const post of posts) {
    const authorSlug = post.author._ref.replace(/^author\./, "");
    post.author._ref = authorBySlug.get(authorSlug) || post.author._ref;
    post.categories = post.categories.map((ref) => {
      const categorySlug = ref._ref.replace(/^category\./, "");
      return { ...ref, _ref: categoryBySlug.get(categorySlug) || ref._ref };
    });
  }
}

async function ensureAsset(client, image, validation) {
  if (!image?.url || skipImages) return null;

  try {
    const existing = await withRetry(`Fetch existing image asset ${image.filename}`, () =>
      client.fetch('*[_type == "sanity.imageAsset" && source.name == $sourceName && source.id == $sourceId][0]{_id}', {
        sourceName: SOURCE_NAME,
        sourceId: image.url
      })
    );
    if (existing?._id) {
      validation.featuredImageStatus = "existing_asset_reused";
      return existing._id;
    }

    const response = await fetch(image.url);
    if (!response.ok) {
      validation.featuredImageStatus = "download_failed";
      validation.warnings.push(`Featured image download failed with HTTP ${response.status}.`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    const asset = await withRetry(`Upload image asset ${image.filename}`, () =>
      client.assets.upload("image", buffer, {
        filename: image.filename,
        contentType,
        title: image.alt,
        source: { name: SOURCE_NAME, id: image.url, url: image.url }
      })
    );
    validation.featuredImageStatus = "uploaded";
    validation.featuredImageAssetId = asset._id;
    return asset._id;
  } catch (error) {
    validation.featuredImageStatus = "upload_failed";
    validation.warnings.push(`Featured image preservation failed: ${error.message}`);
    return null;
  }
}

function validationSummary(validations) {
  const summary = {
    totalRegisterRows: validations.length,
    prepared: validations.filter((row) => row.status === "prepared").length,
    excluded: validations.filter((row) => row.status === "excluded").length,
    notImported: validations.filter((row) => row.status === "not_imported").length,
    errors: validations.reduce((sum, row) => sum + row.errors.length, 0),
    warnings: validations.reduce((sum, row) => sum + row.warnings.length, 0),
    propertyLinksRemoved: validations.reduce((sum, row) => sum + row.propertyLinksRemoved, 0),
    linksRewritten: validations.reduce((sum, row) => sum + row.linksRewritten, 0)
  };
  return summary;
}

async function withRetry(label, action, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      console.warn(`${label} failed on attempt ${attempt}/${attempts}: ${error?.message || String(error)}`);
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }

  throw new Error(`${label} failed after ${attempts} attempts: ${lastError?.message || String(lastError)}`);
}

function csvEscape(value) {
  const stringValue = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

async function writeOutputs(payload, importResult = null) {
  await fsp.mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString();
  await fsp.writeFile(path.join(outDir, "phase5c-prepared-sanity-drafts.json"), JSON.stringify(payload.posts, null, 2), "utf8");
  await fsp.writeFile(
    path.join(outDir, "phase5c-validation-log.json"),
    JSON.stringify({ generatedAt: stamp, summary: validationSummary(payload.validations), importResult, validations: payload.validations }, null, 2),
    "utf8"
  );

  const csvHeaders = [
    "priority",
    "slug",
    "status",
    "sanity_status",
    "documentId",
    "title",
    "author",
    "categories",
    "publishedAt",
    "lawFirmApproved",
    "bodyBlocks",
    "metaTitlePresent",
    "metaDescriptionPresent",
    "featuredImageStatus",
    "featuredImageAssetId",
    "linksFound",
    "linksRewritten",
    "internalLinksPreserved",
    "propertyLinksRemoved",
    "errors",
    "warnings"
  ];
  const csvRows = payload.validations.map((row) =>
    csvHeaders
      .map((header) => csvEscape(header === "errors" || header === "warnings" ? row[header] : row[header]))
      .join(",")
  );
  await fsp.writeFile(path.join(outDir, "phase5c-validation-log.csv"), `${csvHeaders.join(",")}\n${csvRows.join("\n")}\n`, "utf8");

  const report = `# Phase 5C Migration Completion Report

Generated: ${stamp}

## Scope

- Source register: \`${registerPath}\`
- Redirect map: \`${redirectPath}\`
- WordPress source: approved Chaman Law Firm SQL backup
- SEO source: approved RankMath CSV export
- Sanity project/dataset: \`${PROJECT_ID}/${DATASET}\`
- Deployment: not performed
- GitHub push: not performed

## Result

| Metric | Count |
|---|---:|
| Register rows processed | ${payload.validations.length} |
| Draft article records prepared | ${payload.posts.length} |
| Draft article records imported/verified | ${importResult?.verifiedDrafts ?? 0} |
| Supporting authors prepared | ${payload.authors.length} |
| Supporting categories prepared | ${payload.categories.length} |
| Excluded rows | ${validationSummary(payload.validations).excluded} |
| Missing source rows | ${validationSummary(payload.validations).notImported} |
| Validation errors | ${validationSummary(payload.validations).errors} |
| Validation warnings | ${validationSummary(payload.validations).warnings} |
| Internal links rewritten to migrated routes | ${validationSummary(payload.validations).linksRewritten} |
| Property-company links removed from imported body text | ${validationSummary(payload.validations).propertyLinksRemoved} |

## Import controls

- Every migrated article was created as a Sanity draft document using an ID beginning with \`drafts.\`.
- Every migrated article has \`lawFirmApproved: false\`.
- Canonical URLs point to the new \`https://chamanlawfirm.com/resources/blog/{slug}\` route.
- Redirects were preserved in the Phase 5B redirect map but were not activated because the articles remain drafts pending lawyer review.
- No Chaman Properties article was imported.

## Files generated

- \`docs/phase5c/phase5c-prepared-sanity-drafts.json\`
- \`docs/phase5c/phase5c-validation-log.json\`
- \`docs/phase5c/phase5c-validation-log.csv\`
- \`docs/phase5c/PHASE-5C-MIGRATION-COMPLETION-REPORT.md\`

## Remaining launch gates

1. Lawyer review each draft using \`docs/PHASE-5B-LAWYER-REVIEW-WORKFLOW.md\`.
2. Apply legal/editorial corrections in Sanity.
3. Set \`lawFirmApproved: true\` only after final approval.
4. Activate matching 301 redirects only after the destination article resolves publicly.
5. Run post-publication SEO QA and Search Console inspection.
`;
  await fsp.writeFile(path.join(outDir, "PHASE-5C-MIGRATION-COMPLETION-REPORT.md"), report, "utf8");
}

async function main() {
  const registerRows = await readCsv(registerPath);
  const redirectRows = await readCsv(redirectPath);
  const rankRows = await readCsv(rankMathPath);
  const rankMathMap = buildRankMathMap(rankRows);

  if (registerRows.length !== 50) {
    throw new Error(`Expected 50 register rows, found ${registerRows.length}`);
  }

  if (redirectRows.length !== 50) {
    throw new Error(`Expected 50 redirect rows, found ${redirectRows.length}`);
  }

  const extracted = await extractWordPress({ registerRows, rankMathMap });
  const payload = buildDocs(registerRows, extracted);

  let importResult = {
    mode: dryRun ? "dry-run" : "import",
    authorsCreated: 0,
    authorsExisting: 0,
    categoriesCreated: 0,
    categoriesExisting: 0,
    postsCreatedOrExisting: 0,
    verifiedDrafts: 0
  };

  if (!dryRun) {
    const { getCliClient } = await import("sanity/cli");
    const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
      projectId: PROJECT_ID,
      dataset: DATASET,
      useCdn: false,
      perspective: "raw"
    });

    const authorResult = await ensureReferences(client, payload.authors, "author");
    const categoryResult = await ensureReferences(client, payload.categories, "category");
    remapReferenceIds(payload.posts, payload.authors, payload.categories);

    importResult.authorsCreated = authorResult.created;
    importResult.authorsExisting = authorResult.existing;
    importResult.categoriesCreated = categoryResult.created;
    importResult.categoriesExisting = categoryResult.existing;

    const existingSameSlug = await withRetry("Fetch existing post slug conflicts", () =>
      client.fetch('*[_type == "post" && slug.current in $slugs]{_id, "slug": slug.current, lawFirmApproved}', {
        slugs: payload.posts.map((post) => post.slug.current)
      })
    );
    const conflicts = existingSameSlug.filter((doc) => !String(doc._id).startsWith("drafts.chamanlawfirm.phase5c."));
    if (conflicts.length) {
      const conflictSlugs = new Set(conflicts.map((doc) => doc.slug));
      for (const validation of payload.validations) {
        if (conflictSlugs.has(validation.slug)) {
          validation.status = "not_imported";
          validation.errors.push("Skipped because an existing Sanity post with the same slug already exists outside the Phase 5C draft namespace.");
        }
      }
      payload.posts = payload.posts.filter((post) => !conflictSlugs.has(post.slug.current));
    }

    for (const post of payload.posts) {
      const validation = payload.validations.find((row) => row.slug === post.slug.current);
      const image = payload.imageSources.get(post.slug.current);
      const assetId = await ensureAsset(client, image, validation);
      if (assetId) {
        post.mainImage = {
          _type: "image",
          asset: { _type: "reference", _ref: assetId },
          alt: image.alt
        };
      }

      await withRetry(`Create or refresh Phase 5C draft post ${post.slug.current}`, () => client.createOrReplace(post));
      validation.sanity_status = "created_or_existing_draft";
      importResult.postsCreatedOrExisting += 1;
    }

    const verification = await withRetry("Verify imported draft posts", () =>
      client.fetch('*[_id in $ids]{_id, _type, title, "slug": slug.current, lawFirmApproved}', {
        ids: payload.posts.map((post) => post._id)
      })
    );
    const verifiedById = new Map(verification.map((doc) => [doc._id, doc]));
    for (const validation of payload.validations) {
      if (!validation.documentId) continue;
      const verified = verifiedById.get(validation.documentId);
      if (verified && verified._id.startsWith("drafts.") && verified.lawFirmApproved === false) {
        validation.sanity_status = validation.sanity_status || "verified_draft_unapproved";
      } else if (!verified && validation.status === "prepared") {
        validation.sanity_status = "missing_after_import";
        validation.errors.push("Draft document was not found during post-import verification.");
      }
    }
    importResult.verifiedDrafts = verification.filter((doc) => String(doc._id).startsWith("drafts.") && doc.lawFirmApproved === false).length;
  }

  await writeOutputs(payload, importResult);
  console.log(JSON.stringify({ summary: validationSummary(payload.validations), importResult }, null, 2));
}

main().catch((error) => {
  console.error(`Phase 5C migration failed: ${error?.message || String(error)}`);
  process.exit(1);
});
