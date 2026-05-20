import {
  HydratedRecipeCollection,
  RecipeCollection,
} from "@/types/recipeCollections";

import { mockRecipes } from "@/data/mockRecipes";

export const mockRecipeCollections: RecipeCollection[] =
  [
    {
      id: "memorial-day",
      title: "Mouth-Watering Memorial Day",
      subtitle:
        "Celebrate freedom, family, and friends with good food.",
      description:
        "It’s time to kick off summer with backyard favorites, grilled mains, fresh sides, and crowd-pleasing sauces.",
      image:
        "/images/recipes/MemorialDayJuly4thGrillingBurgeresHotDogsSausageGettyImages537386854_5450_.jpg",
      recipeSlugs: [
        "classic-barbecue-sauce",
        "filet-mignon-with-classic-steak-house-rub",
        "grilled-t-bones-with-bbq-rub",
        "grilled-sweet-peppers",
      ],
      relatedCollectionIds: [
        "family-style",
        "summer-grilling",
      ],
    },
    {
      id: "family-style",
      title:
        "A simple collection of delicious family-style recipes",
      subtitle:
        "Planning out the weekly dinner menu?",
      description:
        "Tried of the same dishes week after week? Try these tasty entrées for a scrumptious change of pace.",
      image:
        "/images/recipes/FamilyDinnerHealthyEatingOrganicLifestyleGettyImages171582881_744_.jpg",
      recipeSlugs: [
        "grilled-sweet-peppers",
        "slow-cooker-bourbon-apple-butter-meatballs",
        "lemon-rosemary-chicken-breast",
      ],
      relatedCollectionIds: ["memorial-day"],
    },
    {
      id: "summer-grilling",
      title: "Summer Grilling Favorites",
      subtitle:
        "Fire up the grill and keep dinner simple.",
      description:
        "A collection of grilled meats, vegetables, sauces, and fresh sides built for warm-weather meals.",
      image:
        "/images/recipes/family-eating.jpeg",
      recipeSlugs: [
        "classic-barbecue-sauce",
        "grilled-t-bones-with-bbq-rub",
        "grilled-sweet-peppers",
      ],
      relatedCollectionIds: ["memorial-day"],
    },
  ];

export function getRecipeCollectionById(
  collectionId: string
): HydratedRecipeCollection | undefined {
  const collection =
    mockRecipeCollections.find(
      item => item.id === collectionId
    );

  if (!collection) return undefined;

  return {
    ...collection,
    recipes: collection.recipeSlugs
      .map(slug =>
        mockRecipes.find(
          recipe => recipe.slug === slug
        )
      )
      .filter(Boolean) as HydratedRecipeCollection["recipes"],
  };
}

export function getRelatedRecipeCollections(
  collection: HydratedRecipeCollection
): RecipeCollection[] {
  if (!collection.relatedCollectionIds?.length) {
    return mockRecipeCollections
      .filter(item => item.id !== collection.id)
      .slice(0, 2);
  }

  return collection.relatedCollectionIds
    .map(id =>
      mockRecipeCollections.find(
        item => item.id === id
      )
    )
    .filter(Boolean) as RecipeCollection[];
}