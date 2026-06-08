"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";


import RecipeModuleHeader from "./RecipeModuleHeader";
import { formatWeekKey } from "@/lib/recipes/dateWeeks";
import {
  Recipe,
  RecipeCollection,
  RecipeFilters,
} from "@/lib/recipes/recipeTypes";
import RecipeHomePanel from "./RecipeHomePanel";


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
  forceShowResults?: boolean;
};

const filterKeysFromUrl: RecipeUrlFilterKey[] = [
  "cuisine",
  "diet",
  "mainIngredient",
  "holiday",
  "cookingMethod",
  "course",
];

const RECIPE_PAGE_SIZE = 24;

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
  forceShowResults = false,
}: RecipeModulePageProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [topFavoriteRecipes, setTopFavoriteRecipes] =
    useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] =
    useState<Recipe[]>([]);
  const [isLoadingSavedRecipes, setIsLoadingSavedRecipes] =
    useState(true);
  const [homeCollections, setHomeCollections] =
    useState<RecipeCollection[]>([]);
  const [isLoadingHomeCollections, setIsLoadingHomeCollections] =
    useState(true);
  const [isLoadingTopFavorites, setIsLoadingTopFavorites] =
    useState(true);
  
  const [metaFilters, setMetaFilters] =
  useState<{
    cuisines: string[];
    diets: string[];
    holidays: string[];
    cookingMethods: string[];
    mainIngredients: string[];
    categories: string[];
    courses: string[];
  }>({
    cuisines: [],
    diets: [],
    holidays: [],
    cookingMethods: [],
    mainIngredients: [],
    categories: [],
    courses: [],
  });
  const [isLoadingRecipes, setIsLoadingRecipes] =
  useState(true);
  const [isLoadingMoreRecipes, setIsLoadingMoreRecipes] =
    useState(false);
  const [hasMoreRecipes, setHasMoreRecipes] =
    useState(false);
  const [nextRecipeCursor, setNextRecipeCursor] =
    useState<string | null>(null);
  const recipeRequestVersionRef = useRef(0);

const [recipeLoadError, setRecipeLoadError] =
  useState<string | null>(null);
const [isLoadingMetaFilters, setIsLoadingMetaFilters] =
  useState(true);
  const router = useRouter();
  const recipeBox = useRecipeBox();
  const weekKey = formatWeekKey();
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
  !forceShowResults &&
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
// Update your main recipe loading hook to pass everything down to your backend service layer
useEffect(() => {
  let isMounted = true;

  async function loadTopFavorites() {
    try {
      if (isMounted) {
        setIsLoadingTopFavorites(true);
      }
      const response = await fetch(
        "/api/recipes?limit=10&sort=rating",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load top favorites (${response.status})`
        );
      }

      const data = await response.json();

      if (isMounted) {
        setTopFavoriteRecipes(data.recipes ?? []);
      }
    } catch (error) {
      console.error(
        "Failed to load top favorites",
        error
      );

      if (isMounted) {
        setTopFavoriteRecipes([]);
      }
    } finally {
      if (isMounted) {
        setIsLoadingTopFavorites(false);
      }
    }
  }

  loadTopFavorites();

  return () => {
    isMounted = false;
  };
}, []);

useEffect(() => {
  let isMounted = true;
  const requestVersion = recipeRequestVersionRef.current + 1;
  recipeRequestVersionRef.current = requestVersion;

  async function loadInitialRecipePage() {
    try {
      setIsLoadingRecipes(true);
      setRecipeLoadError(null);

      const params = new URLSearchParams();
      params.set("limit", String(RECIPE_PAGE_SIZE));

      if (filters.searchTerm) {
        params.set("search", filters.searchTerm);
      }
      if (filters.course) {
        params.set("course", filters.course);
      }
      if (filters.cuisine) {
        params.set("cuisine", filters.cuisine);
      }
      if (filters.diet) {
        params.set("diet", filters.diet);
      }
      if (filters.mainIngredient) {
        params.set("mainIngredient", filters.mainIngredient);
      }
      if (filters.holiday) {
        params.set("holiday", filters.holiday);
      }
      if (filters.cookingMethod) {
        params.set("cookingMethod", filters.cookingMethod);
      }

      const response = await fetch(
        `/api/recipes?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load recipes (${response.status})`
        );
      }

      const data = await response.json();

      if (
        !isMounted ||
        recipeRequestVersionRef.current !== requestVersion
      ) {
        return;
      }

      setRecipes(data.recipes ?? []);
      setHasMoreRecipes(Boolean(data.hasMore));
      setNextRecipeCursor(data.nextCursor ?? null);
    } catch (error) {
      console.error("API error fetching recipes:", error);

      if (
        isMounted &&
        recipeRequestVersionRef.current === requestVersion
      ) {
        setRecipeLoadError("Failed to load recipes.");
        setRecipes([]);
        setHasMoreRecipes(false);
        setNextRecipeCursor(null);
      }
    } finally {
      if (
        isMounted &&
        recipeRequestVersionRef.current === requestVersion
      ) {
        setIsLoadingRecipes(false);
        setIsLoadingMoreRecipes(false);
      }
    }
  }

  loadInitialRecipePage();

  return () => {
    isMounted = false;
  };
}, [filters]);

const loadMoreRecipes = useCallback(async () => {
  if (
    isRecipeHome ||
    isLoadingRecipes ||
    isLoadingMoreRecipes ||
    !hasMoreRecipes ||
    !nextRecipeCursor
  ) {
    return;
  }

  const requestVersion = recipeRequestVersionRef.current;

  try {
    setIsLoadingMoreRecipes(true);

    const params = new URLSearchParams();
    params.set("limit", String(RECIPE_PAGE_SIZE));
    params.set("cursor", nextRecipeCursor);

    if (filters.searchTerm) {
      params.set("search", filters.searchTerm);
    }
    if (filters.course) {
      params.set("course", filters.course);
    }
    if (filters.cuisine) {
      params.set("cuisine", filters.cuisine);
    }
    if (filters.diet) {
      params.set("diet", filters.diet);
    }
    if (filters.mainIngredient) {
      params.set("mainIngredient", filters.mainIngredient);
    }
    if (filters.holiday) {
      params.set("holiday", filters.holiday);
    }
    if (filters.cookingMethod) {
      params.set("cookingMethod", filters.cookingMethod);
    }

    const response = await fetch(
      `/api/recipes?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load more recipes (${response.status})`
      );
    }

    const data = await response.json();

    if (recipeRequestVersionRef.current !== requestVersion) {
      return;
    }

    const nextBatch = data.recipes ?? [];

    setRecipes(current => {
      const merged = [...current, ...nextBatch];
      return Array.from(
        new Map(merged.map(recipe => [recipe.id, recipe])).values()
      );
    });

    setHasMoreRecipes(Boolean(data.hasMore));
    setNextRecipeCursor(data.nextCursor ?? null);
  } catch (error) {
    console.error("Failed to load more recipes", error);

    if (recipeRequestVersionRef.current === requestVersion) {
      setHasMoreRecipes(false);
    }
  } finally {
    if (recipeRequestVersionRef.current === requestVersion) {
      setIsLoadingMoreRecipes(false);
    }
  }
}, [
  filters,
  hasMoreRecipes,
  isLoadingMoreRecipes,
  isLoadingRecipes,
  isRecipeHome,
  nextRecipeCursor,
]);

useEffect(() => {
  let isMounted = true;

  async function loadSavedRecipes() {
    try {
      if (isMounted) {
        setIsLoadingSavedRecipes(true);
      }
      const ids = recipeBox.state.savedRecipes.map(
        item => item.recipeId
      );

      if (!ids.length) {
        if (isMounted) {
          setSavedRecipes([]);
          setIsLoadingSavedRecipes(false);
        }

        return;
      }

      const params = new URLSearchParams();
      params.set("ids", ids.join(","));
      params.set("limit", String(ids.length));

      const response = await fetch(
        `/api/recipes?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load saved recipes (${response.status})`
        );
      }

      const data = await response.json();

      if (!isMounted) {
        return;
      }

      setSavedRecipes(data.recipes ?? []);
    } catch (error) {
      console.error("Failed to load saved recipes", error);

      if (isMounted) {
        setSavedRecipes([]);
      }
    } finally {
      if (isMounted) {
        setIsLoadingSavedRecipes(false);
      }
    }
  }

  loadSavedRecipes();

  return () => {
    isMounted = false;
  };
}, [recipeBox.state.savedRecipes]);

useEffect(() => {
  let isMounted = true;

  async function loadHomeCollections() {
    try {
      if (isMounted) {
        setIsLoadingHomeCollections(true);
      }
      const response = await fetch(
        "/api/recipes/collections?limit=8",
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load collections (${response.status})`
        );
      }

      const data = await response.json();

      if (isMounted) {
        setHomeCollections(data.collections ?? []);
      }
    } catch (error) {
      console.error(
        "Failed to load home collections",
        error
      );

      if (isMounted) {
        setHomeCollections([]);
      }
    } finally {
      if (isMounted) {
        setIsLoadingHomeCollections(false);
      }
    }
  }

  loadHomeCollections();

  return () => {
    isMounted = false;
  };
}, []);

useEffect(() => {
  let isMounted = true;

  async function loadMetaFilters() {
    try {
      if (isMounted) {
        setIsLoadingMetaFilters(true);
      }
      const response = await fetch(
        "/api/recipes/meta"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load recipe metadata (${response.status})`
        );
      }

      const data = await response.json();

      if (!isMounted) {
        return;
      }

      setMetaFilters({
        cuisines:
          data.cuisines?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        diets:
          data.diets?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        holidays:
          data.holidays?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        cookingMethods:
          data.cookingMethods?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        mainIngredients:
          data.mainIngredients?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        categories:
          data.categories?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],

        courses:
          data.courses?.map(
            (item: { value: string }) =>
              item.value
          ) ?? [],
      });
    } catch (error) {
      console.error(
        "Failed to load metadata",
        error
      );
    } finally {
      if (isMounted) {
        setIsLoadingMetaFilters(false);
      }
    }
  }

  loadMetaFilters();

  return () => {
    isMounted = false;
  };
}, []);

//this is where we construct the drop downs for the browse bar and populate the options, 
  const browseGroups = useMemo(
  () => [
    {
      label: "Cuisines",
      value: "cuisine" as const,
      options: metaFilters.cuisines,
    },

    {
      label: "Special Diets",
      value: "diet" as const,
      options: metaFilters.diets,
    },

    {
      label: "Main Ingredient",
      value: "mainIngredient" as const,
      options: metaFilters.mainIngredients,
    },

    {
      label: "Occasions",
      value: "holiday" as const,
      options: metaFilters.holidays,
    },

    {
      label: "Cooking Method",
      value: "cookingMethod" as const,
      options: metaFilters.cookingMethods,
    },
  ],
  [metaFilters]
);

  const categoryGroups = useMemo(
  () => [
    {
      label: "Cuisines",
      prefix: "Cuisine",
      options: metaFilters.cuisines,
    },

    {
      label: "Special Diets",
      prefix: "Diet",
      options: metaFilters.diets,
    },

    {
      label: "Main Ingredient",
      prefix: "MainIngredient",
      options: metaFilters.mainIngredients,
    },

    {
      label: "Occasions",
      prefix: "Holiday",
      options: metaFilters.holidays,
    },

    {
      label: "Cooking Method",
      prefix: "CookingMethod",
      options: metaFilters.cookingMethods,
    },
  ],
  [metaFilters]
);


  function clearFilters() {
    setFilters(initialFilters);
    router.push("/cooking");
  }
function updateFilter<K extends keyof RecipeFilters>(
  key: K,
  value: RecipeFilters[K]
) {
  setFilters(current => {
    // Preserve current selections rather than wiping out sibling parameters
    const nextFilters = {
      ...current,
      [key]: value,
    };

    // If updating the unified category dropdown, parse out and sync explicit properties
    if (key === "categoryValue" && typeof value === "string") {
      // Clear out old contextual matches first
      nextFilters.cuisine = "";
      nextFilters.diet = "";
      nextFilters.mainIngredient = "";
      nextFilters.holiday = "";
      nextFilters.cookingMethod = "";

      if (value) {
        const [prefix, actualValue] = value.split("|");
        if (prefix && actualValue) {
          // Map "Cuisine" -> "cuisine", "MainIngredient" -> "mainIngredient"
          const targetKey = (prefix.charAt(0).toLowerCase() + prefix.slice(1)) as keyof RecipeFilters;
          if (targetKey in nextFilters) {
            nextFilters[targetKey] = actualValue as any;
          }
        }
      }
    }

    return nextFilters;
  });
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
        isLoading={isLoadingMetaFilters}
        onChange={updateFilter}
      />

      <RecipeSearchBar
        filters={filters}
        categoryGroups={categoryGroups}
        isLoadingMeta={isLoadingMetaFilters}
        onChange={updateFilter}
        onClear={clearFilters}
        onAdvancedSearch={() =>
          setShowAdvanced(true)
        }
      />

      {showAdvanced && (
        <AdvancedRecipeSearch
          recipes={recipes}
          filters={filters}
          groups={browseGroups}
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
          savedRecipes={savedRecipes}
          isLoadingSavedRecipes={isLoadingSavedRecipes}
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
    <RecipeHomePanel
      recipes={topFavoriteRecipes}
      collections={homeCollections}
      isLoadingFavorites={isLoadingTopFavorites}
      isLoadingCollections={isLoadingHomeCollections}
    />
  ) : (
          <RecipeResults
          onSelectTag={selectRightRailTag}
            recipes={recipes}
            isLoading={isLoadingRecipes}
            loadError={recipeLoadError}
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
            hasMore={hasMoreRecipes}
            isLoadingMore={isLoadingMoreRecipes}
            onLoadMore={loadMoreRecipes}
          />
  )}
        </main>

        <RecipeRightRail
          recipes={recipes}
          isLoadingRecipes={isLoadingRecipes}
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