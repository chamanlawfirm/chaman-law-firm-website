import { agents } from "@/data/agents";
import type { Property } from "@/lib/types";

export const properties: Property[] = [
  {
    id: "CP-LAG-001",
    slug: "luxury-five-bedroom-duplex-lekki-phase-one",
    title: "Luxury 5 Bedroom Fully Detached Duplex in Lekki Phase 1",
    status: "For Sale",
    type: "Detached Duplex",
    price: "NGN 650,000,000",
    location: "Lekki Phase 1",
    city: "Lagos",
    state: "Lagos",
    address: "Lekki Phase 1, Lagos, Nigeria",
    bedrooms: 5,
    bathrooms: 6,
    parking: 4,
    size: "520 sqm built area",
    landSize: "650 sqm",
    titleDocuments: ["Governor's Consent", "Registered Survey", "Deed of Assignment"],
    featuredImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "A contemporary family residence with premium finishes, spacious living areas, and verified documentation support.",
    description:
      "This luxury detached duplex is designed for buyers seeking refined living in one of Lagos' most recognized residential corridors. The property features expansive lounges, ensuite bedrooms, premium kitchen fittings, ample parking, and clear documentation review support through Chaman Properties' legal-backed acquisition process.",
    features: [
      "All rooms ensuite",
      "Fully fitted kitchen",
      "Private family lounge",
      "BQ",
      "CCTV and smart access readiness",
      "Premium finishing"
    ],
    amenities: ["Secure estate", "Paved access", "Water treatment", "Power backup readiness"],
    verified: true,
    featured: true,
    investmentNote: "Suitable for owner-occupation, executive letting, or long-term capital appreciation.",
    agent: agents[0]
  },
  {
    id: "CP-OGN-002",
    slug: "verified-residential-land-arepo-ogun",
    title: "Verified Residential Land in Arepo, Ogun State",
    status: "Investment",
    type: "Land",
    price: "NGN 38,000,000 per plot",
    location: "Arepo",
    city: "Arepo",
    state: "Ogun",
    address: "Arepo, Ogun State, Nigeria",
    landSize: "600 sqm",
    titleDocuments: ["Registered Survey", "Deed of Assignment", "Excision Review Available"],
    featuredImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "Strategic land opportunity for residential development near the Lagos-Ogun growth corridor.",
    description:
      "A land investment opportunity positioned for buyers seeking growth outside central Lagos while retaining easy access to major commuter routes. Chaman Properties can coordinate inspection, document review, negotiation, and post-acquisition monitoring for local and diaspora clients.",
    features: ["Dry land", "Residential use", "Estate development potential", "Inspection support"],
    amenities: ["Access road", "Growing neighborhood", "Commuter route proximity"],
    verified: true,
    featured: true,
    investmentNote: "Strong fit for land banking and medium-term residential development.",
    agent: agents[1]
  },
  {
    id: "CP-LAG-003",
    slug: "executive-three-bedroom-apartment-ikeja-gra",
    title: "Executive 3 Bedroom Apartment in Ikeja GRA",
    status: "For Rent",
    type: "Apartment",
    price: "NGN 12,000,000 per annum",
    location: "Ikeja GRA",
    city: "Ikeja",
    state: "Lagos",
    address: "Ikeja GRA, Lagos, Nigeria",
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    size: "210 sqm",
    titleDocuments: ["Tenancy Agreement", "Landlord Verification"],
    featuredImage:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "Secure executive apartment within a prime Ikeja residential environment, ideal for professionals and corporate tenants.",
    description:
      "A well-finished apartment with spacious rooms, reliable estate infrastructure, and proximity to business districts, airport routes, and lifestyle amenities. Tenant screening and tenancy documentation can be coordinated by Chaman Properties.",
    features: ["Ensuite bedrooms", "Fitted kitchen", "Balcony", "Security", "Dedicated parking"],
    amenities: ["Gated compound", "Water supply", "Proximity to airport", "Good road network"],
    verified: true,
    featured: true,
    agent: agents[0]
  },
  {
    id: "CP-LAG-004",
    slug: "premium-shortlet-apartment-victoria-island",
    title: "Premium Shortlet Apartment in Victoria Island",
    status: "Shortlet",
    type: "Shortlet",
    price: "NGN 180,000 per night",
    location: "Victoria Island",
    city: "Lagos",
    state: "Lagos",
    address: "Victoria Island, Lagos, Nigeria",
    bedrooms: 2,
    bathrooms: 3,
    parking: 1,
    size: "140 sqm",
    titleDocuments: ["Managed Shortlet Agreement"],
    featuredImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "Elegant serviced apartment for business travelers, visiting families, and executive stays.",
    description:
      "This premium shortlet unit offers hotel-style comfort with residential privacy. Chaman Properties can support guest screening, booking inquiry management, property readiness checks, and ongoing short-let management for owners.",
    features: ["Fully furnished", "Smart TV", "Fitted kitchen", "Housekeeping option", "Secure access"],
    amenities: ["WiFi", "Power backup", "Prime location", "Dedicated support"],
    verified: true,
    featured: false,
    agent: agents[0]
  },
  {
    id: "CP-LAG-005",
    slug: "commercial-office-space-allen-avenue-ikeja",
    title: "Commercial Office Space Near Allen Avenue, Ikeja",
    status: "For Rent",
    type: "Commercial",
    price: "NGN 25,000,000 per annum",
    location: "Allen Avenue",
    city: "Ikeja",
    state: "Lagos",
    address: "Allen Avenue, Ikeja, Lagos, Nigeria",
    parking: 8,
    size: "420 sqm",
    titleDocuments: ["Lease Agreement", "Owner Verification"],
    featuredImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "Visible commercial space for corporate offices, advisory firms, training centers, or professional services.",
    description:
      "A strategically located office asset in Ikeja with strong accessibility and business visibility. Chaman Properties supports inspection, lease negotiation, tenant verification, and documentation coordination.",
    features: ["Open-plan layout", "Private offices", "Reception area", "Parking", "Road visibility"],
    amenities: ["Central business access", "Security", "Restrooms", "Flexible fit-out potential"],
    verified: true,
    featured: false,
    agent: agents[0]
  },
  {
    id: "CP-ABJ-006",
    slug: "investment-apartments-maitama-abuja",
    title: "Investment Apartments in Maitama, Abuja",
    status: "Investment",
    type: "Apartment",
    price: "From NGN 280,000,000",
    location: "Maitama",
    city: "Abuja",
    state: "FCT",
    address: "Maitama, Abuja, Nigeria",
    bedrooms: 3,
    bathrooms: 4,
    parking: 2,
    size: "260 sqm",
    titleDocuments: ["Title Review Available", "Development Documentation"],
    featuredImage:
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80"
    ],
    summary:
      "Prime apartment investment option for capital preservation, executive letting, and portfolio diversification.",
    description:
      "A premium apartment opportunity designed for investors seeking high-quality real estate exposure in Abuja. Chaman Properties can coordinate investment advisory, title review, buyer representation, and long-term management after purchase.",
    features: ["Premium location", "Contemporary design", "Executive letting potential", "Managed option"],
    amenities: ["Security", "Elevator provision", "Concierge readiness", "Urban access"],
    verified: true,
    featured: true,
    investmentNote: "Suitable for portfolio buyers and diaspora investors seeking managed assets.",
    agent: agents[1]
  }
];
