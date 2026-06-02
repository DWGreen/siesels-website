import { NextRequest, NextResponse } from "next/server";

import { submitRecipeRating } from "@/lib/recipes/recipeService";
import { RecipeRatingVote } from "@/lib/recipes/recipeTypes";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

function isValidVote(value: number): value is RecipeRatingVote {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export async function POST(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const recipeId = Number(id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return NextResponse.json(
        { error: "Invalid recipe id." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const vote = Number(body?.vote);

    if (!isValidVote(vote)) {
      return NextResponse.json(
        { error: "Vote must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    const summary = await submitRecipeRating({
      recipeId,
      vote,
    });

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("POST /api/recipes/[id]/ratings failed", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to submit rating",
        message,
      },
      { status: 500 }
    );
  }
}
