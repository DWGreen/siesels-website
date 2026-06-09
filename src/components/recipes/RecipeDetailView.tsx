"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buildRecipeFilterUrl } from "@/lib/recipes/recipeUrls";
import {
  Recipe,
  RecipeRatingOption,
  RecipeRatingVote,
} from "@/lib/recipes/recipeTypes";
import { useRecipeBox } from "@/hooks/useRecipeBox";
import { formatWeekKey } from "@/lib/recipes/dateWeeks";
import RecipeModuleHeader from "./RecipeModuleHeader";
import AddToMenuDialog from "./AddToMenuDialog";
import RecipeBoxSidebar from "./RecipeBoxSidebar";

function formatIngredientQuantity(ingredient: {
  whole: number;
  numerator: number;
  denominator: number;
  size: string;
}) {
  const parts: string[] = [];

  if (ingredient.whole > 0) {
    parts.push(String(ingredient.whole));
  }

  if (
    ingredient.denominator > 0 &&
    ingredient.numerator > 0
  ) {
    parts.push(
      `${ingredient.numerator}/${ingredient.denominator}`
    );
  }

  if (ingredient.size) {
    parts.push(ingredient.size);
  }

  return parts.join(" ");
}

const ratingOptions: RecipeRatingOption[] = [
  { vote: 1, label: "Not My Style" },
  { vote: 2, label: "Okay" },
  { vote: 3, label: "Good" },
  { vote: 4, label: "Great" },
  { vote: 5, label: "Incredible" },
];

type Props = {
  recipe: Recipe;
    
};

export default function RecipeDetailView({
  recipe,

}: Props) {
  const recipeBox = useRecipeBox();
  const weekKey = formatWeekKey();
  const [displayRating, setDisplayRating] =
    useState(recipe.rating);
  const [savedRecipes, setSavedRecipes] =
    useState<Recipe[]>([]);
  const [isLoadingSavedRecipes, setIsLoadingSavedRecipes] =
    useState(true);
  const [similarRecipes, setSimilarRecipes] =
    useState<Recipe[]>([]);
  const [isLoadingSimilarRecipes, setIsLoadingSimilarRecipes] =
    useState(true);
  const [showRatingDialog, setShowRatingDialog] =
    useState(false);
  const [isSubmittingRating, setIsSubmittingRating] =
    useState(false);
  const [ratingError, setRatingError] =
    useState<string | null>(null);
  const [ratingSuccess, setRatingSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedRecipes() {
      if (isMounted) {
        setIsLoadingSavedRecipes(true);
      }
      const ids = recipeBox.state.savedRecipes.map(
        item => item.recipeId
      );

      if (!ids.length) {
        if (isMounted) {
          setSavedRecipes([]);
          setIsLoadingSavedRecipes(false);
        }
        return;
      }

      try {
        const params = new URLSearchParams({
          ids: ids.join(","),
          limit: String(ids.length),
        });

        const response = await fetch(
          `/api/recipes?${params.toString()}`
        );

        if (!response.ok || !isMounted) {
          return;
        }

        const data = await response.json();
        setSavedRecipes(data.recipes ?? []);
      } catch {
        if (isMounted) {
          setSavedRecipes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSavedRecipes(false);
        }
      }
    }

    loadSavedRecipes();

    return () => {
      isMounted = false;
    };
  }, [recipeBox.state.savedRecipes]);

  useEffect(() => {
    let isMounted = true;

    async function loadSimilarRecipes() {
      try {
        if (isMounted) {
          setIsLoadingSimilarRecipes(true);
        }
        const params = new URLSearchParams({
          limit: "4",
          similarToId: String(recipe.id),
        });

        const response = await fetch(
          `/api/recipes?${params.toString()}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setSimilarRecipes(
          (data.recipes ?? []).filter(
            (item: Recipe) => item.id !== recipe.id
          )
        );
      } catch {
        if (isMounted) {
          setSimilarRecipes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSimilarRecipes(false);
        }
      }
    }

    loadSimilarRecipes();

    return () => {
      isMounted = false;
    };
  }, [recipe.id]);

  useEffect(() => {
    setDisplayRating(recipe.rating);
    setRatingError(null);
    setRatingSuccess(null);
  }, [recipe.id, recipe.rating]);

  async function handleSubmitRating(vote: RecipeRatingVote) {
    setIsSubmittingRating(true);
    setRatingError(null);

    try {
      const response = await fetch(
        `/api/recipes/${recipe.id}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vote }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to submit rating (${response.status})`
        );
      }

      const data = await response.json();

      if (typeof data?.summary?.average === "number") {
        setDisplayRating(data.summary.average);
      }

      const selected = ratingOptions.find(
        option => option.vote === vote
      );

      setRatingSuccess(
        selected
          ? `Thanks for rating: ${selected.label}`
          : "Thanks for rating this recipe."
      );
      setShowRatingDialog(false);
    } catch (error) {
      console.error("Failed to submit recipe rating", error);
      setRatingError("Could not submit rating. Please try again.");
    } finally {
      setIsSubmittingRating(false);
    }
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function handlePrintRecipe() {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      // Fallback to native page print if popup creation is blocked.
      window.print();
      return;
    }

    const ingredientLines = recipe.ingredients
      .map((ingredient, index) => {
        const quantity = formatIngredientQuantity(ingredient);
        const base = `${quantity ? `${quantity} ` : ""}${ingredient.ingredient}`;
        const line = ingredient.description
          ? `${base} - ${ingredient.description}`
          : base;
        return `<li><span class="num">${index + 1}</span><span class="txt">${escapeHtml(line)}</span></li>`;
      })
      .join("");

    const directionLines = recipe.directions
      .map((step, index) =>
        `<li><span class="num">${index + 1}</span><span class="txt">${escapeHtml(step)}</span></li>`
      )
      .join("");

    const imageBlock = recipe.image
      ? `<div class="hero-wrap"><img class="hero-image" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)}" /></div>`
      : "";

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(recipe.name)} - Print</title>
    <style>
      body { font-family: Georgia, serif; color: #111; margin: 28px; line-height: 1.45; }
      .sheet { max-width: 860px; margin: 0 auto; }
      .hero-wrap { border: 2px solid #111; padding: 8px; margin-bottom: 14px; background: #f3f3f3; }
      .hero-image { width: 100%; max-height: 360px; object-fit: cover; display: block; }
      h1 { margin: 0 0 6px; font-size: 30px; letter-spacing: 0.01em; }
      .meta { margin: 0 0 14px; font-size: 13px; color: #333; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
      h2 { font-size: 16px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 0.14em; }
      p { margin: 0 0 12px; }
      .numbered-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 9px; }
      .numbered-list li { display: grid; grid-template-columns: 30px 1fr; gap: 10px; align-items: start; }
      .numbered-list .num { border: 2px solid #111; font-size: 12px; font-weight: 700; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: #fff; }
      .ingredients-list .txt { font-size: 14px; }
      .directions-list .txt { font-size: 14px; }
      .footer { margin-top: 24px; font-size: 12px; color: #444; border-top: 1px solid #ddd; padding-top: 8px; }
      @media print { body { margin: 12mm; } }
    </style>
  </head>
  <body>
    <div class="sheet">
      ${imageBlock}
      <h1>${escapeHtml(recipe.name)}</h1>
      <p class="meta">${escapeHtml(recipe.course)} | Serves ${escapeHtml(recipe.servings || "N/A")} | Rating ${escapeHtml(recipe.rating.toFixed(1))}</p>
      <p>${escapeHtml(recipe.intro)}</p>
      <h2>Ingredients</h2>
      <ul class="numbered-list ingredients-list">${ingredientLines}</ul>
      <h2>Directions</h2>
      <ol class="numbered-list directions-list">${directionLines}</ol>
      <p class="footer">Printed from Siesel's Meats Recipes</p>
    </div>
  </body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    printWindow.onload = triggerPrint;
    // Some browsers do not reliably fire onload for document.write content.
    setTimeout(triggerPrint, 150);
    printWindow.onafterprint = () => printWindow.close();
  }

  const isSaved =
    recipeBox.savedRecipeIds.includes(recipe.id);

  return (
    <div className="bg-white py-2 text-neutral-950">
     <RecipeModuleHeader
  title={recipe.name}
  subtitle={`${recipe.course} · Serves ${recipe.servings}`}
/>

      <div
        className="
          mx-auto
          grid
         
          gap-4
          px-4
          py-6
          lg:grid-cols-[280px_1fr]
        "
      >
        <RecipeBoxSidebar
          savedRecipes={savedRecipes}
          isLoadingSavedRecipes={isLoadingSavedRecipes}
          state={recipeBox.state}
          onRemoveSavedRecipe={
            recipeBox.removeSavedRecipe
          }
          onAddCustomShoppingItem={
            recipeBox.addCustomShoppingItem
          }
          onRemoveShoppingItem={
            recipeBox.removeShoppingItem
          }
          onRemoveRecipeFromMenu={
            recipeBox.removeRecipeFromMenu
          }
          weekKey={weekKey}
        />

        <main
          className="
            grid
            gap-6
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
                Rating {displayRating.toFixed(1)}
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
                      {formatIngredientQuantity(
                        ingredient
                      )
                        ? `${formatIngredientQuantity(
                            ingredient
                          )} `
                        : ""}
                    </span>
                    {ingredient.ingredient}
                    {ingredient.description && (
                      <span className="text-neutral-500">
                        {" "}
                        - {ingredient.description}
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
                  onClick={handlePrintRecipe}
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

                <button
                  type="button"
                  onClick={() => setShowRatingDialog(true)}
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
                  Rate This Recipe
                </button>
              </div>

              {ratingSuccess && (
                <p className="mt-3 text-xs font-bold text-emerald-700">
                  {ratingSuccess}
                </p>
              )}

              {ratingError && (
                <p className="mt-3 text-xs font-bold text-red-700">
                  {ratingError}
                </p>
              )}
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
                {isLoadingSimilarRecipes ? (
                  <li className="text-sm text-neutral-600">Loading similar recipes...</li>
                ) : similarRecipes.length === 0 ? (
                  <li className="text-sm text-neutral-600">No similar recipes available right now.</li>
                ) : similarRecipes.map(item => (
                  <li
                    key={item.id}
                    className="
                      border-b
                      border-neutral-200
                      pb-2
                    "
                  >
                    <Link
                      href={`/cooking/${item.slug}`}
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

      {showRatingDialog && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-xl
              border-2
              border-neutral-900
              bg-white
              p-4
            "
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black uppercase tracking-widest">
                Rate this Recipe
              </h2>

              <button
                type="button"
                onClick={() => setShowRatingDialog(false)}
                className="text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-neutral-900"
              >
                Close
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {ratingOptions.map(option => (
                <button
                  key={option.vote}
                  type="button"
                  disabled={isSubmittingRating}
                  onClick={() =>
                    handleSubmitRating(option.vote)
                  }
                  className="border border-neutral-900 px-3 py-3 text-xs font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      
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