import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const email = typeof payload.email === "string" ? payload.email.trim() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, message: "A valid email address is required." }, { status: 400 });
  }

  // Placeholder for Zoho CRM integration.
  // Production flow: validate payload, exchange refresh token, then create a Zoho Leads record.
  console.info("Zoho CRM placeholder lead received:", {
    leadType: payload.leadType,
    source: payload.source,
    name: payload.name,
    email,
    phone: payload.phone,
    interest: payload.interest,
    downloadSlug: payload.downloadSlug
  });

  return NextResponse.json({
    ok: true,
    provider: "zoho-placeholder",
    message: "Lead captured by placeholder endpoint. Connect Zoho credentials to enable CRM sync."
  });
}
