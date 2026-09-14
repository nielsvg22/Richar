import { NextRequest, NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
  }

  const result = await sendTestEmail(email);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
