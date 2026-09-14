import { NextRequest, NextResponse } from "next/server";
import { getBooking, recordEmailSent, type EmailType } from "@/lib/bookings";
import { sendBookingConfirmation, sendPartyReminder, sendReviewRequest } from "@/lib/email";

const SENDERS: Record<EmailType, typeof sendBookingConfirmation> = {
  confirmation: sendBookingConfirmation,
  reminder: sendPartyReminder,
  review: sendReviewRequest,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const type = body.type as EmailType;

  if (!SENDERS[type]) {
    return NextResponse.json({ error: "Ongeldig e-mailtype." }, { status: 400 });
  }

  const booking = getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }

  const result = await SENDERS[type](booking, request.nextUrl.origin);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Versturen van de e-mail is mislukt." },
      { status: 502 }
    );
  }

  recordEmailSent(id, type);
  return NextResponse.json({ success: true });
}
