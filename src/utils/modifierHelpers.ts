import { ModifierDefinition, ModifierDraft} from "@/types/cart";
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

;

export type ModifierValidationResult = {
  isValid: boolean;

  errors: string[];
};

type ValidateModifierDraftsParams = {
  modifierDefinitions: ModifierDefinition[];

  modifierDrafts: Record<string, ModifierDraft>;

  requiresIngredientOverrideSelection?: boolean;

  selectedOverrideIngredientName?: string;
};

function getSelectedCount(
  draft: ModifierDraft,
  groupId: string
): number {
  return (
    draft.selectionsByGroup[
      groupId
    ] ?? []
  ).length;
}

function validateModifierGroup(
  definition: ModifierDefinition,
  draft: ModifierDraft
): string[] {
  const errors: string[] = [];

  definition.optionGroups.forEach(
    group => {
      const selectedCount =
        getSelectedCount(
          draft,
          group.id
        );

      const minSelections =
        group.minSelections ??
        (group.required ? 1 : 0);

      const maxSelections =
        group.maxSelections;

      if (
        minSelections > 0 &&
        selectedCount < minSelections
      ) {
        errors.push(
          `${definition.baseProduct?.name ?? definition.id}: please choose ${group.name}.`
        );
      }

      if (
        maxSelections !== undefined &&
        selectedCount > maxSelections
      ) {
        errors.push(
          `${definition.baseProduct?.name ?? definition.id}: choose no more than ${maxSelections} from ${group.name}.`
        );
      }
    }
  );

  return errors;
}

export function validateModifierDrafts({
  modifierDefinitions,
  modifierDrafts,
  requiresIngredientOverrideSelection = false,
  selectedOverrideIngredientName,
}: ValidateModifierDraftsParams): ModifierValidationResult {
  const errors: string[] = [];

  modifierDefinitions.forEach(
    definition => {
      const draft =
        modifierDrafts[
          definition.id
        ];

      if (!draft?.enabled) {
        return;
      }

      errors.push(
        ...validateModifierGroup(
          definition,
          draft
        )
      );

      if (
        definition.requiresIngredientOverrideSelectionIfPresent &&
        requiresIngredientOverrideSelection &&
        !selectedOverrideIngredientName
      ) {
        errors.push(
          `${definition.baseProduct?.name ?? definition.id}: please choose one ingredient option.`
        );
      }
    }
  );

  return {
    isValid:
      errors.length === 0,

    errors,
  };
}