import fs from "fs";
import path from "path";
import crypto from "crypto";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "customers.json");

function ensureStore(): Customer[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Customer[];
  } catch {
    return [];
  }
}

function writeStore(items: Customer[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return ensureStore().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getCustomerById(id: string): Customer | undefined {
  return ensureStore().find((c) => c.id === id);
}

export function updateCustomerPhone(id: string, phone: string): Customer | undefined {
  const items = ensureStore();
  const customer = items.find((c) => c.id === id);
  if (!customer) return undefined;
  customer.phone = phone;
  writeStore(items);
  return customer;
}

export function createCustomer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Customer {
  const items = ensureStore();
  if (items.some((c) => c.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("Er bestaat al een account met dit e-mailadres.");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const customer: Customer = {
    id: `CUST-${crypto.randomBytes(4).toString("hex")}`,
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone ?? "",
    passwordHash: hashPassword(data.password, salt),
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };
  items.push(customer);
  writeStore(items);
  return customer;
}

export function verifyPassword(customer: Customer, password: string): boolean {
  const hash = hashPassword(password, customer.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(customer.passwordHash));
}
