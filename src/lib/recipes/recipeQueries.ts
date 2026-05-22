// src/lib/recipes/recipeQueries.ts

import { queryRows, type QueryParamValue } from "./recipeDb";
import {databaseName} from "@/config/databaseConfig";
import {
  GetRecipeByIdOptions,
  GetRecipesOptions,
  RecipeCard,
  RecipeIngredientRow,
  RecipeMetaRow,
  RecipeRatingSummaryRow,
  RecipeRow,
  RecipeStatus,
} from "./recipeTypes";

function normalizeClients(
  options: {
    client?: string;
    clients?: string[];
    includeBlankClient?: boolean;
  } = {}
): string[] {
  const clients = [
    ...(options.clients ?? []),
    ...(options.client ? [options.client] : []),
  ]
    .map(client => client.trim())
    .filter(Boolean);

  if (options.includeBlankClient !== false) {
    clients.push("");
  }

  return Array.from(new Set(clients));
}

function buildClientFilter(
  columnName: string,
  clients: string[]
): {
  sql: string;
  params: QueryParamValue[];
} {
  if (!clients.length) {
    return {
      sql: "",
      params: [],
    };
  }

  return {
    sql: `AND ${columnName} IN (${clients.map(() => "?").join(", ")})`,
    params: clients,
  };
}

export async function getRecipeCardsQuery(
  options: GetRecipesOptions = {}
): Promise<RecipeCard[]> {
  const {
    limit = 24,
    offset = 0,
    search,
    status = 1,
  } = options;

  const clients = normalizeClients(options);

  const clientFilter = buildClientFilter(
    "r.recipe_client",
    clients
  );

  const hasSearch = Boolean(search?.trim());
  const searchLike = `%${search?.trim() ?? ""}%`;

  const searchJoins = hasSearch
    ? `
      LEFT JOIN recipes_meta m
        ON m.meta_recipe_id = r.recipe_id

      LEFT JOIN recipes_ingredient_lu i
        ON i.lu_recipe_id = r.recipe_id
    `
    : "";

  const searchSql = hasSearch
    ? `
      AND (
        r.recipe_name LIKE ?
        OR r.recipe_course LIKE ?
        OR m.meta_value LIKE ?
        OR i.lu_ingredient LIKE ?
        OR i.lu_description LIKE ?
        OR i.lu_searchterm LIKE ?
      )
    `
    : "";

  const sql = `
    SELECT DISTINCT
      r.recipe_id AS id,
      r.recipe_name AS name,
      r.recipe_servings AS servings,
      r.recipe_course AS course,
      r.recipe_photo AS photo,

      r.recipe_client AS client,
      r.recipe_date_modified AS dateModified,
      intro.meta_value AS intro
    FROM recipes r

    LEFT JOIN recipes_meta intro
      ON intro.meta_recipe_id = r.recipe_id
     AND LOWER(intro.meta_name) = 'recipeintro'

    ${searchJoins}

    WHERE r.recipe_status = ?
      AND r.recipe_root_id = 0
      ${clientFilter.sql}
      ${searchSql}

    ORDER BY r.recipe_date_modified DESC, r.recipe_id DESC
    LIMIT ? OFFSET ?
  `;

  const params: QueryParamValue[] = [
    status,
    ...clientFilter.params,
  ];

  if (hasSearch) {
    params.push(
      searchLike,
      searchLike,
      searchLike,
      searchLike,
      searchLike,
      searchLike
    );
  }

  params.push(limit, offset);

  return queryRows<RecipeCard>(sql, params);
}

export async function getRecipeRowsForDetailQuery(
  recipeId: number,
  options: GetRecipeByIdOptions = {}
): Promise<RecipeRow[]> {
  const clients = normalizeClients(options);

  const clientFilter = buildClientFilter(
    "r.recipe_client",
    clients
  );

  const statusFilter = options.includeInactiveForDetail
    ? "AND r.recipe_status != 4"
    : "AND r.recipe_status = 1";

  const sql = `
    SELECT
      r.recipe_id,
      r.recipe_root_id,
      r.recipe_name,
      r.recipe_servings,
      r.recipe_course,
      r.recipe_directions,
      r.recipe_photo,


      r.recipe_photo_removed,
      r.recipe_client,
      r.recipe_date_modified,
      r.recipe_date_added,
      r.recipe_status,
      r.recipe_import_id,
      r.recipe_server
    FROM recipes r
    WHERE (r.recipe_id = ? OR r.recipe_root_id = ?)
      ${statusFilter}
      ${clientFilter.sql}
    ORDER BY FIELD(r.recipe_id, ?) DESC, r.recipe_id ASC
  `;

  return queryRows<RecipeRow>(sql, [
    recipeId,
    recipeId,
    ...clientFilter.params,
    recipeId,
  ]);
}

export async function getIngredientsForRecipesQuery(
  recipeIds: number[]
): Promise<RecipeIngredientRow[]> {
  if (!recipeIds.length) {
    return [];
  }

  const placeholders = recipeIds
    .map(() => "?")
    .join(", ");

  const sql = `
    SELECT
      lu_id,
      lu_recipe_id,
      lu_ingredient,
      lu_description,
      lu_whole,
      lu_nom,
      lu_den,
      lu_size,
      lu_department,
      lu_searchterm
    FROM recipes_ingredient_lu
    WHERE lu_recipe_id IN (${placeholders})
    ORDER BY lu_recipe_id, lu_id
  `;

  return queryRows<RecipeIngredientRow>(
    sql,
    recipeIds
  );
}

export async function getMetaForRecipesQuery(
  recipeIds: number[]
): Promise<RecipeMetaRow[]> {
  if (!recipeIds.length) {
    return [];
  }

  const placeholders = recipeIds
    .map(() => "?")
    .join(", ");

  const sql = `
    SELECT
      meta_id,
      meta_recipe_id,
      meta_name,
      TRIM(BOTH ',' FROM meta_value) AS meta_value
    FROM recipes_meta
    WHERE meta_recipe_id IN (${placeholders})
    ORDER BY meta_recipe_id, meta_name, meta_id
  `;

  return queryRows<RecipeMetaRow>(
    sql,
    recipeIds
  );
}

export async function getRatingSummaryQuery(
  recipeId: number,
  options: GetRecipeByIdOptions = {}
): Promise<RecipeRatingSummaryRow | null> {
  const clients = normalizeClients(options);

  const clientFilter = buildClientFilter(
    "rate_client",
    clients
  );

  const sql = `
    SELECT
      rate_recipe_id,
      COUNT(*) AS rating_count,
      SUM(rate_vote) AS rating_total,
      SUM(rate_vote) / COUNT(*) AS rating_average
    FROM recipes_ratings
    WHERE rate_recipe_id = ?
      ${clientFilter.sql}
    GROUP BY rate_recipe_id
  `;

  const rows = await queryRows<RecipeRatingSummaryRow>(
    sql,
    [
      recipeId,
      ...clientFilter.params,
    ]
  );

  return rows[0] ?? null;
}

export async function getRecipeStatusCountsQuery(): Promise<
  {
    recipe_status: RecipeStatus;
    total: number;
  }[]
> {
  return queryRows<{
    recipe_status: RecipeStatus;
    total: number;
  }>(
    `
      SELECT
        recipe_status,
        COUNT(*) AS total
      FROM recipes
      GROUP BY recipe_status
      ORDER BY recipe_status
    `
  );
}

export async function getRecipeClientCountsQuery(): Promise<
  {
    recipe_client: string;
    total: number;
    published: number;
  }[]
> {
  return queryRows<{
    recipe_client: string;
    total: number;
    published: number;
  }>(
    `
      SELECT
        recipe_client,
        COUNT(*) AS total,
        SUM(recipe_status = 1) AS published
      FROM recipes
      GROUP BY recipe_client
      ORDER BY total DESC
    `
  );
}