"use client";

import { useState } from "react";

import {
  Recipe,
  RecipeCourse,
  RecipeFilters,
  RecipeMatchMode,
} from "@/types/recipes";

import { getUniqueMetaValues } from "@/lib/recipes/recipeFilters";

const courses: RecipeCourse[] = [
  "Dinner",
  "Breakfast",
  "Lunch",
  "Appetizer",
  "Snack",
  "Beverage",
  "Salad",
  "Side",
  "Soup",
];

type Props = {
  recipes: Recipe[];
  filters: RecipeFilters;
  onApply: (filters: RecipeFilters) => void;
  onClose: () => void;
};

export default function AdvancedRecipeSearch({
  recipes,
  filters,
  onApply,
  onClose,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(
    filters.searchTerm
  );

  const [matchMode, setMatchMode] =
    useState<RecipeMatchMode>(
      filters.matchMode
    );

  const [course, setCourse] = useState(
    filters.course
  );

  const [diet, setDiet] = useState(filters.diet);
  const [cuisine, setCuisine] = useState(
    filters.cuisine
  );

  const diets = getUniqueMetaValues(
    recipes,
    "diet"
  );

  const cuisines = getUniqueMetaValues(
    recipes,
    "cuisine"
  );

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/60
        p-4
      "
    >
      <div
        className="
          mx-auto
          max-w-3xl
          border-2
          border-neutral-900
          bg-white
          p-5
          shadow-xl
        "
      >
        <div
          className="
            mb-5
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-neutral-300
            pb-3
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-black
                uppercase
                tracking-tight
              "
            >
              Advanced Search
            </h2>

            <p className="mt-1 text-sm text-neutral-600">
              Search by phrase, course, cuisine, or special diet.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              border
              border-neutral-900
              px-3
              py-2
              text-xs
              font-black
              uppercase
            "
          >
            Close
          </button>
        </div>

        <div className="grid gap-5">
          <label className="block">
            <span
              className="
                mb-2
                block
                text-xs
                font-black
                uppercase
                tracking-widest
              "
            >
              Search Term
            </span>

            <input
              value={searchTerm}
              onChange={event =>
                setSearchTerm(
                  event.target.value
                )
              }
              className="
                w-full
                border
                border-neutral-900
                px-3
                py-2
              "
            />
          </label>

          <div>
            <div
              className="
                mb-2
                text-xs
                font-black
                uppercase
                tracking-widest
              "
            >
              Match
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                ["every", "Every Word"],
                ["any", "Any Word"],
                ["exact", "Exact Phrase"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    checked={matchMode === value}
                    onChange={() =>
                      setMatchMode(
                        value as RecipeMatchMode
                      )
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >
            <label>
              <span
                className="
                  mb-2
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-widest
                "
              >
                Course
              </span>

              <select
                value={course}
                onChange={event =>
                  setCourse(
                    event.target.value
                  )
                }
                className="
                  w-full
                  border
                  border-neutral-900
                  px-3
                  py-2
                "
              >
                <option value="">All Courses</option>
                {courses.map(item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span
                className="
                  mb-2
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-widest
                "
              >
                Special Diet
              </span>

              <select
                value={diet}
                onChange={event =>
                  setDiet(event.target.value)
                }
                className="
                  w-full
                  border
                  border-neutral-900
                  px-3
                  py-2
                "
              >
                <option value="">All Diets</option>
                {diets.map(item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span
                className="
                  mb-2
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-widest
                "
              >
                Cuisine
              </span>

              <select
                value={cuisine}
                onChange={event =>
                  setCuisine(
                    event.target.value
                  )
                }
                className="
                  w-full
                  border
                  border-neutral-900
                  px-3
                  py-2
                "
              >
                <option value="">All Cuisines</option>
                {cuisines.map(item => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
            border-t
            border-neutral-300
            pt-4
          "
        >
          <button
            type="button"
            onClick={() =>
              onApply({
                ...filters,
                searchTerm,
                matchMode,
                course,
                diet,
                cuisine,
              })
            }
            className="
              border
              border-neutral-900
              bg-neutral-900
              px-4
              py-2
              text-sm
              font-black
              uppercase
              tracking-widest
              text-white
            "
          >
            Search Recipes
          </button>
        </div>
      </div>
    </div>
  );
}