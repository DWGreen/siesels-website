// src/utils/cartPricing.ts

import { CartModifier } from "@/types/cart";

export type CartPricePreview = {
  baseUnitPrice: number;
  additionalPrice: number;
  modifierUnitPrice: number;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  priceOverrideModifier?: CartModifier;
};

export function calculateCartItemPrice(
  baseUnitPrice: number,
  additionalPrice: number = 0,
  quantity: number,
  modifiers: CartModifier[] = []
): CartPricePreview {
  const priceOverrideModifier =
    modifiers.find(
      modifier =>
        modifier.priceOverride &&
        typeof modifier.price === "number"
    );

  const effectiveBasePrice =
    priceOverrideModifier
      ? priceOverrideModifier.price ?? 0
      : baseUnitPrice;

  const modifierUnitPrice =
    modifiers.reduce(
      (sum, modifier) => {
        if (modifier.priceOverride) {
          return sum;
        }

        const modifierPrice =
          Number(modifier.price ?? 0);

        const selectedOptionsPrice =
          modifier.selectedGroups.reduce(
            (groupSum, group) =>
              groupSum +
              group.selectedOptions.reduce(
                (optionSum, option) =>
                  optionSum +
                  Number(option.price ?? 0),
                0
              ),
            0
          );

        return (
          sum +
          modifierPrice +
          selectedOptionsPrice
        );
      },
      0
    );

  const unitPrice =
    effectiveBasePrice +
    modifierUnitPrice;

  return {
    baseUnitPrice:
      effectiveBasePrice,
    additionalPrice,
    modifierUnitPrice,
    unitPrice,
    quantity,
    totalPrice:
      (unitPrice + additionalPrice) * quantity,
    priceOverrideModifier,
  };
}