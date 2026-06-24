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
        luxuryBlack: "#0B0B0B",
        charcoal: "#191919",
        royalGold: "#C8A54B",
        champagne: "#E8D6A0",
        ivory: "#FFFFFF",
        lightGray: "#F5F5F2",
        ash: "#B8B3A7",
        ink: "#111111",
        success: "#1F7A4D",
        warning: "#B98220",
        error: "#B42318",
        info: "#1D4ED8"
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 18px 60px rgba(200, 165, 75, 0.16)"
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, rgba(200,165,75,0.16), rgba(232,214,160,0.04) 45%, rgba(255,255,255,0.08))"
      }
    }
  },
  plugins: []
};

export default config;
