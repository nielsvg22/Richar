import { NextRequest, NextResponse } from "next/server";
import { getBookings, saveBooking, recordEmailSent, type Booking } from "@/lib/bookings";
import { getTheme } from "@/lib/themes";
import { getPackage, getExtra, EXTRA_CHILD_PRICE } from "@/lib/pricing";
import { sendBookingConfirmation } from "@/lib/email";
import { MAX_BOOKINGS_PER_DAY } from "@/lib/availability";

export async function GET() {
  return NextResponse.json(getBookings());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    themeSlug,
    packageId,
    kids,
    date,
    time,
    location,
    locationType,
    extras: extraIds,
    parentName,
    email,
    phone,
    childName,
    childAge,
    notes,
    force,
  } = body;

  const theme = getTheme(themeSlug);
  const pkg = getPackage(packageId);

  if (!theme || !pkg || !date || !parentName || !email || !phone || !childName) {
    return NextResponse.json(
      { error: "Niet alle verplichte gegevens zijn ingevuld." },
      { status: 400 }
    );
  }

  const bookingsOnDate = getBookings().filter(
    (b) => b.date === date && b.status !== "Geannuleerd"
  );
  if (!force && bookingsOnDate.length >= MAX_BOOKINGS_PER_DAY) {
    return NextResponse.json(
      { error: "Deze datum zit helaas al vol. Kies een andere datum." },
      { status: 409 }
    );
  }

  const kidsCount = Number(kids) || pkg.maxKids;
  const extraKids = Math.max(0, kidsCount - pkg.maxKids);
  const extraKidsPrice = extraKids * EXTRA_CHILD_PRICE;

  const selectedExtras: string[] = Array.isArray(extraIds) ? extraIds : [];
  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const extra = getExtra(id);
    if (!extra) return sum;
    return sum + (extra.unit === "per kind" ? extra.price * kidsCount : extra.price);
  }, 0);

  const totalPrice = pkg.price + extraKidsPrice + extrasPrice;

  const booking: Booking = {
    id: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    themeSlug: theme.slug,
    themeName: theme.name,
    packageId: pkg.id,
    packageName: pkg.name,
    kids: kidsCount,
    date,
    time: time || "",
    location: location || "",
    locationType: locationType || "thuis",
    extras: selectedExtras,
    parentName,
    email,
    phone,
    childName,
    childAge: Number(childAge) || 0,
    notes: notes || "",
    basePrice: pkg.price,
    extraKidsPrice,
    extrasPrice,
    totalPrice,
    status: "Nieuw",
    emailsSent: [],
  };

  saveBooking(booking);

  const emailResult = await sendBookingConfirmation(booking);
  if (emailResult.success) {
    recordEmailSent(booking.id, "confirmation");
    booking.emailsSent = ["confirmation"];
  }

  return NextResponse.json(booking, { status: 201 });
}
