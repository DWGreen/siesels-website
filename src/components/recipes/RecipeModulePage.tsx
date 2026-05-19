"use client";

import { useMemo, useState } from "react";

import { mockRecipes } from "@/data/mockRecipes";
import RecipeModuleHeader from "./RecipeModuleHeader";
import {
  RecipeFilters,
} from "@/types/recipes";

import {
  filterRecipes,
  getUniqueMetaValues,
} from "@/lib/recipes/recipeFilters";

import { useRecipeBox } from "@/hooks/useRecipeBox";

import RecipeBrowseBar from "./RecipeBrowseBar";
import RecipeSearchBar from "./RecipeSearchBar";
import RecipeResults from "./RecipeResults";
import RecipeBoxSidebar from "./RecipeBoxSidebar";
import RecipeRightRail from "./RecipeRightRail";
import AdvancedRecipeSearch from "./AdvancedRecipeSearch";

const initialFilters: RecipeFilters = {
  searchTerm: "",
  matchMode: "every",
  cuisine: "",
  diet: "",
  mainIngredient: "",
  holiday: "",
  cookingMethod: "",
  course: "",
  categoryValue: "",
};

export default function RecipeModulePage() {
  const [filters, setFilters] =
    useState<RecipeFilters>(initialFilters);

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const recipeBox = useRecipeBox();

  const browseGroups = useMemo(
    () => [
      {
        label: "Cuisines",
        value: "cuisine" as const,
        options: getUniqueMetaValues(
          mockRecipes,
          "cuisine"
        ),
      },
      {
        label: "Special Diets",
        value: "diet" as const,
        options: getUniqueMetaValues(
          mockRecipes,
          "diet"
        ),
      },
      {
        label: "Main Ingredient",
        value: "mainIngredient" as const,
        options: getUniqueMetaValues(
          mockRecipes,
          "mainIngredient"
        ),
      },
      {
        label: "Occasions",
        value: "holiday" as const,
        options: getUniqueMetaValues(
          mockRecipes,
          "holiday"
        ),
      },
      {
        label: "Cooking Method",
        value: "cookingMethod" as const,
        options: getUniqueMetaValues(
          mockRecipes,
          "cookingMethod"
        ),
      },
    ],
    []
  );

  const categoryGroups = useMemo(
    () => [
      {
        label: "Cuisines",
        prefix: "Cuisine",
        options: getUniqueMetaValues(
          mockRecipes,
          "cuisine"
        ),
      },
      {
        label: "Special Diets",
        prefix: "Diet",
        options: getUniqueMetaValues(
          mockRecipes,
          "diet"
        ),
      },
      {
        label: "Main Ingredient",
        prefix: "MainIngredient",
        options: getUniqueMetaValues(
          mockRecipes,
          "mainIngredient"
        ),
      },
      {
        label: "Occasions",
        prefix: "Holiday",
        options: getUniqueMetaValues(
          mockRecipes,
          "holiday"
        ),
      },
      {
        label: "Cooking Method",
        prefix: "CookingMethod",
        options: getUniqueMetaValues(
          mockRecipes,
          "cookingMethod"
        ),
      },
    ],
    []
  );

  const filteredRecipes = useMemo(
    () => filterRecipes(mockRecipes, filters),
    [filters]
  );

  function updateFilter(
    key: keyof RecipeFilters,
    value: string
  ) {
    setFilters(current => ({
      ...current,
      [key]: value,
    }));
  }

  function selectRightRailTag(
    _group: string,
    value: string
  ) {
    setFilters(current => ({
      ...current,
      searchTerm: value,
      matchMode: "exact",
    }));
  }

  return (
    <div className="cookingModule bg-white text-neutral-950">
      <RecipeModuleHeader
  title="Cooking"
  subtitle="Browse recipes, save favorites, plan weekly meals, and build a shopping list."
/>

      <RecipeBrowseBar
        filters={filters}
        groups={browseGroups}
        onChange={updateFilter}
      />

      <RecipeSearchBar
        filters={filters}
        categoryGroups={categoryGroups}
        onChange={updateFilter}
        onClear={() =>
          setFilters(initialFilters)
        }
        onAdvancedSearch={() =>
          setShowAdvanced(true)
        }
      />

      {showAdvanced && (
        <AdvancedRecipeSearch
          recipes={mockRecipes}
          filters={filters}
          onApply={nextFilters => {
            setFilters(nextFilters);
            setShowAdvanced(false);
          }}
          onClose={() =>
            setShowAdvanced(false)
          }
        />
      )}

      <div
        className="
          grid
          min-h-screen
          lg:grid-cols-[280px_1fr_260px]
        "
      >
        <RecipeBoxSidebar
          recipes={mockRecipes}
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
        />

        <main id="slideshow_holder">
          <RecipeResults
            recipes={filteredRecipes}
            savedRecipeIds={
              recipeBox.savedRecipeIds
            }
            onToggleSaved={
              recipeBox.toggleSavedRecipe
            }
            onAddIngredients={
              recipeBox.addRecipeIngredientsToShoppingList
            }
            onAddToMenu={recipeBox.addRecipeToMenu}
          />
        </main>

        <RecipeRightRail
          recipes={mockRecipes}
          onSelectTag={selectRightRailTag}
        />
      </div>
    </div>
  );
}