import { NextRequest, NextResponse } from "next/server";
import {
  getBooking,
  updateBookingStatus,
  setInternalNotes,
  type BookingStatus,
} from "@/lib/bookings";
import { requireAdminApi } from "@/lib/adminAuth";
import { recordCompletedBooking } from "@/lib/loyalty";
import { sendLoyaltyRewardEmail } from "@/lib/email";

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
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(booking);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Ongeldige status." }, { status: 400 });
    }
    const booking = await updateBookingStatus(id, body.status);
    if (!booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }

    if (body.status === "Afgerond" && booking.customerId) {
      const reward = await recordCompletedBooking(booking.customerId);
      if (reward) {
        await sendLoyaltyRewardEmail(booking, reward.code, reward.value);
      }
    }

    return NextResponse.json(booking);
  }

  if (body.internalNotes !== undefined) {
    const booking = await setInternalNotes(id, String(body.internalNotes));
    if (!booking) {
      return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
    }
    return NextResponse.json(booking);
  }

  return NextResponse.json({ error: "Niets om bij te werken." }, { status: 400 });
}
