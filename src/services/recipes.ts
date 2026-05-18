// src/services/recipeService.ts

import { mockRecipes } from "@/data/mockRecipes";
import {
  Recipe,
  RecipeSearchParams,
  RecipeSearchResult,
} from "@/types/recipes";

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function recipeMatchesQuery(recipe: Recipe, query: string) {
  const q = normalize(query);

  return (
    normalize(recipe.name).includes(q) ||
    normalize(recipe.course).includes(q) ||
    normalize(recipe.intro ?? "").includes(q) ||
    recipe.ingredients.some((ingredient) =>
      normalize(ingredient).includes(q)
    ) ||
    Object.values(recipe.groups).some((values) =>
      values.some((value) => normalize(value).includes(q))
    )
  );
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  return mockRecipes.slice(0, 3);
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  return mockRecipes.find((recipe) => recipe.id === id) ?? null;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  return mockRecipes.find((recipe) => recipe.slug === slug) ?? null;
}

export async function searchRecipes({
  query,
  course,
  group,
  page = 1,
  limit = 12,
}: RecipeSearchParams): Promise<RecipeSearchResult> {
  let results = [...mockRecipes];

  if (query) {
    results = results.filter((recipe) => recipeMatchesQuery(recipe, query));
  }

  if (course) {
    results = results.filter(
      (recipe) => normalize(recipe.course) === normalize(course)
    );
  }

  if (group) {
    results = results.filter((recipe) =>
      Object.values(recipe.groups).some((values) =>
        values.some((value) => normalize(value) === normalize(group))
      )
    );
  }

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return {
    recipes: paged,
    total,
    page,
    limit,
  };
}