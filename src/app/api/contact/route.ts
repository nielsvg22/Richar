import { NextRequest, NextResponse } from "next/server";
import { createContactRequest } from "@/lib/contactRequests";
import { sendContactAutoReply, sendInternalContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, message, source } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Vul je naam, e-mailadres en bericht in." },
      { status: 400 }
    );
  }

  const contactRequest = await createContactRequest({
    name,
    email,
    phone: phone ?? "",
    message,
    source: source === "account" ? "account" : "contact",
  });

  await sendContactAutoReply(name, email);
  await sendInternalContactNotification(contactRequest, request.nextUrl.origin);

  return NextResponse.json({ success: true });
}
