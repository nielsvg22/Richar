import { NextRequest, NextResponse } from "next/server";
import { unblockDate } from "@/lib/blockedDates";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const removed = unblockDate(date);
  if (!removed) {
    return NextResponse.json({ error: "Datum niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
