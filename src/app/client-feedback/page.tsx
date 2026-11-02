import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = {
  ...createMetadata({title:"Client Feedback",description:"Share confidential feedback about your experience with Chaman Law Firm and its representatives.",path:"/client-feedback",noIndex:true}),
  robots:{index:false,follow:true}
};
export default function ClientFeedbackPage() {
 const ready=Boolean(process.env.FEEDBACK_SUPABASE_URL && process.env.FEEDBACK_SUPABASE_SERVICE_KEY);
 return <main className="bg-luxuryBlack min-h-screen text-ivory">
  <section className="mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6">
   <p className="text-xs font-bold uppercase tracking-[.2em] text-royalGold">Confidential management review</p>
   <h1 className="mt-4 font-heading text-4xl font-bold sm:text-5xl">Tell Us About Your Experience</h1>
   <p className="mt-5 text-base leading-8 text-ivory/80">Your feedback helps us improve our legal services and client care. Please tell us what went well and what we should improve. You may comment on a lawyer, staff member, representative or your overall experience. We welcome both positive and negative feedback.</p>
   <p className="mt-4 text-sm leading-7 text-ivory/70">Submissions are for confidential management review and do not appear automatically as testimonials. You may leave contact details blank unless requesting a response. Please do not share passwords, bank details or unnecessary case information. This is not a channel for urgent legal instructions or court deadlines. Confidentiality is subject to necessary investigation and legal obligations.</p>
   <p className="mt-4 text-sm text-ivory/70">Read the <Link href="/privacy-policy" className="text-royalGold underline">privacy notice</Link> before submitting.</p>
  </section>
  <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
   {ready ? <FeedbackForm/> : <div role="status" className="rounded-xl border border-royalGold/30 bg-charcoal p-8"><h2 className="font-heading text-2xl">Online feedback service is being securely configured</h2><p className="mt-4 leading-7 text-ivory/75">The confidential submission channel is not yet active. You may contact management directly at <a href="mailto:chamanlawfirm@gmail.com" className="text-royalGold underline">chamanlawfirm@gmail.com</a>. Avoid including unnecessary sensitive details in an ordinary email.</p></div>}
  </section>
 </main>;
}