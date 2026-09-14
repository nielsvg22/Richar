import { NextRequest, NextResponse } from "next/server";
import { getVoucher, activateVoucher } from "@/lib/vouchers";
import { getMolliePayment } from "@/lib/mollie";
import { sendVoucherEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code ontbreekt." }, { status: 400 });
  }

  const voucher = await getVoucher(code);
  if (!voucher) {
    return NextResponse.json({ error: "Cadeaubon niet gevonden." }, { status: 404 });
  }

  if (voucher.status !== "unpaid") {
    return NextResponse.json({ active: true, status: voucher.status });
  }

  if (!voucher.molliePaymentId) {
    return NextResponse.json({ active: false, status: "no_payment" });
  }

  try {
    const payment = await getMolliePayment(voucher.molliePaymentId);
    if (payment.status === "paid") {
      const activated = await activateVoucher(voucher.code);
      if (activated) await sendVoucherEmail(activated);
      return NextResponse.json({ active: true, status: "active" });
    }
    return NextResponse.json({ active: false, status: payment.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kan betaalstatus niet ophalen." },
      { status: 502 }
    );
  }
}
