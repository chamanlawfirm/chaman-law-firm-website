"use client";

export default function ArticleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-heading text-4xl font-semibold">This article is temporarily unavailable</h1>
      <p className="mt-4 text-base leading-7 text-charcoal/75">
        Our publishing service could not be reached. The article has not been removed; please try again shortly.
      </p>
      <button type="button" onClick={reset} className="mt-8 rounded-full bg-royalGold px-6 py-3 font-semibold text-luxuryBlack">
        Try again
      </button>
    </main>
  );
}
