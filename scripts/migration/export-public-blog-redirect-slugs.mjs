import fs from "node:fs";
import { createClient } from "@sanity/client";

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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eeuefmhu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-17",
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false
});

const slugs = await client.fetch(
  `array::unique(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && defined(slug.current)].slug.current) | order(@ asc)`
);

const body = `export const legacyActivationBlogRedirectSlugs = ${JSON.stringify(slugs, null, 2)};\n`;
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/legacy-blog-redirect-slugs.mjs", body, "utf8");
console.log(JSON.stringify({ exported: slugs.length, file: "src/data/legacy-blog-redirect-slugs.mjs" }, null, 2));
