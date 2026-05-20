import { Recipe } from "@/types/recipes";

import RecipeFeaturedSlideshow from "./RecipeFeaturedSlideshow";
import FavoriteRecipesList from "./FavoriteRecipesList";
import { getActiveRecipeSlides } from "@/data/mockRecipeSlides";
type Props = {
  recipes: Recipe[];
};

export default function RecipeHomePanel({
  recipes,
}: Props) {
    const slides = getActiveRecipeSlides();
  return (
    <div className="p-4">
      <RecipeFeaturedSlideshow slides={slides} />

      <FavoriteRecipesList recipes={recipes} />
    </div>
  );
}