import { NextRequest, NextResponse } from "next/server";
import { getInventory, createInventoryItem } from "@/lib/inventory";

export async function GET() {
  return NextResponse.json(getInventory());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, quantity, unit, lowStockThreshold } = body;

  if (!name) {
    return NextResponse.json({ error: "Vul een naam in." }, { status: 400 });
  }

  const item = createInventoryItem({
    name,
    quantity: Number(quantity) || 0,
    unit: unit || "stuks",
    lowStockThreshold: Number(lowStockThreshold) || 0,
  });

  return NextResponse.json(item, { status: 201 });
}
