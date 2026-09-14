import { NextRequest, NextResponse } from "next/server";
import { getInventory, createInventoryItem } from "@/lib/inventory";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getInventory());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { name, quantity, unit, lowStockThreshold } = body;

  if (!name) {
    return NextResponse.json({ error: "Vul een naam in." }, { status: 400 });
  }

  const item = await createInventoryItem({
    name,
    quantity: Number(quantity) || 0,
    unit: unit || "stuks",
    lowStockThreshold: Number(lowStockThreshold) || 0,
  });

  return NextResponse.json(item, { status: 201 });
}
