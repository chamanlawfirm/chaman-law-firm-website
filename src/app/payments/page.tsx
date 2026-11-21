import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Secure Client Payments",
  description: "Make a secure payment to Chaman Law Firm after receiving written fee and matter instructions from the firm.",
  path: "/payments"
});

const paymentUrl = "https://paystack.shop/pay/chaman-law-firm-client-payment";

export default function PaymentsPage() {
  return (
    <main>
      <PageHero eyebrow="Client payments" title="A secure route for agreed legal fees" description="Use this payment route only after Chaman Law Firm has confirmed your scope, amount and matter or invoice reference in writing. Consultation fees are provided privately after intake." image="/images/firm/managing-partner-office.png" cta={{ label: "Request a Consultation", href: "/consultation" }} />
      <section className="bg-luxuryBlack py-16 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[1fr_0.8fr] sm:px-6 lg:px-8">
          <div className="rounded-xl border border-royalGold/20 bg-charcoal p-8">
            <LockKeyhole className="text-royalGold" size={30} />
            <h2 className="mt-5 font-heading text-3xl font-semibold">Pay through Paystack</h2>
            <p className="mt-4 leading-8 text-ivory/72">Enter the exact NGN amount in your written instruction. Include your matter or invoice reference so our accounts team can match the payment. Paystack handles the checkout; the firm does not ask for your card details in the enquiry form.</p>
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack hover:bg-champagne">Open secure payment gateway <ArrowRight size={17} /></a>
            <p className="mt-4 text-sm text-ivory/60">The gateway is in NGN. International collection or settlement options are confirmed individually before payment.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-royalGold/20 bg-charcoal p-6"><ShieldCheck className="text-royalGold" /><h2 className="mt-3 font-heading text-xl font-semibold">Before you pay</h2><p className="mt-2 text-sm leading-7 text-ivory/70">Confirm the firm’s written scope, fee and reference. An unsolicited payment does not establish an engagement or guarantee an outcome.</p></div>
            <div className="rounded-xl border border-royalGold/20 bg-charcoal p-6"><ReceiptText className="text-royalGold" /><h2 className="mt-3 font-heading text-xl font-semibold">After you pay</h2><p className="mt-2 text-sm leading-7 text-ivory/70">Retain the Paystack receipt. Our team will reconcile it against your matter and confirm the next appointment or engagement step.</p></div>
            <Link href="/consultation" className="inline-flex items-center gap-2 text-sm font-bold text-royalGold">No written fee yet? Request a confidential consultation <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
