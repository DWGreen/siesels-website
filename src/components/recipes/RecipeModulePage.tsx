"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { mockRecipes } from "@/data/mockRecipes";
import RecipeModuleHeader from "./RecipeModuleHeader";
import { formatWeekKey } from "@/lib/recipes/dateWeeks";
import { RecipeFilters } from "@/types/recipes";
import RecipeHomePanel from "./RecipeHomePanel";
import {
  filterRecipes,
  getUniqueMetaValues,
} from "@/lib/recipes/recipeFilters";

import {
  RecipeUrlFilterKey,
} from "@/lib/recipes/recipeUrls";

import { useRecipeBox } from "@/hooks/useRecipeBox";

import RecipeBrowseBar from "./RecipeBrowseBar";
import RecipeSearchBar from "./RecipeSearchBar";
import RecipeResults from "./RecipeResults";
import RecipeBoxSidebar from "./RecipeBoxSidebar";
import RecipeRightRail from "./RecipeRightRail";
import AdvancedRecipeSearch from "./AdvancedRecipeSearch";
import {
  getRecipeCollectionById,
} from "@/data/mockRecipeCollections";

import RecipeCollectionFeature from "./RecipeCollectionFeature";
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

type RecipeModulePageProps = {
  initialSearchTerm?: string;
  initialMatchMode?: RecipeFilters["matchMode"];
  initialFilterKey?: RecipeUrlFilterKey;
  initialFilterValue?: string;
  initialCategoryValue?: string;
};

const filterKeysFromUrl: RecipeUrlFilterKey[] = [
  "cuisine",
  "diet",
  "mainIngredient",
  "holiday",
  "cookingMethod",
  "course",
];

function buildInitialFiltersFromUrl({
  initialSearchTerm,
  initialMatchMode,
  initialFilterKey,
  initialFilterValue,
  initialCategoryValue,
}: {
  initialSearchTerm: string;
  initialMatchMode: RecipeFilters["matchMode"];
  initialFilterKey?: RecipeUrlFilterKey;
  initialFilterValue: string;
  initialCategoryValue: string;
}): RecipeFilters {
  const nextFilters: RecipeFilters = {
    ...initialFilters,
    searchTerm: initialSearchTerm,
    matchMode: initialMatchMode,
    categoryValue: initialCategoryValue,
  };

  if (
    initialFilterKey &&
    filterKeysFromUrl.includes(initialFilterKey) &&
    initialFilterValue
  ) {
    nextFilters[initialFilterKey] =
      initialFilterValue;
  }

  return nextFilters;
}

export default function RecipeModulePage({
  initialSearchTerm = "",
  initialMatchMode = "every",
  initialFilterKey,
  initialFilterValue = "",
  initialCategoryValue = "",
}: RecipeModulePageProps) {
  const router = useRouter();
  const recipeBox = useRecipeBox();
  const weekKey = formatWeekKey();
const featuredCollection =
  getRecipeCollectionById("family-style");
  const [filters, setFilters] =
    useState<RecipeFilters>(() =>
      buildInitialFiltersFromUrl({
        initialSearchTerm,
        initialMatchMode,
        initialFilterKey,
        initialFilterValue,
        initialCategoryValue,
      })
    );
const isRecipeHome =
  !filters.searchTerm &&
  !filters.cuisine &&
  !filters.diet &&
  !filters.mainIngredient &&
  !filters.holiday &&
  !filters.cookingMethod &&
  !filters.course &&
  !filters.categoryValue;
  const [showAdvanced, setShowAdvanced] =
    useState(false);

  useEffect(() => {
    setFilters(
      buildInitialFiltersFromUrl({
        initialSearchTerm,
        initialMatchMode,
        initialFilterKey,
        initialFilterValue,
        initialCategoryValue,
      })
    );
  }, [
    initialSearchTerm,
    initialMatchMode,
    initialFilterKey,
    initialFilterValue,
    initialCategoryValue,
  ]);

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

  function clearFilters() {
    setFilters(initialFilters);
    router.push("/recipes");
  }

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
    group: string,
    value: string
  ) {
    const normalizedGroup =
      normalizeRightRailGroup(group);

    if (normalizedGroup) {
      setFilters(current => ({
        ...current,
        [normalizedGroup]: value,
        searchTerm: "",
        categoryValue: "",
      }));

      return;
    }

    setFilters(current => ({
      ...current,
      searchTerm: value,
      matchMode: "exact",
    }));
  }

  return (
    <div className="cookingModule bg-white py-2 text-neutral-950">
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
        onClear={clearFilters}
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
           onRemoveRecipeFromMenu={
    recipeBox.removeRecipeFromMenu
  }
  weekKey={weekKey}
        />

        <main id="slideshow_holder">
            {isRecipeHome ? (
    <RecipeHomePanel recipes={mockRecipes} />
  ) : (
          <RecipeResults
          onSelectTag={selectRightRailTag}
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
            onAddToMenu={
              recipeBox.addRecipeToMenu
            }
            weekKey={weekKey}
          />
  )}
        </main>

        <RecipeRightRail
          recipes={mockRecipes}
          onSelectTag={selectRightRailTag}
        />
      </div>
    </div>
  );
}

function normalizeRightRailGroup(
  group: string
): RecipeUrlFilterKey | null {
  const normalized = group
    .toLowerCase()
    .replace(/\s+/g, "");

  if (
    normalized === "cuisine" ||
    normalized === "cuisines"
  ) {
    return "cuisine";
  }

  if (
    normalized === "diet" ||
    normalized === "diets" ||
    normalized === "specialdiets"
  ) {
    return "diet";
  }

  if (
    normalized === "mainingredient" ||
    normalized === "ingredients" ||
    normalized === "ingredient"
  ) {
    return "mainIngredient";
  }

  if (
    normalized === "holiday" ||
    normalized === "holidays" ||
    normalized === "occasion" ||
    normalized === "occasions"
  ) {
    return "holiday";
  }

  if (
    normalized === "cookingmethod" ||
    normalized === "cookingmethods" ||
    normalized === "method" ||
    normalized === "methods"
  ) {
    return "cookingMethod";
  }

  if (
    normalized === "course" ||
    normalized === "courses" ||
    normalized === "mealtype" ||
    normalized === "mealtypes"
  ) {
    return "course";
  }

  return null;
}