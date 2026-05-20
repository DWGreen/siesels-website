import { RecipeSlide } from "@/types/recipeSlide";

export const mockRecipeSlides: RecipeSlide[] = [
  {
    id: "family-style-recipes",
    title:
      "A simple collection of delicious family-style recipes",
    subtitle:
      "Planning out the weekly dinner menu?",
    description:
      "Tired of the same dishes week after week? Try these tasty entrées for a scrumptious change of pace.",
    eyebrow: "Featured Collection",
    image:
      "/images/recipes/FamilyDinnerHealthyEatingOrganicLifestyleGettyImages171582881_744_.jpg",
    imageAlt:
      "Family preparing a meal together in a kitchen",
    ctaLabel: "View Collection",
    linkHref:
      "/recipes/collections/family-style",
    linkType: "collection",
    alsoNewTitle: "Also New This Week",
    alsoNewLinks: [
      {
        id: "cherry-chia",
        label:
          "Cherry Chia Seed Jam Overnight Oats",
        href:
          "/recipes/cherry-chia-seed-jam-overnight-oats",
      },
      {
        id: "lemon-basil",
        label: "Lemon Basil Chicken Salad",
        href: "/recipes/lemon-basil-chicken-salad",
      },
      {
        id: "lemon-rosemary",
        label: "Lemon-Rosemary Chicken Breast",
        href:
          "/recipes/lemon-rosemary-chicken-breast",
      },
      {
        id: "pesto-eggs",
        label:
          "Pesto Eggs and Potatoes Skillet",
        href:
          "/recipes/pesto-eggs-and-potatoes-skillet",
      },
      {
        id: "bourbon-meatballs",
        label:
          "Slow Cooker Bourbon Apple Butter Meatballs",
        href:
          "/recipes/slow-cooker-bourbon-apple-butter-meatballs",
      },
    ],
    sortOrder: 1,
    status: "active",
  },
  {
    id: "memorial-day",
    title: "Mouth-Watering Memorial Day",
    subtitle:
      "Celebrate freedom, family, and friends with good food.",
    description:
      "It’s time to kick off summer with backyard favorites, grilled mains, fresh sides, and crowd-pleasing sauces.",
    eyebrow: "Seasonal Feature",
    image:
      "/images/recipes/MemorialDayJuly4thGrillingBurgeresHotDogsSausageGettyImages537386854_5450_.jpg",
    imageAlt:
      "Summer cookout table with burgers and drinks",
    ctaLabel: "View Recipes",
    linkHref:
      "/recipes/collections/memorial-day",
    linkType: "collection",
    alsoNewTitle: "Featured Recipes",
    alsoNewLinks: [
      {
        id: "classic-barbecue-sauce",
        label: "Classic Barbecue Sauce",
        href: "/recipes/classic-barbecue-sauce",
      },
      {
        id: "filet-steak-rub",
        label:
          "Filet Mignon with Classic Steak House Rub",
        href:
          "/recipes/filet-mignon-with-classic-steak-house-rub",
      },
      {
        id: "grilled-t-bones",
        label: "Grilled T-Bones with BBQ Rub",
        href:
          "/recipes/grilled-t-bones-with-bbq-rub",
      },
    ],
    sortOrder: 2,
    status: "active",
  },
  {
    id: "healthy-weeknight",
    title: "Healthy weeknight recipes made simple",
    subtitle:
      "Fresh meals without overcomplicating dinner.",
    description:
      "Browse lighter meals, quick proteins, and vegetable-forward recipes for busy nights.",
    eyebrow: "Healthy Choices",
    image:
      "/images/recipes/family-eating.jpeg",
    imageAlt:
      "Fresh healthy dinner plate with vegetables",
    ctaLabel: "Browse Healthy Recipes",
    linkHref:
      "/recipes?filter=diet&value=Healthy",
    linkType: "filter",
    alsoNewTitle: "Healthy Picks",
    alsoNewLinks: [
      {
        id: "spicy-whitefish",
        label: "Spicy Whitefish",
        href: "/recipes/spicy-whitefish",
      },
      {
        id: "veggie-breakfast-frittata",
        label: "Veggie Breakfast Frittata",
        href:
          "/recipes/veggie-breakfast-frittata",
      },
      {
        id: "easy-black-bean-soup",
        label: "Easy Black Bean Soup",
        href: "/recipes/easy-black-bean-soup",
      },
    ],
    sortOrder: 3,
    status: "active",
  },
];

export function getActiveRecipeSlides() {
  return mockRecipeSlides
    .filter(slide => slide.status !== "inactive")
    .sort(
      (a, b) =>
        (a.sortOrder ?? 999) -
        (b.sortOrder ?? 999)
    );
}