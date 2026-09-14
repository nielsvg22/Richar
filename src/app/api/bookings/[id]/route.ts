import { NextRequest, NextResponse } from "next/server";
import {
  getBooking,
  updateBookingStatus,
  setInternalNotes,
  type BookingStatus,
} from "@/lib/bookings";

const VALID_STATUSES: BookingStatus[] = [
  "Nieuw",
  "In behandeling",
  "Bevestigd",
  "Betaald",
  "Afgerond",
  "Geannuleerd",
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(booking);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Ongeldige status." }, { status: 400 });
    }
    const booking = updateBookingStatus(id, body.status);
    if (!booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }
    return NextResponse.json(booking);
  }

  if (body.internalNotes !== undefined) {
    const booking = setInternalNotes(id, String(body.internalNotes));
    if (!booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }
    return NextResponse.json(booking);
  }

  return NextResponse.json({ error: "Niets om bij te werken." }, { status: 400 });
}
