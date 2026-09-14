import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, createAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (typeof password !== "string" || !(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: "Wachtwoord is onjuist." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
