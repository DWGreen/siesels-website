export type RecipeApiStatus = {
  status: number;
  error?: {
    message: string;
  };
};

export type CmsRecipeSummary = {
  id: string;
  name: string;
  rating: number | string;
  image?: string;
  intro?: string;
};

export type CmsRecipeDetail = {
  id: string;
  name: string;
  course?: string;
  servings?: string;
  groups?: Record<string, string[] | string>;
  directions?: string[];
  image?: string;
  ingredients?: string[];
  intro?: string;
  rating: number | string;
};

type GetRecipeResponse = RecipeApiStatus & {
  recipe?: CmsRecipeDetail;
};

type SearchRecipesResponse = RecipeApiStatus & {
  results?: {
    recipes?: CmsRecipeSummary[];
    count?: number | string;
    page?: number | string;
    pages?: number | string;
    limit?: number | string;
  };
};

type FeaturedResponse = RecipeApiStatus & {
  results?: {
    collections?: Array<{
      recipes?: CmsRecipeSummary[];
    }>;
    recipes?: Array<{
      ID: string;
      name: string;
      intro?: string;
      image?: string;
    }>;
  };
};

type SubmitRatingResponse = RecipeApiStatus & {
  rating?: {
    recipe_id: number | string;
    average: number | string;
    count: number | string;
    total: number | string;
    client?: string;
  };
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function getCookingApiBaseUrl(): string {
  const explicitBase = process.env.RECIPE_API_BASE?.trim();

  if (explicitBase) {
    return explicitBase;
  }

  const baseUrl = requiredEnv("CMS_COOKING_API_BASE_URL");
  const clientId = requiredEnv("CMS_COOKING_API_CLIENT_ID");
  const apiKey = requiredEnv("CMS_COOKING_API_KEY");

  return `${baseUrl.replace(/\/$/, "")}/${clientId}/${apiKey}/cooking/`;
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

export function getRecipeDefaultClient(): string {
  return process.env.CMS_COOKING_API_CLIENT_ID?.trim() || "SIM";
}

async function fetchRecipeApi<T extends RecipeApiStatus>(
  params: URLSearchParams
): Promise<T> {
  params.set("format", "json");

  const baseUrl = getCookingApiBaseUrl();
  const separator = baseUrl.includes("?") ? "&" : "?";
  const url = `${baseUrl}${separator}${params.toString()}`;

  const response = await fetch(url, {
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

export async function getRecipe(id: number): Promise<CmsRecipeDetail> {
  const params = new URLSearchParams();
  params.set("recipe", String(id));

  const data = await fetchRecipeApi<GetRecipeResponse>(params);

  if (!data.recipe) {
    throw new Error("Recipe not found in API response");
  }

  return data.recipe;
}

export async function searchRecipes(input: {
  searchterm?: string;
  group?: Record<string, string[]>;
  page?: number;
  limit?: number;
}): Promise<SearchRecipesResponse> {
  const params = new URLSearchParams();

  params.set("searchRecipes", "1");

  if (input.searchterm?.trim()) {
    params.set("searchterm", input.searchterm.trim());
  }

  params.set("page", String(input.page ?? 1));
  params.set("limit", String(input.limit ?? 20));

  appendGroupParams(params, input.group);

  return fetchRecipeApi<SearchRecipesResponse>(params);
}

export async function getFeatured(viewDate?: string): Promise<FeaturedResponse> {
  const params = new URLSearchParams();

  params.set("getFeatured", "1");

  if (viewDate) {
    params.set("viewDate", viewDate);
  }

  return fetchRecipeApi<FeaturedResponse>(params);
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

export async function submitRatingViaWebservice(input: {
  recipeId: number;
  vote: number;
  client?: string;
  userId?: number;
}): Promise<SubmitRatingResponse> {
  const params = new URLSearchParams();

  params.set("submitRating", "1");
  params.set("recipe", String(input.recipeId));
  params.set("vote", String(input.vote));

  if (input.client?.trim()) {
    params.set("client", input.client.trim());
  }

  if (Number.isInteger(input.userId) && (input.userId ?? 0) > 0) {
    params.set("userId", String(input.userId));
  }

  return fetchRecipeApi<SubmitRatingResponse>(params);
}