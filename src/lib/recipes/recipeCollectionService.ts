import {
  HydratedRecipeCollection,
  RecipeCollection,
} from "./recipeTypes";
import { getFeatured } from "./recipeApi";
import { getRecipesByIds } from "./recipeService";

type FeaturedCollection = {
  headline?: string;
  intro?: string;
  image?: string;
  query?: string;
  recipes?: Array<{
    id: string;
    name: string;
  }>;
};

function cleanText(value: string | undefined): string {
  return (value ?? "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "collection";
}

function normalizeImage(value?: string): string {
  const image = cleanText(value);

  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("//")) {
    return `https:${image}`;
  }

  return image;
}

function getMetaValueFromQuery(query: string, name: string): string | undefined {
  if (!query) {
    return undefined;
  }

  const encodedName = encodeURIComponent(name);
  const rx = new RegExp(`(?:^|&)group\\[${encodedName}\\]\\[\\]=([^&]+)`);
  const match = query.match(rx);

  if (!match?.[1]) {
    return undefined;
  }

  return decodeURIComponent(match[1]);
}

function mapFeaturedCollection(
  collection: FeaturedCollection,
  index: number
): RecipeCollection {
  const title = cleanText(collection.headline) || `Collection ${index + 1}`;
  const query = collection.query ?? "";
  const recipeIds = (collection.recipes ?? [])
    .map(item => Number(item.id))
    .filter(id => Number.isInteger(id) && id > 0);

  const uniqueRecipeIds = Array.from(new Set(recipeIds));

  const idFromMeta =
    getMetaValueFromQuery(query, "Grouping") ||
    getMetaValueFromQuery(query, "Cuisine") ||
    getMetaValueFromQuery(query, "Diet") ||
    getMetaValueFromQuery(query, "Holiday") ||
    getMetaValueFromQuery(query, "MainIngredient") ||
    getMetaValueFromQuery(query, "CookingMethod");

  const id = toSlug(idFromMeta || title);

  return {
    id,
    title,
    subtitle: undefined,
    description: cleanText(collection.intro) || undefined,
    image: normalizeImage(collection.image),
    recipeIds: uniqueRecipeIds,
    placement: "featured",
    tags: [],
    status: "Y",
    previewRecipes: (collection.recipes ?? []).map(recipe => ({
      id: Number(recipe.id),
      slug: String(recipe.id),
      name: cleanText(recipe.name),
    })),
  };
}

async function getFeaturedCollections(): Promise<RecipeCollection[]> {
  const featured = await getFeatured();
  const collections = featured.results?.collections ?? [];

  return collections.map((collection, index) =>
    mapFeaturedCollection(collection, index)
  );
}

async function hydrateRecipeCollection(
  collection: RecipeCollection
): Promise<HydratedRecipeCollection> {
  const recipes = await getRecipesByIds(collection.recipeIds ?? []);

  return {
    ...collection,
    recipes,
  };
}

async function withPreviewRecipes(
  collection: RecipeCollection,
  previewLimit: number
): Promise<RecipeCollection> {
  const ids = (collection.recipeIds ?? []).slice(0, previewLimit);

  if (!ids.length) {
    return {
      ...collection,
      previewRecipes: [],
    };
  }

  const recipes = await getRecipesByIds(ids);

  return {
    ...collection,
    previewRecipes: recipes.map(recipe => ({
      id: recipe.id,
      slug: recipe.slug,
      name: recipe.name,
    })),
  };
}

export async function getRecipeCollectionsLive(options: {
  placement?: string;
  limit?: number;
  enforceDateWindow?: boolean;
  includePreviewRecipes?: boolean;
  previewLimit?: number;
} = {}): Promise<RecipeCollection[]> {
  const allCollections = await getFeaturedCollections();

  const placementFiltered = options.placement
    ? allCollections.filter(
        collection =>
          collection.placement?.toLowerCase() ===
          options.placement?.toLowerCase()
      )
    : allCollections;

  const limited = Number.isInteger(options.limit)
    ? placementFiltered.slice(0, Math.max(0, Number(options.limit)))
    : placementFiltered;

  if (options.includePreviewRecipes === false) {
    return limited;
  }

  const previewLimit = options.previewLimit ?? 4;

  return Promise.all(
    limited.map(collection => withPreviewRecipes(collection, previewLimit))
  );
}

export async function getRecipeCollectionByIdOrSlugLive(
  collectionIdOrSlug: string
): Promise<HydratedRecipeCollection | null> {
  const lookup = collectionIdOrSlug.trim().toLowerCase();
  const collections = await getRecipeCollectionsLive({
    includePreviewRecipes: false,
  });

  const match = collections.find(collection => {
    const id = collection.id.toLowerCase();
    return id === lookup;
  });

  if (!match) {
    return null;
  }

  return hydrateRecipeCollection(match);
}

export async function getRelatedRecipeCollectionsLive(
  collection: RecipeCollection,
  limit = 2
): Promise<RecipeCollection[]> {
  const collections = await getRecipeCollectionsLive({
    includePreviewRecipes: true,
  });

  return collections
    .filter(item => item.id !== collection.id)
    .slice(0, limit);
}
