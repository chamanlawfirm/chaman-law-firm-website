import { Search } from "lucide-react";

export function PropertySearchBar() {
  return (
    <form
      action="/properties"
      className="grid gap-3 rounded-lg border border-royalGold/25 bg-luxuryBlack/88 p-4 shadow-2xl backdrop-blur md:grid-cols-6"
    >
      <select name="status" className="rounded-md border border-royalGold/15 bg-charcoal px-3 py-3 text-sm text-ivory">
        <option value="">Purpose</option>
        <option value="for-sale">Buy</option>
        <option value="for-rent">Rent</option>
        <option value="shortlet">Shortlet</option>
        <option value="investment">Investment</option>
      </select>
      <input
        name="location"
        placeholder="Location"
        className="rounded-md border border-royalGold/15 bg-charcoal px-3 py-3 text-sm text-ivory placeholder:text-ivory/40"
      />
      <select name="type" className="rounded-md border border-royalGold/15 bg-charcoal px-3 py-3 text-sm text-ivory">
        <option value="">Property type</option>
        <option>Apartment</option>
        <option>Detached Duplex</option>
        <option>Land</option>
        <option>Commercial</option>
        <option>Shortlet</option>
      </select>
      <select name="beds" className="rounded-md border border-royalGold/15 bg-charcoal px-3 py-3 text-sm text-ivory">
        <option value="">Bedrooms</option>
        <option>1+</option>
        <option>2+</option>
        <option>3+</option>
        <option>4+</option>
        <option>5+</option>
      </select>
      <input
        name="budget"
        placeholder="Budget"
        className="rounded-md border border-royalGold/15 bg-charcoal px-3 py-3 text-sm text-ivory placeholder:text-ivory/40"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-royalGold px-4 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne"
      >
        <Search size={17} />
        Search
      </button>
    </form>
  );
}
