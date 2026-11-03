import { getPublishedContent } from "@/lib/publishing";
import { siteConfig } from "@/lib/constants";

export const revalidate = 300;

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, char => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;"
  })[char] || char);
}
function rssDate(value: string) {
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toUTCString() : new Date(0).toUTCString();
}
export async function GET() {
  const reports = await getPublishedContent("legal-news", 50);
  const items = reports.map(report => {
    const url = `${siteConfig.url}/resources/legal-news/${encodeURIComponent(report.slug)}`;
    return `<item><title>${escapeXml(report.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(report.excerpt)}</description><pubDate>${rssDate(report.date)}</pubDate></item>`;
  }).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Chaman Law Firm — Nigeria News and Current Affairs</title><link>${siteConfig.url}/resources/legal-news</link><description>Verified Nigerian current affairs and legal developments.</description><language>en-ng</language>${items}</channel></rss>`;
  return new Response(body, {headers:{"Content-Type":"application/rss+xml; charset=utf-8","Cache-Control":"public, s-maxage=300, stale-while-revalidate=60"}});
}
