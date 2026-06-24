import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Chaman Law Firm home">
      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-royalGold/55 bg-white shadow-gold">
        <Image src="/logo.png" alt="Chaman Law Firm logo" width={48} height={48} className="h-full w-full object-contain" priority />
      </span>
      <div className="leading-tight">
        <p className="font-heading text-lg font-bold text-royalGold">
          CHAMAN
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ivory">
          Law Firm
        </p>
      </div>
    </Link>
  );
}
