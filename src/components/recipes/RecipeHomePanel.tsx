import { useMemo } from "react";

import RecipeFeaturedSlideshow from "./RecipeFeaturedSlideshow";
import FavoriteRecipesList from "./FavoriteRecipesList";
import { getActiveRecipeSlides } from "@/data/mockRecipeSlides";
import { RecipeCollection } from "@/lib/recipes/recipeTypes";
import { RecipeSlide } from "@/types/recipeSlide";
type Props = {
  recipes: Array<{
    id: number;
    slug: string;
    name: string;
    image?: string;
    rating: number;
  }>;
  collections: RecipeCollection[];
  isLoadingFavorites?: boolean;
  isLoadingCollections?: boolean;
};

export default function RecipeHomePanel({
  recipes,
  collections,
  isLoadingFavorites = false,
  isLoadingCollections = false,
}: Props) {
  const slides = useMemo<RecipeSlide[]>(() => {
    const collectionSlides = collections
      .filter(collection => Boolean(collection.image))
      .slice(0, 6)
      .map((collection, index) => ({
        id: `collection-${collection.id}`,
        title: collection.title,
        subtitle: collection.subtitle,
        description: collection.description,
        image: collection.image,
        imageAlt: collection.title,
        eyebrow: "Recipe Collection",
        ctaLabel: "View Collection",
        linkHref: `/cooking/collections/${collection.id}`,
        linkType: "collection" as const,
        alsoNewTitle: "Featured Recipes",
        alsoNewLinks:
          collection.previewRecipes?.map(recipe => ({
            id: `collection-${collection.id}-recipe-${recipe.id}`,
            label: recipe.name,
            href: `/cooking/${recipe.slug}`,
          })) ?? [],
        sortOrder: index + 1,
        status: "active" as const,
      }));

    if (collectionSlides.length) {
      return collectionSlides;
    }

    return getActiveRecipeSlides();
  }, [collections]);

  return (
    <div className="p-4">
      {isLoadingCollections ? (
        <div className="border border-neutral-300 bg-white p-4">
          <div className="h-52 w-full animate-pulse bg-neutral-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-1/3 animate-pulse bg-neutral-200" />
            <div className="h-3 w-2/3 animate-pulse bg-neutral-200" />
            <div className="h-3 w-1/2 animate-pulse bg-neutral-200" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`collection-link-skeleton-${index}`}
                className="h-3 animate-pulse bg-neutral-200"
              />
            ))}
          </div>
        </div>
      ) : (
        <RecipeFeaturedSlideshow slides={slides} />
      )}

      <FavoriteRecipesList
        recipes={recipes}
        isLoading={isLoadingFavorites}
      />
    </div>
  );
}