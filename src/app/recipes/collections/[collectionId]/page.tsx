import { notFound } from "next/navigation";

import RecipeModuleHeader from "@/components/recipes/RecipeModuleHeader";
import RecipeCollectionPageClient from "@/components/recipes/RecipeCollectionPageClient";

import {
  getRecipeCollectionById,
  getRelatedRecipeCollections,
} from "@/data/mockRecipeCollections";

type Props = {
  params: Promise<{
    collectionId: string;
  }>;
};

export default async function RecipeCollectionPage({
  params,
}: Props) {
  const { collectionId } = await params;

  const collection =
    getRecipeCollectionById(collectionId);

  if (!collection) {
    notFound();
  }

  const relatedCollections =
    getRelatedRecipeCollections(collection);

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