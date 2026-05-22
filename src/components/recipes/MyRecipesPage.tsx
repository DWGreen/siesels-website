"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { mockRecipes } from "@/data/mockRecipes";
import { useRecipeBox } from "@/hooks/useRecipeBox";
import {
  MyRecipesSortOption,
  Recipe,
} from "@/types/recipes";
import { getRecipesByIds } from "@/lib/recipes/recipeLookup";
import RecipeModuleHeader from "./RecipeModuleHeader";
import AddToMenuDialog from "./AddToMenuDialog";

export default function MyRecipesPage() {
  const recipeBox = useRecipeBox();

  const [sortBy, setSortBy] =
    useState<MyRecipesSortOption>("dateAdded");

  const [searchTerm, setSearchTerm] = useState("");

  const savedRecipes = useMemo(() => {
    const ids = recipeBox.state.savedRecipes.map(
      item => item.recipeId
    );

    const recipes = getRecipesByIds(ids);

    const dateById = new Map(
      recipeBox.state.savedRecipes.map(item => [
        item.recipeId,
        item.dateAdded,
      ])
    );

    return sortSavedRecipes(
      recipes,
      sortBy,
      dateById
    ).filter(recipe =>
      recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [
    recipeBox.state.savedRecipes,
    sortBy,
    searchTerm,
  ]);

  return (
    <div className="bg-neutral-100 py-2 text-neutral-950">
      <RecipeModuleHeader
        title="My Recipes"
        subtitle="Saved recipes are stored locally on this computer."
      />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div
          className="
            mb-5
            grid
            gap-3
            md:grid-cols-[1fr_220px]
          "
        >
          <input
            value={searchTerm}
            onChange={event =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search My Recipes"
            className="
              border
              border-neutral-900
              px-3
              py-2
              text-sm
              font-bold
              uppercase
              bg-white
            "
          />

          <select
            value={sortBy}
            onChange={event =>
              setSortBy(
                event.target
                  .value as MyRecipesSortOption
              )
            }
            className="
              border
              border-neutral-900
              px-3
              py-2
              text-sm
              font-bold
              bg-white
            "
          >
            <option value="dateAdded">
              Sort by Date Added
            </option>
            <option value="course">
              Sort by Course
            </option>
            <option value="name">
              Sort by Recipe Name
            </option>
            <option value="rating">
              Sort by Star Ranking
            </option>
          </select>
        </div>

        {savedRecipes.length === 0 ? (
          <EmptyState
            title="No saved recipes"
            text="Add recipes from the cooking page and they will appear here."
          />
        ) : (
          <div className="grid gap-3">
            {savedRecipes.map(recipe => (
              <article
                key={recipe.id}
                className="
                  border-2
                  border-neutral-900
                  p-4
                  bg-white
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <div
                      className="
                        mb-1
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.2em]
                        text-neutral-500
                      "
                    >
                      {recipe.course} · Rating{" "}
                      {recipe.rating.toFixed(1)}
                    </div>

                    <Link
                      href={`/cooking/${recipe.slug}`}
                      className="
                        text-xl
                        font-black
                        uppercase
                        hover:underline
                      "
                    >
                      {recipe.name}
                    </Link>

                    <p className="mt-2 text-sm text-neutral-700">
                      {recipe.intro}
                    </p>
                  </div>

                  <div className="flex gap-2">
                      
                              <AddToMenuDialog
                     recipeName={recipe.name}
                     buttonLabel="Add to Menu"
                     buttonClassName="
                       border
                       border-neutral-900
                       px-3
                       py-2
                       text-xs
                       font-black
                       uppercase
                       tracking-widest
                     "
                     onAdd={day =>
                       recipeBox.addRecipeToMenu(
                         recipe.id,
                         undefined,
                         day
                       )
                     }
                   />

                    <button
                      type="button"
                      onClick={() =>
                        recipeBox.removeSavedRecipe(
                          recipe.id
                        )
                      }
                      className="
  border
  border-neutral-900
  px-3
  py-2
  text-xs
  font-black
  uppercase
  tracking-widest
  whitespace-nowrap
"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      
    </div>
  );
}

function sortSavedRecipes(
  recipes: Recipe[],
  sortBy: MyRecipesSortOption,
  dateById: Map<number, string>
) {
  return [...recipes].sort((a, b) => {
    if (sortBy === "course") {
      return a.course.localeCompare(b.course);
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    const aDate = dateById.get(a.id) ?? "";
    const bDate = dateById.get(b.id) ?? "";

    return bDate.localeCompare(aDate);
  });
}

function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header
      className="
        border-b-2
        border-neutral-900
        bg-neutral-900
        px-4
        py-5
        text-white
      "
    >
      <Link
        href="/cooking"
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.25em]
          text-white/70
        "
      >
        ← Back to Cooking
      </Link>

      <h1
        className="
          mt-3
          text-4xl
          font-black
          uppercase
          tracking-tight
        "
      >
        {title}
      </h1>

      <p className="mt-2 text-sm text-white/70">
        {subtitle}
      </p>
    </header>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        border-2
        border-dashed
        border-neutral-300
        p-8
        text-center
      "
    >
      <h2 className="font-black uppercase tracking-widest">
        {title}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        {text}
      </p>
    </div>
  );
}