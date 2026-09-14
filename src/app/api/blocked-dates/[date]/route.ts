import { NextRequest, NextResponse } from "next/server";
import { unblockDate } from "@/lib/blockedDates";
import { requireAdminApi } from "@/lib/adminAuth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { date } = await params;
  const removed = await unblockDate(date);
  if (!removed) {
    return NextResponse.json({ error: "Datum niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
