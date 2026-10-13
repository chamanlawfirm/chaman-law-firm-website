"use client";

import type { ReactNode } from "react";

type CampaignTrackedLinkProps = {
  href: string;
  eventName: "consultation_click" | "phone_click" | "whatsapp_click" | "email_click";
  campaign: string;
  label: string;
  className?: string;
  children: ReactNode;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function CampaignTrackedLink({
  href,
  eventName,
  campaign,
  label,
  className,
  children
}: CampaignTrackedLinkProps) {
  function trackClick() {
    window.gtag?.("event", eventName, {
      campaign_slug: campaign,
      link_label: label,
      transport_type: "beacon"
    });
  }

  return (
    <a href={href} onClick={trackClick} className={className}>
      {children}
    </a>
  );
}
