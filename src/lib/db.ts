import postgres from "postgres";

declare global {
  var __richarSql: ReturnType<typeof postgres> | undefined;
  var __richarSchemaReady: Promise<void> | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL ontbreekt. Zet deze environment variable op een Postgres-connectiestring (bv. van Vercel Postgres, Neon of Supabase)."
    );
  }
  return postgres(connectionString, {
    ssl: connectionString.includes("localhost") ? false : "require",
  });
}

export const sql = globalThis.__richarSql ?? (globalThis.__richarSql = createClient());

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS themes (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT NOT NULL,
      age_range TEXT NOT NULL,
      vanaf INTEGER NOT NULL,
      gradient TEXT NOT NULL,
      activities JSONB NOT NULL DEFAULT '[]',
      includes JSONB NOT NULL DEFAULT '[]',
      featured BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS checklist JSONB NOT NULL DEFAULT '[]'`;

  await sql`
    CREATE TABLE IF NOT EXISTS theme_images (
      id TEXT PRIMARY KEY,
      theme_slug TEXT NOT NULL,
      content_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS theme_images_theme_slug_idx ON theme_images (theme_slug, sort_order)`;

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      theme_slug TEXT NOT NULL,
      theme_name TEXT NOT NULL,
      package_id TEXT NOT NULL,
      package_name TEXT NOT NULL,
      kids INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      location_type TEXT NOT NULL DEFAULT 'thuis',
      extras JSONB NOT NULL DEFAULT '[]',
      parent_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      child_name TEXT NOT NULL,
      child_age INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      base_price INTEGER NOT NULL DEFAULT 0,
      extra_kids_price INTEGER NOT NULL DEFAULT 0,
      extras_price INTEGER NOT NULL DEFAULT 0,
      discount_code TEXT,
      discount_amount INTEGER NOT NULL DEFAULT 0,
      voucher_code TEXT,
      voucher_amount INTEGER NOT NULL DEFAULT 0,
      total_price INTEGER NOT NULL DEFAULT 0,
      deposit_amount INTEGER NOT NULL DEFAULT 0,
      deposit_paid BOOLEAN NOT NULL DEFAULT false,
      mollie_payment_id TEXT,
      customer_id TEXT,
      status TEXT NOT NULL DEFAULT 'Nieuw',
      emails_sent JSONB NOT NULL DEFAULT '[]',
      internal_notes TEXT NOT NULL DEFAULT '',
      viewed_at TIMESTAMPTZ
    )
  `;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS satisfaction_rating INTEGER`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS discounts (
      code TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      value INTEGER NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT true,
      expires_at TIMESTAMPTZ,
      usage_limit INTEGER,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS vouchers (
      code TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      balance INTEGER NOT NULL,
      purchaser_name TEXT NOT NULL,
      purchaser_email TEXT NOT NULL,
      recipient_name TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'unpaid',
      mollie_payment_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      resend_api_key TEXT NOT NULL DEFAULT '',
      email_from TEXT NOT NULL DEFAULT '',
      email_reply_to TEXT NOT NULL DEFAULT '',
      mollie_api_key TEXT NOT NULL DEFAULT '',
      CONSTRAINT settings_single_row CHECK (id = 1)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoice_numbers (
      booking_id TEXT PRIMARY KEY,
      number TEXT NOT NULL UNIQUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blocked_dates (
      date TEXT PRIMARY KEY,
      reason TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT '',
      low_stock_threshold INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'contact',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      viewed_at TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_images (
      slot_id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS app_secrets (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workshops (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      min_age INTEGER,
      max_age INTEGER,
      duration TEXT NOT NULL DEFAULT '',
      min_group_size INTEGER,
      max_group_size INTEGER,
      price_from INTEGER,
      what_we_do TEXT NOT NULL DEFAULT '',
      included_items JSONB NOT NULL DEFAULT '[]',
      published BOOLEAN NOT NULL DEFAULT true,
      featured BOOLEAN NOT NULL DEFAULT false,
      sort_order INTEGER NOT NULL DEFAULT 0,
      meta_title TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workshop_images (
      id TEXT PRIMARY KEY,
      workshop_slug TEXT NOT NULL,
      content_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS workshop_images_workshop_slug_idx ON workshop_images (workshop_slug, sort_order)`;

  await sql`
    CREATE TABLE IF NOT EXISTS theme_materials (
      theme_slug TEXT NOT NULL,
      inventory_item_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (theme_slug, inventory_item_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS loyalty_accounts (
      customer_id TEXT PRIMARY KEY,
      completed_bookings INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS birthday_reminders_sent (
      booking_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (booking_id, year)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      stock INTEGER NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_slug TEXT NOT NULL,
      content_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS product_images_product_slug_idx ON product_images (product_slug, sort_order)`;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      items JSONB NOT NULL DEFAULT '[]',
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      total_price INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'unpaid',
      mollie_payment_id TEXT
    )
  `;
}

export function ensureSchema(): Promise<void> {
  if (!globalThis.__richarSchemaReady) {
    globalThis.__richarSchemaReady = migrate();
  }
  return globalThis.__richarSchemaReady;
}
