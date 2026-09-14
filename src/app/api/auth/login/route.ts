import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, verifyPassword } from "@/lib/customers";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  const customer = email ? getCustomerByEmail(email) : undefined;
  if (!customer || !verifyPassword(customer, password ?? "")) {
    return NextResponse.json({ error: "E-mailadres of wachtwoord is onjuist." }, { status: 401 });
  }

  const token = createSessionToken(customer.id);
  const res = NextResponse.json({ id: customer.id, name: customer.name, email: customer.email });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
