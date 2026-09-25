// Thin browser-side fetch wrappers around the /api/cart* proxy routes.
// Used by the CartContext background sync, not by UI components directly.

import { StoreApiCart } from "@/types/checkout";

async function parseCartResponse(response: Response): Promise<StoreApiCart> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? `Cart request failed (${response.status})`);
  }

  return data as StoreApiCart;
}

export async function getWooCommerceCart(): Promise<StoreApiCart> {
  const response = await fetch("/api/cart", { method: "GET" });

  return parseCartResponse(response);
}

export async function clearWooCommerceCart(): Promise<StoreApiCart> {
  const response = await fetch("/api/cart/clear", { method: "DELETE" });
  return parseCartResponse(response);
}

export async function addWooCommerceCartItem(
  productId: number,
  quantity: number,
  selectionMetadata?: string,
  groupKey?: string,
  parentName?: string
): Promise<StoreApiCart> {
  const response = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: productId,
      quantity,
      siesels_selection_metadata: selectionMetadata,
      siesels_line_group: groupKey,
      siesels_parent_name: parentName,
    }),
  });

  return parseCartResponse(response);
}

export async function updateWooCommerceCartItem(
  key: string,
  quantity: number
): Promise<StoreApiCart> {
  const response = await fetch("/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, quantity }),
  });

  return parseCartResponse(response);
}

export async function removeWooCommerceCartItem(
  key: string
): Promise<StoreApiCart> {
  const response = await fetch("/api/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  return parseCartResponse(response);
}
