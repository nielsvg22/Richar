import { NextResponse } from "next/server";
import { getOrders } from "@/lib/orders";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getOrders());
}
