import { NextRequest, NextResponse } from "next/server";

import { getRecipeCollectionsLive } from "@/lib/recipes/recipeCollectionService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const placement =
      searchParams.get("placement")?.trim() || undefined;
    const debug = searchParams.get("debug") === "1";
    const limitParam = Number(
      searchParams.get("limit") ?? "8"
    );

    const limit = Number.isInteger(limitParam)
      ? Math.max(1, Math.min(limitParam, 24))
      : 8;

    const collections = await getRecipeCollectionsLive({
      placement,
      limit,
      enforceDateWindow: false,
    });

    return NextResponse.json({
      collections,
      count: collections.length,
      ...(debug
        ? {
            diagnostics: collections.map(collection => ({
              id: collection.id,
              title: collection.title,
              recipeIds: collection.recipeIds ?? [],
              previewCount:
                collection.previewRecipes?.length ?? 0,
              previewRecipeIds:
                collection.previewRecipes?.map(
                  recipe => recipe.id
                ) ?? [],
            })),
          }
        : {}),
    });
  } catch (error) {
    console.error(
      "GET /api/recipes/collections failed",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to load recipe collections",
        message,
      },
      { status: 500 }
    );
  }
}
