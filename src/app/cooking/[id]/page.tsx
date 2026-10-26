import { cache } from "react";
import { notFound } from "next/navigation";

import RecipeDetailView from "@/components/recipes/RecipeDetailView";
import { getRecipeById } from "@/lib/recipes/recipeService";
import { recipeDetailToUiRecipe } from "@/lib/recipes/recipeDetailAdapter";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const loadRecipe = cache(getRecipeById);

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const recipe = await loadRecipe(id);
  return { title: `${recipe?.name ?? "Recipe Not Found"} | Iowa Meat Farms & Siesel’s Meats` };
}

export default async function RecipeDetailPage({
  params,
}: Props) {
  const { id } = await params;
  const recipeCard = await loadRecipe(id);

  if (!recipeCard) {
    notFound();
  }
  const recipe = recipeDetailToUiRecipe(recipeCard);

  return <RecipeDetailView recipe={recipe} />;
}