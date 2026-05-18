// src/components/recipes/RecipeCard.tsx

import Link from "next/link";
import { Recipe } from "@/types/recipes";

type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link
      href={`/cooking/recipes/${recipe.slug}`}
      className="
        group block border-2 border-neutral-900 bg-white p-3
        transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#171717]
      "
    >
      <div className="border border-neutral-900 bg-[#e6e6e6] p-3">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.name}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div
            className="
              flex h-52 w-full items-center justify-center
              bg-neutral-200 text-xs font-black uppercase
              tracking-[0.25em] text-neutral-500
            "
          >
            No Image
          </div>
        )}
      </div>

      <div className="px-1 pb-1 pt-4">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
          {recipe.course}
        </p>

        <h3 className="mt-2 text-xl font-black leading-tight text-neutral-950">
          {recipe.name}
        </h3>

        {recipe.intro ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-700">
            {recipe.intro}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {recipe.totalTime ? (
            <span className="border border-neutral-900 px-2 py-1 text-xs font-bold uppercase">
              {recipe.totalTime}
            </span>
          ) : null}

          {recipe.servings ? (
            <span className="border border-neutral-900 px-2 py-1 text-xs font-bold uppercase">
              Serves {recipe.servings}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}