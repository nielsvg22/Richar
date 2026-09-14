import { NextRequest, NextResponse } from "next/server";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";
import { requireAdminApi } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  if (!(await isMollieConfigured())) {
    return NextResponse.json({ error: "Geen Mollie API key geconfigureerd." }, { status: 400 });
  }

  const origin = request.nextUrl.origin;

  try {
    const payment = await createMolliePayment({
      amount: 1,
      description: "Testbetaling Rosa & Charlotte",
      redirectUrl: `${origin}/admin/instellingen`,
      webhookUrl: `${origin}/api/payments/webhook`,
      metadata: { test: true },
    });
    return NextResponse.json({ checkoutUrl: payment._links.checkout?.href });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis." },
      { status: 502 }
    );
  }
}
