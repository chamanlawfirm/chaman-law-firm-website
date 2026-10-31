import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ slug: string }> };

/** Preserve legacy article slugs rather than redirecting every historical page to the blog index. */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const target = new URL(`/resources/blog/${encodeURIComponent(slug)}`, request.url);
  return NextResponse.redirect(target, 301);
}
