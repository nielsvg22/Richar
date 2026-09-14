import { NextRequest, NextResponse } from "next/server";
import { updateInventoryItem, deleteInventoryItem } from "@/lib/inventory";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, quantity, unit, lowStockThreshold } = body;

  const item = await updateInventoryItem(id, {
    name,
    quantity: quantity !== undefined ? Number(quantity) : undefined,
    unit,
    lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined,
  });

  if (!item) {
    return NextResponse.json({ error: "Item niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteInventoryItem(id);
  if (!deleted) {
    return NextResponse.json({ error: "Item niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
