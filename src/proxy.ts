import { NextRequest, NextResponse } from "next/server";
import { legacyActivationBlogRedirectSlugs } from "@/data/legacy-blog-redirect-slugs";

const legacyBlogSlugSet = new Set<string>(legacyActivationBlogRedirectSlugs);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.includes(".") || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 1) return NextResponse.next();

  const slug = parts[0];
  if (!legacyBlogSlugSet.has(slug)) return NextResponse.next();

  const target = request.nextUrl.clone();
  target.pathname = `/resources/blog/${slug}`;
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
