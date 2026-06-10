"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import { leadMagnets } from "@/lib/lead-magnets";

const storageKey = "chaman-exit-lead-dismissed-until";
const weekInMs = 7 * 24 * 60 * 60 * 1000;

export function ExitIntentLeadPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const magnet = leadMagnets[0];

  useEffect(() => {
    if (pathname.startsWith("/studio")) {
      return;
    }

    const dismissedUntil = Number(window.localStorage.getItem(storageKey) || "0");

    if (dismissedUntil > Date.now()) {
      return;
    }

    function openPopup() {
      setIsOpen(true);
    }

    function onMouseLeave(event: MouseEvent) {
      if (event.clientY <= 0) {
        openPopup();
      }
    }

    const timer = window.setTimeout(openPopup, 28000);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [pathname]);

  function closePopup() {
    window.localStorage.setItem(storageKey, String(Date.now() + weekInMs));
    setIsOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxuryBlack/82 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <section className="relative w-full max-w-2xl rounded-lg border border-royalGold/30 bg-charcoal p-6 shadow-gold sm:p-8">
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close lead capture popup"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-royalGold/20 text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
        >
          <X size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Before You Go</p>
        <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
          Get the Chaman free property investment guide.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-ivory/68">
          Download a practical checklist for safer property investment, title review, inspection, payment control, and diaspora ownership decisions.
        </p>
        <div className="mt-6 rounded-lg border border-royalGold/14 bg-luxuryBlack p-5">
          <LeadMagnetForm magnet={magnet} source="Exit Intent Popup" onSuccess={closePopup} compact />
        </div>
      </section>
    </div>
  );
}
