"use client";

import { Bot, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { whatsappLink } from "@/lib/utils";

export function AIChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div className="mb-3 w-[min(360px,calc(100vw-40px))] rounded-lg border border-royalGold/25 bg-charcoal p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-royalGold text-luxuryBlack">
                <Bot size={20} />
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold text-ivory">Property Concierge</h2>
                <p className="text-xs text-ivory/54">AI-ready support desk</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ivory/70 hover:text-royalGold"
              aria-label="Close property concierge"
            >
              <X size={18} />
            </button>
          </div>
          <p className="mt-5 text-sm leading-7 text-ivory/70">
            Ask about property availability, diaspora support, management, inspection booking, or title verification.
          </p>
          <a
            href={whatsappLink("Hello Chaman Properties, I would like help from the property concierge.")}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            <MessageCircle size={17} />
            Continue on WhatsApp
          </a>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-royalGold text-luxuryBlack shadow-gold transition hover:bg-champagne"
        aria-label="Open property concierge"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}
