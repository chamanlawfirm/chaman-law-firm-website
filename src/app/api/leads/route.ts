import { NextResponse } from "next/server";
import {
  consumeLeadRateLimit,
  createLead,
  deliverLead,
  validateLeadPayload
} from "@/lib/lead-intake";

export const runtime = "nodejs";

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache"
};

function json(body: Record<string, unknown>, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...noStoreHeaders, ...headers } });
}

function hasAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowedOrigins = new Set([new URL(request.url).origin]);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    try {
      allowedOrigins.add(new URL(configuredSiteUrl).origin);
    } catch {
      // A malformed optional site URL must not broaden the accepted origins.
    }
  }

  return allowedOrigins.has(origin);
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return json({ ok: false, message: "Request origin is not allowed." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, message: "Content-Type must be application/json." }, 415);
  }

  const rateLimit = consumeLeadRateLimit(request);
  const rateHeaders = {
    "X-RateLimit-Limit": String(rateLimit.maximum),
    "X-RateLimit-Remaining": String(rateLimit.remaining)
  };

  if (!rateLimit.allowed) {
    return json(
      { ok: false, message: "Too many requests. Please wait before trying again." },
      429,
      { ...rateHeaders, "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 20_000) {
    return json({ ok: false, message: "Request payload is too large." }, 413, rateHeaders);
  }

  let payload: unknown;
  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > 20_000) {
      return json({ ok: false, message: "Request payload is invalid." }, 400, rateHeaders);
    }
    payload = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, message: "Request payload is invalid." }, 400, rateHeaders);
  }

  const validation = validateLeadPayload(payload);
  if (!validation.ok) {
    return json(
      {
        ok: false,
        message: "Please review the form and provide valid required information.",
        fields: validation.kind === "invalid" ? validation.fields : undefined
      },
      422,
      rateHeaders
    );
  }

  const lead = createLead(validation.lead);
  const delivery = await deliverLead(lead);

  if (!delivery.delivered) {
    const unavailable = delivery.reason === "unavailable" || delivery.reason === "misconfigured";
    return json(
      {
        ok: false,
        status: unavailable ? "delivery-unavailable" : "delivery-failed",
        message: unavailable
          ? "Online submission is temporarily unavailable. Please call, email, or use WhatsApp."
          : "Your request could not be securely delivered. Please call, email, or use WhatsApp."
      },
      unavailable ? 503 : 502,
      rateHeaders
    );
  }

  return json(
    {
      ok: true,
      status: "delivered",
      reference: lead.reference,
      message: "Your request has been securely received."
    },
    201,
    rateHeaders
  );
}
