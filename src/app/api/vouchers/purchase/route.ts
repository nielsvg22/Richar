import { NextRequest, NextResponse } from "next/server";
import { createVoucher, setVoucherMolliePaymentId } from "@/lib/vouchers";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { amount, purchaserName, purchaserEmail, recipientName, message } = body;

  const amountNum = Number(amount);
  if (!amountNum || amountNum < 10 || amountNum > 500) {
    return NextResponse.json(
      { error: "Kies een bedrag tussen €10 en €500." },
      { status: 400 }
    );
  }
  if (!purchaserName || !purchaserEmail) {
    return NextResponse.json(
      { error: "Vul je naam en e-mailadres in." },
      { status: 400 }
    );
  }

  if (!isMollieConfigured()) {
    return NextResponse.json(
      { error: "Online betalen is nog niet ingesteld. Neem contact met ons op om een cadeaubon te kopen." },
      { status: 503 }
    );
  }

  const voucher = createVoucher({
    amount: amountNum,
    purchaserName,
    purchaserEmail,
    recipientName: recipientName || "",
    message: message || "",
  });

  const origin = request.nextUrl.origin;

  try {
    const payment = await createMolliePayment({
      amount: amountNum,
      description: `Cadeaubon Rosa & Charlotte — ${voucher.code}`,
      redirectUrl: `${origin}/cadeaubon/bedankt?code=${voucher.code}`,
      webhookUrl: `${origin}/api/payments/webhook`,
      metadata: { type: "voucher", code: voucher.code },
    });

    setVoucherMolliePaymentId(voucher.code, payment.id);

    return NextResponse.json({ checkoutUrl: payment._links.checkout?.href });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis." },
      { status: 502 }
    );
  }
}
