// src/components/recipes/RecipeMetaTags.tsx

import { Recipe } from "@/types/recipes";

type Props = {
  recipe: Recipe;
};

export default function RecipeMetaTags({ recipe }: Props) {
  const tags = Object.entries(recipe.groups).flatMap(([groupName, values]) =>
    values.map((value) => ({
      groupName,
      value,
    }))
  );

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={`${tag.groupName}-${tag.value}`}
          className="
            border-2 border-neutral-900 bg-white px-3 py-1
            text-xs font-black uppercase tracking-[0.15em]
          "
        >
          {tag.value}
        </span>
      ))}
    </div>
  );
}