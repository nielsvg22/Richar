import { sql, ensureSchema } from "./db";
import { getBooking, getBookings, type Booking } from "./bookings";

async function getOrCreateInvoiceNumber(booking: Booking): Promise<string> {
  await ensureSchema();
  const existing = await sql<{ number: string }[]>`
    SELECT number FROM invoice_numbers WHERE booking_id = ${booking.id}
  `;
  if (existing[0]) return existing[0].number;

  const year = new Date(booking.createdAt).getFullYear();
  const [{ count }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text FROM invoice_numbers WHERE number LIKE ${year + "-%"}
  `;
  const nextSeq = Number(count) + 1;
  const number = `${year}-${String(nextSeq).padStart(4, "0")}`;

  await sql`
    INSERT INTO invoice_numbers (booking_id, number) VALUES (${booking.id}, ${number})
    ON CONFLICT (booking_id) DO NOTHING
  `;
  const final = await sql<{ number: string }[]>`
    SELECT number FROM invoice_numbers WHERE booking_id = ${booking.id}
  `;
  return final[0].number;
}

export type InvoiceStatus = "open" | "aanbetaald" | "betaald";

export type Invoice = {
  number: string;
  booking: Booking;
  status: InvoiceStatus;
};

function getInvoiceStatus(booking: Booking): InvoiceStatus {
  if (booking.status === "Betaald" || booking.status === "Afgerond") return "betaald";
  if (booking.totalPrice === 0 || booking.depositPaid) return "aanbetaald";
  return "open";
}

export async function getInvoiceForBooking(bookingId: string): Promise<Invoice | undefined> {
  const booking = await getBooking(bookingId);
  if (!booking) return undefined;
  return {
    number: await getOrCreateInvoiceNumber(booking),
    booking,
    status: getInvoiceStatus(booking),
  };
}

export async function getInvoices(): Promise<Invoice[]> {
  const bookings = (await getBookings()).filter((b) => b.status !== "Geannuleerd");
  // Sequential on purpose: concurrent calls could compute the same next invoice
  // number before either has inserted its row, causing a duplicate-key error.
  const invoices: Invoice[] = [];
  for (const booking of bookings) {
    invoices.push({
      number: await getOrCreateInvoiceNumber(booking),
      booking,
      status: getInvoiceStatus(booking),
    });
  }
  return invoices.sort((a, b) => (a.number < b.number ? 1 : -1));
}
