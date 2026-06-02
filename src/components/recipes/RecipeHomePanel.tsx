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
};

export default function RecipeHomePanel({
  recipes,
  collections,
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
      <RecipeFeaturedSlideshow slides={slides} />

      <FavoriteRecipesList recipes={recipes} />
    </div>
  );
}