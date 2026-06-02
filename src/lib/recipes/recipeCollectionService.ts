import {
  getRecipeCollectionsQuery,
} from "./recipeCollectionQueries";
import { mapRecipeCollectionRow } from "./recipeCollectionMapper";
import {
  HydratedRecipeCollection,
  Recipe,
  RecipeCollection,
} from "./recipeTypes";
import {
  getMetaForRecipesQuery,
} from "./recipeQueries";
import { mapRecipes } from "./recipeMapper";
import { queryRows } from "./recipeDb";
import { RecipeRow } from "./databaseTypes";

async function getGroupingRecipeIds(
  collectionTitle: string
): Promise<number[]> {
  const title = collectionTitle.trim();

  if (!title) {
    return [];
  }

  const normalizedTitle = title.replace(/\\'/g, "'").trim();
  const escapedTitle = normalizedTitle.replace(/'/g, "\\'");

  const titleVariants = Array.from(
    new Set([title, normalizedTitle, escapedTitle].filter(Boolean))
  );

  const titleWhereSql = titleVariants
    .map(
      () =>
        "TRIM(BOTH ',' FROM m.meta_value) LIKE CONCAT('%', ?, '%')"
    )
    .join(" OR ");

  const rows = await queryRows<{
    meta_recipe_id: number;
  }>(
    `
      SELECT DISTINCT
        m.meta_recipe_id
      FROM recipes_meta m
      INNER JOIN recipes r
        ON r.recipe_id = m.meta_recipe_id
      WHERE TRIM(m.meta_name) LIKE 'Grouping%'
        AND (${titleWhereSql})
        AND r.recipe_status = 1
    `,
    titleVariants
  );

  return rows
    .map(row => row.meta_recipe_id)
    .filter(id => Number.isInteger(id) && id > 0);
}

async function getCollectionSourceRecipeIds(
  collection: RecipeCollection,
  limit?: number
): Promise<number[]> {
  const explicitIds = collection.recipeIds ?? [];
  const groupingIds = await getGroupingRecipeIds(
    collection.title
  );

  const merged = Array.from(
    new Set([...explicitIds, ...groupingIds])
  );

  if (typeof limit === "number") {
    return merged.slice(0, Math.max(0, limit));
  }

  return merged;
}

async function getCollectionRecipesByIds(
  recipeIds: number[]
): Promise<Recipe[]> {
  if (!recipeIds.length) {
    return [];
  }

  const placeholders = recipeIds.map(() => "?").join(", ");

  const candidateRows = await queryRows<RecipeRow>(
    `
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
      WHERE (
        r.recipe_id IN (${placeholders})
        OR r.recipe_root_id IN (${placeholders})
      )
        AND r.recipe_status = 1
      ORDER BY r.recipe_date_modified DESC, r.recipe_id DESC
    `,
    [...recipeIds, ...recipeIds]
  );

  if (!candidateRows.length) {
    return [];
  }

  const selectedRows: RecipeRow[] = [];

  for (const sourceId of recipeIds) {
    const exactRow = candidateRows.find(
      row => row.recipe_id === sourceId
    );

    if (exactRow) {
      selectedRows.push(exactRow);
      continue;
    }

    const rootRow = candidateRows.find(
      row => row.recipe_root_id === sourceId
    );

    if (rootRow) {
      selectedRows.push(rootRow);
    }
  }

  const dedupedRows = Array.from(
    new Map(
      selectedRows.map(row => [row.recipe_id, row])
    ).values()
  );

  if (!dedupedRows.length) {
    return [];
  }

  const resolvedIds = dedupedRows.map(
    row => row.recipe_id
  );
  const metaRows = await getMetaForRecipesQuery(resolvedIds);
  const mapped = mapRecipes(dedupedRows, metaRows);

  const order = new Map<number, number>();

  dedupedRows.forEach(row => {
    const matchedSourceId =
      row.recipe_id === 0
        ? row.recipe_root_id
        : row.recipe_id;

    const sourceIndex = recipeIds.findIndex(
      id =>
        id === row.recipe_id ||
        id === row.recipe_root_id
    );

    if (sourceIndex >= 0) {
      order.set(matchedSourceId, sourceIndex);
      order.set(row.recipe_id, sourceIndex);
      if (row.recipe_root_id) {
        order.set(row.recipe_root_id, sourceIndex);
      }
    }
  });

  return mapped.sort((a, b) => {
    const aOrder =
      order.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const bOrder =
      order.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}

async function hydrateRecipeCollection(
  collection: RecipeCollection
): Promise<HydratedRecipeCollection> {
  const recipeIds = await getCollectionSourceRecipeIds(
    collection
  );
  const recipes = recipeIds.length
    ? await getCollectionRecipesByIds(recipeIds)
    : [];

  return {
    ...collection,
    recipes,
  };
}

export async function getRecipeCollectionsLive(options: {
  placement?: string;
  limit?: number;
  enforceDateWindow?: boolean;
  includePreviewRecipes?: boolean;
  previewLimit?: number;
} = {}): Promise<RecipeCollection[]> {
  const rows = await getRecipeCollectionsQuery({
    placement: options.placement,
    limit: options.limit,
    enforceDateWindow: options.enforceDateWindow,
  });

  const collections = rows.map(mapRecipeCollectionRow);

  if (options.includePreviewRecipes === false) {
    return collections;
  }

  const previewLimit = options.previewLimit ?? 4;

  return Promise.all(
    collections.map(async collection => {
      const recipeIds =
        await getCollectionSourceRecipeIds(
          collection,
          previewLimit
        );

      if (!recipeIds.length) {
        return {
          ...collection,
          previewRecipes: [],
        };
      }

      const recipes = await getCollectionRecipesByIds(
        recipeIds
      );

      return {
        ...collection,
        previewRecipes: recipes.map(recipe => ({
          id: recipe.id,
          slug: recipe.slug,
          name: recipe.name,
        })),
      };
    })
  );
}

export async function getRecipeCollectionByIdOrSlugLive(
  collectionIdOrSlug: string
): Promise<HydratedRecipeCollection | null> {
  const lookup = collectionIdOrSlug
    .trim()
    .toLowerCase();

  const rows = await getRecipeCollectionsQuery({
    includeInactive: false,
    enforceDateWindow: false,
    limit: 250,
  });

  for (const row of rows) {
    const mapped = mapRecipeCollectionRow(row);

    if (
      String(row.collection_id) === collectionIdOrSlug ||
      mapped.id.toLowerCase() === lookup
    ) {
      return hydrateRecipeCollection(mapped);
    }
  }

  return null;
}

export async function getRelatedRecipeCollectionsLive(
  collection: RecipeCollection,
  limit = 2
): Promise<RecipeCollection[]> {
  const rows = await getRecipeCollectionsQuery({
    placement: collection.placement,
    limit: Math.max(limit + 1, 3),
  });

  return rows
    .map(mapRecipeCollectionRow)
    .filter(item => item.id !== collection.id)
    .slice(0, limit);
}
