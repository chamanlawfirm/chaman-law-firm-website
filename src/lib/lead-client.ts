type LeadSubmissionResult = {
  ok: boolean;
  message: string;
  reference?: string;
};

export async function submitLeadRequest(payload: Record<string, unknown>): Promise<LeadSubmissionResult> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = (await response.json().catch(() => null)) as
    | { ok?: boolean; message?: string; reference?: string }
    | null;

  if (!response.ok || !result?.ok) {
    return {
      ok: false,
      message: result?.message || "The request could not be securely submitted. Please call, email, or use WhatsApp."
    };
  }

  return {
    ok: true,
    message: result.message || "Your request has been securely received.",
    reference: result.reference
  };
}
