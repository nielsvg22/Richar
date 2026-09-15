import { sql, ensureSchema } from "./db";
import type { CartItem } from "./product-constants";

export type OrderStatus = "unpaid" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
  status: OrderStatus;
  molliePaymentId: string | null;
};

type OrderRow = {
  id: string;
  created_at: Date;
  items: CartItem[];
  customer_name: string;
  email: string;
  phone: string;
  total_price: number;
  status: string;
  mollie_payment_id: string | null;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at.toISOString(),
    items: row.items,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    totalPrice: row.total_price,
    status: row.status as OrderStatus,
    molliePaymentId: row.mollie_payment_id,
  };
}

export async function getOrders(): Promise<Order[]> {
  await ensureSchema();
  const rows = await sql<OrderRow[]>`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows.map(rowToOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  await ensureSchema();
  const rows = await sql<OrderRow[]>`SELECT * FROM orders WHERE id = ${id}`;
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function getOrderByMolliePaymentId(paymentId: string): Promise<Order | undefined> {
  await ensureSchema();
  const rows = await sql<OrderRow[]>`SELECT * FROM orders WHERE mollie_payment_id = ${paymentId}`;
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function createOrder(data: {
  items: CartItem[];
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
}): Promise<Order> {
  await ensureSchema();
  const order: Order = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    items: data.items,
    customerName: data.customerName,
    email: data.email,
    phone: data.phone,
    totalPrice: data.totalPrice,
    status: "unpaid",
    molliePaymentId: null,
  };
  await sql`
    INSERT INTO orders (id, created_at, items, customer_name, email, phone, total_price, status, mollie_payment_id)
    VALUES (${order.id}, ${order.createdAt}, ${sql.json(order.items)}, ${order.customerName}, ${order.email}, ${order.phone}, ${order.totalPrice}, ${order.status}, ${order.molliePaymentId})
  `;
  return order;
}

export async function setOrderMolliePaymentId(id: string, molliePaymentId: string) {
  await ensureSchema();
  await sql`UPDATE orders SET mollie_payment_id = ${molliePaymentId} WHERE id = ${id}`;
  return getOrder(id);
}

export async function markOrderPaid(id: string) {
  await ensureSchema();
  await sql`UPDATE orders SET status = 'paid' WHERE id = ${id} AND status = 'unpaid'`;
  return getOrder(id);
}

export async function markOrderFulfilled(id: string) {
  await ensureSchema();
  await sql`UPDATE orders SET status = 'fulfilled' WHERE id = ${id} AND status = 'paid'`;
  return getOrder(id);
}
