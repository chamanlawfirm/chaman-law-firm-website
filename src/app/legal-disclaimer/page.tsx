import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Legal Disclaimer",
  description: "Important limitations concerning legal information, enquiries and resources on the Chaman Law Firm website.",
  path: "/legal-disclaimer"
});

export default function LegalDisclaimerPage() {
  return (
    <LegalDocument
      eyebrow="Important Notice"
      title="Legal Disclaimer"
      description="Please read these limitations before relying on website information or sending sensitive material."
      lastUpdated="20 June 2026"
    >
      <h2>Not legal advice</h2>
      <p>Information on this website is general and educational. It is not a substitute for advice based on the facts, documents, deadlines and law applicable to your matter.</p>

      <h2>No automatic engagement or confidentiality guarantee</h2>
      <p>Sending an enquiry does not mean the firm has accepted your matter or agreed to act. Do not assume that a limitation period, court date, transaction deadline or other urgent obligation is protected until the firm confirms an engagement. Avoid sending highly sensitive or privileged material through an unconfirmed channel.</p>

      <h2>No outcome guarantee</h2>
      <p>Past work, testimonials, examples and general descriptions do not guarantee a similar result. Legal and commercial outcomes depend on facts, evidence, counterparties, authorities, courts and applicable law.</p>

      <h2>Jurisdiction and changes</h2>
      <p>Materials may focus on Nigerian law and may not apply in another jurisdiction. Legal information may become outdated after publication. Obtain current advice before acting.</p>

      <h2>Emergency and urgent matters</h2>
      <p>This website is not an emergency service. For urgent assistance, call the firm directly and seek appropriate emergency or public-authority support where necessary.</p>

      <h2>Contact</h2>
      <p>To request legal assistance, use the consultation page, call the firm or email <a href="mailto:info@chamanlawfirm.com">info@chamanlawfirm.com</a>.</p>
    </LegalDocument>
  );
}
