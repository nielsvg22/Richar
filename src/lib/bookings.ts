import fs from "fs";
import path from "path";

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
};

export type EmailType = "confirmation" | "reminder" | "review";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

function ensureStore(): Booking[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedBookings(), null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export function getBookings(): Booking[] {
  return ensureStore().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBooking(id: string): Booking | undefined {
  return ensureStore().find((b) => b.id === id);
}

export function saveBooking(booking: Booking) {
  const bookings = ensureStore();
  bookings.push(booking);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const bookings = ensureStore();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return undefined;
  booking.status = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return booking;
}

export function recordEmailSent(id: string, type: EmailType) {
  const bookings = ensureStore();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return undefined;
  if (!booking.emailsSent) booking.emailsSent = [];
  if (!booking.emailsSent.includes(type)) booking.emailsSent.push(type);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return booking;
}

function seedBookings(): Booking[] {
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
      locationType: "thuis",
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
      status: "Bevestigd",
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 0,
      depositPaid: false,
      molliePaymentId: null,
      customerId: null,
      emailsSent: [],
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
      locationType: "thuis",
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
      status: "Betaald",
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 0,
      depositPaid: false,
      molliePaymentId: null,
      customerId: null,
      emailsSent: [],
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
      locationType: "locatie",
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
      status: "In behandeling",
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 0,
      depositPaid: false,
      molliePaymentId: null,
      customerId: null,
      emailsSent: [],
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
      locationType: "thuis",
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
      status: "Nieuw",
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 0,
      depositPaid: false,
      molliePaymentId: null,
      customerId: null,
      emailsSent: [],
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
      locationType: "thuis",
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
      status: "Afgerond",
      discountCode: null,
      discountAmount: 0,
      voucherCode: null,
      voucherAmount: 0,
      depositAmount: 0,
      depositPaid: false,
      molliePaymentId: null,
      customerId: null,
      emailsSent: [],
    },
  ];
}
