import { mockRecipes } from "@/data/mockRecipes";
import { Recipe } from "@/types/recipes";

export function getRecipeBySlug(slug: string) {
  return mockRecipes.find(recipe => recipe.slug === slug);
}

export function getRecipeById(recipeId: number) {
  return mockRecipes.find(recipe => recipe.id === recipeId);
}

export function getRecipesByIds(recipeIds: number[]) {
  return recipeIds
    .map(getRecipeById)
    .filter(Boolean) as Recipe[];
}

export function getSimilarRecipes(recipe: Recipe, limit = 4) {
  const tags = new Set([
    ...(recipe.meta.cuisine ?? []),
    ...(recipe.meta.diet ?? []),
    ...(recipe.meta.mainIngredient ?? []),
    ...(recipe.meta.cookingMethod ?? []),
    recipe.course,
  ]);

  return mockRecipes
    .filter(candidate => candidate.id !== recipe.id)
    .map(candidate => {
      const candidateTags = [
        ...(candidate.meta.cuisine ?? []),
        ...(candidate.meta.diet ?? []),
        ...(candidate.meta.mainIngredient ?? []),
        ...(candidate.meta.cookingMethod ?? []),
        candidate.course,
      ];

      const score = candidateTags.filter(tag =>
        tags.has(tag)
      ).length;

      return {
        recipe: candidate,
        score,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.recipe);
}