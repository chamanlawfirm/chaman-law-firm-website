"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

const consentKey = "chaman-cookie-consent";
const consentEvent = "chaman-cookie-consent-change";
type ConsentValue = "accepted" | "rejected" | "unset" | "unknown";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

function getSnapshot(): ConsentValue {
  const value = window.localStorage.getItem(consentKey);
  return value === "accepted" || value === "rejected" ? value : "unset";
}

function saveConsent(value: "accepted" | "rejected") {
  window.localStorage.setItem(consentKey, value);
  window.dispatchEvent(new Event(consentEvent));
}

export function CookieConsent({ gaMeasurementId }: { gaMeasurementId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => "unknown");
  const pathname = usePathname();

  useEffect(() => {
    if (consent !== "accepted" || !gaMeasurementId || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [consent, gaMeasurementId, pathname]);

  return (
    <>
      {consent === "accepted" && gaMeasurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { anonymize_ip: true, send_page_view: false });
            `}
          </Script>
        </>
      ) : null}
      {consent === "unset" ? (
        <section
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl rounded-lg border border-royalGold/30 bg-charcoal p-5 shadow-gold sm:p-6"
          aria-label="Cookie preferences"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-ivory">Your cookie choices</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ivory/70">
                Essential storage supports website operation. Optional analytics loads only if you accept it. Read our{" "}
                <Link href="/cookie-policy" className="font-semibold text-royalGold underline underline-offset-2">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button type="button" onClick={() => saveConsent("rejected")} className="rounded-full border border-royalGold/35 px-5 py-2.5 text-sm font-bold text-royalGold">
                Essential only
              </button>
              <button type="button" onClick={() => saveConsent("accepted")} className="rounded-full bg-royalGold px-5 py-2.5 text-sm font-bold text-luxuryBlack">
                Accept analytics
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
