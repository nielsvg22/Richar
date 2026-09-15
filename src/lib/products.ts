import { sql, ensureSchema, memoizeOnce } from "./db";
import { slugify } from "./themes";
import type { Product } from "./product-constants";

export type { Product } from "./product-constants";

const placeholderProducts: Omit<Product, "sortOrder">[] = [
  {
    slug: "extra-goodiebag",
    name: "Extra goodiebag",
    description: "Een extra goodiebag vol kleine cadeautjes en traktaties, los bij te bestellen naast je feestje.",
    price: 6,
    stock: 40,
    published: true,
  },
  {
    slug: "ballonnenboog-los",
    name: "Ballonnenboog (thuis ophangen)",
    description: "Een kant-en-klare ballonnenboog om zelf op te hangen, in de kleuren van jullie feestje.",
    price: 35,
    stock: 10,
    published: true,
  },
  {
    slug: "unicornhoorn-knutselpakket",
    name: "Unicornhoorn knutselpakket",
    description: "Alles om thuis zelf een glitterende unicornhoorn te knutselen, voor als je niet genoeg kunt krijgen.",
    price: 12,
    stock: 25,
    published: true,
  },
  {
    slug: "feestfoto-fotolijst",
    name: "Feestfoto in fotolijst",
    description: "Een blijvende herinnering: een foto van het feestje in een vrolijke fotolijst.",
    price: 15,
    stock: 20,
    published: true,
  },
];

type ProductRow = {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  published: boolean;
  sort_order: number;
};

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

const ensureSeeded = memoizeOnce("products", async () => {
  await ensureSchema();
  const [{ count }] = await sql<{ count: string }[]>`SELECT COUNT(*)::text FROM products`;
  if (Number(count) === 0) {
    await Promise.all(
      placeholderProducts.map(
        (p, i) => sql`
          INSERT INTO products (slug, name, description, price, stock, published, sort_order)
          VALUES (${p.slug}, ${p.name}, ${p.description}, ${p.price}, ${p.stock}, ${p.published}, ${i})
          ON CONFLICT (slug) DO NOTHING
        `
      )
    );
  }
});

export async function getProducts(): Promise<Product[]> {
  await ensureSeeded();
  const rows = await sql<ProductRow[]>`SELECT * FROM products ORDER BY sort_order ASC`;
  return rows.map(rowToProduct);
}

export async function getPublishedProducts(): Promise<Product[]> {
  await ensureSeeded();
  const rows = await sql<ProductRow[]>`
    SELECT * FROM products WHERE published = true ORDER BY sort_order ASC
  `;
  return rows.map(rowToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  await ensureSeeded();
  const rows = await sql<ProductRow[]>`SELECT * FROM products WHERE slug = ${slug}`;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function getPublishedProduct(slug: string): Promise<Product | undefined> {
  const product = await getProduct(slug);
  return product?.published ? product : undefined;
}

export async function createProduct(
  data: Omit<Product, "slug" | "sortOrder"> & { slug?: string }
): Promise<Product> {
  await ensureSeeded();
  const baseSlug = slugify(data.slug || data.name);
  let slug = baseSlug;
  let counter = 2;
  while ((await getProduct(slug)) !== undefined) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  const [{ max }] = await sql<{ max: number | null }[]>`SELECT MAX(sort_order) as max FROM products`;
  const product: Product = { ...data, slug, sortOrder: (max ?? -1) + 1 };
  await sql`
    INSERT INTO products (slug, name, description, price, stock, published, sort_order)
    VALUES (${product.slug}, ${product.name}, ${product.description}, ${product.price}, ${product.stock}, ${product.published}, ${product.sortOrder})
  `;
  return product;
}

export async function updateProduct(slug: string, data: Partial<Product>): Promise<Product | undefined> {
  await ensureSeeded();
  const existing = await getProduct(slug);
  if (!existing) return undefined;
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const next: Product = { ...existing, ...cleanData, slug: existing.slug };
  await sql`
    UPDATE products SET
      name = ${next.name},
      description = ${next.description},
      price = ${next.price},
      stock = ${next.stock},
      published = ${next.published},
      updated_at = now()
    WHERE slug = ${slug}
  `;
  return next;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  await ensureSeeded();
  const result = await sql`DELETE FROM products WHERE slug = ${slug}`;
  return result.count > 0;
}

export async function decrementStock(slug: string, quantity: number): Promise<void> {
  await ensureSchema();
  await sql`UPDATE products SET stock = GREATEST(0, stock - ${quantity}) WHERE slug = ${slug}`;
}
