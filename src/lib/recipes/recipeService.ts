// src/lib/recipes/recipeService.ts

import {
  getIngredientsForRecipesQuery,
  getMetaForRecipesQuery,
  getRatingSummaryQuery,
  getRecipeCardsQuery,
  getRecipeClientCountsQuery,
  getRecipeRowsForDetailQuery,
  getRecipeStatusCountsQuery,
} from "./recipeQueries";
import {
  GetRecipeByIdOptions,
  GetRecipesOptions,
  RecipeCard,
  RecipeDetail,
  
} from "./recipeTypes";
import { buildRecipeDetail, mapRecipeCards } from "./recipeMapper";
const DEFAULT_RECIPE_CLIENT =
  process.env.RECIPES_DEFAULT_CLIENT || "JEN";
export async function getRecipes(
  options: GetRecipesOptions = {}
): Promise<RecipeCard[]> {
  const rows = await getRecipeCardsQuery({
  status: 1,
  limit: 24,
  offset: 0,
  client: DEFAULT_RECIPE_CLIENT,
  includeBlankClient: true,
  ...options,
});

return mapRecipeCards(rows);
}

export async function searchRecipes(
  search: string,
  options: Omit<GetRecipesOptions, "search"> = {}
): Promise<RecipeCard[]> {
  return getRecipes({
    ...options,
    search,
  });
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