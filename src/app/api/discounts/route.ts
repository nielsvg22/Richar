import { NextRequest, NextResponse } from "next/server";
import { getDiscounts, createDiscount } from "@/lib/discounts";

export async function GET() {
  return NextResponse.json(getDiscounts());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, type, value, description, active, expiresAt, usageLimit } = body;

  if (!code || !type || !value) {
    return NextResponse.json(
      { error: "Vul een code, type en waarde in." },
      { status: 400 }
    );
  }

  try {
    const discount = createDiscount({
      code,
      type,
      value: Number(value),
      description: description || "",
      active: active ?? true,
      expiresAt: expiresAt || null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    });
    return NextResponse.json(discount, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis." },
      { status: 400 }
    );
  }
}
