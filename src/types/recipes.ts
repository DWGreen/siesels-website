// src/types/recipes.ts

export type RecipeGroupMap = Record<string, string[]>;

export type Recipe = {
  id: number;
  name: string;
  slug: string;
  course: string;
  servings: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  image: string;
  intro?: string;
  ingredients: string[];
  directions: string[];
  groups: RecipeGroupMap;
  rating?: number;
};

export type RecipeSearchParams = {
  query?: string;
  course?: string;
  group?: string;
  page?: number;
  limit?: number;
};

export type RecipeSearchResult = {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
};