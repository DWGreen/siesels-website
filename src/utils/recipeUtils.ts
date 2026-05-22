import { RecipeStatus } from "@/lib/recipes/recipeTypes";

function isRecipeStatus(value: number): value is RecipeStatus {
  return [0, 1, 2, 3, 4, 5].includes(value);
}

export function parseRecipeStatus(
  value: string | null
): RecipeStatus {
  if (!value) return 1;

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return 1;
  }

  if (!isRecipeStatus(parsed)) {
    return 1;
  }

  return parsed;
}