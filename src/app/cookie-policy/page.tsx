import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "Information about essential browser storage, optional analytics and cookie choices on the Chaman Law Firm website.",
  path: "/cookie-policy"
});

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Cookie Policy"
      description="This policy explains the browser storage and optional analytics technologies used by the Chaman Law Firm website."
      lastUpdated="20 June 2026"
    >
      <h2>1. What cookies and browser storage are</h2>
      <p>Cookies and similar browser-storage technologies are small records used to operate websites, remember choices and, where permitted, understand usage.</p>

      <h2>2. Essential storage</h2>
      <p>The website may use essential storage for security, basic operation and remembering your cookie preference. Essential storage is not used to build advertising profiles.</p>

      <h2>3. Optional analytics</h2>
      <p>If analytics is configured, it loads only after you select “Accept analytics” in the cookie notice. Analytics may collect aggregated usage information such as pages visited, approximate location, device type and referral source. IP anonymization is requested in the website configuration.</p>

      <h2>4. Third-party content</h2>
      <p>External services, such as maps, videos or linked social platforms, may apply their own technologies when you interact with them. Their privacy and cookie practices are controlled by those providers.</p>

      <h2>5. Managing your choice</h2>
      <p>You may choose essential storage only or accept optional analytics when the cookie notice appears. You can reset the choice by clearing this site’s local storage or browser data. Browser controls can also block or delete cookies, although this may affect some functions.</p>

      <h2>6. Changes and contact</h2>
      <p>Cookie use may change as website services evolve. Questions can be sent to <a href="mailto:info@chamanlawfirm.com">info@chamanlawfirm.com</a>.</p>
    </LegalDocument>
  );
}
