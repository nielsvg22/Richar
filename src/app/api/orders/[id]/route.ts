import { NextRequest, NextResponse } from "next/server";
import { getOrder, markOrderFulfilled } from "@/lib/orders";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Bestelling niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  if (body.status === "fulfilled") {
    const order = await markOrderFulfilled(id);
    if (!order) {
      return NextResponse.json({ error: "Bestelling niet gevonden of nog niet betaald." }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  return NextResponse.json({ error: "Niets om bij te werken." }, { status: 400 });
}
