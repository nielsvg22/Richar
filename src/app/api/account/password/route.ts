import { NextRequest, NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/session";
import { verifyPassword, updateCustomerPassword } from "@/lib/customers";

export async function PATCH(request: NextRequest) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Je bent niet ingelogd." }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Vul je huidige en nieuwe wachtwoord in." },
      { status: 400 }
    );
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Je nieuwe wachtwoord moet minimaal 8 tekens lang zijn." },
      { status: 400 }
    );
  }

  if (!verifyPassword(customer, currentPassword)) {
    return NextResponse.json({ error: "Huidig wachtwoord is onjuist." }, { status: 400 });
  }

  updateCustomerPassword(customer.id, newPassword);
  return NextResponse.json({ success: true });
}
