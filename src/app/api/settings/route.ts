import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings, maskApiKey } from "@/lib/settings";

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({
    ...settings,
    resendApiKey: maskApiKey(settings.resendApiKey),
    resendApiKeyConfigured: Boolean(settings.resendApiKey),
    mollieApiKey: maskApiKey(settings.mollieApiKey),
    mollieApiKeyConfigured: Boolean(settings.mollieApiKey),
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { resendApiKey, emailFrom, emailReplyTo, mollieApiKey } = body;

  if (emailFrom !== undefined && !emailFrom.trim()) {
    return NextResponse.json({ error: "Vul een afzender in." }, { status: 400 });
  }
  if (emailReplyTo !== undefined && !/^\S+@\S+\.\S+$/.test(emailReplyTo)) {
    return NextResponse.json({ error: "Vul een geldig reply-to e-mailadres in." }, { status: 400 });
  }

  const updated = updateSettings({
    // Only overwrite a key when the admin actually typed a new one
    // (the GET endpoint never returns the real key, only a masked version).
    resendApiKey: resendApiKey ? resendApiKey.trim() : undefined,
    emailFrom: emailFrom?.trim(),
    emailReplyTo: emailReplyTo?.trim(),
    mollieApiKey: mollieApiKey ? mollieApiKey.trim() : undefined,
  });

  return NextResponse.json({
    ...updated,
    resendApiKey: maskApiKey(updated.resendApiKey),
    resendApiKeyConfigured: Boolean(updated.resendApiKey),
    mollieApiKey: maskApiKey(updated.mollieApiKey),
    mollieApiKeyConfigured: Boolean(updated.mollieApiKey),
  });
}
