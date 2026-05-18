// src/components/recipes/RecipeGrid.tsx

import { Recipe } from "@/types/recipes";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
};

export default function RecipeGrid({ recipes }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="border-2 border-neutral-900 bg-white p-8 text-center">
        <h2 className="text-xl font-black">No recipes found</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Try a different search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}