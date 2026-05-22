"use client";

import Link from "next/link";
import { Recipe } from "@/types/recipes";
import AddToMenuDialog from "./AddToMenuDialog";

import { buildRecipeFilterUrl } from "@/lib/recipes/recipeUrls";
type Props = {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSaved: (recipeId: number) => void;
  onAddIngredients: (recipe: Recipe) => void;
  onAddToMenu: (
    recipeId: number,
    weekId: string | undefined,
    day: string
  ) => void;
  onSelectTag: (group: string, value: string) => void;
  weekKey: string;  
};

export default function RecipeCard({
  recipe,
  isSaved,
  onToggleSaved,
  onAddIngredients,
  onAddToMenu,
  onSelectTag,
  weekKey,
}: Props) {
   
  return (
    <article
      className="
        border-2
        border-neutral-900
        bg-white
        p-3
      "
    >
      <Link href={`/cooking/${recipe.slug}`}>
        <div
          className="
  
            bg-[#e6e6e6]
            p-2
          "
        >
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="
                h-48
                w-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-48
                items-center
                justify-center
                bg-neutral-200
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-neutral-500
              "
            >
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="pt-4">
        <div
          className="
            mb-2
            text-xs
            font-black
            uppercase
            tracking-[0.25em]
            text-neutral-500
          "
        >
          {recipe.course} · Serves {recipe.servings}
        </div>

        <Link href={`/cooking/${recipe.slug}`}>
          <h2
            className="
              text-xl
              font-black
              uppercase
              leading-none
              tracking-tight
              hover:underline
            "
          >
            {recipe.name}
          </h2>
        </Link>

        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-neutral-700
          "
        >
          {recipe.intro}
        </p>

        <div
          className="
            mt-3
            flex
            flex-wrap
            gap-2
          "
        >
            <RecipeTagLinks
    filter="cuisine"
    values={recipe.meta.cuisine}
    onSelectTag={onSelectTag}
  />

  <RecipeTagLinks
    filter="diet"
    values={recipe.meta.diet}
    onSelectTag={onSelectTag}
  />

  <RecipeTagLinks
    filter="mainIngredient"
    values={recipe.meta.mainIngredient}
    onSelectTag={onSelectTag}
  />
         
        </div>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              onToggleSaved(recipe.id)
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
            "
          >
            {isSaved
              ? "Remove"
              : "Add to My Recipes"}
          </button>

         
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
    onAddToMenu(
      recipe.id,
      weekKey,
      day
    )
  }
/>
          

          <button
            type="button"
            onClick={() =>
              onAddIngredients(recipe)
            }
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
            Add Ingredients
          </button>
        </div>
      </div>
    </article>
  );
}


function RecipeTagLinks({
  filter,
  values,
  onSelectTag,
}: {
  filter:
    | "cuisine"
    | "diet"
    | "mainIngredient"
    | "holiday"
    | "cookingMethod"
    | "course";
  values?: string[];
  onSelectTag: (group: string, value: string) => void;
}) {
  if (!values?.length) return null;

  return (
    <>
      {values.map(value => (
        <button
              key={value}
              type="button"
              onClick={() =>
                onSelectTag(filter, value)
              }
              className="
                border
                border-neutral-300
                px-2
                py-1
                text-xs
                font-bold
                uppercase
                hover:border-neutral-900
              "
            >
              {value}
            </button>
       
      ))}
    </>
  );
}