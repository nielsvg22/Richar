import { NextRequest, NextResponse } from "next/server";
import { validateVoucher } from "@/lib/vouchers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json({ valid: false, error: "Vul een cadeaubon-code in." }, { status: 400 });
  }

  const result = validateVoucher(code);
  if (!result.valid) {
    return NextResponse.json(result);
  }

  return NextResponse.json({
    valid: true,
    code: result.voucher!.code,
    balance: result.voucher!.balance,
  });
}
