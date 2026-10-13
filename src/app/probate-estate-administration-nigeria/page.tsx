import { CampaignLandingPage } from "@/components/CampaignLandingPage";
import { getAdCampaign } from "@/data/ad-campaigns";
import { createMetadata } from "@/lib/seo";

const campaign = getAdCampaign("probate-estate-administration-nigeria")!;
export const metadata = createMetadata({ title: campaign.metaTitle, description: campaign.metaDescription, path: `/${campaign.slug}`, image: campaign.heroImage, keywords: campaign.keywords });
export default function Page() { return <CampaignLandingPage campaign={campaign} />; }
