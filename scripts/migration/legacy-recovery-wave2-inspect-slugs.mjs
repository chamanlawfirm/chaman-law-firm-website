import fs from "node:fs";
import { createClient } from "@sanity/client";

for (const raw of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const match = raw.match(/^([^#=]+)=(.*)$/);
  if (!match) continue;
  const key = match[1].trim();
  const value = match[2].trim().replace(/^['"]|['"]$/g, "");
  if (key && !process.env[key]) process.env[key] = value;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eeuefmhu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-17",
  token: process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN || "",
  useCdn: false,
  perspective: "raw",
});

const slugs = process.argv.slice(2);
const rows = await client.fetch(
  `*[_type == "post" && slug.current in $slugs]{
    _id,
    title,
    "slug": slug.current,
    lawFirmApproved,
    publishedAt,
    _createdAt,
    _updatedAt,
    "bodyChars": length(pt::text(body)),
    "hasImage": defined(mainImage.asset)
  } | order(slug asc, _updatedAt desc)`,
  { slugs },
);

console.log(JSON.stringify(rows, null, 2));
