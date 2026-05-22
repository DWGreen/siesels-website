"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { mockRecipes } from "@/data/mockRecipes";

import { useRecipeBox } from "@/hooks/useRecipeBox";

import {
  capitalizeDay,
  formatWeekKey,
  getEmptyWeekMenu,
  getNextWeekKey,
  getPreviousWeekKey,
  getWeekLabel,
  menuDays,
} from "@/lib/recipes/dateWeeks";

import { getRecipeById } from "@/lib/recipes/recipeLookup";

import { Recipe } from "@/types/recipes";

import RecipeModuleHeader from "./RecipeModuleHeader";

const buttonClass = `
  border
  border-neutral-900
  px-3
  py-2
  text-xs
  font-black
  uppercase
  tracking-widest
`;

const darkButtonClass = `
  border
  border-neutral-900
  bg-neutral-900
  px-3
  py-2
  text-xs
  font-black
  uppercase
  tracking-widest
  text-white
`;

export default function MyMenuPage() {
  const recipeBox = useRecipeBox();

  const [weekKey, setWeekKey] = useState(
    formatWeekKey()
  );

  const weekMenu = useMemo(
    () =>
      recipeBox.state.menuByWeek[weekKey] ??
      getEmptyWeekMenu(),
    [recipeBox.state.menuByWeek, weekKey]
  );

  const weekRecipes = useMemo<Recipe[]>(() => {
    const ids = Object.values(weekMenu).flat();

    return ids
      .map(getRecipeById)
      .filter(Boolean) as Recipe[];
  }, [weekMenu]);

  return (
    <div className="bg-neutral-100 py-2 text-neutral-950">
      <RecipeModuleHeader
        title="My Menu"
        subtitle="Plan weekly meals and build a shopping list from your recipes."
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div
          className="
            mb-5
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-2
            border-neutral-900
            bg-white
            p-4
          "
        >
          <div>
            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-neutral-500
              "
            >
              Week Of
            </div>

            <h2
              className="
                text-2xl
                font-black
                uppercase
              "
            >
              {getWeekLabel(weekKey)}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setWeekKey(
                  getPreviousWeekKey(weekKey)
                )
              }
              className={buttonClass}
            >
              Last Week
            </button>

            <button
              type="button"
              onClick={() =>
                setWeekKey(
                  getNextWeekKey(weekKey)
                )
              }
              className={buttonClass}
            >
              Next Week
            </button>

            <button
              type="button"
              onClick={() =>
                recipeBox.copyWeekToNextWeek(
                  weekKey
                )
              }
              className={buttonClass}
            >
              Copy Week
            </button>

            <button
              type="button"
              onClick={() =>
                recipeBox.loadSampleMenuIdeas(
                  mockRecipes
                    .slice(0, 5)
                    .map(recipe => recipe.id),
                  weekKey
                )
              }
              className={buttonClass}
            >
              Load Ideas
            </button>

            <button
              type="button"
              onClick={() =>
                recipeBox.addRecipesIngredientsToShoppingList(
                  weekRecipes
                )
              }
              className={darkButtonClass}
            >
              Add Week to Shopping List
            </button>
          </div>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-7
          "
        >
          {menuDays.map(day => {
            const recipeIds = weekMenu[day] ?? [];

            return (
              <section
                key={day}
                className="
                  min-h-[340px]
                  border-2
                  border-neutral-900
                  bg-white
                  p-3
                "
              >
                <h2
                  className="
                    mb-3
                    border-b
                    border-neutral-300
                    pb-2
                    text-sm
                    font-black
                    uppercase
                    tracking-[0.2em]
                  "
                >
                  {capitalizeDay(day)}
                </h2>

                {recipeIds.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    No recipes planned.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {recipeIds.map(recipeId => {
                      const recipe =
                        getRecipeById(recipeId);

                      if (!recipe) return null;

                      return (
                        <li
                          key={recipeId}
                          className="
                            border-b
                            border-neutral-200
                            pb-2
                          "
                        >
                          <Link
                            href={`/cooking/${recipe.slug}`}
                            className="
                              text-sm
                              font-black
                              uppercase
                              hover:underline
                            "
                          >
                            {recipe.name}
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              recipeBox.removeRecipeFromMenu(
                                recipe.id,
                                weekKey,
                                day
                              )
                            }
                            className="
                              mt-1
                              block
                              text-xs
                              font-black
                              uppercase
                              text-neutral-500
                            "
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <AddRecipeToDay
                  day={day}
                  onAdd={recipeId =>
                    recipeBox.addRecipeToMenu(
                      recipeId,
                      weekKey,
                      day
                    )
                  }
                />
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function AddRecipeToDay({
  day,
  onAdd,
}: {
  day: string;
  onAdd: (recipeId: number) => void;
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="mt-4">
      <select
        value={selected}
        onChange={event =>
          setSelected(event.target.value)
        }
        className="
          w-full
          border
          border-neutral-900
          px-2
          py-2
          text-xs
          font-bold
        "
      >
        <option value="">Add recipe...</option>

        {mockRecipes.map(recipe => (
          <option
            key={recipe.id}
            value={recipe.id}
          >
            {recipe.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          if (!selected) return;

          onAdd(Number(selected));
          setSelected("");
        }}
        className={`${darkButtonClass} mt-2 w-full`}
      >
        Add to {capitalizeDay(day)}
      </button>
    </div>
  );
}