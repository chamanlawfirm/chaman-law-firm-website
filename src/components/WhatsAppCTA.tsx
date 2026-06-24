import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

type WhatsAppCTAProps = {
  message?: string;
  label?: string;
  variant?: "inline" | "floating";
};

export function WhatsAppCTA({
  message = "Hello Chaman Law Firm, I would like to speak with a lawyer.",
  label = "Speak With a Lawyer",
  variant = "inline"
}: WhatsAppCTAProps) {
  const classes =
    variant === "floating"
      ? "fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-royalGold px-5 py-3 text-sm font-bold text-luxuryBlack shadow-gold transition hover:bg-champagne"
      : "inline-flex items-center justify-center gap-2 rounded-full bg-royalGold px-6 py-3 text-sm font-bold text-luxuryBlack transition hover:bg-champagne";

  return (
    <a href={whatsappLink(message)} className={classes}>
      <MessageCircle size={18} />
      {label}
    </a>
  );
}
