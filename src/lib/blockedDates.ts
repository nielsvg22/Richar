import fs from "fs";
import path from "path";

export type BlockedDate = {
  date: string;
  reason: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "blocked-dates.json");

function ensureStore(): BlockedDate[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as BlockedDate[];
  } catch {
    return [];
  }
}

function writeStore(items: BlockedDate[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function getBlockedDates(): BlockedDate[] {
  return ensureStore().sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function isDateBlocked(date: string): boolean {
  return ensureStore().some((b) => b.date === date);
}

export function getBlockedDatesInMonth(year: number, month: number): Set<string> {
  return new Set(
    ensureStore()
      .filter((b) => {
        const d = new Date(b.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((b) => b.date)
  );
}

export function blockDate(date: string, reason: string): BlockedDate {
  const items = ensureStore();
  if (items.some((b) => b.date === date)) {
    throw new Error("Deze dag is al geblokkeerd.");
  }
  const blocked: BlockedDate = { date, reason, createdAt: new Date().toISOString() };
  items.push(blocked);
  writeStore(items);
  return blocked;
}

export function unblockDate(date: string): boolean {
  const items = ensureStore();
  const next = items.filter((b) => b.date !== date);
  if (next.length === items.length) return false;
  writeStore(next);
  return true;
}
