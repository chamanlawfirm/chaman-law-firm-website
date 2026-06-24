"use client";

import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { practiceAreas } from "@/data/practice-areas";
import { siteConfig } from "@/lib/constants";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Lawyers", href: "/lawyers" },
  { label: "Resources", href: "/resources" },
  { label: "Downloads", href: "/resources/downloads" },
  { label: "Media", href: "/media" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" }
];

const resourceLinks = [
  { label: "Blog", href: "/resources/blog" },
  { label: "Legal News", href: "/resources/legal-news" },
  { label: "Court Updates", href: "/resources/court-updates" },
  { label: "Podcasts", href: "/resources/podcasts" },
  { label: "Videos", href: "/resources/videos" },
  { label: "Downloads", href: "/resources/downloads" },
  { label: "FAQs", href: "/resources#faqs" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-royalGold/15 bg-luxuryBlack/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6" aria-label="Primary navigation">
          {navigation.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-ivory/78 transition hover:text-royalGold">
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ivory/78 transition hover:text-royalGold"
            >
              Practice Areas
              <ChevronDown size={15} />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-5 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid gap-3 rounded-lg border border-royalGold/18 bg-charcoal p-5 shadow-gold sm:grid-cols-2">
                {practiceAreas.map((area) => (
                  <div key={area.slug} className="rounded-md border border-transparent p-4 transition hover:border-royalGold/25 hover:bg-luxuryBlack">
                    <Link href={`/practice-areas/${area.slug}`} className="block font-heading text-base font-semibold text-ivory hover:text-royalGold">
                      {area.shortTitle}
                    </Link>
                    <span className="mt-2 block text-xs leading-5 text-ivory/62">{area.summary}</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {area.servicePages.slice(0, 2).map((service) => (
                        <Link key={service.slug} href={`/practice-areas/${area.slug}/${service.slug}`} className="rounded-full border border-royalGold/14 px-2.5 py-1 text-[11px] font-semibold text-ivory/56 hover:border-royalGold/45 hover:text-royalGold">
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {navigation.slice(2).map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-ivory/78 transition hover:text-royalGold">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/resources"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-royalGold/25 text-ivory transition hover:bg-royalGold hover:text-luxuryBlack"
            aria-label="Search resources"
          >
            <Search size={17} />
          </Link>
          <a
            href={`tel:${siteConfig.phones[0]}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-royalGold/25 text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
            aria-label="Call Chaman Law Firm"
          >
            <Phone size={18} />
          </a>
          <Link
            href="/consultation"
            className="rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            Book Consultation
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-royalGold/25 text-ivory xl:hidden"
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-royalGold/15 bg-charcoal px-4 py-5 xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-semibold text-ivory/86 transition hover:bg-luxuryBlack hover:text-royalGold"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 rounded-lg border border-royalGold/15 bg-luxuryBlack p-3">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Practice Areas</p>
              {practiceAreas.map((area) => (
                <div key={area.slug} className="border-b border-royalGold/10 py-2 last:border-0">
                  <Link
                    href={`/practice-areas/${area.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-semibold text-ivory/86 transition hover:bg-charcoal hover:text-royalGold"
                  >
                    {area.title}
                  </Link>
                  {area.servicePages.slice(0, 2).map((service) => (
                    <Link
                      key={service.slug}
                      href={`/practice-areas/${area.slug}/${service.slug}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-6 py-1.5 text-xs font-semibold text-ivory/55 transition hover:bg-charcoal hover:text-royalGold"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-royalGold/15 bg-luxuryBlack p-3">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Resources</p>
              {resourceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-semibold text-ivory/82 transition hover:bg-charcoal hover:text-royalGold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link
              href="/consultation"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-royalGold px-5 py-3 text-center text-sm font-bold text-luxuryBlack"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
