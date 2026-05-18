// src/services/cmsRecipeService.ts

import { Recipe, RecipeSearchParams, RecipeSearchResult } from "@/types/recipes";

const CMS_RECIPE_API_BASE = process.env.CMS_RECIPE_API_BASE!;
const CMS_RECIPE_API_KEY = process.env.CMS_RECIPE_API_KEY;

function appendGroupParams(
  params: URLSearchParams,
  group?: Record<string, string[]>
) {
  if (!group) return;

  for (const [name, values] of Object.entries(group)) {
    for (const value of values) {
      params.append(`group[${name}][]`, value);
    }
  }
}

async function fetchCms<T>(params: URLSearchParams): Promise<T> {
  params.set("format", "json");

  if (CMS_RECIPE_API_KEY) {
    params.set("key", CMS_RECIPE_API_KEY);
  }

  const response = await fetch(`${CMS_RECIPE_API_BASE}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`CMS recipe request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchCmsRecipes(
  input: RecipeSearchParams
): Promise<RecipeSearchResult> {
  const params = new URLSearchParams();

  params.set("searchRecipes", "1");
  params.set("page", String(input.page ?? 1));
  params.set("limit", String(input.limit ?? 12));

  if (input.query) {
    params.set("searchterm", input.query);
  }

  // Later if you use group filters:
  // appendGroupParams(params, input.groups);

  const data = await fetchCms<any>(params);

  // Normalize legacy response here.
  return {
    recipes: [],
    total: 0,
    page: input.page ?? 1,
    limit: input.limit ?? 12,
  };
}