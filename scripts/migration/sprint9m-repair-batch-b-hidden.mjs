import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-02-19" });
const root = process.cwd();
const batchPath = path.join(root, "docs", "SPRINT-9M-BATCH-B-READINESS.csv");
const preparedPath = path.join(root, "docs", "phase5c", "phase5c-prepared-sanity-drafts.json");
const resultPath = path.join(root, "docs", "SPRINT-9M-IMPORT-REPAIR-RESULT.json");

const AUTHOR_SLUG = "charles-chukwuma-nkwoka";
const PUBLIC_ID_PREFIX = "chamanlawfirm-phase5c-";
const MAX_IMPORTS = 18;

const oldFooterPattern =
  /chamanlawfirm@gmail\.com|08065553671|0806\s*555|080242|080968|nigerian lawyers cent|written by\s*chaman law firm team|for more enquiry|115,\s*obafemi|your right,\s*we protect|book a consultation now:www/i;

const propertyPattern =
  /chaman properties|chamanproperties|luxury estate|luxury estates|luxury homes|property listing|high-net-worth investors/i;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...body] = rows;
  return body
    .filter((line) => line.some((item) => item.trim()))
    .map((line) =>
      Object.fromEntries(headers.map((header, index) => [header.trim(), (line[index] || "").trim()]))
    );
}

function key(prefix, slug, index) {
  return `${prefix}-${slug.slice(0, 18)}-${index}`;
}

function block(text, slug, index, style = "normal") {
  return {
    _type: "block",
    _key: key("block", slug, index),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key("span", slug, index),
        marks: [],
        text,
      },
    ],
  };
}

function linkedBlock(parts, slug, index) {
  const markDefs = [];
  const children = parts.map((part, childIndex) => {
    const child = {
      _type: "span",
      _key: key(`span${childIndex}`, slug, index),
      marks: [],
      text: part.text,
    };

    if (part.href) {
      const linkKey = key(`link${childIndex}`, slug, index);
      markDefs.push({ _type: "link", _key: linkKey, href: part.href });
      child.marks = [linkKey];
    }

    return child;
  });

  return {
    _type: "block",
    _key: key("linked", slug, index),
    style: "normal",
    markDefs,
    children,
  };
}

function textOfBlock(blockValue) {
  if (!Array.isArray(blockValue?.children)) return "";
  return blockValue.children.map((child) => child?.text || "").join("").trim();
}

function plainText(blocks = []) {
  return blocks
    .map(textOfBlock)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function practiceHref(practiceArea = "") {
  const value = practiceArea.toLowerCase();
  if (value.includes("corporate")) return "/practice-areas/corporate-commercial-law";
  if (value.includes("litigation")) return "/practice-areas/litigation-dispute-resolution";
  if (value.includes("debt")) return "/practice-areas/debt-recovery";
  if (value.includes("family")) return "/practice-areas/family-law";
  if (value.includes("immigration")) return "/practice-areas/immigration";
  if (value.includes("notary")) return "/practice-areas/notary-public";
  if (value.includes("employment")) return "/practice-areas/employment-law";
  return "/practice-areas/property-real-estate-law";
}

function cleanBody(doc, row) {
  const slug = row.slug;
  const cleaned = (doc.body || [])
    .filter((item) => item?._type === "block")
    .filter((item) => {
      const text = textOfBlock(item);
      if (!text) return false;
      return !oldFooterPattern.test(text);
    });

  const intro = [
    block(
      `Quick answer: ${doc.title} is a public legal-education guide. The correct legal step may depend on the facts, documents, location, timing, and current law, so readers should seek tailored advice before taking action.`,
      slug,
      1
    ),
    block(
      "This article is provided for general legal education only. It should not be treated as final legal advice for a specific matter.",
      slug,
      2
    ),
  ];

  const cta = [
    block("When to speak with a lawyer", slug, 3, "h2"),
    linkedBlock(
      [
        { text: "Speak with Chaman Law Firm before taking a step that may affect your rights, property, business, family, or dispute position. You can " },
        { text: "book a consultation", href: "/consultation" },
        { text: " or review the relevant " },
        { text: "practice area", href: practiceHref(row["practice area"]) },
        { text: " for more context." },
      ],
      slug,
      4
    ),
  ];

  return [...intro, ...cleaned, ...cta];
}

function safeFaqs(title, row, slug) {
  return [
    {
      _key: key("faq1", slug, 1),
      question: `What is the key point in ${title}?`,
      answer:
        "The key point is to understand the legal issue early, keep relevant documents, and get advice before taking steps that may affect rights or obligations.",
    },
    {
      _key: key("faq2", slug, 2),
      question: "Is this article legal advice?",
      answer:
        "No. It is general legal education. A lawyer should review the facts and documents before advice is applied to a specific situation.",
    },
    {
      _key: key("faq3", slug, 3),
      question: "When should I contact Chaman Law Firm?",
      answer: `Contact the firm when the issue involves ${row["practice area"] || "a legal risk"}, deadlines, documentation, dispute strategy, notices, filings, transactions, or regulatory compliance.`,
    },
  ];
}

function fallbackImage(fallbackRefs, row) {
  const practice = (row["practice area"] || "").toLowerCase();
  const ref =
    practice.includes("corporate") || practice.includes("notary")
      ? fallbackRefs["firm-team"]
      : practice.includes("litigation")
        ? fallbackRefs["firm-office-team"]
        : fallbackRefs["managing-partner-office"] || fallbackRefs["firm-office-team"];

  if (!ref) return undefined;

  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt: `${row.title} legal guidance | Chaman Law Firm`,
  };
}

async function main() {
  const batchRows = parseCsv(fs.readFileSync(batchPath, "utf8"));
  const prepared = JSON.parse(fs.readFileSync(preparedPath, "utf8"));
  const draftBySlug = new Map(prepared.map((doc) => [doc.slug?.current, doc]));
  const author = await client.fetch(
    '*[_type == "author" && slug.current == $slug][0] { _id, name }',
    { slug: AUTHOR_SLUG }
  );

  if (!author?._id) throw new Error("Charles author record not found.");

  const fallbackAssets = await client.fetch(
    `{
      "firm-office-team": *[_type == "sanity.imageAsset" && originalFilename == "firm-office-team.jpg"][0]._id,
      "firm-team": *[_type == "sanity.imageAsset" && originalFilename == "firm-team.jpg"][0]._id,
      "managing-partner-office": *[_type == "sanity.imageAsset" && originalFilename == "managing-partner-office.png"][0]._id
    }`
  );

  const importableRows = batchRows
    .filter((row) => row["body exists"] === "yes")
    .filter((row) => row["SEO title exists"] === "yes")
    .filter((row) => row["meta description exists"] === "yes")
    .filter((row) => row["canonical exists"] === "yes")
    .filter((row) => row["publishedAt valid"] === "yes")
    .filter((row) => row["no Chaman Properties content"] === "yes")
    .filter((row) => row["no placeholder"] === "yes")
    .slice(0, MAX_IMPORTS);

  const imported = [];
  const skipped = [];
  let transaction = client.transaction();

  for (const row of importableRows) {
    const draft = draftBySlug.get(row.slug);

    if (!draft) {
      skipped.push({ slug: row.slug, reason: "Missing prepared draft." });
      continue;
    }

    const originalText = plainText(draft.body);

    if (propertyPattern.test(`${draft.title} ${originalText}`)) {
      skipped.push({ slug: row.slug, reason: "Property/off-brand signal found." });
      continue;
    }

    const body = cleanBody(draft, row);
    const cleanedText = plainText(body);

    if (cleanedText.length < 600) {
      skipped.push({ slug: row.slug, reason: "Cleaned body too short." });
      continue;
    }

    if (oldFooterPattern.test(cleanedText)) {
      skipped.push({ slug: row.slug, reason: "Legacy footer/contact text remained after cleanup." });
      continue;
    }

    const mainImage = draft.mainImage?.asset?._ref ? draft.mainImage : fallbackImage(fallbackAssets, row);

    if (!mainImage?.asset?._ref) {
      skipped.push({ slug: row.slug, reason: "No featured image or fallback asset available." });
      continue;
    }

    const doc = {
      ...draft,
      _id: `${PUBLIC_ID_PREFIX}${row.slug}`,
      _type: "post",
      author: { _type: "reference", _ref: author._id },
      lawFirmApproved: false,
      body,
      faqs: draft.faqs?.length ? draft.faqs : safeFaqs(draft.title, row, row.slug),
      mainImage,
      seo: {
        ...(draft.seo || {}),
        canonicalUrl: `https://chamanlawfirm.com/resources/blog/${row.slug}`,
        noIndex: false,
      },
    };

    delete doc._createdAt;
    delete doc._updatedAt;
    delete doc._rev;

    transaction = transaction.createOrReplace(doc);
    imported.push({
      slug: row.slug,
      documentId: doc._id,
      title: doc.title,
      lawFirmApproved: false,
      imageRef: mainImage.asset._ref,
      cleanedLegacyFooter: oldFooterPattern.test(originalText),
    });
  }

  const result = imported.length ? await transaction.commit({ autoGenerateArrayKeys: true }) : null;
  const output = {
    generatedAt: new Date().toISOString(),
    importedHiddenCount: imported.length,
    skippedCount: skipped.length,
    imported,
    skipped,
    transactionId: result?.transactionId || null,
  };

  fs.writeFileSync(resultPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
