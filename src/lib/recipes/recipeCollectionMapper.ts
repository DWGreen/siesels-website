import { RecipeCollectionRow } from "./databaseTypes";
import { RecipeCollection } from "./recipeTypes";

function cleanText(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/\\+/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImageUrl(value: string): string {
  const image = cleanText(value);

  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const wpBaseUrl = "http://cms.dwgreen.com";

  return `${wpBaseUrl.replace(/\/$/, "")}/${image.replace(
    /^\//,
    ""
  )}`;
}

function parseDelimitedValues(value: string): string[] {
  return cleanText(value)
    .split(/[|,]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function parseRecipeIds(value: string): number[] {
  return Array.from(
    new Set(
      (value.match(/\d+/g) ?? [])
        .map(item => Number(item))
        .filter(item => Number.isInteger(item) && item > 0)
    )
  );
}

function normalizeCollectionId(row: RecipeCollectionRow): string {
  const metaValue = cleanText(row.collection_meta_value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return metaValue || String(row.collection_id);
}

export function mapRecipeCollectionRow(
  row: RecipeCollectionRow
): RecipeCollection {
  return {
    id: normalizeCollectionId(row),
    title: cleanText(row.collection_name),
    subtitle: cleanText(row.collection_headline) || cleanText(row.collection_tabline) || undefined,
    description: cleanText(row.collection_description) || undefined,
    image: normalizeImageUrl(row.collection_image),
    recipeIds: parseRecipeIds(row.collection_recipe_ids),
    placement: cleanText(row.collection_placement) || undefined,
    tags: parseDelimitedValues(row.collection_tags),
    status: cleanText(row.collection_status) === "Y" ? "Y" : "N",
  };
}
