"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ConsentField, HoneypotField } from "@/components/FormSecurityFields";
import { submitLeadRequest } from "@/lib/lead-client";

type CampaignLeadFormProps = {
  campaign: string;
  serviceName: string;
  prompt: string;
};

const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"] as const;

function getAttribution() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    referrer: document.referrer.slice(0, 500),
    utmSource: params.get(attributionKeys[0]) || "",
    utmMedium: params.get(attributionKeys[1]) || "",
    utmCampaign: params.get(attributionKeys[2]) || "",
    utmContent: params.get(attributionKeys[3]) || "",
    utmTerm: params.get(attributionKeys[4]) || "",
    gclid: params.get(attributionKeys[5]) || ""
  };
}

export function CampaignLeadForm({ campaign, serviceName, prompt }: CampaignLeadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const result = await submitLeadRequest({
      ...data,
      ...getAttribution(),
      source: `Campaign landing page: ${campaign}`,
      campaign,
      leadType: "enquiry"
    }).catch(() => ({
      ok: false,
      message: "The request could not be securely submitted. Please call, email, or use WhatsApp.",
      reference: undefined
    }));

    if (!result.ok) {
      setStatus("error");
      setStatusMessage(result.message);
      return;
    }

    window.gtag?.("event", "generate_lead", {
      campaign_slug: campaign,
      service_name: serviceName,
      lead_source: "campaign_landing_page",
      value: 1,
      currency: "NGN"
    });

    const query = new URLSearchParams({ type: "consultation", campaign });
    if (result.reference) query.set("ref", result.reference);
    router.push(`/thank-you?${query.toString()}`);
  }

  return (
    <form id="campaign-enquiry" onSubmit={onSubmit} className="relative rounded-xl border border-royalGold/30 bg-charcoal p-6 shadow-gold sm:p-8">
      <HoneypotField />
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-royalGold">Confidential Enquiry</p>
      <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">Discuss your {serviceName.toLowerCase()} matter</h2>
      <p className="mt-3 text-sm leading-6 text-ivory/68">{prompt}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Full name
          <input required name="name" minLength={2} maxLength={100} autoComplete="name" className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Phone or WhatsApp
          <input required type="tel" name="phone" minLength={7} maxLength={30} autoComplete="tel" className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Email address
          <input required type="email" name="email" maxLength={254} autoComplete="email" className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Country of residence
          <input required name="country" minLength={2} maxLength={100} autoComplete="country-name" className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Preferred contact
          <select name="preferredContact" required className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory">
            <option value="WhatsApp">WhatsApp</option>
            <option value="Phone">Phone call</option>
            <option value="Email">Email</option>
            <option value="Video meeting">Video meeting</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ivory/82">
          Urgency
          <select name="urgency" required className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory">
            <option value="Standard">Standard</option>
            <option value="Within 7 days">Within 7 days</option>
            <option value="Within 48 hours">Within 48 hours</option>
            <option value="Immediate deadline">Immediate deadline</option>
          </select>
        </label>
      </div>
      <input type="hidden" name="interest" value={serviceName} />
      <label className="mt-4 grid gap-2 text-sm font-semibold text-ivory/82">
        Brief description
        <textarea required name="message" rows={5} minLength={10} maxLength={4000} className="rounded-md border border-royalGold/20 bg-luxuryBlack px-4 py-3 font-normal text-ivory" />
      </label>
      <div className="mt-4">
        <ConsentField purpose="enquiry" />
      </div>
      <button type="submit" disabled={status === "submitting"} className="mt-5 w-full rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne disabled:cursor-wait disabled:opacity-70">
        {status === "submitting" ? "Submitting securely..." : "Request Legal Consultation"}
      </button>
      {status === "error" ? <p className="mt-4 text-sm text-red-300" role="alert">{statusMessage}</p> : null}
      <p className="mt-4 text-xs leading-5 text-ivory/50">
        Submission does not create a lawyer-client relationship. The firm will first complete conflict and engagement checks.
      </p>
    </form>
  );
}
