"use client";

import { useState } from "react";

import {
  OptionGroup,
  Recipe,
  RecipeCourse,
  RecipeFilters,
  RecipeMatchMode,
} from "@/lib/recipes/recipeTypes";


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
  groups: OptionGroup[];
  onApply: (filters: RecipeFilters) => void;
  onClose: () => void;
};

export default function AdvancedRecipeSearch({
  recipes,
  filters,
  groups,
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
  const [mainIngredient, setMainIngredient] =
    useState(filters.mainIngredient);
  const [holiday, setHoliday] = useState(
    filters.holiday
  );
  const [cookingMethod, setCookingMethod] =
    useState(filters.cookingMethod);



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
        flex
        flex-wrap
        items-center
        gap-3
        border-y
        border-neutral-300
        bg-neutral-100
        px-4
        py-3
      "
    >
      <div
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.25em]
          text-neutral-700
        "
      >
        Browse:
      </div>

      {groups.map(group => (
        <label
          key={group.value}
          className="sr-only"
          htmlFor={`browse-${group.value}`}
        >
          {group.label}
        </label>
      ))}

      {groups.map(group => (
        <select
          key={group.value}
          id={`browse-${group.value}`}
          value={
            group.value === "cuisine"
              ? cuisine
              : group.value === "diet"
                ? diet
                : group.value === "mainIngredient"
                  ? mainIngredient
                  : group.value === "holiday"
                    ? holiday
                    : cookingMethod
          }
          onChange={event => {
            const value = event.target.value;

            if (group.value === "cuisine") {
              setCuisine(value);
              return;
            }

            if (group.value === "diet") {
              setDiet(value);
              return;
            }

            if (group.value === "mainIngredient") {
              setMainIngredient(value);
              return;
            }

            if (group.value === "holiday") {
              setHoliday(value);
              return;
            }

            setCookingMethod(value);
          }}
          className="
            min-w-40
            border
            border-neutral-900
            bg-white
            px-3
            py-2
            text-sm
            font-bold
            uppercase
            tracking-wide
          "
        >
          <option value="">{group.label}</option>

          {group.options.map(option => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      ))}
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
      mainIngredient,
      holiday,
      cookingMethod,
      categoryValue: "",
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