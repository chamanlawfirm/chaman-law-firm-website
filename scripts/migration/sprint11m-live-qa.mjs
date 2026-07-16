import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const paths = {
  redirectBatch: path.join("docs", "SPRINT-11M-EXACT-REDIRECT-RESCUE-BATCH.csv"),
  blogScale: path.join("docs", "SPRINT-11M-BLOG-RECOVERY-SCALE-UP.csv"),
  result: path.join("docs", "SPRINT-11M-LIVE-QA.json")
};

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

function normalizePath(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/";
  try {
    const parsed = new URL(raw, SITE_URL);
    const pathValue = `/${parsed.pathname.split("/").filter(Boolean).join("/")}`;
    return pathValue === "/" ? "/" : pathValue.replace(/\/+$/, "");
  } catch {
    const cleaned = `/${raw.replace(/^https?:\/\/(?:www\.)?[^/]+/i, "").split(/[?#]/)[0].split("/").filter(Boolean).join("/")}`;
    return cleaned === "/" ? "/" : cleaned.replace(/\/+$/, "");
  }
}

function absoluteUrl(value) {
  const route = normalizePath(value);
  return `${SITE_URL}${route === "/" ? "" : route}`;
}

async function head(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "manual", signal: controller.signal });
      clearTimeout(timeout);
      return {
        url,
        status: response.status,
        location: response.headers.get("location") || "",
        cache: response.headers.get("x-vercel-cache") || "",
        attempt
      };
    } catch (error) {
      clearTimeout(timeout);
      if (attempt === 3) return { url, status: "error", location: "", cache: "", error: error.message, attempt };
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
}

async function text(url) {
  try {
    const response = await fetch(url);
    return { url, status: response.status, text: await response.text() };
  } catch (error) {
    return { url, status: "error", text: "", error: error.message };
  }
}

async function main() {
  const redirectRows = readCsv(paths.redirectBatch).filter((row) => row["old source path"]);
  const hiddenRows = readCsv(paths.blogScale)
    .filter((row) => row["approval readiness"] === "keep hidden")
    .slice(0, 5);
  const regressionSources = [
    "/what-are-the-sources-of-nigerian-law",
    "/maxims-of-equity",
    "/the-role-of-regulatory-bodies",
    "/pohistory-of-legal-profession-in-nigeria",
    "/revocation-of-power-of-attorney",
    "/deed-of-partition-in-nigeria",
    "/the-duties-of-lawyers-to-client",
    "/land-use-act-and-land-tenure-systems",
    "/who-can-be-a-notary-public",
    "/governors-consent"
  ];

  const [homepage, www, blog, sitemap, robots] = await Promise.all([
    head(`${SITE_URL}/`),
    head("https://www.chamanlawfirm.com/"),
    head(`${SITE_URL}/resources/blog`),
    text(`${SITE_URL}/sitemap.xml`),
    text(`${SITE_URL}/robots.txt`)
  ]);
  const sitemapUrls = new Set([...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

  const redirectChecks = [];
  for (const row of redirectRows) {
    const oldPath = normalizePath(row["old source path"]);
    const targetPath = normalizePath(row["new target path"]);
    redirectChecks.push({
      source: oldPath,
      target: targetPath,
      old: await head(absoluteUrl(oldPath)),
      oldSlash: await head(`${absoluteUrl(oldPath)}/`),
      targetHead: await head(absoluteUrl(targetPath)),
      sitemapCount: sitemap.text.split(absoluteUrl(targetPath)).length - 1
    });
  }

  const hiddenChecks = [];
  for (const row of hiddenRows) {
    hiddenChecks.push(await head(`${SITE_URL}/resources/blog/${row.slug}`));
  }

  const regressionChecks = [];
  for (const source of regressionSources) {
    regressionChecks.push(await head(absoluteUrl(source)));
  }

  const result = {
    coreChecks: { homepage, www, blog },
    sitemap: {
      status: sitemap.status,
      hasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
      productionUrls: sitemap.text.includes(SITE_URL),
      newRedirectTargets: redirectRows.map((row) => ({
        target: row["new URL"],
        included: sitemapUrls.has(row["new URL"])
      }))
    },
    robots: {
      status: robots.status,
      productionSitemap: robots.text.includes(`${SITE_URL}/sitemap.xml`),
      blocksStudio: robots.text.includes("Disallow: /studio"),
      blocksApi: robots.text.includes("Disallow: /api")
    },
    redirectChecks,
    hiddenChecks,
    regressionChecks
  };

  fs.writeFileSync(paths.result, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
