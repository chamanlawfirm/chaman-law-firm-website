export type PropertyLocation = {
  slug: string;
  name: string;
  short: string;
  places: string[];
  focus: string;
  overview: string;
  titleIssue: string;
  transactionIssue: string;
  disputeIssue: string;
  inheritanceIssue: string;
  searchNote: string;
  questions: { question: string; answer: string }[];
  image?: string;
  officialSource?: { label: string; href: string };
  office?: { label: string; href: string };
};

export const propertyLocations: PropertyLocation[] = [
  {
    slug: "lagos", name: "Lagos State", short: "Lagos", places: ["Ikeja", "Magodo", "Lekki", "Ikoyi", "Ajah", "Ibeju-Lekki"],
    focus: "From an Ikeja family property to a Lekki development acquisition, the documents, seller's authority, survey and land status deserve separate scrutiny before funds move.",
    overview: "Property transactions across Lagos can involve private owners, companies, families, developers and estates. The relevant investigation depends on the root of title, the particular site and the proposed transaction. We help buyers and investors ask the right questions before committing to a house, apartment, commercial asset or undeveloped land.",
    titleIssue: "Check the chain of ownership against the documents offered by the seller, identify the appropriate Lagos land records and investigate survey, acquisition, planning and encumbrance issues where relevant.",
    transactionIssue: "For estate and off-plan purchases, examine the developer's authority, the promised interest, delivery milestones, payment protections and the documents that will be delivered on completion.",
    disputeIssue: "Family-land claims, competing sales, possession problems and boundary disputes may require an early examination of documents, parties and urgent remedies.",
    inheritanceIssue: "Where a seller acts for a deceased owner's estate, verify who has authority to sell and whether the proposed transfer can be validly documented.",
    searchNote: "Lagos title enquiries may involve the Lands Bureau and relevant registry, survey and planning records. The correct checks depend on the land and its history.",
    questions: [
      { question: "Can you investigate a property in Lekki or Ibeju-Lekki before I pay?", answer: "Yes. Send the location, survey and available title documents. We will agree the scope of legal, registry and survey-related checks before you make a material commitment." },
      { question: "Is a Certificate of Occupancy by itself sufficient proof that the seller can sell?", answer: "No single document answers every ownership and transaction question. The chain of title, seller's authority, encumbrances, site details and the proposed sale terms must also be considered." },
      { question: "Do you assist with Governor's Consent and title perfection in Lagos?", answer: "We can review the transaction and documentation, advise on the applicable consent and registration steps, and agree the scope of any post-completion instruction." }
    ], office: { label: "See our Lagos office details", href: "/offices/magodo-gra" }, officialSource: { label: "Lagos State land services portal", href: "https://landonline.lagosstate.gov.ng/" }
  },
  {
    slug: "ogun", name: "Ogun State", short: "Ogun", places: ["Arepo", "Abeokuta", "Ibafo", "Mowe", "Sagamu", "Ijebu-Ode"],
    focus: "Rapidly developing communities along the Lagos–Ogun corridor demand careful checks of the land's origin, family or community authority and actual site boundaries.",
    overview: "An apparently attractive plot in Arepo, Mowe or Ibafo may come with a history that is not obvious from an agent's brochure. Our review considers the seller's authority, documents, survey, possession and any title or acquisition question relevant to the specific parcel.",
    titleIssue: "Ask how the seller acquired the land, who executed earlier transfers, whether the survey identifies the same parcel and what relevant Ogun land records show.",
    transactionIssue: "Development land, estate allocations and staged payments call for a careful review of allocation terms, infrastructure promises, documents to be delivered and remedies if completion fails.",
    disputeIssue: "Competing family claims, community interests, encroachment and double sales require an evidence-led strategy before construction or further payments.",
    inheritanceIssue: "Inherited land should be examined for the authority of the proposed sellers and any competing interests among beneficiaries or family members.",
    searchNote: "The legal investigation must identify the correct Ogun records and the land's particular title history; a survey plan or receipt alone should not settle the question.",
    questions: [
      { question: "Can you help with land in Arepo, Mowe or Ibafo?", answer: "Yes. Provide the location, survey and seller's documents so we can determine the investigations and advice the transaction needs." },
      { question: "What if several family members claim the same Ogun land?", answer: "Stop short of further commitment and preserve the documents. We can assess the competing authority and title claims and advise on negotiation, protection or proceedings as appropriate." },
      { question: "Can a diaspora buyer instruct you remotely?", answer: "Yes. We can receive instructions remotely, review documents and agree the scope of local checks and transaction representation." }
    ], office: { label: "See our Arepo office details", href: "/law-firm-in-arepo" }
  },
  {
    slug: "oyo", name: "Oyo State", short: "Oyo", places: ["Ibadan", "Oyo", "Ogbomoso", "Iseyin"],
    focus: "Buyers in Ibadan and other Oyo markets should understand the seller's root of title, the land's physical identity and every interest that may affect transfer.",
    overview: "A transaction involving an established Ibadan property, peri-urban land or a family holding may raise different authority and documentation questions. We assess the documents and facts before recommending the relevant registry, survey or other investigation.",
    titleIssue: "Trace earlier transfers, compare names and descriptions across the documents and determine what title or survey evidence still needs independent confirmation.",
    transactionIssue: "A commercial building or residential acquisition calls for clear sale terms, delivery of possession, allocation of outstanding obligations and an agreed post-completion documentation plan.",
    disputeIssue: "Where a boundary or family-interest issue emerges, establish the chronology and physical parcel before choosing a protective or dispute-resolution pathway.",
    inheritanceIssue: "For land forming part of an estate, consider whether the proposed transfer is backed by the appropriate authority and documents.",
    searchNote: "Registry, survey and consent requirements should be checked against the specific Oyo transaction before a process or cost is stated.",
    questions: [
      { question: "Do you advise on buying property in Ibadan?", answer: "Yes. Share the location and documents; we can define the legal checks, review the sale terms and advise on completion." },
      { question: "Can I buy land on a family receipt alone?", answer: "A receipt alone may not establish everything needed for a safe purchase. The identity and authority of the sellers, title history and parcel must be investigated." }
    ]
  },
  {
    slug: "abuja", name: "Federal Capital Territory", short: "Abuja", places: ["Wuse", "Maitama", "Asokoro", "Gwarinpa", "Lugbe", "Jabi"],
    focus: "In the FCT, verify the actual plot, allocation and title records through the appropriate FCT channels rather than relying on copies supplied by an intermediary.",
    overview: "Buying in Abuja requires close attention to the precise plot, the recorded holder, the chain of transactions and any outstanding interest or obligation. We help clients prepare the right questions for title search, conveyancing and completion in the Federal Capital Territory.",
    titleIssue: "FCT land administration has its own title-search and deed-registration processes. Check the registered interests, plot identity and any encumbrance through appropriate official records.",
    transactionIssue: "A sale of a house, plot or commercial property should address authority, payment conditions, vacant possession, completion documents and the relevant FCT post-completion steps.",
    disputeIssue: "Double allocations, disputed transfers and competing possession claims require careful identification of the plot and the available FCT record before action is taken.",
    inheritanceIssue: "Where the registered holder has died, establish who can deal with the estate and what is needed for a proposed transfer.",
    searchNote: "The FCT Lands/AGIS service describes official title searches and deed registration. Exact requirements should be checked for the particular property and transaction.",
    questions: [
      { question: "Can you arrange legal advice on an Abuja plot before I pay?", answer: "Yes. Provide the plot details and available title papers. We can scope the relevant FCT title investigation, document review and transaction advice." },
      { question: "Is Abuja a state for this purpose?", answer: "No. This page concerns property in the Federal Capital Territory and its applicable land-administration processes." },
      { question: "Can you review an existing allocation or transfer document?", answer: "Yes. We can review its apparent terms and consistency and identify the independent checks required before relying on it." }
    ], office: { label: "See our Abuja office details", href: "/offices/abuja-wuse-zone-1" }, officialSource: { label: "FCT Lands / AGIS services", href: "https://agis.fcta.gov.ng/fctlands/services.html" }
  },
  {
    slug: "rivers", name: "Rivers State", short: "Rivers", places: ["Port Harcourt", "Obio-Akpor", "Bonny", "Eleme"],
    focus: "Port Harcourt and surrounding transactions can combine residential, commercial and industrial interests; the buyer should confirm both the parcel and the seller's power to transfer it.",
    overview: "Whether the asset is a family home, commercial premises or land proposed for development, we start with the transaction history and the client's intended use. Documentary review should be paired with the appropriate local records and physical information.",
    titleIssue: "Compare the survey, site description and chain of title; determine whether any community, family or third-party claim calls for further investigation.",
    transactionIssue: "Commercial acquisitions and leases should make obligations for possession, access, approvals, utilities, improvements and completion documents explicit.",
    disputeIssue: "Encroachment, possession and conflicting transfer claims are best assessed through documents, site facts and the sequence of events.",
    inheritanceIssue: "If an estate is disposing of a property, confirm the representative's authority and any competing beneficiary claim.",
    searchNote: "We identify the relevant Rivers records and professionals for the particular parcel; searches and approvals vary with the land's history and intended use.",
    questions: [
      { question: "Do you review commercial property transactions in Port Harcourt?", answer: "Yes. We can review title materials, sale or lease terms, completion conditions and the local investigations required for the instruction." },
      { question: "Can you advise when the land boundaries are disputed?", answer: "Yes. Share the survey, earlier documents and account of events. Legal advice may require coordinated survey and site evidence." }
    ]
  },
  {
    slug: "enugu", name: "Enugu State", short: "Enugu", places: ["Enugu", "Nsukka", "Agbani", "Oji River"],
    focus: "Enugu buyers should establish how the property passed from its previous owners and whether the person signing now can convey the interest promised.",
    overview: "Residential purchases, inherited holdings and development sites each raise different questions. We examine what the seller actually owns, who must consent, whether the physical land matches the papers and what the transaction documents will deliver.",
    titleIssue: "Review the seller's root of title, earlier conveyances, survey and the need for an independent search in the appropriate records.",
    transactionIssue: "Where a developer promises a finished unit, define the property and completion standard, payment stages, handover and documentary obligations before signature.",
    disputeIssue: "Conflicting family authority, a contested boundary or an uncompleted sale should be assessed before more funds are paid or work starts.",
    inheritanceIssue: "A sale by heirs or estate representatives calls for evidence of their authority and the status of the property in the estate.",
    searchNote: "The search plan must follow the title documents and parcel, with Enugu-specific records and current procedure verified during the instruction.",
    questions: [
      { question: "Can you help with an inherited property in Enugu?", answer: "Yes. We can review the estate and title documents, identify authority questions and advise on the proposed transfer or dispute." },
      { question: "Will you review a developer's contract before I sign?", answer: "Yes. We can assess the property description, delivery promises, payment conditions and protection if the transaction does not complete as planned." }
    ]
  },
  {
    slug: "anambra", name: "Anambra State", short: "Anambra", places: ["Awka", "Onitsha", "Nnewi", "Ekwulobia"],
    focus: "Commercial activity and family-held land can make seller identity, authority, possession and a precise description of the parcel especially important to the buyer.",
    overview: "For a shop, warehouse, residence or undeveloped land, the seller's papers should be tested against the transaction history and the site. We advise on purchase risks, documentation and what independent enquiries are required before payment.",
    titleIssue: "Confirm the source of ownership, earlier transfers, authority of family or company signatories and any claim affecting the identified plot.",
    transactionIssue: "A commercial acquisition should specify what is included, existing occupiers, delivery of possession, outstanding obligations and safe completion documents.",
    disputeIssue: "Where multiple parties claim the right to sell or occupy, preserve the chronology and assess whether negotiation, protection or litigation is warranted.",
    inheritanceIssue: "A deceased owner's property may require estate and title evidence before a beneficiary or representative can complete a sale.",
    searchNote: "The appropriate Anambra search and perfection route depends on the property's title history and the transaction proposed.",
    questions: [
      { question: "Can you review a property purchase in Onitsha or Nnewi?", answer: "Yes. Send the offer, title papers and location so we can identify the due diligence and conveyancing work required." },
      { question: "What if one relative signed a family land sale?", answer: "The authority to deal with the property must be investigated on the facts and relevant law before relying on that signature." }
    ]
  },
  {
    slug: "delta", name: "Delta State", short: "Delta", places: ["Asaba", "Warri", "Sapele", "Ughelli"],
    focus: "A transaction in Asaba, Warri or elsewhere in Delta must be tied to the correct land, seller and legal interest; location alone cannot establish title.",
    overview: "We help clients separate an attractive offer from a legally supportable acquisition. The enquiry may involve private land, a family holding, leased premises or a commercial development, each requiring an appropriate document and site review.",
    titleIssue: "Examine the title chain, seller authority, survey correspondence and any outstanding claims or security interests.",
    transactionIssue: "Draft completion conditions that address payments, approvals where relevant, delivery of documents and handover of possession.",
    disputeIssue: "A contested sale, encroachment or occupation problem should be assessed with contemporaneous evidence and a careful account of the parties' rights.",
    inheritanceIssue: "Check authority before a person purporting to represent an estate signs an agreement or collects purchase money.",
    searchNote: "Relevant Delta land and survey records should be identified from the property's actual location, title and transaction history.",
    questions: [
      { question: "Can you assess a title in Asaba or Warri?", answer: "Yes. We can review the documents and identify the official searches and other checks needed for the property." },
      { question: "What should I do if the seller changes the agreed completion documents?", answer: "Do not assume the revised documents protect the same interest. Seek a review of the changes and their effect before completion." }
    ]
  },
  {
    slug: "edo", name: "Edo State", short: "Edo", places: ["Benin City", "Ekpoma", "Auchi", "Uromi"],
    focus: "A buyer in Edo should investigate who first held the land, who may now dispose of it and whether the boundaries and interests are consistent across the papers.",
    overview: "We review residential, commercial and development transactions from the perspective of a buyer or owner who needs clear answers before signature, payment or building work. The right investigation is determined by the facts and the parcel.",
    titleIssue: "Test the origin of title, signatures and survey against the property offered; establish whether family, company or third-party interests need further enquiry.",
    transactionIssue: "Negotiate a contract that identifies the property, payment stages, deliverables, possession and remedies for a failed completion.",
    disputeIssue: "Competing sales, trespass and an uncertain boundary call for an early document and evidence review.",
    inheritanceIssue: "Inherited property needs a review of who can represent the estate and whether their authority extends to this sale.",
    searchNote: "Edo-specific registry and survey enquiries should be checked for the particular property before reliance on a seller's documents.",
    questions: [
      { question: "Can you advise on land in Benin City?", answer: "Yes. We can scope title, authority, survey and contract review from the documents and property details you provide." },
      { question: "What if I discover an earlier sale of the same plot?", answer: "Preserve every document and payment record and obtain prompt advice on title, competing rights and available protective steps." }
    ]
  },
  {
    slug: "imo", name: "Imo State", short: "Imo", places: ["Owerri", "Orlu", "Okigwe"],
    focus: "Property decisions in Owerri and elsewhere in Imo require careful treatment of seller authority, the land's identity and any family or estate interests.",
    overview: "A proposed sale can appear straightforward until questions arise about earlier owners, family members, possession or documents. We help purchasers, owners and investors identify what must be verified and how the agreement should allocate risk.",
    titleIssue: "Review the document history and seller capacity, compare descriptions with the site and identify necessary registry or survey checks.",
    transactionIssue: "For homes and development plots, clarify vacant possession, outstanding obligations, completion dates and the legal interest the buyer will receive.",
    disputeIssue: "Family opposition, conflicting boundaries or a broken agreement should be approached through evidence, early advice and proportionate resolution steps.",
    inheritanceIssue: "Do not treat an heir's assertion of ownership as a substitute for reviewing the estate and its authority to transfer.",
    searchNote: "The appropriate Imo land-record checks and documentation must be identified after review of the parcel and proposed interest.",
    questions: [
      { question: "Can you help review a sale by several family members in Imo?", answer: "Yes. We can assess the claimed ownership and authority, proposed deed and the further verification required before payment." },
      { question: "Will you act for a buyer living abroad?", answer: "Yes. We can discuss remote instruction, document review and a defined scope for local investigation and representation." }
    ]
  },
  {
    slug: "abia", name: "Abia State", short: "Abia", places: ["Aba", "Umuahia", "Ohafia", "Arochukwu"],
    focus: "Aba's commercial premises and other Abia property transactions need sound title investigation as well as precise lease, sale and possession terms.",
    overview: "We assist clients who need to buy, lease, develop or protect property in Abia. The work begins with the documents and the client's objective: a commercial occupier has different risks from a family buying land for a home.",
    titleIssue: "Verify the seller's chain of title, identity and power to transact, and determine whether the survey and records describe the property actually offered.",
    transactionIssue: "For a shop, warehouse or other business property, review permitted use, occupation, existing tenants, repair and handover obligations.",
    disputeIssue: "Commercial possession, unpaid sums, contested ownership or encroachment may require contract review and a planned remedy.",
    inheritanceIssue: "An estate-owned commercial asset should be sold or leased by a person with demonstrable authority.",
    searchNote: "The relevant Abia registry and transaction steps depend on title type, parcel and proposed transfer or lease.",
    questions: [
      { question: "Can you review a commercial lease in Aba?", answer: "Yes. We can assess the property description, duration, rent, permitted use, repairs, renewal and termination provisions." },
      { question: "Can you check title before I buy in Umuahia?", answer: "Yes. We can agree an appropriate title, seller-authority and document investigation once the property details are available." }
    ]
  },
  {
    slug: "ebonyi", name: "Ebonyi State", short: "Ebonyi", places: ["Abakaliki", "Afikpo", "Onueke"],
    focus: "In Ebonyi, a clear account of ownership and the exact boundaries of the land should precede payment, construction or a development agreement.",
    overview: "A buyer may receive a receipt, survey or informal account of ownership, but each needs to be evaluated as part of the full transaction. We help establish what additional enquiries, consents or documents are needed for the specific property.",
    titleIssue: "Investigate the claimed root of title, authority of signatories, physical location and any prior sale, charge or adverse interest.",
    transactionIssue: "Set out the interest to be transferred, staged payments, completion conditions, possession and responsibility for further documentation.",
    disputeIssue: "An uncertain boundary or competing seller should be resolved through properly gathered evidence before the transaction proceeds.",
    inheritanceIssue: "Family and estate holdings require attention to who holds authority and who else may claim an interest.",
    searchNote: "Ebonyi land and survey procedures should be checked for the parcel and current transaction, rather than assumed from another state's practice.",
    questions: [
      { question: "Can you advise on land near Abakaliki?", answer: "Yes. Provide the location, available survey and title documents and the seller's details so we can define the checks required." },
      { question: "What if I have only a purchase receipt?", answer: "A receipt may help establish a payment history, but it does not by itself answer all questions about ownership, authority, boundaries or competing rights." }
    ]
  }
];

export const propertyLocationBySlug = Object.fromEntries(propertyLocations.map((item) => [item.slug, item])) as Record<string, PropertyLocation>;
