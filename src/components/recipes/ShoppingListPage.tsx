"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useRecipeBox } from "@/hooks/useRecipeBox";
import {
  ShoppingListDisplayOptions,
  ShoppingListItem,
} from "@/lib/recipes/recipeBoxTypes";
import RecipeModuleHeader from "./RecipeModuleHeader";
export default function ShoppingListPage() {
  const recipeBox = useRecipeBox();

  const [displayOptions, setDisplayOptions] =
    useState<ShoppingListDisplayOptions>({
      hideCategories: false,
      hideMeasurements: false,
      hideDetails: false,
      hideRecipeTitles: false,
    });

  const groupedItems = useMemo(() => {
    return recipeBox.state.shoppingList.reduce<
      Record<string, typeof recipeBox.state.shoppingList>
    >((acc, item) => {
      const key =
        item.category || "Other Items";

      acc[key] = acc[key] ?? [];
      acc[key].push(item);

      return acc;
    }, {});
  }, [recipeBox.state.shoppingList]);

  return (
    <div className="bg-neutral-100 py-2 text-neutral-950">
  <RecipeModuleHeader
  title="My Shopping List"
  subtitle="Build your grocery list from recipes, weekly menus, and custom items."
/>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div
          className="
            mb-5
            border-2
            border-neutral-900
            p-4
            bg-white
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
            Display Options
          </h2>

          <div className="flex flex-wrap gap-4 text-sm">
            {[
              [
                "hideCategories",
                "Hide Categories",
              ],
              [
                "hideMeasurements",
                "Hide Measurements",
              ],
              ["hideDetails", "Hide Details"],
              [
                "hideRecipeTitles",
                "Hide Recipe Titles",
              ],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={
                    displayOptions[
                      key as keyof ShoppingListDisplayOptions
                    ]
                  }
                  onChange={event =>
                    setDisplayOptions(current => ({
                      ...current,
                      [key]: event.target.checked,
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <AddCustomItem
              onAdd={
                recipeBox.addCustomShoppingItem
              }
            />

            <button
              type="button"
              onClick={recipeBox.clearShoppingList}
              className="
                border
                border-neutral-900
                px-3
                py-2
                text-xs
                font-black
                uppercase
                tracking-widest
                bg-white
              "
            >
              Clear List
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="
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
              "
            >
              Print
            </button>
          </div>
        </div>

        {recipeBox.state.shoppingList.length === 0 ? (
          <div
            className="
              border-2
              border-dashed
              border-neutral-300
              p-8
              text-center
              bg-white
            "
          >
            <h2 className="font-black uppercase tracking-widest">
              Your shopping list is empty
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Add ingredients from a recipe or add custom items.
            </p>
          </div>
        ) : displayOptions.hideCategories ? (
          <ShoppingItems
            items={recipeBox.state.shoppingList}
            displayOptions={displayOptions}
            onToggle={recipeBox.toggleShoppingItem}
            onRemove={recipeBox.removeShoppingItem}
          />
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedItems).map(
              ([category, items]) => (
                <section
                  key={category}
                  className="
                    border-2
                    border-neutral-900
                    p-4
                    bg-white
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
                    {category}
                  </h2>

                  <ShoppingItems
                    items={items}
                    displayOptions={displayOptions}
                    onToggle={
                      recipeBox.toggleShoppingItem
                    }
                    onRemove={
                      recipeBox.removeShoppingItem
                    }
                  />
                </section>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function AddCustomItem({
  onAdd,
}: {
  onAdd: (name: string) => void;
}) {
  return (
    <form
      className="flex"
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
      <input
        name="item"
        placeholder="Add custom item"
        className="
          border
          border-neutral-900
          px-3
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
          py-2
          text-xs
          font-black
          uppercase
          tracking-widest
          text-white
        "
      >
        Add
      </button>
    </form>
  );
}

function ShoppingItems({
  items,
  displayOptions,
  onToggle,
  onRemove,
}: {
  items: ReturnType<
    typeof useRecipeBox
  >["state"]["shoppingList"];
  displayOptions: ShoppingListDisplayOptions;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li
          key={item.id}
          className="
            flex
            items-start
            justify-between
            gap-3
            border-b
            border-neutral-200
            pb-2
            text-sm
          "
        >
          <label className="flex gap-3">
            <input
              type="checkbox"
              checked={Boolean(item.checked)}
              onChange={() => onToggle(item.id)}
              className="mt-1"
            />

            <span
              className={
                item.checked
                  ? "text-neutral-400 line-through"
                  : ""
              }
            >
              {!displayOptions.hideMeasurements &&
                item.quantity && (
                  <strong>
                    {item.quantity}{" "}
                  </strong>
                )}

              {item.name}

              {!displayOptions.hideDetails &&
                item.detail && (
                  <span className="text-neutral-500">
                    {" "}
                    — {item.detail}
                  </span>
                )}

              {!displayOptions.hideRecipeTitles &&
                item.recipeName && (
                  <span className="block text-xs text-neutral-500">
                    From: {item.recipeName}
                  </span>
                )}
            </span>
          </label>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="
              text-xs
              font-black
              uppercase
              text-neutral-500
            "
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}