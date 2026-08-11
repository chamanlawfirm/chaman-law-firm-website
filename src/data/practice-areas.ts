import type { Faq } from "@/lib/types";

export type ServicePage = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image?: string;
  imageAlt?: string;
  keyPoints: string[];
  process: string[];
  faqs: Faq[];
};

export type PracticeArea = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  description: string;
  services: string[];
  servicePages: ServicePage[];
  commonIssues: string[];
  whoWeHelp: string[];
  process: string[];
  faqs: Faq[];
  relatedDownloads: string[];
  seoKeywords: string[];
  featured?: boolean;
};

const serviceHeroImages = {
  legalService: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=80",
  firmTeam: "/images/firm/firm-team.jpg",
  managingPartnerOffice: "/images/firm/managing-partner-office.png"
};

const createAuthorityServicePage = (service: ServicePage): ServicePage => service;

type Sprint11tServicePageOptions = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image?: string;
  imageAlt: string;
  keyPoints: string[];
  process: string[];
  faqTopic: string;
  faqAnswer: string;
};

const createSprint11tServicePage = ({
  slug,
  title,
  summary,
  description,
  image = serviceHeroImages.legalService,
  imageAlt,
  keyPoints,
  process,
  faqTopic,
  faqAnswer
}: Sprint11tServicePageOptions): ServicePage =>
  createAuthorityServicePage({
    slug,
    title,
    summary,
    description,
    image,
    imageAlt,
    keyPoints,
    process,
    faqs: [
      {
        question: `Can Chaman Law Firm help with ${faqTopic}?`,
        answer: faqAnswer
      },
      {
        question: "Does this page replace fact-specific legal advice?",
        answer:
          "No. This page gives public legal education and service guidance. The firm reviews the facts and documents before advising on the appropriate legal step."
      }
    ]
  });

const propertyServicePages: ServicePage[] = [
  {
    slug: "property-verification",
    title: "Property Verification",
    summary:
      "Legal checks before committing funds to land, housing, commercial property, or real estate investment in Nigeria, including title, seller authority, survey and transaction-risk review.",
    description:
      "Chaman Law Firm helps buyers and investors review seller authority, title documents, survey information, transaction structure, payment trail, and risk indicators before completion.",
    keyPoints: [
      "Seller identity and authority review",
      "Title document consistency checks",
      "Survey, location, boundary, and acquisition risk review",
      "Written legal advice before payment or completion"
    ],
    process: [
      "Collect title documents, seller details, transaction history, and client objective",
      "Review documentation for consistency, authority, and visible legal risk",
      "Advise on risk level, missing documents, and safer next steps",
      "Support negotiation, documentation, or withdrawal where risk is unacceptable"
    ],
    faqs: [
      {
        question: "Why is property verification important before payment?",
        answer:
          "Verification helps identify title defects, seller-authority problems, documentation gaps, disputes, acquisition risk, and transaction red flags before money changes hands."
      }
    ]
  },
  {
    slug: "property-due-diligence",
    title: "Property Due Diligence",
    summary:
      "Structured property due diligence for buyers, developers, landlords, investors, and diaspora clients, covering title history, approvals, encumbrances, possession and closing risks.",
    description:
      "The firm reviews title chain, approvals, transaction documents, possession issues, encumbrances, litigation risk, and completion steps so clients can make informed property decisions.",
    keyPoints: [
      "Title chain and ownership checks",
      "Approval, consent, and perfection review",
      "Possession, tenancy, and dispute-risk review",
      "Due diligence reporting for local and diaspora clients"
    ],
    process: [
      "Define the transaction and risk questions",
      "Request and organize all relevant documents",
      "Review title, approvals, possession, parties, and payment structure",
      "Deliver advice and action steps before completion"
    ],
    faqs: [
      {
        question: "Can diaspora clients use the firm for due diligence?",
        answer:
          "Yes. Diaspora clients can instruct the firm to review documents, assess legal risks, advise on representation, and guide safe completion steps in Nigeria."
      }
    ]
  },
  {
    slug: "governors-consent",
    title: "Governor's Consent",
    summary:
      "Advisory and documentation guidance for Governor's Consent, perfection of property title, consent-related filings, transaction structure and title regularization risks.",
    description:
      "Chaman Law Firm advises clients on Governor's Consent, perfection requirements, documentation readiness, transaction structure, and risk where property interests require regularization.",
    keyPoints: [
      "Perfection and consent advisory",
      "Document-readiness review",
      "Transaction-structure guidance",
      "Risk advice for unperfected interests"
    ],
    process: [
      "Review title history and transaction documents",
      "Identify perfection status and consent implications",
      "Advise on required documents and government-facing steps",
      "Support documentation and professional coordination"
    ],
    faqs: [
      {
        question: "Is Governor's Consent always required?",
        answer:
          "The need for consent depends on the transaction, title history, applicable law, and perfection status. The firm can review the documents and advise on the proper pathway."
      }
    ]
  },
  {
    slug: "diaspora-property-services",
    title: "Diaspora Property Services",
    summary: "Representation for Nigerians abroad buying, verifying, documenting, protecting, or disputing property in Nigeria.",
    description:
      "The firm assists diaspora clients with property verification, power of attorney, transaction representation, document execution, probate, family-property matters, and dispute prevention.",
    keyPoints: [
      "Remote legal representation for Nigerian property matters",
      "Power of attorney and document execution support",
      "Transaction monitoring and risk reporting",
      "Diaspora probate and family-property support"
    ],
    process: [
      "Confirm the client's country, objective, documents, and urgency",
      "Review authority, title, documents, and representation needs",
      "Advise on power of attorney, execution, and transaction safeguards",
      "Support completion, dispute prevention, or enforcement"
    ],
    faqs: [
      {
        question: "Can I instruct Chaman Law Firm from outside Nigeria?",
        answer:
          "Yes. The firm can guide diaspora clients remotely and advise on legal representation, document execution, property verification, and transaction protection in Nigeria."
      }
    ]
  },
  {
    slug: "mortgage-document-review",
    title: "Mortgage Document Review",
    summary:
      "Legal review for mortgage documents, stamping, up-stamping, title security, lender requirements, borrower obligations, and property-document risk in Nigerian transactions.",
    description:
      "Chaman Law Firm helps clients review mortgage documents before signing, perfection, stamping, up-stamping, release, enforcement, or refinancing decisions. The service is framed as document-risk guidance because stamp duty, registration, lender conditions, and state-specific title issues can depend on the transaction facts and documents.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Chaman Law Firm managing partner office for mortgage document review and property-law advisory",
    keyPoints: [
      "Mortgage deed and facility-document review",
      "Stamping, up-stamping, and perfection-risk guidance",
      "Borrower, lender, guarantor, and security-document checks",
      "Advice before signing, release, enforcement, or refinancing steps"
    ],
    process: [
      "Collect the mortgage deed, facility letter, title documents, transaction history, and the client's objective",
      "Review execution, parties, title consistency, security terms, stamp-duty/perfection questions, and visible transaction risks",
      "Identify document gaps, unclear obligations, enforcement exposure, and issues requiring lender or registry clarification",
      "Provide practical advice on safer signing, completion, amendment, release, or further verification steps"
    ],
    faqs: [
      {
        question: "Why should a mortgage document be reviewed before signing?",
        answer:
          "A review can help identify unclear obligations, title inconsistencies, perfection questions, borrower or guarantor exposure, and document gaps before the transaction becomes harder to correct."
      },
      {
        question: "Can Chaman Law Firm advise on stamping or up-stamping a mortgage document?",
        answer:
          "Yes. The firm can review the documents and advise on legal-risk questions connected to stamping, up-stamping, registration, perfection, and related transaction steps."
      }
    ]
  },
  {
    slug: "legal-implications-of-joint-property",
    title: "Legal Implications of Joint Property",
    summary:
      "Property-law guidance for co-owners, spouses, families, investors, and business partners dealing with joint ownership, title control, contribution, transfer, sale, and dispute risk.",
    description:
      "Chaman Law Firm advises clients on the legal implications of jointly owned property in Nigeria, including title structure, authority to sell or mortgage, contribution records, inheritance concerns, family-property risk, and dispute-prevention documentation.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm team supporting joint property ownership and real estate advisory",
    keyPoints: [
      "Joint ownership and contribution-document review",
      "Sale, transfer, mortgage, and consent-risk guidance",
      "Family, spouse, investor, and business-partner property issues",
      "Dispute-prevention documents and representation strategy"
    ],
    process: [
      "Confirm the ownership facts, parties, documents, contribution records, and intended action",
      "Review title wording, transaction history, authority questions, and any family or partnership context",
      "Advise on risks around sale, mortgage, transfer, inheritance, dispute, or documentation gaps",
      "Prepare or review documents that clarify rights, authority, contribution, and next steps"
    ],
    faqs: [
      {
        question: "Can one co-owner sell jointly owned property alone?",
        answer:
          "The answer depends on the title structure, authority, agreements, family context, and applicable facts. A document review is important before any sale, transfer, or mortgage step."
      },
      {
        question: "What documents help prevent joint property disputes?",
        answer:
          "Clear title documents, written contribution records, co-ownership agreements, powers of attorney where appropriate, and properly reviewed transaction documents can help reduce dispute risk."
      }
    ]
  },
  {
    slug: "property-owner-rights",
    title: "Property Owner Rights",
    summary:
      "Legal guidance for property owners seeking to understand ownership rights, possession, documentation, transfer, development, tenancy, encumbrances, and dispute-protection options.",
    description:
      "Chaman Law Firm helps property owners review ownership documents, possession issues, tenant or occupier concerns, sale or mortgage plans, development decisions, and title-protection risks before taking legal or commercial steps.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising property owners on Nigerian real estate rights",
    keyPoints: [
      "Ownership, possession, and title-document review",
      "Sale, lease, mortgage, and development-risk guidance",
      "Tenant, occupier, family, and boundary-dispute support",
      "Practical advice before enforcement, transfer, or documentation steps"
    ],
    process: [
      "Review the owner's documents, possession facts, occupier details, transaction history, and intended action",
      "Identify gaps in title, authority, consent, tenancy, boundaries, encumbrances, or dispute history",
      "Advise on lawful options for documentation, negotiation, transfer, protection, or representation",
      "Support document preparation, correspondence, settlement, litigation, or perfection where appropriate"
    ],
    faqs: [
      {
        question: "What should a property owner review before selling or leasing property?",
        answer:
          "The owner should review title documents, authority, encumbrances, possession, tenancy status, tax or consent questions, and the proposed transaction documents before completion."
      },
      {
        question: "Can a lawyer help if another person is challenging ownership?",
        answer:
          "Yes. A lawyer can review the ownership documents, facts, evidence, and dispute pathway, then advise on negotiation, documentation, representation, or litigation strategy."
      }
    ]
  },
  {
    slug: "land-use-act-advisory",
    title: "Land Use Act Advisory",
    summary:
      "Property-law advisory on Land Use Act issues, statutory and customary rights of occupancy, Governor's Consent, allocation, title regularization, and transaction-risk questions.",
    description:
      "Chaman Law Firm advises buyers, owners, developers, families, and investors on Land Use Act issues that affect Nigerian property transactions, including rights of occupancy, consent, allocation, revocation risk, perfection questions, and documentation strategy.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for Land Use Act and Nigerian property title guidance",
    keyPoints: [
      "Statutory and customary right-of-occupancy guidance",
      "Governor's Consent, perfection, and title-regularization advice",
      "Allocation, acquisition, revocation, and compensation-risk review",
      "Transaction planning for buyers, owners, developers, and families"
    ],
    process: [
      "Collect title documents, allocation records, survey information, transaction history, and client objectives",
      "Review how Land Use Act issues may affect ownership, consent, perfection, transfer, or development plans",
      "Identify document gaps, government-facing questions, and risk areas requiring further verification",
      "Advise on practical next steps for due diligence, consent, documentation, representation, or dispute prevention"
    ],
    faqs: [
      {
        question: "Why does the Land Use Act matter in property transactions?",
        answer:
          "Land Use Act issues can affect title structure, rights of occupancy, consent, allocation, perfection, transfer, and government-facing steps in Nigerian property transactions."
      },
      {
        question: "Can Chaman Law Firm review Land Use Act issues before a purchase?",
        answer:
          "Yes. The firm can review the documents, transaction facts, and location-specific concerns before advising on risk and safer next steps."
      }
    ]
  },
  {
    slug: "land-registration",
    title: "Land Registration Advisory",
    summary:
      "Legal guidance for clients reviewing land registration records, registry-facing documents, title history, perfection questions, and transaction-risk indicators in Nigeria.",
    description:
      "Chaman Law Firm assists buyers, landowners, developers, families, and diaspora clients with land registration questions, title-document review, registry search results, regularization concerns, and safer documentation steps before transfer, sale, mortgage, or development decisions.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for Nigerian land registration and title review",
    keyPoints: [
      "Land registry and title-document review",
      "Registered interest, deed, survey, and perfection-risk guidance",
      "Advice before purchase, transfer, mortgage, or development steps",
      "Support for local and diaspora clients seeking clearer title records"
    ],
    process: [
      "Collect available title documents, survey information, registry evidence, and transaction history",
      "Review registration status, document consistency, ownership trail, and visible risk indicators",
      "Identify gaps, conflicting information, and areas requiring registry or professional verification",
      "Advise on safer next steps for documentation, regularization, purchase, transfer, or dispute prevention"
    ],
    faqs: [
      {
        question: "Why should land registration records be reviewed before purchase?",
        answer:
          "Registration records and supporting documents can reveal title gaps, inconsistent ownership history, unperfected interests, or issues that should be clarified before payment or completion."
      },
      {
        question: "Can Chaman Law Firm advise on land registration problems?",
        answer:
          "Yes. The firm can review the documents and facts, advise on visible legal risks, and recommend appropriate next steps for verification, regularization, or representation."
      }
    ]
  },
  {
    slug: "landlords-and-tenants-in-nigeria",
    title: "Landlord and Tenant Advisory",
    summary:
      "Legal guidance for landlords, tenants, property managers, and investors handling tenancy agreements, notices, deposits, rent issues, repairs, possession, and dispute prevention.",
    description:
      "Chaman Law Firm advises on landlord and tenant issues in Nigeria, including tenancy-document review, rent and deposit disputes, notices, recovery-of-premises concerns, occupier communication, and lawful dispute-resolution options. The firm emphasizes proper documentation and lawful process rather than self-help action.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on landlord and tenant matters in Nigeria",
    keyPoints: [
      "Tenancy agreement and notice review",
      "Rent, deposit, repair, possession, and occupier-dispute guidance",
      "Lawful recovery-of-premises and settlement strategy",
      "Advice for landlords, tenants, property managers, and investors"
    ],
    process: [
      "Confirm the tenancy facts, agreement, payment history, notices, and dispute timeline",
      "Review documentation for legal risk, unclear terms, communication gaps, and process concerns",
      "Advise on negotiation, documentation, notice strategy, settlement, or lawful escalation",
      "Support correspondence, representation, dispute resolution, or proceedings where appropriate"
    ],
    faqs: [
      {
        question: "Can a landlord remove a tenant without lawful process?",
        answer:
          "A landlord should seek legal advice before taking possession steps. The proper route depends on the agreement, notices, facts, and applicable tenancy rules."
      },
      {
        question: "Can tenants get legal advice before responding to a notice?",
        answer:
          "Yes. Tenants can seek advice on the agreement, notice, payment history, repair issues, and the lawful options available before responding or escalating the dispute."
      }
    ]
  },
  {
    slug: "land-use-charge",
    title: "Land Use Charge Advisory",
    summary:
      "Legal and document-readiness guidance for property owners, occupiers, companies, and investors reviewing land-use-charge issues, notices, assessments, and property-tax concerns.",
    description:
      "Chaman Law Firm helps clients review land-use-charge notices, property records, ownership documents, assessment concerns, compliance questions, and dispute options. The service is framed as legal and document-risk guidance and does not replace assessment by the relevant authority.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal and property advisory image for land use charge review in Nigeria",
    keyPoints: [
      "Land-use-charge notice and document review",
      "Ownership, occupier, assessment, and property-record guidance",
      "Compliance, dispute, and correspondence support",
      "Practical advice for property owners, companies, and investors"
    ],
    process: [
      "Collect the assessment notice, property documents, payment evidence, correspondence, and client objective",
      "Review the property records, taxpayer information, ownership facts, and visible compliance questions",
      "Identify documentation gaps, appeal or correction issues, and points requiring authority clarification",
      "Advise on correspondence, payment-risk decisions, professional coordination, or dispute steps"
    ],
    faqs: [
      {
        question: "Can a lawyer review a land-use-charge notice?",
        answer:
          "Yes. A lawyer can review the notice, property documents, correspondence, and facts before advising on legal risk, documentation gaps, and possible next steps."
      },
      {
        question: "Does this service calculate government charges?",
        answer:
          "The firm can review legal and document-readiness issues, but official assessment and payment requirements remain subject to the relevant authority and applicable facts."
      }
    ]
  },
  {
    slug: "legal-restrictions-to-sale-of-land",
    title: "Legal Restrictions to Sale of Land",
    summary:
      "Property-law advice on restrictions that may affect the sale of land, including title defects, family consent, encumbrances, court disputes, government acquisition, and authority gaps.",
    description:
      "Chaman Law Firm advises owners, buyers, families, developers, and investors on legal restrictions that may affect land sale transactions in Nigeria. The firm reviews title documents, seller authority, family or community interests, encumbrances, pending disputes, government-acquisition risk, and transaction documents before sale or purchase steps proceed.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm property lawyers reviewing restrictions to sale of land",
    keyPoints: [
      "Seller authority, family consent, and title restriction review",
      "Encumbrance, litigation, acquisition, and possession-risk guidance",
      "Document support before sale, purchase, mortgage, or transfer",
      "Practical advice to reduce invalid-sale and dispute risk"
    ],
    process: [
      "Confirm the proposed sale, parties, ownership history, and available documents",
      "Review title, consent, possession, encumbrances, disputes, and government-facing issues",
      "Identify restrictions, unresolved authority questions, and documents needing correction",
      "Advise on safer transaction steps, documentation, negotiation, or dispute-prevention strategy"
    ],
    faqs: [
      {
        question: "What can restrict a land sale in Nigeria?",
        answer:
          "Restrictions can arise from title defects, missing authority, family or community interests, encumbrances, pending disputes, acquisition issues, consent requirements, or unclear transaction documents."
      },
      {
        question: "Should buyers review restrictions before payment?",
        answer:
          "Yes. Buyers should review title, authority, possession, restrictions, and transaction documents before paying or signing completion documents."
      }
    ]
  },
  {
    slug: "selling-a-family-land-without-everyones-consent",
    title: "Family Land Sale Consent Advisory",
    summary:
      "Legal guidance for families, purchasers, administrators, and beneficiaries dealing with family land sale authority, consent, title control, representation, and dispute risk.",
    description:
      "Chaman Law Firm advises on family land transactions where consent, authority, succession, beneficiary interests, or representation questions may affect the validity and safety of a sale. The firm helps clients review documents and facts before selling, buying, challenging, or regularizing a family-land transaction.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on family land sale consent and property disputes",
    keyPoints: [
      "Family land authority and consent-risk review",
      "Beneficiary, administrator, and representative capacity guidance",
      "Advice for buyers before completing family-land transactions",
      "Dispute-prevention, negotiation, and documentation support"
    ],
    process: [
      "Confirm the family ownership history, parties, documents, approvals, and proposed transaction",
      "Review authority, consent, succession, possession, and beneficiary-interest questions",
      "Identify legal-risk areas and documents requiring clarification or correction",
      "Advise on transaction structure, negotiation, documentation, representation, or dispute steps"
    ],
    faqs: [
      {
        question: "Is family consent important in family land transactions?",
        answer:
          "Consent and authority questions can be critical. The legal position depends on the family structure, title history, representatives, documents, and transaction facts."
      },
      {
        question: "Can a buyer reduce family-land dispute risk?",
        answer:
          "Yes. A buyer can reduce risk by conducting legal due diligence, confirming authority, reviewing consent evidence, documenting the transaction properly, and seeking advice before payment."
      }
    ]
  }
];

const sprint11sPropertyServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "quit-notice-advisory",
    title: "Quit Notice Legal Advisory",
    summary:
      "Tenancy-law guidance for landlords, tenants, property managers, and businesses reviewing quit notices, possession demands, and dispute risk.",
    description:
      "Chaman Law Firm helps clients review quit notices, tenancy documents, correspondence, payment history, occupation facts, and possession-risk issues before any legal step is taken. The service is framed as fact-specific legal guidance and does not encourage self-help eviction.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for quit notice and tenancy dispute review in Nigeria",
    keyPoints: [
      "Quit notice and tenancy-document review",
      "Landlord and tenant rights assessment",
      "Possession, arrears, and correspondence-risk guidance",
      "Pre-action strategy before escalation or court steps"
    ],
    process: [
      "Review the tenancy agreement, notices, rent records, and correspondence",
      "Identify the tenancy type, dispute history, and possession objective",
      "Advise on lawful next steps and settlement options",
      "Support correspondence, negotiation, or representation where appropriate"
    ],
    faqs: [
      {
        question: "Can a quit notice be reviewed before action is taken?",
        answer:
          "Yes. A lawyer can review the notice, tenancy facts, documents, and dispute context before advising on the appropriate legal path."
      },
      {
        question: "Does this service support self-help eviction?",
        answer:
          "No. Chaman Law Firm advises clients to use lawful procedures and to avoid actions that may create civil or criminal risk."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "lagos-physical-planning-compliance",
    title: "Lagos Physical Planning Compliance Advisory",
    summary:
      "Legal and document-readiness advice for clients reviewing planning approvals, development-control issues, building permits, and Lagos property compliance risk.",
    description:
      "Chaman Law Firm advises property owners, developers, buyers, and businesses on legal-risk issues connected with planning documents, building approval concerns, regulatory correspondence, development control, and property due diligence. The firm reviews facts and documents before advising on available compliance or dispute options.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on Lagos physical planning and property compliance",
    keyPoints: [
      "Planning approval and development-control document review",
      "Building permit and property-compliance risk assessment",
      "Due diligence support before acquisition or development",
      "Regulatory correspondence and dispute-prevention guidance"
    ],
    process: [
      "Review the property, approval documents, notices, and development facts",
      "Identify missing records, compliance questions, and transaction risks",
      "Advise on legal options, representation needs, and risk containment",
      "Support correspondence, negotiation, or further due diligence"
    ],
    faqs: [
      {
        question: "Should planning approvals be checked before buying or developing property?",
        answer:
          "Yes. Planning and approval records can affect risk, use, financing, development, and dispute exposure."
      },
      {
        question: "Can the firm obtain an approval automatically?",
        answer:
          "No result can be guaranteed. The firm reviews documents and advises on the appropriate legal and compliance pathway."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "land-tenure-systems",
    title: "Land Tenure Systems Advisory",
    summary:
      "Legal guidance for families, buyers, investors, and property owners reviewing customary tenure, statutory rights, family land, and title-risk questions.",
    description:
      "Chaman Law Firm helps clients understand land-tenure and title-risk issues before acquisition, development, family-land decisions, perfection, or dispute resolution. The service focuses on document review, seller authority, family consent, tenure history, and practical legal-risk assessment.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Chaman Law Firm office setting for land tenure and title-risk advisory",
    keyPoints: [
      "Customary, statutory, and family-land risk review",
      "Seller authority, consent, and title-history assessment",
      "Property due diligence before acquisition or development",
      "Dispute-prevention advice for families and investors"
    ],
    process: [
      "Review title documents, family history, seller authority, and transaction records",
      "Identify tenure, consent, and perfection questions",
      "Advise on risks, missing documents, and next steps",
      "Support negotiation, correspondence, due diligence, or dispute strategy"
    ],
    faqs: [
      {
        question: "Why does land tenure matter in a property transaction?",
        answer:
          "The tenure history can affect ownership, authority to sell, consent requirements, perfection, and future dispute risk."
      },
      {
        question: "Can this service help with family land?",
        answer:
          "Yes. The firm can review family-land facts, consent issues, documents, and dispute risk before advising on next steps."
      }
    ]
  })
];

const sprint11sCorporateServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "minor-contract-capacity",
    title: "Minor Contract Capacity Advisory",
    summary:
      "Contract-law guidance for businesses, families, schools, service providers, and organizations assessing agreement risk where a minor may be involved.",
    description:
      "Chaman Law Firm advises clients on contract-risk questions connected with age, capacity, guardianship, enforceability, consent, service arrangements, and commercial documentation. The firm reviews the facts before advising whether a contract, policy, or transaction needs revision or further protection.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for contract capacity and commercial documentation review",
    keyPoints: [
      "Contract capacity and enforceability-risk review",
      "Guardian, consent, and documentation guidance",
      "Commercial agreement and service-policy review",
      "Risk management before signing or enforcement"
    ],
    process: [
      "Review the parties, agreement, purpose, and supporting documents",
      "Assess capacity, consent, and enforceability questions",
      "Recommend revisions, safeguards, or alternative documentation",
      "Support implementation, negotiation, or dispute prevention"
    ],
    faqs: [
      {
        question: "Can a contract involving a minor create legal risk?",
        answer:
          "Yes. Capacity, consent, and enforceability questions can affect the legal position and should be reviewed before relying on the agreement."
      },
      {
        question: "Can Chaman Law Firm review an agreement before signing?",
        answer:
          "Yes. The firm can review the proposed agreement and advise on legal risk, protective clauses, and next steps."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "ultra-vires-corporate-powers",
    title: "Ultra Vires and Corporate Powers Advisory",
    summary:
      "Corporate-law guidance for companies, directors, shareholders, lenders, and investors reviewing company authority, objects, approvals, and transaction powers.",
    description:
      "Chaman Law Firm assists clients with questions about corporate authority, director powers, board approvals, shareholder resolutions, company objects, transaction documentation, and governance records. The service helps reduce avoidable disputes over whether a company or officer had authority to act.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Corporate lawyers reviewing company authority and governance records",
    keyPoints: [
      "Company authority and object-clause review",
      "Board, shareholder, and director-power assessment",
      "Resolution and approval-document guidance",
      "Transaction-risk review before execution or dispute"
    ],
    process: [
      "Review company records, constitutional documents, resolutions, and transaction papers",
      "Identify authority gaps or approval concerns",
      "Advise on corrective documentation or risk controls",
      "Support implementation, negotiation, or dispute strategy"
    ],
    faqs: [
      {
        question: "Why should company authority be checked before a transaction?",
        answer:
          "Authority checks help confirm whether the company and its officers have the legal and governance basis to enter the transaction."
      },
      {
        question: "Can this service help lenders or investors?",
        answer:
          "Yes. Lenders and investors often need company-authority and approval documents reviewed before relying on a transaction."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "regulatory-bodies-compliance",
    title: "Regulatory Bodies and Compliance Advisory",
    summary:
      "Legal guidance for businesses dealing with Nigerian regulators, compliance notices, licensing concerns, reporting obligations, and governance risk.",
    description:
      "Chaman Law Firm helps businesses identify regulatory touchpoints, review notices and correspondence, assess compliance documents, and prepare a practical response plan. The service is not a substitute for regulator-issued decisions and is based on the client's facts and documents.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal service image for business regulatory compliance advisory in Nigeria",
    keyPoints: [
      "Regulatory notice and correspondence review",
      "Licensing, reporting, and documentation-risk guidance",
      "Business compliance and governance assessment",
      "Response strategy before escalation or enforcement"
    ],
    process: [
      "Review the business activity, regulator, notice, and compliance history",
      "Identify document gaps, response deadlines, and legal-risk areas",
      "Advise on practical response, correspondence, or corrective steps",
      "Support implementation or representation where appropriate"
    ],
    faqs: [
      {
        question: "Can a lawyer help with regulator correspondence?",
        answer:
          "Yes. A lawyer can review the correspondence, identify risks, and help prepare an appropriate response."
      },
      {
        question: "Does this service guarantee regulator approval?",
        answer:
          "No. The firm provides legal guidance and representation support, but regulator decisions depend on the applicable facts and requirements."
      }
    ]
  })
];

const sprint11sLitigationServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "police-complaint-and-rights-advisory",
    title: "Police Complaint and Rights Advisory",
    summary:
      "Rights-focused legal guidance for individuals, families, and businesses reviewing police complaints, harassment concerns, detention risk, and evidence records.",
    description:
      "Chaman Law Firm advises clients on police-complaint and rights issues after reviewing the facts, documents, messages, witnesses, and urgency. The service focuses on lawful reporting, correspondence, representation, settlement where appropriate, and protection from escalation.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for police complaint and rights representation",
    keyPoints: [
      "Complaint, detention, and harassment-risk review",
      "Evidence, correspondence, and witness-record assessment",
      "Rights-focused representation and escalation guidance",
      "Lawful reporting and dispute-resolution strategy"
    ],
    process: [
      "Review the incident facts, documents, witnesses, and urgency",
      "Identify immediate safety, rights, and evidence concerns",
      "Advise on lawful reporting, correspondence, or representation",
      "Support follow-up, negotiation, or formal legal steps"
    ],
    faqs: [
      {
        question: "Should a police complaint be reviewed before escalation?",
        answer:
          "Yes. Legal review helps identify the safest route, evidence needs, and whether urgent representation is required."
      },
      {
        question: "Does the page give a universal complaint formula?",
        answer:
          "No. Police and rights issues are fact-sensitive, so the firm reviews the facts before advising on a specific path."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "injunctions-and-interim-reliefs",
    title: "Injunctions and Interim Reliefs Advisory",
    summary:
      "Litigation strategy advice for clients considering urgent court protection, interim reliefs, restraint orders, preservation orders, or dispute containment.",
    description:
      "Chaman Law Firm helps clients assess whether urgent court protection or interim relief may be appropriate after reviewing the facts, documents, harm, timing, evidence, and dispute context. The service avoids generic promises because interim relief depends on the court, facts, and applicable rules.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Litigation strategy setting for injunctions and interim relief advisory",
    keyPoints: [
      "Urgency, harm, and evidence-risk assessment",
      "Interim relief and dispute-containment strategy",
      "Document and affidavit-readiness review",
      "Representation planning before court or settlement"
    ],
    process: [
      "Review the dispute, urgency, documents, and evidence",
      "Assess whether interim relief may be suitable",
      "Prepare strategy, documents, and representation plan",
      "Support filing, negotiation, or dispute containment where appropriate"
    ],
    faqs: [
      {
        question: "Can every dispute qualify for an injunction?",
        answer:
          "No. Interim relief depends on the facts, evidence, urgency, applicable rules, and the court's assessment."
      },
      {
        question: "When should a client seek urgent advice?",
        answer:
          "Early advice is important where assets, property, rights, evidence, or business operations may be at immediate risk."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "civil-lawsuit-pre-action-review",
    title: "Civil Lawsuit Pre-Action Review",
    summary:
      "Pre-action legal review for individuals and businesses considering civil claims, commercial disputes, property disputes, or court proceedings in Nigeria.",
    description:
      "Chaman Law Firm reviews claims, documents, parties, limitation concerns, evidence, settlement possibilities, and court-readiness before proceedings are filed. The service helps clients avoid weak claims, premature filing, and avoidable procedural risk.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm litigation team reviewing civil lawsuit documents",
    keyPoints: [
      "Claim, evidence, and party-identification review",
      "Pre-action correspondence and settlement strategy",
      "Court-readiness and procedural-risk guidance",
      "Litigation, mediation, or negotiation pathway advice"
    ],
    process: [
      "Review the claim facts, documents, parties, and desired outcome",
      "Assess evidence, limitation, jurisdiction, and settlement options",
      "Recommend a pre-action or dispute-resolution strategy",
      "Support correspondence, negotiation, filing, or representation"
    ],
    faqs: [
      {
        question: "Should a lawsuit be reviewed before filing?",
        answer:
          "Yes. Pre-action review can reveal evidence gaps, party issues, settlement opportunities, and procedural risks."
      },
      {
        question: "Can litigation be avoided?",
        answer:
          "Sometimes. Negotiation, mediation, settlement, or other dispute-resolution routes may be suitable depending on the matter."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "court-system-and-judiciary-advisory",
    title: "Court System and Judiciary Advisory",
    summary:
      "Practical litigation orientation for clients trying to understand Nigerian court structure, jurisdiction questions, and the right forum for a dispute.",
    description:
      "Chaman Law Firm advises clients on court-system and forum questions after reviewing the dispute, parties, documents, location, remedies, and urgency. The service is useful where a matter may involve jurisdiction, procedure, appeal risk, enforcement, or alternative dispute resolution.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for Nigerian court system and jurisdiction review",
    keyPoints: [
      "Court, forum, and jurisdiction-risk review",
      "Dispute pathway and remedy assessment",
      "Procedure, timing, and evidence-readiness guidance",
      "Litigation or ADR route selection"
    ],
    process: [
      "Review the dispute, parties, documents, and desired remedy",
      "Identify forum, jurisdiction, and procedure questions",
      "Advise on litigation, ADR, or settlement pathway",
      "Support next steps through correspondence or representation"
    ],
    faqs: [
      {
        question: "Why does forum selection matter?",
        answer:
          "The wrong forum or procedural route can create delay, cost, jurisdictional objections, or enforcement problems."
      },
      {
        question: "Can this service help before a case starts?",
        answer:
          "Yes. Early review can help determine the suitable route before filing or responding to a claim."
      }
    ]
  })
];

const sprint11sProbateServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "letters-of-administration-ogun-state",
    title: "Letters of Administration in Ogun State",
    summary:
      "Estate-administration guidance for families, administrators, beneficiaries, and diaspora clients dealing with Ogun State assets or family estate questions.",
    description:
      "Chaman Law Firm assists clients with document review, family structure, estate information, asset details, representation needs, and administration-risk questions connected with Ogun State estate matters. The appropriate pathway depends on the facts and available documents.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Private-client legal advisory for letters of administration in Ogun State",
    keyPoints: [
      "Estate and family-document review",
      "Administrator, beneficiary, and asset-information guidance",
      "Application-readiness and representation support",
      "Diaspora and cross-state estate-administration advice"
    ],
    process: [
      "Review the deceased person's records, family details, and asset information",
      "Identify application-readiness, representation, and document gaps",
      "Advise on the appropriate administration pathway",
      "Support preparation, correspondence, or representation where required"
    ],
    faqs: [
      {
        question: "Who may need letters of administration?",
        answer:
          "Families may need them where a deceased person's assets require lawful authority for administration or distribution."
      },
      {
        question: "Can diaspora family members seek help?",
        answer:
          "Yes. The firm can review documents and advise on representation, documentation, and practical estate-administration steps."
      }
    ]
  })
];

const sprint11sNotaryServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "notary-public-eligibility-and-document-advisory",
    title: "Notary Public Eligibility and Document Advisory",
    summary:
      "Notary and document-authentication guidance for clients who need notarization, certification, document execution, or clarity on notarial requirements in Nigeria.",
    description:
      "Chaman Law Firm advises clients on notarization, certification, authentication, powers of attorney, affidavits, and document-use questions. The service helps clients understand what type of notarial or supporting legal step may be required for local or international use.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Notary public document advisory at Chaman Law Firm",
    keyPoints: [
      "Document notarization and certification guidance",
      "Power of attorney and affidavit-document review",
      "Local and international document-use support",
      "Execution, authentication, and legalization pathway advice"
    ],
    process: [
      "Review the document, destination, purpose, and identity requirements",
      "Identify notarization, certification, or authentication needs",
      "Advise on execution and supporting legal steps",
      "Support notarization or document-readiness where appropriate"
    ],
    faqs: [
      {
        question: "Can the firm advise what notarization step is needed?",
        answer:
          "Yes. The required step depends on the document type, destination, and purpose for which it will be used."
      },
      {
        question: "Is this only for Nigerian use?",
        answer:
          "No. The firm also assists clients with documents intended for use abroad, subject to destination requirements."
      }
    ]
  })
];

const sprint11sImmigrationServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "citizenship-by-marriage-advisory",
    title: "Citizenship by Marriage Advisory",
    summary:
      "Immigration and documentation guidance for clients reviewing Nigerian citizenship, marriage-related status questions, eligibility documents, and application readiness.",
    description:
      "Chaman Law Firm advises clients on immigration-document readiness, marriage records, eligibility questions, identity documents, residence history, and related legal-risk issues. The service does not promise approval and depends on the applicable facts, law, and government process.",
    image: serviceHeroImages.legalService,
    imageAlt: "Immigration legal advisory image for citizenship by marriage questions",
    keyPoints: [
      "Marriage, identity, and immigration-document review",
      "Eligibility and application-readiness guidance",
      "Status, residence, and supporting-record assessment",
      "Legal advice before submission or follow-up"
    ],
    process: [
      "Review marriage, identity, residence, and immigration records",
      "Identify eligibility questions and missing documents",
      "Advise on application-readiness and legal-risk issues",
      "Support documentation, correspondence, or representation where appropriate"
    ],
    faqs: [
      {
        question: "Does marriage automatically guarantee citizenship?",
        answer:
          "No. Citizenship and immigration questions depend on the applicable law, facts, eligibility requirements, and government process."
      },
      {
        question: "Can Chaman Law Firm review documents before application?",
        answer:
          "Yes. The firm can review documents and advise on readiness, risk, and next steps."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "certificate-of-good-conduct-advisory",
    title: "Certificate of Good Conduct Advisory",
    summary:
      "Document-readiness guidance for clients who need certificate-of-good-conduct support, police character documentation, or immigration-related record review.",
    description:
      "Chaman Law Firm advises individuals, employers, families, and diaspora clients on document-readiness questions connected with certificates of good conduct, police character documentation, immigration records, and supporting legal documents. The firm reviews the facts before advising on next steps.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on certificate of good conduct documentation",
    keyPoints: [
      "Identity, police-record, and supporting-document review",
      "Immigration and employment-document readiness guidance",
      "Corrections, inconsistencies, and representation-risk assessment",
      "Advice before submission, use, or follow-up"
    ],
    process: [
      "Review the client's purpose, identity documents, and record history",
      "Identify documentation gaps, inconsistencies, or risk points",
      "Advise on a practical document-readiness pathway",
      "Support correspondence or related legal documentation where appropriate"
    ],
    faqs: [
      {
        question: "Can a lawyer help review certificate-of-good-conduct documents?",
        answer:
          "Yes. A lawyer can review the documents and advise on legal or documentation issues before use."
      },
      {
        question: "Is approval guaranteed?",
        answer:
          "No. The firm provides legal guidance, but official outcomes depend on the applicable facts and authority."
      }
    ]
  })
];

const sprint11sFamilyServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "child-surname-change-advisory",
    title: "Child Surname Change Advisory",
    summary:
      "Family-law guidance for parents, guardians, and families reviewing child surname changes, consent concerns, documentation, and dispute risk.",
    description:
      "Chaman Law Firm advises clients on child surname-change questions after reviewing parental status, guardianship, consent, birth records, school records, identity documents, and dispute concerns. The service is handled carefully because children's matters are fact-sensitive.",
    image: serviceHeroImages.legalService,
    imageAlt: "Family law advisory image for child surname change documentation",
    keyPoints: [
      "Child identity, parental status, and consent review",
      "Birth, school, and supporting-document assessment",
      "Guardianship and family-dispute risk guidance",
      "Document-readiness and representation support"
    ],
    process: [
      "Review the child's records, parental facts, and purpose of change",
      "Identify consent, guardianship, and documentation questions",
      "Advise on lawful options and dispute-risk controls",
      "Support documentation, correspondence, or representation"
    ],
    faqs: [
      {
        question: "Can a child's surname be changed without legal review?",
        answer:
          "Legal review is advisable because consent, guardianship, identity records, and dispute risk may affect the appropriate route."
      },
      {
        question: "Does the firm handle sensitive family matters discreetly?",
        answer:
          "Yes. Family matters are handled with care, privacy, and fact-specific legal guidance."
      }
    ]
  }),
  createAuthorityServicePage({
    slug: "void-and-voidable-marriage-advisory",
    title: "Void and Voidable Marriage Advisory",
    summary:
      "Family-law advice for clients reviewing marriage validity, annulment concerns, documentation, capacity, consent, and related private-client risk.",
    description:
      "Chaman Law Firm advises clients on marriage-validity and family-law questions after reviewing marriage records, parties, capacity, consent, ceremony facts, location, and related documents. The service avoids generic conclusions because validity questions depend on the specific facts and applicable law.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private family law consultation for marriage-validity advisory",
    keyPoints: [
      "Marriage certificate and ceremony-document review",
      "Capacity, consent, and validity-risk assessment",
      "Annulment, divorce, and family-law pathway guidance",
      "Private-client advice before action or settlement"
    ],
    process: [
      "Review marriage records, identity documents, and relationship facts",
      "Identify validity, consent, capacity, or documentation concerns",
      "Advise on appropriate family-law options",
      "Support correspondence, settlement, or representation where required"
    ],
    faqs: [
      {
        question: "Are marriage-validity questions fact-sensitive?",
        answer:
          "Yes. The relevant facts, documents, capacity, consent, and applicable law must be reviewed before advice is given."
      },
      {
        question: "Can the firm advise before a public dispute starts?",
        answer:
          "Yes. Early private advice can help clients understand options and reduce unnecessary escalation."
      }
    ]
  })
];

const sprint11sEmploymentServicePages: ServicePage[] = [
  createAuthorityServicePage({
    slug: "trade-union-registration-advisory",
    title: "Trade Union Registration Advisory",
    summary:
      "Employment-law guidance for workers, unions, employers, and organizations reviewing trade union registration, membership, workplace representation, and labour-risk questions.",
    description:
      "Chaman Law Firm advises clients on trade union registration and labour-relations issues after reviewing the organization, workplace facts, documents, correspondence, membership concerns, and dispute context. The service is framed as legal-risk and compliance guidance.",
    image: serviceHeroImages.legalService,
    imageAlt: "Employment law advisory image for trade union registration and labour relations",
    keyPoints: [
      "Trade union registration and membership-document review",
      "Workplace representation and labour-relations guidance",
      "Employer compliance and employee-rights risk assessment",
      "Correspondence, settlement, and dispute-resolution strategy"
    ],
    process: [
      "Review the workplace facts, union documents, and correspondence",
      "Identify registration, representation, and compliance questions",
      "Advise on legal risk, communication, and dispute options",
      "Support documentation, negotiation, or representation"
    ],
    faqs: [
      {
        question: "Can employers and employees both seek trade union advice?",
        answer:
          "Yes. The firm advises employers, employees, unions, and organizations based on the specific facts and documents."
      },
      {
        question: "Does this replace official registration decisions?",
        answer:
          "No. The firm provides legal guidance and representation support; official decisions depend on the applicable process and authority."
      }
    ]
  })
];

const sprint11tPropertyServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "land-title-document-check",
    title: "Land Title Document Check",
    summary:
      "Legal review of land title documents, seller authority, survey records, allocation papers, and transaction-risk indicators before purchase or perfection.",
    description:
      "Chaman Law Firm reviews available title documents, seller identity and authority, survey information, transaction history, and visible red flags so buyers, families, developers, and diaspora clients can make informed decisions before payment or completion.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm team reviewing Nigerian land title documents",
    keyPoints: [
      "Root-of-title and seller-authority review",
      "Survey, allocation, deed, and transaction-document checks",
      "Possession, encumbrance, and dispute-risk screening",
      "Written legal guidance before payment or completion"
    ],
    process: [
      "Collect title documents, survey records, seller details, and transaction history",
      "Review document consistency, authority, location, and visible legal risk",
      "Identify missing documents, verification questions, and transaction red flags",
      "Advise on safer next steps, documentation, or withdrawal where risk is high"
    ],
    faqTopic: "land title document checks in Nigeria",
    faqAnswer:
      "Yes. The firm can review available title documents, identify visible risk, and advise on safer transaction steps before payment or completion."
  }),
  createSprint11tServicePage({
    slug: "land-purchase-due-diligence",
    title: "Land Purchase Due Diligence",
    summary:
      "Pre-purchase legal due diligence for land buyers, investors, developers, families, and diaspora clients reviewing Nigerian land transactions.",
    description:
      "The firm helps clients review ownership evidence, seller capacity, survey details, possession facts, family consent issues, payment structure, and perfection questions before land purchases are completed.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal due diligence image for Nigerian land purchase review",
    keyPoints: [
      "Ownership and seller-capacity checks",
      "Family land, possession, and encumbrance-risk review",
      "Survey, location, and transaction-document assessment",
      "Completion and perfection-risk guidance"
    ],
    process: [
      "Confirm the land, parties, transaction objective, and documents available",
      "Review ownership, consent, location, possession, and payment risks",
      "Advise on gaps, safer documentation, and closing conditions",
      "Support negotiation, documentation, or further verification where needed"
    ],
    faqTopic: "land purchase due diligence",
    faqAnswer:
      "Yes. Chaman Law Firm can review the legal risks around a proposed land purchase and advise before funds are committed."
  }),
  createSprint11tServicePage({
    slug: "tenancy-agreement-review",
    title: "Tenancy Agreement Review",
    summary:
      "Review and drafting guidance for tenancy agreements, lease terms, rent obligations, renewal clauses, possession issues, and landlord-tenant risk.",
    description:
      "Chaman Law Firm advises landlords, tenants, property managers, businesses, and families on tenancy agreement terms, notice clauses, rent obligations, repairs, renewal, dispute prevention, and lawful possession strategy.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private legal consultation for tenancy agreement review in Nigeria",
    keyPoints: [
      "Tenancy and lease-term review",
      "Rent, renewal, repair, and possession-risk guidance",
      "Landlord and tenant obligation assessment",
      "Dispute-prevention and correspondence support"
    ],
    process: [
      "Review the proposed or existing tenancy agreement and correspondence",
      "Identify unclear clauses, missing terms, and legal-risk issues",
      "Advise on revisions, negotiation, renewal, or exit options",
      "Support documentation and lawful dispute-resolution steps"
    ],
    faqTopic: "tenancy agreement review",
    faqAnswer:
      "Yes. The firm can review or draft tenancy documents and advise on landlord-tenant obligations before signing or enforcing terms."
  }),
  createSprint11tServicePage({
    slug: "property-dispute-and-squatter-advisory",
    title: "Property Dispute and Squatter Advisory",
    summary:
      "Legal-risk guidance for possession disputes, trespass concerns, squatter issues, occupation conflicts, and lawful recovery options.",
    description:
      "Chaman Law Firm helps property owners, families, landlords, investors, and developers review occupation facts, ownership documents, notices, evidence, and lawful options before taking any step that may escalate a property dispute.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for property dispute and squatter matters",
    keyPoints: [
      "Occupation, possession, and ownership-document review",
      "Trespass, squatter, and dispute-risk assessment",
      "Evidence, notice, and correspondence guidance",
      "Lawful strategy without self-help eviction"
    ],
    process: [
      "Review ownership records, occupation facts, correspondence, and evidence",
      "Identify legal-risk issues, urgency, and possible dispute routes",
      "Advise on lawful correspondence, settlement, filing, or representation options",
      "Support negotiation, evidence organization, or proceedings where appropriate"
    ],
    faqTopic: "property dispute and squatter advisory",
    faqAnswer:
      "Yes. The firm can review the documents and facts, then advise on lawful recovery or dispute-resolution options without encouraging self-help."
  }),
  createSprint11tServicePage({
    slug: "government-acquisition-ogun-state-advisory",
    title: "Government Acquisition in Ogun State Advisory",
    summary:
      "Property-law guidance for buyers, owners, and investors reviewing government acquisition, excision, allocation, and title-risk questions in Ogun State.",
    description:
      "The firm helps clients review available title documents, survey information, location facts, allocation records, acquisition-risk questions, and transaction context before buying, selling, or developing land in Ogun State.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on Ogun State land acquisition risk",
    keyPoints: [
      "Ogun State acquisition and location-risk review",
      "Survey, allocation, and title-document assessment",
      "Buyer, owner, and diaspora-client due diligence",
      "Practical advice before purchase, sale, or development"
    ],
    process: [
      "Collect title papers, survey documents, location details, and transaction history",
      "Review visible acquisition, allocation, and documentation issues",
      "Identify gaps requiring further search or official confirmation",
      "Advise on transaction risk, documentation, or further verification"
    ],
    faqTopic: "government acquisition risk in Ogun State",
    faqAnswer:
      "Yes. The firm can review the land documents and available evidence, then advise on visible acquisition and title-risk questions."
  }),
  createSprint11tServicePage({
    slug: "building-completion-certificate-lagos",
    title: "Building Completion Certificate Advisory",
    summary:
      "Document-readiness and legal-risk guidance for Lagos building completion certificate, development approvals, property compliance, and due diligence.",
    description:
      "Chaman Law Firm advises property owners, developers, buyers, and businesses on legal questions connected with building completion records, approval documents, compliance notices, transaction due diligence, and development-control risk.",
    image: serviceHeroImages.legalService,
    imageAlt: "Legal advisory image for building completion certificate review",
    keyPoints: [
      "Completion certificate and approval-document review",
      "Development-control and compliance-risk assessment",
      "Buyer and developer due diligence support",
      "Regulatory correspondence and document-readiness guidance"
    ],
    process: [
      "Review approval records, completion documents, notices, and property facts",
      "Identify document gaps, compliance questions, and transaction risks",
      "Advise on legal options, correspondence, and due diligence steps",
      "Support representation or document organization where appropriate"
    ],
    faqTopic: "building completion certificate advisory",
    faqAnswer:
      "Yes. The firm can review completion and approval documents and advise on legal or due diligence risks before use, sale, or development."
  }),
  createSprint11tServicePage({
    slug: "fencing-approval-lagos",
    title: "Fencing Approval Advisory",
    summary:
      "Legal and compliance guidance for property owners, developers, and buyers reviewing fencing approval, planning documents, and development-control issues.",
    description:
      "The firm reviews property documents, approval records, notices, survey details, and intended development facts before advising on fencing approval and related property-compliance questions.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm property lawyers reviewing fencing approval documents",
    keyPoints: [
      "Fencing approval and planning-document review",
      "Property compliance and development-control guidance",
      "Risk advice before construction or acquisition",
      "Support for document organization and correspondence"
    ],
    process: [
      "Review property, survey, approval, and development documents",
      "Identify missing records, authority questions, and compliance concerns",
      "Advise on safer next steps and representation needs",
      "Support correspondence or further due diligence where required"
    ],
    faqTopic: "fencing approval and planning compliance",
    faqAnswer:
      "Yes. Chaman Law Firm can review the relevant property and approval documents before advising on compliance and next steps."
  })
];

const sprint11tCorporateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "business-name-registration-advisory",
    title: "Business Name Registration Advisory",
    summary:
      "Legal and compliance guidance for founders, SMEs, entrepreneurs, and investors preparing business-name registration or post-registration documentation.",
    description:
      "Chaman Law Firm helps clients review business objectives, ownership structure, name reservation concerns, registration documents, post-registration compliance, and whether a business name or company structure better suits the client's plans.",
    image: serviceHeroImages.legalService,
    imageAlt: "Corporate legal advisory image for business name registration in Nigeria",
    keyPoints: [
      "Business-name and ownership-structure review",
      "Name reservation and document-readiness guidance",
      "Post-registration compliance advice",
      "Company structure comparison where appropriate"
    ],
    process: [
      "Clarify the business activity, ownership, and registration objective",
      "Review name, identity, address, and supporting documents",
      "Advise on structure, compliance gaps, and registration-readiness",
      "Support documentation and post-registration steps"
    ],
    faqTopic: "business name registration",
    faqAnswer:
      "Yes. The firm can review the proposed structure and documents, then advise on registration and compliance-readiness steps."
  }),
  createSprint11tServicePage({
    slug: "company-startup-compliance-advisory",
    title: "Company Startup Compliance Advisory",
    summary:
      "Startup legal guidance for founders and SMEs on company setup, governance, contracts, registrations, tax-readiness, and early compliance risks.",
    description:
      "The firm advises founders, directors, SMEs, and investors on registration structure, shareholder arrangements, company records, contracts, regulatory touchpoints, and early legal foundations for Nigerian businesses.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm corporate lawyers advising a Nigerian startup",
    keyPoints: [
      "Founder, director, and shareholder-structure review",
      "Company records, contracts, and governance guidance",
      "Regulatory and tax-readiness coordination",
      "Legal-risk advice for early-stage businesses"
    ],
    process: [
      "Clarify the business model, founders, investors, and immediate compliance needs",
      "Review available incorporation, governance, and contract documents",
      "Identify legal gaps, regulatory questions, and document priorities",
      "Advise on a practical startup-compliance pathway"
    ],
    faqTopic: "company startup compliance",
    faqAnswer:
      "Yes. Chaman Law Firm can review startup structure and documents, then advise on legal foundations and compliance priorities."
  }),
  createSprint11tServicePage({
    slug: "cac-compliance-and-company-records",
    title: "CAC Compliance and Company Records",
    summary:
      "Corporate compliance support for CAC filings, company records, statutory registers, directors, shareholders, and post-incorporation obligations.",
    description:
      "Chaman Law Firm assists companies, directors, shareholders, and SMEs with legal questions connected to CAC records, annual returns, statutory registers, changes in company structure, and document consistency.",
    image: serviceHeroImages.legalService,
    imageAlt: "Corporate compliance advisory image for CAC records in Nigeria",
    keyPoints: [
      "CAC record and statutory-register review",
      "Director, shareholder, and structure-change guidance",
      "Annual return and post-incorporation compliance support",
      "Document consistency and transaction-readiness checks"
    ],
    process: [
      "Review incorporation records, CAC documents, registers, and current company facts",
      "Identify filing gaps, structure questions, and document inconsistencies",
      "Advise on regularization, records, and compliance steps",
      "Support documentation, filings, or transaction-readiness where appropriate"
    ],
    faqTopic: "CAC compliance and company records",
    faqAnswer:
      "Yes. The firm can review CAC records and advise companies on compliance, document consistency, and regularization steps."
  }),
  createSprint11tServicePage({
    slug: "corporate-governance-and-ethics-advisory",
    title: "Corporate Governance and Ethics Advisory",
    summary:
      "Governance guidance for directors, founders, shareholders, boards, SMEs, and companies reviewing decision-making, authority, ethics, and compliance risk.",
    description:
      "The firm advises on board processes, shareholder rights, company records, authority to act, conflict avoidance, compliance habits, and governance issues that may affect growth, investment, or disputes.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private corporate governance consultation at Chaman Law Firm",
    keyPoints: [
      "Board, director, and shareholder-authority review",
      "Governance documents and company-record guidance",
      "Conflict, ethics, and decision-making risk advice",
      "Support for SMEs, founders, and growing companies"
    ],
    process: [
      "Review company structure, governance documents, and decision history",
      "Identify authority, approval, conflict, and record-keeping gaps",
      "Advise on safer governance processes and documentation",
      "Support implementation, correspondence, or dispute prevention"
    ],
    faqTopic: "corporate governance and ethics",
    faqAnswer:
      "Yes. The firm can review governance documents and advise directors, shareholders, founders, and companies on risk and compliance."
  }),
  createSprint11tServicePage({
    slug: "mergers-and-acquisitions-advisory",
    title: "Mergers and Acquisitions Advisory",
    summary:
      "Legal guidance for companies, investors, founders, and shareholders reviewing acquisitions, restructuring, due diligence, approvals, and transaction risk.",
    description:
      "Chaman Law Firm advises clients on legal-risk issues connected to mergers, acquisitions, business transfers, shareholder approvals, due diligence, transaction documents, and completion planning.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm corporate team advising on merger and acquisition documents",
    keyPoints: [
      "Transaction structure and due diligence review",
      "Board, shareholder, and approval-risk guidance",
      "Contract, disclosure, and completion-document support",
      "Legal advice for buyers, sellers, investors, and companies"
    ],
    process: [
      "Clarify transaction objectives, parties, structure, and timeline",
      "Review company records, contracts, approvals, and due diligence materials",
      "Identify legal-risk issues, missing documents, and approval questions",
      "Advise on negotiation, documentation, closing, or risk containment"
    ],
    faqTopic: "mergers and acquisitions advisory",
    faqAnswer:
      "Yes. The firm can review the proposed transaction, documents, approvals, and risk issues before advising on next steps."
  }),
  createSprint11tServicePage({
    slug: "shareholder-decision-making-advisory",
    title: "Shareholder Decision-Making Advisory",
    summary:
      "Corporate-law guidance for shareholder decisions, resolutions, voting, company control, consent issues, and dispute-prevention strategy.",
    description:
      "The firm helps shareholders, directors, founders, and companies review decision-making powers, company documents, resolutions, authority questions, minority concerns, and governance-dispute risk.",
    image: serviceHeroImages.legalService,
    imageAlt: "Corporate legal advisory image for shareholder decision-making",
    keyPoints: [
      "Shareholder rights and voting-document review",
      "Resolution, consent, and company-control guidance",
      "Governance dispute and minority-risk assessment",
      "Advice for founders, companies, directors, and investors"
    ],
    process: [
      "Review the company documents, shareholding structure, and proposed decision",
      "Identify consent, authority, notice, and voting-risk issues",
      "Advise on lawful documentation and dispute-prevention steps",
      "Support resolutions, correspondence, or representation where required"
    ],
    faqTopic: "shareholder decision-making",
    faqAnswer:
      "Yes. The firm can review company documents and advise on shareholder decision-making, approvals, and dispute-prevention options."
  })
];

const sprint11tDebtServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "debt-demand-letter-advisory",
    title: "Debt Demand Letter Advisory",
    summary:
      "Legal guidance for creditors, businesses, landlords, lenders, and individuals preparing demand letters, settlement proposals, and recovery strategy.",
    description:
      "Chaman Law Firm reviews debt documents, invoices, contracts, payment history, correspondence, debtor identity, and enforcement context before advising on demand letters and recovery options.",
    image: serviceHeroImages.legalService,
    imageAlt: "Debt recovery advisory image for demand letter preparation",
    keyPoints: [
      "Debt document and payment-history review",
      "Demand letter and settlement-position guidance",
      "Commercial recovery and enforcement-risk assessment",
      "Pre-action strategy before escalation"
    ],
    process: [
      "Review the contract, invoice, loan, payment record, and correspondence",
      "Assess claim strength, debtor profile, and recovery objective",
      "Advise on demand wording, settlement options, and escalation risk",
      "Support negotiation, filing, or enforcement planning where appropriate"
    ],
    faqTopic: "debt demand letters",
    faqAnswer:
      "Yes. The firm can review the debt documents and advise on a demand strategy that fits the facts and recovery objective."
  }),
  createSprint11tServicePage({
    slug: "debt-collector-compliance-advisory",
    title: "Debt Collector Compliance Advisory",
    summary:
      "Legal-risk guidance for debt recovery conduct, creditor communications, settlement pressure, compliance boundaries, and dispute escalation.",
    description:
      "The firm advises creditors, businesses, lenders, and recovery teams on lawful debt recovery conduct, correspondence, documentation, settlement structure, and risk where recovery pressure may create disputes.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private legal consultation for debt recovery compliance",
    keyPoints: [
      "Recovery conduct and correspondence-risk review",
      "Creditor, lender, and recovery-team guidance",
      "Settlement and documentation strategy",
      "Litigation or enforcement pathway assessment"
    ],
    process: [
      "Review the debt history, communications, recovery attempts, and documents",
      "Identify conduct, evidence, and escalation-risk issues",
      "Advise on lawful correspondence and settlement options",
      "Support recovery strategy, documentation, or representation"
    ],
    faqTopic: "debt collector compliance",
    faqAnswer:
      "Yes. Chaman Law Firm can advise on debt recovery conduct and correspondence so recovery steps remain legally safer and properly documented."
  })
];

const sprint11tLitigationServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "limitation-periods-and-pre-action-advisory",
    title: "Limitation Periods and Pre-Action Advisory",
    summary:
      "Litigation-risk review for clients concerned about deadlines, limitation periods, pre-action steps, evidence preservation, and claim strategy.",
    description:
      "Chaman Law Firm reviews facts, dates, documents, correspondence, parties, remedies, and urgency before advising on limitation risk, pre-action strategy, and safer dispute-resolution options.",
    image: serviceHeroImages.legalService,
    imageAlt: "Litigation advisory image for limitation period and pre-action review",
    keyPoints: [
      "Date, document, and limitation-risk review",
      "Pre-action correspondence and evidence guidance",
      "Forum, remedy, and urgency assessment",
      "Litigation or settlement strategy"
    ],
    process: [
      "Collect key dates, documents, correspondence, and dispute facts",
      "Assess visible limitation, evidence, and pre-action risks",
      "Advise on correspondence, settlement, filing, or urgent next steps",
      "Support representation or documentation where appropriate"
    ],
    faqTopic: "limitation periods and pre-action advice",
    faqAnswer:
      "Yes. The firm can review dates, documents, and facts before advising on limitation risk and possible next steps."
  }),
  createSprint11tServicePage({
    slug: "interlocutory-applications-advisory",
    title: "Interlocutory Applications Advisory",
    summary:
      "Litigation support for interim applications, procedural strategy, evidence preparation, urgency review, and court-process risk.",
    description:
      "The firm assists clients and litigation teams with fact review, evidence organization, procedural strategy, urgency assessment, and legal-risk guidance before interlocutory or interim applications are considered.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm litigation lawyers reviewing court application documents",
    keyPoints: [
      "Interim application and procedural-risk review",
      "Evidence, affidavit, and document-readiness guidance",
      "Urgency, remedy, and forum assessment",
      "Litigation strategy before filing or response"
    ],
    process: [
      "Review the pleadings, facts, evidence, urgency, and desired remedy",
      "Identify procedural, evidential, and timing-risk issues",
      "Advise on filing, response, settlement, or strategy options",
      "Support documentation, representation, or negotiation"
    ],
    faqTopic: "interlocutory applications",
    faqAnswer:
      "Yes. Chaman Law Firm can review the facts and documents before advising on whether an interim application is appropriate."
  })
];

const sprint11tProbateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "inheritance-rights-stepchildren-advisory",
    title: "Inheritance Rights of Stepchildren Advisory",
    summary:
      "Private-client guidance for families reviewing inheritance questions, stepchildren, wills, estate documents, customary context, and family-dispute risk.",
    description:
      "Chaman Law Firm advises families, beneficiaries, executors, administrators, and diaspora clients after reviewing estate documents, family structure, marriage records, wills, property evidence, and dispute context.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private estate consultation for inheritance rights and family structure",
    keyPoints: [
      "Family structure and estate-document review",
      "Will, marriage, beneficiary, and property-record assessment",
      "Inheritance, probate, and administration-risk guidance",
      "Dispute-prevention and representation strategy"
    ],
    process: [
      "Review estate documents, family facts, relationships, and property records",
      "Identify inheritance, probate, or administration questions",
      "Advise on legal options, documentation, and dispute risk",
      "Support family correspondence, filing, or representation where appropriate"
    ],
    faqTopic: "inheritance rights and stepchildren",
    faqAnswer:
      "Yes. The firm can review the family facts and estate documents before advising on inheritance, probate, or administration issues."
  }),
  createSprint11tServicePage({
    slug: "testamentary-freedom-advisory",
    title: "Testamentary Freedom Advisory",
    summary:
      "Estate-planning and probate guidance on wills, testamentary decisions, family obligations, asset planning, and dispute-risk review.",
    description:
      "The firm advises clients on will planning, estate documents, family structure, property ownership, beneficiary issues, and dispute-risk questions before a will is prepared, challenged, or administered.",
    image: serviceHeroImages.legalService,
    imageAlt: "Estate planning legal advisory image for testamentary freedom",
    keyPoints: [
      "Will and estate-planning document review",
      "Family, beneficiary, and asset-ownership guidance",
      "Probate and dispute-risk assessment",
      "Private-client advice for local and diaspora families"
    ],
    process: [
      "Review the client's family structure, assets, objectives, and documents",
      "Identify planning, beneficiary, and dispute-risk issues",
      "Advise on will, probate, administration, or settlement options",
      "Support documentation or representation where required"
    ],
    faqTopic: "testamentary freedom and estate planning",
    faqAnswer:
      "Yes. Chaman Law Firm can review estate-planning objectives and documents before advising on will or probate-related risk."
  })
];

const sprint11tNotaryServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "apostille-and-document-legalization",
    title: "Apostille and Document Legalization Advisory",
    summary:
      "Document-readiness guidance for clients preparing documents for foreign use, notarization, legalization, attestation, apostille-related review, or institutional submission.",
    description:
      "Chaman Law Firm reviews the document type, destination country, purpose of use, identity records, notarization needs, translation issues, and institutional requirements before advising on a suitable document-readiness path.",
    image: serviceHeroImages.legalService,
    imageAlt: "Notary advisory image for apostille and document legalization",
    keyPoints: [
      "Foreign-use document-readiness review",
      "Notarization, attestation, and legalization guidance",
      "Identity, translation, and institutional-use assessment",
      "Advice before submission to foreign or local institutions"
    ],
    process: [
      "Confirm document type, destination, purpose, identity records, and deadline",
      "Review notarization, attestation, legalization, and translation questions",
      "Advise on the appropriate document-readiness pathway",
      "Support notarization or related legal documentation where appropriate"
    ],
    faqTopic: "apostille and document legalization",
    faqAnswer:
      "Yes. The firm can review the document and destination requirements before advising on notarization, attestation, or legalization steps."
  }),
  createSprint11tServicePage({
    slug: "document-legalization-and-attestation",
    title: "Document Legalization and Attestation",
    summary:
      "Legal guidance for individuals, businesses, students, families, and diaspora clients preparing documents for attestation, legalization, or foreign submission.",
    description:
      "The firm advises on document purpose, institutional requirements, notarization needs, identity consistency, supporting records, and legal-risk issues before documents are submitted locally or abroad.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers reviewing documents for attestation and legalization",
    keyPoints: [
      "Document-purpose and destination review",
      "Attestation, notarization, and legalization guidance",
      "Identity and supporting-record consistency checks",
      "Advice for education, immigration, business, and family use"
    ],
    process: [
      "Review the document, intended use, destination, and supporting records",
      "Identify notarization, attestation, translation, or consistency issues",
      "Advise on the practical documentation pathway",
      "Support notarization or related legal documentation where appropriate"
    ],
    faqTopic: "document legalization and attestation",
    faqAnswer:
      "Yes. Chaman Law Firm can review documents and advise on notarization, attestation, and legalization readiness."
  }),
  createSprint11tServicePage({
    slug: "legal-document-review",
    title: "Legal Document Review",
    summary:
      "Professional review of agreements, forms, deeds, letters, corporate documents, estate documents, and other legal papers before signing or use.",
    description:
      "Chaman Law Firm reviews documents for clarity, risk, missing terms, authority, enforceability concerns, dispute exposure, and alignment with the client's objective before signing, submission, or use.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private consultation for legal document review",
    keyPoints: [
      "Contract, deed, letter, and form review",
      "Risk, authority, and missing-term assessment",
      "Practical revision and negotiation guidance",
      "Advice before signing, filing, or submission"
    ],
    process: [
      "Collect the document, background facts, objective, and timeline",
      "Review key clauses, missing terms, authority, and legal-risk issues",
      "Advise on revisions, negotiation points, or safer next steps",
      "Support redrafting, correspondence, or representation where appropriate"
    ],
    faqTopic: "legal document review",
    faqAnswer:
      "Yes. The firm can review legal documents before signing, filing, submission, or negotiation."
  })
];

const sprint11tImmigrationServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "citizenship-application-advisory",
    title: "Citizenship Application Advisory",
    summary:
      "Immigration and document-readiness guidance for citizenship-related applications, eligibility review, identity records, residence history, and supporting documents.",
    description:
      "Chaman Law Firm reviews client facts, eligibility questions, identity documents, residence records, marriage or family documents, supporting evidence, and official-process risk before advising on citizenship application readiness.",
    image: serviceHeroImages.legalService,
    imageAlt: "Immigration legal advisory image for citizenship application review",
    keyPoints: [
      "Eligibility and document-readiness review",
      "Identity, residence, family, and supporting-record assessment",
      "Application-risk and consistency guidance",
      "Advice before submission, follow-up, or representation"
    ],
    process: [
      "Review the client's objective, identity records, residence history, and documents",
      "Identify eligibility questions, gaps, and consistency issues",
      "Advise on readiness, evidence, and practical next steps",
      "Support documentation or representation where appropriate"
    ],
    faqTopic: "citizenship application advisory",
    faqAnswer:
      "Yes. The firm can review eligibility documents and advise on citizenship application readiness and legal-risk issues."
  })
];

const sprint11tFamilyServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "customary-marriage-advisory",
    title: "Customary Marriage Advisory",
    summary:
      "Family-law guidance for clients reviewing customary marriage validity, documentation, family consent, matrimonial issues, and private-client risk.",
    description:
      "The firm advises clients after reviewing ceremony facts, family evidence, consent issues, records, location, relationship history, and related matrimonial or inheritance implications.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Private family law consultation for customary marriage advisory",
    keyPoints: [
      "Customary marriage fact and document review",
      "Consent, ceremony, and family-evidence assessment",
      "Matrimonial, inheritance, and private-client risk guidance",
      "Discreet advice before action or dispute escalation"
    ],
    process: [
      "Review marriage facts, family evidence, documents, and client objective",
      "Identify validity, consent, evidence, and dispute-risk questions",
      "Advise on family-law, documentation, or settlement options",
      "Support correspondence or representation where appropriate"
    ],
    faqTopic: "customary marriage advisory",
    faqAnswer:
      "Yes. Chaman Law Firm can review the facts and documents before advising on customary marriage and related family-law questions."
  }),
  createSprint11tServicePage({
    slug: "child-maintenance-and-support-advisory",
    title: "Child Maintenance and Support Advisory",
    summary:
      "Family-law guidance for parents and guardians reviewing child maintenance, support obligations, records, settlement options, and dispute risk.",
    description:
      "Chaman Law Firm handles child-related matters with care, reviewing parental facts, child welfare concerns, income records, support history, correspondence, and dispute context before advising on lawful options.",
    image: serviceHeroImages.legalService,
    imageAlt: "Family law advisory image for child maintenance and support",
    keyPoints: [
      "Child welfare and maintenance-document review",
      "Parental facts, income, and support-history assessment",
      "Settlement, correspondence, and dispute-risk guidance",
      "Discreet advice for parents and guardians"
    ],
    process: [
      "Review child-related facts, parental records, support history, and correspondence",
      "Identify welfare, maintenance, evidence, and dispute-risk issues",
      "Advise on settlement, documentation, or representation options",
      "Support lawful resolution with privacy and care"
    ],
    faqTopic: "child maintenance and support",
    faqAnswer:
      "Yes. The firm can review child-maintenance facts and documents before advising on appropriate family-law options."
  })
];

const sprint11tEmploymentServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "employment-contract-review",
    title: "Employment Contract Review",
    summary:
      "Legal review of employment contracts, executive terms, restrictive covenants, termination provisions, policies, and workplace-risk issues.",
    description:
      "Chaman Law Firm advises employees, executives, employers, HR teams, SMEs, and companies on employment terms, obligations, workplace policies, termination clauses, confidentiality, non-compete concerns, and settlement risk.",
    image: serviceHeroImages.legalService,
    imageAlt: "Employment law advisory image for contract review",
    keyPoints: [
      "Employment contract and policy review",
      "Termination, confidentiality, and restrictive-covenant guidance",
      "Employer and employee risk assessment",
      "Negotiation and documentation support"
    ],
    process: [
      "Review the employment contract, policies, role, compensation, and timeline",
      "Identify unclear terms, risk clauses, and compliance questions",
      "Advise on negotiation, revision, acceptance, or dispute options",
      "Support correspondence or settlement where appropriate"
    ],
    faqTopic: "employment contract review",
    faqAnswer:
      "Yes. The firm can review employment terms before signing, negotiation, termination, or settlement discussions."
  }),
  createSprint11tServicePage({
    slug: "workplace-compliance-advisory",
    title: "Workplace Compliance Advisory",
    summary:
      "Employment-law guidance for employers, employees, HR teams, SMEs, and organizations reviewing workplace compliance, policies, documentation, and dispute risk.",
    description:
      "The firm reviews workplace documents, policies, employee records, disciplinary processes, correspondence, statutory or procedural concerns, and settlement options before advising on employment-law risk.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers advising on employment compliance",
    keyPoints: [
      "Workplace policy and process review",
      "Employer compliance and employee-rights guidance",
      "Disciplinary, termination, and settlement-risk assessment",
      "Documentation and correspondence support"
    ],
    process: [
      "Review workplace policies, contracts, correspondence, and employment facts",
      "Identify compliance gaps, process risks, and documentation issues",
      "Advise on lawful options, settlement, or dispute-prevention steps",
      "Support correspondence, documentation, or representation"
    ],
    faqTopic: "workplace compliance advisory",
    faqAnswer:
      "Yes. Chaman Law Firm can advise employers and employees on workplace compliance, documentation, and dispute-risk issues."
  })
];

const sprint11tAdrServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "mediator-selection-and-quality-advisory",
    title: "Mediator Selection and Quality Advisory",
    summary:
      "ADR guidance for parties reviewing mediation suitability, mediator selection, settlement structure, confidentiality, and dispute-resolution strategy.",
    description:
      "Chaman Law Firm advises individuals, businesses, families, and organizations on mediation readiness, mediator suitability, issues for settlement, documentation, confidentiality, and escalation options if settlement fails.",
    image: serviceHeroImages.legalService,
    imageAlt: "ADR advisory image for mediator selection and mediation strategy",
    keyPoints: [
      "Mediation suitability and mediator-selection guidance",
      "Settlement issues and document-readiness review",
      "Confidentiality, escalation, and enforcement-risk advice",
      "ADR strategy before litigation or arbitration"
    ],
    process: [
      "Review the dispute facts, parties, documents, and desired outcome",
      "Assess whether mediation may assist and what issues need structure",
      "Advise on mediator selection, settlement terms, and documentation",
      "Support negotiation, mediation preparation, or escalation planning"
    ],
    faqTopic: "mediator selection and mediation strategy",
    faqAnswer:
      "Yes. The firm can help clients assess mediation suitability and prepare a structured, legally safer settlement approach."
  }),
  createSprint11tServicePage({
    slug: "arbitral-award-enforcement-advisory",
    title: "Arbitral Award Enforcement Advisory",
    summary:
      "Arbitration guidance for parties reviewing arbitral awards, enforcement risk, settlement options, court interface, and commercial dispute strategy.",
    description:
      "The firm reviews arbitral awards, arbitration documents, parties, assets, jurisdictional issues, settlement history, and enforcement context before advising on legal strategy.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm lawyers reviewing arbitral award enforcement documents",
    keyPoints: [
      "Arbitral award and arbitration-document review",
      "Enforcement, settlement, and court-interface guidance",
      "Commercial dispute and asset-risk assessment",
      "Strategy for award creditors and responding parties"
    ],
    process: [
      "Review the award, arbitration agreement, filings, correspondence, and parties",
      "Identify enforcement, jurisdiction, asset, and procedural-risk issues",
      "Advise on settlement, enforcement, challenge, or representation options",
      "Support documentation or proceedings where appropriate"
    ],
    faqTopic: "arbitral award enforcement",
    faqAnswer:
      "Yes. Chaman Law Firm can review the award and arbitration records before advising on enforcement or response strategy."
  })
];

const wave3PropertyServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "property-document-review",
    title: "Property Document Review",
    summary:
      "Legal review of property sale agreements, title documents, allocation papers, survey documents, powers of attorney, and completion documents before clients sign or pay.",
    description:
      "Chaman Law Firm reviews Nigerian property documents for buyers, sellers, landlords, families, investors, and diaspora clients before signing, payment, perfection, completion, or dispute escalation.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Chaman Law Firm lawyer reviewing Nigerian property documents",
    keyPoints: [
      "Sale agreement, deed, survey, and title-document review",
      "Seller authority, payment trail, and completion-risk guidance",
      "Diaspora and family-property document support",
      "Advice before signing, payment, perfection, or dispute steps"
    ],
    process: [
      "Collect the transaction documents, parties, payment history, and client objective",
      "Review title consistency, authority, execution, survey, and risk indicators",
      "Identify missing documents, unsafe clauses, and issues requiring verification",
      "Advise on safer signing, amendment, completion, or withdrawal options"
    ],
    faqTopic: "property document review",
    faqAnswer:
      "Yes. The firm can review sale agreements, deeds, survey documents, allocation papers, powers of attorney, and related property documents before signing or payment."
  })
];

const wave3CorporateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "company-compliance-and-records",
    title: "Company Compliance and Records",
    summary:
      "Corporate compliance guidance for company records, director and shareholder documentation, CAC filings, resolutions, registers, contracts, and governance gaps.",
    description:
      "Chaman Law Firm helps companies, founders, directors, shareholders, SMEs, and investors review company records, compliance documents, board authority, shareholder decisions, and governance-risk issues.",
    image: serviceHeroImages.legalService,
    imageAlt: "Corporate legal documents for company compliance and records advisory",
    keyPoints: [
      "Company record and governance-document review",
      "Director, shareholder, and board authority guidance",
      "CAC, register, resolution, and compliance-readiness support",
      "Risk advice before investment, transaction, or dispute steps"
    ],
    process: [
      "Confirm company structure, transaction context, and document gaps",
      "Review records, resolutions, registers, contracts, and compliance history",
      "Identify authority, filing, governance, and document-risk issues",
      "Advise on remediation, transaction readiness, or dispute-prevention steps"
    ],
    faqTopic: "company compliance and records",
    faqAnswer:
      "Yes. The firm can review company records, resolutions, registers, CAC documents, governance documents, and transaction-readiness issues."
  })
];

const wave3DebtServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "commercial-debt-settlement",
    title: "Commercial Debt Settlement",
    summary:
      "Debt recovery and settlement guidance for creditors, businesses, suppliers, borrowers, guarantors, and counterparties seeking practical resolution before escalation.",
    description:
      "Chaman Law Firm advises on commercial debt demands, settlement structure, repayment documents, guarantor issues, enforcement risk, negotiation, and litigation-readiness where settlement fails.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm team reviewing commercial debt settlement documents",
    keyPoints: [
      "Debt demand, settlement, and repayment-document review",
      "Creditor, debtor, guarantor, and business-counterparty guidance",
      "Negotiation and litigation-readiness support",
      "Advice on safer enforcement or settlement pathways"
    ],
    process: [
      "Review the debt documents, invoices, correspondence, admissions, and payment history",
      "Assess evidence, limitation risk, parties, guarantors, and settlement options",
      "Prepare or review demand, repayment, settlement, or security documents",
      "Support negotiation, enforcement strategy, or litigation preparation"
    ],
    faqTopic: "commercial debt settlement",
    faqAnswer:
      "Yes. The firm can advise on demand letters, repayment plans, settlement documentation, negotiation, and escalation where commercial debt remains unpaid."
  })
];

const wave3ProbateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "estate-administration-strategy",
    title: "Estate Administration Strategy",
    summary:
      "Probate and estate-administration guidance for families, executors, administrators, beneficiaries, diaspora relatives, and property-linked estates in Nigeria.",
    description:
      "Chaman Law Firm advises families, executors, administrators, beneficiaries, and diaspora relatives on estate documents, probate questions, letters of administration, beneficiary disputes, property transfer, and strategy before filings or settlement.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Probate and estate administration legal advisory by Chaman Law Firm",
    keyPoints: [
      "Probate, letters of administration, and estate-document review",
      "Executor, administrator, beneficiary, and family-dispute guidance",
      "Diaspora estate and Nigerian property-transfer support",
      "Strategy before filing, settlement, or dispute escalation"
    ],
    process: [
      "Confirm family facts, death records, estate assets, documents, and client authority",
      "Review will, probate, administration, property, and beneficiary issues",
      "Identify filing, representation, consent, dispute, and transfer risks",
      "Advise on probate, administration, settlement, or litigation strategy"
    ],
    faqTopic: "estate administration strategy",
    faqAnswer:
      "Yes. The firm can guide families, executors, administrators, and beneficiaries through probate and estate-administration strategy in Nigeria."
  })
];

const wave3EmploymentServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "workplace-documentation-review",
    title: "Workplace Documentation Review",
    summary:
      "Employment-law review for contracts, staff handbooks, disciplinary records, termination documents, settlement terms, workplace policies, and compliance gaps.",
    description:
      "Chaman Law Firm reviews workplace documents for employers, employees, founders, HR teams, executives, and consultants before signing, discipline, termination, settlement, or dispute escalation.",
    image: serviceHeroImages.legalService,
    imageAlt: "Employment-law document review and workplace compliance advisory",
    keyPoints: [
      "Employment contract, policy, and handbook review",
      "Disciplinary, termination, settlement, and workplace-risk guidance",
      "Employer and employee advisory",
      "Advice before signing, implementation, or dispute escalation"
    ],
    process: [
      "Collect the employment documents, correspondence, timeline, and desired outcome",
      "Review contractual terms, policies, disciplinary steps, and compliance questions",
      "Identify risk, missing records, unfair-process concerns, and negotiation issues",
      "Advise on safer documentation, settlement, compliance, or dispute strategy"
    ],
    faqTopic: "workplace documentation review",
    faqAnswer:
      "Yes. The firm can review employment contracts, policies, staff handbooks, disciplinary records, termination documents, and settlement terms."
  })
];

const wave3NotaryServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "document-authentication-advisory",
    title: "Document Authentication Advisory",
    summary:
      "Notarial and document-authentication guidance for affidavits, powers of attorney, corporate documents, academic records, immigration files, and cross-border use.",
    description:
      "Chaman Law Firm advises clients on document authentication, notarization, powers of attorney, affidavits, certified copies, cross-border document use, and related legal-document readiness.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Notarial and document authentication advisory by Chaman Law Firm",
    keyPoints: [
      "Notarial, authentication, and certified-copy guidance",
      "Power of attorney, affidavit, and corporate-document support",
      "Immigration, academic, commercial, and cross-border document use",
      "Document-readiness advice before submission or execution"
    ],
    process: [
      "Confirm the document type, destination, issuing authority, and intended use",
      "Review identity, execution, certification, translation, and authentication questions",
      "Identify missing steps or authority-specific requirements",
      "Advise on notarization, authentication, certification, or further legal-document support"
    ],
    faqTopic: "document authentication",
    faqAnswer:
      "Yes. The firm can advise on notarization, document authentication, certified copies, powers of attorney, affidavits, and cross-border document use."
  })
];

const wave4PropertyServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "land-document-verification",
    title: "Land Document Verification",
    summary: "Focused review of land documents, seller authority, title history, survey details, payment risk, and completion documents before purchase or dispute steps.",
    description: "Chaman Law Firm helps clients verify land documents in Nigeria before purchase, perfection, family-property decisions, dispute escalation, or transaction completion.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Chaman Law Firm land document verification advisory",
    keyPoints: ["Title and survey-document review", "Seller authority and family-land risk checks", "Payment, possession, and completion-risk guidance", "Written next-step advice before signing or payment"],
    process: ["Collect the title documents, survey, seller details, transaction history, and client objective", "Review authority, title consistency, location, possession, and transaction-risk indicators", "Identify missing documents and questions requiring further verification", "Advise on safer completion, renegotiation, withdrawal, or dispute strategy"],
    faqTopic: "land document verification",
    faqAnswer: "Yes. The firm can review land documents, seller authority, title history, survey details, and transaction risks before payment or completion."
  }),
  createSprint11tServicePage({
    slug: "tenancy-document-review",
    title: "Tenancy Document Review",
    summary: "Review of tenancy agreements, quit notices, rent documents, renewal terms, recovery notices, and landlord-tenant dispute records.",
    description: "The firm advises landlords, tenants, property managers, and businesses on tenancy documents, notice compliance, lease-risk issues, and dispute-prevention steps.",
    image: serviceHeroImages.legalService,
    imageAlt: "Tenancy document review and landlord tenant advisory in Nigeria",
    keyPoints: ["Tenancy agreement and renewal-term review", "Quit notice and recovery-document guidance", "Landlord, tenant, and business-occupier advisory", "Dispute-prevention and negotiation support"],
    process: ["Collect the tenancy agreement, notices, rent records, correspondence, and dispute timeline", "Review the documents for authority, notice, payment, and procedural-risk issues", "Identify gaps, negotiation options, and likely next steps", "Advise on settlement, document correction, or formal recovery strategy"],
    faqTopic: "tenancy document review",
    faqAnswer: "Yes. Chaman Law Firm can review tenancy agreements, quit notices, renewal documents, rent records, and landlord-tenant dispute documents."
  }),
  createSprint11tServicePage({
    slug: "property-dispute-pre-action-advisory",
    title: "Property Dispute Pre-Action Advisory",
    summary: "Early legal strategy for property disputes involving title, possession, family land, boundaries, tenancy, fraud concerns, and transaction breakdown.",
    description: "Chaman Law Firm helps clients assess property disputes before litigation by reviewing documents, evidence, negotiation options, urgent risk, and procedural strategy.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Chaman Law Firm property dispute pre-action advisory",
    keyPoints: ["Document and evidence review before property litigation", "Possession, title, family-land, and boundary-risk assessment", "Negotiation, settlement, and urgent-step guidance", "Pre-action strategy for property owners and buyers"],
    process: ["Review the dispute facts, documents, parties, and urgency", "Assess title, possession, authority, evidence, and limitation issues", "Identify negotiation, preservation, and formal-action options", "Advise on correspondence, settlement, or litigation-readiness steps"],
    faqTopic: "property dispute pre-action advisory",
    faqAnswer: "Yes. The firm can review the documents and advise on settlement, negotiation, urgent protection, or litigation strategy before a property dispute escalates."
  })
];

const wave4CorporateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "company-secretarial-record-review",
    title: "Company Secretarial Record Review",
    summary: "Review of company registers, resolutions, CAC records, board decisions, shareholder records, filings, and governance-document gaps.",
    description: "Chaman Law Firm supports companies, directors, founders, investors, and shareholders with company-record review, governance-document cleanup, and transaction-readiness advice.",
    image: serviceHeroImages.legalService,
    imageAlt: "Company secretarial records and corporate governance review",
    keyPoints: ["Company register, resolution, and CAC-record review", "Director, shareholder, and board-authority guidance", "Governance cleanup before investment or dispute", "Document-readiness advice for transactions"],
    process: ["Collect company records, CAC documents, resolutions, registers, and transaction context", "Review authority, filings, governance gaps, and shareholder-document issues", "Identify missing records and decision-making risks", "Advise on remediation, transaction readiness, or dispute prevention"],
    faqTopic: "company secretarial record review",
    faqAnswer: "Yes. The firm can review company registers, resolutions, CAC records, shareholder records, and governance documents."
  }),
  createSprint11tServicePage({
    slug: "contract-risk-review",
    title: "Contract Risk Review",
    summary: "Practical legal review of commercial contracts, service agreements, supply contracts, employment-related contracts, settlement terms, and transaction documents.",
    description: "The firm reviews contracts for risk allocation, authority, enforceability, payment terms, termination, dispute clauses, compliance, and practical execution issues.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Contract risk review by Chaman Law Firm",
    keyPoints: ["Commercial and transaction-contract review", "Risk allocation, payment, termination, and dispute-clause guidance", "Authority and execution checks", "Negotiation and amendment support"],
    process: ["Confirm the transaction objective, parties, draft contract, and negotiation context", "Review legal risk, obligations, authority, remedies, and dispute clauses", "Identify unsafe clauses, missing protections, and practical concerns", "Advise on revisions, negotiation, signing, or withdrawal"],
    faqTopic: "contract risk review",
    faqAnswer: "Yes. Chaman Law Firm can review contracts before signing and advise on risk, amendments, negotiation, and practical enforcement issues."
  })
];

const wave4LitigationServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "pre-action-litigation-advisory",
    title: "Pre-Action Litigation Advisory",
    summary: "Litigation-readiness advice before filing or responding to claims, including evidence review, limitation risk, notices, settlement options, and dispute strategy.",
    description: "Chaman Law Firm helps clients evaluate disputes before litigation by reviewing evidence, documents, parties, deadlines, settlement options, and procedural risk.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Pre-action litigation advisory and dispute strategy",
    keyPoints: ["Evidence and document review before litigation", "Limitation, notice, jurisdiction, and procedural-risk guidance", "Settlement and negotiation strategy", "Claimant and respondent advisory"],
    process: ["Review facts, documents, parties, evidence, and urgency", "Assess limitation, jurisdiction, remedies, and proof issues", "Identify settlement, correspondence, and litigation options", "Advise on pre-action strategy and next steps"],
    faqTopic: "pre-action litigation advisory",
    faqAnswer: "Yes. The firm can review a dispute before filing or responding to court action and advise on practical litigation strategy."
  })
];

const wave4DebtServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "debt-settlement-documentation",
    title: "Debt Settlement Documentation",
    summary: "Legal support for debt settlement terms, repayment agreements, demand letters, admissions, security documents, guarantees, and enforcement-risk planning.",
    description: "Chaman Law Firm helps creditors, debtors, guarantors, and businesses document debt settlements and assess legal risk before enforcement or litigation.",
    image: serviceHeroImages.legalService,
    imageAlt: "Debt settlement documentation and recovery advisory",
    keyPoints: ["Debt settlement and repayment-document review", "Demand, admission, guarantee, and security-document guidance", "Creditor, debtor, and guarantor advisory", "Enforcement and litigation-readiness support"],
    process: ["Review the debt documents, payment history, correspondence, and admissions", "Assess evidence, parties, settlement terms, guarantees, and security issues", "Prepare or review repayment, settlement, or demand documents", "Advise on negotiation, enforcement, or litigation strategy"],
    faqTopic: "debt settlement documentation",
    faqAnswer: "Yes. The firm can help document debt settlements, repayment plans, demand letters, guarantees, and enforcement strategy."
  })
];

const wave4ProbateServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "probate-family-settlement-advisory",
    title: "Probate Family Settlement Advisory",
    summary: "Guidance for families, beneficiaries, executors, and administrators seeking settlement of estate, inheritance, probate, and property-transfer disputes.",
    description: "Chaman Law Firm advises families and estate representatives on probate documents, family settlement terms, beneficiary issues, inherited property, and dispute-prevention strategy.",
    image: serviceHeroImages.managingPartnerOffice,
    imageAlt: "Probate family settlement advisory in Nigeria",
    keyPoints: ["Family settlement and estate-document review", "Executor, administrator, and beneficiary guidance", "Inherited property and probate-risk advice", "Settlement, documentation, or dispute strategy"],
    process: ["Confirm family facts, estate documents, parties, assets, and dispute history", "Review probate, administration, beneficiary, and property-transfer issues", "Identify settlement options, consent questions, and risk areas", "Advise on documentation, filing, negotiation, or dispute strategy"],
    faqTopic: "probate family settlement",
    faqAnswer: "Yes. The firm can advise families and estate representatives on probate settlement, beneficiary issues, and inherited-property documentation."
  })
];

const wave4FamilyServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "family-agreement-review",
    title: "Family Agreement Review",
    summary: "Review of family agreements involving property, child arrangements, maintenance, settlement terms, inheritance, marriage-related issues, and dispute prevention.",
    description: "Chaman Law Firm helps clients review family agreements and settlement terms before signing, implementation, or escalation into formal proceedings.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Family agreement review and settlement advisory",
    keyPoints: ["Family settlement and agreement review", "Property, maintenance, child, and inheritance-related guidance", "Documentation and consent-risk advice", "Dispute-prevention and escalation strategy"],
    process: ["Collect the agreement, family facts, documents, and intended outcome", "Review authority, consent, obligations, property, and child-related issues", "Identify unclear terms, enforcement concerns, and negotiation options", "Advise on revision, documentation, settlement, or formal legal steps"],
    faqTopic: "family agreement review",
    faqAnswer: "Yes. The firm can review family agreements, settlement terms, and related documents before signing or implementation."
  })
];

const wave4ImmigrationServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "immigration-document-review",
    title: "Immigration Document Review",
    summary: "Legal review of immigration, residency, citizenship, business immigration, expatriate, employment, and supporting documents connected with Nigeria.",
    description: "Chaman Law Firm advises individuals, families, employers, founders, and expatriates on immigration-document readiness, legal risk, authority, and supporting records.",
    image: serviceHeroImages.legalService,
    imageAlt: "Immigration document review and Nigerian legal advisory",
    keyPoints: ["Immigration and supporting-document review", "Business, employment, family, and expatriate context", "Document-readiness and legal-risk guidance", "Advice before submission, response, or escalation"],
    process: ["Confirm immigration objective, documents, parties, and urgency", "Review identity, authority, employment, business, family, and supporting records", "Identify gaps, inconsistencies, and legal-risk questions", "Advise on next steps, documentation, or professional coordination"],
    faqTopic: "immigration document review",
    faqAnswer: "Yes. The firm can review immigration-related documents and advise on legal-risk and document-readiness issues connected with Nigeria."
  })
];

const wave4AdrServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "mediation-settlement-document-review",
    title: "Mediation Settlement Document Review",
    summary: "Review of mediation settlement terms, negotiation records, confidentiality clauses, payment terms, family or commercial settlement documents, and enforcement risk.",
    description: "Chaman Law Firm assists parties reviewing settlement documents before or after mediation, with attention to clarity, enforceability, obligations, payment terms, and future dispute risk.",
    image: serviceHeroImages.firmTeam,
    imageAlt: "Mediation settlement document review by Chaman Law Firm",
    keyPoints: ["Mediation and settlement-document review", "Payment, confidentiality, release, and enforcement-risk guidance", "Commercial, family, property, and employment settlement support", "Negotiation and documentation advice"],
    process: ["Review the dispute facts, settlement draft, correspondence, and obligations", "Assess clarity, enforceability, payment terms, release clauses, and future-risk issues", "Identify amendments, missing protections, or negotiation points", "Advise on signing, revision, implementation, or escalation options"],
    faqTopic: "mediation settlement document review",
    faqAnswer: "Yes. The firm can review settlement terms before signing and advise on obligations, enforceability, and practical risk."
  })
];

const wave4NotaryServicePages: ServicePage[] = [
  createSprint11tServicePage({
    slug: "notarial-document-readiness",
    title: "Notarial Document Readiness",
    summary: "Readiness review for documents intended for notarization, certification, authentication, powers of attorney, affidavits, corporate use, or cross-border submission.",
    description: "Chaman Law Firm helps clients review legal-document readiness before notarization, certification, authentication, execution, or cross-border use.",
    image: serviceHeroImages.legalService,
    imageAlt: "Notarial document readiness and authentication advisory",
    keyPoints: ["Notarial and authentication-readiness review", "Powers of attorney, affidavits, corporate, and personal documents", "Execution, identity, certification, and destination-use guidance", "Advice before notarization or submission"],
    process: ["Confirm the document type, destination, purpose, and signing context", "Review execution, identity, authority, certification, and supporting-record issues", "Identify missing readiness steps or inconsistencies", "Advise on notarization, certification, authentication, or legal-document support"],
    faqTopic: "notarial document readiness",
    faqAnswer: "Yes. The firm can review whether documents are ready for notarization, certification, authentication, or cross-border use."
  })
];

export const practiceAreas: PracticeArea[] = [
  {
    slug: "property-real-estate-law",
    title: "Property & Real Estate Law",
    shortTitle: "Property Law",
    eyebrow: "Signature Expertise",
    summary:
      "Strategic legal support for property buyers, investors, developers, landlords, families, and diaspora clients handling Nigerian real estate decisions.",
    description:
      "Chaman Law Firm is particularly recognized for property law and real estate transactions. The firm supports property verification, due diligence, title investigation, Governor's Consent, documentation, acquisition advisory, land transactions, leases, recovery of premises, and property dispute resolution.",
    services: [
      "Property verification",
      "Due diligence",
      "Title investigation",
      "Governor's Consent",
      "Mortgage document review",
      "Joint property advisory",
      "Property-owner rights advisory",
      "Land Use Act advisory",
      "Land registration advisory",
      "Landlord and tenant advisory",
      "Land Use Charge advisory",
      "Land sale restrictions",
      "Family land sale consent",
      "Quit notice advisory",
      "Planning compliance advisory",
      "Land tenure systems review",
      "Land title document checks",
      "Land purchase due diligence",
      "Tenancy agreement review",
      "Property dispute advisory",
      "Government acquisition advisory",
      "Building completion certificate advisory",
      "Fencing approval advisory",
      "Property documentation",
      "Property acquisition advisory",
      "Land transactions",
      "Property dispute resolution",
      "Diaspora property services"
    ],
    servicePages: [...propertyServicePages, ...sprint11sPropertyServicePages, ...sprint11tPropertyServicePages, ...wave3PropertyServicePages, ...wave4PropertyServicePages],
    commonIssues: [
      "Unverified title documents",
      "Family land and seller-authority disputes",
      "Incomplete perfection or consent history",
      "Fraud risk before payment",
      "Tenancy and recovery of premises",
      "Diaspora buyers needing trusted representation"
    ],
    whoWeHelp: [
      "Property buyers",
      "Property investors",
      "Real estate developers",
      "Landlords and property owners",
      "Diaspora Nigerians",
      "Foreign investors",
      "Families managing inherited property"
    ],
    process: [
      "Review the transaction facts, client objective, documents, and urgency",
      "Investigate title, authority, documentation, possession, and visible risk indicators",
      "Prepare legal advice, transaction documents, representation strategy, or dispute pathway",
      "Guide completion, perfection, enforcement, settlement, or withdrawal where needed"
    ],
    faqs: [
      {
        question: "Can Chaman Law Firm verify land before I pay?",
        answer:
          "Yes. The firm can review title documents, investigate ownership issues, assess seller authority, identify transaction risks, and advise on safer completion steps before payment."
      },
      {
        question: "Do you assist Nigerians abroad buying property in Nigeria?",
        answer:
          "Yes. The firm supports diaspora clients with property due diligence, document review, power of attorney, transaction representation, probate matters, and investment protection."
      },
      {
        question: "Can the firm help with Governor's Consent?",
        answer:
          "Yes. The firm can review title history and advise on consent, perfection, document readiness, and risk where property interests require regularization."
      }
    ],
    relatedDownloads: ["property-due-diligence-checklist", "diaspora-property-legal-guide"],
    seoKeywords: [
      "property lawyer Nigeria",
      "real estate lawyer Lagos",
      "property verification Nigeria",
      "diaspora property lawyer Nigeria",
      "Governor's Consent lawyer"
    ],
    featured: true
  },
  {
    slug: "corporate-commercial-law",
    title: "Corporate & Commercial Law",
    shortTitle: "Corporate Law",
    eyebrow: "Business Advisory",
    summary:
      "Practical legal support for companies, SMEs, startups, investors, directors, and commercial transactions.",
    description:
      "The firm advises on company formation, corporate governance, commercial transactions, regulatory compliance, contract drafting, business advisory, investment documentation, and retainership support.",
    services: [
      "Company formation",
      "Corporate governance",
      "Commercial transactions",
      "Regulatory compliance",
      "Tax clearance certificate guidance",
      "Securities regulatory compliance",
      "Board governance advisory",
      "Share transfer advisory",
      "Minor contract capacity advisory",
      "Ultra vires and corporate powers",
      "Regulatory bodies and compliance",
      "Business name registration advisory",
      "Startup compliance advisory",
      "CAC compliance and company records",
      "Corporate governance and ethics advisory",
      "Mergers and acquisitions advisory",
      "Shareholder decision-making advisory",
      "Contract drafting",
      "Business advisory",
      "Retainership support"
    ],
    servicePages: [
      ...sprint11sCorporateServicePages,
      ...sprint11tCorporateServicePages,
      ...wave3CorporateServicePages,
      ...wave4CorporateServicePages,
      {
        slug: "contract-drafting-review",
        title: "Contract Drafting & Review",
        summary: "Drafting and review support for commercial agreements, business contracts, and transaction documents.",
        description:
          "Chaman Law Firm reviews and drafts contracts with attention to risk allocation, enforceability, commercial practicality, dispute prevention, and client objectives.",
        keyPoints: ["Commercial contract review", "Risk allocation", "Negotiation support", "Transaction documentation"],
        process: ["Clarify the business objective", "Review terms and risk", "Draft or revise the document", "Support negotiation and execution"],
        faqs: [
          {
            question: "Can the firm review an agreement before I sign?",
            answer:
              "Yes. The firm can review the agreement, identify risks, propose revisions, and advise before execution."
          }
        ]
      },
      {
        slug: "corporate-governance",
        title: "Corporate Governance",
        summary: "Governance support for directors, shareholders, founders, companies, and growing businesses.",
        description:
          "The firm supports corporate governance, board advisory, shareholder documentation, compliance habits, company records, and business structuring.",
        keyPoints: ["Director and shareholder advisory", "Governance documents", "Compliance support", "Business structuring"],
        process: ["Review company structure", "Identify governance gaps", "Prepare documents or advice", "Support implementation"],
        faqs: [
          {
            question: "Do SMEs need corporate governance support?",
            answer:
              "Yes. Clear governance helps reduce disputes, clarify authority, protect founders, and support investor confidence."
          }
        ]
      },
      {
        slug: "tax-clearance-certificate",
        title: "Tax Clearance Certificate",
        summary:
          "Legal and compliance guidance for individuals, companies, directors, investors, and businesses preparing tax-clearance certificate applications or document reviews in Nigeria.",
        description:
          "Chaman Law Firm helps clients organize legal and compliance questions connected to tax-clearance certificate requests, business documentation, corporate transactions, tender preparation, immigration or regulatory needs, and related document review. Requirements can vary by taxpayer type, authority, and transaction context, so the firm reviews the facts before advising.",
        image: serviceHeroImages.legalService,
        imageAlt: "Legal and compliance advisory image for tax clearance certificate guidance in Nigeria",
        keyPoints: [
          "Tax-clearance document and compliance-readiness review",
          "Company, director, investor, and individual advisory",
          "Regulatory, tender, immigration, and transaction-support context",
          "Practical guidance without replacing tax-authority assessment"
        ],
        process: [
          "Confirm the taxpayer profile, purpose of the certificate, relevant authority, and urgency",
          "Review available tax, company, identification, transaction, or regulatory documents",
          "Identify documentation gaps, compliance questions, and issues needing accountant or tax-authority coordination",
          "Advise on next steps, supporting documents, correspondence, or transaction-risk management"
        ],
        faqs: [
          {
            question: "Who may need a tax clearance certificate?",
            answer:
              "Individuals, companies, directors, investors, contractors, and regulated businesses may need tax-clearance evidence depending on the transaction, tender, regulatory, immigration, or compliance purpose."
          },
          {
            question: "Can a lawyer assist with tax-clearance readiness?",
            answer:
              "Yes. A lawyer can help review the legal and document-readiness issues, coordinate with appropriate professionals where needed, and advise on transaction or compliance risk."
          }
        ]
      },
      {
        slug: "securities-regulatory-compliance",
        title: "Securities Regulatory Compliance",
        summary:
          "Legal guidance for companies, founders, directors, investors, and regulated businesses reviewing securities, investment, disclosure, fundraising, and regulatory-compliance questions.",
        description:
          "Chaman Law Firm advises clients on securities and capital-market-facing legal questions, including investment documentation, fundraising structure, disclosure issues, board authority, shareholder approvals, and regulatory risk. The service is framed as legal and compliance guidance and should be reviewed against the client's exact transaction and regulatory context.",
        image: serviceHeroImages.legalService,
        imageAlt: "Corporate legal advisory image for securities and regulatory compliance in Nigeria",
        keyPoints: [
          "Investment, fundraising, and disclosure-risk review",
          "Board, shareholder, and transaction-authority guidance",
          "Regulatory-compliance and document-readiness support",
          "Legal advice for companies, investors, directors, and founders"
        ],
        process: [
          "Confirm the business model, transaction, investor profile, documents, and compliance concern",
          "Review governance, disclosure, authorization, contract, and regulatory-risk questions",
          "Identify gaps requiring further legal, accounting, or regulator-facing clarification",
          "Advise on safer documentation, transaction structure, approvals, and compliance next steps"
        ],
        faqs: [
          {
            question: "When should a business seek securities compliance advice?",
            answer:
              "A business should seek advice before fundraising, issuing investment documents, changing ownership structure, making public-facing investment claims, or entering regulated capital-market transactions."
          },
          {
            question: "Does this service replace regulator approval?",
            answer:
              "No. The firm provides legal and document-readiness guidance. Any required regulator filing, approval, or professional clearance depends on the specific facts and applicable rules."
          }
        ]
      },
      {
        slug: "board-governance",
        title: "Board Governance Advisory",
        summary:
          "Corporate governance advice for directors, shareholders, founders, company secretaries, investors, and organizations managing board authority, resolutions, meetings, and compliance records.",
        description:
          "Chaman Law Firm assists businesses with board-governance questions, director duties, company records, resolutions, meeting documentation, authority to act, shareholder relationships, and dispute-prevention systems.",
        image: serviceHeroImages.firmTeam,
        imageAlt: "Chaman Law Firm corporate lawyers advising on board governance and company records",
        keyPoints: [
          "Director, board, and shareholder authority review",
          "Resolution, minutes, meeting, and record-keeping support",
          "Governance-risk guidance for founders, investors, and SMEs",
          "Dispute-prevention and compliance-document advisory"
        ],
        process: [
          "Review the company structure, records, shareholders, directors, and governance concern",
          "Identify authority gaps, missing resolutions, record-keeping issues, and conflict risks",
          "Advise on required governance documents, approvals, meeting steps, or internal controls",
          "Support implementation through documents, correspondence, negotiation, or ongoing advisory"
        ],
        faqs: [
          {
            question: "Why is board governance important for SMEs?",
            answer:
              "Clear governance helps companies document authority, reduce founder or shareholder disputes, improve compliance, and support lender or investor confidence."
          },
          {
            question: "Can Chaman Law Firm prepare board resolutions?",
            answer:
              "Yes. The firm can review the company facts and prepare or review resolutions, minutes, notices, and related documents where appropriate."
          }
        ]
      },
      {
        slug: "share-transfer",
        title: "Share Transfer Advisory",
        summary:
          "Legal support for share transfer, shareholder changes, board approvals, transfer documents, corporate records, and transaction-risk review for Nigerian companies.",
        description:
          "Chaman Law Firm advises companies, founders, shareholders, directors, investors, and buyers on share-transfer processes, authority, documentation, company-record updates, restrictions, and dispute-risk questions.",
        image: serviceHeroImages.legalService,
        imageAlt: "Corporate law image for share transfer advisory and company documentation",
        keyPoints: [
          "Share-transfer document and authority review",
          "Board, shareholder, and company-record guidance",
          "Transfer restrictions, consideration, and dispute-risk checks",
          "Support for buyers, sellers, founders, directors, and investors"
        ],
        process: [
          "Confirm the company structure, shareholders, proposed transfer, documents, and objectives",
          "Review authority, restrictions, approvals, consideration, tax or compliance questions, and records",
          "Identify missing documents, unclear rights, and issues requiring professional coordination",
          "Advise on safer completion steps, record updates, filings, and transaction documentation"
        ],
        faqs: [
          {
            question: "Can shares be transferred without reviewing company documents?",
            answer:
              "Company records, agreements, articles, restrictions, approvals, and transaction documents should be reviewed before completing a share transfer."
          },
          {
            question: "Who may need share-transfer legal advice?",
            answer:
              "Founders, shareholders, directors, investors, buyers, sellers, and companies may need advice before changing ownership records or completing investment-related transfers."
          }
        ]
      }
    ],
    commonIssues: [
      "Weak contracts",
      "Unclear shareholder or director authority",
      "Regulatory compliance gaps",
      "Unstructured business relationships",
      "Commercial disputes caused by poor documentation"
    ],
    whoWeHelp: ["SMEs", "Startups", "Corporate organizations", "Directors", "Investors", "Foreign companies"],
    process: [
      "Clarify the commercial objective",
      "Identify contractual, regulatory, governance, and transaction risks",
      "Draft, review, negotiate, or structure the required documents",
      "Support execution, compliance, and ongoing advisory"
    ],
    faqs: [
      {
        question: "Can the firm review commercial agreements?",
        answer:
          "Yes. Chaman Law Firm reviews, drafts, and negotiates commercial agreements with attention to risk allocation, enforceability, and business practicality."
      },
      {
        question: "Can the firm advise startups and SMEs?",
        answer:
          "Yes. The firm supports startups and SMEs with structure, contracts, compliance, governance, and commercial advisory."
      }
    ],
    relatedDownloads: ["business-contract-review-brief"],
    seoKeywords: ["corporate lawyer Nigeria", "commercial law firm Nigeria", "contract review lawyer Lagos"],
    featured: true
  },
  {
    slug: "litigation-dispute-resolution",
    title: "Litigation & Dispute Resolution",
    shortTitle: "Dispute Resolution",
    eyebrow: "Representation",
    summary:
      "Strategic representation in civil litigation, commercial disputes, property disputes, ADR, mediation, arbitration, and negotiation.",
    description:
      "Chaman Law Firm represents clients in civil litigation, commercial litigation, alternative dispute resolution, mediation, arbitration, negotiation, enforcement, and settlement strategy.",
    services: [
      "Civil litigation",
      "Commercial litigation",
      "Fundamental rights enforcement",
      "Expert witness advisory",
      "Digital evidence review",
      "Police complaint and rights advisory",
      "Injunctions and interim reliefs",
      "Civil lawsuit pre-action review",
      "Court system advisory",
      "Limitation periods and pre-action advisory",
      "Interlocutory applications advisory",
      "ADR",
      "Mediation",
      "Arbitration",
      "Negotiation",
      "Settlement strategy"
    ],
    servicePages: [
      ...sprint11sLitigationServicePages,
      ...sprint11tLitigationServicePages,
      ...wave4LitigationServicePages,
      {
        slug: "commercial-litigation",
        title: "Commercial Litigation",
        summary: "Representation and strategy for business disputes, contract claims, debt matters, and commercial enforcement.",
        description:
          "The firm helps clients evaluate claims, evidence, leverage, settlement options, court strategy, enforcement realities, and commercial risk.",
        keyPoints: ["Claim assessment", "Pre-action strategy", "Court representation", "Settlement and enforcement"],
        process: ["Review claims and documents", "Assess litigation risk", "Prepare strategy and filings", "Represent through resolution"],
        faqs: [
          {
            question: "Can commercial disputes be settled before trial?",
            answer:
              "Yes. Settlement, negotiation, mediation, or arbitration may be appropriate depending on the facts and client objectives."
          }
        ]
      },
      {
        slug: "fundamental-rights-enforcement",
        title: "Fundamental Rights Enforcement",
        summary:
          "Legal advice and representation for clients considering fundamental-rights complaints, civil-rights claims, unlawful detention concerns, harassment issues, and court or settlement strategy.",
        description:
          "Chaman Law Firm advises individuals, families, organizations, and businesses on fundamental-rights enforcement concerns in Nigeria. The firm reviews facts, evidence, urgency, parties involved, available remedies, limitation and jurisdiction questions, and safer representation options before any action is taken.",
        image: serviceHeroImages.legalService,
        imageAlt: "Litigation advisory image for fundamental rights enforcement in Nigeria",
        keyPoints: [
          "Rights-violation fact and evidence review",
          "Urgency, remedy, party, and forum-risk guidance",
          "Pre-action, negotiation, filing, and representation strategy",
          "Advice for individuals, families, organizations, and businesses"
        ],
        process: [
          "Confirm the incident, dates, documents, evidence, parties, urgency, and desired outcome",
          "Assess visible legal issues, possible remedies, forum concerns, and procedural risk",
          "Advise on correspondence, settlement, urgent relief, filing, or other lawful next steps",
          "Support representation, negotiation, court filings, or resolution strategy where appropriate"
        ],
        faqs: [
          {
            question: "Should a rights complaint be reviewed before filing?",
            answer:
              "Yes. Facts, evidence, urgency, parties, remedy, and forum questions should be reviewed before deciding the correct enforcement strategy."
          },
          {
            question: "Can rights matters be urgent?",
            answer:
              "Some rights concerns may require urgent advice. The appropriate step depends on the facts, evidence, safety concerns, and available legal remedies."
          }
        ]
      },
      {
        slug: "expert-witnesses",
        title: "Expert Witness Advisory",
        summary:
          "Litigation support for matters requiring expert evidence, technical reports, professional opinions, admissibility review, witness preparation, and case-strategy coordination.",
        description:
          "Chaman Law Firm helps clients and litigation teams review expert-witness needs in civil, commercial, property, corporate, family, and technical disputes. The firm advises on relevance, evidence planning, report review, witness coordination, and how expert evidence fits into the broader case strategy.",
        image: serviceHeroImages.firmTeam,
        imageAlt: "Chaman Law Firm litigation team reviewing expert witness evidence",
        keyPoints: [
          "Expert-evidence relevance and document review",
          "Technical report and professional-opinion coordination",
          "Litigation strategy for cases involving specialist evidence",
          "Witness preparation and evidence-risk guidance"
        ],
        process: [
          "Identify the technical issue, pleadings, documents, reports, and case objective",
          "Review whether expert evidence may assist the dispute and what gaps remain",
          "Coordinate report questions, evidence organization, and witness-preparation strategy",
          "Advise on how the expert evidence supports negotiation, trial, or settlement decisions"
        ],
        faqs: [
          {
            question: "When might expert evidence be useful?",
            answer:
              "Expert evidence may help where a dispute involves technical, professional, valuation, medical, engineering, property, accounting, or other specialist questions."
          },
          {
            question: "Does the court decide whether expert evidence is accepted?",
            answer:
              "The admissibility and weight of evidence depend on the applicable rules, facts, documents, and the court or tribunal considering the matter."
          }
        ]
      },
      {
        slug: "digital-evidence",
        title: "Digital Evidence Review",
        summary:
          "Litigation advice on digital evidence, electronic records, messages, emails, screenshots, metadata, authenticity concerns, and evidence preservation in Nigerian disputes.",
        description:
          "Chaman Law Firm advises clients on the legal-risk and case-strategy issues connected with digital evidence. The firm helps review electronic records, communication trails, screenshots, emails, transaction logs, authenticity concerns, privacy questions, and preservation steps before negotiation, filing, or trial.",
        image: serviceHeroImages.legalService,
        imageAlt: "Legal advisory image for digital evidence review and litigation strategy",
        keyPoints: [
          "Electronic record and communication-evidence review",
          "Authenticity, preservation, and admissibility-risk guidance",
          "Digital evidence strategy for civil, commercial, and property disputes",
          "Advice before sharing, filing, relying on, or challenging records"
        ],
        process: [
          "Collect the digital records, source context, dates, parties, and dispute background",
          "Review authenticity, relevance, preservation, chain-of-custody, and privacy-risk questions",
          "Advise on whether further verification or expert support may be required",
          "Integrate the digital evidence into correspondence, negotiation, filings, or trial strategy"
        ],
        faqs: [
          {
            question: "Can screenshots be used as evidence?",
            answer:
              "Screenshots may be relevant, but their use depends on authenticity, context, supporting records, applicable evidence rules, and the forum considering the dispute."
          },
          {
            question: "Should digital evidence be preserved early?",
            answer:
              "Yes. Parties should avoid altering or losing relevant records and should seek advice before relying on or challenging digital evidence."
          }
        ]
      }
    ],
    commonIssues: ["Property disputes", "Contract disputes", "Debt claims", "Family or estate disputes", "Employment disagreements", "Enforcement problems"],
    whoWeHelp: ["Individuals", "Companies", "Landowners", "Developers", "Families", "Creditors"],
    process: [
      "Assess claims, evidence, timelines, limitation issues, and objectives",
      "Recommend litigation, ADR, negotiation, or settlement pathway",
      "Prepare filings, correspondence, negotiation materials, or representation strategy",
      "Manage proceedings and client updates through resolution"
    ],
    faqs: [
      {
        question: "Do all disputes need to go to court?",
        answer:
          "No. The firm considers negotiation, mediation, arbitration, and settlement where they can protect the client's interests efficiently."
      }
    ],
    relatedDownloads: [],
    seoKeywords: ["litigation lawyer Lagos", "dispute resolution lawyer Nigeria", "commercial litigation Nigeria"],
    featured: true
  },
  {
    slug: "debt-recovery",
    title: "Debt Recovery",
    shortTitle: "Debt Recovery",
    eyebrow: "Commercial Recovery",
    summary:
      "Legal recovery strategy for unpaid debts, commercial obligations, loan defaults, enforcement, and settlement negotiation.",
    description:
      "The firm helps creditors, businesses, landlords, lenders, and individuals evaluate debt recovery options, issue demands, negotiate settlements, commence proceedings, and pursue enforcement where required.",
    services: [
      "Debt recovery advisory",
      "Debt enforcement",
      "Commercial recovery",
      "Settlement negotiation",
      "Demand notices",
      "Debt demand letter advisory",
      "Debt collector compliance advisory"
    ],
    servicePages: [
      ...sprint11tDebtServicePages,
      ...wave3DebtServicePages,
      ...wave4DebtServicePages,
      {
        slug: "commercial-debt-recovery",
        title: "Commercial Debt Recovery",
        summary: "Recovery support for unpaid invoices, commercial obligations, credit facilities, and business debts.",
        description:
          "Chaman Law Firm supports creditors with demand strategy, negotiation, settlement, court action, and enforcement planning.",
        keyPoints: ["Demand notices", "Negotiation", "Settlement structure", "Proceedings and enforcement"],
        process: ["Review documents", "Assess debtor and claim strength", "Issue demand or negotiate", "Escalate where necessary"],
        faqs: [
          {
            question: "Can a demand letter resolve a debt matter?",
            answer:
              "Sometimes. A properly prepared demand can create urgency, clarify the claim, and support settlement before litigation."
          }
        ]
      }
    ],
    commonIssues: ["Unpaid invoices", "Loan defaults", "Commercial debt", "Failed settlement promises", "Enforcement delays"],
    whoWeHelp: ["Businesses", "Creditors", "Landlords", "Lenders", "Individuals"],
    process: [
      "Review documents and debtor profile",
      "Assess recovery options and commercial leverage",
      "Issue demand, commence negotiation, or prepare claim strategy",
      "Escalate to enforcement or proceedings where necessary"
    ],
    faqs: [
      {
        question: "Can a lawyer help recover business debt without court action?",
        answer:
          "Often, yes. A structured demand, negotiation, and settlement approach may resolve some matters without immediate litigation."
      }
    ],
    relatedDownloads: [],
    seoKeywords: ["debt recovery lawyer Nigeria", "debt collection lawyer Lagos", "commercial recovery Nigeria"],
    featured: true
  },
  {
    slug: "probate-estate-administration",
    title: "Probate & Estate Administration",
    shortTitle: "Probate",
    eyebrow: "Private Client",
    summary:
      "Guidance on wills, probate applications, letters of administration, inheritance matters, estate planning, and estate administration.",
    description:
      "Chaman Law Firm assists families, beneficiaries, executors, administrators, and diaspora clients with probate applications, letters of administration, inheritance matters, estate planning, will administration, and estate disputes.",
    services: [
      "Letters of administration",
      "Probate applications",
      "Probate in Lagos advisory",
      "Letters of administration in Ogun State",
      "Inheritance rights advisory",
      "Testamentary freedom advisory",
      "Inheritance matters",
      "Estate planning",
      "Will administration"
    ],
    servicePages: [
      ...sprint11sProbateServicePages,
      ...sprint11tProbateServicePages,
      ...wave3ProbateServicePages,
      ...wave4ProbateServicePages,
      {
        slug: "letters-of-administration",
        title: "Letters of Administration",
        summary: "Guidance for families and administrators where a deceased person left assets requiring lawful administration.",
        description:
          "The firm assists with document review, family structure, estate information, application preparation, and administration guidance.",
        keyPoints: ["Estate document review", "Family and beneficiary information", "Application guidance", "Administration support"],
        process: ["Confirm estate facts", "Review documents and family structure", "Prepare application pathway", "Support administration"],
        faqs: [
          {
            question: "Who may need letters of administration?",
            answer:
              "Families may need letters of administration where estate assets require lawful authority to administer or distribute them."
          }
        ]
      },
      {
        slug: "probate-in-lagos-everything-you-need-to-know",
        title: "Probate in Lagos Advisory",
        summary:
          "Legal guidance for executors, administrators, beneficiaries, families, and diaspora clients handling probate, estate documents, asset identification, and administration questions in Lagos.",
        description:
          "Chaman Law Firm assists clients with probate and estate-administration questions connected to Lagos assets, wills, executors, beneficiaries, administrators, family structure, estate documents, and practical representation needs. The firm reviews the facts before advising on the appropriate probate or administration pathway.",
        image: serviceHeroImages.firmTeam,
        imageAlt: "Chaman Law Firm private-client lawyers advising on probate in Lagos",
        keyPoints: [
          "Probate, will, and estate-document review",
          "Executor, administrator, beneficiary, and family-structure guidance",
          "Asset, representation, and application-readiness support",
          "Advice for local and diaspora families handling Lagos estate matters"
        ],
        process: [
          "Confirm the deceased person's details, family structure, assets, will status, and available documents",
          "Review executor or administrator questions, beneficiary interests, and document gaps",
          "Advise on probate, letters of administration, representation, or dispute-prevention steps",
          "Support application preparation, correspondence, coordination, or estate-administration strategy"
        ],
        faqs: [
          {
            question: "Who should seek probate advice in Lagos?",
            answer:
              "Executors, administrators, beneficiaries, families, and diaspora relatives may need probate advice where Lagos assets require lawful administration or transfer."
          },
          {
            question: "Can Chaman Law Firm assist diaspora families with probate?",
            answer:
              "Yes. The firm can guide diaspora clients on documents, representation, communication, and practical next steps for Nigerian probate and estate matters."
          }
        ]
      }
    ],
    commonIssues: ["No will", "Executor or administrator uncertainty", "Inheritance disputes", "Diaspora beneficiaries", "Estate documentation gaps"],
    whoWeHelp: ["Families", "Executors", "Administrators", "Beneficiaries", "Diaspora clients"],
    process: [
      "Confirm estate facts, documents, and family structure",
      "Advise on probate, administration, estate planning, or dispute options",
      "Prepare required applications and supporting documents",
      "Support administration, distribution, or dispute resolution"
    ],
    faqs: [
      {
        question: "Can diaspora family members handle probate through the firm?",
        answer:
          "Yes. The firm can guide diaspora clients on documentation, representation, and practical steps for Nigerian probate and estate matters."
      }
    ],
    relatedDownloads: [],
    seoKeywords: ["probate lawyer Nigeria", "letters of administration Nigeria", "estate administration lawyer Lagos"],
    featured: true
  },
  {
    slug: "notary-public-services",
    title: "Notary Public Services",
    shortTitle: "Notary Public",
    eyebrow: "Documentation",
    summary:
      "Notarization, certification, legalization, authentication, power of attorney, and document execution support.",
    description:
      "The firm supports clients who need documents notarized, certified, authenticated, legalized, or prepared for use in Nigeria or abroad, including powers of attorney and document execution for diaspora clients.",
    services: [
      "Notarization",
      "Certification",
      "Legalization",
      "Authentication",
      "Power of attorney",
      "Document execution",
      "Notary public eligibility and document advisory",
      "Apostille and document legalization advisory",
      "Document legalization and attestation",
      "Legal document review"
    ],
    servicePages: [
      ...sprint11sNotaryServicePages,
      ...sprint11tNotaryServicePages,
      ...wave3NotaryServicePages,
      ...wave4NotaryServicePages,
      {
        slug: "power-of-attorney",
        title: "Power of Attorney",
        summary: "Power of attorney guidance for property, diaspora, business, and private-client matters.",
        description:
          "Chaman Law Firm advises on power of attorney use, drafting, execution, notarization, authentication, and representation risks.",
        keyPoints: ["Drafting and review", "Execution guidance", "Notarization support", "Diaspora representation"],
        process: ["Confirm purpose", "Draft or review authority", "Guide execution and notarization", "Advise on use and limits"],
        faqs: [
          {
            question: "Can a power of attorney support diaspora property transactions?",
            answer:
              "Yes. A properly prepared and executed power of attorney may support representation, subject to the transaction requirements and applicable authentication steps."
          }
        ]
      }
    ],
    commonIssues: ["Foreign-use documents", "Power of attorney execution", "Certification needs", "Authentication requirements", "Document readiness"],
    whoWeHelp: ["Individuals", "Businesses", "Diaspora clients", "Students", "Corporate organizations"],
    process: [
      "Review the document and intended use",
      "Confirm identity and execution requirements",
      "Complete notarization, certification, or related documentation steps",
      "Advise on additional authentication or legalization where required"
    ],
    faqs: [
      {
        question: "What documents can be notarized?",
        answer:
          "Common documents include powers of attorney, affidavits, declarations, corporate documents, academic documents, and documents for foreign use, subject to review."
      }
    ],
    relatedDownloads: ["diaspora-property-legal-guide"],
    seoKeywords: ["notary public Lagos", "notarization Nigeria", "power of attorney Nigeria"],
    featured: true
  },
  {
    slug: "immigration-services",
    title: "Immigration Services",
    shortTitle: "Immigration",
    eyebrow: "Mobility & Compliance",
    summary:
      "Visa advisory, business immigration, residence documentation, immigration compliance, and practical support for clients with Nigerian immigration needs.",
    description:
      "Chaman Law Firm supports individuals, businesses, investors, and foreign clients with visa advisory, business immigration, residence documentation, and immigration compliance.",
    services: [
      "Visa advisory",
      "Business immigration",
      "Residence documentation",
      "Immigration compliance",
      "Citizenship by marriage advisory",
      "Certificate of good conduct advisory",
      "Citizenship application advisory"
    ],
    servicePages: [
      ...sprint11sImmigrationServicePages,
      ...sprint11tImmigrationServicePages,
      ...wave4ImmigrationServicePages,
      {
        slug: "business-immigration",
        title: "Business Immigration",
        summary: "Immigration guidance for companies, investors, entrepreneurs, and foreign business visitors.",
        description:
          "The firm advises on immigration documentation, compliance issues, business mobility needs, and practical legal steps for foreign or corporate clients.",
        keyPoints: ["Business immigration advisory", "Residence documentation", "Compliance guidance", "Investor support"],
        process: ["Clarify immigration objective", "Review documents and eligibility", "Advise on pathway", "Support compliance steps"],
        faqs: [
          {
            question: "Can businesses seek immigration compliance guidance?",
            answer:
              "Yes. The firm can advise businesses on documentation and compliance considerations connected to Nigerian immigration needs."
          }
        ]
      }
    ],
    commonIssues: ["Visa uncertainty", "Business mobility", "Residence documentation", "Compliance gaps"],
    whoWeHelp: ["Foreign investors", "Companies", "Entrepreneurs", "Individuals", "Diaspora clients"],
    process: [
      "Clarify immigration objective and timeline",
      "Review documentation and eligibility concerns",
      "Advise on legal pathway and compliance expectations",
      "Support document preparation and next steps"
    ],
    faqs: [
      {
        question: "Does the firm provide visa advisory?",
        answer:
          "Yes. The firm can advise on visa and immigration documentation issues based on the client's facts and intended purpose."
      }
    ],
    relatedDownloads: [],
    seoKeywords: ["immigration lawyer Nigeria", "business immigration Nigeria", "visa advisory Nigeria"],
    featured: true
  },
  {
    slug: "family-law",
    title: "Family Law",
    shortTitle: "Family Law",
    eyebrow: "Private Client",
    summary:
      "Legal guidance on divorce, custody, guardianship, matrimonial advisory, family-property issues, and related private-client matters.",
    description:
      "Chaman Law Firm supports clients with family law matters including divorce, custody, guardianship, matrimonial advisory, family-property concerns, and related disputes.",
    services: [
      "Divorce",
      "Custody",
      "Guardianship",
      "Matrimonial advisory",
      "Family-property support",
      "Child surname change advisory",
      "Void and voidable marriage advisory",
      "Customary marriage advisory",
      "Child maintenance and support advisory"
    ],
    servicePages: [
      ...sprint11sFamilyServicePages,
      ...sprint11tFamilyServicePages,
      ...wave4FamilyServicePages,
      {
        slug: "matrimonial-advisory",
        title: "Matrimonial Advisory",
        summary: "Practical legal advice for clients navigating matrimonial, custody, guardianship, and family-property concerns.",
        description:
          "The firm helps clients understand their legal position, document needs, dispute options, and next steps in sensitive family matters.",
        keyPoints: ["Matrimonial advice", "Custody and guardianship guidance", "Family-property issues", "Dispute strategy"],
        process: ["Confirm facts and urgency", "Review relevant documents", "Advise on options", "Support representation or settlement"],
        faqs: [
          {
            question: "Can family matters be handled privately?",
            answer:
              "Many family matters require careful, discreet handling. The appropriate process depends on the facts, urgency, and legal issues involved."
          }
        ]
      }
    ],
    commonIssues: ["Divorce concerns", "Custody disputes", "Guardianship questions", "Family-property conflict", "Sensitive negotiations"],
    whoWeHelp: ["Individuals", "Parents", "Families", "Guardians", "Diaspora clients"],
    process: [
      "Understand the family facts, urgency, and client priorities",
      "Review documents and identify legal options",
      "Advise on negotiation, filing, settlement, or representation",
      "Support the client through resolution with discretion"
    ],
    faqs: [
      {
        question: "Does Chaman Law Firm handle family law matters?",
        answer:
          "Yes. The firm can advise on divorce, custody, guardianship, matrimonial advisory, and related family-property issues."
      }
    ],
    relatedDownloads: [],
    seoKeywords: ["family lawyer Nigeria", "custody lawyer Lagos", "matrimonial lawyer Nigeria"],
    featured: true
  },
  {
    slug: "employment-law",
    title: "Employment Law",
    shortTitle: "Employment Law",
    eyebrow: "Workplace Advisory",
    summary:
      "Employment law advice for employers, employees, executives, SMEs and companies on contracts, termination, redundancy, disputes and compliance.",
    description:
      "Chaman Law Firm advises employers, employees, executives, SMEs, and companies on employment contracts, workplace policies, termination, redundancy, disciplinary issues, settlement, labour disputes, and compliance with Nigerian employment law obligations.",
    services: [
      "Employment contract drafting and review",
      "Workplace policy advisory",
      "Termination and redundancy guidance",
      "Disciplinary process advisory",
      "Settlement negotiation",
      "Employment dispute resolution",
      "Employer compliance support",
      "Trade union membership disputes",
      "Trade union registration advisory",
      "Employment contract review",
      "Workplace compliance advisory"
    ],
    servicePages: [
      ...sprint11sEmploymentServicePages,
      ...sprint11tEmploymentServicePages,
      ...wave3EmploymentServicePages,
      {
        slug: "trade-union-membership-disputes",
        title: "Trade Union Membership Disputes",
        summary:
          "Employment-law guidance for workers, employers, unions, and organizations dealing with trade union membership, workplace representation, disciplinary concerns, and labour-dispute risk.",
        description:
          "Chaman Law Firm advises employers, employees, executives, unions, and organizations on workplace issues connected to trade union membership, representation, internal disciplinary concerns, collective workplace questions, and dispute-resolution options. The service is framed as legal-risk guidance and requires review of the specific employment documents and facts.",
        image: serviceHeroImages.legalService,
        imageAlt: "Employment law advisory image for trade union membership disputes in Nigeria",
        keyPoints: [
          "Employment contract, policy, and union-document review",
          "Workplace representation and membership-dispute guidance",
          "Employer compliance and employee-rights risk assessment",
          "Settlement, correspondence, and dispute-resolution strategy"
        ],
        process: [
          "Confirm the workplace facts, contract, policy documents, union materials, correspondence, and urgency",
          "Review membership, representation, disciplinary, collective, and employment-risk questions",
          "Advise on correspondence, negotiation, settlement, compliance, or dispute-resolution options",
          "Support documentation, representation, or escalation where appropriate"
        ],
        faqs: [
          {
            question: "Can Chaman Law Firm advise on trade union membership disputes?",
            answer:
              "Yes. The firm can review the employment documents, union materials, facts, and correspondence before advising on legal-risk and dispute-resolution options."
          },
          {
            question: "Should employers review union-related issues before taking action?",
            answer:
              "Yes. Employers should review employment contracts, policies, applicable documents, and procedural risk before taking decisions that may lead to workplace disputes."
          }
        ]
      }
    ],
    commonIssues: [
      "Unclear employment contracts",
      "Wrongful termination concerns",
      "Redundancy and severance questions",
      "Disciplinary process risk",
      "Workplace disputes and settlement pressure",
      "Employer policy and compliance gaps"
    ],
    whoWeHelp: [
      "Employers",
      "Employees",
      "Executives",
      "SMEs",
      "Corporate organizations",
      "HR and operations teams"
    ],
    process: [
      "Review the contract, workplace documents, facts, timeline, and urgency",
      "Identify legal risk, documentation gaps, negotiation leverage, and procedural issues",
      "Advise on compliance, settlement, correspondence, disciplinary steps, or representation",
      "Support negotiation, documentation, dispute resolution, or escalation where required"
    ],
    faqs: [
      {
        question: "Can Chaman Law Firm review an employment contract before signing?",
        answer:
          "Yes. The firm can review employment terms, identify risk, advise on obligations, and recommend revisions before signing."
      },
      {
        question: "Can the firm advise on termination or redundancy?",
        answer:
          "Yes. The firm advises employers and employees on termination, redundancy, severance, documentation, process, and dispute risk."
      },
      {
        question: "Do employment disputes always need court action?",
        answer:
          "No. Depending on the facts, negotiation, settlement, mediation, or other dispute-resolution steps may be appropriate before formal proceedings."
      }
    ],
    relatedDownloads: [],
    seoKeywords: [
      "employment lawyer Nigeria",
      "labour lawyer Lagos",
      "employment contract review Nigeria",
      "wrongful termination lawyer Nigeria"
    ],
    featured: true
  },
  {
    slug: "adr-mediation",
    title: "ADR / Mediation",
    shortTitle: "ADR & Mediation",
    eyebrow: "Settlement Strategy",
    summary:
      "ADR and mediation support for individuals, families and businesses resolving property, commercial, debt and family disputes through settlement strategy.",
    description:
      "Chaman Law Firm supports clients with alternative dispute resolution, mediation, negotiation, settlement planning, pre-action strategy, and practical dispute management for property, commercial, family, employment, and debt matters.",
    services: [
      "Mediation strategy",
      "Settlement negotiation",
      "Alternative dispute resolution advisory",
      "Pre-action dispute assessment",
      "Commercial dispute settlement",
      "Property dispute negotiation",
      "Family and private-client dispute support",
      "Mediator selection and quality advisory",
      "Arbitral award enforcement advisory"
    ],
    servicePages: [...sprint11tAdrServicePages, ...wave4AdrServicePages],
    commonIssues: [
      "Disputes that may be resolved before trial",
      "Property and family settlement pressure",
      "Commercial disagreements affecting business continuity",
      "Debt and payment-plan negotiations",
      "Poorly documented settlement terms",
      "Escalating conflict without a clear resolution strategy"
    ],
    whoWeHelp: [
      "Individuals",
      "Families",
      "Businesses",
      "Property owners",
      "Creditors and debtors",
      "Employers and employees"
    ],
    process: [
      "Assess the dispute facts, documents, parties, urgency, and desired outcome",
      "Identify negotiation leverage, settlement risks, and suitable ADR pathways",
      "Prepare correspondence, settlement terms, mediation brief, or negotiation strategy",
      "Support resolution, documentation, enforcement planning, or escalation where needed"
    ],
    faqs: [
      {
        question: "What types of disputes can be handled through ADR or mediation?",
        answer:
          "Property, commercial, family, employment, debt, and private-client disputes may be suitable depending on the facts, parties, urgency, and available settlement options."
      },
      {
        question: "Can mediation help avoid court proceedings?",
        answer:
          "Sometimes. Mediation and negotiation can help parties resolve disputes earlier, reduce cost, preserve relationships, and narrow issues even where proceedings later become necessary."
      },
      {
        question: "Can the firm help document a settlement?",
        answer:
          "Yes. The firm can advise on settlement terms, draft or review documentation, and help clients understand enforcement and compliance risks."
      }
    ],
    relatedDownloads: [],
    seoKeywords: [
      "mediation lawyer Nigeria",
      "ADR lawyer Lagos",
      "dispute settlement lawyer Nigeria",
      "alternative dispute resolution Nigeria"
    ],
    featured: true
  }
];

export function getPracticeAreaBySlug(slug: string) {
  return practiceAreas.find((area) => area.slug === slug) || null;
}

export function getServicePageBySlug(areaSlug: string, serviceSlug: string) {
  return getPracticeAreaBySlug(areaSlug)?.servicePages.find((service) => service.slug === serviceSlug) || null;
}

export function getAllServicePages() {
  return practiceAreas.flatMap((area) =>
    area.servicePages.map((service) => ({
      area,
      service
    }))
  );
}
