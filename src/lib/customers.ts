import crypto from "crypto";
import { sql, ensureSchema } from "./db";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  password_salt: string;
  created_at: Date;
};

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    createdAt: row.created_at.toISOString(),
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  await ensureSchema();
  const rows = await sql<CustomerRow[]>`SELECT * FROM customers WHERE lower(email) = lower(${email})`;
  return rows[0] ? rowToCustomer(rows[0]) : undefined;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  await ensureSchema();
  const rows = await sql<CustomerRow[]>`SELECT * FROM customers WHERE id = ${id}`;
  return rows[0] ? rowToCustomer(rows[0]) : undefined;
}

export async function updateCustomerPhone(id: string, phone: string): Promise<Customer | undefined> {
  await ensureSchema();
  await sql`UPDATE customers SET phone = ${phone} WHERE id = ${id}`;
  return getCustomerById(id);
}

export async function createCustomer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<Customer> {
  await ensureSchema();
  if (await getCustomerByEmail(data.email)) {
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
  await sql`
    INSERT INTO customers (id, name, email, phone, password_hash, password_salt, created_at)
    VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.phone}, ${customer.passwordHash}, ${customer.passwordSalt}, ${customer.createdAt})
  `;
  return customer;
}

export function verifyPassword(customer: Customer, password: string): boolean {
  const hash = hashPassword(password, customer.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(customer.passwordHash));
}

export async function updateCustomerPassword(id: string, newPassword: string): Promise<Customer | undefined> {
  await ensureSchema();
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);
  await sql`UPDATE customers SET password_hash = ${passwordHash}, password_salt = ${salt} WHERE id = ${id}`;
  return getCustomerById(id);
}
