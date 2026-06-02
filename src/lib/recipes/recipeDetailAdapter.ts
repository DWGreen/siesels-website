import {
  Recipe,
  RecipeDetail,
  RecipeMetaMap,
} from "./recipeTypes";

function getMetaValues(
  meta: RecipeMetaMap,
  key: string
): string[] {
  return (meta[key] ?? [])
    .map(item => item.value)
    .filter(Boolean);
}

export function recipeDetailToUiRecipe(
  detail: RecipeDetail
): Recipe {
  return {
    id: detail.id,
    slug: String(detail.id),
    name: detail.name,
    servings: detail.servings,
    course: detail.course,
    intro:
      getMetaValues(detail.meta, "recipeintro")[0] ?? "",
    image: detail.photo ?? "",
    rating: detail.rating.average ?? 0,
    prepTimeMinutes: undefined,
    cookTimeMinutes: undefined,
    ingredients: detail.ingredients,
    directions: detail.directions,
    meta: {
      cuisine: getMetaValues(detail.meta, "cuisine"),
      diet: getMetaValues(detail.meta, "diet"),
      mainIngredient: getMetaValues(detail.meta, "mainingredient"),
      holiday: getMetaValues(detail.meta, "holiday"),
      cookingMethod: [
        ...getMetaValues(detail.meta, "cookingmethod"),
        ...getMetaValues(detail.meta, "cooking method"),
      ],
      category: getMetaValues(detail.meta, "category"),
    },
  };
}
