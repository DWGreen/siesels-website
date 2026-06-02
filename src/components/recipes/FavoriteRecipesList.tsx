import Link from "next/link";

type Props = {
  recipes: Array<{
    id: number;
    slug: string;
    name: string;
    image?: string;
    rating: number;
  }>;
};

export default function FavoriteRecipesList({
  recipes,
}: Props) {
  const favoriteRecipes = recipes.slice(0, 10);

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
          href="/cooking?view=all"
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
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="
                    h-24
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-24
                    w-full
                    items-center
                    justify-center
                    bg-neutral-200
                    text-[10px]
                    font-black
                    uppercase
                    tracking-widest
                    text-neutral-500
                  "
                >
                  No Image
                </div>
              )}

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