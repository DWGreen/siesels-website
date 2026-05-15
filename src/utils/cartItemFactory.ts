import { FinalizedCustomSandwich } from "@/types/builder";
import {
  CartItem,
  CartModifier
} from "@/types/cart";

import {
  Product,
  ProductOrder
} from "@/types/product";
import { pricingFromProduct } from "./pricingFacory";
import { ingredientSelectionFromProductIngredients } from "./ingredientFactory";

//pretty sure this function will soon be removed as we are no longer directly inserting products into the cart,
//instead, we are converting to either a product order, or a customsandwich, and then once either workflow is finished
//that workflow then converts to a cart item, so this function probably will not be needed very soon

/*
export function
productToCartItem(
  product: Product,
    ingredientSelections: CartItem["ingredientSelections"] = [],
    quantity: number = 1
): CartItem {

  return {

    id: crypto.randomUUID(),

    type: "product",

    quantity: quantity,

    totalPrice:
      Number(product.price) * quantity,

    product: product,

    ingredientSelections:
      ingredientSelections
  };
}
*/
export function productOrderToCartItem(
  productOrder: ProductOrder,
  quantity: number,
    modifiers: CartModifier[]
): CartItem {
 console.log(
    "INSIDE productOrderToCartItem modifiers:",
    modifiers
  );
  return {

    id: crypto.randomUUID(),

    type: "product",

    quantity: quantity,

    totalPrice:
      calculateCartItemUnitPrice(
        Number(productOrder.pricing.totalPrice),
        modifiers
      ) * quantity,

    product: productOrder,
    modifiers: modifiers,

  };
}
function calculateCartItemUnitPrice(
  basePrice: number,
  modifiers: CartModifier[]
): number {
  const priceOverrideModifier =
    modifiers.find(
      modifier =>
        modifier.priceOverride === true
    );

  const effectiveBasePrice =
    priceOverrideModifier
      ? priceOverrideModifier.price ?? 0
      : basePrice;

  const normalModifierTotal =
    modifiers.reduce(
      (sum, modifier) => {
        if (
          modifier.priceOverride
        ) {
          return sum;
        }

        return (
          sum +
          (modifier.price ?? 0)
        );
      },
      0
    );

  return (
    effectiveBasePrice +
    normalModifierTotal
  );
}
export function productToProductOrder(
  product: Product
): ProductOrder {

  return {
    baseProductId: product.id,
    name: product.name,
    pricing: pricingFromProduct(product),
    baseProductHasIngredients: product.ingredients.length > 0,
    ingredientSelections: ingredientSelectionFromProductIngredients(product.ingredients),
  
  };
}

export function
customSandwichToCartItem(
  
  sandwich: FinalizedCustomSandwich,
  modifiers: CartModifier[],
  quantity: number = 1
): CartItem {
console.log("INSIDE customSandwichToCartItem modifiers:", modifiers);
console.log("INSIDE customSandwichToCartItem sandwich.pricing:", sandwich.pricing);
console.log("price calculation for override ", calculateCartItemUnitPrice(
  Number(sandwich.pricing.basePrice),
  modifiers
) + " additional price " + Number(sandwich.pricing.additionalPrice));
  return {

    id: crypto.randomUUID(),

    type: "custom-sandwich",

    quantity: quantity,

    totalPrice:
     quantity * (calculateCartItemUnitPrice(
        Number(sandwich.pricing.basePrice),
        modifiers
      ) +     Number(sandwich.pricing.additionalPrice)),


    customSandwich: sandwich,
modifiers: modifiers,
  };
}
