import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-royalGold">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ivory sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-base leading-8 text-ivory/70">{description}</p> : null}
    </div>
  );
}
