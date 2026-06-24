import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use",
  description: "Terms governing access to and use of the Chaman Law Firm website and its general legal information.",
  path: "/terms-of-use"
});

export default function TermsOfUsePage() {
  return (
    <LegalDocument
      eyebrow="Website Terms"
      title="Terms of Use"
      description="These terms govern access to and use of the Chaman Law Firm website."
      lastUpdated="20 June 2026"
    >
      <h2>1. Acceptance</h2>
      <p>By using this website, you agree to these terms. If you do not agree, please discontinue use.</p>

      <h2>2. General information only</h2>
      <p>Website materials provide general legal information and do not constitute legal advice for a particular matter. Laws and procedures change, and outcomes depend on specific facts.</p>

      <h2>3. No lawyer-client relationship</h2>
      <p>Accessing the website, sending an enquiry or downloading material does not create a lawyer-client relationship. An engagement begins only after the firm completes required checks, agrees the scope and confirms acceptance.</p>

      <h2>4. Permitted use</h2>
      <p>You may use the website for lawful personal or business information purposes. You must not attempt unauthorized access, interfere with operation, submit malicious content, scrape abusively, misrepresent identity or use materials unlawfully.</p>

      <h2>5. Intellectual property</h2>
      <p>Unless otherwise stated, website text, branding, layouts and original resources belong to Chaman Law Firm or are used under licence. Limited quotation or sharing must preserve attribution and must not imply endorsement.</p>

      <h2>6. External links and availability</h2>
      <p>External links are provided for convenience. The firm does not control external content or availability. Website access may be suspended or changed for maintenance, security or operational reasons.</p>

      <h2>7. Liability</h2>
      <p>To the extent permitted by law, the firm is not responsible for loss arising solely from reliance on general website information, unavailable services or third-party content. Nothing in these terms excludes liability that cannot lawfully be excluded.</p>

      <h2>8. Governing law</h2>
      <p>These terms are governed by applicable laws of the Federal Republic of Nigeria. Questions may be sent to <a href="mailto:info@chamanlawfirm.com">info@chamanlawfirm.com</a>.</p>
    </LegalDocument>
  );
}
