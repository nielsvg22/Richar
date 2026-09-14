import { NextRequest, NextResponse } from "next/server";
import { getBlockedDates, blockDate } from "@/lib/blockedDates";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getBlockedDates());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { date, reason } = body;

  if (!date) {
    return NextResponse.json({ error: "Vul een datum in." }, { status: 400 });
  }

  try {
    const blocked = await blockDate(date, reason || "");
    return NextResponse.json(blocked, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis." },
      { status: 400 }
    );
  }
}
