import { getSettings } from "./settings";

const MOLLIE_API = "https://api.mollie.com/v2";

function getApiKey() {
  return getSettings().mollieApiKey || process.env.MOLLIE_API_KEY || "";
}

export function isMollieConfigured() {
  return Boolean(getApiKey());
}

type MolliePayment = {
  id: string;
  status: "open" | "canceled" | "pending" | "expired" | "failed" | "paid" | "authorized";
  amount: { value: string; currency: string };
  description: string;
  metadata: Record<string, unknown>;
  _links: { checkout?: { href: string } };
};

async function mollieFetch(path: string, options: RequestInit = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Geen Mollie API key geconfigureerd. Stel deze in bij Admin → Instellingen.");
  }

  const res = await fetch(`${MOLLIE_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || body.title || "Mollie gaf een fout terug.");
  }
  return body;
}

export async function createMolliePayment({
  amount,
  description,
  redirectUrl,
  webhookUrl,
  metadata,
}: {
  amount: number;
  description: string;
  redirectUrl: string;
  webhookUrl: string;
  metadata: Record<string, unknown>;
}): Promise<MolliePayment> {
  return mollieFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: { currency: "EUR", value: amount.toFixed(2) },
      description,
      redirectUrl,
      webhookUrl,
      metadata,
    }),
  });
}

export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  return mollieFetch(`/payments/${paymentId}`);
}
