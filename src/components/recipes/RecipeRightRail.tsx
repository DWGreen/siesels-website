"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Recipe } from "@/lib/recipes/recipeTypes";

type Props = {
  recipes: Recipe[];
  onSelectTag: (group: string, value: string) => void;
};

type DietSection = {
  label: string;
};

const healthyDietSections: DietSection[] = [
  { label: "Vegetarian" },
  { label: "Paleo" },
  { label: "High Fiber" },
  { label: "Vegan" },
];

export default function RecipeRightRail({
  recipes,
  onSelectTag,
}: Props) {
  const [healthyChoicesByDiet, setHealthyChoicesByDiet] =
    useState<Record<string, Recipe | null>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadHealthyChoices() {
      try {
        const response = await fetch(
          "/api/recipes/healthy-choices"
        );

        if (!response.ok || !isMounted) {
          return;
        }

        const data = await response.json();
        const grouped = (data.grouped ?? {}) as Record<string, Recipe | null>;

        setHealthyChoicesByDiet(grouped);
      } catch (error) {
        console.error(
          "Failed to load healthy diet sections",
          error
        );

        if (isMounted) {
          setHealthyChoicesByDiet({});
        }
      }
    }

    loadHealthyChoices();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasHealthyChoices = healthyDietSections.some(
    section => healthyChoicesByDiet[section.label] != null
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

        {!hasHealthyChoices ? (
          <p className="text-sm text-neutral-600">
            No healthy choices available right now.
          </p>
        ) : (
          <div className="space-y-4">
            {healthyDietSections.map(section => {
              const recipe = healthyChoicesByDiet[section.label];

              if (!recipe) {
                return null;
              }

              return (
                <div
                  key={section.label}
                  className="border-b border-neutral-200 pb-3"
                >
                  <h3 className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
                    {section.label}
                  </h3>

                  <Link
                    href={`/cooking/${recipe.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden border border-neutral-300 bg-neutral-200">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-black uppercase tracking-widest text-neutral-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <span className="flex-1 self-center text-xs font-black uppercase leading-tight group-hover:underline">
                      {recipe.name}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectTag("diet", section.label)
                    }
                    className="mt-2 text-xs font-black uppercase tracking-widest text-neutral-700 hover:underline"
                  >
                    View more
                  </button>
                </div>
              );
            })}
          </div>
        )}
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