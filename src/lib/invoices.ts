import fs from "fs";
import path from "path";
import { getBookings, getBooking, type Booking } from "./bookings";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "invoice-numbers.json");

type NumberMap = Record<string, string>;

function ensureStore(): NumberMap {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as NumberMap;
  } catch {
    return {};
  }
}

function writeStore(map: NumberMap) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(map, null, 2));
}

function getOrCreateInvoiceNumber(booking: Booking): string {
  const map = ensureStore();
  if (map[booking.id]) return map[booking.id];

  const year = new Date(booking.createdAt).getFullYear();
  const existingForYear = Object.values(map).filter((n) => n.startsWith(`${year}-`));
  const nextSeq = existingForYear.length + 1;
  const number = `${year}-${String(nextSeq).padStart(4, "0")}`;

  map[booking.id] = number;
  writeStore(map);
  return number;
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

export function getInvoiceForBooking(bookingId: string): Invoice | undefined {
  const booking = getBooking(bookingId);
  if (!booking) return undefined;
  return {
    number: getOrCreateInvoiceNumber(booking),
    booking,
    status: getInvoiceStatus(booking),
  };
}

export function getInvoices(): Invoice[] {
  return getBookings()
    .filter((b) => b.status !== "Geannuleerd")
    .map((booking) => ({
      number: getOrCreateInvoiceNumber(booking),
      booking,
      status: getInvoiceStatus(booking),
    }))
    .sort((a, b) => (a.number < b.number ? 1 : -1));
}
