"use client";

import { Recipe } from "@/types/recipes";

type Props = {
  recipes: Recipe[];
  onSelectTag: (group: string, value: string) => void;
};

export default function RecipeRightRail({
  recipes,
  onSelectTag,
}: Props) {
  const healthyChoices = recipes.filter(recipe =>
    recipe.meta.diet?.some(diet =>
      [
        "Gluten-Free",
        "Vegan",
        "Vegetarian",
        "Low Sugar",
        "Paleo",
      ].includes(diet)
    )
  );

  const popularTags = Array.from(
    new Set(
      recipes.flatMap(recipe => [
        ...(recipe.meta.diet ?? []),
        ...(recipe.meta.cuisine ?? []),
        ...(recipe.meta.cookingMethod ?? []),
      ])
    )
  ).slice(0, 16);

  return (
    <aside
      className="
        border-l
        border-neutral-300
              bg-neutral-100
        p-4
      "
    >
      <section className="mb-6">
        <h2
          className="
            mb-3
            text-sm
            font-black
            uppercase
            tracking-[0.2em]
          "
        >
          Healthy Choices
        </h2>

        <ul className="space-y-2 text-sm">
          {healthyChoices.slice(0, 5).map(recipe => (
            
            <li
              key={recipe.id}
              className="
                border-b
                border-neutral-200
                pb-2
                font-bold
              "
            >
              <a href={`/cooking/${recipe.slug}`}>{recipe.name}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2
          className="
            mb-3
            text-sm
            font-black
            uppercase
            tracking-[0.2em]
          "
        >
          See Other Recipes Like This
        </h2>

        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                onSelectTag("keyword", tag)
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
              {tag}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}