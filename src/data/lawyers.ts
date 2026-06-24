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
    position: "Associate",
    credentials: ["LL.B", "B.L"],
    summary:
      "Ibraheem Akewusola, Esq. is an Associate supporting corporate advisory, property transactions, legal drafting, dispute resolution, research and regulatory compliance.",
    biography: [
      "Ibraheem Akewusola, Esq. is a dedicated legal practitioner and Associate at Chaman Law Firm. He supports clients through careful research, legal drafting, transaction support and practical advisory work.",
      "His areas of interest include corporate and commercial law, contracts, property documentation, due diligence, conveyancing, civil litigation support, negotiation and regulatory compliance.",
      "He remains committed to continuous professional development and to delivering responsive, reliable and value-driven legal support."
    ],
    practiceAreas: ["Corporate & Commercial Law", "Property & Real Estate Law", "Litigation & Dispute Resolution"],
    memberships: [],
    admissions: ["Barrister and Solicitor of the Supreme Court of Nigeria"],
    experience: [
      "Legal research, case analysis and preparation of legal opinions",
      "Contract drafting, review and corporate-compliance support",
      "Property documentation, due diligence and conveyancing support",
      "Civil litigation and alternative dispute-resolution support",
      "Client advisory, regulatory research and transaction support"
    ],
    publications: [],
    mediaFeatures: [],
    awards: [],
    philosophy:
      "Professional legal service should be grounded in integrity, accountability, continuous learning and practical problem-solving.",
    image: "/images/lawyers/ibraheem-akewusola.jpg"
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
  }
];

export function getLawyerBySlug(slug: string) {
  return lawyers.find((lawyer) => lawyer.slug === slug) || null;
}
