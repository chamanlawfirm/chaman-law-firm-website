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
      "Property documentation",
      "Property acquisition advisory",
      "Land transactions",
      "Property dispute resolution",
      "Diaspora property services"
    ],
    servicePages: propertyServicePages,
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
      "Contract drafting",
      "Business advisory",
      "Retainership support"
    ],
    servicePages: [
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
      "ADR",
      "Mediation",
      "Arbitration",
      "Negotiation",
      "Settlement strategy"
    ],
    servicePages: [
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
    services: ["Debt recovery advisory", "Debt enforcement", "Commercial recovery", "Settlement negotiation", "Demand notices"],
    servicePages: [
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
      "Inheritance matters",
      "Estate planning",
      "Will administration"
    ],
    servicePages: [
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
    services: ["Notarization", "Certification", "Legalization", "Authentication", "Power of attorney", "Document execution"],
    servicePages: [
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
    services: ["Visa advisory", "Business immigration", "Residence documentation", "Immigration compliance"],
    servicePages: [
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
    services: ["Divorce", "Custody", "Guardianship", "Matrimonial advisory", "Family-property support"],
    servicePages: [
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
      "Trade union membership disputes"
    ],
    servicePages: [
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
      "Family and private-client dispute support"
    ],
    servicePages: [],
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
