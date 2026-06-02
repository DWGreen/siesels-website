// src/app/api/recipes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getRecipeById } from "@/lib/recipes/recipeService";
import { recipeDetailToUiRecipe } from "@/lib/recipes/recipeDetailAdapter";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const recipeId = Number(id);

  if (!Number.isInteger(recipeId)) {
    return NextResponse.json(
      { error: "Invalid recipe id." },
      { status: 400 }
    );
  }

  const client =
    request.nextUrl.searchParams.get("client") ?? undefined;

  const recipeCard= await getRecipeById(recipeId, {
    client,
  });
  
  if (!recipeCard) {
    return NextResponse.json(
      { error: "Recipe not found." },
      { status: 404 }
    );
  }

  const recipe = recipeDetailToUiRecipe(recipeCard);

  return NextResponse.json({
    data: recipe,
  });
}