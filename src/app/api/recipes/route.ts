import { NextRequest, NextResponse } from "next/server";

import { getRecipes } from "@/lib/recipes/recipeService";
import { GetRecipesOptions } from "@/lib/recipes/recipeTypes";

import { parseRecipeStatus } from "@/utils/recipeUtils";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limitParam = Number(searchParams.get("limit") ?? 24);
    const rawOffset = Number(searchParams.get("offset") ?? 0);
    const cursor = searchParams.get("cursor");
    const cursorOffset = cursor
      ? Number(cursor)
      : Number.NaN;

    const limit = Number.isInteger(limitParam)
      ? Math.max(1, Math.min(limitParam, 100))
      : 24;

    const offset = Number.isInteger(cursorOffset)
      ? Math.max(0, cursorOffset)
      : Number.isInteger(rawOffset)
        ? Math.max(0, rawOffset)
        : 0;

    const search = searchParams.get("search")?.trim() || undefined;
    const sort = searchParams.get("sort")?.trim();
    const allClients = searchParams.get("allClients") === "1";
    const client = searchParams.get("client")?.trim() || undefined;
    const status = parseRecipeStatus(searchParams.get("status"));
    const idsRaw = searchParams.get("ids");
    const ids = idsRaw
      ? idsRaw
          .split(",")
          .map(value => Number(value.trim()))
          .filter(
            value => Number.isInteger(value) && value > 0
          )
      : [];
    const similarToIdParam = searchParams.get("similarToId");
    const similarToId = similarToIdParam
      ? Number(similarToIdParam)
      : undefined;
    
    const course = searchParams.get("course")?.trim() || undefined;
    const cuisine = searchParams.get("cuisine")?.trim() || undefined;
    const diet = searchParams.get("diet")?.trim() || undefined;
    const holiday = searchParams.get("holiday")?.trim() || undefined;
    const cookingMethod = searchParams.get("cookingMethod")?.trim() || undefined;
    const mainIngredient = searchParams.get("mainIngredient")?.trim() || undefined;

    const options: GetRecipesOptions = {
      limit,
      offset,
      search,
      allClients,
      sortBy:
        sort === "rating"
          ? "rating"
          : "dateModified",
      status,
      course,
      cuisine,
      diet,
      holiday,
      cookingMethod,
      mainIngredient,
      ids: ids.length ? ids : undefined,
      similarToId: Number.isInteger(similarToId)
        ? similarToId
        : undefined,
      includeBlankClient: true,
    };

    if (client) {
      options.client = client;
    }

    // 1. Fetch data from service layer (Returns typed frontend Recipe[] arrays)
    const recipes = await getRecipes(options);

    if (!recipes.length) {
      return NextResponse.json({
        recipes: [],
        count: 0,
        hasMore: false,
        nextCursor: null,
      });
    }

    const supportsPagination =
      !ids.length &&
      !Number.isInteger(similarToId);

    const hasMore =
      supportsPagination && recipes.length === limit;

    const nextCursor = hasMore
      ? String(offset + recipes.length)
      : null;

  
   
    return NextResponse.json({
      recipes,
      count: recipes.length,
      hasMore,
      nextCursor,
    });
  } catch (error) {
    console.error("GET /api/recipes failed", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to load recipes",
        message,
      },
      { status: 500 }
    );
  }
}