import {
  BuilderStep,
  CustomSandwich,
  FinalizedCustomSandwich,
  FinalizedIngredient,
} from "@/types/builder";

export function finalizeCustomSandwich(
  sandwich: CustomSandwich,
  steps: BuilderStep[],
  pricing: SandwichPricing
): FinalizedCustomSandwich {

  const ingredients:
    FinalizedIngredient[] = [];

  for (const step of steps) {

    const selectedIds =
      sandwich.selections[
        step.category.id
      ] || [];

    const selectedProducts =
      step.products.filter(product =>
        selectedIds.includes(product.id)
      );

    ingredients.push(

      ...selectedProducts.map(product => ({
        id: product.id,
        price: product.price ? Number(product.price) : undefined,
        name: product.name,
        included:true
      }))
    );
  }

  return {

    name: sandwich.name,

    ingredients,
   selections: sandwich.selections,
    baseProductId: sandwich.baseProductId,
    quantity: sandwich.quantity,

    pricing: pricing,
  };
}