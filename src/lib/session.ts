import crypto from "crypto";
import { cookies } from "next/headers";
import { getCustomerById, type Customer } from "./customers";
import { sql, ensureSchema } from "./db";

let cachedSecret: string | null = null;

async function getSecret(): Promise<string> {
  if (cachedSecret) return cachedSecret;
  await ensureSchema();
  const rows = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'session_secret'`;
  if (rows[0]) {
    cachedSecret = rows[0].value;
    return cachedSecret;
  }
  const secret = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('session_secret', ${secret})
    ON CONFLICT (key) DO NOTHING
  `;
  const rows2 = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'session_secret'`;
  cachedSecret = rows2[0].value;
  return cachedSecret;
}

export const SESSION_COOKIE = "rc_session";

export async function createSessionToken(customerId: string): Promise<string> {
  const secret = await getSecret();
  const payload = Buffer.from(JSON.stringify({ customerId, iat: Date.now() })).toString(
    "base64url"
  );
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const secret = await getSecret();
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
  const customerId = await verifySessionToken(token);
  return customerId ? getCustomerById(customerId) : undefined;
}
