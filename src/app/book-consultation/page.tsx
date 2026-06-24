import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Book Consultation",
  description: "Book a legal consultation with Chaman Law Firm through the main consultation page.",
  path: "/book-consultation",
  noIndex: true
});

export default function BookConsultationAliasPage() {
  redirect("/consultation");
}
