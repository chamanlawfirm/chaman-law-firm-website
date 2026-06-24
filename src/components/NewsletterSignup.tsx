"use client";

import { FormEvent, useState } from "react";
import { ConsentField, HoneypotField } from "@/components/FormSecurityFields";
import { submitLeadRequest } from "@/lib/lead-client";

type NewsletterSignupProps = {
  source?: string;
};

export function NewsletterSignup({ source = "Newsletter Signup" }: NewsletterSignupProps) {
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
        interest: "Newsletter subscription",
        leadType: "newsletter"
      });

      if (!result.ok) {
        setStatus("error");
        setStatusMessage(result.message);
        return;
      }

      form.reset();
      setStatus("sent");
      setStatusMessage("Your subscription request has been securely received.");
    } catch {
      setStatus("error");
      setStatusMessage("The request could not be securely submitted. Please try again later.");
    }
  }

  return (
    <section className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Legal Intelligence</p>
      <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">Get legal guides in your inbox.</h2>
      <p className="mt-3 text-sm leading-7 text-ivory/66">
        Join the Chaman Law Firm newsletter for property-law guides, business-law insight, dispute-prevention notes, probate explainers, and diaspora legal updates.
      </p>
      <form onSubmit={onSubmit} className="relative mt-5 space-y-3">
        <HoneypotField />
        <label className="grid gap-1.5 text-xs font-semibold text-ivory/78">
          Full name
          <input name="name" maxLength={100} autoComplete="name" className="w-full rounded-full border border-royalGold/18 bg-luxuryBlack px-5 py-3 text-sm font-normal text-ivory outline-none focus:border-royalGold/55" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-ivory/78">
          Email address
          <input type="email" name="email" required maxLength={254} autoComplete="email" className="w-full rounded-full border border-royalGold/18 bg-luxuryBlack px-5 py-3 text-sm font-normal text-ivory outline-none focus:border-royalGold/55" />
        </label>
        <ConsentField purpose="newsletter" />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
        >
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
        {status === "sent" ? <p className="text-sm text-champagne" role="status" aria-live="polite">{statusMessage}</p> : null}
        {status === "error" ? <p className="text-sm text-red-300" role="alert">{statusMessage}</p> : null}
      </form>
    </section>
  );
}
