import { Recipe } from "@/types/recipes";
import {
  RecipeCard,
  RecipeDetail,
} from "./recipeTypes";

function metaValues(
  detail: RecipeDetail,
  key: string
): string[] {
  return (
    detail.meta[key]?.map(item => item.value).filter(Boolean) ??
    []
  );
}

export function recipeCardToUiRecipe(
  card: RecipeCard
): Recipe {
  return {
    id: card.id,
    slug: String(card.id),
    name: card.name,
    servings: card.servings,
    course: card.course,
    intro: card.intro ?? "",
    image: card.photo ?? "",
    rating: 0,
    prepTimeMinutes: undefined,
    cookTimeMinutes: undefined,
    ingredients: [],
    directions: [],
    meta: {
      cuisine: [],
      diet: [],
      mainIngredient: [],
      holiday: [],
      cookingMethod: [],
      category: [],
    },
  };
}

export function recipeCardsToUiRecipes(
  cards: RecipeCard[]
): Recipe[] {
  return cards.map(recipeCardToUiRecipe);
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
      detail.meta.recipeintro?.[0]?.value ??
      detail.meta.featureintro?.[0]?.value ??
      "",
    image: detail.photo ?? "",
    rating: detail.rating.average ?? 0,
    prepTimeMinutes: undefined,
    cookTimeMinutes: undefined,
    ingredients: detail.ingredients.map(item => ({
  id: String(item.id),
  name: item.ingredient,
  quantity: [
    item.whole || "",
    item.denominator
      ? `${item.numerator}/${item.denominator}`
      : "",
    item.size,
  ]
    .filter(Boolean)
    .join(" "),
  detail: item.description,
})),
    directions: detail.directions,
    meta: {
      cuisine: metaValues(detail, "cuisine"),
      diet: metaValues(detail, "diet"),
      mainIngredient: [
        ...metaValues(detail, "mainingredient"),
        ...metaValues(detail, "main ingredient"),
      ],
      holiday: metaValues(detail, "holiday"),
      cookingMethod: metaValues(detail, "cookingmethod"),
      category: metaValues(detail, "category"),
    },
  };
}