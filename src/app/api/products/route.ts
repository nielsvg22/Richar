import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct, type Product } from "@/lib/products";
import { requireAdminApi } from "@/lib/adminAuth";

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await getProducts());
}

export async function POST(request: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json();
  const { name, slug, description, price, stock, published } = body;

  if (!name) {
    return NextResponse.json({ error: "Vul een naam in." }, { status: 400 });
  }

  const product: Omit<Product, "slug" | "sortOrder"> & { slug?: string } = {
    slug,
    name,
    description: description ?? "",
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    published: published !== undefined ? Boolean(published) : true,
  };

  const created = await createProduct(product);
  return NextResponse.json(created, { status: 201 });
}
