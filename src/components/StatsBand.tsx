const stats = [
  { value: "Legal-backed", label: "property confidence" },
  { value: "Diaspora-ready", label: "investment support" },
  { value: "Lagos & Ogun", label: "office presence" },
  { value: "Sales, Letting", label: "management and shortlets" }
];

export function StatsBand() {
  return (
    <div className="border-y border-royalGold/15 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.value} className="rounded-lg border border-royalGold/12 bg-luxuryBlack p-5">
            <p className="font-heading text-2xl font-bold text-royalGold">{stat.value}</p>
            <p className="mt-2 text-sm text-ivory/62">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
