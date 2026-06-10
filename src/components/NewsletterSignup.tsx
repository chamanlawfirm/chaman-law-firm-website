"use client";

import { FormEvent, useState } from "react";

type NewsletterSignupProps = {
  source?: string;
};

export function NewsletterSignup({ source = "Newsletter Signup" }: NewsletterSignupProps) {
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
          interest: "Newsletter subscription",
          leadType: "newsletter"
        })
      });

      if (!response.ok) {
        throw new Error("Newsletter signup failed");
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Property Intelligence</p>
      <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">Get real estate guides in your inbox.</h2>
      <p className="mt-3 text-sm leading-7 text-ivory/66">
        Join the Chaman Properties newsletter for investment guides, verification tips, market insight, and diaspora property updates.
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          name="name"
          placeholder="Full name"
          className="w-full rounded-full border border-royalGold/18 bg-luxuryBlack px-5 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className="w-full rounded-full border border-royalGold/18 bg-luxuryBlack px-5 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
        >
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
        {status === "sent" ? <p className="text-sm text-champagne">Thank you. You are now on the Chaman Properties mailing list.</p> : null}
        {status === "error" ? <p className="text-sm text-red-300">Subscription could not be completed. Please try again.</p> : null}
      </form>
    </section>
  );
}
