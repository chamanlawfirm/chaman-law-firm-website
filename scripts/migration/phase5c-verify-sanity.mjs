import fs from "node:fs/promises";
import { getCliClient } from "sanity/cli";

const preparedPath = process.argv[process.argv.indexOf("--prepared") + 1] || "docs/phase5c/phase5c-prepared-sanity-drafts.json";
const apiVersion = "2026-05-17";

async function main() {
  const docs = JSON.parse(await fs.readFile(preparedPath, "utf8"));
  const ids = docs.map((doc) => doc._id);
const client = getCliClient({ apiVersion }).withConfig({
  projectId: "eeuefmhu",
  dataset: "production",
  useCdn: false,
  perspective: "raw"
});
  const found = await client.fetch('*[_id in $ids]{_id,title,"slug":slug.current,lawFirmApproved,defined(mainImage.asset._ref) => {"hasMainImage": true}}', { ids });
  const foundIds = new Set(found.map((doc) => doc._id));
  const missing = ids.filter((id) => !foundIds.has(id));
  const unapproved = found.filter((doc) => doc.lawFirmApproved === false).length;
  const drafts = found.filter((doc) => String(doc._id).startsWith("drafts.")).length;
  const withMainImage = found.filter((doc) => doc.hasMainImage === true).length;

  console.log(JSON.stringify({
    expected: ids.length,
    found: found.length,
    drafts,
    unapproved,
    withMainImage,
    missing
  }, null, 2));
}

main().catch((error) => {
  console.error(`Phase 5C verification failed: ${error?.message || String(error)}`);
  process.exit(1);
});
