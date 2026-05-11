import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Chaman Properties home">
      <Image
        src="/logo.png"
        alt="Chaman Properties"
        width={56}
        height={56}
        priority
        className="h-12 w-12 rounded-full object-contain"
      />

      <div className="leading-tight">
        <p className="font-heading text-lg font-bold tracking-[0.18em] text-royalGold">
          CHAMAN
        </p>
        <p className="text-xs font-semibold tracking-[0.28em] text-ivory">
          PROPERTIES
        </p>
      </div>
    </Link>
  );
}