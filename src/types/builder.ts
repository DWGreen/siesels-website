import { Product } from "./product";
import { Category } from "./category";

export interface BuilderStep {
  category: Category;

  products: Product[];
}

type BuilderSelections = {
  [categoryId: number]: number[];
};



export interface CustomSandwich {
  name: string;

  selections: BuilderSelections;


    baseProductId: number;

}

export interface FinalizedIngredient {
  id: number;
  price? : number;
  name: string;
}

export interface FinalizedCustomSandwich {

  name: string;
  selections: BuilderSelections;
  ingredients:
    FinalizedIngredient[];
  baseProductId: number;


  pricing: SandwichPricing;
}