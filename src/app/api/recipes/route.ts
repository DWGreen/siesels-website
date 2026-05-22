import { NextRequest, NextResponse } from "next/server";

import { getRecipes } from "@/lib/recipes/recipeService";
import { RecipeStatus } from "@/lib/recipes/recipeTypes";
import { GetRecipesOptions } from "@/lib/recipes/recipeTypes";
import { parseRecipeStatus } from "@/utils/recipeUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Number(searchParams.get("limit") ?? 24);
    const offset = Number(searchParams.get("offset") ?? 0);

    const search =
      searchParams.get("search")?.trim() || undefined;

    const client =
      searchParams.get("client")?.trim() || undefined;

    const statusParam = searchParams.get("status");
    const status = parseRecipeStatus(
  searchParams.get("status")
);

    const options: GetRecipesOptions = {
      limit,
      offset,
      search,
      status,
      includeBlankClient: true,
    };

    if (client) {
      options.client = client;
    }

    const recipes = await getRecipes(options);

    return NextResponse.json({
      recipes,
      count: recipes.length,
    });
  }  catch (error) {
    console.error("GET /api/recipes failed", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to load recipes",
        message,
      },
      { status: 500 }
    );
  }
}