"use client";

import { FormEvent, useState } from "react";

type ZohoLeadFormProps = {
  source: string;
  title?: string;
  submitLabel?: string;
};

export function ZohoLeadForm({
  source,
  title = "Send an Inquiry",
  submitLabel = "Submit Inquiry"
}: ZohoLeadFormProps) {
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
        body: JSON.stringify({ ...data, source })
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-royalGold/22 bg-charcoal p-6 shadow-gold">
      <h2 className="font-heading text-2xl font-bold text-ivory">{title}</h2>
      <div className="mt-6 grid gap-4">
        <input
          required
          name="name"
          placeholder="Full name"
          className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory placeholder:text-ivory/40"
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email address"
          className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory placeholder:text-ivory/40"
        />
        <input
          required
          name="phone"
          placeholder="Phone or WhatsApp"
          className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory placeholder:text-ivory/40"
        />
        <select
          name="interest"
          className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory"
        >
          <option>Buying property</option>
          <option>Renting property</option>
          <option>Shortlet inquiry</option>
          <option>Diaspora property management</option>
          <option>Investment opportunity</option>
          <option>Property verification</option>
          <option>Career or internship</option>
        </select>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us what you need"
          className="rounded-md border border-royalGold/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory placeholder:text-ivory/40"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Submitting..." : submitLabel}
      </button>
      {status === "sent" ? (
        <p className="mt-4 text-sm text-champagne">
          Thank you. Your inquiry has been received by the placeholder lead endpoint.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-red-300">
          The form could not submit. Please call or use WhatsApp while CRM credentials are being connected.
        </p>
      ) : null}
    </form>
  );
}
