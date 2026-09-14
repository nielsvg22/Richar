import { NextRequest, NextResponse } from "next/server";
import { getBooking, markDepositPaid } from "@/lib/bookings";
import { getMolliePayment } from "@/lib/mollie";

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId ontbreekt." }, { status: 400 });
  }

  const booking = getBooking(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }

  if (booking.depositPaid) {
    return NextResponse.json({ depositPaid: true, status: "paid" });
  }

  if (!booking.molliePaymentId) {
    return NextResponse.json({ depositPaid: false, status: "no_payment" });
  }

  try {
    const payment = await getMolliePayment(booking.molliePaymentId);
    if (payment.status === "paid") {
      markDepositPaid(booking.id);
      return NextResponse.json({ depositPaid: true, status: "paid" });
    }
    return NextResponse.json({ depositPaid: false, status: payment.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kan betaalstatus niet ophalen." },
      { status: 502 }
    );
  }
}
