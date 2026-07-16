const SITE_URL = "https://chamanlawfirm.com";

const checks = [
  ["homepage", `${SITE_URL}/`],
  ["www-to-apex", "https://www.chamanlawfirm.com/"],
  ["blog index", `${SITE_URL}/resources/blog`],
  ["sitemap", `${SITE_URL}/sitemap.xml`],
  ["robots", `${SITE_URL}/robots.txt`],
  ["deed target", `${SITE_URL}/resources/blog/deed-of-partition-in-nigeria`],
  ["deed old redirect", `${SITE_URL}/deed-of-partition-in-nigeria`],
  ["Sprint 11H old redirect", `${SITE_URL}/land-use-act-and-land-tenure-systems`],
  ["Sprint 11H target", `${SITE_URL}/resources/blog/land-use-act-and-land-tenure-systems`],
  ["hidden rule of law", `${SITE_URL}/resources/blog/the-concept-of-rule-of-law-in-nigeria`],
  ["hidden tax clearance", `${SITE_URL}/resources/blog/how-to-obtain-tax-clearance-certificate`],
  ["hidden stamp duty", `${SITE_URL}/resources/blog/stamping-and-up-stamping-of-a-mortgage-document`],
  ["hidden joint property", `${SITE_URL}/resources/blog/legal-implications-of-joint-property`],
  ["hidden expert witness", `${SITE_URL}/resources/blog/expert-witnesses-in-nigeria-court-proceeding`]
];

async function checkUrl(name, url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return {
      name,
      url,
      status: response.status,
      location: response.headers.get("location") || "",
      cache: response.headers.get("x-vercel-cache") || ""
    };
  } catch (error) {
    return { name, url, status: "error", location: "", cache: "", error: error.message };
  }
}

async function main() {
  const rows = [];
  for (const [name, url] of checks) rows.push(await checkUrl(name, url));

  const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((response) => response.text());
  const robots = await fetch(`${SITE_URL}/robots.txt`).then((response) => response.text());
  const hiddenSlugs = [
    "the-concept-of-rule-of-law-in-nigeria",
    "how-to-obtain-tax-clearance-certificate",
    "stamping-and-up-stamping-of-a-mortgage-document",
    "legal-implications-of-joint-property",
    "expert-witnesses-in-nigeria-court-proceeding"
  ];

  console.log(JSON.stringify({
    checks: rows,
    sitemap: {
      status: rows.find((row) => row.name === "sitemap")?.status,
      hasPreviewUrls: /vercel\.app|preview/i.test(sitemap),
      hasDeedOfPartition: sitemap.includes(`${SITE_URL}/resources/blog/deed-of-partition-in-nigeria`),
      hiddenDraftSlugsIncluded: hiddenSlugs.filter((slug) => sitemap.includes(`/resources/blog/${slug}`))
    },
    robots: {
      status: rows.find((row) => row.name === "robots")?.status,
      productionSitemap: robots.includes(`${SITE_URL}/sitemap.xml`),
      blocksStudio: robots.includes("Disallow: /studio"),
      blocksApi: robots.includes("Disallow: /api")
    }
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
