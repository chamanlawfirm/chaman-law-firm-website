import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

const pathByType: Record<string, string> = {
  post: "/resources/blog",
  category: "/category",
  author: "/authors",
  legalNews: "/resources/legal-news",
  courtUpdate: "/resources/court-updates",
  podcast: "/resources/podcasts",
  video: "/resources/videos",
  property: "/properties"
};

function authorised(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  const supplied = request.headers.get("sanity-webhook-secret") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorised(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 65_536) return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });

  let body: { _type?: string; slug?: string | { current?: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const type = body._type;
  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  const base = type ? pathByType[type] : undefined;
  if (!type || !base) return Response.json({ ok: false, error: "Unsupported document type" }, { status: 400 });

  revalidateTag("sanity", "max");
  if (type === "post") revalidateTag("posts", "max");
  revalidatePath(base);
  if (slug) revalidatePath(`${base}/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  return Response.json({ ok: true, revalidated: { type, slug: slug || null } });
}
