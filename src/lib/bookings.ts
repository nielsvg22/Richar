import { sql, ensureSchema } from "./db";

export type BookingStatus =
  | "Nieuw"
  | "In behandeling"
  | "Bevestigd"
  | "Betaald"
  | "Afgerond"
  | "Geannuleerd";

export type Booking = {
  id: string;
  createdAt: string;
  themeSlug: string;
  themeName: string;
  packageId: string;
  packageName: string;
  kids: number;
  date: string;
  time: string;
  location: string;
  locationType: "thuis" | "locatie" | "anders";
  extras: string[];
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childAge: number;
  notes: string;
  basePrice: number;
  extraKidsPrice: number;
  extrasPrice: number;
  discountCode: string | null;
  discountAmount: number;
  voucherCode: string | null;
  voucherAmount: number;
  totalPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  molliePaymentId: string | null;
  customerId: string | null;
  status: BookingStatus;
  emailsSent: EmailType[];
  internalNotes: string;
  viewedAt: string | null;
};

export type EmailType = "confirmation" | "reminder" | "review";

type BookingRow = {
  id: string;
  created_at: Date;
  theme_slug: string;
  theme_name: string;
  package_id: string;
  package_name: string;
  kids: number;
  date: string;
  time: string;
  location: string;
  location_type: string;
  extras: string[];
  parent_name: string;
  email: string;
  phone: string;
  child_name: string;
  child_age: number;
  notes: string;
  base_price: number;
  extra_kids_price: number;
  extras_price: number;
  discount_code: string | null;
  discount_amount: number;
  voucher_code: string | null;
  voucher_amount: number;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  mollie_payment_id: string | null;
  customer_id: string | null;
  status: string;
  emails_sent: EmailType[];
  internal_notes: string;
  viewed_at: Date | null;
};

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    createdAt: row.created_at.toISOString(),
    themeSlug: row.theme_slug,
    themeName: row.theme_name,
    packageId: row.package_id,
    packageName: row.package_name,
    kids: row.kids,
    date: row.date,
    time: row.time,
    location: row.location,
    locationType: row.location_type as Booking["locationType"],
    extras: row.extras,
    parentName: row.parent_name,
    email: row.email,
    phone: row.phone,
    childName: row.child_name,
    childAge: row.child_age,
    notes: row.notes,
    basePrice: row.base_price,
    extraKidsPrice: row.extra_kids_price,
    extrasPrice: row.extras_price,
    discountCode: row.discount_code,
    discountAmount: row.discount_amount,
    voucherCode: row.voucher_code,
    voucherAmount: row.voucher_amount,
    totalPrice: row.total_price,
    depositAmount: row.deposit_amount,
    depositPaid: row.deposit_paid,
    molliePaymentId: row.mollie_payment_id,
    customerId: row.customer_id,
    status: row.status as BookingStatus,
    emailsSent: row.emails_sent,
    internalNotes: row.internal_notes,
    viewedAt: row.viewed_at ? row.viewed_at.toISOString() : null,
  };
}

function seedBookings() {
  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      id: "RC-1042",
      createdAt: inDays(-6),
      themeSlug: "unicornfeest",
      themeName: "Unicornfeest",
      packageId: "fun",
      packageName: "Fun",
      kids: 8,
      date: inDays(4),
      time: "14:00 - 16:30",
      location: "Apeldoorn",
      locationType: "thuis" as const,
      extras: ["goodiebags", "ballonnenboog"],
      parentName: "Lisa Vermeer",
      email: "lisa.vermeer@example.com",
      phone: "06-12345678",
      childName: "Julia",
      childAge: 7,
      notes: "Julia is allergisch voor pinda's.",
      basePrice: 199,
      extraKidsPrice: 0,
      extrasPrice: 121,
      totalPrice: 320,
      status: "Bevestigd" as const,
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 160,
      depositPaid: true,
    },
    {
      id: "RC-1043",
      createdAt: inDays(-4),
      themeSlug: "superheldenfeest",
      themeName: "Superheldenfeest",
      packageId: "mini",
      packageName: "Mini",
      kids: 6,
      date: inDays(2),
      time: "10:00 - 12:00",
      location: "Deventer",
      locationType: "thuis" as const,
      extras: [],
      parentName: "Mark de Groot",
      email: "mark.degroot@example.com",
      phone: "06-23456789",
      childName: "Sem",
      childAge: 6,
      notes: "",
      basePrice: 149,
      extraKidsPrice: 0,
      extrasPrice: 0,
      totalPrice: 149,
      status: "Betaald" as const,
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 75,
      depositPaid: true,
    },
    {
      id: "RC-1044",
      createdAt: inDays(-2),
      themeSlug: "beautyfeest",
      themeName: "Beautyfeest",
      packageId: "deluxe",
      packageName: "Deluxe",
      kids: 10,
      date: inDays(9),
      time: "13:00 - 16:00",
      location: "Arnhem",
      locationType: "locatie" as const,
      extras: ["fotografie", "taart", "goodiebags"],
      parentName: "Sophie Bakker",
      email: "sophie.bakker@example.com",
      phone: "06-34567890",
      childName: "Noor",
      childAge: 10,
      notes: "Graag extra aandacht voor foto's, opa en oma komen ook kijken.",
      basePrice: 299,
      extraKidsPrice: 0,
      extrasPrice: 200,
      totalPrice: 499,
      status: "In behandeling" as const,
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 250,
      depositPaid: false,
    },
    {
      id: "RC-1045",
      createdAt: inDays(-1),
      themeSlug: "dansfeest",
      themeName: "TikTok & Dansfeest",
      packageId: "fun",
      packageName: "Fun",
      kids: 9,
      date: inDays(16),
      time: "15:00 - 17:30",
      location: "Apeldoorn",
      locationType: "thuis" as const,
      extras: ["cupcakes"],
      parentName: "Michelle Jansen",
      email: "michelle.jansen@example.com",
      phone: "06-45678901",
      childName: "Julia",
      childAge: 9,
      notes: "",
      basePrice: 199,
      extraKidsPrice: 18,
      extrasPrice: 35,
      totalPrice: 252,
      status: "Nieuw" as const,
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 126,
      depositPaid: false,
    },
    {
      id: "RC-1046",
      createdAt: inDays(-10),
      themeSlug: "dino-feest",
      themeName: "Dino-feest",
      packageId: "mini",
      packageName: "Mini",
      kids: 5,
      date: inDays(-3),
      time: "11:00 - 13:00",
      location: "Zutphen",
      locationType: "thuis" as const,
      extras: ["goodiebags"],
      parentName: "Tom Hendriks",
      email: "tom.hendriks@example.com",
      phone: "06-56789012",
      childName: "Finn",
      childAge: 5,
      notes: "",
      basePrice: 149,
      extraKidsPrice: 0,
      extrasPrice: 35,
      totalPrice: 184,
      status: "Afgerond" as const,
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 92,
      depositPaid: true,
    },
  ];
}

async function ensureSeeded() {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM bookings`;
  if (Number(count) === 0) {
    for (const b of seedBookings()) {
      await sql`
        INSERT INTO bookings (
          id, created_at, theme_slug, theme_name, package_id, package_name, kids, date, time,
          location, location_type, extras, parent_name, email, phone, child_name, child_age, notes,
          base_price, extra_kids_price, extras_price, discount_code, discount_amount, voucher_code,
          voucher_amount, total_price, deposit_amount, deposit_paid, status
        ) VALUES (
          ${b.id}, ${b.createdAt}, ${b.themeSlug}, ${b.themeName}, ${b.packageId}, ${b.packageName},
          ${b.kids}, ${b.date}, ${b.time}, ${b.location}, ${b.locationType}, ${sql.json(b.extras)},
          ${b.parentName}, ${b.email}, ${b.phone}, ${b.childName}, ${b.childAge}, ${b.notes},
          ${b.basePrice}, ${b.extraKidsPrice}, ${b.extrasPrice}, ${b.discountCode}, ${b.discountAmount},
          ${b.voucherCode}, ${b.voucherAmount}, ${b.totalPrice}, ${b.depositAmount}, ${b.depositPaid}, ${b.status}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureSeeded();
  const rows = await sql<BookingRow[]>`SELECT * FROM bookings ORDER BY date DESC`;
  return rows.map(rowToBooking);
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  await ensureSeeded();
  const rows = await sql<BookingRow[]>`SELECT * FROM bookings WHERE id = ${id}`;
  return rows[0] ? rowToBooking(rows[0]) : undefined;
}

export async function saveBooking(booking: Booking) {
  await ensureSeeded();
  await sql`
    INSERT INTO bookings (
      id, created_at, theme_slug, theme_name, package_id, package_name, kids, date, time,
      location, location_type, extras, parent_name, email, phone, child_name, child_age, notes,
      base_price, extra_kids_price, extras_price, discount_code, discount_amount, voucher_code,
      voucher_amount, total_price, deposit_amount, deposit_paid, mollie_payment_id, customer_id,
      status, emails_sent, internal_notes, viewed_at
    ) VALUES (
      ${booking.id}, ${booking.createdAt}, ${booking.themeSlug}, ${booking.themeName}, ${booking.packageId},
      ${booking.packageName}, ${booking.kids}, ${booking.date}, ${booking.time}, ${booking.location},
      ${booking.locationType}, ${sql.json(booking.extras)}, ${booking.parentName}, ${booking.email},
      ${booking.phone}, ${booking.childName}, ${booking.childAge}, ${booking.notes}, ${booking.basePrice},
      ${booking.extraKidsPrice}, ${booking.extrasPrice}, ${booking.discountCode}, ${booking.discountAmount},
      ${booking.voucherCode}, ${booking.voucherAmount}, ${booking.totalPrice}, ${booking.depositAmount},
      ${booking.depositPaid}, ${booking.molliePaymentId}, ${booking.customerId}, ${booking.status},
      ${sql.json(booking.emailsSent)}, ${booking.internalNotes}, ${booking.viewedAt}
    )
  `;
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await ensureSeeded();
  await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
  return getBooking(id);
}

export async function setMolliePaymentId(id: string, molliePaymentId: string) {
  await ensureSeeded();
  await sql`UPDATE bookings SET mollie_payment_id = ${molliePaymentId} WHERE id = ${id}`;
  return getBooking(id);
}

export async function getBookingByMolliePaymentId(paymentId: string): Promise<Booking | undefined> {
  await ensureSeeded();
  const rows = await sql<BookingRow[]>`SELECT * FROM bookings WHERE mollie_payment_id = ${paymentId}`;
  return rows[0] ? rowToBooking(rows[0]) : undefined;
}

export async function markDepositPaid(id: string) {
  await ensureSeeded();
  const booking = await getBooking(id);
  if (!booking) return undefined;
  const nextStatus =
    booking.status === "Nieuw" || booking.status === "In behandeling" ? "Bevestigd" : booking.status;
  await sql`UPDATE bookings SET deposit_paid = true, status = ${nextStatus} WHERE id = ${id}`;
  return getBooking(id);
}

export async function linkBookingsToCustomer(email: string, customerId: string) {
  await ensureSeeded();
  await sql`
    UPDATE bookings SET customer_id = ${customerId}
    WHERE lower(email) = lower(${email}) AND customer_id IS NULL
  `;
}

export async function getBookingsForCustomer(customerId: string, email: string): Promise<Booking[]> {
  await ensureSeeded();
  const rows = await sql<BookingRow[]>`
    SELECT * FROM bookings
    WHERE customer_id = ${customerId} OR lower(email) = lower(${email})
    ORDER BY date DESC
  `;
  return rows.map(rowToBooking);
}

export async function setInternalNotes(id: string, notes: string) {
  await ensureSeeded();
  await sql`UPDATE bookings SET internal_notes = ${notes} WHERE id = ${id}`;
  return getBooking(id);
}

export async function markBookingViewed(id: string) {
  await ensureSeeded();
  const booking = await getBooking(id);
  if (!booking || booking.viewedAt) return booking;
  await sql`UPDATE bookings SET viewed_at = now() WHERE id = ${id}`;
  return getBooking(id);
}

export async function countUnviewedBookings(): Promise<number> {
  await ensureSeeded();
  const [{ count }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text FROM bookings WHERE viewed_at IS NULL AND status != 'Geannuleerd'
  `;
  return Number(count);
}

export async function recordEmailSent(id: string, type: EmailType) {
  await ensureSeeded();
  const booking = await getBooking(id);
  if (!booking) return undefined;
  if (!booking.emailsSent.includes(type)) {
    const next = [...booking.emailsSent, type];
    await sql`UPDATE bookings SET emails_sent = ${sql.json(next)} WHERE id = ${id}`;
  }
  return getBooking(id);
}
