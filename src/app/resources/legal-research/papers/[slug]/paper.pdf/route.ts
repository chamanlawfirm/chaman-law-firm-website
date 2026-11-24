import { getResearchPaper } from "@/lib/research";
import { dataset, projectId } from "@/sanity/env";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = await getResearchPaper(slug);
  if (!paper) return new Response(null, { status: 404 });

  const asset = new URL(paper.pdf);
  const prefix = `/files/${projectId}/${dataset}/`;
  if (asset.origin !== "https://cdn.sanity.io" || !asset.pathname.startsWith(prefix) || !asset.pathname.endsWith(".pdf")) {
    return new Response(null, { status: 502 });
  }

  try {
    const upstream = await fetch(asset, { redirect: "error", signal: AbortSignal.timeout(10_000) });
    if (!upstream.ok || !upstream.body) return new Response(null, { status: 502 });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${slug.replace(/[^a-z0-9-]/gi, "")}.pdf"`,
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
