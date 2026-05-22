// src/lib/recipes/recipeMapper.ts

import {
  RecipeDetail,
  RecipeDetailSection,
  RecipeIngredient,
  RecipeCard,
  RecipeIngredientRow,
  RecipeMeta,
  RecipeMetaMap,
  RecipeMetaRow,
  RecipeRatingSummaryRow,
  RecipeRow,
} from "./recipeTypes";

function decodeCmsEntities(value: string): string {
  return value
    .replace(/\\+/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&rsquo;/gi, "’")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rdquo;/gi, "”")
    .replace(/&ldquo;/gi, "“")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&ocirc;/gi, "ô")
    .replace(/&eacute;/gi, "é")
    .replace(/&egrave;/gi, "è")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&uuml;/gi, "ü")
    .replace(/&reg;/gi, "®")
    .replace(/&trade;/gi, "™");
}
function normalizePhotoUrl(
  value: string | null | undefined
): string | null {
  const photo = nullableString(value);

  if (!photo) return null;

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    return photo;
  }

  const wpBaseUrl =
    process.env.NEXT_PUBLIC_WP_URL ||
    process.env.WP_URL ||
    "";

  if (!wpBaseUrl) {
    return photo;
  }

  return `${wpBaseUrl.replace(/\/$/, "")}/${photo.replace(
    /^\//,
    ""
  )}`;
}
function cleanString(
  value: string | null | undefined
): string {
  const cleaned = decodeCmsEntities(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";

  if (cleaned === "-") return "";

  return cleaned;
}

function nullableString(
  value: string | null | undefined
): string | null {
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
export function mapRecipeCard(row: RecipeCard): RecipeCard {
  return {
    ...row,
    name: cleanString(row.name),
    servings: cleanString(row.servings),
    course: cleanString(row.course),
    photo: normalizePhotoUrl(row.photo),
    intro: nullableString(row.intro),
    client: cleanString(row.client),
  };
}

export function mapRecipeCards(
  rows: RecipeCard[]
): RecipeCard[] {
  return rows.map(mapRecipeCard);
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
    photo: normalizePhotoUrl(row.recipe_photo),
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