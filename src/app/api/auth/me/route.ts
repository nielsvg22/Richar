import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { getCustomerById } from "@/lib/customers";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const customerId = verifySessionToken(token);
  const customer = customerId ? getCustomerById(customerId) : undefined;

  if (!customer) {
    return NextResponse.json({ customer: null });
  }

  return NextResponse.json({
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
}
