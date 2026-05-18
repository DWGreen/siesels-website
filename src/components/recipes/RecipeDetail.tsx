// src/components/recipes/RecipeDetail.tsx

import { Recipe } from "@/types/recipes";
import DirectionList from "./DirectionList";
import IngredientList from "./IngredientList";
import RecipeMetaTags from "./RecipeMetaTags";

type Props = {
  recipe: Recipe;
};

export default function RecipeDetail({ recipe }: Props) {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">
            {recipe.course}
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-neutral-950 md:text-6xl">
            {recipe.name}
          </h1>

          {recipe.intro ? (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">
              {recipe.intro}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {recipe.prepTime ? (
              <span className="border-2 border-neutral-900 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.15em]">
                Prep {recipe.prepTime}
              </span>
            ) : null}

            {recipe.cookTime ? (
              <span className="border-2 border-neutral-900 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.15em]">
                Cook {recipe.cookTime}
              </span>
            ) : null}

            {recipe.totalTime ? (
              <span className="border-2 border-neutral-900 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.15em]">
                Total {recipe.totalTime}
              </span>
            ) : null}
          </div>

          {recipe.image ? (
            <div className="mt-8 border-2 border-neutral-900 bg-[#e6e6e6] p-3">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8">
            <RecipeMetaTags recipe={recipe} />
          </div>

          <div className="mt-10">
            <DirectionList directions={recipe.directions} />
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:h-fit">
          <IngredientList
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />
        </div>
      </div>
    </article>
  );
}