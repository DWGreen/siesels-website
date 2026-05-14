

import {
  CheckoutValidationRequest,
  CheckoutItemRequest,
  ProductIngredientRequest,
  ProductModifierRequest,
} from "@/types/cart";

import { CartItem } from "@/types/cart";
import { getModifierByDefinitionId } from "@/data/modifiers";

export function createCheckoutValidationRequest(
  cartItems: CartItem[]
): CheckoutValidationRequest {
  return {
    items: cartItems.map(createCheckoutItemRequest),
  };
}

function createCheckoutItemRequest(cartItem: CartItem): CheckoutItemRequest {
  return {
    cartItemId: cartItem.id,
    type: cartItem.type,
    productId: getBaseProductIdForCartItem(cartItem),
    quantity: cartItem.quantity,
    ingredients: getProductIngredientsForCartItem(cartItem),
    modifiers: getModifiersForCartItem(cartItem),
  };
}

function getBaseProductIdForCartItem(cartItem: CartItem): number {
  return (
    cartItem.customSandwich?.baseProductId ??
    cartItem.product?.baseProductId ??
    0
  );
}

function getProductIngredientsForCartItem(
  cartItem: CartItem
): ProductIngredientRequest[] {
  if (cartItem.type !== "custom-sandwich") {
    return [];
  }

  return (
    cartItem.customSandwich?.ingredients
      .filter((ingredient) => Boolean(ingredient.id))
      .map((ingredient) => ({
        productId: ingredient.id,
      })) ?? []
  );
}

function getModifiersForCartItem(cartItem: CartItem): ProductModifierRequest[] {
  return (
    cartItem.modifiers
      ?.map((modifier) => {
        const definition = getModifierByDefinitionId(modifier.definitionId);

        if (!definition?.productId) {
          return null;
        }

        return {
            modifierDefinitionId: modifier.definitionId,
          modifierProductId: definition.productId,
        
        };
      })
      .filter((modifier): modifier is ProductModifierRequest => modifier !== null) ??
    []
  );
}