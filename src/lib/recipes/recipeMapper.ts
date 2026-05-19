// src/lib/recipes/recipeMapper.ts

import {
  RecipeDetail,
  RecipeDetailSection,
  RecipeIngredient,
  RecipeIngredientRow,
  RecipeMeta,
  RecipeMetaMap,
  RecipeMetaRow,
  RecipeRatingSummaryRow,
  RecipeRow,
} from "./recipeTypes";

function cleanString(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function nullableString(value: string | null | undefined): string | null {
  const cleaned = cleanString(value);
  return cleaned.length ? cleaned : null;
}

export function splitRecipeDirections(value: string): string[] {
  return cleanString(value)
    .split("||")
    .map(step => step.trim())
    .filter(Boolean);
}

export function formatIngredient(row: RecipeIngredientRow): string {
  const whole = row.lu_whole ? String(row.lu_whole) : "";

  const fraction =
    row.lu_den && row.lu_den !== 0
      ? `${row.lu_nom}/${row.lu_den}`
      : "";

  return [
    whole,
    fraction,
    cleanString(row.lu_size),
    cleanString(row.lu_ingredient),
    cleanString(row.lu_description)
      ? `, ${cleanString(row.lu_description)}`
      : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(" ,", ",")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapIngredient(row: RecipeIngredientRow): RecipeIngredient {
  return {
    id: row.lu_id,
    recipeId: row.lu_recipe_id,
    ingredient: cleanString(row.lu_ingredient),
    description: cleanString(row.lu_description),
    whole: row.lu_whole,
    numerator: row.lu_nom,
    denominator: row.lu_den,
    size: cleanString(row.lu_size),
    department: cleanString(row.lu_department),
    searchTerm: cleanString(row.lu_searchterm),
    displayText: formatIngredient(row),
  };
}

export function groupIngredientsByRecipeId(
  rows: RecipeIngredientRow[]
): Record<number, RecipeIngredient[]> {
  return rows.reduce<Record<number, RecipeIngredient[]>>((acc, row) => {
    acc[row.lu_recipe_id] ??= [];
    acc[row.lu_recipe_id].push(mapIngredient(row));
    return acc;
  }, {});
}

export function mapMeta(row: RecipeMetaRow): RecipeMeta {
  const name = cleanString(row.meta_name);
  const value = cleanString(row.meta_value).replace(/^,+|,+$/g, "");

  return {
    id: row.meta_id,
    recipeId: row.meta_recipe_id,
    name,
    key: name.toLowerCase(),
    value,
  };
}

export function groupMetaByRecipeId(
  rows: RecipeMetaRow[]
): Record<number, RecipeMetaMap> {
  return rows.reduce<Record<number, RecipeMetaMap>>((acc, row) => {
    const meta = mapMeta(row);

    acc[row.meta_recipe_id] ??= {};
    acc[row.meta_recipe_id][meta.key] ??= [];
    acc[row.meta_recipe_id][meta.key].push(meta);

    return acc;
  }, {});
}

export function mapRecipeSection(
  row: RecipeRow,
  ingredientsByRecipeId: Record<number, RecipeIngredient[]>,
  metaByRecipeId: Record<number, RecipeMetaMap>
): RecipeDetailSection {
  return {
    id: row.recipe_id,
    rootId: row.recipe_root_id,
    name: cleanString(row.recipe_name),
    servings: cleanString(row.recipe_servings),
    course: cleanString(row.recipe_course),
    directions: splitRecipeDirections(row.recipe_directions),
    photo: nullableString(row.recipe_photo),
    photoS3: nullableString(row.recipe_photo_s3),
    client: cleanString(row.recipe_client),
    status: row.recipe_status,
    dateModified: row.recipe_date_modified,
    dateAdded: row.recipe_date_added,
    ingredients: ingredientsByRecipeId[row.recipe_id] ?? [],
    meta: metaByRecipeId[row.recipe_id] ?? {},
  };
}

export function buildRecipeDetail(
  rows: RecipeRow[],
  ingredientRows: RecipeIngredientRow[],
  metaRows: RecipeMetaRow[],
  ratingRow: RecipeRatingSummaryRow | null
): RecipeDetail | null {
  if (!rows.length) {
    return null;
  }

  const ingredientsByRecipeId =
    groupIngredientsByRecipeId(ingredientRows);

  const metaByRecipeId =
    groupMetaByRecipeId(metaRows);

  const mainRow =
    rows.find(row => row.recipe_root_id === 0) ?? rows[0];

  const main = mapRecipeSection(
    mainRow,
    ingredientsByRecipeId,
    metaByRecipeId
  );

  const subRecipes = rows
    .filter(row => row.recipe_id !== mainRow.recipe_id)
    .map(row =>
      mapRecipeSection(
        row,
        ingredientsByRecipeId,
        metaByRecipeId
      )
    );

  return {
    ...main,
    rating: {
      average: ratingRow?.rating_average ?? null,
      count: ratingRow?.rating_count ?? 0,
      total: ratingRow?.rating_total ?? null,
    },
    subRecipes,
  };
}