import { NextRequest, NextResponse } from "next/server";
import { getDiscounts, createDiscount } from "@/lib/discounts";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getDiscounts());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { code, type, value, description, active, expiresAt, usageLimit } = body;

  if (!code || !type || !value) {
    return NextResponse.json(
      { error: "Vul een code, type en waarde in." },
      { status: 400 }
    );
  }

  try {
    const discount = await createDiscount({
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
