export type LegacyRecipeIngredient = {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
  detail?: string;
};

export type Recipe = {
  id: number;
  slug: string;
  name: string;
  course: string;
  servings: string;
  rating: number;
  image?: string;
  intro: string;
  ingredients: LegacyRecipeIngredient[];
  directions: string[];
  meta: {
    cuisine?: string[];
    diet?: string[];
    mainIngredient?: string[];
    holiday?: string[];
    cookingMethod?: string[];
    category?: string[];
  };
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
};

export type RecipeFilters = {
  matchMode: "every" | "any" | "exact";
};
