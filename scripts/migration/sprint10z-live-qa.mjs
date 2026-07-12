const urls = [
  "https://chamanlawfirm.com/",
  "https://www.chamanlawfirm.com/",
  "https://chamanlawfirm.com/resources/blog",
  "https://chamanlawfirm.com/sitemap.xml",
  "https://chamanlawfirm.com/robots.txt",
  "https://chamanlawfirm.com/force-majeure-clauses-in-business-contracts",
  "https://chamanlawfirm.com/3-proven-steps-on-how-to-rolve-land-disputes",
  "https://chamanlawfirm.com/documents-to-verify-before-buying-property",
  "https://chamanlawfirm.com/obtaining-a-certificate-of-occupancy-c-of-o",
  "https://chamanlawfirm.com/resources/blog/property-how-to-place-a-caveat",
  "https://chamanlawfirm.com/resources/blog/can-a-landlord-increase-rent-arbitrarily-in-ogun",
  "https://chamanlawfirm.com/resources/blog/void-and-voidable-marriages-in-nigeria"
];

async function head(url) {
  const response = await fetch(url, { redirect: "manual" });
  return {
    url,
    status: response.status,
    location: response.headers.get("location") || ""
  };
}

async function main() {
  for (const url of urls) {
    console.log(JSON.stringify(await head(url)));
  }

  const sitemap = await (await fetch("https://chamanlawfirm.com/sitemap.xml")).text();
  console.log(JSON.stringify({
    check: "sitemap",
    hasVercel: sitemap.includes("vercel.app"),
    hasCofO: sitemap.includes("/resources/blog/how-do-i-obtain-a-certificate-of-occupancy"),
    hiddenSamplesIncluded: [
      "/resources/blog/property-how-to-place-a-caveat",
      "/resources/blog/can-a-landlord-increase-rent-arbitrarily-in-ogun",
      "/resources/blog/void-and-voidable-marriages-in-nigeria"
    ].filter((path) => sitemap.includes(path))
  }));

  const robots = await (await fetch("https://chamanlawfirm.com/robots.txt")).text();
  console.log(JSON.stringify({
    check: "robots",
    hasProductionSitemap: robots.includes("https://chamanlawfirm.com/sitemap.xml"),
    blocksStudio: robots.includes("/studio"),
    blocksApi: robots.includes("/api")
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
