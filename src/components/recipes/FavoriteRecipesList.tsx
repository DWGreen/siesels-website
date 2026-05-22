import Link from "next/link";

import { Recipe } from "@/types/recipes";

type Props = {
  recipes: Recipe[];
};

export default function FavoriteRecipesList({
  recipes,
}: Props) {
  const favoriteRecipes = recipes
    .filter(recipe => recipe.image)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  if (!favoriteRecipes.length) {
    return null;
  }

  return (
    <section className="mt-6">
      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          border-b-2
          border-neutral-900
          pb-2
        "
      >
        <h2
          className="
            text-sm
            font-black
            uppercase
            tracking-[0.25em]
          "
        >
          Our Top 10 Favorites
        </h2>

        <Link
          href="/cooking?match=every"
          className="
            text-xs
            font-black
            uppercase
            tracking-widest
            hover:underline
          "
        >
          View All
        </Link>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
          md:grid-cols-5
          lg:grid-cols-5
        "
      >
        {favoriteRecipes.map((recipe, index) => (
          <Link
            key={recipe.id}
            href={`/cooking/${recipe.slug}`}
            className="
              group
              block
              border
              border-neutral-300
              bg-white
              transition
              hover:border-neutral-900
            "
          >
            <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="
                  h-24
                  w-full
                  object-cover
                "
              />

              <span
                className="
                  absolute
                  bottom-1
                  right-1
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  border
                  border-neutral-900
                  bg-neutral-900
                  text-xs
                  font-black
                  text-white
                "
              >
                {index + 1}
              </span>
            </div>

            <div className="p-2">
              <h3
                className="
                  line-clamp-2
                  text-xs
                  font-black
                  uppercase
                  leading-tight
                  group-hover:underline
                "
              >
                {recipe.name}
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-neutral-500
                "
              >
                Rating {recipe.rating.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}