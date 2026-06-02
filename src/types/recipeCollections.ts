import { Recipe } from "@/lib/recipes/recipeTypes";


export type RecipeCollection = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  heroRecipeSlug?: string;
  recipeSlugs: string[];
  relatedCollectionIds?: string[];
};

export type HydratedRecipeCollection =
  Omit<RecipeCollection, "recipeSlugs"> & {
    recipes: Recipe[];
  };