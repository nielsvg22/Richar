import { NextRequest, NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/session";
import { updateCustomerPhone } from "@/lib/customers";

export async function PATCH(request: NextRequest) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Je bent niet ingelogd." }, { status: 401 });
  }

  const body = await request.json();
  const { phone } = body;

  const updated = updateCustomerPhone(customer.id, typeof phone === "string" ? phone : "");
  return NextResponse.json({ id: updated?.id, phone: updated?.phone ?? "" });
}
