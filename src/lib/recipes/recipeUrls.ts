import { RecipeFilters } from "@/types/recipes";


export function buildRecipeSearchUrl(
  searchTerm: string,
  matchMode: RecipeFilters["matchMode"] = "every"
) {
  const params = new URLSearchParams();

  params.set("q", searchTerm);
  params.set("match", matchMode);

  return `/recipes?${params.toString()}`;
}

export type RecipeUrlFilterKey =
  | "cuisine"
  | "diet"
  | "mainIngredient"
  | "holiday"
  | "cookingMethod"
  | "course";

export function isRecipeUrlFilterKey(
  value: string | undefined
): value is RecipeUrlFilterKey {
  return (
    value === "cuisine" ||
    value === "diet" ||
    value === "mainIngredient" ||
    value === "holiday" ||
    value === "cookingMethod" ||
    value === "course"
  );
}

export function buildRecipeFilterUrl(
  filter: RecipeUrlFilterKey,
  value: string
) {
  const params = new URLSearchParams();

  params.set("filter", filter);
  params.set("value", value);

  return `/recipes?${params.toString()}`;
}