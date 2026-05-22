import Link from "next/link";

import { HydratedRecipeCollection } from "@/types/recipeCollections";
import AddToMenuDialog from "./AddToMenuDialog";

type Props = {
  collection: HydratedRecipeCollection;
  onAddToMenu: (
    recipeId: number,
    weekId: string | undefined,
    day: string
  ) => void;
  weekKey: string;
};

export default function RecipeCollectionFeature({
  collection,
  onAddToMenu,
    weekKey,
}: Props) {


  return (
    <section
      className="
        border-2
        border-neutral-900
        bg-white
      "
    >
      <div>
        <img
          src={collection.image}
          alt={collection.title}
          className="
            h-[340px]
            w-full
            object-cover
            md:h-[460px]
          "
        />
      </div>

      <div
        className="
          border-t-2
          border-neutral-900
          bg-neutral-900
          p-5
          text-white
        "
      >
        <h1
          className="
            text-2xl
            font-black
            leading-tight
            tracking-wide
          "
        >
          {collection.title}
        </h1>

        {collection.description && (
          <p
            className="
              mt-2
              max-w-3xl
              text-sm
              leading-relaxed
              text-neutral-300
            "
          >
            {collection.description}
          </p>
        )}
      </div>

      <div
        className="
          grid
          gap-4
          p-4
          md:grid-cols-2
        "
      >
        {collection.recipes.map(recipe => (
          <RecipeCollectionItem
            key={recipe.id}
            recipe={recipe}
            onAddToMenu={onAddToMenu}
            weekKey={weekKey}
          />
        ))}
      </div>
    </section>
  );
}

function RecipeCollectionItem({
  recipe,
  onAddToMenu,
  weekKey,
}: {
  recipe: HydratedRecipeCollection["recipes"][number];
  onAddToMenu: (
    recipeId: number,
    weekId: string | undefined,
    day: string
  ) => void;
    weekKey: string;
}) {
  return (
    <article
      className="
        grid
        grid-cols-[110px_1fr]
        gap-3
        border-b
        border-neutral-200
        pb-4
      "
    >
      <Link href={`/cooking/${recipe.slug}`}>
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
              items-center
              justify-center
              bg-neutral-200
              text-[10px]
              font-black
              uppercase
              text-neutral-500
            "
          >
            No Image
          </div>
        )}
      </Link>

      <div>
        <Link
          href={`/cooking/${recipe.slug}`}
          className="
            text-sm
            font-black
            uppercase
            leading-tight
            hover:underline
          "
        >
          {recipe.name}
        </Link>

        <div
          className="
            mt-1
            text-xs
            font-bold
            uppercase
            tracking-widest
            text-neutral-500
          "
        >
          Rating {recipe.rating.toFixed(1)}
        </div>

        {recipe.intro && (
          <p
            className="
              mt-2
              line-clamp-2
              text-xs
              leading-relaxed
              text-neutral-600
            "
          >
            {recipe.intro}
          </p>
        )}

        <div
          className="
            mt-2
            flex
            flex-wrap
            gap-2
          "
        >
          <Link
            href={`/cooking/${recipe.slug}`}
            className="
              text-[11px]
              font-black
              uppercase
              tracking-widest
              underline
            "
          >
            Full Recipe
          </Link>

          <AddToMenuDialog
            recipeName={recipe.name}
            buttonLabel="Add to Menu"
            buttonClassName="
              text-[11px]
              font-black
              uppercase
              tracking-widest
              underline
            "
            linkOrButton="link"
            onAdd={day =>
              onAddToMenu(
                recipe.id,
                weekKey,
                day
              )
            }
          />
        </div>
      </div>
    </article>
  );
}