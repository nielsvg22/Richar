import { NextRequest, NextResponse } from "next/server";
import { getPublishedProduct } from "@/lib/products";
import { createOrder, setOrderMolliePaymentId } from "@/lib/orders";
import { createMolliePayment, isMollieConfigured } from "@/lib/mollie";
import type { CartItem } from "@/lib/product-constants";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, customerName, email, phone } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Je winkelwagen is leeg." }, { status: 400 });
  }
  if (!customerName || !email) {
    return NextResponse.json({ error: "Vul je naam en e-mailadres in." }, { status: 400 });
  }

  // Never trust client-supplied prices or stock — re-validate every line
  // against the current product data.
  const validatedItems: CartItem[] = [];
  for (const item of items) {
    const product = await getPublishedProduct(String(item.slug));
    if (!product) {
      return NextResponse.json({ error: `Product niet gevonden: ${item.slug}` }, { status: 400 });
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (quantity > product.stock) {
      return NextResponse.json(
        { error: `Niet genoeg voorraad voor "${product.name}" (nog ${product.stock} beschikbaar).` },
        { status: 400 }
      );
    }
    validatedItems.push({ slug: product.slug, name: product.name, price: product.price, quantity });
  }

  const totalPrice = validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!(await isMollieConfigured())) {
    return NextResponse.json(
      { error: "Online betalen is nog niet ingesteld. Neem contact met ons op om te bestellen." },
      { status: 503 }
    );
  }

  const order = await createOrder({
    items: validatedItems,
    customerName,
    email,
    phone: phone ?? "",
    totalPrice,
  });

  const origin = request.nextUrl.origin;

  try {
    const payment = await createMolliePayment({
      amount: totalPrice,
      description: `Bestelling Rosa & Charlotte — ${order.id}`,
      redirectUrl: `${origin}/webshop/bedankt?order=${order.id}`,
      webhookUrl: `${origin}/api/payments/webhook`,
      metadata: { type: "order", id: order.id },
    });

    await setOrderMolliePaymentId(order.id, payment.id);

    return NextResponse.json({ checkoutUrl: payment._links.checkout?.href });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Er ging iets mis." },
      { status: 502 }
    );
  }
}
