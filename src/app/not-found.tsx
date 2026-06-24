import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-luxuryBlack py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-royalGold">Page Not Found</p>
        <h1 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
          This page is not available
        </h1>
        <p className="mt-5 text-base leading-8 text-ivory/70">
          The legal page, article, or resource may have moved. You can return to practice areas or contact the firm.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/practice-areas"
            className="rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
          >
            View Practice Areas
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-royalGold/40 px-6 py-3 text-sm font-bold text-royalGold transition hover:bg-royalGold hover:text-luxuryBlack"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
