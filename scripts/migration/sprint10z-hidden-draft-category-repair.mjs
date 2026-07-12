import fs from "node:fs";

const PROJECT_ID = "eeuefmhu";
const DATASET = "production";
const API_VERSION = "2024-06-01";
const AUTHOR_ID = "author.charles-chukwuma-nkwoka";

const targets = [
  {
    slug: "property-how-to-place-a-caveat",
    categories: ["category.property-and-real-estate-law", "category.property-title-and-perfection"],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "property title/procedure review"
  },
  {
    slug: "can-a-landlord-increase-rent-arbitrarily-in-ogun",
    categories: ["category.property-and-tenancy-law", "category.tenancy-landlord-and-eviction"],
    practiceArea: "Property and Tenancy Law",
    topicType: "blog",
    sensitivity: "tenancy/current-law review"
  },
  {
    slug: "land-grabbing-the-legal-consequences-of",
    categories: ["category.property-and-real-estate-law", "category.land-disputes-and-trespass"],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "land dispute/current-law review"
  },
  {
    slug: "challenges-of-implementing-the-land-use-act",
    categories: ["category.property-and-real-estate-law", "category.land-ownership-title-and-registration"],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "Land Use Act/current-law review"
  },
  {
    slug: "how-to-calculate-stamp-duty-chaman-law-firm",
    categories: ["category.property-and-real-estate-law", "category.property-finance-and-stamp-duties"],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "tax/stamp-duty current-rate review"
  },
  {
    slug: "certificate-of-occupancy-in-rivers-state",
    categories: [
      "category.property-and-real-estate-law",
      "category.certificate-of-occupancy-and-right-of-occupancy",
      "category.property-title-and-perfection"
    ],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "state C of O/current-process review"
  },
  {
    slug: "void-and-voidable-marriages-in-nigeria",
    categories: ["category.family-law", "category.family-marriage-and-divorce"],
    practiceArea: "Family Law",
    topicType: "blog",
    sensitivity: "family-law sensitivity review"
  },
  {
    slug: "the-role-of-family-court-in-relation-to-child-protect-in-nigeria",
    categories: ["category.family-law", "category.family-litigation-and-child-protection"],
    practiceArea: "Family Law",
    topicType: "blog",
    sensitivity: "child/family-law sensitivity review"
  },
  {
    slug: "rights-of-a-property-owner-in-nigeria",
    categories: ["category.property-and-real-estate-law", "category.land-ownership-title-and-registration"],
    practiceArea: "Property and Real Estate Law",
    topicType: "blog",
    sensitivity: "duplicate/property-rights review"
  },
  {
    slug: "letters-of-administration-in-nigeria",
    categories: ["category.probate-and-estate-administration", "category.probate-wills-and-inheritance"],
    practiceArea: "Probate and Estate Administration",
    topicType: "blog",
    sensitivity: "probate/current-procedure review"
  },
  {
    slug: "debt-recovery-lawyer-nigeria",
    categories: ["category.debt-recovery", "category.debt-recovery-and-enforcement"],
    practiceArea: "Debt Recovery",
    topicType: "service",
    sensitivity: "service-page/cannibalization review"
  },
  {
    slug: "how-do-i-legally-evict-a-tenant-in-ogun-state",
    categories: ["category.property-and-tenancy-law", "category.tenancy-landlord-and-eviction"],
    practiceArea: "Property and Tenancy Law",
    topicType: "blog",
    sensitivity: "eviction/self-help risk review"
  }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function categoryRef(ref) {
  return {
    _key: ref.replace(/^category\./, "cat-").replace(/[^a-zA-Z0-9_-]/g, "-"),
    _type: "reference",
    _ref: ref
  };
}

async function requestSanity(path, init = {}) {
  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN;
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const response = await fetch(`https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sanity request failed: ${response.status} ${text.slice(0, 300)}`);
  }

  return response.json();
}

async function querySanity(query, params = {}) {
  const url = new URL(`/v${API_VERSION}/data/query/${DATASET}`, `https://${PROJECT_ID}.api.sanity.io`);
  url.searchParams.set("perspective", "raw");
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const token = process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN;
  if (!token) throw new Error("Missing Sanity token. Set SANITY_AUTH_TOKEN or CMS_API_TOKEN locally.");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sanity query failed: ${response.status} ${text.slice(0, 300)}`);
  }
  const payload = await response.json();
  return payload.result;
}

async function main() {
  loadEnvFile(".env.local");

  const apply = process.argv.includes("--apply");
  const tokenDetected = Boolean(process.env.SANITY_AUTH_TOKEN || process.env.CMS_API_TOKEN);
  const targetBySlug = new Map(targets.map((target) => [target.slug, target]));
  const slugs = targets.map((target) => target.slug);

  const docs = await querySanity(
    `*[_type == "post" && _id in path("drafts.**") && slug.current in $slugs] | order(slug.current asc, _id asc) {
      _id,
      title,
      "slug": slug.current,
      lawFirmApproved,
      publishedAt,
      "authorId": author._ref,
      "authorName": author->name,
      "categories": categories[]->{_id, title, "slug": slug.current},
      "hasBody": defined(body[0]),
      "bodyBlocks": count(body[]),
      "hasImage": defined(mainImage.asset._ref),
      "hasAlt": defined(mainImage.alt) && length(mainImage.alt) > 8,
      "seoTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      "canonical": seo.canonicalUrl
    }`,
    { slugs }
  );

  const categories = await querySanity(
    `*[_type == "category" && _id in $ids] { _id, title, "slug": slug.current }`,
    { ids: [...new Set(targets.flatMap((target) => target.categories))] }
  );
  const approvedPublicPostCount = await querySanity(
    `count(*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**"))])`
  );
  const approvedPublicTargets = await querySanity(
    `*[_type == "post" && lawFirmApproved == true && !(_id in path("drafts.**")) && slug.current in $slugs] | order(slug.current asc) {
      _id,
      title,
      "slug": slug.current
    }`,
    { slugs }
  );
  const existingCategoryIds = new Set(categories.map((category) => category._id));

  const missingCategoryIds = [...new Set(targets.flatMap((target) => target.categories))]
    .filter((id) => !existingCategoryIds.has(id));

  const repairDocs = docs.filter((doc) => doc.lawFirmApproved !== true);
  const mutations = repairDocs.map((doc) => {
    const target = targetBySlug.get(doc.slug);
    return {
      patch: {
        id: doc._id,
        set: {
          author: { _type: "reference", _ref: AUTHOR_ID },
          categories: target.categories.map(categoryRef),
          lawFirmApproved: false
        }
      }
    };
  });

  let mutationResult = null;
  if (apply && mutations.length && missingCategoryIds.length === 0) {
    mutationResult = await requestSanity(`/data/mutate/${DATASET}`, {
      method: "POST",
      body: JSON.stringify({ mutations, returnIds: true })
    });
  }

  const summary = {
    tokenDetected,
    mode: apply ? "apply" : "dry-run",
    targetSlugs: targets.length,
    matchingHiddenDrafts: docs.length,
    approvedPublicPostCount,
    approvedPublicTargets,
    missingCategoryIds,
    patchedDraftIds: mutationResult?.transactionId ? repairDocs.map((doc) => doc._id) : [],
    skippedApprovedDraftIds: docs.filter((doc) => doc.lawFirmApproved === true).map((doc) => doc._id),
    docs: docs.map((doc) => {
      const target = targetBySlug.get(doc.slug);
      return {
        id: doc._id,
        title: doc.title,
        slug: doc.slug,
        currentCategories: (doc.categories || []).map((category) => category?.title).filter(Boolean),
        targetCategories: target.categories,
        practiceArea: target.practiceArea,
        topicType: target.topicType,
        sensitivity: target.sensitivity,
        authorBefore: doc.authorName || doc.authorId || "",
        hasBody: doc.hasBody,
        bodyBlocks: doc.bodyBlocks,
        hasImage: doc.hasImage,
        hasAlt: doc.hasAlt,
        hasSeoTitle: Boolean(doc.seoTitle),
        hasMetaDescription: Boolean(doc.metaDescription),
        hasCanonical: Boolean(doc.canonical),
        lawFirmApproved: doc.lawFirmApproved
      };
    })
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
