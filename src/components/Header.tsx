"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "Diaspora", href: "/services/diaspora" },
  { label: "Management", href: "/services/property-management" },
  { label: "Investment", href: "/services/investment-opportunities" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-royalGold/15 bg-luxuryBlack/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ivory/78 transition hover:text-royalGold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.phones[0]}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-royalGold/25 text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
            aria-label="Call Chaman Properties"
          >
            <Phone size={18} />
          </a>
          <a
            href={whatsappLink("Hello Chaman Properties, I would like to speak with your property team.")}
            className="rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            Book Consultation
          </a>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-royalGold/25 text-ivory lg:hidden"
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-royalGold/15 bg-charcoal px-4 py-5 lg:hidden">
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
            <a
              href={whatsappLink("Hello Chaman Properties, I would like to book a property consultation.")}
              className="mt-3 rounded-full bg-royalGold px-5 py-3 text-center text-sm font-bold text-luxuryBlack"
            >
              Book Consultation
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
