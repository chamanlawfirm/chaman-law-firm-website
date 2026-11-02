import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
};

export function PageHero({ eyebrow, title, description, image, imageAlt, cta }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-royalGold/15 bg-charcoal">
      {image ? (
        <Image
          src={image}
          alt={imageAlt || `${title} — Chaman Law Firm`}
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          className="object-cover opacity-28"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/90 to-luxuryBlack/40" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 hidden h-80 w-80 rounded-full border border-royalGold/15 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-royalGold">{eyebrow}</p>
          ) : null}
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-ivory sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/76">{description}</p>
          {cta ? (
            <Link
              href={cta.href}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition-colors hover:bg-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royalGold"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
