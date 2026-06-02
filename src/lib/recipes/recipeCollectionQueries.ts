import { queryRows, type QueryParamValue } from "./recipeDb";
import { RecipeCollectionRow } from "./databaseTypes";

export type GetRecipeCollectionsQueryOptions = {
  placement?: string;
  includeInactive?: boolean;
  enforceDateWindow?: boolean;
  excludeCollectionId?: number;
  limit?: number;
};

export async function getRecipeCollectionsQuery(
  options: GetRecipeCollectionsQueryOptions = {}
): Promise<RecipeCollectionRow[]> {
  const where: string[] = [];
  const params: QueryParamValue[] = [];

  if (!options.includeInactive) {
    where.push("collection_status = 'Y'");
  }

  if (options.placement) {
    where.push("collection_placement = ?");
    params.push(options.placement);
  }

  if (Number.isInteger(options.excludeCollectionId)) {
    where.push("collection_id != ?");
    params.push(Number(options.excludeCollectionId));
  }

  if (options.enforceDateWindow !== false) {
    where.push(`
      (
        collection_date_override = 1
        OR (
          collection_date_start <= CURDATE()
          AND collection_date_end >= CURDATE()
        )
      )
    `);
  }

  const sql = `
    SELECT
      collection_id,
      collection_meta_name,
      collection_meta_value,
      collection_placement,
      collection_recipe_ids,
      collection_name,
      collection_headline,
      collection_tabline,
      collection_description,
      collection_image,
      collection_image_removed,
      collection_date_start,
      collection_date_end,
      collection_date_override,
      collection_tags,
      collection_status
    FROM recipes_collections
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY collection_id DESC
    ${options.limit ? "LIMIT ?" : ""}
  `;

  if (options.limit) {
    params.push(options.limit);
  }

  return queryRows<RecipeCollectionRow>(sql, params);
}

export async function getRecipeCollectionByLookupQuery(
  collectionIdOrSlug: string
): Promise<RecipeCollectionRow[]> {
  const numericId = Number(collectionIdOrSlug);
  const hasNumericId = Number.isInteger(numericId);

  return queryRows<RecipeCollectionRow>(
    `
      SELECT
        collection_id,
        collection_meta_name,
        collection_meta_value,
        collection_placement,
        collection_recipe_ids,
        collection_name,
        collection_headline,
        collection_tabline,
        collection_description,
        collection_image,
        collection_image_removed,
        collection_date_start,
        collection_date_end,
        collection_date_override,
        collection_tags,
        collection_status
      FROM recipes_collections
      WHERE collection_status = 'Y'
        AND (
          ${hasNumericId ? "collection_id = ? OR" : ""}
          collection_meta_value = ?
        )
      LIMIT 1
    `,
    hasNumericId
      ? [numericId, collectionIdOrSlug]
      : [collectionIdOrSlug]
  );
}
