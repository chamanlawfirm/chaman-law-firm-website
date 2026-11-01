import type { Metadata } from "next";
import { LocalOfficeLanding, localOffices } from "@/components/LocalOfficeLanding";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Lawyer in Ikeja, Lagos | Legal Services and Consultation",
  description: "Speak with Chaman Law Firm in Ikeja, Lagos about property law, conveyancing, business contracts, litigation, family law and probate. Arrange a consultation.",
  path: "/lawyer-in-ikeja"
});
export default function Page() { return <LocalOfficeLanding office={localOffices.ikeja} />; }
