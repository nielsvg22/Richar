import { NextResponse } from "next/server";
import { getContactRequests } from "@/lib/contactRequests";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getContactRequests());
}
