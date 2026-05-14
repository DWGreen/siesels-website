import { BuilderStep, CustomSandwich } from "@/types/builder";
import { Product } from "@/types/product";

export function getSelectedProducts(
  sandwich: CustomSandwich,
  steps: BuilderStep[]
): Product[] {

  return steps.flatMap(step => {

    const selectedIds =
      sandwich.selections[
        step.category.id
      ] || [];

    return step.products.filter(
      product =>
        selectedIds.includes(
          product.id
        )
    );
  });
}