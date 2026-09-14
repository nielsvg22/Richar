import fs from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getCustomerById, type Customer } from "./customers";

const DATA_DIR = path.join(process.cwd(), "data");
const SECRET_FILE = path.join(DATA_DIR, "session-secret.txt");

function getSecret(): string {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SECRET_FILE)) {
    fs.writeFileSync(SECRET_FILE, crypto.randomBytes(32).toString("hex"));
  }
  return fs.readFileSync(SECRET_FILE, "utf-8").trim();
}

export const SESSION_COOKIE = "rc_session";

export function createSessionToken(customerId: string): string {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify({ customerId, iat: Date.now() })).toString(
    "base64url"
  );
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const secret = getSecret();
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.customerId ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentCustomer(): Promise<Customer | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const customerId = verifySessionToken(token);
  return customerId ? getCustomerById(customerId) : undefined;
}
