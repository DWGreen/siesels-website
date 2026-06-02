import { ShoppingListItem } from "./recipeBoxTypes";
import { Recipe, RecipeIngredient } from "./recipeTypes";

export function formatIngredientQuantity(
  ingredient: RecipeIngredient
): string {
  const parts: string[] = [];

  if (ingredient.whole > 0) {
    parts.push(
      String(ingredient.whole)
    );
  }

  if (
    ingredient.denominator > 0 &&
    ingredient.numerator > 0
  ) {
    parts.push(
      `${ingredient.numerator}/${ingredient.denominator}`
    );
  }

  if (ingredient.size) {
    parts.push(ingredient.size);
  }

  return parts.join(" ");
}

export function ingredientToShoppingItem(
  ingredient: RecipeIngredient,
  recipe?: Recipe
): ShoppingListItem {
  return {
    id: crypto.randomUUID(),

    name: ingredient.ingredient,

    quantity:
      formatIngredientQuantity(
        ingredient
      ),

    category:
      ingredient.department,

    detail:
      ingredient.description,

    recipeId:
      ingredient.recipeId,

    recipeName:
      recipe?.name,

    checked: false,
  };
}