import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Team",
  description: "Meet the Chaman Law Firm legal team through the main lawyers page.",
  path: "/team",
  noIndex: true
});

export default function TeamAliasPage() {
  redirect("/lawyers");
}
