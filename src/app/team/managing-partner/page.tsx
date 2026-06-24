import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Managing Partner",
  description: "View the Managing Partner profile on the Chaman Law Firm lawyers page.",
  path: "/team/managing-partner",
  noIndex: true
});

export default function ManagingPartnerAliasPage() {
  redirect("/lawyers/charles-chukwuma-nkwoka");
}
