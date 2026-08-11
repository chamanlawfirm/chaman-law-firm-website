const projectId = "eeuefmhu";
const dataset = "production";
const apiVersion = "2026-05-17";

async function sanityQuery(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data.result;
}

async function main() {
  const publicFilter = `_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;
  const hiddenFilter = `_type == "post" && (!defined(lawFirmApproved) || lawFirmApproved != true || _id in path("drafts.**") || !defined(slug.current) || !defined(publishedAt) || publishedAt > now())`;

  const out = {
    generatedAt: new Date().toISOString(),
    sanity: {
      totalPostRecords: await sanityQuery(`count(*[_type == "post"])`),
      approvedPublicRecords: await sanityQuery(`count(*[${publicFilter}])`),
      uniqueApprovedPublicSlugs: await sanityQuery(`count(array::unique(*[${publicFilter}].slug.current))`),
      hiddenUnapprovedRecords: await sanityQuery(`count(*[${hiddenFilter}])`),
      uniqueHiddenSlugs: await sanityQuery(`count(array::unique(*[${hiddenFilter} && defined(slug.current)].slug.current))`),
      dottedOrSourceRecords: await sanityQuery(`count(*[_type == "post" && defined(slug.current) && (slug.current match "*.*" || _id match "*.source*" || _id match "drafts.*")])`),
      duplicatePublicSlugs: await sanityQuery(`count(*[${publicFilter}].slug.current) - count(array::unique(*[${publicFilter}].slug.current))`),
    },
  };

  const sitemapResponse = await fetch("https://chamanlawfirm.com/sitemap.xml");
  const sitemapXml = await sitemapResponse.text();
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const status = {
    status200: 0,
    redirect: 0,
    notFoundOrError: 0,
    other: 0,
  };

  async function checkUrl(url) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });

      if (response.status >= 200 && response.status < 300) return "status200";
      if (response.status >= 300 && response.status < 400) return "redirect";
      if (response.status === 404) return "notFoundOrError";
    } catch {
      // Fall through to GET; some production routes are slow or unreliable on HEAD.
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(12000),
      });

      if (response.status >= 200 && response.status < 300) return "status200";
      if (response.status >= 300 && response.status < 400) return "redirect";
      if (response.status === 404) return "notFoundOrError";
      return "other";
    } catch {
      return "notFoundOrError";
    }
  }

  for (let index = 0; index < urls.length; index += 50) {
    const results = await Promise.all(urls.slice(index, index + 50).map(checkUrl));
    for (const result of results) status[result] += 1;
  }

  out.sitemap = {
    httpStatus: sitemapResponse.status,
    totalCanonicalUrls: urls.length,
    blogUrls: urls.filter((url) => url.includes("/resources/blog/")).length,
    staticServiceUrls: urls.filter((url) => !url.includes("/resources/blog/")).length,
    status,
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
