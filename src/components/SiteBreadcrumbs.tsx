"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  about: "About",
  authors: "Authors",
  blog: "Blog",
  "book-consultation": "Book Consultation",
  careers: "Careers",
  category: "Category",
  contact: "Contact",
  consultation: "Consultation",
  downloads: "Downloads",
  lawyers: "Lawyers",
  media: "Media",
  "practice-areas": "Practice Areas",
  "property-real-estate-law": "Property & Real Estate Law",
  "corporate-commercial-law": "Corporate & Commercial Law",
  "litigation-dispute-resolution": "Litigation & Dispute Resolution",
  "debt-recovery": "Debt Recovery",
  "probate-estate-administration": "Probate & Estate Administration",
  "notary-public-services": "Notary Public Services",
  resources: "Resources",
  team: "Team",
  tags: "Tags",
  "charles-chukwuma-nkwoka": "Charles Chukwuma Nkwoka"
};

function titleCase(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function SiteBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/studio") || pathname.startsWith("/api")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      href,
      label: labels[segment] || titleCase(segment)
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="border-y border-royalGold/10 bg-luxuryBlack">
      <ol className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ivory/50 sm:px-6 lg:px-8">
        <li className="shrink-0">
          <Link href="/" className="transition hover:text-royalGold">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex shrink-0 items-center gap-2">
              <span className="text-royalGold/55">/</span>
              {isLast ? (
                <span className="max-w-[220px] truncate text-royalGold sm:max-w-sm">{item.label}</span>
              ) : (
                <Link href={item.href} className="transition hover:text-royalGold">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
