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

export default async function RecipeCollectionPage({
  params,
}: Props) {
  const { collectionId } = await params;

  const liveCollection =
    await getRecipeCollectionByIdOrSlugLive(
      collectionId
    );

  const collection =
    liveCollection ??
    getRecipeCollectionById(collectionId);

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