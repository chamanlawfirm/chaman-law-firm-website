const SITE_URL = "https://chamanlawfirm.com";
const APPROVED_SLUG = "revocation-of-power-of-attorney";
const HIDDEN_SLUGS = [
  "the-concept-of-rule-of-law-in-nigeria",
  "how-to-obtain-tax-clearance-certificate",
  "stamping-and-up-stamping-of-a-mortgage-document",
  "legal-implications-of-joint-property",
  "expert-witnesses-in-nigeria-court-proceeding"
];
const REGRESSION_PATHS = [
  "/deed-of-partition-in-nigeria",
  "/land-use-act-and-land-tenure-systems",
  "/conditions-for-granting-injunctions-and-types-of-injunctions",
  "/who-can-be-a-notary-public",
  "/what-are-elements-of-tax-law"
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
  const targetUrl = `${SITE_URL}/resources/blog/${APPROVED_SLUG}`;
  const targetResponse = await fetch(targetUrl, { redirect: "manual" });
  const targetHtml = await targetResponse.text();
  const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((response) => response.text());
  const robots = await fetch(`${SITE_URL}/robots.txt`).then((response) => response.text());

  const checks = [
    await checkUrl("homepage", `${SITE_URL}/`),
    await checkUrl("www-to-apex", "https://www.chamanlawfirm.com/"),
    await checkUrl("blog index", `${SITE_URL}/resources/blog`),
    await checkUrl("sitemap", `${SITE_URL}/sitemap.xml`),
    await checkUrl("robots", `${SITE_URL}/robots.txt`),
    await checkUrl("new approved target", targetUrl),
    await checkUrl("new old URL", `${SITE_URL}/${APPROVED_SLUG}`),
    ...(await Promise.all(REGRESSION_PATHS.map((path) => checkUrl(`regression ${path}`, `${SITE_URL}${path}`)))),
    ...(await Promise.all(HIDDEN_SLUGS.map((slug) => checkUrl(`hidden ${slug}`, `${SITE_URL}/resources/blog/${slug}`))))
  ];

  console.log(JSON.stringify({
    checks,
    newApprovedArticle: {
      status: targetResponse.status,
      canonical: targetHtml.includes(`href="${targetUrl}"`),
      title: /Revocation Of Power Of Attorney|REVOCATION OF POWER OF ATTORNEY/i.test(targetHtml),
      author: targetHtml.includes("Charles Chukwuma Nkwoka"),
      image: targetHtml.includes("cdn.sanity.io"),
      cta: targetHtml.includes("/consultation") || targetHtml.includes("/contact")
    },
    sitemap: {
      status: checks.find((row) => row.name === "sitemap")?.status,
      includesNewApprovedArticle: sitemap.includes(targetUrl),
      hiddenDraftSlugsIncluded: HIDDEN_SLUGS.filter((slug) => sitemap.includes(`/resources/blog/${slug}`)),
      hasPreviewUrls: /vercel\.app|preview/i.test(sitemap),
      productionUrls: sitemap.includes(SITE_URL)
    },
    robots: {
      status: checks.find((row) => row.name === "robots")?.status,
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
