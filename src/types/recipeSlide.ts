export type RecipeSlideLinkType =
  | "recipe"
  | "collection"
  | "filter"
  | "internal"
  | "external";

export type RecipeSlide = {
  id: string;

  title: string;
  subtitle?: string;
  description?: string;

  image: string;
  imageAlt?: string;

  eyebrow?: string;
  ctaLabel?: string;

  linkHref: string;
  linkType: RecipeSlideLinkType;

  alsoNewTitle?: string;
  alsoNewLinks?: RecipeSlideSideLink[];

  sortOrder?: number;
  status?: "active" | "inactive";
};

export type RecipeSlideSideLink = {
  id: string;
  label: string;
  href: string;
};