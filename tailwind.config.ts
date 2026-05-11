import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        luxuryBlack: "#050505",
        charcoal: "#1A1A1A",
        royalGold: "#D4AF37",
        champagne: "#E8C872",
        ivory: "#F8F5EF",
        ash: "#B8B3A7"
      },
      fontFamily: {
        heading: ["Cinzel", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Montserrat", "Avenir", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 18px 60px rgba(212, 175, 55, 0.16)"
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(232,200,114,0.04) 45%, rgba(248,245,239,0.08))"
      }
    }
  },
  plugins: []
};

export default config;
