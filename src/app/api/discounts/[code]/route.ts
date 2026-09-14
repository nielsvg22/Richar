import { NextRequest, NextResponse } from "next/server";
import { updateDiscount, deleteDiscount } from "@/lib/discounts";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await request.json();
  const { type, value, description, active, expiresAt, usageLimit } = body;

  const updated = updateDiscount(code, {
    type,
    value: value !== undefined ? Number(value) : undefined,
    description,
    active,
    expiresAt: expiresAt === "" ? null : expiresAt,
    usageLimit: usageLimit === "" ? null : usageLimit !== undefined ? Number(usageLimit) : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Kortingscode niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const deleted = deleteDiscount(code);
  if (!deleted) {
    return NextResponse.json({ error: "Kortingscode niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
