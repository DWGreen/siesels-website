import Link from "next/link";

import { HydratedRecipeCollection } from "@/lib/recipes/recipeTypes";

type Props = {
  collection: HydratedRecipeCollection;
};

export default function RecipeCollectionFeature({
  collection,
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
    </section>
  );
}