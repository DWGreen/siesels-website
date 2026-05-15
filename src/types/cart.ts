import { Product, ProductOrder } from "./product";
import { CustomSandwich, FinalizedCustomSandwich } from "./builder";
import { Ingredient, IngredientOverrideDefinition, IngredientOverrideSelectionDraft, IngredientSelection } from "./ingredients";
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
    id: string;
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

  productId: string;

  workflow:
    "build-your-own-sandwich";

  route: string;
}

export interface CheckoutValidationRequest {
  items: CheckoutItemRequest[];
}
//we are using one single shape for all products. We keep track of the cart id, we keep track of the base product id that the cartitem is based on, whether its a custom sandwich or not, it still has a base product and
// a base price based on that base product, and then everything else flows out of that and this is ultimately very flexible.
export interface CheckoutItemRequest {
cartItemId: string;
 type: "product" | "custom-sandwich";
productId: number;
quantity: number;
ingredients: ProductIngredientRequest[];
modifiers: ProductModifierRequest[];

}
//this is the request shape for things like making a product into a combo, we dont actually list all the options that were selected in relation to the combo or half sandwich/soup, we just need to know that
//"this product has been made into a combo and here is the additional charge for that combo" or "this product has been made into a half sandwich/soup and here is the additional charge for that"
export interface ProductModifierRequest {
modifierDefinitionId: string;
modifierProductId: number;



}
//this is largely for the build your own sandwich component, since there are extras that can be added to those sandwiches that modify the price, such as "gluten free bread 2.00"
//for these we need to know the name of the extra, the price, and the base product it is being added to, so that we can calculate the total price of the sandwich correctly at checkout
export interface ProductIngredientRequest {
  productId: number;
}export interface CheckoutValidationResponse {
  isValid: boolean;
  items: ValidatedCheckoutItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxRate: number;
  errors: CheckoutValidationError[];
}

export interface ValidatedCheckoutItem {
  cartItemId: string;
  type: "product" | "custom-sandwich";
  productId: number;
  name: string;
  quantity: number;

  basePriceCents: number;
  effectiveBasePriceCents: number;
  ingredientTotalCents: number;
  modifierTotalCents: number;
  unitPriceCents: number;
  totalPriceCents: number;

  ingredients: ValidatedProductIngredient[];
  modifiers: ValidatedProductModifier[];
}

export interface ValidatedProductIngredient {
  productId: number;
  name: string;
  priceCents: number;
}

export interface ValidatedProductModifier {
  modifierDefinitionId: string;
  modifierProductId: number;
  name: string;
  priceCents: number;
  overrideBasePrice: boolean;
}

export interface CheckoutValidationError {
  cartItemId?: string;
  message: string;
}
