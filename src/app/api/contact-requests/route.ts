import { NextResponse } from "next/server";
import { getContactRequests } from "@/lib/contactRequests";

export async function GET() {
  return NextResponse.json(await getContactRequests());
}
