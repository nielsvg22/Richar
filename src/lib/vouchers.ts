import { sql, ensureSchema } from "./db";

export type VoucherStatus = "unpaid" | "active" | "redeemed" | "expired";

export type Voucher = {
  code: string;
  amount: number;
  balance: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
  status: VoucherStatus;
  molliePaymentId: string | null;
  createdAt: string;
};

type VoucherRow = {
  code: string;
  amount: number;
  balance: number;
  purchaser_name: string;
  purchaser_email: string;
  recipient_name: string;
  message: string;
  status: string;
  mollie_payment_id: string | null;
  created_at: Date;
};

function rowToVoucher(row: VoucherRow): Voucher {
  return {
    code: row.code,
    amount: row.amount,
    balance: row.balance,
    purchaserName: row.purchaser_name,
    purchaserEmail: row.purchaser_email,
    recipientName: row.recipient_name,
    message: row.message,
    status: row.status as VoucherStatus,
    molliePaymentId: row.mollie_payment_id,
    createdAt: row.created_at.toISOString(),
  };
}

export async function getVouchers(): Promise<Voucher[]> {
  await ensureSchema();
  const rows = await sql<VoucherRow[]>`SELECT * FROM vouchers ORDER BY created_at DESC`;
  return rows.map(rowToVoucher);
}

export async function getVoucher(code: string): Promise<Voucher | undefined> {
  await ensureSchema();
  const rows = await sql<VoucherRow[]>`SELECT * FROM vouchers WHERE upper(code) = upper(${code})`;
  return rows[0] ? rowToVoucher(rows[0]) : undefined;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "RC-";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createVoucher(data: {
  amount: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
}): Promise<Voucher> {
  await ensureSchema();
  let code = generateCode();
  while (await getVoucher(code)) {
    code = generateCode();
  }
  const voucher: Voucher = {
    code,
    amount: data.amount,
    balance: data.amount,
    purchaserName: data.purchaserName,
    purchaserEmail: data.purchaserEmail,
    recipientName: data.recipientName,
    message: data.message,
    status: "unpaid",
    molliePaymentId: null,
    createdAt: new Date().toISOString(),
  };
  await sql`
    INSERT INTO vouchers (code, amount, balance, purchaser_name, purchaser_email, recipient_name, message, status, mollie_payment_id, created_at)
    VALUES (${voucher.code}, ${voucher.amount}, ${voucher.balance}, ${voucher.purchaserName}, ${voucher.purchaserEmail}, ${voucher.recipientName}, ${voucher.message}, ${voucher.status}, ${voucher.molliePaymentId}, ${voucher.createdAt})
  `;
  return voucher;
}

export async function setVoucherMolliePaymentId(code: string, molliePaymentId: string) {
  await ensureSchema();
  await sql`UPDATE vouchers SET mollie_payment_id = ${molliePaymentId} WHERE code = ${code}`;
  return getVoucher(code);
}

export async function getVoucherByMolliePaymentId(paymentId: string): Promise<Voucher | undefined> {
  await ensureSchema();
  const rows = await sql<VoucherRow[]>`SELECT * FROM vouchers WHERE mollie_payment_id = ${paymentId}`;
  return rows[0] ? rowToVoucher(rows[0]) : undefined;
}

export async function activateVoucher(code: string) {
  await ensureSchema();
  await sql`UPDATE vouchers SET status = 'active' WHERE code = ${code} AND status = 'unpaid'`;
  return getVoucher(code);
}

export async function redeemVoucherAmount(code: string, amount: number) {
  await ensureSchema();
  const voucher = await getVoucher(code);
  if (!voucher) return undefined;
  const newBalance = Math.max(0, voucher.balance - amount);
  const newStatus = newBalance === 0 ? "redeemed" : voucher.status;
  await sql`UPDATE vouchers SET balance = ${newBalance}, status = ${newStatus} WHERE upper(code) = upper(${code})`;
  return getVoucher(code);
}

export async function validateVoucher(
  code: string
): Promise<{ valid: boolean; voucher?: Voucher; error?: string }> {
  const voucher = await getVoucher(code);
  if (!voucher) return { valid: false, error: "Deze cadeaubon bestaat niet." };
  if (voucher.status === "unpaid") {
    return { valid: false, error: "Deze cadeaubon is nog niet betaald." };
  }
  if (voucher.status === "expired") {
    return { valid: false, error: "Deze cadeaubon is verlopen." };
  }
  if (voucher.balance <= 0) {
    return { valid: false, error: "Het tegoed van deze cadeaubon is al gebruikt." };
  }
  return { valid: true, voucher };
}

export async function createManualVoucher(data: {
  amount: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
}): Promise<Voucher> {
  const voucher = await createVoucher(data);
  return (await activateVoucher(voucher.code))!;
}
