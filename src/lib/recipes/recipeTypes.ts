// src/lib/recipes/recipeTypes.ts

export type RecipeStatus = 0 | 1 | 2 | 3 | 4 | 5;

export type RecipeRow = {
  recipe_id: number;
  recipe_root_id: number;
  recipe_name: string;
  recipe_servings: string;
  recipe_course: string;
  recipe_directions: string;
  recipe_photo: string;
  recipe_photo_s3: string;
  recipe_photo_temp: string;
  recipe_photo_removed: string;
  recipe_client: string;
  recipe_date_modified: Date | string;
  recipe_date_added: Date | string;
  recipe_status: RecipeStatus;
  recipe_import_id: number;
  recipe_server: string;
};

export type RecipeIngredientRow = {
  lu_id: number;
  lu_recipe_id: number;
  lu_ingredient: string;
  lu_description: string;
  lu_whole: number;
  lu_nom: number;
  lu_den: number;
  lu_size: string;
  lu_department: string;
  lu_searchterm: string;
};

export type RecipeMetaRow = {
  meta_id: number;
  meta_recipe_id: number;
  meta_name: string;
  meta_value: string;
};

export type RecipeRatingSummaryRow = {
  rate_recipe_id: number;
  rating_count: number;
  rating_total: number | null;
  rating_average: number | null;
};

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

export type RecipeMeta = {
  id: number;
  recipeId: number;
  name: string;
  key: string;
  value: string;
};

export type RecipeMetaMap = Record<string, RecipeMeta[]>;

export type RecipeCard = {
  id: number;
  name: string;
  servings: string;
  course: string;
  photo: string | null;
  photoS3: string | null;
  client: string;
  dateModified: string | Date;
  intro: string | null;
};

export type RecipeDetailSection = {
  id: number;
  rootId: number;
  name: string;
  servings: string;
  course: string;
  directions: string[];
  photo: string | null;
  photoS3: string | null;
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
  status?: RecipeStatus;
  limit?: number;
  offset?: number;
  search?: string;
  includeBlankClient?: boolean;
};

export type GetRecipeByIdOptions = {
  client?: string;
  clients?: string[];
  includeBlankClient?: boolean;
  includeInactiveForDetail?: boolean;
};