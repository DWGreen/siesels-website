import { RecipeStatus } from "./recipeTypes";

//this is for the database queries, really we should split our types up into a couple different files 
export type RecipeRow = {
  recipe_id: number;
  recipe_root_id: number;
  recipe_name: string;
  recipe_servings: string;
  recipe_course: string;
  recipe_directions: string;
  recipe_photo: string;

  recipe_photo_removed: string;
  recipe_client: string;
  recipe_date_modified: Date | string;
  recipe_date_added: Date | string;
  recipe_status: RecipeStatus;
  recipe_import_id: number;
  recipe_server: string;
  rating_average?: number | string | null;
  rating_count?: number | string | null;
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

export type RecipeCollectionRow = {
  collection_id: number;
  collection_meta_name: string;
  collection_meta_value: string;
  collection_placement: string;
  collection_recipe_ids: string;
  collection_name: string;
  collection_headline: string;
  collection_tabline: string;
  collection_description: string;
  collection_image: string;
  collection_image_removed: string;
  collection_date_start: string;
  collection_date_end: string;
  collection_date_override: number;
  collection_tags: string;
  collection_status: string;
};
