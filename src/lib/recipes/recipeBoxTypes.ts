import { Recipe } from "./recipeTypes";

export type SavedRecipe = {
  recipeId: number;
  dateAdded: string;
};




export type MyRecipesSortOption =
  | "course"
  | "dateAdded"
  | "name"
  | "rating";

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

export type ShoppingListDisplayOptions = {
  hideCategories: boolean;
  hideMeasurements: boolean;
  hideDetails: boolean;
  hideRecipeTitles: boolean;
};

export type RecipeBoxState = {
  savedRecipes: SavedRecipe[];
  shoppingList: ShoppingListItem[];
  menuByWeek: Record<string, Record<string, number[]>>;
  expiresAt: string;
};
