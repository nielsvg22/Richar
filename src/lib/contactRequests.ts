import { sql, ensureSchema } from "./db";

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

type ContactRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  created_at: Date;
  viewed_at: Date | null;
};

function rowToRequest(row: ContactRequestRow): ContactRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    source: row.source as ContactRequest["source"],
    createdAt: row.created_at.toISOString(),
    viewedAt: row.viewed_at ? row.viewed_at.toISOString() : null,
  };
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  await ensureSchema();
  const rows = await sql<ContactRequestRow[]>`SELECT * FROM contact_requests ORDER BY created_at DESC`;
  return rows.map(rowToRequest);
}

export async function getContactRequest(id: string): Promise<ContactRequest | undefined> {
  await ensureSchema();
  const rows = await sql<ContactRequestRow[]>`SELECT * FROM contact_requests WHERE id = ${id}`;
  return rows[0] ? rowToRequest(rows[0]) : undefined;
}

export async function createContactRequest(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: "contact" | "account";
}): Promise<ContactRequest> {
  await ensureSchema();
  const request: ContactRequest = {
    id: `CR-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    viewedAt: null,
  };
  await sql`
    INSERT INTO contact_requests (id, name, email, phone, message, source, created_at)
    VALUES (${request.id}, ${request.name}, ${request.email}, ${request.phone}, ${request.message}, ${request.source}, ${request.createdAt})
  `;
  return request;
}

export async function markContactRequestViewed(id: string) {
  await ensureSchema();
  await sql`UPDATE contact_requests SET viewed_at = now() WHERE id = ${id} AND viewed_at IS NULL`;
  return getContactRequest(id);
}

export async function countUnviewedContactRequests(): Promise<number> {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text FROM contact_requests WHERE viewed_at IS NULL
  `;
  return Number(count);
}
