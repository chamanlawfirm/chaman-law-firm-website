import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348065553671"}?text=${encoded}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}
