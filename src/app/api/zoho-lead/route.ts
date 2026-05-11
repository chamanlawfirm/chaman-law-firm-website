import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  // Placeholder for Zoho CRM integration.
  // Production flow: validate payload, exchange refresh token, then create a Zoho Leads record.
  console.info("Zoho CRM placeholder lead received:", {
    source: payload.source,
    name: payload.name,
    email: payload.email,
    interest: payload.interest
  });

  return NextResponse.json({
    ok: true,
    provider: "zoho-placeholder",
    message: "Lead captured by placeholder endpoint. Connect Zoho credentials to enable CRM sync."
  });
}
