import { sql, ensureSchema } from "./db";

export type BlockedDate = {
  date: string;
  reason: string;
  createdAt: string;
};

type BlockedDateRow = {
  date: string;
  reason: string;
  created_at: Date;
};

function rowToBlockedDate(row: BlockedDateRow): BlockedDate {
  return { date: row.date, reason: row.reason, createdAt: row.created_at.toISOString() };
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  await ensureSchema();
  const rows = await sql<BlockedDateRow[]>`SELECT * FROM blocked_dates ORDER BY date ASC`;
  return rows.map(rowToBlockedDate);
}

export async function isDateBlocked(date: string): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`SELECT 1 FROM blocked_dates WHERE date = ${date}`;
  return rows.length > 0;
}

export async function getBlockedDatesInMonth(year: number, month: number): Promise<Set<string>> {
  const all = await getBlockedDates();
  return new Set(
    all
      .filter((b) => {
        const d = new Date(b.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((b) => b.date)
  );
}

export async function blockDate(date: string, reason: string): Promise<BlockedDate> {
  await ensureSchema();
  const existing = await sql`SELECT 1 FROM blocked_dates WHERE date = ${date}`;
  if (existing.length > 0) {
    throw new Error("Deze dag is al geblokkeerd.");
  }
  const blocked: BlockedDate = { date, reason, createdAt: new Date().toISOString() };
  await sql`INSERT INTO blocked_dates (date, reason, created_at) VALUES (${date}, ${reason}, ${blocked.createdAt})`;
  return blocked;
}

export async function unblockDate(date: string): Promise<boolean> {
  await ensureSchema();
  const result = await sql`DELETE FROM blocked_dates WHERE date = ${date}`;
  return result.count > 0;
}
