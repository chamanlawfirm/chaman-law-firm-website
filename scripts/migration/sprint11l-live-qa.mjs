import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://chamanlawfirm.com";
const redirectBatchPath = path.join("docs", "SPRINT-11L-REDIRECT-ACTIVATION-BATCH.csv");

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

async function head(url, redirect = "manual") {
  try {
    const response = await fetch(url, { method: "HEAD", redirect });
    return {
      url,
      status: response.status,
      location: response.headers.get("location") || "",
      cache: response.headers.get("x-vercel-cache") || ""
    };
  } catch (error) {
    return { url, status: "error", location: "", cache: "", error: error.message };
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

const redirectRows = readCsv(redirectBatchPath);
const approvedTargets = redirectRows.map((row) => row["new URL"]).filter(Boolean);
const oldPaths = redirectRows.map((row) => row["old source path"]).filter(Boolean);
const hiddenSamples = [
  "how-to-change-car-ownership-in-nigeria",
  "duties-of-correctional-institutions-in-nigeria",
  "stamping-and-up-stamping-of-a-mortgage-document",
  "legal-implications-of-joint-property",
  "minority-protection-rights-and-remedies"
];
const regressionPaths = [
  "/revocation-of-power-of-attorney",
  "/deed-of-partition-in-nigeria",
  "/land-use-act-and-land-tenure-systems",
  "/conditions-for-granting-injunctions-and-types-of-injunctions",
  "/who-can-be-a-notary-public",
  "/what-are-elements-of-tax-law"
];

const coreChecks = [
  await head(`${SITE_URL}/`),
  await head(`https://www.chamanlawfirm.com/`),
  await head(`${SITE_URL}/resources/blog`),
  await head(`${SITE_URL}/sitemap.xml`),
  await head(`${SITE_URL}/robots.txt`)
];

const targetChecks = [];
for (const target of approvedTargets) {
  targetChecks.push(await head(target));
}

const redirectChecks = [];
for (const source of oldPaths) {
  const nonSlash = `${SITE_URL}${source}`;
  const slash = `${SITE_URL}${source}/`;
  redirectChecks.push(await head(nonSlash));
  redirectChecks.push(await head(slash));
  redirectChecks.push(await head(`${SITE_URL}/resources/blog${source}`));
}

const hiddenChecks = [];
for (const slug of hiddenSamples) {
  hiddenChecks.push(await head(`${SITE_URL}/resources/blog/${slug}`));
}

const regressionChecks = [];
for (const source of regressionPaths) {
  regressionChecks.push(await head(`${SITE_URL}${source}`));
}

const sitemap = await text(`${SITE_URL}/sitemap.xml`);
const robots = await text(`${SITE_URL}/robots.txt`);
const sitemapTargetCounts = Object.fromEntries(
  approvedTargets.map((target) => [target, sitemap.text.split(target).length - 1])
);

console.log(JSON.stringify({
  coreChecks,
  targetChecks,
  redirectChecks,
  hiddenChecks,
  regressionChecks,
  sitemap: {
    status: sitemap.status,
    targetCounts: sitemapTargetCounts,
    hasPreviewUrls: /vercel\.app|preview/i.test(sitemap.text),
    productionUrls: sitemap.text.includes(SITE_URL)
  },
  robots: {
    status: robots.status,
    productionSitemap: robots.text.includes(`${SITE_URL}/sitemap.xml`),
    blocksStudio: /Disallow:\s*\/studio/i.test(robots.text),
    blocksApi: /Disallow:\s*\/api/i.test(robots.text)
  }
}, null, 2));
