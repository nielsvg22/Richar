import { NextRequest, NextResponse } from "next/server";
import { getBlockedDates, blockDate } from "@/lib/blockedDates";

export async function GET() {
  return NextResponse.json(await getBlockedDates());
}

export async function POST(request: NextRequest) {
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
