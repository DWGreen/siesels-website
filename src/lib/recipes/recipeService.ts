// src/lib/recipes/recipeService.ts

import {
  insertRecipeRatingQuery,
  getRatingSummaryQuery,
  getRecipeClientCountsQuery,
  getRecipeStatusCountsQuery,
} from "./recipeQueries";
import {
  GetRecipeByIdOptions,
  GetRecipesOptions,
  RecipeDetail,
  RecipeIngredient,
  RecipeMetaFilters,
  RecipeMetaMap,
  RecipeMetaOption,
  Recipe,
  RecipeRatingVote,
} from "./recipeTypes";

import {
  CmsRecipeDetail,
  CmsRecipeSummary,
  getFeatured,
  getRecipe,
  getRecipeDefaultClient,
  searchRecipes as searchRecipesApi,
  submitRatingViaWebservice,
} from "./recipeApi";
import { LEGACY_RECIPE_FILTER_OPTIONS } from "./recipeFilterOptions";

const DEFAULT_RECIPE_CLIENT =
  process.env.RECIPES_DEFAULT_CLIENT || "JEN";

function normalizeImage(value?: string) {
  if (!value) {
    return "";
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (value.startsWith("/")) {
    return `https://cms.dwgreen.com${value}`;
  }

  return value;
}

function asNumber(value: number | string | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function splitCsvValues(value: string | string[] | undefined) {
  if (!value) {
    return [] as string[];
  }

  if (Array.isArray(value)) {
    return value
      .map(item => item.trim())
      .filter(Boolean);
  }

  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizeCourse(value?: string) {
  const next = (value ?? "").trim();

  if (!next) {
    return "Dinner";
  }

  return next.charAt(0).toUpperCase() + next.slice(1).toLowerCase();
}

function toIngredientModel(recipeId: number, items: string[] = []): RecipeIngredient[] {
  return items.map((item, index) => ({
    id: recipeId * 1000 + index + 1,
    recipeId,
    ingredient: item,
    description: "",
    whole: 0,
    numerator: 0,
    denominator: 0,
    size: "",
    department: "",
    searchTerm: "",
    displayText: item,
  }));
}

function toRecipeMetaMapFromGroups(groups: CmsRecipeDetail["groups"]): RecipeMetaMap {
  const map: RecipeMetaMap = {};

  const pushValue = (key: string, value: string) => {
    map[key] ??= [];

    map[key].push({
      id: map[key].length + 1,
      recipeId: 0,
      name: key,
      key,
      value,
    });
  };

  for (const [name, value] of Object.entries(groups ?? {})) {
    const normalized = name.toLowerCase().replace(/\s+/g, "");
    const values = splitCsvValues(value);

    values.forEach(item => pushValue(normalized, item));
  }

  return map;
}

function mapSummaryRecipe(summary: CmsRecipeSummary, hint?: {
  course?: string;
  cuisine?: string;
  diet?: string;
  holiday?: string;
  cookingMethod?: string;
  mainIngredient?: string;
}): Recipe {
  const id = asNumber(summary.id);

  return {
    id,
    slug: String(id),
    name: summary.name?.trim() || "Untitled Recipe",
    course: normalizeCourse(hint?.course),
    servings: "",
    rating: asNumber(summary.rating),
    image: normalizeImage(summary.image),
    intro: summary.intro?.trim() || "",
    ingredients: [],
    directions: [],
    meta: {
      cuisine: hint?.cuisine ? [hint.cuisine] : [],
      diet: hint?.diet ? [hint.diet] : [],
      mainIngredient: hint?.mainIngredient ? [hint.mainIngredient] : [],
      holiday: hint?.holiday ? [hint.holiday] : [],
      cookingMethod: hint?.cookingMethod ? [hint.cookingMethod] : [],
      category: [],
    },
    prepTimeMinutes: undefined,
    cookTimeMinutes: undefined,
  };
}

function mapDetailRecipe(detail: CmsRecipeDetail): Recipe {
  const id = asNumber(detail.id);
  const groups = detail.groups ?? {};

  return {
    id,
    slug: String(id),
    name: detail.name?.trim() || "Untitled Recipe",
    course: normalizeCourse(detail.course),
    servings: (detail.servings ?? "").trim(),
    rating: asNumber(detail.rating),
    image: normalizeImage(detail.image),
    intro: detail.intro?.trim() || "",
    ingredients: toIngredientModel(id, detail.ingredients),
    directions: (detail.directions ?? []).map(item => item.trim()).filter(Boolean),
    meta: {
      cuisine: splitCsvValues(groups.Cuisine),
      diet: splitCsvValues(groups.Diet),
      mainIngredient: splitCsvValues(groups.MainIngredient),
      holiday: splitCsvValues(groups.Holiday),
      cookingMethod: splitCsvValues(groups.CookingMethod),
      category: splitCsvValues(groups.Grouping),
    },
    prepTimeMinutes: undefined,
    cookTimeMinutes: undefined,
  };
}

function mapRecipeToDetail(recipe: Recipe, groups?: CmsRecipeDetail["groups"]): RecipeDetail {
  return {
    id: recipe.id,
    rootId: recipe.id,
    name: recipe.name,
    servings: recipe.servings,
    course: recipe.course,
    directions: recipe.directions,
    photo: recipe.image ?? null,
    client: DEFAULT_RECIPE_CLIENT,
    status: 1,
    dateModified: new Date().toISOString(),
    dateAdded: new Date().toISOString(),
    ingredients: recipe.ingredients,
    meta: toRecipeMetaMapFromGroups(groups),
    rating: {
      average: recipe.rating,
      count: 0,
      total: null,
    },
    subRecipes: [],
  };
}

function toMetaOptions(values: readonly string[]): RecipeMetaOption[] {
  return values.map(value => ({
    label: value,
    value,
    total: 0,
  }));
}

function mapFilterOptionsToGroup(options: GetRecipesOptions): Record<string, string[]> {
  const group: Record<string, string[]> = {};

  if (options.course) group.Course = [options.course];
  if (options.cuisine) group.Cuisine = [options.cuisine];
  if (options.diet) group.Diet = [options.diet];
  if (options.holiday) group.Holiday = [options.holiday];
  if (options.cookingMethod) group.CookingMethod = [options.cookingMethod];
  if (options.mainIngredient) group.MainIngredient = [options.mainIngredient];

  return group;
}

function isBrowseRequest(options: GetRecipesOptions = {}) {
  return !options.search &&
    !options.course &&
    !options.cuisine &&
    !options.diet &&
    !options.holiday &&
    !options.cookingMethod &&
    !options.mainIngredient;
}

export async function getRecipes(
  options: GetRecipesOptions = {}
): Promise<Recipe[]> {
  const limit = Math.max(1, options.limit ?? 24);
  const page = Math.floor((options.offset ?? 0) / limit) + 1;

  if (options.ids?.length) {
    return getRecipesByIds(options.ids, options);
  }

  if (Number.isInteger(options.similarToId)) {
    return getSimilarRecipes(Number(options.similarToId), options);
  }

  if (isBrowseRequest(options)) {
    const featured = await getFeatured();
    const cards: CmsRecipeSummary[] = [];

    for (const collection of featured.results?.collections ?? []) {
      cards.push(...(collection.recipes ?? []));
    }

    const mapped = cards
      .map(item => mapSummaryRecipe(item))
      .filter(item => Number.isInteger(item.id) && item.id > 0);

    const unique = Array.from(new Map(mapped.map(item => [item.id, item])).values());

    return unique.slice(0, limit);
  }

  const group = mapFilterOptionsToGroup(options);

  const response = await searchRecipesApi({
    searchterm: options.search,
    group: Object.keys(group).length ? group : undefined,
    page,
    limit,
  });

  const mapped = (response.results?.recipes ?? []).map(recipe =>
    mapSummaryRecipe(recipe, {
      course: options.course,
      cuisine: options.cuisine,
      diet: options.diet,
      holiday: options.holiday,
      cookingMethod: options.cookingMethod,
      mainIngredient: options.mainIngredient,
    })
  );

  const excluded = new Set(options.excludeIds ?? []);

  return mapped.filter(recipe => !excluded.has(recipe.id));
}

export async function searchRecipes(
  search: string,
  options: Omit<GetRecipesOptions, "search"> = {}
): Promise<Recipe[]> {
  return getRecipes({
    ...options,
    search,
  });
}

export async function getSimilarRecipes(
  recipeId: number,
  options: Omit<GetRecipesOptions, "search"> = {}
): Promise<Recipe[]> {
  const base = await getRecipe(recipeId);
  const detail = mapDetailRecipe(base);

  const candidateGroup =
    detail.meta.mainIngredient?.[0] ||
    detail.meta.cuisine?.[0] ||
    detail.meta.diet?.[0] ||
    detail.course;

  if (!candidateGroup) {
    return [];
  }

  const group: Record<string, string[]> = detail.meta.mainIngredient?.[0]
    ? { MainIngredient: [detail.meta.mainIngredient[0]] }
    : detail.meta.cuisine?.[0]
      ? { Cuisine: [detail.meta.cuisine[0]] }
      : detail.meta.diet?.[0]
        ? { Diet: [detail.meta.diet[0]] }
        : { Course: [detail.course] };

  const response = await searchRecipesApi({
    group,
    page: 1,
    limit: options.limit ?? 4,
  });

  return (response.results?.recipes ?? [])
    .map(item => mapSummaryRecipe(item))
    .filter(item => item.id !== recipeId)
    .slice(0, options.limit ?? 4);
}

export async function getRecipesByIds(
  recipeIds: number[],
  options: Omit<GetRecipesOptions, "search"> = {}
): Promise<Recipe[]> {
  if (!recipeIds.length) {
    return [];
  }

  const results = await Promise.all(
    recipeIds.map(async recipeId => {
      try {
        const detail = await getRecipe(recipeId);
        return mapDetailRecipe(detail);
      } catch {
        return null;
      }
    })
  );

  const resolved = results.filter((item): item is Recipe => item !== null);

  const excluded = new Set(options.excludeIds ?? []);

  return resolved.filter(recipe => !excluded.has(recipe.id));
}

export async function getRecipeById(
  recipeId: number,
  options: GetRecipeByIdOptions = {}
): Promise<RecipeDetail | null> {
  try {
    const detail = await getRecipe(recipeId);
    const recipe = mapDetailRecipe(detail);

    return mapRecipeToDetail(recipe, detail.groups);
  } catch {
    return null;
  }
}
export async function getRecipeStatusCounts() {
  return getRecipeStatusCountsQuery();
}

export async function getRecipeClientCounts() {
  return getRecipeClientCountsQuery();
}

export async function getRecipeMetaFilters(): Promise<RecipeMetaFilters> {
  return {
    cuisines: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.cuisines),
    diets: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.diets),
    holidays: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.holidays),
    cookingMethods: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.cookingMethods),
    categories: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.categories),
    courses: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.courses),
    mainIngredients: toMetaOptions(LEGACY_RECIPE_FILTER_OPTIONS.mainIngredients),
  };
}

export async function submitRecipeRating(input: {
  recipeId: number;
  vote: RecipeRatingVote;
  client?: string;
  userId?: number;
  commentId?: number;
}) {
  if (!Number.isInteger(input.recipeId) || input.recipeId <= 0) {
    throw new Error("Invalid recipe id");
  }

  if (!Number.isInteger(input.vote) || input.vote < 1 || input.vote > 5) {
    throw new Error("Invalid vote value");
  }

  const ratingClient =
    input.client?.trim() || DEFAULT_RECIPE_CLIENT;

  const ratingWriteMode =
    process.env.RECIPE_RATING_WRITE_MODE?.trim().toLowerCase() || "db";

  if (ratingWriteMode === "webservice") {
    try {
      const response = await submitRatingViaWebservice({
        recipeId: input.recipeId,
        vote: input.vote,
        client: ratingClient || getRecipeDefaultClient(),
        userId: input.userId,
      });

      if (!response.rating) {
        throw new Error("Webservice rating response missing summary");
      }

      return {
        average: Number(response.rating.average ?? input.vote),
        count: Number(response.rating.count ?? 1),
        total: Number(response.rating.total ?? input.vote),
      };
    } catch (error) {
      console.warn(
        "Recipe rating webservice write failed, falling back to DB",
        error
      );
    }
  }

  await insertRecipeRatingQuery({
    recipeId: input.recipeId,
    vote: input.vote,
    client: ratingClient,
    userId: input.userId,
    commentId: input.commentId,
  });

  const summary = await getRatingSummaryQuery(input.recipeId, {
    client: ratingClient,
    includeBlankClient: true,
  });

  return {
    average: summary?.rating_average ?? input.vote,
    count: summary?.rating_count ?? 1,
    total: summary?.rating_total ?? input.vote,
  };
}