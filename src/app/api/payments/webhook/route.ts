import { NextRequest, NextResponse } from "next/server";
import { getBookingByMolliePaymentId, markDepositPaid } from "@/lib/bookings";
import { getVoucherByMolliePaymentId, activateVoucher } from "@/lib/vouchers";
import { getMolliePayment } from "@/lib/mollie";
import { sendVoucherEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const paymentId = formData.get("id") as string | null;

  if (!paymentId) {
    return NextResponse.json({ error: "Geen payment id." }, { status: 400 });
  }

  try {
    const payment = await getMolliePayment(paymentId);
    if (payment.status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const booking = await getBookingByMolliePaymentId(paymentId);
    if (booking && !booking.depositPaid) {
      await markDepositPaid(booking.id);
      return NextResponse.json({ received: true });
    }

    const voucher = await getVoucherByMolliePaymentId(paymentId);
    if (voucher && voucher.status === "unpaid") {
      const activated = await activateVoucher(voucher.code);
      if (activated) await sendVoucherEmail(activated);
    }

    return NextResponse.json({ received: true });
  } catch {
    // Mollie retries webhooks; respond 200 even on lookup errors so it doesn't hammer us,
    // the status pages double-check payment status independently.
    return NextResponse.json({ received: true });
  }
}
