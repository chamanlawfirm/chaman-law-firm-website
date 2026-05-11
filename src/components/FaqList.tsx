import type { Faq } from "@/lib/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-lg border border-royalGold/16 bg-luxuryBlack p-5 open:border-royalGold/36"
        >
          <summary className="cursor-pointer list-none font-semibold text-ivory">
            <span className="flex items-center justify-between gap-4">
              {faq.question}
              <span className="text-royalGold transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-4 text-sm leading-7 text-ivory/70">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
