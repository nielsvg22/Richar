import { sql, ensureSchema } from "./db";

export type Settings = {
  resendApiKey: string;
  emailFrom: string;
  emailReplyTo: string;
  mollieApiKey: string;
};

type SettingsRow = {
  resend_api_key: string;
  email_from: string;
  email_reply_to: string;
  mollie_api_key: string;
};

function rowToSettings(row: SettingsRow): Settings {
  return {
    resendApiKey: row.resend_api_key,
    emailFrom: row.email_from,
    emailReplyTo: row.email_reply_to,
    mollieApiKey: row.mollie_api_key,
  };
}

async function ensureSeeded(): Promise<Settings> {
  await ensureSchema();
  const rows = await sql<SettingsRow[]>`SELECT * FROM settings WHERE id = 1`;
  if (rows[0]) return rowToSettings(rows[0]);

  const seeded: Settings = {
    resendApiKey: process.env.RESEND_API_KEY || "",
    emailFrom: process.env.EMAIL_FROM || "Rosa & Charlotte <onboarding@resend.dev>",
    emailReplyTo: process.env.EMAIL_REPLY_TO || "hallo@rosaencharlotte.nl",
    mollieApiKey: process.env.MOLLIE_API_KEY || "",
  };
  await sql`
    INSERT INTO settings (id, resend_api_key, email_from, email_reply_to, mollie_api_key)
    VALUES (1, ${seeded.resendApiKey}, ${seeded.emailFrom}, ${seeded.emailReplyTo}, ${seeded.mollieApiKey})
    ON CONFLICT (id) DO NOTHING
  `;
  return seeded;
}

export async function getSettings(): Promise<Settings> {
  return ensureSeeded();
}

export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const current = await ensureSeeded();
  const next = { ...current, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  await sql`
    UPDATE settings SET
      resend_api_key = ${next.resendApiKey},
      email_from = ${next.emailFrom},
      email_reply_to = ${next.emailReplyTo},
      mollie_api_key = ${next.mollieApiKey}
    WHERE id = 1
  `;
  return next;
}

export function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 6)}${"•".repeat(Math.max(4, key.length - 10))}${key.slice(-4)}`;
}
