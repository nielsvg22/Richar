import { NextRequest, NextResponse } from "next/server";
import { getBookingByMolliePaymentId, markDepositPaid } from "@/lib/bookings";
import { getMolliePayment } from "@/lib/mollie";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const paymentId = formData.get("id") as string | null;

  if (!paymentId) {
    return NextResponse.json({ error: "Geen payment id." }, { status: 400 });
  }

  try {
    const payment = await getMolliePayment(paymentId);
    const booking = getBookingByMolliePaymentId(paymentId);

    if (booking && payment.status === "paid" && !booking.depositPaid) {
      markDepositPaid(booking.id);
    }

    return NextResponse.json({ received: true });
  } catch {
    // Mollie retries webhooks; respond 200 even on lookup errors so it doesn't hammer us,
    // the status page double-checks payment status independently.
    return NextResponse.json({ received: true });
  }
}
