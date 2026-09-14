import crypto from "crypto";
import { cookies } from "next/headers";
import { sql, ensureSchema } from "./db";

export const ADMIN_SESSION_COOKIE = "rc_admin_session";

let cachedSecret: string | null = null;

async function getSecret(): Promise<string> {
  if (cachedSecret) return cachedSecret;
  await ensureSchema();
  const rows = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_session_secret'`;
  if (rows[0]) {
    cachedSecret = rows[0].value;
    return cachedSecret;
  }
  const secret = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('admin_session_secret', ${secret})
    ON CONFLICT (key) DO NOTHING
  `;
  const rows2 = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_session_secret'`;
  cachedSecret = rows2[0].value;
  return cachedSecret;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function ensureAdminPassword(): Promise<{ hash: string; salt: string }> {
  await ensureSchema();
  const hashRow = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_password_hash'`;
  const saltRow = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_password_salt'`;

  if (hashRow[0] && saltRow[0]) {
    return { hash: hashRow[0].value, salt: saltRow[0].value };
  }

  // First run: seed from ADMIN_PASSWORD env var if set, otherwise a random
  // password that only exists in the server logs — the admin should set a
  // real one immediately via ADMIN_PASSWORD or the settings page.
  const salt = crypto.randomBytes(16).toString("hex");
  const initialPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString("hex");
  const hash = hashPassword(initialPassword, salt);

  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      `[admin-auth] Geen ADMIN_PASSWORD env var gezet. Tijdelijk wachtwoord gegenereerd: ${initialPassword} — stel dit nu in via ADMIN_PASSWORD of wijzig het direct na inloggen.`
    );
  }

  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('admin_password_hash', ${hash})
    ON CONFLICT (key) DO NOTHING
  `;
  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('admin_password_salt', ${salt})
    ON CONFLICT (key) DO NOTHING
  `;

  const finalHash = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_password_hash'`;
  const finalSalt = await sql<{ value: string }[]>`SELECT value FROM app_secrets WHERE key = 'admin_password_salt'`;
  return { hash: finalHash[0].value, salt: finalSalt[0].value };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const { hash, salt } = await ensureAdminPassword();
  const attempt = hashPassword(password, salt);
  const attemptBuf = Buffer.from(attempt);
  const hashBuf = Buffer.from(hash);
  if (attemptBuf.length !== hashBuf.length) return false;
  return crypto.timingSafeEqual(attemptBuf, hashBuf);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  await ensureSchema();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(newPassword, salt);
  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('admin_password_hash', ${hash})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
  await sql`
    INSERT INTO app_secrets (key, value) VALUES ('admin_password_salt', ${salt})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = await getSecret();
  const payload = Buffer.from(JSON.stringify({ admin: true, iat: Date.now() })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const secret = await getSecret();
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.admin === true;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

/**
 * Guard for admin-only API routes. Returns null when the request carries a
 * valid admin session; otherwise a 401 JSON response the route should return
 * immediately.
 */
export async function requireAdminApi(): Promise<Response | null> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return Response.json({ error: "Niet ingelogd." }, { status: 401 });
  }
  return null;
}
