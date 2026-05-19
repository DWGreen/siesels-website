import {
  Recipe,
  RecipeFilters,
} from "@/types/recipes";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function recipeText(recipe: Recipe) {
  return [
    recipe.name,
    recipe.course,
    recipe.intro,
    ...recipe.ingredients.map(
      ingredient => ingredient.name
    ),
    ...Object.values(recipe.meta).flat(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSearch(
  recipe: Recipe,
  searchTerm: string,
  matchMode: RecipeFilters["matchMode"]
) {
  const term = normalize(searchTerm);

  if (!term) return true;

  const text = recipeText(recipe);
  const words = term
    .split(/\s+/)
    .filter(Boolean);

  if (matchMode === "exact") {
    return text.includes(term);
  }

  if (matchMode === "any") {
    return words.some(word => text.includes(word));
  }

  return words.every(word => text.includes(word));
}

function includesMeta(
  values: string[] | undefined,
  selected: string
) {
  if (!selected) return true;

  return values?.some(
    value => normalize(value) === normalize(selected)
  );
}

function matchesCategoryValue(
  recipe: Recipe,
  categoryValue: string
) {
  if (!categoryValue) return true;

  const [group, value] = categoryValue.split("|");

  if (!group || !value) return true;

  switch (group) {
    case "Cuisine":
      return includesMeta(recipe.meta.cuisine, value);

    case "Diet":
      return includesMeta(recipe.meta.diet, value);

    case "MainIngredient":
      return includesMeta(
        recipe.meta.mainIngredient,
        value
      );

    case "Holiday":
      return includesMeta(recipe.meta.holiday, value);

    case "CookingMethod":
      return includesMeta(
        recipe.meta.cookingMethod,
        value
      );

    default:
      return true;
  }
}

export function filterRecipes(
  recipes: Recipe[],
  filters: RecipeFilters
) {
  return recipes.filter(recipe => {
    if (
      !matchesSearch(
        recipe,
        filters.searchTerm,
        filters.matchMode
      )
    ) {
      return false;
    }

    if (
      filters.course &&
      recipe.course !== filters.course
    ) {
      return false;
    }

    if (
      !includesMeta(
        recipe.meta.cuisine,
        filters.cuisine
      )
    ) {
      return false;
    }

    if (
      !includesMeta(recipe.meta.diet, filters.diet)
    ) {
      return false;
    }

    if (
      !includesMeta(
        recipe.meta.mainIngredient,
        filters.mainIngredient
      )
    ) {
      return false;
    }

    if (
      !includesMeta(
        recipe.meta.holiday,
        filters.holiday
      )
    ) {
      return false;
    }

    if (
      !includesMeta(
        recipe.meta.cookingMethod,
        filters.cookingMethod
      )
    ) {
      return false;
    }

    if (
      !matchesCategoryValue(
        recipe,
        filters.categoryValue
      )
    ) {
      return false;
    }

    return true;
  });
}

export function getUniqueMetaValues(
  recipes: Recipe[],
  key: keyof Recipe["meta"]
) {
  return Array.from(
    new Set(
      recipes.flatMap(recipe => recipe.meta[key] ?? [])
    )
  ).sort((a, b) => a.localeCompare(b));
}