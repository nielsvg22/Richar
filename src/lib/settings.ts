import fs from "fs";
import path from "path";

export type Settings = {
  resendApiKey: string;
  emailFrom: string;
  emailReplyTo: string;
  mollieApiKey: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "settings.json");

const defaultSettings: Settings = {
  resendApiKey: "",
  emailFrom: "Rosa & Charlotte <onboarding@resend.dev>",
  emailReplyTo: "hallo@rosaencharlotte.nl",
  mollieApiKey: "",
};

function ensureStore(): Settings {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seeded: Settings = {
      ...defaultSettings,
      resendApiKey: process.env.RESEND_API_KEY || "",
      emailFrom: process.env.EMAIL_FROM || defaultSettings.emailFrom,
      emailReplyTo: process.env.EMAIL_REPLY_TO || defaultSettings.emailReplyTo,
      mollieApiKey: process.env.MOLLIE_API_KEY || "",
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(seeded, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function getSettings(): Settings {
  return ensureStore();
}

export function updateSettings(data: Partial<Settings>): Settings {
  const current = ensureStore();
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const next = { ...current, ...cleanData };
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2));
  return next;
}

export function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 6)}${"•".repeat(Math.max(4, key.length - 10))}${key.slice(-4)}`;
}
