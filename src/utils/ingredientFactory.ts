import { Ingredient, IngredientSelection } from "@/types/ingredients";

export function ingredientSelectionFromProductIngredients(
  productIngredients: Ingredient[]
): IngredientSelection[] {
  return productIngredients.map((pi) => ({
   
    name: pi.name,
    price: pi.price,
    included: pi.included || true,
    extra: pi.extra || false,
  }));
}   