import { getSettings } from "./settings";

const MOLLIE_API = "https://api.mollie.com/v2";

async function getApiKey() {
  const settings = await getSettings();
  return settings.mollieApiKey || process.env.MOLLIE_API_KEY || "";
}

export async function isMollieConfigured() {
  return Boolean(await getApiKey());
}

const UNREACHABLE_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];

/**
 * Mollie rejects payment creation if webhookUrl points at an address it can't
 * reach from the public internet (localhost, private/internal hostnames used
 * by preview or sandbox environments, plain http). In those cases we simply
 * omit the webhook — payment status is still verified via the active
 * status-check endpoints (/api/payments/status, /api/vouchers/status).
 */
export function isPubliclyReachableUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (UNREACHABLE_HOSTS.includes(host)) return false;
    if (host.endsWith(".local")) return false;
    if (/^(10|127)\./.test(host)) return false;
    if (/^192\.168\./.test(host)) return false;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
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
  const apiKey = await getApiKey();
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
  // Mollie rejects the request outright if webhookUrl isn't reachable from the
  // public internet (e.g. localhost or an internal sandbox URL during
  // development). In that case we omit it — payment status is still verified
  // via the active status-check endpoints.
  const includeWebhook = isPubliclyReachableUrl(webhookUrl);
  if (!includeWebhook) {
    console.warn(
      "[mollie] webhookUrl niet publiek bereikbaar, wordt weggelaten:",
      webhookUrl
    );
  }

  return mollieFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: { currency: "EUR", value: amount.toFixed(2) },
      description,
      redirectUrl,
      ...(includeWebhook ? { webhookUrl } : {}),
      metadata,
    }),
  });
}

export async function getMolliePayment(paymentId: string): Promise<MolliePayment> {
  return mollieFetch(`/payments/${paymentId}`);
}
