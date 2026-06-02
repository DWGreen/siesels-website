// src/lib/recipes/recipeQueries.ts

import {
  executeMutation,
  queryRows,
  type QueryParamValue,
} from "./recipeDb";
import {
  GetRecipeByIdOptions,
  GetRecipesOptions,
  RecipeMetaOption,
  RecipeStatus,
} from "./recipeTypes";

import
{
RecipeIngredientRow,
RecipeMetaRow,
RecipeRatingSummaryRow,
RecipeRow


} from "./databaseTypes";
import { RECIPE_META_KEYS } from "./recipeMetaConfig";

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
export async function getRecipesQuery(
  options: GetRecipesOptions = {}
): Promise<RecipeRow[]> {
  const {
    limit = 24,
    offset = 0,
    search,
    status = 1,
    sortBy = "dateModified",
  } = options;
  const ids = options.ids?.filter(id => Number.isInteger(id)) ?? [];
  const hasIdsFilter = ids.length > 0;

  const excludeIds = options.excludeIds?.filter(id => Number.isInteger(id)) ?? [];
  const hasExcludeIds = excludeIds.length > 0;

  const hasSimilarToFilter = Number.isInteger(options.similarToId);
  const similarToId = hasSimilarToFilter
    ? Number(options.similarToId)
    : null;

  const clients = normalizeClients(options);

  const clientFilter = buildClientFilter(
    "r.recipe_client",
    clients
  );

  const hasSearch = Boolean(search?.trim());

  const searchLike = `%${search?.trim() ?? ""}%`;

  const searchJoins = hasSearch
    ? `
      LEFT JOIN recipes_meta searchMeta
        ON (
          searchMeta.meta_recipe_id = r.recipe_id
          OR searchMeta.meta_recipe_id = r.recipe_root_id
        )

      LEFT JOIN recipes_ingredient_lu i
        ON (
          i.lu_recipe_id = r.recipe_id
          OR i.lu_recipe_id = r.recipe_root_id
        )
    `
    : "";

  const metaWhere: string[] = [];

  const metaParams: QueryParamValue[] = [];

  if (options.course) {
    metaWhere.push(
      "r.recipe_course = ?"
    );

    metaParams.push(
      options.course
    );
  }

  function addMetaFilter(
    metaNames: readonly string[],
    value?: string
  ) {
    if (!value) {
      return;
    }

    metaWhere.push(`
      EXISTS (
        SELECT 1
        FROM recipes_meta m

        INNER JOIN recipes mr
          ON mr.recipe_id =
             m.meta_recipe_id

        WHERE (
          mr.recipe_id = r.recipe_id
          OR mr.recipe_root_id =
             r.recipe_id
          OR mr.recipe_id =
             r.recipe_root_id
        )

        AND LOWER(m.meta_name)
          IN (${metaNames
            .map(() => "?")
            .join(", ")})

        AND (
          TRIM(BOTH ',' FROM m.meta_value)
            = ?
          OR m.meta_value LIKE ?
        )
      )
    `);

    metaParams.push(
      ...metaNames.map(name =>
        name.toLowerCase()
      ),

      value,

      `%${value}%`
    );
  }

  addMetaFilter(
    RECIPE_META_KEYS.diet,
    options.diet
  );

  addMetaFilter(
    RECIPE_META_KEYS.cuisine,
    options.cuisine
  );

  addMetaFilter(
    RECIPE_META_KEYS.holiday,
    options.holiday
  );

  addMetaFilter(
    RECIPE_META_KEYS.cookingMethod,
    options.cookingMethod
  );

  addMetaFilter(
    RECIPE_META_KEYS.mainIngredient,
    options.mainIngredient
  );

  const searchSql = hasSearch
    ? `
      AND (
        r.recipe_name LIKE ?
        OR r.recipe_course LIKE ?
        OR searchMeta.meta_value LIKE ?
        OR i.lu_ingredient LIKE ?
        OR i.lu_description LIKE ?
        OR i.lu_searchterm LIKE ?
      )
    `
    : "";

  const idsSql = hasIdsFilter
    ? `AND r.recipe_id IN (${ids.map(() => "?").join(", ")})`
    : "";

  const excludeIdsSql = hasExcludeIds
    ? `AND r.recipe_id NOT IN (${excludeIds.map(() => "?").join(", ")})`
    : "";

  const similarWhereSql = hasSimilarToFilter
    ? "AND r.recipe_id != ?"
    : "";

  const baseOrderSql =
    sortBy === "rating"
      ? `
      COALESCE(ratings.rating_average, 0) DESC,
      COALESCE(ratings.rating_count, 0) DESC,
      r.recipe_date_modified DESC,
      r.recipe_id DESC
    `
      : `
      r.recipe_date_modified DESC,
      r.recipe_id DESC
    `;

  const sql = `
    SELECT DISTINCT
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
      r.recipe_server,
      ratings.rating_average,
      ratings.rating_count

    FROM recipes r

    LEFT JOIN (
      SELECT
        rate_recipe_id,
        AVG(CAST(rate_vote AS UNSIGNED)) AS rating_average,
        COUNT(*) AS rating_count
      FROM recipes_ratings
      GROUP BY rate_recipe_id
    ) ratings
      ON ratings.rate_recipe_id = r.recipe_id

    ${searchJoins}

    WHERE r.recipe_status = ?

      ${clientFilter.sql}

      ${searchSql}

      ${idsSql}

      ${excludeIdsSql}

      ${similarWhereSql}

      ${
        metaWhere.length
          ? `AND ${metaWhere.join(
              " AND "
            )}`
          : ""
      }

    ORDER BY
      ${hasSimilarToFilter ? `
      (
        SELECT COUNT(*)
        FROM recipes_meta m
        INNER JOIN recipes_meta t
          ON LOWER(t.meta_name) = LOWER(m.meta_name)
         AND TRIM(BOTH ',' FROM t.meta_value) = TRIM(BOTH ',' FROM m.meta_value)
        WHERE m.meta_recipe_id = r.recipe_id
          AND t.meta_recipe_id = ?
          AND LOWER(m.meta_name) IN (
            'cuisine',
            'diet',
            'mainingredient',
            'main ingredient',
            'cookingmethod',
            'cooking method'
          )
      ) DESC,
      ` : ""}
      ${baseOrderSql}

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

  if (hasIdsFilter) {
    params.push(...ids);
  }

  if (hasExcludeIds) {
    params.push(...excludeIds);
  }

  if (hasSimilarToFilter && similarToId !== null) {
    params.push(similarToId); // WHERE r.recipe_id != ?
  }

  params.push(...metaParams);

  if (hasSimilarToFilter && similarToId !== null) {
    params.push(similarToId); // ORDER BY subquery
  }

  params.push(limit, offset);

  return queryRows<RecipeRow>(
    sql,
    params
  );
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
      m.meta_id,
      m.meta_recipe_id,
      m.meta_name,
      TRIM(BOTH ',' FROM m.meta_value) AS meta_value

    FROM recipes_meta m

    INNER JOIN recipes r
      ON r.recipe_id = m.meta_recipe_id

    WHERE (
      r.recipe_id IN (${placeholders})
      OR r.recipe_root_id IN (${placeholders})
    )

    ORDER BY
      m.meta_recipe_id,
      m.meta_name,
      m.meta_id
  `;

  return queryRows<RecipeMetaRow>(
    sql,
    [...recipeIds, ...recipeIds]
  );
}

export async function getRatingSummaryQuery(
  recipeId: number,
  options: GetRecipeByIdOptions = {}
): Promise<RecipeRatingSummaryRow | null> {
  const sql = `
    SELECT
      rate_recipe_id,
      COUNT(*) AS rating_count,
      SUM(rate_vote) AS rating_total,
      SUM(rate_vote) / COUNT(*) AS rating_average
    FROM recipes_ratings
    WHERE rate_recipe_id = ?
    GROUP BY rate_recipe_id
  `;

  const rows = await queryRows<RecipeRatingSummaryRow>(
    sql,
    [recipeId]
  );

  return rows[0] ?? null;
}

export async function insertRecipeRatingQuery(input: {
  recipeId: number;
  vote: number;
  client: string;
  userId?: number;
  commentId?: number;
}): Promise<number> {
  const result = await executeMutation(
    `
      INSERT INTO recipes_ratings (
        rate_recipe_id,
        rate_comment_id,
        rate_vote,
        rate_client,
        rate_user,
        rate_date
      )
      VALUES (?, ?, ?, ?, ?, CURDATE())
    `,
    [
      input.recipeId,
      input.commentId ?? 0,
      String(input.vote),
      input.client,
      input.userId ?? 0,
    ]
  );

  return result.insertId;
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

export async function getRecipeMetaOptionsQuery(
  metaNames: readonly string[],
  options: {
    client?: string;
    includeBlankClient?: boolean;
  } = {}
): Promise<RecipeMetaOption[]> {
  const placeholders = metaNames
  .map(() => "?")
  .join(", ");
  const clients = normalizeClients(options);

  const clientFilter = buildClientFilter(
    "r.recipe_client",
    clients
  );

  const sql = `
    SELECT
      TRIM(BOTH ',' FROM m.meta_value) AS value,
      COUNT(DISTINCT r.recipe_id) AS total
    FROM recipes_meta m

    INNER JOIN recipes r
  ON (
    r.recipe_id = m.meta_recipe_id
    OR r.recipe_root_id = m.meta_recipe_id
  )

    WHERE LOWER(m.meta_name) IN (${placeholders})
      AND r.recipe_status = 1
      
      ${clientFilter.sql}

    GROUP BY value

    HAVING value IS NOT NULL
      AND value != ''
      AND value != '&nbsp;'

    ORDER BY value ASC
  `;

  const rows = await queryRows<{
    value: string;
    total: number;
  }>(sql, [
      ...metaNames.map(name =>
    name.toLowerCase()
  ),
  ...clientFilter.params,
  ]);

  return rows.map(row => ({
    label: row.value,
    value: row.value,
    total: Number(row.total),
  }));
}