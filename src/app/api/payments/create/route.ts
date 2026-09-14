import { NextRequest, NextResponse } from "next/server";
import { getBooking, setMolliePaymentId } from "@/lib/bookings";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { bookingId } = body;

  const booking = getBooking(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }

  if (!isMollieConfigured()) {
    return NextResponse.json(
      { error: "Online betalen is nog niet ingesteld. Neem contact met ons op om te betalen." },
      { status: 503 }
    );
  }

  if (booking.depositPaid) {
    return NextResponse.json({ error: "De aanbetaling is al voldaan." }, { status: 400 });
  }

  const origin = request.nextUrl.origin;

  try {
    const payment = await createMolliePayment({
      amount: booking.depositAmount,
      description: `Aanbetaling ${booking.themeName} — boeking ${booking.id}`,
      redirectUrl: `${origin}/boeken/betaald?bookingId=${booking.id}`,
      webhookUrl: `${origin}/api/payments/webhook`,
      metadata: { bookingId: booking.id },
    });

    setMolliePaymentId(booking.id, payment.id);

    return NextResponse.json({ checkoutUrl: payment._links.checkout?.href });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis bij het starten van de betaling." },
      { status: 502 }
    );
  }
}
