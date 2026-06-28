import type { Faq } from "@/lib/types";

export type ServicePage = {
  slug: string;
  title: string;
  summary: string;
  description: string;
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
    services: ["Civil litigation", "Commercial litigation", "ADR", "Mediation", "Arbitration", "Negotiation", "Settlement strategy"],
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
    services: ["Letters of administration", "Probate applications", "Inheritance matters", "Estate planning", "Will administration"],
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
      "Employer compliance support"
    ],
    servicePages: [],
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
