import { NextResponse } from "next/server";

import { getRecipes } from "@/lib/recipes/recipeService";

const HEALTHY_DIETS = [
  "Vegetarian",
  "Paleo",
  "High Fiber",
  "Vegan",
] as const;

export async function GET() {
  try {
    const grouped: Record<string, { id: number; slug: string; name: string; rating: number; image?: string } | null> = {};
    const usedIds: number[] = [];

    for (const diet of HEALTHY_DIETS) {
      try {
        const results = await getRecipes({
          diet,
          limit: 1,
          sortBy: "rating",
          allClients: true,
          excludeIds: usedIds.length ? usedIds : undefined,
        });

        const pick = results[0] ?? null;

        if (pick) {
          usedIds.push(pick.id);
          grouped[diet] = {
            id: pick.id,
            slug: pick.slug,
            name: pick.name,
            rating: pick.rating,
            image: pick.image,
          };
        } else {
          grouped[diet] = null;
        }
      } catch {
        grouped[diet] = null;
      }
    }

    return NextResponse.json({ grouped });
  } catch (error) {
    console.error("GET /api/recipes/healthy-choices failed", error);

    return NextResponse.json(
      { error: "Failed to load healthy choices" },
      { status: 500 }
    );
  }
}
