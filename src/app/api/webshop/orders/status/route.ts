import { NextRequest, NextResponse } from "next/server";
import { getOrder, markOrderPaid } from "@/lib/orders";
import { decrementStock } from "@/lib/products";
import { getMolliePayment } from "@/lib/mollie";
import { sendOrderConfirmation } from "@/lib/email";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order");
  if (!orderId) {
    return NextResponse.json({ error: "order ontbreekt." }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Bestelling niet gevonden." }, { status: 404 });
  }

  if (order.status !== "unpaid") {
    return NextResponse.json({ paid: true, status: order.status });
  }

  if (!order.molliePaymentId) {
    return NextResponse.json({ paid: false, status: "no_payment" });
  }

  try {
    const payment = await getMolliePayment(order.molliePaymentId);
    if (payment.status === "paid") {
      const paidOrder = await markOrderPaid(order.id);
      if (paidOrder) {
        for (const item of paidOrder.items) {
          await decrementStock(item.slug, item.quantity);
        }
        await sendOrderConfirmation(paidOrder);
      }
      return NextResponse.json({ paid: true, status: "paid" });
    }
    return NextResponse.json({ paid: false, status: payment.status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kan betaalstatus niet ophalen." },
      { status: 502 }
    );
  }
}
