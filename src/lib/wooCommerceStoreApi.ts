// Low-level fetch client for the WooCommerce Store API (/wp-json/wc/store/v1).
// Unlike the REST v3 client (src/lib/woocommerce.ts), this API is used for cart/checkout
// and requires forwarding a Cart-Token + Nonce pair across requests to identify the session.

const STORE_API_BASE = "/wp-json/wc/store/v1";

export interface StoreApiSession {
  cartToken?: string;
  nonce?: string;
}

export interface StoreApiResult<T> {
  data: T;
  session: StoreApiSession;
}

export class StoreApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "StoreApiError";
    this.status = status;
    this.body = body;
  }
}

function getWpApiUrl(): string {
  const url = process.env.WP_API_URL ?? process.env.NEXT_PUBLIC_WP_URL;

  if (!url) {
    throw new Error(
      "Missing required environment variable: WP_API_URL (or legacy NEXT_PUBLIC_WP_URL)"
    );
  }

  return url.replace(/\/$/, "");
}

export async function callStoreApi<T>(
  path: string,
  init: (RequestInit & { session?: StoreApiSession }) = {}
): Promise<StoreApiResult<T>> {
  const { session, ...requestInit } = init;
  const method = requestInit.method ?? "GET";

  const headers = new Headers(requestInit.headers);
  headers.set("Content-Type", "application/json");

  if (session?.cartToken) {
    headers.set("Cart-Token", session.cartToken);
  }

  // Store API requires the previously issued nonce to be echoed back on writes.
  if (session?.nonce && method !== "GET") {
    headers.set("Nonce", session.nonce);
  }

  const response = await fetch(`${getWpApiUrl()}${STORE_API_BASE}${path}`, {
    ...requestInit,
    method,
    headers,
    cache: "no-store",
  });

  const nextSession: StoreApiSession = {
    cartToken: response.headers.get("Cart-Token") ?? session?.cartToken,
    nonce:
      response.headers.get("Nonce") ??
      response.headers.get("X-WC-Store-API-Nonce") ??
      session?.nonce,
  };

  const rawBody = await response.text();
  const data = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : null) ?? `WooCommerce Store API request failed (${response.status})`;

    throw new StoreApiError(message, response.status, data);
  }

  return { data: data as T, session: nextSession };
}
