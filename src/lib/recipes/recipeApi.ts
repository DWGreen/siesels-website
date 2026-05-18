type RecipeApiStatus = {
  status: number;
  error?: {
    message: string;
  };
};

export type Recipe = {
  id: number;
  name: string;
  course: string;
  servings: string;
  groups: Record<string, string[]>;
  directions: string[];
  image: string;
  ingredients: string[];
  intro?: string;
  note?: string;
  rating: number;
};

type GetRecipeResponse = RecipeApiStatus & {
  recipe: LegacyRecipe;
};

type LegacyRecipe = {
  id: string | number;
  name: string;
  course: string;
  servings: string;
  groups?: Record<string, string[]>;
  directions?: string[];
  image?: string;
  ingredients?: string[];
  intro?: string;
  note?: string;
  rating?: string | number;
};

const RECIPE_API_BASE = process.env.RECIPE_API_BASE;
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;

if (!RECIPE_API_BASE) {
  throw new Error("Missing RECIPE_API_BASE");
}

function appendGroupParams(
  params: URLSearchParams,
  group?: Record<string, string[]>
) {
  if (!group) return;

  for (const [groupName, values] of Object.entries(group)) {
    for (const value of values) {
      params.append(`group[${groupName}][]`, value);
    }
  }
}

function normalizeRecipe(recipe: LegacyRecipe): Recipe {
  return {
    id: Number(recipe.id),
    name: recipe.name ?? "",
    course: recipe.course ?? "",
    servings: recipe.servings ?? "",
    groups: recipe.groups ?? {},
    directions: recipe.directions ?? [],
    image: recipe.image ?? "",
    ingredients: recipe.ingredients ?? [],
    intro: recipe.intro,
    note: recipe.note,
    rating: Number(recipe.rating ?? 0),
  };
}

async function fetchRecipeApi<T extends RecipeApiStatus>(
  params: URLSearchParams
): Promise<T> {
  params.set("format", "json");

  if (RECIPE_API_KEY) {
    params.set("key", RECIPE_API_KEY);
  }

  const url = `${RECIPE_API_BASE}?${params.toString()}`;

  const response = await fetch(url, {
    // Start with no-store while integrating. Later, use revalidate.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Recipe API HTTP error: ${response.status}`);
  }

  const data = (await response.json()) as T;

  if (data.status >= 400) {
    throw new Error(data.error?.message ?? `Recipe API error: ${data.status}`);
  }

  return data;
}

export async function getRecipe(id: number): Promise<Recipe> {
  const params = new URLSearchParams();
  params.set("recipe", String(id));

  const data = await fetchRecipeApi<GetRecipeResponse>(params);

  return normalizeRecipe(data.recipe);
}

export async function searchRecipes(input: {
  searchterm?: string;
  group?: Record<string, string[]>;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();

  params.set("searchRecipes", "1");

  if (input.searchterm) {
    params.set("searchterm", input.searchterm);
  }

  params.set("page", String(input.page ?? 1));
  params.set("limit", String(input.limit ?? 20));

  appendGroupParams(params, input.group);

  return fetchRecipeApi(params);
}

export async function getFeatured(viewDate?: string) {
  const params = new URLSearchParams();

  params.set("getFeatured", "1");

  if (viewDate) {
    params.set("viewDate", viewDate);
  }

  return fetchRecipeApi(params);
}

export async function getNewRecipes(input: {
  minDate?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();

  params.set("newRecipes", "1");

  if (input.minDate) {
    params.set("minDate", input.minDate);
  }

  params.set("page", String(input.page ?? 1));
  params.set("limit", String(input.limit ?? 20));

  return fetchRecipeApi(params);
}