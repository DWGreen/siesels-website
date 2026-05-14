import { BuilderStep, CustomSandwich } from "@/types/builder";
import { Product } from "@/types/product";

export function calculateSandwichPrice(
  sandwich: CustomSandwich,
  steps: BuilderStep[],
  baseProduct: Product | null
): SandwichPricing {

  const basePrice =
    Number(baseProduct?.price || 0);

  let additionalPrice = 0;

  const ingredientPrices: {
    [ingredientId: number]: number;
  } = {};

  for (const step of steps) {

    const selectedIds =
      sandwich.selections[
        step.category.id
      ] || [];

    const selectedProducts =
      step.products.filter(product =>
        selectedIds.includes(product.id)
      );

    for (const product of selectedProducts) {

      additionalPrice +=
        Number(product.price || 0);
      ingredientPrices[product.id] = Number(product.price || 0);
    }
  }

  return {

    basePrice,

    additionalPrice,

    ingredientPrices,

    totalPrice:
      basePrice + additionalPrice,
  };
}

