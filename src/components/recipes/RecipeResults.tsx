"use client";

import { useEffect, useRef } from "react";

import { Recipe } from "@/lib/recipes/recipeTypes";
import RecipeCard from "./RecipeCard";

type Props = {
  recipes: Recipe[];
  savedRecipeIds: number[];
  onToggleSaved: (recipeId: number) => void;
  onAddIngredients: (recipe: Recipe) => void;
onAddToMenu: (
    recipeId: number,
    weekId: string | undefined,
    day: string
  ) => void;
  onSelectTag: (group: string, value: string) => void;
  weekKey: string;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
};

export default function RecipeResults({
  recipes,
  savedRecipeIds,
  onToggleSaved,
  onAddIngredients,
  onAddToMenu,
  onSelectTag,
  weekKey,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: Props) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !hasMore || isLoadingMore || !onLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

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
        <>
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >
            {recipes.map(recipe => (
              <RecipeCard
                onSelectTag={onSelectTag}
                key={recipe.id}
                recipe={recipe}
                isSaved={savedRecipeIds.includes(
                  recipe.id
                )}
                onToggleSaved={onToggleSaved}
                onAddIngredients={onAddIngredients}
                onAddToMenu={onAddToMenu}
                weekKey={weekKey}
              />
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="pt-4 text-center"
          >
            {isLoadingMore && (
              <p className="text-sm font-bold text-neutral-600">
                Loading more recipes...
              </p>
            )}
            {!hasMore && recipes.length > 0 && (
              <p className="text-sm text-neutral-500">
                You have reached the end of the results.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}