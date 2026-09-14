import { NextRequest, NextResponse } from "next/server";
import { getAvailabilityForMonth, MAX_BOOKINGS_PER_DAY } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const monthParam = request.nextUrl.searchParams.get("month");
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    year = y;
    month = m - 1;
  }

  const availability = await getAvailabilityForMonth(year, month);
  return NextResponse.json({ maxPerDay: MAX_BOOKINGS_PER_DAY, days: availability });
}
