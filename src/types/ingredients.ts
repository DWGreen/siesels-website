//ingredient represents what ingredient exists in the database, not what is selected for an order. Ingredient should only
//be used to show what ingredients are available for a product. IngredientSelection represents what is selected for an order, and should be used to show what ingredients are included/excluded/extra for a specific order item.

export interface Ingredient {
  
  name: string;
  price? : number;
  included?: boolean;
    extra?: boolean;
}

export interface IngredientSelection {
  name: string;

  included: boolean;
    price?: number;
  extra: boolean;
  disabled?: boolean;
}

export interface IngredientOverrideDefinition {
  id: string;
    ingredientOptions: Ingredient[];
}

export interface IngredientOverrideSelectionDraft
{  definitionId: string;
  selectedIngredient: Ingredient;
}

