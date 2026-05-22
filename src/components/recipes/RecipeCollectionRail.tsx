import Link from "next/link";

import { RecipeCollection } from "@/types/recipeCollections";

type Props = {
  collections: RecipeCollection[];
};

export default function RecipeCollectionRail({
  collections,
}: Props) {
  if (!collections.length) return null;

  return (
    <aside
      className="
        space-y-4
        border-2
        border-neutral-900
        bg-white
        p-3
      "
    >
      <h2
        className="
          border-b
          border-neutral-300
          pb-2
          text-xs
          font-black
          uppercase
          tracking-[0.2em]
        "
      >
        Featured Recipe Collections
      </h2>

      {collections.map(collection => (
        <Link
          key={collection.id}
          href={`/cooking/collections/${collection.id}`}
          className="
            block
            border-b
            border-neutral-200
            pb-3
            last:border-b-0
            last:pb-0
          "
        >
          <img
            src={collection.image}
            alt={collection.title}
            className="
              h-24
              w-full
              object-cover
            "
          />

          <h3
            className="
              mt-2
              text-sm
              font-black
              leading-tight
            "
          >
            {collection.title}
          </h3>

          {collection.subtitle && (
            <p
              className="
                mt-1
                text-xs
                leading-snug
                text-neutral-600
              "
            >
              {collection.subtitle}
            </p>
          )}

          <span
            className="
              mt-2
              inline-block
              text-[11px]
              font-black
              uppercase
              tracking-widest
              underline
            "
          >
            View Recipes
          </span>
        </Link>
      ))}
    </aside>
  );
}