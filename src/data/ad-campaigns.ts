import type { Faq } from "@/lib/types";

export type AdCampaign = {
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  audience: string[];
  services: string[];
  risks: string[];
  process: string[];
  documents: string[];
  faqs: Faq[];
  formPrompt: string;
  whatsappMessage: string;
  heroImage: string;
};

export const adCampaigns: AdCampaign[] = [
  {
    slug: "diaspora-legal-services-nigeria",
    eyebrow: "Legal Representation for Nigerians Abroad",
    title: "Trusted Nigerian Legal Support for Diaspora Clients",
    shortTitle: "Diaspora Legal Services",
    description:
      "Instruct Chaman Law Firm remotely for property, probate, family, business, documentation and dispute matters in Nigeria—with clear authority, written reporting and accountable legal representation.",
    metaTitle: "Diaspora Legal Services in Nigeria",
    metaDescription:
      "Nigerian legal representation for diaspora clients in property, probate, Power of Attorney, business, family and dispute matters. Consult Chaman Law Firm remotely.",
    keywords: [
      "diaspora lawyer Nigeria",
      "Nigerian lawyer for diaspora clients",
      "remote legal representation Nigeria",
      "property lawyer Nigeria diaspora",
      "probate lawyer Nigeria diaspora"
    ],
    audience: [
      "Nigerians living in the United Kingdom, United States, Canada and Europe",
      "Diaspora investors buying or protecting property in Nigeria",
      "Families handling probate, inheritance or family property remotely",
      "International clients requiring Nigerian documents or representation"
    ],
    services: [
      "Property verification, acquisition and transaction monitoring",
      "Powers of Attorney, execution and document legalisation guidance",
      "Probate, inheritance and estate administration",
      "Family property, succession and dispute support",
      "Corporate investment, contracts and regulatory advisory",
      "Litigation monitoring, negotiation and local representation"
    ],
    risks: [
      "Sending funds before ownership and seller authority are independently checked",
      "Using informal representatives without written authority or accountability",
      "Signing documents that are unsuitable for use in Nigeria",
      "Allowing probate, property or court deadlines to pass without local counsel"
    ],
    process: [
      "Secure remote consultation and conflict check",
      "Document collection, identity review and scope confirmation",
      "Written strategy, authority documents and agreed reporting plan",
      "Execution, monitoring and documented progress updates"
    ],
    documents: [
      "Government-issued identification and current contact details",
      "Available title, estate, court, corporate or family documents",
      "Chronology of events and details of persons in Nigeria",
      "Any existing Power of Attorney, agreement, receipt or correspondence"
    ],
    faqs: [
      {
        question: "Can I instruct Chaman Law Firm without travelling to Nigeria?",
        answer:
          "Yes. Many matters can begin remotely through a secure consultation, electronic document review and properly prepared authority documents. Any physical attendance requirement will be explained in advance."
      },
      {
        question: "How will I receive updates about my matter?",
        answer:
          "The reporting arrangement is agreed at engagement and may include written updates, document copies, video meetings and milestone reports appropriate to the instruction."
      },
      {
        question: "Can the firm verify property before I send money?",
        answer:
          "Yes. The firm can review seller authority, title documents, location and transaction risks and advise on safer payment and completion steps before you commit funds."
      }
    ],
    formPrompt: "Tell us your country of residence, the Nigerian state involved and the assistance you require.",
    whatsappMessage: "Hello Chaman Law Firm, I live outside Nigeria and need diaspora legal support.",
    heroImage: "/images/firm/managing-partner-office.png"
  },
  {
    slug: "property-verification-nigeria",
    eyebrow: "Verify Before You Pay",
    title: "Property Verification and Due Diligence in Nigeria",
    shortTitle: "Property Verification",
    description:
      "Obtain an independent legal review of ownership, seller authority, title documents, survey information, encumbrances and transaction risks before paying for land or property.",
    metaTitle: "Property Verification and Due Diligence in Nigeria",
    metaDescription:
      "Verify land and property in Lagos, Ogun and Nigeria before payment. Chaman Law Firm reviews title, seller authority, survey and transaction risks.",
    keywords: [
      "property verification Nigeria",
      "land title verification Lagos",
      "property due diligence lawyer Nigeria",
      "verify land ownership Lagos",
      "real estate lawyer Lagos"
    ],
    audience: [
      "Homebuyers and land purchasers",
      "Diaspora Nigerians investing remotely",
      "Developers, companies and institutional investors",
      "Lenders, joint-venture partners and property owners"
    ],
    services: [
      "Seller identity, capacity and authority review",
      "Title chain and document consistency checks",
      "Land registry, survey and acquisition-risk guidance",
      "Encumbrance, litigation and possession-risk review",
      "Contract, payment and completion-structure review",
      "Written findings and recommended next steps"
    ],
    risks: [
      "A seller who is not the lawful owner or lacks authority to sell",
      "Forged, incomplete or inconsistent title documents",
      "Government acquisition, competing interests or undisclosed disputes",
      "Unsafe payment terms or documents that do not protect the buyer"
    ],
    process: [
      "Submit the property details, seller information and available documents",
      "Define the required searches and transaction-risk questions",
      "Review documents, registries, survey issues and seller authority",
      "Receive written advice before payment, signing or completion"
    ],
    documents: [
      "Survey plan and title documents supplied by the seller",
      "Seller identification and evidence of authority",
      "Offer letter, contract, receipts or prior assignments",
      "Property address, coordinates, photographs and agent details"
    ],
    faqs: [
      {
        question: "Should verification be completed before paying a deposit?",
        answer:
          "As a general risk-control measure, material payment should not be made until the relevant ownership, authority and transaction checks have been completed and the proposed documents reviewed."
      },
      {
        question: "Can you verify property outside Lagos?",
        answer:
          "Yes. The precise search process depends on the state, title type and available records. The firm will confirm the appropriate scope after reviewing the property information."
      },
      {
        question: "Does a valid-looking document prove ownership?",
        answer:
          "Not by itself. The document, title history, seller authority, survey information, possession and relevant public records should be considered together."
      }
    ],
    formPrompt: "Provide the property location, seller details and the title documents currently available.",
    whatsappMessage: "Hello Chaman Law Firm, I need to verify a property in Nigeria before payment.",
    heroImage: "/images/firm/firm-office-team.jpg"
  },
  {
    slug: "debt-recovery-nigeria",
    eyebrow: "Lawful Commercial Recovery",
    title: "Debt Recovery Legal Services in Nigeria",
    shortTitle: "Debt Recovery",
    description:
      "Strategic debt recovery for individuals and businesses through document review, formal demands, negotiation, settlement, litigation and judgment-enforcement advice.",
    metaTitle: "Debt Recovery Lawyer in Nigeria",
    metaDescription:
      "Recover commercial and private debts lawfully in Nigeria. Chaman Law Firm provides demand letters, negotiation, litigation and enforcement advice.",
    keywords: [
      "debt recovery lawyer Nigeria",
      "commercial debt recovery Lagos",
      "lawyer demand letter Nigeria",
      "recover unpaid debt Nigeria",
      "judgment enforcement Nigeria"
    ],
    audience: [
      "Businesses with unpaid invoices or contractual debts",
      "Lenders, landlords and service providers",
      "Individuals owed documented loans or obligations",
      "Diaspora creditors requiring Nigerian representation"
    ],
    services: [
      "Debt-document and limitation-period review",
      "Formal demand and pre-action correspondence",
      "Negotiation, repayment plans and settlement documentation",
      "Court proceedings where commercially justified",
      "Judgment enforcement and asset-focused strategy",
      "Defence against improper or disputed recovery claims"
    ],
    risks: [
      "Weak records of the debt, payment or debtor acknowledgment",
      "Limitation periods expiring before appropriate action is taken",
      "Harassment, threats or unlawful self-help creating counterclaims",
      "Spending more on recovery than the realistic recoverable value"
    ],
    process: [
      "Review the debt evidence, parties, dates and prior demands",
      "Assess recoverability, legal options, cost and urgency",
      "Issue appropriate correspondence or pursue negotiated settlement",
      "Commence and enforce proceedings where authorised and proportionate"
    ],
    documents: [
      "Contracts, invoices, receipts and statements of account",
      "Bank transfers, acknowledgments and repayment promises",
      "Relevant emails, messages and previous demand letters",
      "Debtor identity, address and available asset information"
    ],
    faqs: [
      {
        question: "Can a lawyer recover a debt without going to court?",
        answer:
          "Some debts are resolved through a properly supported demand, negotiation or documented repayment arrangement. Court action may be necessary where liability is disputed or voluntary settlement fails."
      },
      {
        question: "What documents are important for debt recovery?",
        answer:
          "Contracts, invoices, account statements, transfer records, acknowledgments, correspondence and evidence identifying the debtor are commonly important."
      },
      {
        question: "Is recovery guaranteed?",
        answer:
          "No. Recovery depends on evidence, applicable law, defences, limitation issues, the debtor's position and enforceable assets. The firm provides an assessment rather than a guaranteed outcome."
      }
    ],
    formPrompt: "State the amount owed, when it became due, the debtor's location and the documents you possess.",
    whatsappMessage: "Hello Chaman Law Firm, I need legal assistance with debt recovery in Nigeria.",
    heroImage: "/images/lawyers/arinze-amobi.jpg"
  },
  {
    slug: "probate-estate-administration-nigeria",
    eyebrow: "Protecting Estates and Beneficiaries",
    title: "Probate and Estate Administration in Nigeria",
    shortTitle: "Probate and Estate Administration",
    description:
      "Legal guidance for Wills, Grants of Probate, Letters of Administration, estate assets, beneficiary interests, family settlements and succession-related property matters.",
    metaTitle: "Probate and Estate Administration Lawyer in Nigeria",
    metaDescription:
      "Legal assistance with Probate, Letters of Administration, Wills, estate assets and inheritance in Nigeria. Consult Chaman Law Firm in Lagos and Ogun.",
    keywords: [
      "probate lawyer Nigeria",
      "Letters of Administration Lagos",
      "estate administration lawyer Nigeria",
      "inheritance lawyer Lagos",
      "Grant of Probate Nigeria"
    ],
    audience: [
      "Executors named in a Will",
      "Spouses, children and other potential administrators",
      "Beneficiaries concerned about estate assets",
      "Diaspora families administering estates in Nigeria"
    ],
    services: [
      "Will review and probate application guidance",
      "Letters of Administration for intestate estates",
      "Estate asset identification and documentation",
      "Beneficiary, minor and family-interest protection",
      "Property transmission, bank assets and estate liabilities",
      "Family settlement and succession-dispute advice"
    ],
    risks: [
      "Dealing with estate property before lawful authority is obtained",
      "Omitting assets, liabilities or eligible beneficiaries",
      "Unclear family authority and competing applications",
      "Selling or transferring estate property without proper documentation"
    ],
    process: [
      "Confirm the death, family structure, Will status and known assets",
      "Identify the appropriate Probate Registry and applicants",
      "Prepare, obtain and regularise the required documents",
      "Support administration, transmission, distribution or dispute resolution"
    ],
    documents: [
      "Death certificate and the original Will, if any",
      "Identification and relationship evidence for applicants",
      "List of assets, liabilities, banks and landed property",
      "Marriage, birth and other relevant family records"
    ],
    faqs: [
      {
        question: "What happens when someone dies without a Will?",
        answer:
          "The estate is generally administered through Letters of Administration under the applicable succession framework. The correct applicants and distribution rules depend on the facts and jurisdiction."
      },
      {
        question: "Can a diaspora family handle probate remotely?",
        answer:
          "Yes, substantial preparation and representation may be handled remotely. Any personal attendance, oath, biometrics or original-document requirement will be identified during the matter."
      },
      {
        question: "Can estate property be sold immediately after death?",
        answer:
          "A sale should not proceed without confirming who has lawful authority to represent the estate and whether the required probate or administration steps have been completed."
      }
    ],
    formPrompt: "Tell us whether there is a Will, the deceased's last residence and the principal estate assets.",
    whatsappMessage: "Hello Chaman Law Firm, I need assistance with probate or estate administration in Nigeria.",
    heroImage: "/images/lawyers/justina-edewede-obriko.png"
  },
  {
    slug: "notary-apostille-document-legalisation-nigeria",
    eyebrow: "Documents for Local and International Use",
    title: "Notary, Apostille and Document Legalisation Services",
    shortTitle: "Notary and Legalisation",
    description:
      "Professional guidance for notarisation, certified copies, affidavits, powers of attorney, authentication, apostille and consular legalisation of Nigerian documents.",
    metaTitle: "Notary, Apostille and Document Legalisation in Nigeria",
    metaDescription:
      "Notary Public, apostille, authentication and document legalisation services in Lagos, Nigeria for Powers of Attorney, affidavits and certified documents.",
    keywords: [
      "Notary Public Lagos",
      "apostille Nigeria",
      "document legalisation Nigeria",
      "authenticate Nigerian documents",
      "notarise Power of Attorney Lagos"
    ],
    audience: [
      "Individuals using Nigerian documents abroad",
      "Diaspora clients executing documents for use in Nigeria",
      "Companies, schools and institutions requiring certified documents",
      "Applicants dealing with embassies, foreign authorities or international transactions"
    ],
    services: [
      "Notarisation and certified true copies",
      "Powers of Attorney, declarations and affidavits",
      "Document-authentication pathway review",
      "Apostille and legalisation guidance",
      "Consular and destination-country requirement support",
      "Corporate and transaction-document certification"
    ],
    risks: [
      "Using the wrong authentication route for the destination country",
      "Submitting an unsuitable copy or improperly executed document",
      "Name, date or identity inconsistencies across supporting records",
      "Missing embassy, institution or receiving-authority requirements"
    ],
    process: [
      "Confirm the document, issuing authority, destination and intended use",
      "Review identity, execution and supporting-document requirements",
      "Complete the appropriate notarisation or authentication steps",
      "Return the processed document with practical use guidance"
    ],
    documents: [
      "Original document or acceptable certified source document",
      "Valid government-issued identification",
      "Receiving authority's written requirements, if available",
      "Supporting records for names, signatures or corporate authority"
    ],
    faqs: [
      {
        question: "Is notarisation the same as apostille or legalisation?",
        answer:
          "No. They are distinct processes. The correct sequence depends on the document, issuing authority, destination country and the requirements of the receiving institution."
      },
      {
        question: "Can a Power of Attorney signed abroad be used in Nigeria?",
        answer:
          "It may require appropriate execution, notarisation, authentication, stamping or registration depending on its purpose and the asset or transaction involved."
      },
      {
        question: "Can you confirm requirements before I submit my original document?",
        answer:
          "Yes. Send a clear description or copy together with the destination and intended use so the likely process can be reviewed before originals are delivered."
      }
    ],
    formPrompt: "Identify the document, destination country, receiving authority and required completion date.",
    whatsappMessage: "Hello Chaman Law Firm, I need notary, apostille or document legalisation assistance.",
    heroImage: "/images/lawyers/charles-chukwuma-nkwoka.jpg"
  },
  {
    slug: "corporate-cac-legal-services-nigeria",
    eyebrow: "Business Formation and Compliance",
    title: "Corporate and CAC Legal Services in Nigeria",
    shortTitle: "Corporate and CAC Services",
    description:
      "Legal support for company formation, CAC filings, governance, contracts, compliance, restructuring and investment documentation for Nigerian and foreign-owned businesses.",
    metaTitle: "Corporate and CAC Legal Services in Nigeria",
    metaDescription:
      "Company registration, CAC compliance, corporate governance, contracts and foreign investment legal services from Chaman Law Firm in Nigeria.",
    keywords: [
      "corporate lawyer Nigeria",
      "CAC company registration lawyer",
      "company compliance Nigeria",
      "foreign owned company Nigeria",
      "commercial contract lawyer Lagos"
    ],
    audience: [
      "Founders, SMEs and established Nigerian companies",
      "Foreign investors and diaspora entrepreneurs",
      "Directors, shareholders and company secretaries",
      "NGOs, associations and incorporated trustees"
    ],
    services: [
      "Business name, company and incorporated-trustee registration",
      "Post-incorporation filings and company-record updates",
      "Shareholding, director and beneficial-ownership documentation",
      "Commercial contracts and transaction-risk review",
      "Corporate governance, board and regulatory compliance",
      "Foreign participation and investment-structure guidance"
    ],
    risks: [
      "Choosing an unsuitable entity or ownership structure",
      "Incomplete shareholder, director or beneficial-owner records",
      "Signing commercial agreements without clear risk allocation",
      "Missing annual returns, sector licences or post-incorporation filings"
    ],
    process: [
      "Define the business activity, ownership and regulatory objective",
      "Confirm name, structure, capital and documentation requirements",
      "Prepare and complete the relevant filings or agreements",
      "Provide post-completion records and continuing-compliance guidance"
    ],
    documents: [
      "Identification and contact details for owners and directors",
      "Proposed names, activities, address and ownership percentages",
      "Existing CAC documents and company records, where applicable",
      "Draft contracts, resolutions or transaction documents for review"
    ],
    faqs: [
      {
        question: "Should I register a business name or a company?",
        answer:
          "The appropriate structure depends on ownership, liability, investment, governance, tax and growth objectives. The firm can review the intended business before filing."
      },
      {
        question: "Can a foreigner own a Nigerian company?",
        answer:
          "Foreign participation is possible, subject to the appropriate company structure, capital, immigration, investment and sector-specific requirements."
      },
      {
        question: "Do you provide post-registration compliance support?",
        answer:
          "Yes. The firm supports company-record changes, annual compliance, governance documents, commercial contracts and other post-incorporation matters."
      }
    ],
    formPrompt: "Describe the proposed or existing business, ownership structure and CAC or contract assistance required.",
    whatsappMessage: "Hello Chaman Law Firm, I need corporate or CAC legal services in Nigeria.",
    heroImage: "/images/firm/firm-team.jpg"
  },
  {
    slug: "landlord-tenant-disputes-nigeria",
    eyebrow: "Lawful Tenancy Solutions",
    title: "Landlord and Tenant Dispute Lawyers in Nigeria",
    shortTitle: "Landlord and Tenant Disputes",
    description:
      "Practical legal assistance for rent arrears, notices, possession, caution fees, tenancy agreements, repairs, service charges and residential or commercial tenancy disputes.",
    metaTitle: "Landlord and Tenant Dispute Lawyer in Nigeria",
    metaDescription:
      "Legal advice for eviction, rent arrears, possession, caution fees and tenancy disputes in Lagos, Ogun and Nigeria from Chaman Law Firm.",
    keywords: [
      "landlord tenant lawyer Lagos",
      "tenant eviction lawyer Nigeria",
      "rent arrears recovery Lagos",
      "recovery of premises lawyer",
      "tenancy dispute lawyer Nigeria"
    ],
    audience: [
      "Landlords seeking lawful possession or rent recovery",
      "Tenants facing improper eviction or deposit disputes",
      "Property managers and estate associations",
      "Commercial landlords, occupiers and diaspora property owners"
    ],
    services: [
      "Tenancy agreement and notice review",
      "Rent arrears and possession strategy",
      "Recovery of premises proceedings",
      "Caution-fee, repair and service-charge disputes",
      "Commercial tenancy and lease disputes",
      "Negotiation, settlement and court representation"
    ],
    risks: [
      "Self-help eviction, lockout or utility disconnection",
      "Using an incorrect notice or service procedure",
      "Poor rent, payment, inspection or repair records",
      "Delay that increases arrears, damage or procedural exposure"
    ],
    process: [
      "Review the tenancy, notices, payments and dispute chronology",
      "Identify the applicable legal and procedural pathway",
      "Issue or respond to correspondence and explore settlement",
      "Commence or defend proceedings where necessary"
    ],
    documents: [
      "Tenancy or lease agreement",
      "Payment receipts, bank statements and rent schedule",
      "Notices, letters, messages and inspection records",
      "Photographs, inventories, repair evidence and estate correspondence"
    ],
    faqs: [
      {
        question: "Can a landlord remove a tenant without a court order?",
        answer:
          "Self-help eviction carries serious legal risk. The proper notices and recovery process depend on the tenancy facts, location and applicable law."
      },
      {
        question: "Can a tenant recover an unpaid caution fee?",
        answer:
          "The answer depends on the tenancy terms, condition of the property, documented deductions and available payment and handover evidence."
      },
      {
        question: "Can tenancy disputes be settled without litigation?",
        answer:
          "Yes. Negotiation or a documented settlement can be appropriate, but urgent protective or possession proceedings may still be necessary in some cases."
      }
    ],
    formPrompt: "State whether you are the landlord or tenant, the property location, rent status and notices already served.",
    whatsappMessage: "Hello Chaman Law Firm, I need help with a landlord and tenant dispute.",
    heroImage: "/images/lawyers/justina-edewede-obriko.png"
  },
  {
    slug: "legal-consultation-lagos",
    eyebrow: "Confidential Legal Consultation",
    title: "Speak With a Lawyer in Lagos",
    shortTitle: "Legal Consultation",
    description:
      "Begin with a focused consultation to review your facts, documents, risks, urgency and available legal options before deciding on representation or further action.",
    metaTitle: "Book a Legal Consultation in Lagos",
    metaDescription:
      "Book a confidential legal consultation with Chaman Law Firm in Lagos for property, business, disputes, debt, probate, family, immigration and notary matters.",
    keywords: [
      "legal consultation Lagos",
      "speak with a lawyer Lagos",
      "law firm consultation Nigeria",
      "lawyer near Ikeja",
      "online lawyer consultation Nigeria"
    ],
    audience: [
      "Individuals who need clarity before taking legal action",
      "Businesses reviewing a transaction, dispute or compliance issue",
      "Property owners, buyers, landlords and tenants",
      "Diaspora clients requiring Nigerian legal advice"
    ],
    services: [
      "Initial fact and document review",
      "Identification of legal and commercial risks",
      "Advice on practical options and immediate safeguards",
      "Clarification of evidence and documents required",
      "Scope, professional fees and next-stage planning",
      "Remote or in-office consultation arrangements"
    ],
    risks: [
      "Acting on incomplete facts or informal advice",
      "Signing, paying or responding before documents are reviewed",
      "Missing limitation, notice, court or transaction deadlines",
      "Assuming that a general online answer fits your specific facts"
    ],
    process: [
      "Submit a concise summary and select the relevant service",
      "Provide important documents and identify urgent deadlines",
      "Receive confirmation of scope, fee and consultation arrangement",
      "Attend the consultation and receive recommended next steps"
    ],
    documents: [
      "A concise chronology of the issue",
      "Contracts, notices, receipts or correspondence",
      "Court, property, corporate or family documents involved",
      "Specific questions and any approaching deadline"
    ],
    faqs: [
      {
        question: "Does the consultation fee cover full representation?",
        answer:
          "No. A consultation covers the agreed preliminary review and advice. Drafting, searches, negotiations, filings, court work or continuing representation are separately scoped and priced."
      },
      {
        question: "Can the consultation be conducted online?",
        answer:
          "Yes. Depending on the matter, consultations may be conducted by video, telephone or another agreed remote method, as well as in person."
      },
      {
        question: "Does booking a consultation create a lawyer-client relationship?",
        answer:
          "Submitting a request alone does not create a retainer. Representation begins only after conflict checks, scope confirmation and acceptance of the applicable engagement terms."
      }
    ],
    formPrompt: "Summarise the issue, identify any urgent deadline and list the principal documents available.",
    whatsappMessage: "Hello Chaman Law Firm, I would like to arrange a legal consultation.",
    heroImage: "/images/firm/managing-partner-office.png"
  }
];

export function getAdCampaign(slug: string) {
  return adCampaigns.find((campaign) => campaign.slug === slug);
}
