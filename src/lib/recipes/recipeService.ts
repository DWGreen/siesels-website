// src/lib/recipes/recipeService.ts

import {
  getIngredientsForRecipesQuery,
  getMetaForRecipesQuery,
  insertRecipeRatingQuery,
  getRatingSummaryQuery,
  getRecipesQuery,
  getRecipeClientCountsQuery,
  getRecipeMetaOptionsQuery,
  getRecipeRowsForDetailQuery,
  getRecipeStatusCountsQuery,
} from "./recipeQueries";
import {
  GetRecipeByIdOptions,
  GetRecipesOptions,
  RecipeDetail,
  RecipeMetaFilters,
  Recipe,
  RecipeRatingVote,
} from "./recipeTypes";

import { buildRecipeDetail, mapRecipes } from "./recipeMapper";
import { RECIPE_META_KEYS } from "./recipeMetaConfig";

const DEFAULT_RECIPE_CLIENT =
  process.env.RECIPES_DEFAULT_CLIENT || "JEN";
export async function getRecipes(
  options: GetRecipesOptions = {}
): Promise<Recipe[]> {
const rows = await getRecipesQuery({
  status: 1,
  limit: 24,
  offset: 0,
  ...(options.allClients
    ? { includeBlankClient: false }
    : {
        client: DEFAULT_RECIPE_CLIENT,
        includeBlankClient: true,
      }),
  ...options,
});

const recipeIds = rows.map(
  row => row.recipe_id
);

const metaRows =
  await getMetaForRecipesQuery(recipeIds);

return mapRecipes(
  rows,
  metaRows
);
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
  const rows = await getRecipesQuery({
    status: 1,
    limit: 4,
    offset: 0,
    client: DEFAULT_RECIPE_CLIENT,
    includeBlankClient: true,
    ...options,
    similarToId: recipeId,
  });

  const recipeIds = rows.map(
    row => row.recipe_id
  );

  const metaRows =
    await getMetaForRecipesQuery(recipeIds);

  return mapRecipes(
    rows,
    metaRows
  );
}

export async function getRecipesByIds(
  recipeIds: number[],
  options: Omit<GetRecipesOptions, "search"> = {}
): Promise<Recipe[]> {
  if (!recipeIds.length) {
    return [];
  }

  const rows = await getRecipesQuery({
    status: 1,
    limit: recipeIds.length,
    offset: 0,
    client: DEFAULT_RECIPE_CLIENT,
    includeBlankClient: true,
    ...options,
    ids: recipeIds,
  });

  const resolvedRecipeIds = rows.map(
    row => row.recipe_id
  );

  const metaRows =
    await getMetaForRecipesQuery(resolvedRecipeIds);

  return mapRecipes(
    rows,
    metaRows
  );
}

export async function getRecipeById(
  recipeId: number,
  options: GetRecipeByIdOptions = {}
): Promise<RecipeDetail | null> {
  const recipeRows = await getRecipeRowsForDetailQuery(recipeId, {
    client: DEFAULT_RECIPE_CLIENT,
    includeBlankClient: true,
    includeInactiveForDetail: false,
    ...options,
  });

  if (!recipeRows.length) {
    return null;
  }

  const recipeIds = recipeRows.map(row => row.recipe_id);

  const [ingredientRows, metaRows, ratingRow] =
    await Promise.all([
      getIngredientsForRecipesQuery(recipeIds),
      getMetaForRecipesQuery(recipeIds),
      getRatingSummaryQuery(recipeId, {
        client: DEFAULT_RECIPE_CLIENT,
        includeBlankClient: true,
        ...options,
      }),
    ]);

  return buildRecipeDetail(
    recipeRows,
    ingredientRows,
    metaRows,
    ratingRow
  );
}
export async function getRecipeStatusCounts() {
  return getRecipeStatusCountsQuery();
}

export async function getRecipeClientCounts() {
  return getRecipeClientCountsQuery();
}

export async function getRecipeMetaFilters(): Promise<RecipeMetaFilters> {
  const options = {
    client: DEFAULT_RECIPE_CLIENT,
    includeBlankClient: true,
  };

  const [
    cuisines,
    diets,
    holidays,
    cookingMethods,
    categories,
    courses,
    mainIngredients,
  ] = await Promise.all([
    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.cuisine,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.diet,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.holiday,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.cookingMethod,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.category,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.courses,
      options
    ),

    getRecipeMetaOptionsQuery(
      RECIPE_META_KEYS.mainIngredient,
      options
    ),
  ]);

  return {
    cuisines,
    diets,
    holidays,
    cookingMethods,
    categories,
    courses,
    mainIngredients,
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