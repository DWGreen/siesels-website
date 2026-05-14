import { Category } from "./category";
import { Ingredient, IngredientOverrideDefinition, IngredientOverrideSelectionDraft, IngredientSelection } from "./ingredients";

export interface ProductImage {
  id: number;
  src: string;
  alt?: string;
}

export interface Product {
  id: number;

  name: string;

  slug: string;

  description?: string;

  shortDescription?: string;

  price: string;

  image?: ProductImage;
  config?: ProductConfig;
  categories: Category[];
  allowBuilder?: boolean;
  ingredientOverrideDefinition?: IngredientOverrideDefinition;
  ingredients: Ingredient[];
}

export interface ProductConfig {
  priceOverride?: boolean;
}




export interface ProductOrder {
  baseProductId: number;

  name: string;

  baseProductHasIngredients:boolean;  

  ingredientSelections: IngredientSelection[];
 ingredientOverrideSelection?: IngredientOverrideSelectionDraft;
  notes?: string;
  pricing: SandwichPricing;
}