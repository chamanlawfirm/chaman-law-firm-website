"use client";

import { FormEvent, useState } from "react";
import type { LeadMagnet } from "@/lib/lead-magnets";

type LeadMagnetFormProps = {
  magnet: LeadMagnet;
  source: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function LeadMagnetForm({ magnet, source, compact = false, onSuccess }: LeadMagnetFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/zoho-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
          interest: magnet.title,
          leadType: "lead-magnet-download",
          downloadSlug: magnet.slug
        })
      });

      if (!response.ok) {
        throw new Error("Lead capture failed");
      }

      form.reset();
      setStatus("sent");
      onSuccess?.();
      window.location.assign(`/api/downloads/${magnet.slug}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "mt-5 grid gap-3"}>
      <input
        name="name"
        placeholder="Full name"
        className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email address"
        className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
      />
      <input
        name="phone"
        placeholder="Phone or WhatsApp"
        className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Preparing..." : magnet.buttonLabel}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-champagne">Thank you. Your download is opening now.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300">The download form could not submit. Please try again or contact us on WhatsApp.</p>
      ) : null}
    </form>
  );
}
