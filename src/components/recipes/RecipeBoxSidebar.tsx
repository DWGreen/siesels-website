"use client";

import {
  Recipe,
  RecipeBoxState,
} from "@/types/recipes";
import Link from "next/link";
import {
  capitalizeDay,
  formatWeekKey,
  getEmptyWeekMenu,
  menuDays,
} from "@/lib/recipes/dateWeeks";
import { useMemo, useState } from "react";
import { getRecipeById } from "@/lib/recipes/recipeLookup";

type Props = {
  recipes: Recipe[];
  state: RecipeBoxState;
  onRemoveSavedRecipe: (recipeId: number) => void;
  onAddCustomShoppingItem: (name: string) => void;
  onRemoveShoppingItem: (itemId: string) => void;
  onRemoveRecipeFromMenu: (
    recipeId: number,
    weekKey: string,
    day: string
  ) => void;
  weekKey: string;
};

export default function RecipeBoxSidebar({
  recipes,
  state,
  onRemoveSavedRecipe,
  onAddCustomShoppingItem,
  onRemoveShoppingItem,
  onRemoveRecipeFromMenu,
  weekKey,
}: Props) {
  const savedRecipes = state.savedRecipes
    .map(saved =>
      recipes.find(
        recipe => recipe.id === saved.recipeId
      )
    )
    .filter(Boolean) as Recipe[];



  const weekMenu = useMemo(
    () =>
      state.menuByWeek[weekKey] ??
      getEmptyWeekMenu(),
    [state.menuByWeek, weekKey]
  );

  return (
    <aside
      className="
        border-r
        border-neutral-300
        bg-neutral-100
      "
    >
      <SidebarSection title="My Recipes">
        {savedRecipes.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Saved recipes will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {savedRecipes.map(recipe => (
              <li
                key={recipe.id}
                className="
                  flex
                  items-start
                  justify-between
                  gap-2
                  border-b
                  border-neutral-300
                  pb-2
                  text-sm
                "
              >
                <span className="font-bold">
                  {recipe.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onRemoveSavedRecipe(recipe.id)
                  }
                  className="
                    text-xs
                    font-black
                    uppercase
                    text-neutral-500
                    hover:text-neutral-900
                  "
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/cooking/my-recipes"
          className="
            mt-3
            block
            w-full
            border
            border-neutral-900
            px-3
            py-2
            text-center
            text-xs
            font-black
            uppercase
            tracking-widest
          "
        >
          View My Recipes
        </Link>
      </SidebarSection>

      <SidebarSection title="My Menu">
        <div className="space-y-2">
          {menuDays.map(day => {
            const recipeIds = weekMenu[day] ?? [];

            return (
              <section
                key={day}
                className="bg-white p-3"
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
                          key={`${day}-${recipeId}`}
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
                              onRemoveRecipeFromMenu(
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
              </section>
            );
          })}
        </div>

        <Link
          href="/cooking/my-menu"
          className="
            mt-3
            block
            w-full
            border
            border-neutral-900
            px-3
            py-2
            text-center
            text-xs
            font-black
            uppercase
            tracking-widest
          "
        >
          View My Menu
        </Link>
      </SidebarSection>

      <SidebarSection title="My Shopping List">
        {state.shoppingList.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Add recipe ingredients or custom items.
          </p>
        ) : (
          <ul className="space-y-2">
            {state.shoppingList.map(item => (
              <li
                key={item.id}
                className="
                  flex
                  items-start
                  justify-between
                  gap-2
                  border-b
                  border-neutral-300
                  pb-2
                  text-sm
                "
              >
                <span>
                  {item.quantity
                    ? `${item.quantity} `
                    : ""}
                  {item.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onRemoveShoppingItem(item.id)
                  }
                  className="
                    text-xs
                    font-black
                    uppercase
                    text-neutral-500
                    hover:text-neutral-900
                  "
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/cooking/shoppinglist"
          className="
            mt-3
            block
            w-full
            border
            border-neutral-900
            px-3
            py-2
            text-center
            text-xs
            font-black
            uppercase
            tracking-widest
          "
        >
          View Shopping List
        </Link>
      </SidebarSection>

      <AddShoppingItemForm
        onAdd={onAddCustomShoppingItem}
      />

      <div
        className="
          border-t
          border-neutral-300
          p-4
          text-xs
          leading-relaxed
          text-neutral-500
        "
      >
        My Recipe Box info is saved locally on this
        computer for 30 days.
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="
        border-b
        border-neutral-300
        p-4
      "
    >
      <h2
        className="
          mb-3
          text-sm
          font-black
          uppercase
          tracking-[0.2em]
        "
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function AddShoppingItemForm({
  onAdd,
}: {
  onAdd: (name: string) => void;
}) {
  return (
    <form
      className="
        border-b
        border-neutral-300
        p-4
      "
      onSubmit={event => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(
          formData.get("item") ?? ""
        ).trim();

        if (!name) return;

        onAdd(name);
        form.reset();
      }}
    >
      <h2
        className="
          mb-3
          text-sm
          font-black
          uppercase
          tracking-[0.2em]
        "
      >
        Add to Shopping List
      </h2>

      <div className="flex">
        <input
          name="item"
          placeholder="Enter Custom Item"
          className="
            min-w-0
            flex-1
            border
            border-neutral-900
            px-2
            py-2
            text-sm
          "
        />

        <button
          type="submit"
          className="
            border
            border-l-0
            border-neutral-900
            bg-neutral-900
            px-3
            text-xs
            font-black
            uppercase
            text-white
          "
        >
          Add
        </button>
      </div>
    </form>
  );
}