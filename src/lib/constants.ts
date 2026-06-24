function getCanonicalSiteUrl() {
  const fallback = "https://chamanlawfirm.com";
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback;

  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname !== "chamanlawfirm.com") return fallback;

    url.protocol = "https:";
    url.hostname = "chamanlawfirm.com";
    url.port = "";
    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "Chaman Law Firm",
  tagline: "Protecting Your Property, Business, Rights, and Future.",
  description:
    "Chaman Law Firm is a full-service Nigerian law firm providing strategic legal solutions in property law, real estate transactions, corporate and commercial law, litigation, debt recovery, probate, notary public services, and diaspora legal support.",
  url: getCanonicalSiteUrl(),
  email: "info@chamanlawfirm.com",
  secondaryEmail: "chamanlawfirm@gmail.com",
  phones: ["+2348065553671", "+2348096888818"],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348065553671",
  reviewUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    "https://www.google.com/search?q=Chaman+Law+Firm+reviews",
  socials: {
    linkedin: "https://www.linkedin.com/company/chaman-law-firm/",
    instagram: "https://www.instagram.com/chamanlawfirm/",
    facebook: "https://www.facebook.com/chamanlawfirm/",
    youtube: "https://www.youtube.com/@chamanlawfirm",
    tiktok: "https://www.tiktok.com/@chamanlawfirm"
  },
  offices: [
    {
      name: "Head Office",
      address:
        "115 Obafemi Awolowo Way, Allen Junction, Ikeja, Lagos State, Nigeria.",
      mapQuery:
        "115 Obafemi Awolowo Way Allen Junction Ikeja Lagos Nigeria"
    },
    {
      name: "Branch Office",
      address: "5 Olalekan Ogunjobi Street, Havana Estate, Arepo, Ogun State, Nigeria.",
      mapQuery: "5 Olalekan Ogunjobi Street Havana Estate Arepo Ogun Nigeria"
    }
  ]
};

export const brandColors = {
  luxuryBlack: "#0B0B0B",
  royalGold: "#C8A54B",
  charcoal: "#191919",
  ivory: "#FFFFFF",
  champagne: "#E8D6A0",
  lightGray: "#F5F5F2"
};

export const defaultOgImage =
  `${siteConfig.url}/images/firm/firm-team.jpg`;
