import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-02-19" });

const AUTHOR_SLUG = "charles-chukwuma-nkwoka";
const AUTHOR_NAME = "Charles Chukwuma Nkwoka, Esq.";

const categories = {
  cac: "category.cac-company-registration-and-corporate-compliance",
  corporate: "category.corporate-and-commercial-law",
  tenancy: "category.tenancy-landlord-and-eviction",
  propertyTenancy: "category.property-and-tenancy-law",
  realEstate: "category.real-estate-and-property-law",
  title: "category.property-title-and-perfection",
  ownership: "category.land-ownership-title-and-registration",
  notary: "category.notary-and-legal-documentation",
  authentication: "category.notary-affidavits-and-document-authentication",
  debt: "category.debt-recovery",
  debtEnforcement: "category.debt-recovery-and-enforcement",
};

const selected = [
  {
    slug: "cac-public-search-guide-nigeria",
    title: "How to Use CAC Public Search in Nigeria",
    excerpt:
      "A practical guide to using CAC public search to verify Nigerian company information, check business records, and know when deeper legal due diligence is needed.",
    seoTitle: "How to Use CAC Public Search in Nigeria | Chaman Law Firm",
    seoDescription:
      "Learn how CAC public search helps verify Nigerian company information, what it can and cannot prove, and when to request legal due diligence.",
    keywords: ["CAC public search Nigeria", "company verification Nigeria", "corporate due diligence", "business registration search"],
    categoryRefs: [categories.corporate, categories.cac],
    imageAlt: "CAC public search and Nigerian company verification guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/corporate-commercial-law",
    body: [
      ["h2", "How to Use CAC Public Search in Nigeria"],
      [
        "normal",
        "Quick answer: CAC public search can help confirm basic company or business-name information in Nigeria, but it should not be treated as a complete legal due diligence report. Company status, ownership, filings, charges, authority to sign, and transaction risk may require deeper legal review.",
      ],
      [
        "normal",
        "This article is public legal education. CAC search interfaces, filing requirements, and available records can change, so users should verify current information directly and obtain legal advice before relying on a search result for a transaction.",
      ],
      ["h2", "What CAC public search can help you check"],
      ["bullet", "Whether a company, business name, or incorporated trustee appears in public CAC records."],
      ["bullet", "The registered name and registration number where available."],
      ["bullet", "Whether the entity details match the information supplied by a counterparty."],
      ["bullet", "Whether further corporate documentation should be requested before a contract, investment, loan, or property transaction."],
      ["h2", "What CAC public search does not replace"],
      [
        "normal",
        "A public search result does not by itself confirm that a person has authority to bind the company, that filings are up to date, that shares are correctly held, or that there are no disputes, restrictions, debts, charges, or regulatory issues.",
      ],
      ["h2", "Documents to request after a search"],
      ["bullet", "Certificate of incorporation or business-name registration details."],
      ["bullet", "Status report or CAC extract where available."],
      ["bullet", "Memorandum and Articles of Association for companies."],
      ["bullet", "Board or shareholder approval where a transaction requires authority."],
      ["bullet", "Evidence that the proposed signatory has authority to act."],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["Before relying on CAC search for a major contract, property transaction, financing, share transfer, or partnership, ask Chaman Law Firm to review the documents and authority trail. See ", null],
          ["Corporate & Commercial Law", "/practice-areas/corporate-commercial-law"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "types-of-tenant-in-nigeria",
    title: "Types of Tenants in Nigeria",
    excerpt:
      "A clear guide to common tenancy categories in Nigeria, why the tenancy type matters, and how landlords and tenants can reduce disputes.",
    seoTitle: "Types of Tenants in Nigeria | Chaman Law Firm",
    seoDescription:
      "Understand common types of tenants in Nigeria, including fixed-term and periodic tenancies, and why tenancy classification affects notices and rights.",
    keywords: ["types of tenants in Nigeria", "tenancy law Nigeria", "landlord tenant rights", "fixed tenancy", "periodic tenancy"],
    categoryRefs: [categories.propertyTenancy, categories.tenancy, categories.realEstate],
    imageAlt: "Types of tenants in Nigeria legal guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/property-real-estate-law",
    body: [
      ["h2", "Types of Tenants in Nigeria"],
      [
        "normal",
        "Quick answer: The type of tenancy affects rent obligations, notice requirements, renewal rights, recovery of possession, and dispute strategy. The label used by the parties is helpful, but the agreement, rent pattern, conduct, and applicable state law must be reviewed.",
      ],
      [
        "normal",
        "This article is general legal education. Tenancy law and recovery-of-premises procedure can differ by state and by the facts of the tenancy.",
      ],
      ["h2", "Common tenancy categories"],
      ["bullet", "Fixed-term tenancy: occupation for a defined period under agreed terms."],
      ["bullet", "Periodic tenancy: occupation renewed by rent period, such as weekly, monthly, quarterly, or yearly."],
      ["bullet", "Tenancy at will: occupation that may be ended by either party, usually where no fixed term has been agreed."],
      ["bullet", "Licence or permissive occupation: permission to use premises without full tenancy rights, depending on the facts."],
      ["bullet", "Commercial tenancy: occupation for business use, often requiring more detailed clauses on use, repairs, access, and compliance."],
      ["h2", "Why classification matters"],
      [
        "normal",
        "A landlord who misclassifies a tenancy may serve the wrong notice or start the wrong process. A tenant who misunderstands the arrangement may miss deadlines or fail to preserve evidence. Written agreements, payment records, receipts, and communications are important.",
      ],
      ["h2", "Practical checklist"],
      ["bullet", "Keep a signed tenancy agreement where possible."],
      ["bullet", "Keep rent receipts and proof of payments."],
      ["bullet", "Confirm the rent period and expiry date."],
      ["bullet", "Do not rely on self-help eviction or force."],
      ["bullet", "Seek legal advice before serving or responding to notices."],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["If a tenancy is disputed, rent is unpaid, notices are being served, or possession is being recovered, seek legal guidance. See ", null],
          ["Property and Real Estate Law", "/practice-areas/property-real-estate-law"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "how-to-change-name-with-deed-poll",
    title: "How to Change Name with Deed Poll in Nigeria",
    excerpt:
      "A practical legal-education guide to name change by deed poll in Nigeria, supporting documents, publication steps, and record updates.",
    seoTitle: "How to Change Name with Deed Poll in Nigeria | Chaman Law Firm",
    seoDescription:
      "Learn the general process for changing a name with deed poll in Nigeria, including documentation, publication, and when to seek legal help.",
    keywords: ["deed poll Nigeria", "change name with deed poll", "name change Nigeria", "legal documentation Nigeria"],
    categoryRefs: [categories.notary, categories.authentication],
    imageAlt: "Name change by deed poll in Nigeria legal documentation guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/notary-public",
    body: [
      ["h2", "How to Change Name with Deed Poll in Nigeria"],
      [
        "normal",
        "Quick answer: A deed poll is a formal document used to record that a person has adopted a new name. In Nigeria, the process commonly involves preparing the deed poll, supporting it with identification, making any required affidavit or publication, and updating official records.",
      ],
      [
        "normal",
        "This article is public legal education. Requirements may differ depending on the purpose of the name change, the institution involved, and the records to be updated.",
      ],
      ["h2", "Common reasons for name change"],
      ["bullet", "Marriage, divorce, or family-related change."],
      ["bullet", "Correction or standardisation of names across official records."],
      ["bullet", "Religious, personal, or professional reasons."],
      ["bullet", "Need to align bank, passport, school, employment, or property records."],
      ["h2", "General documents to prepare"],
      ["bullet", "Valid identification and existing records showing the former name."],
      ["bullet", "Draft deed poll prepared in the correct form."],
      ["bullet", "Affidavit or declaration where required."],
      ["bullet", "Newspaper publication or gazette-related step where required by the receiving institution."],
      ["bullet", "Evidence needed by banks, schools, immigration authorities, employers, or land registries."],
      ["h2", "Why legal review matters"],
      [
        "normal",
        "A name change can affect bank records, land documents, company records, immigration files, academic certificates, and family records. Legal review helps avoid inconsistent documents and future verification problems.",
      ],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["For deed poll drafting, affidavits, notarisation, and record update support, see ", null],
          ["Notary Public", "/practice-areas/notary-public"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "ways-to-prove-ownership-of-land",
    title: "Five Ways to Prove Ownership of Land in Nigeria",
    excerpt:
      "A property-law guide to evidence commonly used to prove land ownership in Nigeria, including title documents, acts of ownership and possession.",
    seoTitle: "Five Ways to Prove Ownership of Land in Nigeria | Chaman Law Firm",
    seoDescription:
      "Learn common ways to prove land ownership in Nigeria and why title verification, documents, possession, and legal advice matter.",
    keywords: ["prove ownership of land Nigeria", "land title documents", "property verification Nigeria", "land ownership evidence"],
    categoryRefs: [categories.title, categories.ownership, categories.realEstate],
    imageAlt: "Ways to prove ownership of land in Nigeria legal guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/property-real-estate-law",
    body: [
      ["h2", "Five Ways to Prove Ownership of Land in Nigeria"],
      [
        "normal",
        "Quick answer: Land ownership in Nigeria is usually proved by a combination of documents, history, possession, acts of ownership, and surrounding evidence. No single document should be accepted blindly without verification.",
      ],
      [
        "normal",
        "This article is general legal education. Land title and proof of ownership depend on state law, family/community history, registry searches, survey records, possession, and the facts of the transaction or dispute.",
      ],
      ["h2", "Common evidence used to prove ownership"],
      ["bullet", "Registered title documents, including relevant grants, deeds, certificates, consents, or registry records."],
      ["bullet", "Traditional history or root of title, especially for family or community land."],
      ["bullet", "Acts of ownership, such as development, leasing, farming, fencing, or exercising control over the land."],
      ["bullet", "Long and peaceful possession, supported by credible evidence."],
      ["bullet", "Survey plans, payment records, receipts, correspondence, witness evidence, and adjoining land evidence."],
      ["h2", "Why verification is essential"],
      [
        "normal",
        "A document can look genuine but still fail if the seller had no authority, the land is under acquisition, the survey overlaps another land, consent was missing, or the root of title is defective. Buyers should verify before paying.",
      ],
      ["h2", "Practical property checklist"],
      ["bullet", "Confirm the seller's authority and identity."],
      ["bullet", "Conduct registry, survey, and acquisition checks."],
      ["bullet", "Review family or community consent where relevant."],
      ["bullet", "Inspect the land and ask about possession or disputes."],
      ["bullet", "Document the transaction properly before completion."],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["Before buying land, defending title, or responding to encroachment, seek property-law advice. See ", null],
          ["Property and Real Estate Law", "/practice-areas/property-real-estate-law"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "how-to-notarize-a-document-in-nigeria",
    title: "How to Notarize a Document in Nigeria",
    excerpt:
      "A practical guide to notarising documents in Nigeria, when notarisation may be required, and what to prepare before meeting a Notary Public.",
    seoTitle: "How to Notarize a Document in Nigeria | Chaman Law Firm",
    seoDescription:
      "Learn what notarisation means in Nigeria, when documents may need a Notary Public, and what to prepare before notarising a document.",
    keywords: ["notarize document Nigeria", "Notary Public Nigeria", "document authentication", "affidavit notarisation"],
    categoryRefs: [categories.notary, categories.authentication],
    imageAlt: "How to notarize a document in Nigeria | Chaman Law Firm",
    practiceHref: "/practice-areas/notary-public",
    body: [
      ["h2", "How to Notarize a Document in Nigeria"],
      [
        "normal",
        "Quick answer: Notarisation is a formal process where a Notary Public verifies identity, witnessing, signature, copy, or document execution for a purpose that may require formal authentication.",
      ],
      [
        "normal",
        "This article is public legal education. The exact requirement depends on the document type, receiving institution, country of use, and whether further authentication or legalisation is needed.",
      ],
      ["h2", "Documents commonly notarised"],
      ["bullet", "Affidavits, declarations, and statutory documents."],
      ["bullet", "Powers of attorney and authorisation letters."],
      ["bullet", "Certified true copies of documents."],
      ["bullet", "Corporate documents for banks, embassies, institutions, or transactions."],
      ["bullet", "Documents intended for overseas use, subject to the receiving country's requirements."],
      ["h2", "What to bring"],
      ["bullet", "Original document and any required copies."],
      ["bullet", "Valid identification."],
      ["bullet", "Instruction from the receiving institution, if any."],
      ["bullet", "Evidence of authority where signing for a company or another person."],
      ["h2", "Important caution"],
      [
        "normal",
        "Notarisation does not cure a false document or defective transaction. The Notary Public may refuse a request where identity, authority, document authenticity, or legal purpose is unclear.",
      ],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["For notarisation, affidavits, document authentication, or international document use, see ", null],
          ["Notary Public", "/practice-areas/notary-public"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "the-statutory-right-of-occupancy-in-nigeria",
    title: "Statutory Right of Occupancy in Nigeria",
    excerpt:
      "A clear guide to statutory right of occupancy in Nigeria, how it relates to land control, title documents, and property due diligence.",
    seoTitle: "Statutory Right of Occupancy in Nigeria | Chaman Law Firm",
    seoDescription:
      "Understand statutory right of occupancy in Nigeria, its role under land law, and why title verification matters before land transactions.",
    keywords: ["statutory right of occupancy Nigeria", "Land Use Act", "Certificate of Occupancy", "property title Nigeria"],
    categoryRefs: [categories.title, categories.ownership, categories.realEstate],
    imageAlt: "Statutory right of occupancy in Nigeria legal guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/property-real-estate-law",
    body: [
      ["h2", "Statutory Right of Occupancy in Nigeria"],
      [
        "normal",
        "Quick answer: A statutory right of occupancy is an interest in land granted or recognised under Nigeria's land administration framework. It is central to many property transactions, but it must still be verified against registry records, survey records, consent requirements, and the facts of the land.",
      ],
      [
        "normal",
        "This article is general legal education. Land rights are technical and state practice can differ, so buyers, sellers, developers, lenders, and families should obtain legal advice before relying on title documents.",
      ],
      ["h2", "Why statutory right of occupancy matters"],
      ["bullet", "It helps define lawful occupation or control of land."],
      ["bullet", "It may support applications for title documents or perfection."],
      ["bullet", "It affects sale, mortgage, development, lease, inheritance, and dispute strategy."],
      ["bullet", "It can be affected by acquisition, revocation, consent, encumbrance, or competing claims."],
      ["h2", "Documents and checks to review"],
      ["bullet", "Certificate of Occupancy or other grant documents where available."],
      ["bullet", "Deed of assignment, consent, receipts, and transaction history."],
      ["bullet", "Survey plan and charting/acquisition status."],
      ["bullet", "Possession, development, family consent, and dispute history."],
      ["h2", "Practical caution"],
      [
        "normal",
        "A title document should be investigated, not merely collected. The history behind the title, the authority of the seller, the survey position, and any government acquisition issue may determine whether the transaction is safe.",
      ],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["For title verification, Certificate of Occupancy review, Governor's Consent, or land due diligence, see ", null],
          ["Property and Real Estate Law", "/practice-areas/property-real-estate-law"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "transfer-of-company-shares-in-nigeria",
    title: "Transfer of Company Shares in Nigeria",
    excerpt:
      "A corporate-law guide to share transfers in Nigeria, including authority checks, company records, approvals, and documentation.",
    seoTitle: "Transfer of Company Shares in Nigeria | Chaman Law Firm",
    seoDescription:
      "Learn the general legal steps and documents involved in transferring company shares in Nigeria, and why corporate-law review matters.",
    keywords: ["transfer of company shares Nigeria", "share transfer Nigeria", "corporate law Nigeria", "company records"],
    categoryRefs: [categories.corporate, categories.cac],
    imageAlt: "Transfer of company shares in Nigeria legal guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/corporate-commercial-law",
    body: [
      ["h2", "Transfer of Company Shares in Nigeria"],
      [
        "normal",
        "Quick answer: A share transfer should confirm the seller's title to the shares, company restrictions, approvals, payment terms, filings, and updates to company records. The company's constitution, shareholders' arrangements, and applicable law should be reviewed before completion.",
      ],
      [
        "normal",
        "This article is general legal education. Share transfers can vary depending on the company type, articles, shareholder agreements, regulatory requirements, and the facts of the transaction.",
      ],
      ["h2", "Core issues to check"],
      ["bullet", "Whether the transferor actually owns the shares."],
      ["bullet", "Whether the company's articles or shareholders' agreement restrict transfer."],
      ["bullet", "Whether board, shareholder, regulatory, or third-party consent is required."],
      ["bullet", "Whether the consideration, tax, stamp duty, or filing requirements have been addressed."],
      ["bullet", "Whether the company's register and statutory records will be updated."],
      ["h2", "Common documents"],
      ["bullet", "Share transfer instrument or agreement."],
      ["bullet", "Board/shareholder resolutions where required."],
      ["bullet", "Share certificate or evidence of shareholding."],
      ["bullet", "Corporate approvals and identity documents."],
      ["bullet", "Updated company records and CAC-related filings where required."],
      ["h2", "Why legal review matters"],
      [
        "normal",
        "A poorly documented share transfer can create disputes over ownership, voting rights, dividends, control, warranties, and authority. Legal review helps align transaction documents with company records and regulatory expectations.",
      ],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["For share-transfer documentation, company-record review, or corporate transaction support, see ", null],
          ["Corporate & Commercial Law", "/practice-areas/corporate-commercial-law"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
  {
    slug: "statute-of-limitations-on-debt-in-nigeria",
    title: "Statute of Limitations on Debt in Nigeria",
    excerpt:
      "A debt-recovery guide explaining why limitation periods matter, why facts and documents must be reviewed, and when creditors should act quickly.",
    seoTitle: "Statute of Limitations on Debt in Nigeria | Chaman Law Firm",
    seoDescription:
      "Understand why limitation periods matter in Nigerian debt recovery and why creditors should review documents and act before claims become time-barred.",
    keywords: ["statute of limitations on debt Nigeria", "debt recovery Nigeria", "limitation period debt", "recover unpaid debt"],
    categoryRefs: [categories.debt, categories.debtEnforcement],
    imageAlt: "Statute of limitations on debt in Nigeria legal guidance | Chaman Law Firm",
    practiceHref: "/practice-areas/debt-recovery",
    body: [
      ["h2", "Statute of Limitations on Debt in Nigeria"],
      [
        "normal",
        "Quick answer: A debt claim may become difficult or impossible to enforce if it is filed after the applicable limitation period. The correct period depends on the nature of the debt, documents, dates, acknowledgments, part-payments, applicable state law, and the cause of action.",
      ],
      [
        "normal",
        "This article is public legal education. Do not assume a debt is enforceable or time-barred without a lawyer reviewing the documents and timeline.",
      ],
      ["h2", "Why limitation periods matter"],
      ["bullet", "They can affect whether a creditor can sue successfully."],
      ["bullet", "They may influence negotiation, settlement, demand letters, and litigation strategy."],
      ["bullet", "They require careful review of the agreement, invoice, repayment date, acknowledgment, and payment history."],
      ["bullet", "They can differ depending on the kind of claim and applicable law."],
      ["h2", "Documents to gather"],
      ["bullet", "Loan agreement, supply contract, invoice, purchase order, or acknowledgment."],
      ["bullet", "Bank statements, receipts, payment records, and part-payment evidence."],
      ["bullet", "Demand letters, emails, WhatsApp messages, and settlement communications."],
      ["bullet", "Security documents, guarantees, cheques, or collateral records."],
      ["h2", "Practical warning for creditors"],
      [
        "normal",
        "Delay can weaken debt recovery. Creditors should review debts early, identify limitation risk, preserve evidence, and choose a recovery strategy before the claim becomes harder to enforce.",
      ],
      ["h2", "When to speak with a lawyer"],
      [
        "link",
        [
          ["For debt review, demand letters, negotiation, litigation, or enforcement planning, see ", null],
          ["Debt Recovery", "/practice-areas/debt-recovery"],
          [" or ", null],
          ["book a consultation", "/consultation"],
          [".", null],
        ],
      ],
    ],
  },
];

let keyCounter = 0;

function nextKey(prefix) {
  keyCounter += 1;
  return `${prefix}-${keyCounter}`;
}

function block(style, text) {
  return {
    _type: "block",
    _key: nextKey("block"),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: nextKey("span"), marks: [], text }],
  };
}

function bullet(text) {
  return {
    _type: "block",
    _key: nextKey("bullet"),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: nextKey("span"), marks: [], text }],
  };
}

function linked(parts) {
  const markDefs = [];
  const children = parts.map(([text, href]) => {
    const span = { _type: "span", _key: nextKey("span"), marks: [], text };

    if (href) {
      const linkKey = nextKey("link");
      markDefs.push({ _type: "link", _key: linkKey, href });
      span.marks = [linkKey];
    }

    return span;
  });

  return {
    _type: "block",
    _key: nextKey("linked"),
    style: "normal",
    markDefs,
    children,
  };
}

function portableBody(items) {
  keyCounter = 0;
  return items.map(([style, value]) => {
    if (style === "bullet") return bullet(value);
    if (style === "link") return linked(value);
    return block(style, value);
  });
}

function categoryRef(id) {
  return { _type: "reference", _key: nextKey("category"), _ref: id };
}

function faq(slug, index, question, answer) {
  return {
    _key: `${slug}-faq-${index}`,
    question,
    answer,
  };
}

function faqsFor(article) {
  return [
    faq(article.slug, 1, `What is the key point in ${article.title}?`, article.body[1][1]),
    faq(
      article.slug,
      2,
      "Is this article legal advice?",
      "No. It is public legal education. A lawyer should review the facts, documents and deadlines before advice is applied to a specific matter."
    ),
    faq(
      article.slug,
      3,
      "When should I contact Chaman Law Firm?",
      "Contact the firm before taking legal steps, signing documents, serving notices, filing claims, completing transactions, or relying on documents that may affect your rights."
    ),
  ];
}

function assertSafe(article) {
  const haystack = JSON.stringify(article).toLowerCase();
  const banned = [
    "chaman properties",
    "chamanproperties",
    "luxury estate",
    "luxury estates",
    "luxury homes",
    "placeholder",
    "lorem",
    "todo",
    "chamanlawfirm@gmail.com",
    "08065553671",
    "nigerian lawyers centre",
  ];
  const found = banned.filter((term) => haystack.includes(term));

  if (found.length) {
    throw new Error(`${article.slug} contains blocked terms: ${found.join(", ")}`);
  }
}

async function main() {
  selected.forEach(assertSafe);

  const author = await client.fetch(
    '*[_type == "author" && slug.current == $slug][0] { _id, name }',
    { slug: AUTHOR_SLUG }
  );

  if (!author?._id) throw new Error(`Author not found: ${AUTHOR_SLUG}`);

  const existing = await client.fetch(
    '*[_type == "post" && slug.current in $slugs] { _id, title, "slug": slug.current, publishedAt, mainImage }',
    { slugs: selected.map((article) => article.slug) }
  );
  const bySlug = new Map(existing.map((doc) => [doc.slug, doc]));
  let tx = client.transaction();

  if (author.name !== AUTHOR_NAME) {
    tx = tx.patch(author._id, { set: { name: AUTHOR_NAME } });
  }

  for (const article of selected) {
    const doc = bySlug.get(article.slug);

    if (!doc) throw new Error(`Missing Sanity post for ${article.slug}`);
    if (!doc.publishedAt) throw new Error(`${article.slug} is missing publishedAt`);
    if (new Date(doc.publishedAt).getTime() > Date.now()) throw new Error(`${article.slug} is future dated`);
    if (!doc.mainImage?.asset?._ref) throw new Error(`${article.slug} is missing image`);

    keyCounter = 0;
    tx = tx.patch(doc._id, {
      set: {
        title: article.title,
        excerpt: article.excerpt,
        author: { _type: "reference", _ref: author._id },
        categories: article.categoryRefs.map(categoryRef),
        tags: article.keywords,
        mainImage: {
          ...doc.mainImage,
          alt: article.imageAlt,
        },
        seo: {
          metaTitle: article.seoTitle,
          metaDescription: article.seoDescription,
          canonicalUrl: `https://chamanlawfirm.com/resources/blog/${article.slug}`,
          noIndex: false,
          keywords: article.keywords,
        },
        body: portableBody(article.body),
        faqs: faqsFor(article),
        lawFirmApproved: true,
      },
    });
  }

  const result = await tx.commit({ autoGenerateArrayKeys: true });
  console.log(JSON.stringify({
    approved: selected.map((article) => article.slug),
    transactionId: result.transactionId,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
