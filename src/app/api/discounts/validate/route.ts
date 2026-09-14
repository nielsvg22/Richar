import { NextRequest, NextResponse } from "next/server";
import { validateDiscount } from "@/lib/discounts";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, subtotal } = body;

  if (!code) {
    return NextResponse.json({ valid: false, error: "Vul een kortingscode in." }, { status: 400 });
  }

  const result = await validateDiscount(code, Number(subtotal) || 0);
  return NextResponse.json(result);
}
