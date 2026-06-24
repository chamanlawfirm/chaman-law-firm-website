"use client";

import { FormEvent, useState } from "react";
import { ConsentField, HoneypotField } from "@/components/FormSecurityFields";
import { submitLeadRequest } from "@/lib/lead-client";

type LeadFormProps = {
  source: string;
  title?: string;
  submitLabel?: string;
};

function thankYouTypeForSource(source: string) {
  return source.toLowerCase().includes("contact") ? "contact" : "consultation";
}

export function LeadForm({ source, title = "Send an Inquiry", submitLabel = "Submit Inquiry" }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const result = await submitLeadRequest({ ...data, source, leadType: "enquiry" });

      if (!result.ok) {
        setStatus("error");
        setStatusMessage(result.message);
        return;
      }

      form.reset();
      setStatus("sent");
      setStatusMessage(
        result.reference ? `${result.message} Reference: ${result.reference}` : result.message
      );
      const query = new URLSearchParams({ type: thankYouTypeForSource(source) });
      if (result.reference) query.set("ref", result.reference);
      window.location.assign(`/thank-you?${query.toString()}`);
    } catch {
      setStatus("error");
      setStatusMessage("The request could not be securely submitted. Please call, email, or use WhatsApp.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-lg border border-royalGold/22 bg-charcoal p-6 shadow-gold">
      <HoneypotField />
      <h2 className="font-heading text-2xl font-bold text-ivory">{title}</h2>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Full name
          <input
            required
            name="name"
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Email address
          <input
            required
            type="email"
            name="email"
            maxLength={254}
            autoComplete="email"
            className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Phone or WhatsApp
          <input
            required
            type="tel"
            name="phone"
            minLength={7}
            maxLength={30}
            autoComplete="tel"
            className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Area of interest
          <select name="interest" required className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory">
            <option>Property &amp; real estate law</option>
            <option>Corporate &amp; commercial law</option>
            <option>Litigation &amp; dispute resolution</option>
            <option>ADR, mediation &amp; dispute resolution</option>
            <option>Debt recovery</option>
            <option>Employment law</option>
            <option>Probate &amp; estate administration</option>
            <option>Notary public services</option>
            <option>Immigration services</option>
            <option>Family law</option>
            <option>Diaspora legal services</option>
            <option>Career or internship</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Brief description of your request
          <textarea
            required
            name="message"
            rows={5}
            minLength={10}
            maxLength={4000}
            className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm font-normal text-ivory"
          />
        </label>
        <ConsentField purpose="enquiry" />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting securely..." : submitLabel}
      </button>
      {status === "sent" ? (
        <p className="mt-4 text-sm text-champagne" role="status" aria-live="polite">{statusMessage}</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-red-300" role="alert">{statusMessage}</p>
      ) : null}
    </form>
  );
}
