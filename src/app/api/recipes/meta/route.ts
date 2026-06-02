import { NextResponse } from "next/server";

import {
  getRecipeMetaFilters,
} from "@/lib/recipes/recipeService";

export async function GET() {
  try {
    const filters =
      await getRecipeMetaFilters();
  console.log("filters:", filters);
    return NextResponse.json(filters);
  } catch (error) {
    console.error(
      "GET /api/recipes/meta failed",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load recipe metadata",
      },
      { status: 500 }
    );
  }
}