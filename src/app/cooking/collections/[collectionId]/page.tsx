import { cache } from "react";
import { notFound } from "next/navigation";

import RecipeModuleHeader from "@/components/recipes/RecipeModuleHeader";
import RecipeCollectionPageClient from "@/components/recipes/RecipeCollectionPageClient";

import {
  getRecipeCollectionById,
  getRelatedRecipeCollections,
} from "@/data/mockRecipeCollections";
import {
  getRecipeCollectionByIdOrSlugLive,
  getRelatedRecipeCollectionsLive,
} from "@/lib/recipes/recipeCollectionService";

type Props = {
  params: Promise<{
    collectionId: string;
  }>;
};

const loadCollection = cache(async (id: string) => {
  const live = await getRecipeCollectionByIdOrSlugLive(id);
  return { live, collection: live ?? getRecipeCollectionById(id) };
});

export async function generateMetadata({ params }: Props) {
  const { collectionId } = await params;
  const { collection } = await loadCollection(collectionId);
  return { title: `${collection?.title ?? "Recipe Collection Not Found"} | Iowa Meat Farms & Siesel’s Meats` };
}

export default async function RecipeCollectionPage({
  params,
}: Props) {
  const { collectionId } = await params;

  const { live: liveCollection, collection } = await loadCollection(collectionId);

  if (!collection) {
    notFound();
  }

  const relatedCollections = liveCollection
    ? await getRelatedRecipeCollectionsLive(
        liveCollection
      )
    : getRelatedRecipeCollections(collection);

  return (
    <div className="cookingModule bg-white py-2 text-neutral-950">
      <RecipeModuleHeader
        title="Cooking"
        subtitle={collection.title}
      />

      <RecipeCollectionPageClient
        collection={collection}
        relatedCollections={relatedCollections}
      />
    </div>
  );
}