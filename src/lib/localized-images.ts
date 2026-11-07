/**
 * Central safeguard for generic external stock photography.
 * Only images hosted by well-known generic stock services are substituted.
 * Actual Sanity editorial assets, client-provided photographs, team portraits
 * and other licensed/verified imagery are intentionally preserved.
 */
export function localizeGenericStockImage(
  source: string | undefined,
  replacement = "/images/firm/firm-office-team.jpg"
): string | undefined {
  if (!source) return source;
  try {
    const url = new URL(source);
    const host = url.hostname.toLowerCase();
    const isStock =
      host === "images.unsplash.com" ||
      host === "plus.unsplash.com" ||
      host === "images.pexels.com" ||
      host === "cdn.pixabay.com" ||
      host === "images.pixabay.com";
    return isStock ? replacement : source;
  } catch {
    return source;
  }
}
