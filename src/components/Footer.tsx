import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/constants";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Internship", href: "/internship" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Properties",
    links: [
      { label: "All Properties", href: "/properties" },
      { label: "For Sale", href: "/properties/for-sale" },
      { label: "For Rent", href: "/properties/for-rent" },
      { label: "Shortlets", href: "/properties/shortlet" },
      { label: "Investment", href: "/properties/investment" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "Property Sales", href: "/services/property-sales" },
      { label: "Property Letting", href: "/services/property-letting" },
      { label: "Diaspora Services", href: "/services/diaspora" },
      { label: "Property Management", href: "/services/property-management" },
      { label: "Verification", href: "/services/verification-due-diligence" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Knowledge Hub", href: "/resources/real-estate-knowledge-hub" },
      { label: "Investment Center", href: "/resources/investment-resource-center" },
      { label: "Management Center", href: "/resources/property-management-resource-center" },
      { label: "Diaspora Center", href: "/resources/diaspora-resource-center" }
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
            Luxury Real Estate | Property Investment | Property Management
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
          <p>© {new Date().getFullYear()} Chaman Properties. All rights reserved.</p>
          <div className="flex items-center gap-3">
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
