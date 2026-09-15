import { NextRequest, NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "@/lib/products";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product niet gevonden." }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const body = await request.json();
  const { name, description, price, stock, published } = body;

  const updated = await updateProduct(slug, {
    name,
    description,
    price: price !== undefined ? Number(price) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    published: published !== undefined ? Boolean(published) : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Product niet gevonden." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { slug } = await params;
  const deleted = await deleteProduct(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Product niet gevonden." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
