import { createMetadata } from "@/lib/seo";
import { researchPath } from "@/data/research";
import { ResearchPage } from "../ResearchViews";
import styles from "../research.module.css";

const path = `${researchPath}/editorial`;
const email = "chamanlawfirm@gmail.com";

export const metadata = createMetadata({
  title: "Research Editorial Standards and Submissions",
  description: "Read the Chaman Law Firm research standards, submission guidelines and correction procedure.",
  path,
});

export default function ResearchEditorial() {
  return <ResearchPage title="Editorial standards and submissions" trail={[{ name: "Editorial standards", path }]}>
    <div className={`${styles.article} ${styles.section}`}>
      <h2>Editorial standards</h2>
      <p>Research publications identify their authorship, scope, method and sources. Authors should distinguish binding authority from persuasive material, use OSCOLA citations with pinpoints where available, and identify unsettled law and material limitations. Editorial approval and external peer review are distinct statuses. The journal title and any peer-review or indexing credentials will only be used following establishment and verification.</p>
      <h2>Research submission guidelines</h2>
      <p>Email a title, abstract, proposed contribution, contact details, affiliation and any conflict or prior-publication disclosure. For full manuscripts, include OSCOLA footnotes and a bibliography. Confirm that you have permission to submit the work and to share any third-party material. Remove confidential and identifying client information.</p>
      <a className={styles.button} href={`mailto:${email}?subject=Research%20submission%20for%20editorial%20consideration`}>Submit research by email</a>
      <h2 className="mt-9">International publication partners</h2>
      <p>Confirmed publication partnerships will be listed here once verified and authorised for disclosure.</p>
      <h2>Research corrections and updates</h2>
      <p>Send the paper title or research ID, the passage in question and a supporting authority if available. Material corrections will be dated and recorded on the publication page with an updated PDF where the correction affects the text.</p>
      <a className={styles.button} href={`mailto:${email}?subject=Research%20correction%20request`}>Submit a correction</a>
    </div>
  </ResearchPage>;
}
