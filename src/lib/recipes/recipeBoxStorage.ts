import {
  RecipeBoxState,
  ShoppingListItem,
} from "@/types/recipes";

const STORAGE_KEY = "bianchinis-recipe-box";
const DAYS_TO_KEEP = 30;

function getExpirationDate() {
  const date = new Date();
  date.setDate(date.getDate() + DAYS_TO_KEEP);
  return date.toISOString();
}

export function createEmptyRecipeBoxState(): RecipeBoxState {
  return {
    savedRecipes: [],
    shoppingList: [],
    menuByWeek: {},
    expiresAt: getExpirationDate(),
  };
}

export function loadRecipeBoxState(): RecipeBoxState {
  if (typeof window === "undefined") {
    return createEmptyRecipeBoxState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createEmptyRecipeBoxState();
  }

  try {
    const parsed = JSON.parse(raw) as RecipeBoxState;

    if (
      parsed.expiresAt &&
      new Date(parsed.expiresAt) < new Date()
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return createEmptyRecipeBoxState();
    }

    return {
      ...createEmptyRecipeBoxState(),
      ...parsed,
    };
  } catch {
    return createEmptyRecipeBoxState();
  }
}

export function saveRecipeBoxState(
  state: RecipeBoxState
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      expiresAt:
        state.expiresAt || getExpirationDate(),
    })
  );
}

export function addShoppingListItems(
  state: RecipeBoxState,
  items: ShoppingListItem[]
): RecipeBoxState {
  return {
    ...state,
    shoppingList: [
      ...state.shoppingList,
      ...items,
    ],
  };
}