"use client";

import { Eye, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

type ArticleEngagementStatsProps = {
  slug: string;
};

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return String(value);
}

export function ArticleEngagementStats({ slug }: ArticleEngagementStatsProps) {
  const [views, setViews] = useState(0);
  const [shares, setShares] = useState(0);

  useEffect(() => {
    const viewKey = `chaman-article-views-${slug}`;
    const shareKey = `chaman-article-shares-${slug}`;
    const localViews = Number(window.localStorage.getItem(viewKey) || "0") + 1;

    window.localStorage.setItem(viewKey, String(localViews));
    const updateFrame = window.requestAnimationFrame(() => {
      setViews(localViews);
      setShares(Number(window.localStorage.getItem(shareKey) || "0"));
    });

    function onShare() {
      setShares(Number(window.localStorage.getItem(shareKey) || "0"));
    }

    window.addEventListener("chaman-article-share", onShare);
    return () => {
      window.cancelAnimationFrame(updateFrame);
      window.removeEventListener("chaman-article-share", onShare);
    };
  }, [slug]);

  return (
    <section className="rounded-lg border border-royalGold/16 bg-charcoal p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Activity on This Device</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-royalGold/12 bg-luxuryBlack p-4">
          <div className="flex items-center gap-2 text-royalGold">
            <Eye size={17} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Reads</span>
          </div>
          <p className="mt-2 font-heading text-2xl font-semibold text-ivory">{formatCount(views)}</p>
        </div>
        <div className="rounded-md border border-royalGold/12 bg-luxuryBlack p-4">
          <div className="flex items-center gap-2 text-royalGold">
            <Share2 size={17} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Shares</span>
          </div>
          <p className="mt-2 font-heading text-2xl font-semibold text-ivory">{formatCount(shares)}</p>
        </div>
      </div>
    </section>
  );
}
