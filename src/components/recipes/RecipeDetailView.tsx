"use client";

import Link from "next/link";

import { buildRecipeFilterUrl } from "@/lib/recipes/recipeUrls";
import { Recipe } from "@/types/recipes";
import { useRecipeBox } from "@/hooks/useRecipeBox";
import { getSimilarRecipes } from "@/lib/recipes/recipeLookup";
import RecipeModuleHeader from "./RecipeModuleHeader";
import AddToMenuDialog from "./AddToMenuDialog";

type Props = {
  recipe: Recipe;
    
};

export default function RecipeDetailView({
  recipe,

}: Props) {
  const recipeBox = useRecipeBox();
  const similarRecipes = getSimilarRecipes(recipe);

  const isSaved =
    recipeBox.savedRecipeIds.includes(recipe.id);

  return (
    <div className="bg-white py-2 text-neutral-950">
     <RecipeModuleHeader
  title={recipe.name}
  subtitle={`${recipe.course} · Serves ${recipe.servings}`}
/>

      <main
        className="
          mx-auto
          grid
          max-w-6xl
          gap-6
          px-4
          py-6
          lg:grid-cols-[1fr_320px]
        "
      >
        <article
          className="
            border-2
            border-neutral-900
            bg-white
            p-4
          "
        >
          <div
            className="
              border-2
              border-neutral-900
              bg-[#e6e6e6]
              p-3
            "
          >
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="
                  max-h-[460px]
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-80
                  items-center
                  justify-center
                  bg-neutral-200
                  font-black
                  uppercase
                  tracking-widest
                  text-neutral-500
                "
              >
                No Image
              </div>
            )}
          </div>

          <div className="mt-5">
            <div
              className="
                mb-3
                flex
                flex-wrap
                gap-2
              "
            >
              <MetaPill>{recipe.course}</MetaPill>
              <MetaPill>
                Serves {recipe.servings}
              </MetaPill>
              <MetaPill>
                Rating {recipe.rating.toFixed(1)}
              </MetaPill>
              {recipe.prepTimeMinutes && (
                <MetaPill>
                  Prep {recipe.prepTimeMinutes} min
                </MetaPill>
              )}
              {recipe.cookTimeMinutes && (
                <MetaPill>
                  Cook {recipe.cookTimeMinutes} min
                </MetaPill>
              )}
            </div>

            <p
              className="
                max-w-3xl
                text-lg
                leading-relaxed
                text-neutral-700
              "
            >
              {recipe.intro}
            </p>
          </div>

          <div
            className="
              mt-6
              grid
              gap-6
              md:grid-cols-[280px_1fr]
            "
          >
            <section>
              <h2 className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
                Ingredients
              </h2>

              <ul className="space-y-2">
                {recipe.ingredients.map(ingredient => (
                  <li
                    key={ingredient.id}
                    className="
                      border-b
                      border-neutral-200
                      pb-2
                      text-sm
                    "
                  >
                    <span className="font-black">
                      {ingredient.quantity
                        ? `${ingredient.quantity} `
                        : ""}
                    </span>
                    {ingredient.name}
                    {ingredient.detail && (
                      <span className="text-neutral-500">
                        {" "}
                        — {ingredient.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
                Directions
              </h2>

              <ol className="space-y-4">
                {recipe.directions.map(
                  (direction, index) => (
                    <li
                      key={direction}
                      className="
                        grid
                        grid-cols-[36px_1fr]
                        gap-3
                        text-sm
                        leading-relaxed
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          border
                          border-neutral-900
                          font-black
                        "
                      >
                        {index + 1}
                      </span>
                      <span>{direction}</span>
                    </li>
                  )
                )}
              </ol>
            </section>
          </div>
        </article>

        <aside className="space-y-4">
          <div
            className="
              border-2
              border-neutral-900
              bg-neutral-100
              p-4
            "
          >
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              Recipe Box
            </h2>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() =>
                  recipeBox.toggleSavedRecipe(
                    recipe.id
                  )
                }
                className="  border
  border-neutral-900
  bg-neutral-900
  px-3
  py-3
  text-center
  text-xs
  font-black
  uppercase
  tracking-widest
  text-white"
              >
                {isSaved
                  ? "Remove from My Recipes"
                  : "Add to My Recipes"}
              </button>

              <AddToMenuDialog
  recipeName={recipe.name}
  buttonClassName="  border
  border-neutral-900
  bg-neutral-900
  px-3
  py-3
  text-center
  text-xs
  font-black
  uppercase
  tracking-widest
  text-white"
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
                  recipeBox.addRecipeIngredientsToShoppingList(
                    recipe
                  )
                }
                className="
  border
  border-neutral-900
  bg-neutral-900
  px-3
  py-3
  text-center
  text-xs
  font-black
  uppercase
  tracking-widest
  text-white
"
              >
                Add Ingredients to Shopping List
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="  border
  border-neutral-900
  bg-neutral-900
  px-3
  py-3
  text-center
  text-xs
  font-black
  uppercase
  tracking-widest
  text-white"
              >
                Print Recipe
              </button>
            </div>
          </div>

          <div
            className="
              border-2
              border-neutral-900
              p-4
            "
          >
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              See Other Recipes Like This
            </h2>

           <div className="flex flex-wrap gap-2">
  <RecipeTagLinks
    filter="cuisine"
    values={recipe.meta.cuisine}
  />

  <RecipeTagLinks
    filter="diet"
    values={recipe.meta.diet}
  />

  <RecipeTagLinks
    filter="mainIngredient"
    values={recipe.meta.mainIngredient}
  />

  <RecipeTagLinks
    filter="holiday"
    values={recipe.meta.holiday}
  />

  <RecipeTagLinks
    filter="cookingMethod"
    values={recipe.meta.cookingMethod}
  />
</div>
          </div>

          <div
            className="
              border-2
              border-neutral-900
              p-4
            "
          >
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              Similar Recipes
            </h2>

            <ul className="space-y-3">
              {similarRecipes.map(item => (
                <li
                  key={item.id}
                  className="
                    border-b
                    border-neutral-200
                    pb-2
                  "
                >
                  <Link
                    href={`/recipes/${item.slug}`}
                    className="
                      text-sm
                      font-black
                      uppercase
                      hover:underline
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      
    </div>
  );
}

function MetaPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="
        border
        border-neutral-300
        px-2
        py-1
        text-xs
        font-black
        uppercase
        tracking-widest
      "
    >
      {children}
    </span>
  );
}

function RecipeTagLinks({
  filter,
  values,
}: {
  filter:
    | "cuisine"
    | "diet"
    | "mainIngredient"
    | "holiday"
    | "cookingMethod"
    | "course";
  values?: string[];
}) {
  if (!values?.length) return null;

  return (
    <>
      {values.map(value => (
        <Link
          key={`${filter}-${value}`}
          href={buildRecipeFilterUrl(
            filter,
            value
          )}
          className="
            border
            border-neutral-300
            px-2
            py-1
            text-xs
            font-bold
            uppercase
            transition
            hover:border-neutral-900
            hover:bg-neutral-900
            hover:text-white
          "
        >
          {value}
        </Link>
      ))}
    </>
  );
}