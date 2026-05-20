"use client";

import RecipeBoxSidebar from "./RecipeBoxSidebar";
import RecipeCollectionFeature from "./RecipeCollectionFeature";
import RecipeCollectionRail from "./RecipeCollectionRail";

import { useRecipeBox } from "@/hooks/useRecipeBox";
import { mockRecipes } from "@/data/mockRecipes";

import {
  HydratedRecipeCollection,
  RecipeCollection,
} from "@/types/recipeCollections";
import { formatWeekKey } from "@/lib/recipes/dateWeeks";


type Props = {
  collection: HydratedRecipeCollection;
  relatedCollections: RecipeCollection[];
};

export default function RecipeCollectionPageClient({
  collection,
  relatedCollections,
}: Props) {
  const recipeBox = useRecipeBox();
 const weekKey = formatWeekKey();
  return (
    <div
      className="
        mx-auto
        grid
        max-w-6xl
        gap-4
        px-4
        py-4
        lg:grid-cols-[280px_1fr_260px]
      "
    >
      <RecipeBoxSidebar
        recipes={mockRecipes}
        state={recipeBox.state}
        onRemoveSavedRecipe={
          recipeBox.removeSavedRecipe
        }
        onAddCustomShoppingItem={
          recipeBox.addCustomShoppingItem
        }
        onRemoveShoppingItem={
          recipeBox.removeShoppingItem
        }
        onRemoveRecipeFromMenu={
    recipeBox.removeRecipeFromMenu
  }
  weekKey={weekKey}
      />

      <main>
        <RecipeCollectionFeature
          collection={collection}
           onAddToMenu={recipeBox.addRecipeToMenu}
              weekKey={weekKey}
        />
      </main>

      <RecipeCollectionRail
        collections={relatedCollections}
      />
    </div>
  );
}