import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-requests.json");

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Vul je naam, e-mailadres en bericht in." },
      { status: 400 }
    );
  }

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const existing = fs.existsSync(DATA_FILE)
    ? JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    : [];

  existing.push({
    id: `CR-${Date.now()}`,
    name,
    email,
    phone: phone ?? "",
    message,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

  return NextResponse.json({ success: true });
}
