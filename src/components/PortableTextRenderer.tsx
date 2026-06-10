import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { slugifyHeading } from "@/lib/article";
import { urlFor } from "@/sanity/lib/image";

type PortableTextValue = ComponentProps<typeof PortableText>["value"];

type PortableTextRendererProps = {
  value: Array<Record<string, unknown>>;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={slugifyHeading(blockText(value))} className="scroll-mt-28 pt-4 font-heading text-3xl font-semibold leading-tight text-ivory">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugifyHeading(blockText(value))} className="scroll-mt-28 pt-3 font-heading text-2xl font-semibold leading-tight text-ivory">
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4 id={slugifyHeading(blockText(value))} className="scroll-mt-28 pt-2 font-heading text-xl font-semibold leading-tight text-ivory">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-royalGold pl-5 font-display text-2xl leading-10 text-champagne">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p>{children}</p>
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-royalGold hover:text-champagne">
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className="font-semibold text-royalGold hover:text-champagne">
          {children}
        </Link>
      );
    }
  },
  list: {
    bullet: ({ children }) => <ul className="ml-5 list-disc space-y-3">{children}</ul>
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value).width(1100).height(680).fit("crop").auto("format").url();
      const alt = typeof value.alt === "string" ? value.alt : "Chaman Properties article image";

      return (
        <figure className="my-8 overflow-hidden rounded-lg border border-royalGold/16 bg-luxuryBlack">
          <Image src={imageUrl} alt={alt} width={1100} height={680} className="h-auto w-full object-cover" />
          {value.alt ? <figcaption className="px-5 py-3 text-xs text-ivory/52">{alt}</figcaption> : null}
        </figure>
      );
    }
  }
};

function blockText(value: unknown) {
  if (!value || typeof value !== "object" || !("children" in value) || !Array.isArray(value.children)) {
    return "";
  }

  return value.children
    .map((child) => {
      if (child && typeof child === "object" && "text" in child) {
        return String(child.text || "");
      }

      return "";
    })
    .join("");
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value.length) {
    return null;
  }

  return (
    <div className="space-y-6 text-base leading-8 text-ivory/76">
      <PortableText value={value as unknown as PortableTextValue} components={components} />
    </div>
  );
}
