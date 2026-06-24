import "server-only";

import { createHash, randomUUID } from "node:crypto";

export type LeadType = "enquiry" | "newsletter" | "lead-magnet-download";

export type ValidatedLead = {
  reference: string;
  leadType: LeadType;
  source: string;
  name?: string;
  email: string;
  phone?: string;
  interest: string;
  message?: string;
  downloadSlug?: string;
  consent: true;
  receivedAt: string;
};

type ValidationResult =
  | { ok: true; lead: Omit<ValidatedLead, "reference" | "receivedAt"> }
  | { ok: false; kind: "invalid" | "spam"; fields: string[] };

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();
const allowedKeys = new Set([
  "leadType",
  "source",
  "name",
  "email",
  "phone",
  "interest",
  "message",
  "downloadSlug",
  "consent",
  "website"
]);

function cleanSingleLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMessage(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function hasValidPhone(value: string) {
  return value.length >= 7 && value.length <= 30 && /^[0-9+().\s-]+$/.test(value);
}

export function validateLeadPayload(payload: unknown): ValidationResult {
  if (!isPlainObject(payload)) {
    return { ok: false, kind: "invalid", fields: ["payload"] };
  }

  const unexpectedKeys = Object.keys(payload).filter((key) => !allowedKeys.has(key));
  if (unexpectedKeys.length) {
    return { ok: false, kind: "invalid", fields: ["payload"] };
  }

  if (cleanSingleLine(payload.website, 200)) {
    return { ok: false, kind: "spam", fields: ["payload"] };
  }

  const leadTypeValue = cleanSingleLine(payload.leadType, 40) || "enquiry";
  const leadType: LeadType | null = ["enquiry", "newsletter", "lead-magnet-download"].includes(leadTypeValue)
    ? (leadTypeValue as LeadType)
    : null;
  const source = cleanSingleLine(payload.source, 120);
  const name = cleanSingleLine(payload.name, 100);
  const email = cleanSingleLine(payload.email, 254).toLowerCase();
  const phone = cleanSingleLine(payload.phone, 30);
  const interest = cleanSingleLine(payload.interest, 160);
  const message = cleanMessage(payload.message, 4000);
  const downloadSlug = cleanSingleLine(payload.downloadSlug, 120);
  const consent = payload.consent === true || payload.consent === "true" || payload.consent === "on";
  const fields: string[] = [];

  if (!leadType) fields.push("leadType");
  if (source.length < 2) fields.push("source");
  if (!hasValidEmail(email)) fields.push("email");
  if (!interest) fields.push("interest");
  if (!consent) fields.push("consent");

  if (leadType === "enquiry") {
    if (name.length < 2) fields.push("name");
    if (!hasValidPhone(phone)) fields.push("phone");
    if (message.length < 10) fields.push("message");
  }

  if (phone && !hasValidPhone(phone)) fields.push("phone");
  if (leadType === "lead-magnet-download" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(downloadSlug)) {
    fields.push("downloadSlug");
  }

  if (fields.length) {
    return { ok: false, kind: "invalid", fields: [...new Set(fields)] };
  }

  return {
    ok: true,
    lead: {
      leadType: leadType as LeadType,
      source,
      name: name || undefined,
      email,
      phone: phone || undefined,
      interest,
      message: message || undefined,
      downloadSlug: downloadSlug || undefined,
      consent: true
    }
  };
}

function boundedNumber(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

export function consumeLeadRateLimit(request: Request) {
  const maximum = boundedNumber(process.env.LEAD_RATE_LIMIT_MAX, 5, 1, 30);
  const windowMs = boundedNumber(process.env.LEAD_RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000, 60_000, 60 * 60 * 1000);
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientSignal = forwardedFor || request.headers.get("x-real-ip") || request.headers.get("user-agent") || "unknown";
  const key = createHash("sha256").update(clientSignal).digest("hex").slice(0, 32);
  const now = Date.now();

  if (rateLimitBuckets.size > 5000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }

  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maximum - 1, retryAfterSeconds: Math.ceil(windowMs / 1000), maximum };
  }

  if (current.count >= maximum) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      maximum
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: maximum - current.count,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    maximum
  };
}

export function createLead(validated: Omit<ValidatedLead, "reference" | "receivedAt">): ValidatedLead {
  return {
    ...validated,
    reference: randomUUID(),
    receivedAt: new Date().toISOString()
  };
}

export async function deliverLead(lead: ValidatedLead) {
  const rawUrl = process.env.LEAD_DELIVERY_WEBHOOK_URL?.trim();
  if (!rawUrl) {
    return { delivered: false as const, reason: "unavailable" as const };
  }

  let webhookUrl: URL;
  try {
    webhookUrl = new URL(rawUrl);
  } catch {
    return { delivered: false as const, reason: "misconfigured" as const };
  }

  if (webhookUrl.protocol !== "https:") {
    return { delivered: false as const, reason: "misconfigured" as const };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const token = process.env.LEAD_DELIVERY_WEBHOOK_TOKEN?.trim();

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(lead),
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      return { delivered: false as const, reason: "rejected" as const };
    }

    return { delivered: true as const };
  } catch {
    return { delivered: false as const, reason: "failed" as const };
  } finally {
    clearTimeout(timeout);
  }
}
