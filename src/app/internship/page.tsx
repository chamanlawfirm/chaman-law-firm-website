import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Internship",
  description: "Review career and internship opportunities with Chaman Law Firm through the main careers page.",
  path: "/internship",
  noIndex: true
});

export default function LegacyInternshipPage() {
  redirect("/careers");
}
