export type Lawyer = {
  slug: string;
  name: string;
  position: string;
  credentials: string[];
  summary: string;
  biography: string[];
  practiceAreas: string[];
  memberships: string[];
  admissions: string[];
  experience: string[];
  publications: string[];
  mediaFeatures: string[];
  awards: string[];
  philosophy: string;
  image: string;
  preservePortraitFraming?: boolean;
};

export const lawyers: Lawyer[] = [
  {
    slug: "charles-chukwuma-nkwoka",
    name: "Charles Chukwuma Nkwoka",
    position: "Managing Partner",
    credentials: ["LL.B", "B.L", "LL.M", "CMC", "FIMC", "AICMC", "ACIArb", "KSM", "Notary Public"],
    summary:
      "Charles Chukwuma Nkwoka, Esq. is the Managing Partner of Chaman Law Firm and a Nigerian legal practitioner known for property law, commercial advisory, dispute resolution and practical counsel for local and diaspora clients.",
    biography: [
      "Charles Chukwuma Nkwoka, Esq. is a distinguished Nigerian legal practitioner, property law expert, mediator and business strategist with extensive experience in real estate transactions, corporate law, dispute resolution and business development.",
      "As Managing Partner, he leads the strategic direction and legal-service standards of Chaman Law Firm. His work includes property due diligence, title verification, conveyancing, corporate and commercial advisory, title perfection, debt recovery, probate, notarial practice and alternative dispute resolution.",
      "He is particularly committed to helping individuals, businesses, investors and Nigerians in the diaspora make legally sound decisions while protecting their property, commercial and family interests in Nigeria."
    ],
    practiceAreas: [
      "Property & Real Estate Law",
      "Corporate & Commercial Law",
      "Litigation & Dispute Resolution",
      "Debt Recovery",
      "Probate & Estate Administration",
      "Notary Public Services",
      "Immigration Services",
      "Family Law"
    ],
    memberships: [
      "Nigerian Bar Association",
      "Institute of Chartered Mediators and Conciliators",
      "Nigerian Institute of Chartered Arbitrators",
      "Chartered Institute of Management Consultants",
      "Lagos Chamber of Commerce and Industry"
    ],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Property due diligence, land verification, title investigation and title perfection",
      "Conveyancing, joint ventures and real estate transaction structuring",
      "Corporate governance, commercial contracts and regulatory compliance",
      "Mediation, arbitration, negotiation and commercial dispute resolution",
      "Debt recovery, probate, estate administration, notarial and diaspora legal services"
    ],
    publications: [
      "Chaman Law Firm legal education and client resource guides",
      "Property law, corporate law, probate and diaspora legal commentary"
    ],
    mediaFeatures: ["Chaman Law Firm legal education and public commentary channels"],
    awards: [],
    philosophy:
      "Legal services should combine technical excellence, professional integrity, commercial awareness and practical value for every client.",
    image: "/images/lawyers/charles-chukwuma-nkwoka.jpg"
  },
  {
    slug: "justina-edewede-obriko",
    name: "Justina Edewede Obriko",
    position: "Senior Associate & Practice Manager",
    credentials: ["LL.B", "B.L"],
    summary:
      "Justina Edewede Obriko, Esq. is a Senior Associate and Practice Manager with experience in litigation, corporate and commercial law, property transactions, debt recovery, family law and legal operations.",
    biography: [
      "Justina Edewede Obriko, Esq. is an accomplished Nigerian legal practitioner, Senior Associate and Practice Manager at Chaman Law Firm. She combines legal judgment with strong practice-management capability and a clear commitment to client service.",
      "Her work spans corporate and commercial advisory, civil and commercial litigation, debt recovery, property transactions, conveyancing, family law, probate and estate matters. She also supports quality assurance, workflow coordination and effective client engagement across the firm.",
      "Justina approaches every instruction with diligence, responsiveness and practical problem-solving, helping clients understand their options and move toward legally sound outcomes."
    ],
    practiceAreas: [
      "Corporate & Commercial Law",
      "Litigation & Dispute Resolution",
      "Property & Real Estate Law",
      "Debt Recovery",
      "Family Law",
      "Probate & Estate Administration"
    ],
    memberships: ["Nigerian Bar Association", "Nigerian Bar Association, Lagos Branch"],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Corporate advisory, business formation, contracts and regulatory compliance",
      "Civil and commercial litigation, negotiation and settlement",
      "Property transactions, title verification, due diligence and conveyancing",
      "Debt recovery, family law, probate and estate matters",
      "Legal operations, workflow coordination and client relationship management"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Effective legal representation requires expertise, integrity, clear communication and practical solutions tailored to the client's circumstances.",
    image: "/images/lawyers/justina-edewede-obriko.png"
  },
  {
    slug: "arinze-amobi",
    name: "Arinze Amobi",
    position: "Head of Litigation",
    credentials: ["LL.B", "B.L", "15+ Years' Experience"],
    summary:
      "Arinze Amobi, Esq. is the Head of Litigation at Chaman Law Firm, with more than fifteen years of experience in civil and criminal litigation, commercial disputes, insolvency and alternative dispute resolution.",
    biography: [
      "Arinze Amobi, Esq. is an experienced advocate, strategic legal adviser and dispute-resolution professional. He leads the litigation practice at Chaman Law Firm and has represented individuals, businesses, financial institutions and corporate organisations before courts and tribunals in Nigeria.",
      "His practice covers civil and commercial litigation, property and land disputes, debt recovery, enforcement, criminal defence, corporate conflicts, insolvency, restructuring and negotiated settlement.",
      "He is known for meticulous preparation, resilient advocacy and a commercially aware approach to resolving disputes while protecting clients' legal and practical interests."
    ],
    practiceAreas: [
      "Litigation & Dispute Resolution",
      "Debt Recovery",
      "Corporate & Commercial Law",
      "Property & Real Estate Law"
    ],
    memberships: [],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Civil, commercial, property and land litigation",
      "Criminal defence and representation before law-enforcement agencies",
      "Debt recovery, judgment enforcement and asset-tracing strategy",
      "Insolvency, restructuring, creditor and debtor representation",
      "Negotiation, mediation, settlement and arbitration support"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Strong advocacy combines legal knowledge, strategic planning, persistence and unwavering dedication to the client's interests.",
    image: "/images/lawyers/arinze-amobi.jpg"
  },
  {
    slug: "ibraheem-akewusola",
    name: "Ibraheem Akewusola",
    position: "Legal Associate",
    credentials: ["LL.B", "B.L"],
    summary:
      "Ibraheem Akewusola, Esq. advises and supports individuals and businesses on property transactions, commercial agreements, regulatory compliance and civil disputes.",
    biography: [
      "Ibraheem Akewusola, Esq. is a Legal Associate at Chaman Law Firm and a Barrister and Solicitor of the Supreme Court of Nigeria. He earned his LL.B from Al-Hikmah University, Ilorin, in 2023 and his B.L from the Nigerian Law School, Abuja Campus, in 2025.",
      "His work spans corporate and commercial advisory, property transactions and civil litigation support. He researches legal issues, drafts and reviews agreements and other instruments, and assists with contract negotiations, property due diligence and conveyancing. He also supports clients and the firm's legal team on regulatory compliance and dispute resolution.",
      "Ibraheem brings a commercially minded approach to his work, helping clients understand the legal consequences of a proposed transaction or course of action. He keeps abreast of developments in his areas of practice. Outside work, he enjoys reading, listening to music and exercising."
    ],
    practiceAreas: ["Corporate & Commercial Law", "Property & Real Estate Law", "Litigation & Dispute Resolution"],
    memberships: [],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Legal research, case analysis and preparation of legal opinions",
      "Contract drafting, review and negotiation support",
      "Property documentation, due diligence and conveyancing",
      "Corporate advisory and regulatory compliance",
      "Civil litigation and dispute resolution support"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Professional legal service should be grounded in integrity, accountability, continuous learning and practical problem-solving.",
    image: "/images/lawyers/ibraheem-akewusola.png",
    preservePortraitFraming: true
  },
  {
    slug: "martha-elendu",
    name: "Martha Elendu",
    position: "Associate",
    credentials: ["LL.B", "B.L"],
    summary:
      "Martha Elendu, Esq. is an Associate whose work includes legal research, corporate compliance, property transactions, dispute-resolution support and client advisory services.",
    biography: [
      "Martha Elendu, Esq. is a results-driven legal practitioner at Chaman Law Firm. She brings diligence, analytical precision and a client-focused approach to legal research, drafting, advisory and transaction support.",
      "Her work includes corporate and commercial advisory, contract review, property documentation, title verification, due diligence, conveyancing, civil litigation support and alternative dispute resolution.",
      "Martha is committed to continuous learning and to providing practical legal support that addresses immediate concerns while helping clients manage longer-term risk."
    ],
    practiceAreas: ["Corporate & Commercial Law", "Property & Real Estate Law", "Litigation & Dispute Resolution"],
    memberships: [],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Legal research, case analysis and preparation of opinions",
      "Contract drafting, corporate compliance and commercial support",
      "Property documentation, title verification and due diligence",
      "Conveyancing and land-acquisition advisory support",
      "Civil litigation, negotiation and dispute-resolution support"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "The practice of law requires integrity, competence, diligence and a genuine commitment to serving each client's needs.",
    image: "/images/lawyers/martha-elendu.jpg"
  },
  {
    slug: "victoria-nwofia",
    name: "Victoria N. Nwofia",
    position: "Associate",
    credentials: ["LL.B", "B.L"],
    summary:
      "Victoria N. Nwofia, Esq. is an Associate supporting legal research, documentation, client advisory, property and commercial transactions, litigation and regulatory compliance.",
    biography: [
      "Victoria N. Nwofia, Esq. is a motivated legal practitioner at Chaman Law Firm. She combines legal research, analytical reasoning and attentive client service to support practical and effective legal solutions.",
      "Her areas of work include corporate advisory, contract review, property transactions, title verification, due diligence, conveyancing, civil litigation support, negotiation and regulatory compliance.",
      "Victoria is committed to ethical practice, continuous professional development and clear, responsive service for individuals, businesses and organisations."
    ],
    practiceAreas: ["Corporate & Commercial Law", "Property & Real Estate Law", "Litigation & Dispute Resolution"],
    memberships: [],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Legal research, analysis and document preparation",
      "Corporate advisory, contract review and regulatory compliance",
      "Property transactions, title verification and due diligence",
      "Conveyancing and property-documentation support",
      "Civil litigation, negotiation and dispute-resolution support"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Effective legal service is built on professionalism, integrity, diligence, attention to detail and genuine commitment to the client's interests.",
    image: "/images/lawyers/victoria-nwofia.jpg"
  },
  {
    slug: "stephen-chukwudi",
    name: "Stephen Chukwudi",
    position: "Legal Associate",
    credentials: [],
    summary:
      "Stephen Chukwudi, Esq. is a Legal Associate with a focus on property documentation, title verification, legal due diligence and conveyancing.",
    biography: [
      "Stephen Chukwudi, Esq. is a Legal Associate at Chaman Law Firm. His principal interest is Nigerian real estate law, particularly the work that helps clients assess property before committing to a purchase. His interests include reviewing title documents, verifying ownership and preparing the documents needed to transfer an interest in land.",
      "Stephen also takes an interest in corporate and commercial law, contract drafting and intellectual property. He is committed to developing his practice through careful legal analysis, clear communication and attention to the practical questions clients bring to the firm."
    ],
    practiceAreas: ["Property & Real Estate Law", "Corporate & Commercial Law"],
    memberships: [],
    admissions: [],
    experience: [],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy: "",
    image: "/images/lawyers/stephen-chukwudi.png",
    preservePortraitFraming: true
  },
  {
    slug: "elijah-adomeh",
    name: "Elijah Adomeh",
    position: "Associate",
    credentials: [],
    summary:
      "Elijah Adomeh is an Associate whose practice interests include corporate finance, commercial transactions, real estate and dispute resolution.",
    biography: [
      "Elijah Adomeh is an Associate at Chaman Law Firm with a particular interest in corporate advisory and commercial transactions. His practice interests centre on how legal and financial considerations shape the terms of a deal and the obligations each party assumes.",
      "His interests extend to real estate and dispute resolution. Across these areas, he is interested in how the terms agreed at the outset affect the parties' options when a transaction changes course or a dispute arises."
    ],
    practiceAreas: ["Corporate & Commercial Law", "Property & Real Estate Law", "Litigation & Dispute Resolution"],
    memberships: [],
    admissions: [],
    experience: [],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy: "",
    image: "/images/lawyers/elijah-adomeh.png",
    preservePortraitFraming: true
  },
  {
    slug: "omolola-m-adeshina",
    name: "Omolola M. Adeshina",
    position: "Associate",
    credentials: ["LL.B", "B.L"],
    summary:
      "Omolola M. Adeshina, Esq. works on civil disputes, property transactions and client advisory matters and supports project coordination for the Chaman Dispute Resolution Centre.",
    biography: [
      "Omolola M. Adeshina, Esq. is an Associate at Chaman Law Firm. She earned her LL.B from Lagos State University and was called to the Nigerian Bar in July 2025 after completing her professional training at the Nigerian Law School, Bwari.",
      "Her experience includes court representation, litigation support, client consultations, legal research, and drafting and reviewing legal documents. She works on contentious and non-contentious matters, with particular interests in property documentation, dispute management, corporate and commercial law, and regulatory compliance.",
      "Omolola also supports project coordination for the Chaman Dispute Resolution Centre (CDRC), where she contributes to the development and implementation of the Centre's operating framework and dispute resolution initiatives. Her experience in organisational operations, human resource support and stakeholder engagement informs how she coordinates matters and communicates with the people involved."
    ],
    practiceAreas: ["Litigation & Dispute Resolution", "Property & Real Estate Law", "Corporate & Commercial Law", "ADR / Mediation"],
    memberships: [],
    admissions: ["Called to the Nigerian Bar, July 2025"],
    experience: [
      "Court representation, legal research and litigation support",
      "Client consultation, legal advisory and matter coordination",
      "Property transactions and drafting and review of legal documents",
      "Project coordination for the Chaman Dispute Resolution Centre"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Omolola approaches client matters with diligence, clear communication and a commitment to ethical practice.",
    image: "/images/lawyers/omolola-m-adeshina.png",
    preservePortraitFraming: true
  }
];

export function getLawyerBySlug(slug: string) {
  return lawyers.find((lawyer) => lawyer.slug === slug) || null;
}
