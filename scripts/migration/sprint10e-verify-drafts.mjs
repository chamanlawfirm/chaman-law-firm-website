import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-05-17" }).withConfig({ perspective: "raw" });

const docs = await client.fetch(
  '*[_id in $ids]{_id, _type, title, "slug": slug.current, lawFirmApproved, "author": author->_id, "bodyBlocks": count(body), "canonical": seo.canonicalUrl}',
  {
    ids: [
      "drafts.chamanlawfirm.sprint10e.4-steps-on-how-to-deal-with-a-bad-landlordin",
      "drafts.chamanlawfirm.sprint10e.joinder-of-parties-misjoinder-of-parties",
      "drafts.chamanlawfirm.sprint10e.gain-nigerian-citizenship-by-marriage",
      "drafts.chamanlawfirm.sprint10e.statutory-right-of-occupancy-vs-customary-right",
      "drafts.chamanlawfirm.sprint10e.5-steps-on-how-to-obtain-restraining-order",
      "drafts.chamanlawfirm.sprint10e.what-are-elements-of-tax-law",
      "drafts.chamanlawfirm.sprint10e.tax-administration-in-nigeria",
      "drafts.chamanlawfirm.sprint10e.difference-between-ownership-and-possession",
      "drafts.chamanlawfirm.sprint10e.community-development-associations-law",
      "drafts.chamanlawfirm.sprint10e.child-support-and-maintenance-payment",
      "drafts.chamanlawfirm.sprint10e.how-to-replace-a-lost-a-marriage-certificate",
      "drafts.chamanlawfirm.sprint10e.legal-steps-to-take-when-our-land-has-been",
      "drafts.chamanlawfirm.sprint10e.rights-of-tenants-in-ogun-chaman-law-firm",
      "drafts.chamanlawfirm.sprint10e.5-vital-role-of-consumer-protection-agencies",
      "drafts.chamanlawfirm.sprint10e.what-is-the-implication-of-quit-notice",
      "drafts.chamanlawfirm.sprint10e.polygamy-and-multiple-marriages-in-nigeria",
      "drafts.chamanlawfirm.sprint10e.steps-to-permanent-residency-in-nigeria",
      "drafts.chamanlawfirm.sprint10e.taxation-of-the-construction-sector-in-nigeria",
      "drafts.chamanlawfirm.sprint10e.sharing-of-property-after-divorce-in-nigeria",
      "drafts.chamanlawfirm.sprint10e.challenges-facing-the-nigerian-court-system"
    ]
  }
);

console.log(
  JSON.stringify(
    {
      count: docs.length,
      unapproved: docs.filter((doc) => doc.lawFirmApproved === false).length,
      authorGoverned: docs.filter((doc) => doc.author === "author.charles-chukwuma-nkwoka").length,
      docs
    },
    null,
    2
  )
);
