export const siteConfig = {
  name: "Chaman Properties",
  tagline: "Your Dream Home, Our Work.",
  description:
    "Premium real estate investment, property sales, letting, short-let, diaspora property management, and verified property advisory in Nigeria.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.chamanproperties.com",
  email: "info@chamanproperties.com",
  secondaryEmail: "chamanpropertiesltd@gmail.com",
  phones: ["08065553671", "08096888818", "08064722292"],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348065553671",
  reviewUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    "https://www.google.com/search?q=Chaman+Properties+reviews",
  socials: {
    linkedin: "https://ng.linkedin.com/company/chaman-properties",
    instagram: "https://www.instagram.com/chamanproperties",
    facebook: "https://www.facebook.com/chamanproperties",
    youtube: "https://www.youtube.com/@chamanproperties"
  },
  offices: [
    {
      name: "Ikeja, Lagos Office",
      address:
        "115, Obafemi Awolowo Way, Allen Junction, Beside Lagos Airport Hotel, Ikeja, Lagos, Nigeria.",
      mapQuery:
        "115 Obafemi Awolowo Way Allen Junction Ikeja Lagos Nigeria"
    },
    {
      name: "Arepo, Ogun Office",
      address: "Arepo, Ogun State, Nigeria.",
      mapQuery: "Arepo Ogun State Nigeria"
    }
  ]
};

export const brandColors = {
  luxuryBlack: "#050505",
  royalGold: "#D4AF37",
  charcoal: "#1A1A1A",
  ivory: "#F8F5EF",
  champagne: "#E8C872"
};

export const defaultOgImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80";
