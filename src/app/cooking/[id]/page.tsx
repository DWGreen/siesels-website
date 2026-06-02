import { notFound } from "next/navigation";

import RecipeDetailView from "@/components/recipes/RecipeDetailView";
import { getRecipeById } from "@/lib/recipes/recipeService";
import { recipeDetailToUiRecipe } from "@/lib/recipes/recipeDetailAdapter";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: Props) {
  const { id } = await params;
  const recipeCard = await getRecipeById(id);

  if (!recipeCard) {
    notFound();
  }
  const recipe = recipeDetailToUiRecipe(recipeCard);

  return <RecipeDetailView recipe={recipe} />;
}