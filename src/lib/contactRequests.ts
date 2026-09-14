import fs from "fs";
import path from "path";

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "contact" | "account";
  createdAt: string;
  viewedAt: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-requests.json");

function ensureStore(): ContactRequest[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as ContactRequest[];
  } catch {
    return [];
  }
}

function writeStore(items: ContactRequest[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function getContactRequests(): ContactRequest[] {
  return ensureStore().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getContactRequest(id: string): ContactRequest | undefined {
  return ensureStore().find((c) => c.id === id);
}

export function createContactRequest(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "contact" | "account";
}): ContactRequest {
  const items = ensureStore();
  const request: ContactRequest = {
    id: `CR-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    viewedAt: null,
  };
  items.push(request);
  writeStore(items);
  return request;
}

export function markContactRequestViewed(id: string) {
  const items = ensureStore();
  const item = items.find((c) => c.id === id);
  if (!item || item.viewedAt) return item;
  item.viewedAt = new Date().toISOString();
  writeStore(items);
  return item;
}

export function countUnviewedContactRequests(): number {
  return ensureStore().filter((c) => !c.viewedAt).length;
}
