import fs from "fs";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "vouchers.json");

function ensureStore(): Voucher[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Voucher[];
  } catch {
    return [];
  }
}

function writeStore(items: Voucher[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

export function getVouchers(): Voucher[] {
  return ensureStore().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getVoucher(code: string): Voucher | undefined {
  return ensureStore().find((v) => v.code.toUpperCase() === code.toUpperCase());
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

export function createVoucher(data: {
  amount: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
}): Voucher {
  const items = ensureStore();
  let code = generateCode();
  while (items.some((v) => v.code === code)) {
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
  items.push(voucher);
  writeStore(items);
  return voucher;
}

export function setVoucherMolliePaymentId(code: string, molliePaymentId: string) {
  const items = ensureStore();
  const voucher = items.find((v) => v.code === code);
  if (!voucher) return undefined;
  voucher.molliePaymentId = molliePaymentId;
  writeStore(items);
  return voucher;
}

export function getVoucherByMolliePaymentId(paymentId: string): Voucher | undefined {
  return ensureStore().find((v) => v.molliePaymentId === paymentId);
}

export function activateVoucher(code: string) {
  const items = ensureStore();
  const voucher = items.find((v) => v.code === code);
  if (!voucher) return undefined;
  if (voucher.status === "unpaid") voucher.status = "active";
  writeStore(items);
  return voucher;
}

export function redeemVoucherAmount(code: string, amount: number) {
  const items = ensureStore();
  const voucher = items.find((v) => v.code.toUpperCase() === code.toUpperCase());
  if (!voucher) return undefined;
  voucher.balance = Math.max(0, voucher.balance - amount);
  if (voucher.balance === 0) voucher.status = "redeemed";
  writeStore(items);
  return voucher;
}

export function validateVoucher(
  code: string
): { valid: boolean; voucher?: Voucher; error?: string } {
  const voucher = getVoucher(code);
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

export function createManualVoucher(data: {
  amount: number;
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
}): Voucher {
  const voucher = createVoucher(data);
  return activateVoucher(voucher.code)!;
}
