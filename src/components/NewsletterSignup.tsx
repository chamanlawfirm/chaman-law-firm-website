export function NewsletterSignup() {
  return (
    <section className="rounded-lg border border-royalGold/16 bg-charcoal p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-royalGold">Property Intelligence</p>
      <h2 className="mt-3 font-heading text-2xl font-semibold text-ivory">Get real estate guides in your inbox.</h2>
      <p className="mt-3 text-sm leading-7 text-ivory/66">
        Join the Chaman Properties newsletter for investment guides, verification tips, market insight, and diaspora property updates.
      </p>
      <form action="/contact" method="get" className="mt-5 space-y-3">
        <input type="hidden" name="source" value="blog-newsletter" />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className="w-full rounded-full border border-royalGold/18 bg-luxuryBlack px-5 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-royalGold/55"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
