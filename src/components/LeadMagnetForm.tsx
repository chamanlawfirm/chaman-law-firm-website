"use client";

import { FormEvent, useState } from "react";
import { ConsentField, HoneypotField } from "@/components/FormSecurityFields";
import type { LeadMagnet } from "@/lib/lead-magnets";
import { submitLeadRequest } from "@/lib/lead-client";

type LeadMagnetFormProps = {
  magnet: LeadMagnet;
  source: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function LeadMagnetForm({ magnet, source, compact = false, onSuccess }: LeadMagnetFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const result = await submitLeadRequest({
        ...data,
        source,
        interest: magnet.title,
        leadType: "lead-magnet-download",
        downloadSlug: magnet.slug
      });

      if (!result.ok) {
        setStatus("error");
        setStatusMessage(result.message);
        return;
      }

      form.reset();
      setStatus("sent");
      setStatusMessage("Your request was securely received. Your download page is opening now.");
      onSuccess?.();
      const query = new URLSearchParams({ type: "download", download: magnet.slug });
      if (result.reference) query.set("ref", result.reference);
      window.location.assign(`/thank-you?${query.toString()}`);
    } catch {
      setStatus("error");
      setStatusMessage("The request could not be securely submitted. Please call, email, or use WhatsApp.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${compact ? "space-y-3" : "mt-5 grid gap-3"}`}>
      <HoneypotField />
      <label className="grid gap-1.5 text-xs font-semibold text-ivory/78">
        Full name
        <input name="name" maxLength={100} autoComplete="name" className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory outline-none focus:border-royalGold/55" />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-ivory/78">
        Email address
        <input required type="email" name="email" maxLength={254} autoComplete="email" className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory outline-none focus:border-royalGold/55" />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-ivory/78">
        Phone or WhatsApp
        <input type="tel" name="phone" maxLength={30} autoComplete="tel" className="w-full rounded-md border border-royalGold/16 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory outline-none focus:border-royalGold/55" />
      </label>
      <ConsentField purpose="download" />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Preparing..." : magnet.buttonLabel}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-champagne" role="status" aria-live="polite">{statusMessage}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300" role="alert">{statusMessage}</p>
      ) : null}
    </form>
  );
}
