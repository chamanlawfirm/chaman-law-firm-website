import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "How Chaman Law Firm collects, uses, protects and manages personal information submitted through its website.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This notice explains how personal information is handled when you use the Chaman Law Firm website or submit an enquiry."
      lastUpdated="20 June 2026"
    >
      <h2>1. Who we are</h2>
      <p>Chaman Law Firm is a Nigerian law firm. For website privacy enquiries, contact <a href="mailto:info@chamanlawfirm.com">info@chamanlawfirm.com</a>.</p>

      <h2>2. Information we collect</h2>
      <p>We may collect information you choose to provide, including your name, email address, telephone number, area of legal interest, enquiry details, newsletter preference and download request. We may also receive limited technical information needed to operate and protect the website, such as request timestamps, browser information and security signals.</p>

      <h2>3. How we use information</h2>
      <ul>
        <li>To review and respond to enquiries and consultation requests.</li>
        <li>To provide requested legal resources or communications.</li>
        <li>To protect the website against abuse, spam and security threats.</li>
        <li>To meet professional, regulatory, legal and record-keeping obligations.</li>
        <li>To improve website reliability and services where lawful.</li>
      </ul>

      <h2>4. Legal basis and consent</h2>
      <p>Depending on the circumstances, processing may be based on your consent, steps requested before entering an engagement, legitimate operational interests, professional obligations or compliance with law. Marketing communications require an appropriate permission and may be stopped at any time.</p>

      <h2>5. Enquiries are not automatically legal instructions</h2>
      <p>Submitting information through this website does not by itself create a lawyer-client relationship. Please do not send highly sensitive, privileged or time-critical material until the firm confirms a secure communication channel and accepts the engagement.</p>

      <h2>6. Service providers and transfers</h2>
      <p>Information may be processed by carefully selected hosting, content-management, communications or delivery providers acting for the firm. Where information is transferred across borders, reasonable contractual, technical and organizational safeguards will be considered.</p>

      <h2>7. Retention and security</h2>
      <p>Personal information is retained only for as long as reasonably necessary for the relevant purpose, legal obligations, dispute management and professional record keeping. We use proportionate technical and organizational safeguards, but no internet transmission is completely risk-free.</p>

      <h2>8. Your rights</h2>
      <p>Subject to applicable law, including the Nigeria Data Protection Act 2023 and other applicable data-protection requirements, you may request access, correction, deletion, restriction, objection, portability or withdrawal of consent. Some requests may be limited by legal or professional obligations.</p>

      <h2>9. Children</h2>
      <p>This website is not directed to children. A parent or lawful guardian should contact the firm where legal assistance concerns a child.</p>

      <h2>10. Updates and complaints</h2>
      <p>We may update this policy as services or legal requirements change. Privacy concerns may be sent to the firm using the contact details above, and eligible complaints may also be made to the appropriate data-protection authority.</p>
    </LegalDocument>
  );
}
