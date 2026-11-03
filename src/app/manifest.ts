import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chaman Law Firm",
    short_name: "Chaman Law Firm",
    description: "Full-service Nigerian law firm.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/favicon.svg?v=20261103", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-touch-icon.png?v=20261103", sizes: "180x180", type: "image/png", purpose: "any" }
    ]
  };
}
