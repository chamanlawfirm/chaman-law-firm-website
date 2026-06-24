import { redirect } from "next/navigation";

type LegacyResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyResourcePage({ params }: LegacyResourcePageProps) {
  await params;
  redirect("/resources");
}
