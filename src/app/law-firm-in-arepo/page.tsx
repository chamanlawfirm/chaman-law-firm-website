import type { Metadata } from "next";
import { LocalOfficeLanding, localOffices } from "@/components/LocalOfficeLanding";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Law Firm in Arepo, Ogun State | Legal Advice and Consultation",
  description: "Contact Chaman Law Firm's Arepo office in Ogun State for advice on property transactions, tenancy matters, business agreements and estates. Book a consultation.",
  path: "/law-firm-in-arepo"
});
export default function Page() { return <LocalOfficeLanding office={localOffices.arepo} />; }
