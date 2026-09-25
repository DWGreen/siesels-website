// Domain-level helpers for the WooCommerce Store API cart, used by the /api/cart* routes.
// Keeps the raw Store API client (wooCommerceStoreApi.ts) generic and this file WooCommerce-cart-specific.

import {
  callStoreApi,
  StoreApiResult,
  StoreApiSession,
} from "@/lib/wooCommerceStoreApi";
import {
  AddCartItemRequest,
  RemoveCartItemRequest,
  StoreApiCart,
  UpdateCartItemRequest,
} from "@/types/checkout";

export function getCart(
  session: StoreApiSession
): Promise<StoreApiResult<StoreApiCart>> {
  return callStoreApi<StoreApiCart>("/cart", { session });
}

export function addCartItem(
  session: StoreApiSession,
  item: AddCartItemRequest
): Promise<StoreApiResult<StoreApiCart>> {
  return callStoreApi<StoreApiCart>("/cart/add-item", {
    session,
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function updateCartItem(
  session: StoreApiSession,
  item: UpdateCartItemRequest
): Promise<StoreApiResult<StoreApiCart>> {
  return callStoreApi<StoreApiCart>("/cart/update-item", {
    session,
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function removeCartItem(
  session: StoreApiSession,
  item: RemoveCartItemRequest
): Promise<StoreApiResult<StoreApiCart>> {
  return callStoreApi<StoreApiCart>("/cart/remove-item", {
    session,
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function clearCart(
  session: StoreApiSession
): Promise<StoreApiResult<StoreApiCart>> {
  return callStoreApi<StoreApiCart>("/cart/items", {
    session,
    method: "DELETE",
  });
}
