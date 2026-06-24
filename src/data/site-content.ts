import type { Faq } from "@/lib/types";
import { keyDifferentiators, professionalMemberships } from "@/data/resources";

export const officeLocations = [
  {
    name: "Head Office",
    address: "115 Obafemi Awolowo Way, Allen Junction, Ikeja, Lagos State, Nigeria.",
    mapQuery: "115 Obafemi Awolowo Way Allen Junction Ikeja Lagos Nigeria",
    phone: "+2348065553671",
    email: "info@chamanlawfirm.com"
  },
  {
    name: "Branch Office",
    address: "5 Olalekan Ogunjobi Street, Havana Estate, Arepo, Ogun State, Nigeria.",
    mapQuery: "5 Olalekan Ogunjobi Street Havana Estate Arepo Ogun Nigeria",
    phone: "+2348096888818",
    email: "chamanlawfirm@gmail.com"
  }
];

export const targetAudiences = [
  "Property buyers",
  "Property investors",
  "Real estate developers",
  "Diaspora Nigerians",
  "Corporate organizations",
  "SMEs",
  "Financial institutions",
  "Families",
  "Entrepreneurs",
  "Foreign investors",
  "Government contractors",
  "NGOs"
];

export const homepageContent = {
  hero: {
    eyebrow: "Full-Service Nigerian Law Firm",
    title: "Chaman Law Firm",
    tagline: "Protecting your property, business, rights, and future.",
    copy:
      "Chaman Law Firm provides strategic legal solutions to individuals, businesses, investors, developers, financial institutions, and diaspora clients across property law, real estate transactions, corporate and commercial law, litigation, debt recovery, probate, immigration, family law, and notary public services.",
    primaryCta: "Book Consultation",
    secondaryCta: "Explore Practice Areas"
  },
  trustIndicators: [
    {
      title: "Property Law Authority",
      text: "Recognized strength in property law, real estate transactions, title verification, due diligence, and diaspora property protection."
    },
    {
      title: "Full-Service Legal Capability",
      text: "Corporate law, litigation, debt recovery, probate, immigration, family law, notary services, and private-client support."
    },
    {
      title: "Diaspora Client Focus",
      text: "Representation for Nigerians abroad who need trusted legal action, document execution, and property protection in Nigeria."
    },
    {
      title: "Technology-Driven Service",
      text: "A modern legal platform for consultation booking, legal education, downloads, media, and digital legal service delivery."
    }
  ],
  stats: [
    { value: "Full-Service", label: "Legal capability" },
    { value: "2 Offices", label: "Lagos and Ogun" },
    { value: "8+", label: "Core practice areas" },
    { value: "Global", label: "Diaspora support" }
  ],
  signatureExpertise: {
    title: "Property, business, dispute, and diaspora legal support with documentation discipline",
    copy:
      "The firm is particularly recognized for property law, real estate transactions, corporate and commercial law, dispute resolution, debt recovery, probate, notary services, and diaspora legal support.",
    points: [
      "Property verification before payment",
      "Title investigation and due diligence",
      "Governor's Consent and perfection advisory",
      "Commercial contract drafting and review",
      "Litigation, mediation, arbitration, and negotiation",
      "Probate, estate administration, and family-property support"
    ]
  },
  diasporaServices: {
    title: "Trusted Nigerian legal representation for diaspora clients",
    copy:
      "Nigerians abroad often need reliable legal support for property purchase, property verification, power of attorney, document execution, investment protection, probate, family matters, and dispute resolution in Nigeria.",
    points: [
      "Remote legal consultation and document review",
      "Power of attorney and notary support",
      "Property due diligence and transaction representation",
      "Probate and family-property support",
      "Dispute prevention and resolution",
      "Clear communication for clients outside Nigeria"
    ]
  },
  clientJourney: [
    "Book a consultation or send a concise matter brief",
    "Receive preliminary issue identification and document guidance",
    "Approve scope, strategy, timeline, and next steps",
    "Proceed with drafting, review, negotiation, filing, representation, or advisory support"
  ],
  authoritySignals: [
    ...professionalMemberships,
    ...keyDifferentiators
  ]
};

export const aboutContent = {
  positioning:
    "Chaman Law Firm is a full-service Nigerian law firm providing strategic legal solutions to individuals, businesses, investors, developers, financial institutions, and diaspora clients.",
  vision:
    "To become one of the most respected, trusted, innovative, and influential law firms in Nigeria and Africa while setting new standards for legal excellence, client service, and digital legal innovation.",
  mission:
    "To provide exceptional legal services that protect clients' interests, create value, promote justice, and support sustainable personal and business growth through professional excellence, integrity, innovation, and strategic legal representation.",
  values: [
    "Integrity",
    "Excellence",
    "Professionalism",
    "Innovation",
    "Client Commitment",
    "Trust",
    "Leadership"
  ],
  brandPersonality: [
    "Professional",
    "Sophisticated",
    "Authoritative",
    "Trustworthy",
    "Modern",
    "Strategic",
    "Intelligent",
    "Reliable",
    "Elegant",
    "Confident",
    "Accessible",
    "Human"
  ]
};

export const globalFaqs: Faq[] = [
  {
    question: "What legal services does Chaman Law Firm provide?",
    answer:
      "Chaman Law Firm provides legal support in property and real estate law, corporate and commercial law, litigation and dispute resolution, debt recovery, probate and estate administration, immigration, family law, notary public services, and diaspora legal matters."
  },
  {
    question: "Can Chaman Law Firm help diaspora clients with Nigerian property matters?",
    answer:
      "Yes. The firm supports Nigerians abroad with property due diligence, title verification, power of attorney, document execution, transaction representation, probate matters, family-property issues, and dispute prevention."
  },
  {
    question: "How can I book a legal consultation?",
    answer:
      "You can book a consultation through the consultation page, call the firm, send a WhatsApp message, or submit a legal enquiry through the website form."
  },
  {
    question: "Where are Chaman Law Firm's offices?",
    answer:
      "The head office is at 115 Obafemi Awolowo Way, Allen Junction, Ikeja, Lagos State, Nigeria. The branch office is at 5 Olalekan Ogunjobi Street, Havana Estate, Arepo, Ogun State, Nigeria."
  }
];

export const consultationContent = {
  title: "Start your legal matter with a focused consultation",
  copy:
    "A consultation helps the firm understand your issue, identify relevant documents, clarify urgency, and recommend the right legal pathway before deeper representation begins.",
  steps: [
    "Tell us the legal issue, parties involved, location, urgency, and preferred contact method",
    "Prepare available documents such as title papers, contracts, correspondence, court papers, or identity documents",
    "The firm reviews your enquiry and confirms the appropriate consultation pathway",
    "You receive practical direction on scope, next steps, timeline, and representation options"
  ]
};
