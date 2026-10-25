import type { BlogPost } from "@/lib/types";

function block(key: string, style: "normal" | "h2" | "h3", text: string) {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-text`, marks: [], text }]
  };
}

function bullet(key: string, text: string) {
  return {
    ...block(key, "normal", text),
    listItem: "bullet",
    level: 1
  };
}

function linkedBlock(key: string, before: string, label: string, href: string, after = "") {
  const markKey = `${key}-link`;
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [{ _type: "link", _key: markKey, href }],
    children: [
      { _type: "span", _key: `${key}-before`, marks: [], text: before },
      { _type: "span", _key: `${key}-label`, marks: [markKey], text: label },
      { _type: "span", _key: `${key}-after`, marks: [], text: after }
    ]
  };
}

const cacPublicSearchExpansion: Array<Record<string, unknown>> = [
  block("cac-official-search-heading", "h2", "Official CAC public search link and what it covers"),
  linkedBlock(
    "cac-official-search-link",
    "Use the ",
    "official CAC Public Search portal",
    "https://icrp.cac.gov.ng/public-search/",
    ". It allows a preliminary search for registered companies, business names, incorporated trustees and other entities using an entity name, RC or registration number, or an availability code (AV code)."
  ),
  block(
    "cac-official-warning",
    "normal",
    "Use only an official cac.gov.ng or icrp.cac.gov.ng address. A search result from an unofficial directory, social-media profile or document supplied by a counterparty should not replace an independent CAC check."
  ),

  block("cac-step-heading", "h2", "How to carry out a CAC public search step by step"),
  bullet("cac-step-1", "Open the official CAC Public Search portal."),
  bullet("cac-step-2", "Choose the available search option that best matches the information you have: entity name, RC or registration number, or AV code."),
  bullet("cac-step-3", "Enter the exact information. Where you are searching by name, try the complete registered name and check spelling, abbreviations and suffixes such as Limited or Ltd."),
  bullet("cac-step-4", "Compare the displayed entity name, registration number, entity type and status information with the documents supplied to you."),
  bullet("cac-step-5", "Record the result and request supporting corporate documents before paying money, signing a major contract, acquiring shares or completing a property transaction."),

  block("cac-no-result-heading", "h2", "What to do when the search shows no result"),
  bullet("cac-no-result-1", "Check the spelling and remove unnecessary punctuation or trading descriptions."),
  bullet("cac-no-result-2", "Search with the registration number if it appears on the entity's certificate or correspondence."),
  bullet("cac-no-result-3", "Confirm whether the organisation is a company, business name, incorporated trustee, limited partnership or limited liability partnership."),
  bullet("cac-no-result-4", "Do not treat a missing result as conclusive proof that the entity does not exist; portal records, spelling and historical filings may require a deeper search or direct CAC enquiry."),

  block("cac-result-heading", "h2", "How to interpret a CAC search result"),
  block(
    "cac-result-text",
    "normal",
    "A matching record is useful preliminary evidence that an entity appears in the public registry. It is not, by itself, proof that the person negotiating with you is a director, shareholder, proprietor, trustee or authorised signatory. It also does not establish that the entity owns a particular property, has no liabilities, has filed every annual return, or has authority for a specific transaction."
  ),
  bullet("cac-result-check-1", "Registered name: it should match the name appearing on the proposed contract and corporate documents."),
  bullet("cac-result-check-2", "Registration number: compare every digit with the certificate, status report and invoices."),
  bullet("cac-result-check-3", "Entity type: a business name is legally different from a limited company, incorporated trustee, LLP or LP."),
  bullet("cac-result-check-4", "Status and filing information: investigate any inconsistency, inactivity indication or unexplained recent change before proceeding."),

  block("cac-status-heading", "h2", "Public search, E-Status Report and full due diligence are different"),
  block(
    "cac-status-text",
    "normal",
    "The CAC states that its E-Status Report replaced older registration forms such as CAC 1.1, BN 1 and IT Form 1 for newly registered entities. For a material transaction, request a recent Status Report or appropriate certified records rather than relying only on a free public-search screen."
  ),
  linkedBlock(
    "cac-status-link",
    "See the CAC's official explanation of the ",
    "E-Status Report",
    "https://icrp.cac.gov.ng/sublink/e-status-report/",
    "."
  ),
  bullet("cac-doc-1", "Certificate of incorporation or registration."),
  bullet("cac-doc-2", "Recent CAC Status Report or certified extract, where appropriate."),
  bullet("cac-doc-3", "Memorandum and Articles of Association for a company."),
  bullet("cac-doc-4", "Evidence of directors, shareholders, proprietors, trustees or partners relevant to the transaction."),
  bullet("cac-doc-5", "Board, shareholder, trustee or partner authority for the proposed transaction."),
  bullet("cac-doc-6", "Evidence that annual returns and material post-incorporation changes have been filed."),

  block("cac-beneficial-heading", "h2", "Check beneficial ownership where control matters"),
  linkedBlock(
    "cac-beneficial-link",
    "For transactions where ownership or control is material, also consult Nigeria's official ",
    "Beneficial Ownership Register",
    "https://bor.cac.gov.ng/",
    ". It provides information concerning Persons with Significant Control and can be searched using a company name, RC number or PSC name."
  ),
  block(
    "cac-beneficial-limit",
    "normal",
    "Beneficial-ownership information should be compared with the company's current corporate records and the transaction documents. Complex ownership chains, nominees, trusts or recent share changes may require a formal legal review."
  ),

  block("cac-red-flags-heading", "h2", "CAC verification red flags that require further investigation"),
  bullet("cac-red-flag-1", "The entity name or registration number does not match the proposed contract, bank account or invoice."),
  bullet("cac-red-flag-2", "The person signing refuses to provide evidence of appointment or authority."),
  bullet("cac-red-flag-3", "The counterparty supplies only screenshots and discourages an independent search."),
  bullet("cac-red-flag-4", "The entity type is misrepresented, for example a business name presented as a limited-liability company."),
  bullet("cac-red-flag-5", "There are unexplained changes in directors, shareholders, registered address, share capital or beneficial ownership."),
  bullet("cac-red-flag-6", "Payment is requested into an unrelated personal or third-party account without a documented explanation."),

  block("cac-transaction-heading", "h2", "When a public search is not enough"),
  block(
    "cac-transaction-text",
    "normal",
    "Obtain enhanced corporate due diligence before acquiring shares, investing, granting credit, entering a joint venture, buying property from a company, accepting a corporate guarantee, appointing a major contractor or transferring substantial funds. The review should confirm the entity's legal existence, ownership and control, decision-making authority, filings, charges and transaction-specific approvals."
  ),
  linkedBlock(
    "cac-legal-support",
    "Chaman Law Firm can conduct the corporate-document and authority review required for a proposed transaction. See our ",
    "Corporate and Commercial Law services",
    "/practice-areas/corporate-commercial-law",
    " or book a formal consultation before relying on the documents."
  ),

  block("cac-source-heading", "h2", "Official sources and update note"),
  block(
    "cac-source-note",
    "normal",
    "This guide was substantively reviewed against the Corporate Affairs Commission's official Public Search, Company Search, E-Status Report and Beneficial Ownership Register resources on 25 October 2026. CAC interfaces and available records can change, so confirm the current portal position before completing a transaction."
  )
];

const cacFaqs = [
  {
    question: "What is the official CAC public search website?",
    answer: "The official public-search portal is https://icrp.cac.gov.ng/public-search/. Confirm that the address belongs to cac.gov.ng before entering or relying on information."
  },
  {
    question: "Can I search CAC records with an RC number?",
    answer: "Yes. The official portal supports searches using an entity name, RC or registration number, or an AV code, depending on the information available."
  },
  {
    question: "Does a CAC public-search result prove that a company is safe to transact with?",
    answer: "No. It is a preliminary registry check. It does not prove authority to sign, ownership of an asset, absence of liabilities, regulatory compliance or the commercial safety of a transaction."
  },
  {
    question: "What is a CAC E-Status Report?",
    answer: "CAC introduced the E-Status Report as the registration-information format replacing older forms such as CAC 1.1, BN 1 and IT Form 1 for newly registered entities."
  },
  {
    question: "When should I obtain a lawyer's corporate due-diligence report?",
    answer: "Obtain one before a substantial investment, share acquisition, joint venture, corporate property purchase, secured lending, guarantee, major contract or other transaction where ownership, authority and corporate compliance matter."
  }
];

export function enhanceBlogPost(post: BlogPost): BlogPost {
  if (post.slug !== "cac-public-search-guide-nigeria") return post;

  return {
    ...post,
    title: "How to Use CAC Public Search in Nigeria (2026 Guide)",
    excerpt: "Use the official CAC public search to verify a Nigerian company or business, interpret the result, check beneficial ownership, identify red flags, and know when enhanced legal due diligence is required.",
    updatedAt: "2026-10-25T00:00:00.000Z",
    readingTime: "7 min read",
    body: [...post.body, ...cacPublicSearchExpansion],
    seo: {
      ...post.seo,
      title: "CAC Public Search Nigeria: Verify a Company (2026)",
      description: "Use CAC public search in Nigeria to verify a company, check an RC number, review beneficial ownership and identify when full due diligence is required.",
      keywords: Array.from(new Set([
        ...(post.seo?.keywords || []),
        "CAC public search",
        "CAC company search Nigeria",
        "verify company in Nigeria",
        "CAC RC number search",
        "CAC status report",
        "Nigeria beneficial ownership register"
      ]))
    },
    faqs: cacFaqs
  };
}
