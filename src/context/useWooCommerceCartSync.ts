"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { CartItem } from "@/types/cart";
import { StoreApiCart } from "@/types/checkout";
import { getDesiredLineItemsForCartItem } from "@/utils/cartLineItemMapper";
import {
  addWooCommerceCartItem,
  clearWooCommerceCart,
  getWooCommerceCart,
  removeWooCommerceCartItem,
  updateWooCommerceCartItem,
} from "@/services/cart/browserCartClient";

type TrackedLine = {
  productId: number;
  quantity: number;
  wcKey: string;
};

// Mirrors CartContext's items into the real WooCommerce cart in the background, so
// WooCommerce remains the pricing/tax/order source of truth without changing the
// existing CartItem UI model or the edit-existing-item flow.
export function useWooCommerceCartSync(items: CartItem[]) {
  const trackedRef = useRef<Map<string, TrackedLine>>(new Map());
  const primedRef = useRef(false);
  const resetRef = useRef(false);
  const queueRef = useRef(Promise.resolve());

  useEffect(() => {
    queueRef.current = queueRef.current
      .then(async () => {
        // The Store API requires a nonce on every write, which is only issued by a prior read.
        if (!primedRef.current) {
          await getWooCommerceCart();
          primedRef.current = true;
        }

        if (!resetRef.current) {
          await clearWooCommerceCart();
          trackedRef.current.clear();
          resetRef.current = true;
        }

        await syncCart(items, trackedRef);
      })
      .catch(error => {
        console.error("Failed to sync WooCommerce cart:", error);
      });
  }, [items]);
}

async function syncCart(
  items: CartItem[],
  trackedRef: MutableRefObject<Map<string, TrackedLine>>
) {
  const tracked = trackedRef.current;
  const desiredKeys = new Set<string>();

  for (const item of items) {
    for (const line of getDesiredLineItemsForCartItem(item)) {
      const compositeKey = `${item.id}:${line.role}`;
      desiredKeys.add(compositeKey);

      const existing = tracked.get(compositeKey);

      try {
        if (!existing) {
          const cart = await addWooCommerceCartItem(
            line.productId,
            line.quantity,
            line.selectionMetadata,
            line.groupKey,
            line.parentName
          );
          const wcKey = findNewLineKey(cart, line.productId, tracked);

          if (wcKey) {
            tracked.set(compositeKey, {
              productId: line.productId,
              quantity: line.quantity,
              wcKey,
            });
          } else {
            console.error(
              `Could not resolve WooCommerce line item key for product ${line.productId}.`
            );
          }

          continue;
        }

        if (existing.quantity !== line.quantity) {
          await updateWooCommerceCartItem(existing.wcKey, line.quantity);
          existing.quantity = line.quantity;
        }
      } catch (error) {
        // One line failing (e.g. an unpurchasable product) should not block its siblings from syncing.
        console.error(`Failed to sync WooCommerce cart line for product ${line.productId}:`, error);
      }
    }
  }

  for (const [compositeKey, line] of tracked) {
    if (!desiredKeys.has(compositeKey)) {
      try {
        await removeWooCommerceCartItem(line.wcKey);
        tracked.delete(compositeKey);
      } catch (error) {
        console.error(`Failed to remove WooCommerce cart line ${line.wcKey}:`, error);
      }
    }
  }
}

function findNewLineKey(
  cart: StoreApiCart,
  productId: number,
  tracked: Map<string, TrackedLine>
): string | undefined {
  const knownKeys = new Set(Array.from(tracked.values()).map(line => line.wcKey));

  return cart.items.find(
    cartItem => cartItem.id === productId && !knownKeys.has(cartItem.key)
  )?.key;
}
