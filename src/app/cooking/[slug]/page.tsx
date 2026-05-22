import { notFound } from "next/navigation";

import RecipeDetailView from "@/components/recipes/RecipeDetailView";
import { getRecipeBySlug } from "@/lib/recipes/recipeLookup";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: Props) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailView recipe={recipe} />;
}