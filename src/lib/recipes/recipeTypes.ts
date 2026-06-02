// src/lib/recipes/recipeTypes.ts



//we are going to standardize our types, before we had multiple different files and the types were scattered around and we even had duplicates, so we need a clean data model to represent recipes and all related entities
//we cannot have valid contracts if the data model isnt correct

export type RecipeStatus = 0 | 1 | 2 | 3 | 4 | 5;

/*
//this is the more simple recipe model, all data is just represented as strings, but we already had developed data models for multiple different properties and we just need to use them
export type Recipe = {
  id: number;
  name: string;
  course: string;
  servings: string;
  groups: Record<string, string[]>;
  directions: string[];
  image: string;
  ingredients: string[];
  intro?: string;
  note?: string;
  rating: number;
  
};
*/
//id say this should be the official recipe data model
export type Recipe = {
  id: number;
  slug: string;
  name: string;
  course: RecipeCourse;
  servings: string;
  rating: number;
  image?: string;
  intro: string;
  ingredients: RecipeIngredient[];
  directions: string[];
  meta: RecipeMeta;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
};

/*
export type RecipeIngredient = {
  id: string;
  name: string;
  quantity?: string;
  category?: string;
  detail?: string;
};*/

export type RecipeIngredient = {
  id: number;
  recipeId: number;
  ingredient: string;
  description: string;
  whole: number;
  numerator: number;
  denominator: number;
  size: string;
  department: string;
  searchTerm: string;
  displayText: string;
};


//we currently have two competing recipe meta models, one looks like its a standalone model and is what was originally meant to work with the recipe model we have decided to go with
//the other is a key value pair type, 



export type RecipeMetaOption = {
  label: string;
  value: string;
  total: number;
};

//this is for storing all of the metadata for any given recipe, really we should switch to using recipemetaproperty instead of strings, 
export type RecipeMeta = {
  cuisine?: string[];
  diet?: string[];
  mainIngredient?: string[];
  holiday?: string[];
  cookingMethod?: string[];
  category?: string[];
};
export type RecipeMetaProperty = {
  id: number;
  recipeId: number;
  name: string;
  key: string;
  value: string;
};

export type RecipeMetaMap = Record<string, RecipeMetaProperty[]>;



export type RecipeMetaCategory =
  | "Cuisine"
  | "Diet"
  | "Holiday"
  | "CookingMethod"
  | "Category"
  | "Courses"
  | "MainIngredient";



export type OptionGroup = {
  label: string;
  value: keyof Pick<
    RecipeFilters,
    | "cuisine"
    | "diet"
    | "mainIngredient"
    | "holiday"
    | "cookingMethod"
  >;
  options: string[];
};
export type RecipeMetaFilters = {
  cuisines: RecipeMetaOption[];
  diets: RecipeMetaOption[];
  holidays: RecipeMetaOption[];
  cookingMethods: RecipeMetaOption[];
  categories: RecipeMetaOption[];
  courses: RecipeMetaOption[];
  mainIngredients: RecipeMetaOption[];
};


export type RecipeDetailSection = {
  id: number;
  rootId: number;
  name: string;
  servings: string;
  course: string;
  directions: string[];
  photo: string | null;

  client: string;
  status: RecipeStatus;
  dateModified: string | Date;
  dateAdded: string | Date;
  ingredients: RecipeIngredient[];
  meta: RecipeMetaMap;
};

export type RecipeDetail = RecipeDetailSection & {
  rating: {
    average: number | null;
    count: number;
    total: number | null;
  };
  subRecipes: RecipeDetailSection[];
};

export type GetRecipesOptions = {
  client?: string;
  clients?: string[];
  allClients?: boolean;
  status?: RecipeStatus;
  sortBy?: "dateModified" | "rating";
  limit?: number;
  offset?: number;
  search?: string;
  includeBlankClient?: boolean;
  course?: string;
cuisine?: string;
diet?: string;
holiday?: string;
cookingMethod?: string;
mainIngredient?: string;
  ids?: number[];
  excludeIds?: number[];
  similarToId?: number;
};

export type GetRecipeByIdOptions = {
  client?: string;
  clients?: string[];
  includeBlankClient?: boolean;
  includeInactiveForDetail?: boolean;
};




export type RecipeCollection = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  heroRecipeSlug?: string;
  recipeSlugs?: string[];
  recipeIds?: number[];
  relatedCollectionIds?: string[];
  placement?: string;
  tags?: string[];
  status?: "Y" | "N";
  previewRecipes?: Array<{
    id: number;
    slug: string;
    name: string;
  }>;
};

export type HydratedRecipeCollection =
  Omit<RecipeCollection, "recipeSlugs" | "recipeIds"> & {
    recipes: Recipe[];
  };

  export type KnownRecipeCourse =
  | "Dinner"
  | "Breakfast"
  | "Lunch"
  | "Appetizer"
  | "Snack"
  | "Beverage"
  | "Salad"
  | "Side"
  | "Soup"
  | "Dessert"
  | "Beer"
  | "Wine";

export type RecipeCourse =
  | KnownRecipeCourse
  | (string & {});

export type RecipeMatchMode =
  | "every"
  | "any"
  | "exact";

export type RecipeRatingVote = 1 | 2 | 3 | 4 | 5;

export type RecipeRatingOption = {
  vote: RecipeRatingVote;
  label: string;
};





export type RecipeFilters = {
  searchTerm: string;
  matchMode: RecipeMatchMode;
  cuisine: string;
  diet: string;
  mainIngredient: string;
  holiday: string;
  cookingMethod: string;
  course: string;
  categoryValue: string;
};

export type AdvancedRecipeFilters = {
  searchTerm: string;
  matchMode: RecipeMatchMode;
  courses: RecipeCourse[];
  diets: string[];
  cuisines: string[];
};

