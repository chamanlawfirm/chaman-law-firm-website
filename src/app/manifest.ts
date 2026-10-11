import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chaman Law Firm",
    short_name: "Chaman Law Firm",
    description: "Full-service Nigerian law firm.",
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#b99045",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }]
  };
}
