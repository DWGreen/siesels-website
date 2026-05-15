
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export type MenuSection = {
  category: Category;
  products: Product[];
};

export type MenuStructure = {
  rootCategory: Category;
  sections: MenuSection[];
};