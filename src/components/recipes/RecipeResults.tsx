"use client";

import { Recipe } from "@/types/recipes";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
  savedRecipeIds: number[];
  onToggleSaved: (recipeId: number) => void;
  onAddIngredients: (recipe: Recipe) => void;
  onAddToMenu?: (recipeId: number) => void;
};

export default function RecipeResults({
  recipes,
  savedRecipeIds,
  onToggleSaved,
  onAddIngredients,
  onAddToMenu,
}: Props) {
  return (
    <div className="p-4">
      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          border-b
          border-neutral-300
          pb-3
        "
      >
        <h2
          className="
            text-lg
            font-black
            uppercase
            tracking-widest
          "
        >
          Recipes
        </h2>

        <div className="text-sm font-bold text-neutral-600">
          {recipes.length} result
          {recipes.length === 1 ? "" : "s"}
        </div>
      </div>

      {recipes.length === 0 ? (
        <div
          className="
            border-2
            border-dashed
            border-neutral-300
            p-8
            text-center
          "
        >
          <h3 className="font-black uppercase tracking-widest">
            No recipes found
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Try clearing filters or searching for a different ingredient.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={savedRecipeIds.includes(
                recipe.id
              )}
              onToggleSaved={onToggleSaved}
              onAddIngredients={onAddIngredients}
              onAddToMenu={onAddToMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}