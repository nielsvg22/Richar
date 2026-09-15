import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/bookings";
import { findUpcomingAnniversaries, wasBirthdayReminderSent, markBirthdayReminderSent } from "@/lib/anniversaries";
import { sendBirthdayReminder } from "@/lib/email";

// Triggered daily by Vercel Cron (see vercel.json). Sends a "vorig jaar
// was [kind] jarig, dit jaar weer?" e-mail once per booking per year,
// starting 14 days before the anniversary of the party date.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET niet geconfigureerd." }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  const bookings = await getBookings();
  const matches = findUpcomingAnniversaries(bookings, 14);

  let sent = 0;
  for (const match of matches) {
    const year = Number(match.anniversaryDate.slice(0, 4));
    if (await wasBirthdayReminderSent(match.booking.id, year)) continue;

    const result = await sendBirthdayReminder(match.booking, request.nextUrl.origin);
    if (result.success) {
      await markBirthdayReminderSent(match.booking.id, year);
      sent += 1;
    }
  }

  return NextResponse.json({ checked: matches.length, sent });
}
