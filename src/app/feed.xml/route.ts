import { getBlogPosts } from "@/lib/cms";
import { siteConfig } from "@/lib/constants";

export const revalidate = 2592000;

function xml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;"
  })[character] || character);
}

export async function GET() {
  const posts = await getBlogPosts({ limit: 50 });
  const items = posts.map((post) => `
    <item>
      <title>${xml(post.title)}</title>
      <link>${siteConfig.url}/resources/blog/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${siteConfig.url}/resources/blog/${encodeURIComponent(post.slug)}</guid>
      <description>${xml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <title>Chaman Law Firm Legal Insights</title>
    <link>${siteConfig.url}/resources/blog</link>
    <description>Nigerian legal insights from Chaman Law Firm.</description>
    ${items}
  </channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
}
