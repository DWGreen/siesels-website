import { ModifierDefinition } from "@/types/cart";
import { Ingredient, IngredientOverrideSelectionDraft } from "@/types/ingredients";
import { Product } from "@/types/product";

function shouldActivateIngredientOverride(
  product: Product,
  selectedModifierDefinitions: ModifierDefinition[]
): boolean {
  const productHasOverrides =
    !!product.ingredientOverrideDefinition?.ingredientOptions.length;

  const selectedModifierRequestsOverrides =
    selectedModifierDefinitions.some(
      definition => definition.requiresIngredientOverrideSelectionIfPresent
    );

  return productHasOverrides && selectedModifierRequestsOverrides;
}

function getEffectiveIngredients(
  product: Product,
  ingredientOverrideSelection?: IngredientOverrideSelectionDraft
): Ingredient[] {
  const overrideDefinition =
    product.ingredientOverrideDefinition;

  if (!overrideDefinition || !ingredientOverrideSelection) {
    return product.ingredients;
  }

  const overrideNames = new Set(
    overrideDefinition.ingredientOptions.map(
      ingredient => normalizeIngredientName(ingredient.name)
    )
  );

  const selectedName = normalizeIngredientName(
    ingredientOverrideSelection.selectedIngredient.name
  );

  return product.ingredients.filter(ingredient => {
    const ingredientName = normalizeIngredientName(ingredient.name);

    const isOverrideIngredient =
      overrideNames.has(ingredientName);

    if (!isOverrideIngredient) {
      return true;
    }

    return ingredientName === selectedName;
  });
}

function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase();
}