// src/app/api/recipes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getRecipes } from "@/lib/recipes/recipeService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get("search") ?? undefined;
  const client = searchParams.get("client") ?? undefined;

  const limit = Number(searchParams.get("limit") ?? 24);
  const offset = Number(searchParams.get("offset") ?? 0);

  const recipes = await getRecipes({
    search,
    client,
    limit,
    offset,
  });

  return NextResponse.json({
    data: recipes,
    meta: {
      limit,
      offset,
      count: recipes.length,
      client: client ?? null,
      search: search ?? null,
    },
  });
}