import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, verifyAdminPassword, updateAdminPassword } from "@/lib/adminAuth";

export async function PATCH(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Vul het huidige en nieuwe wachtwoord in." }, { status: 400 });
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Het nieuwe wachtwoord moet minimaal 8 tekens lang zijn." },
      { status: 400 }
    );
  }
  if (!(await verifyAdminPassword(currentPassword))) {
    return NextResponse.json({ error: "Huidig wachtwoord is onjuist." }, { status: 400 });
  }

  await updateAdminPassword(newPassword);
  return NextResponse.json({ success: true });
}
