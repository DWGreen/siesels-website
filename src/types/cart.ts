import { Product, ProductOrder } from "./product";
import { CustomSandwich, FinalizedCustomSandwich } from "./builder";
import { Ingredient, IngredientOverrideDefinition, IngredientSelection } from "./ingredients";
import { LargeNumberLike } from "crypto";

export interface CartItem {
  id: string;

  type: "product" | "custom-sandwich";

  quantity: number;

  totalPrice: number;
  product?: ProductOrder;

  customSandwich?: FinalizedCustomSandwich;
   modifiers?: CartModifier[];
}

export interface Cart {
  items: CartItem[];

  subtotal: number;

  tax: number;

  total: number;
}


export interface CartModifier {
  definitionId: string;

  name: string;
  priceOverride?: boolean;
  selectedGroups: CartModifierOptionGroupSelection[];

  price?: number;
}
export type CategoryConfigTrigger =
  | "canMakeCombo"
  | "canMakeHalfSandwichSoup";


export interface ModifierDefinition {
    id: string;
  productId: number;
  baseProduct?: Product;
 configTrigger: CategoryConfigTrigger;
  optionCategoryId:number;
  optionGroups: ModifierOptionGroupDefinition[];
  requiresIngredientOverrideSelectionIfPresent?: boolean;


}

export interface ModifierOptionGroupDefinition {
 id: string;

  name: string;

  minSelections?: number;

  maxSelections?: number;

  required?: boolean;

  initializeAllSelected?: boolean;

  autoAddAllProducts?: boolean;

  options: ModifierOptionDefinition[];
}
export interface CartModifierOptionGroupSelection {
  groupId: string;

  groupName: string;

  selectedOptions: CartModifierOptionSelection[];
}
export interface CartModifierOptionSelection {
  id: number;

  name: string;

  price: number;
}
export interface ModifierOptionDefinition {
  id: number;

  name: string;
  description?: string;
  price?: number;

  image?: {
    id: number;
    src: string;
    alt?: string;
  };
}

export type ModifierSelectionState =
  Record<string, number[]>;

export interface ModifierDraft {
  enabled: boolean;

  definitionId: string;

  selectionsByGroup: ModifierSelectionState;
}
export interface ProductWorkflowTrigger {

  productId: number;

  workflow:
    "build-your-own-sandwich";

  route: string;
}