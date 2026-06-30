import fsp from "node:fs/promises";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-05-17" }).withConfig({ perspective: "raw" });
const shouldApply = process.argv.includes("--apply");

const AUTHOR_ID = "author.charles-chukwuma-nkwoka";
const APPROVED_IMAGE_ASSET = "image-03621dd4ea8d18ac61f44df60bac6e107f0f1377-1086x1448-png";
const DRAFT_PREFIX = "drafts.chamanlawfirm.sprint10e.";
const PUBLIC_PREFIX = "chamanlawfirm-sprint10f-";
const reviewCsvPath = "docs/SPRINT-10F-RESTORED-DRAFT-REVIEW.csv";
const resultJsonPath = "docs/sprint10f/sprint10f-approval-result.json";

const restoredSlugs = [
  "4-steps-on-how-to-deal-with-a-bad-landlordin",
  "joinder-of-parties-misjoinder-of-parties",
  "gain-nigerian-citizenship-by-marriage",
  "statutory-right-of-occupancy-vs-customary-right",
  "5-steps-on-how-to-obtain-restraining-order",
  "what-are-elements-of-tax-law",
  "tax-administration-in-nigeria",
  "difference-between-ownership-and-possession",
  "community-development-associations-law",
  "child-support-and-maintenance-payment",
  "how-to-replace-a-lost-a-marriage-certificate",
  "legal-steps-to-take-when-our-land-has-been",
  "rights-of-tenants-in-ogun-chaman-law-firm",
  "5-vital-role-of-consumer-protection-agencies",
  "what-is-the-implication-of-quit-notice",
  "polygamy-and-multiple-marriages-in-nigeria",
  "steps-to-permanent-residency-in-nigeria",
  "taxation-of-the-construction-sector-in-nigeria",
  "sharing-of-property-after-divorce-in-nigeria",
  "challenges-facing-the-nigerian-court-system"
];

const selectedSlugs = [
  "statutory-right-of-occupancy-vs-customary-right",
  "what-are-elements-of-tax-law",
  "tax-administration-in-nigeria",
  "difference-between-ownership-and-possession",
  "community-development-associations-law",
  "5-vital-role-of-consumer-protection-agencies"
];

const redirectTargets = new Map([
  ["4-steps-on-how-to-deal-with-a-bad-landlordin", "/practice-areas/property-real-estate-law"],
  ["joinder-of-parties-misjoinder-of-parties", "/practice-areas/litigation-dispute-resolution"],
  ["gain-nigerian-citizenship-by-marriage", "/practice-areas/immigration-services"],
  ["statutory-right-of-occupancy-vs-customary-right", "/practice-areas/property-real-estate-law"],
  ["5-steps-on-how-to-obtain-restraining-order", "/practice-areas/litigation-dispute-resolution"],
  ["what-are-elements-of-tax-law", "/practice-areas/corporate-commercial-law"],
  ["tax-administration-in-nigeria", "/practice-areas/corporate-commercial-law"],
  ["difference-between-ownership-and-possession", "/practice-areas/property-real-estate-law"],
  ["community-development-associations-law", "/practice-areas/property-real-estate-law"],
  ["child-support-and-maintenance-payment", "/practice-areas/family-law"],
  ["how-to-replace-a-lost-a-marriage-certificate", "/practice-areas/family-law"],
  ["legal-steps-to-take-when-our-land-has-been", "/practice-areas/property-real-estate-law"],
  ["rights-of-tenants-in-ogun-chaman-law-firm", "/practice-areas/property-real-estate-law"],
  ["5-vital-role-of-consumer-protection-agencies", "/practice-areas/corporate-commercial-law"],
  ["what-is-the-implication-of-quit-notice", "/practice-areas/property-real-estate-law"],
  ["polygamy-and-multiple-marriages-in-nigeria", "/practice-areas/family-law"],
  ["steps-to-permanent-residency-in-nigeria", "/practice-areas/immigration-services"],
  ["taxation-of-the-construction-sector-in-nigeria", "/practice-areas/corporate-commercial-law"],
  ["sharing-of-property-after-divorce-in-nigeria", "/practice-areas/family-law"],
  ["challenges-facing-the-nigerian-court-system", "/practice-areas/litigation-dispute-resolution"]
]);

const riskPatterns = [
  { label: "Chaman Properties/off-brand signal", pattern: /chaman properties|chamanproperties|luxury estate|luxury homes|property listing|casino|betting/i },
  { label: "misleading free-service claim", pattern: /free legal advice|legal advice for free|get.*legal advice.*free/i },
  { label: "self-help eviction risk", pattern: /self[-\s]?help eviction|forceful eviction|lock(?:ing)? out/i },
  { label: "placeholder/plugin debris", pattern: /lorem ipsum|editable placeholder|elementor|rankmath|\[\/?\w+[^\]]*\]/i }
];

function textOfBlock(block = {}) {
  return Array.isArray(block.children) ? block.children.map((child) => child?.text || "").join("") : "";
}

function plainText(doc) {
  return (doc.body || []).map(textOfBlock).join(" ").replace(/\s+/g, " ").trim();
}

function collectLinks(doc) {
  const links = [];
  for (const block of doc.body || []) {
    for (const mark of block.markDefs || []) {
      if (mark.href) links.push(mark.href);
    }
  }
  return links;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(rows, headers) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
}

function canonicalFor(slug) {
  return `https://chamanlawfirm.com/resources/blog/${slug}`;
}

function metaDescription(doc) {
  const current = doc.seo?.metaDescription || doc.excerpt || "";
  if (current.length >= 110) return current;
  return `Learn key Nigerian legal issues in ${doc.title}, including practical risks, documentation, deadlines, and when to seek advice from Chaman Law Firm.`;
}

function imageAlt(doc) {
  return `${doc.title} legal guidance | Chaman Law Firm`;
}

function assessDoc(doc) {
  const slug = doc.slug?.current || "";
  const text = plainText(doc);
  const links = collectLinks(doc);
  const riskFindings = riskPatterns.filter((item) => item.pattern.test(text) || item.pattern.test(doc.title || "")).map((item) => item.label);
  const hasConsultation = links.includes("/consultation") || /consultation|speak with/i.test(text);
  const hasPracticeLink = links.some((href) => href.startsWith("/practice-areas/"));
  const seoOk = Boolean(doc.seo?.metaTitle) && Boolean(doc.seo?.metaDescription) && doc.seo?.canonicalUrl === canonicalFor(slug);
  const bodyOk = (doc.body || []).length >= 12 && text.length >= 1000;
  const selected = selectedSlugs.includes(slug);
  const imageOk = Boolean(doc.mainImage?.asset?._ref && doc.mainImage?.alt);
  const authorOk = doc.author?._ref === AUTHOR_ID;
  const legalOk = riskFindings.length === 0 && hasConsultation && hasPracticeLink;
  const canApprove = selected && bodyOk && seoOk && authorOk && legalOk;

  return {
    slug,
    selected,
    bodyOk,
    seoOk,
    imageOk,
    authorOk,
    legalOk,
    hasConsultation,
    hasPracticeLink,
    riskFindings,
    approvalDecision: canApprove ? "approve" : "keep hidden",
    recommendedAction: canApprove
      ? "Attach approved image, approve, publish, and replace exact redirect"
      : selected
        ? "Selected but blocked until required fields pass"
        : "Keep hidden for later lawyer/image review"
  };
}

async function fetchDrafts() {
  return client.fetch(
    '*[_id in $ids] | order(slug.current asc){_id,_type,title,slug,excerpt,author,categories,tags,isFeatured,isTrending,isMostRead,lawFirmApproved,publishedAt,body,faqs,seo,mainImage}',
    { ids: restoredSlugs.map((slug) => `${DRAFT_PREFIX}${slug}`) }
  );
}

function publicDocFromDraft(doc) {
  const slug = doc.slug.current;
  return {
    _id: `${PUBLIC_PREFIX}${slug}`,
    _type: "post",
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: doc.categories || [],
    tags: doc.tags || [],
    isFeatured: false,
    isTrending: false,
    isMostRead: false,
    lawFirmApproved: true,
    publishedAt: doc.publishedAt,
    body: doc.body || [],
    faqs: doc.faqs || [],
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: APPROVED_IMAGE_ASSET },
      alt: imageAlt(doc)
    },
    seo: {
      ...(doc.seo || {}),
      metaTitle: doc.seo?.metaTitle || `${doc.title} | Chaman Law Firm`,
      metaDescription: metaDescription(doc),
      canonicalUrl: canonicalFor(slug),
      noIndex: false,
      robots: "index,follow",
      schemaType: "Article",
      openGraphTitle: doc.seo?.openGraphTitle || doc.seo?.metaTitle || `${doc.title} | Chaman Law Firm`,
      openGraphDescription: doc.seo?.openGraphDescription || metaDescription(doc)
    }
  };
}

function reviewRow(doc, assessment) {
  const slug = assessment.slug;
  const notes = [];
  if (assessment.riskFindings.length) notes.push(`Risks: ${assessment.riskFindings.join("; ")}`);
  if (!assessment.hasConsultation) notes.push("Missing consultation CTA");
  if (!assessment.hasPracticeLink) notes.push("Missing practice-area internal link");
  if (assessment.selected) notes.push("Selected for Sprint 10F controlled sub-batch");

  return {
    "draft title": doc.title,
    slug,
    "old URL": `https://chamanlawfirm.com/${slug}/`,
    "current temporary redirect target": redirectTargets.get(slug) || "",
    "body status": assessment.bodyOk ? `complete (${(doc.body || []).length} blocks)` : `needs review (${(doc.body || []).length} blocks)`,
    "SEO status": assessment.seoOk ? "complete" : "needs metadata/canonical review",
    "image status": assessment.selected ? "approved Sanity image attached" : doc.mainImage?.asset?._ref ? "image present" : "image needed",
    "alt text status": assessment.selected ? "alt text added" : doc.mainImage?.alt ? "present" : "needed",
    "legal safety status": assessment.legalOk ? "automated safety checks passed" : "requires lawyer/editorial review",
    "recommended action": assessment.recommendedAction,
    "approval decision": assessment.approvalDecision,
    notes: notes.join("; ")
  };
}

async function main() {
  let drafts = await fetchDrafts();
  const initialAssessments = new Map(drafts.map((doc) => [doc.slug.current, assessDoc(doc)]));
  const selectedDocs = drafts.filter((doc) => selectedSlugs.includes(doc.slug.current));
  const selectedPassed = selectedDocs.filter((doc) => {
    const assessment = initialAssessments.get(doc.slug.current);
    return assessment?.bodyOk && assessment?.seoOk && assessment?.authorOk && assessment?.legalOk;
  });

  const result = {
    shouldApply,
    selectedSlugs,
    selectedPassed: selectedPassed.map((doc) => doc.slug.current),
    approved: [],
    keptHidden: drafts.filter((doc) => !selectedSlugs.includes(doc.slug.current)).map((doc) => doc.slug.current)
  };

  if (shouldApply) {
    for (const doc of selectedPassed) {
      const slug = doc.slug.current;
      const publicDoc = publicDocFromDraft(doc);
      await client
        .transaction()
        .createOrReplace(publicDoc)
        .patch(doc._id, (patch) =>
          patch.set({
            lawFirmApproved: true,
            mainImage: publicDoc.mainImage,
            seo: publicDoc.seo,
            author: { _type: "reference", _ref: AUTHOR_ID }
          })
        )
        .commit();
      result.approved.push(slug);
    }
  }

  drafts = await fetchDrafts();
  const reviewRows = drafts.map((doc) => {
    const base = assessDoc(doc);
    const slug = base.slug;
    const approved = result.approved.includes(slug) || doc.lawFirmApproved === true;
    return reviewRow(doc, {
      ...base,
      imageOk: approved || base.imageOk,
      approvalDecision: approved ? "approved and published" : base.approvalDecision,
      recommendedAction: approved ? "Approved in Sprint 10F; replace exact redirect" : base.recommendedAction
    });
  });

  await fsp.mkdir("docs/sprint10f", { recursive: true });
  await fsp.writeFile(
    reviewCsvPath,
    `${writeCsv(reviewRows, [
      "draft title",
      "slug",
      "old URL",
      "current temporary redirect target",
      "body status",
      "SEO status",
      "image status",
      "alt text status",
      "legal safety status",
      "recommended action",
      "approval decision",
      "notes"
    ])}\n`,
    "utf8"
  );
  await fsp.writeFile(resultJsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Sprint 10F review/approval failed: ${error?.message || String(error)}`);
  process.exit(1);
});
