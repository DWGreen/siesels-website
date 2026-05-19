export type RecipeCourse =
  | "Dinner"
  | "Breakfast"
  | "Lunch"
  | "Appetizer"
  | "Snack"
  | "Beverage"
  | "Salad"
  | "Side"
  | "Soup";

export type RecipeMatchMode =
  | "every"
  | "any"
  | "exact";

export type RecipeMeta = {
  cuisine?: string[];
  diet?: string[];
  mainIngredient?: string[];
  holiday?: string[];
  cookingMethod?: string[];
};

export type RecipeIngredient = {
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
  course: RecipeCourse;
  servings: string;
  rating: number;
  image?: string;
  intro: string;
  ingredients: RecipeIngredient[];
  directions: string[];
  meta: RecipeMeta;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
};

export type RecipeFilters = {
  searchTerm: string;
  matchMode: RecipeMatchMode;
  cuisine: string;
  diet: string;
  mainIngredient: string;
  holiday: string;
  cookingMethod: string;
  course: string;
  categoryValue: string;
};

export type AdvancedRecipeFilters = {
  searchTerm: string;
  matchMode: RecipeMatchMode;
  courses: RecipeCourse[];
  diets: string[];
  cuisines: string[];
};

export type SavedRecipe = {
  recipeId: number;
  dateAdded: string;
};

export type ShoppingListItem = {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
  detail?: string;
  recipeId?: number;
  recipeName?: string;
  checked?: boolean;
};

export type RecipeBoxState = {
  savedRecipes: SavedRecipe[];
  shoppingList: ShoppingListItem[];
  menuByWeek: Record<string, Record<string, number[]>>;
  expiresAt: string;
};

export type MyRecipesSortOption =
  | "course"
  | "dateAdded"
  | "name"
  | "rating";

export type ShoppingListDisplayOptions = {
  hideCategories: boolean;
  hideMeasurements: boolean;
  hideDetails: boolean;
  hideRecipeTitles: boolean;
};