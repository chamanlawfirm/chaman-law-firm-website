"use client";

import { Facebook, Linkedin, Send } from "lucide-react";
import { siteConfig } from "@/lib/constants";

type SocialShareButtonsProps = {
  title: string;
  path: string;
};

export function SocialShareButtons({ title, path }: SocialShareButtonsProps) {
  const slug = path.split("/").filter(Boolean).pop() || "article";
  const url = `${siteConfig.url}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: Send
    }
  ];
  function trackShare() {
    const shareKey = `chaman-article-shares-${slug}`;
    const next = Number(window.localStorage.getItem(shareKey) || "0") + 1;
    window.localStorage.setItem(shareKey, String(next));
    window.dispatchEvent(new Event("chaman-article-share"));
  }

  return (
    <div className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Share Article</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={trackShare}
              aria-label={`Share on ${link.label}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-royalGold/25 text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
            >
              <Icon size={17} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
