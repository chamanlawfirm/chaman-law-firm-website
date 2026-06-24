import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { practiceAreas } from "@/data/practice-areas";
import { siteConfig } from "@/lib/constants";

const footerColumns = [
  {
    title: "Firm",
    links: [
      { label: "About", href: "/about" },
      { label: "Lawyers", href: "/lawyers" },
      { label: "Careers", href: "/careers" },
      { label: "Book Consultation", href: "/consultation" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Practice Areas",
    links: practiceAreas.map((area) => ({
      label: area.shortTitle,
      href: `/practice-areas/${area.slug}`
    }))
  },
  {
    title: "Client Needs",
    links: [
      { label: "Speak With a Lawyer", href: "/consultation" },
      { label: "Diaspora Legal Support", href: "/practice-areas/property-real-estate-law" },
      { label: "Notary Public", href: "/practice-areas/notary-public-services" },
      { label: "Call Now", href: "/contact" },
      { label: "WhatsApp", href: "/contact" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/resources/blog" },
      { label: "Downloads", href: "/resources/downloads" },
      { label: "Media", href: "/media" },
      { label: "FAQs", href: "/resources#faqs" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Legal Disclaimer", href: "/legal-disclaimer" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-royalGold/20 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_2fr] lg:px-8">
        <div className="space-y-6">
          <Logo />
          <p className="max-w-md text-sm leading-7 text-ivory/70">
            Full-service legal solutions for property, business, disputes, probate, notary public services, and diaspora clients.
            <span className="mt-2 block font-display text-lg text-royalGold">
              {siteConfig.tagline}
            </span>
          </p>
          <div className="space-y-4 text-sm text-ivory/72">
            {siteConfig.offices.map((office) => (
              <p key={office.name} className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-royalGold" size={17} />
                <span>
                  <strong className="block text-ivory">{office.name}</strong>
                  {office.address}
                </span>
              </p>
            ))}
            <p className="flex gap-3">
              <Phone className="mt-1 shrink-0 text-royalGold" size={17} />
              <span>{siteConfig.phones.join(" | ")}</span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 shrink-0 text-royalGold" size={17} />
              <span>
                {siteConfig.email} | {siteConfig.secondaryEmail}
              </span>
            </p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="font-heading text-sm uppercase tracking-[0.2em] text-royalGold">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ivory/70 transition hover:text-royalGold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-royalGold/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 text-sm text-ivory/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Chaman Law Firm. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/privacy-policy" className="text-xs text-ivory/60 hover:text-royalGold">Privacy</Link>
            <Link href="/cookie-policy" className="text-xs text-ivory/60 hover:text-royalGold">Cookies</Link>
            <Link href="/terms-of-use" className="text-xs text-ivory/60 hover:text-royalGold">Terms</Link>
            <Link href="/legal-disclaimer" className="text-xs text-ivory/60 hover:text-royalGold">Disclaimer</Link>
            <a href={siteConfig.socials.linkedin} aria-label="LinkedIn" className="text-ivory/70 hover:text-royalGold">
              <Linkedin size={18} />
            </a>
            <a href={siteConfig.socials.instagram} aria-label="Instagram" className="text-ivory/70 hover:text-royalGold">
              <Instagram size={18} />
            </a>
            <a href={siteConfig.socials.facebook} aria-label="Facebook" className="text-ivory/70 hover:text-royalGold">
              <Facebook size={18} />
            </a>
            <a href={siteConfig.socials.youtube} aria-label="YouTube" className="text-ivory/70 hover:text-royalGold">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
