import { Building2, CheckCircle2, FileSearch } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Open the official portal",
    text: "Confirm that the address is icrp.cac.gov.ng/public-search before relying on the page."
  },
  {
    number: "2",
    title: "Choose the search key",
    text: "Search by the exact entity name, RC or registration number, or AV code."
  },
  {
    number: "3",
    title: "Compare and escalate",
    text: "Match the result with the supplied documents, then obtain enhanced records for a material transaction."
  }
];

export function CacPublicSearchVisualGuide() {
  return (
    <section aria-labelledby="cac-visual-guide" className="rounded-lg border border-royalGold/18 bg-charcoal p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Visual walkthrough</p>
      <h2 id="cac-visual-guide" className="mt-3 font-heading text-3xl font-semibold text-ivory">
        CAC public search at a glance
      </h2>
      <p className="mt-4 leading-8 text-ivory/72">
        This original walkthrough illustrates the verification sequence. The official CAC portal interface may change.
      </p>

      <div className="mt-7 overflow-hidden rounded-lg border border-royalGold/18 bg-luxuryBlack">
        <div className="flex items-center gap-2 border-b border-royalGold/14 px-5 py-3 text-xs text-ivory/55">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/75" />
          <span className="ml-3 truncate rounded bg-charcoal px-3 py-1.5">icrp.cac.gov.ng/public-search/</span>
        </div>
        <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <div className="flex items-center gap-3 text-royalGold"><Building2 size={22} /><span className="text-xs font-bold uppercase tracking-[0.2em]">Corporate Affairs Commission</span></div>
            <p className="mt-4 font-heading text-2xl font-semibold text-ivory">Public Search</p>
            <p className="mt-2 text-sm leading-6 text-ivory/62">Search for an existing company, business name or other registered entity.</p>
          </div>
          <div className="rounded-lg border border-royalGold/20 bg-charcoal p-5">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-ivory/62">Search option</label>
            <div className="mt-2 rounded border border-ivory/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory/72">Entity name, RC number or AV code</div>
            <label className="mt-4 block text-xs font-bold uppercase tracking-[0.16em] text-ivory/62">Search information</label>
            <div className="mt-2 flex items-center gap-3 rounded border border-ivory/15 bg-luxuryBlack px-4 py-3 text-sm text-ivory/45"><FileSearch size={17} /> Enter the exact information</div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-royalGold px-5 py-2.5 text-sm font-bold text-luxuryBlack"><CheckCircle2 size={17} /> Search and compare</div>
          </div>
        </div>
      </div>

      <ol className="mt-7 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.number} className="rounded-lg border border-royalGold/14 bg-luxuryBlack p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-royalGold font-bold text-luxuryBlack">{step.number}</span>
            <h3 className="mt-4 font-heading text-xl font-semibold text-ivory">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ivory/65">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
