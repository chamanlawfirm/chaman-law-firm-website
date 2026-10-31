import { permanentRedirect } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

/** Preserve the legacy article identity instead of sending every old URL to the listing. */
export default async function LegacyBlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/resources/blog/${encodeURIComponent(slug)}`);
}
