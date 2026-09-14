import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomerByEmail } from "@/lib/customers";
import { linkBookingsToCustomer } from "@/lib/bookings";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Vul je naam, e-mailadres en wachtwoord in." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Je wachtwoord moet minimaal 8 tekens lang zijn." },
      { status: 400 }
    );
  }
  if (getCustomerByEmail(email)) {
    return NextResponse.json(
      { error: "Er bestaat al een account met dit e-mailadres. Log in plaats daarvan in." },
      { status: 409 }
    );
  }

  const customer = createCustomer({ name, email, password });
  linkBookingsToCustomer(customer.email, customer.id);

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
