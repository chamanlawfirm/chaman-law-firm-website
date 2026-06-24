"use client";

import Link from "next/link";
import { useId } from "react";

type ConsentFieldProps = {
  purpose: "enquiry" | "newsletter" | "download";
};

const consentCopy = {
  enquiry: "I consent to Chaman Law Firm processing my information to review and respond to this enquiry.",
  newsletter: "I consent to receiving legal updates and understand that I can unsubscribe at any time.",
  download: "I consent to Chaman Law Firm processing my information to provide this resource and related legal updates."
};

export function HoneypotField() {
  return (
    <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Leave this field empty
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function ConsentField({ purpose }: ConsentFieldProps) {
  const descriptionId = useId();

  return (
    <div className="flex items-start gap-3 text-sm leading-6 text-ivory/72">
      <input
        required
        type="checkbox"
        name="consent"
        value="true"
        aria-describedby={descriptionId}
        className="mt-1 h-4 w-4 shrink-0 accent-royalGold"
      />
      <p id={descriptionId}>
        {consentCopy[purpose]} See our{" "}
        <Link href="/privacy-policy" className="font-semibold text-royalGold underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
