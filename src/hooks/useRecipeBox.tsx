"use client";

import { useEffect, useState } from "react";

import {
  Recipe,

} from "@/lib/recipes/recipeTypes";
import {
  RecipeBoxState,
  ShoppingListItem,
} from "@/lib/recipes/recipeBoxTypes";
import {
  createEmptyRecipeBoxState,
  loadRecipeBoxState,
  saveRecipeBoxState,
} from "@/lib/recipes/recipeBoxStorage";

import {
  formatWeekKey,
  getEmptyWeekMenu,
  getNextWeekKey,
} from "@/lib/recipes/dateWeeks";

function formatIngredientQuantity(ingredient: {
  whole: number;
  numerator: number;
  denominator: number;
  size: string;
}) {
  const parts: string[] = [];

  if (ingredient.whole > 0) {
    parts.push(String(ingredient.whole));
  }

  if (
    ingredient.denominator > 0 &&
    ingredient.numerator > 0
  ) {
    parts.push(
      `${ingredient.numerator}/${ingredient.denominator}`
    );
  }

  if (ingredient.size) {
    parts.push(ingredient.size);
  }

  return parts.join(" ");
}

export function useRecipeBox() {
  const [state, setState] =
    useState<RecipeBoxState>(() =>
      createEmptyRecipeBoxState()
    );

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setState(loadRecipeBoxState());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    saveRecipeBoxState(state);
  }, [state, hasLoaded]);

  const savedRecipeIds = state.savedRecipes.map(
    saved => saved.recipeId
  );

  function toggleSavedRecipe(recipeId: number) {
    setState(current => {
      const exists = current.savedRecipes.some(
        saved => saved.recipeId === recipeId
      );

      if (exists) {
        return {
          ...current,
          savedRecipes:
            current.savedRecipes.filter(
              saved =>
                saved.recipeId !== recipeId
            ),
        };
      }

      return {
        ...current,
        savedRecipes: [
          ...current.savedRecipes,
          {
            recipeId,
            dateAdded: new Date().toISOString(),
          },
        ],
      };
    });
  }

  function removeSavedRecipe(recipeId: number) {
    setState(current => ({
      ...current,
      savedRecipes: current.savedRecipes.filter(
        saved => saved.recipeId !== recipeId
      ),
    }));
  }

  function addRecipeIngredientsToShoppingList(
    recipe: Recipe
  ) {
    const now = Date.now();

    const items: ShoppingListItem[] =
      recipe.ingredients.map((ingredient, index) => ({
        id: `${recipe.id}-${ingredient.id}-${now}-${index}`,
        recipeId: recipe.id,
        recipeName: recipe.name,
        name: ingredient.ingredient,
        quantity: formatIngredientQuantity(
          ingredient
        ),
        category: ingredient.department,
        detail: ingredient.description,
        checked: false,
      }));

    setState(current => ({
      ...current,
      shoppingList: [
        ...current.shoppingList,
        ...items,
      ],
    }));
  }

  function addRecipesIngredientsToShoppingList(
    recipes: Recipe[]
  ) {
    const now = Date.now();

    const items: ShoppingListItem[] =
      recipes.flatMap(recipe =>
        recipe.ingredients.map(
          (ingredient, index) => ({
            id: `${recipe.id}-${ingredient.id}-${now}-${index}`,
            recipeId: recipe.id,
            recipeName: recipe.name,
            name: ingredient.ingredient,
            quantity: formatIngredientQuantity(
              ingredient
            ),
            category: ingredient.department,
            detail: ingredient.description,
            checked: false,
          })
        )
      );

    setState(current => ({
      ...current,
      shoppingList: [
        ...current.shoppingList,
        ...items,
      ],
    }));
  }

  function addCustomShoppingItem(name: string) {
    setState(current => ({
      ...current,
      shoppingList: [
        ...current.shoppingList,
        {
          id: `custom-${Date.now()}`,
          name,
          checked: false,
        },
      ],
    }));
  }

  function removeShoppingItem(itemId: string) {
    setState(current => ({
      ...current,
      shoppingList:
        current.shoppingList.filter(
          item => item.id !== itemId
        ),
    }));
  }

  function toggleShoppingItem(itemId: string) {
    setState(current => ({
      ...current,
      shoppingList: current.shoppingList.map(item =>
        item.id === itemId
          ? {
              ...item,
              checked: !item.checked,
            }
          : item
      ),
    }));
  }

  function clearShoppingList() {
    setState(current => ({
      ...current,
      shoppingList: [],
    }));
  }

  function addRecipeToMenu(
    recipeId: number,
    weekKey = formatWeekKey(),
    day = "sunday"
  ) {
      console.log("ADD MENU DEBUG", {
    recipeId,
    weekKey,
    day,
  });

    setState(current => {
      const week =
        current.menuByWeek[weekKey] ??
        getEmptyWeekMenu();

      const dayRecipes = week[day] ?? [];

      if (dayRecipes.includes(recipeId)) {
        return current;
      }

      return {
        ...current,
        menuByWeek: {
          ...current.menuByWeek,
          [weekKey]: {
            ...week,
            [day]: [...dayRecipes, recipeId],
          },
        },
      };
    });
  }

  function removeRecipeFromMenu(
    recipeId: number,
    weekKey: string,
    day: string
  ) {
    setState(current => {
      const week =
        current.menuByWeek[weekKey] ??
        getEmptyWeekMenu();

      return {
        ...current,
        menuByWeek: {
          ...current.menuByWeek,
          [weekKey]: {
            ...week,
            [day]: (week[day] ?? []).filter(
              id => id !== recipeId
            ),
          },
        },
      };
    });
  }

  function copyWeekToNextWeek(weekKey: string) {
    setState(current => {
      const nextWeekKey = getNextWeekKey(weekKey);
      const currentWeek =
        current.menuByWeek[weekKey] ??
        getEmptyWeekMenu();

      return {
        ...current,
        menuByWeek: {
          ...current.menuByWeek,
          [nextWeekKey]: {
            ...getEmptyWeekMenu(),
            ...currentWeek,
          },
        },
      };
    });
  }

  function loadSampleMenuIdeas(
    recipeIds: number[],
    weekKey: string
  ) {
    setState(current => {
      const week = getEmptyWeekMenu();
      const days = Object.keys(week);

      recipeIds.forEach((recipeId, index) => {
        const day = days[index % days.length];
        week[day] = [...week[day], recipeId];
      });

      return {
        ...current,
        menuByWeek: {
          ...current.menuByWeek,
          [weekKey]: week,
        },
      };
    });
  }

  return {
    state,
    setState,
    savedRecipeIds,
    toggleSavedRecipe,
    removeSavedRecipe,
    addRecipeIngredientsToShoppingList,
    addRecipesIngredientsToShoppingList,
    addCustomShoppingItem,
    removeShoppingItem,
    toggleShoppingItem,
    clearShoppingList,
    addRecipeToMenu,
    removeRecipeFromMenu,
    copyWeekToNextWeek,
    loadSampleMenuIdeas,
  };
}