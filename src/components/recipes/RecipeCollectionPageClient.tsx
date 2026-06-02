"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RecipeBoxSidebar from "./RecipeBoxSidebar";
import RecipeCollectionFeature from "./RecipeCollectionFeature";
import RecipeCollectionRail from "./RecipeCollectionRail";
import RecipeResults from "./RecipeResults";

import { useRecipeBox } from "@/hooks/useRecipeBox";


import {
  HydratedRecipeCollection,
  RecipeCollection,
  RecipeFilters,
} from "@/lib/recipes/recipeTypes";
import { formatWeekKey } from "@/lib/recipes/dateWeeks";
import { Recipe } from "@/lib/recipes/recipeTypes";
import { buildRecipeFilterUrl } from "@/lib/recipes/recipeUrls";


type Props = {
  collection: HydratedRecipeCollection;
  relatedCollections: RecipeCollection[];
};

export default function RecipeCollectionPageClient({
  collection,
  relatedCollections,
}: Props) {
  const router = useRouter();
  const recipeBox = useRecipeBox();
  const weekKey = formatWeekKey();
  const [savedRecipes, setSavedRecipes] =
    useState<Recipe[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedRecipes() {
      const ids = recipeBox.state.savedRecipes.map(
        item => item.recipeId
      );

      if (!ids.length) {
        setSavedRecipes([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          ids: ids.join(","),
          limit: String(ids.length),
        });

        const response = await fetch(
          `/api/recipes?${params.toString()}`
        );

        if (!response.ok || !isMounted) {
          return;
        }

        const data = await response.json();
        setSavedRecipes(data.recipes ?? []);
      } catch {
        if (isMounted) {
          setSavedRecipes([]);
        }
      }
    }

    loadSavedRecipes();

    return () => {
      isMounted = false;
    };
  }, [recipeBox.state.savedRecipes]);

  function normalizeFilterKey(
    group: string
  ): keyof Pick<
    RecipeFilters,
    | "cuisine"
    | "diet"
    | "mainIngredient"
    | "holiday"
    | "cookingMethod"
    | "course"
  > | null {
    if (
      group === "cuisine" ||
      group === "diet" ||
      group === "mainIngredient" ||
      group === "holiday" ||
      group === "cookingMethod" ||
      group === "course"
    ) {
      return group;
    }

    return null;
  }

  function handleSelectTag(group: string, value: string) {
    const filter = normalizeFilterKey(group);

    if (!filter) {
      return;
    }

    router.push(buildRecipeFilterUrl(filter, value));
  }

  return (
    <div
      className="
        mx-auto
        grid
        max-w-6xl
        gap-4
        px-4
        py-4
        lg:grid-cols-[280px_1fr_260px]
      "
    >
      <RecipeBoxSidebar
        savedRecipes={savedRecipes}
        state={recipeBox.state}
        onRemoveSavedRecipe={
          recipeBox.removeSavedRecipe
        }
        onAddCustomShoppingItem={
          recipeBox.addCustomShoppingItem
        }
        onRemoveShoppingItem={
          recipeBox.removeShoppingItem
        }
        onRemoveRecipeFromMenu={
    recipeBox.removeRecipeFromMenu
  }
  weekKey={weekKey}
      />

      <main>
        <RecipeCollectionFeature collection={collection} />

        <RecipeResults
          recipes={collection.recipes}
          savedRecipeIds={recipeBox.savedRecipeIds}
          onToggleSaved={recipeBox.toggleSavedRecipe}
          onAddIngredients={
            recipeBox.addRecipeIngredientsToShoppingList
          }
          onAddToMenu={recipeBox.addRecipeToMenu}
          onSelectTag={handleSelectTag}
          weekKey={weekKey}
        />
      </main>

      <RecipeCollectionRail
        collections={relatedCollections}
      />
    </div>
  );
}