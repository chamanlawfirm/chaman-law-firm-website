import fs from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const API_VERSION = "2026-05-17";
const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const SOURCE_NAME = "phase5c-wp-top50-migration";

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const validationPath = argValue("--validation", "docs/phase5c/phase5c-validation-log.json");
const outPath = argValue("--out", "docs/phase5c/phase5c-image-preservation-log.json");
const limit = Number(argValue("--limit", "100"));

async function withRetry(label, action, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      console.warn(`${label} failed on attempt ${attempt}/${attempts}: ${error?.message || String(error)}`);
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
  throw new Error(`${label} failed after ${attempts} attempts: ${lastError?.message || String(lastError)}`);
}

function normalizeFilename(url, slug) {
  try {
    const parsed = new URL(url);
    return path.basename(parsed.pathname) || `${slug}.jpg`;
  } catch {
    return `${slug}.jpg`;
  }
}

async function ensureAsset(client, row) {
  const sourceUrl = row.featuredImageSource;
  if (!sourceUrl) return null;

  const existing = await withRetry(`Fetch existing image asset ${row.slug}`, () =>
    client.fetch('*[_type == "sanity.imageAsset" && source.name == $sourceName && source.id == $sourceId][0]{_id}', {
      sourceName: SOURCE_NAME,
      sourceId: sourceUrl
    })
  );
  if (existing?._id) return existing._id;

  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Image download failed with HTTP ${response.status}`);

  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    throw new Error(`URL did not return an image content-type: ${contentType}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await withRetry(`Upload image asset ${row.slug}`, () =>
    client.assets.upload("image", buffer, {
      filename: normalizeFilename(sourceUrl, row.slug),
      contentType,
      title: row.title || row.slug,
      source: { name: SOURCE_NAME, id: sourceUrl, url: sourceUrl }
    })
  );
  return asset._id;
}

async function main() {
  const validation = JSON.parse(await fs.readFile(validationPath, "utf8"));
  const rows = validation.validations.filter((row) => row.documentId && row.featuredImageSource);
  const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
    projectId: PROJECT_ID,
    dataset: DATASET,
    useCdn: false,
    perspective: "raw"
  });

  const ids = rows.map((row) => row.documentId);
  const existingDocs = await withRetry("Fetch current Phase 5C draft image status", () =>
    client.fetch('*[_id in $ids]{_id, defined(mainImage.asset._ref) => {"hasMainImage": true}}', { ids })
  );
  const hasImage = new Set(existingDocs.filter((doc) => doc.hasMainImage).map((doc) => doc._id));
  const work = rows.filter((row) => !hasImage.has(row.documentId)).slice(0, limit);
  const results = [];

  for (const row of work) {
    const result = {
      priority: row.priority,
      slug: row.slug,
      documentId: row.documentId,
      featuredImageSource: row.featuredImageSource,
      status: "pending"
    };

    try {
      const assetId = await ensureAsset(client, row);
      if (!assetId) {
        result.status = "missing_source";
      } else {
        await withRetry(`Patch mainImage ${row.slug}`, () =>
          client
            .patch(row.documentId)
            .set({
              mainImage: {
                _type: "image",
                asset: { _type: "reference", _ref: assetId },
                alt: row.title || row.slug
              }
            })
            .commit()
        );
        result.status = "patched";
        result.assetId = assetId;
      }
    } catch (error) {
      result.status = "failed";
      result.error = error?.message || String(error);
    }

    results.push(result);
  }

  const postCheck = await withRetry("Verify Phase 5C image status after patching", () =>
    client.fetch('*[_id in $ids]{_id, defined(mainImage.asset._ref) => {"hasMainImage": true}}', { ids })
  );
  const summary = {
    candidatesWithSource: rows.length,
    alreadyHadImageBeforeRun: hasImage.size,
    attemptedThisRun: work.length,
    patchedThisRun: results.filter((row) => row.status === "patched").length,
    failedThisRun: results.filter((row) => row.status === "failed").length,
    withMainImageAfterRun: postCheck.filter((doc) => doc.hasMainImage).length
  };

  await fs.writeFile(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(`Phase 5C image preservation failed: ${error?.message || String(error)}`);
  process.exit(1);
});
