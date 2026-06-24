import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  cta?: { label: string; href: string };
};

export function PageHero({ eyebrow, title, description, image, cta }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-royalGold/15 bg-charcoal">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-28"
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-luxuryBlack via-luxuryBlack/84 to-luxuryBlack/36" />
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
              className="mt-8 inline-flex rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
