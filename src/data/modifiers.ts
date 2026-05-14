
import {
  CategoryConfigTrigger,
  ModifierDefinition,
} from "@/types/cart";
import { Category, CategoryConfig } from "@/types/category";


export const modifierDefinitions: ModifierDefinition[] = [
  {
id: "combo-1",

  productId: 95,

  configTrigger: "canMakeCombo",

  optionGroups: [],
  optionCategoryId: 29,
  },  {
id: "half-soup-1",

  productId: 120,

  configTrigger: "canMakeHalfSandwichSoup",

  optionGroups: [],
  optionCategoryId: 36,
  requiresIngredientOverrideSelectionIfPresent: true,
  }

];
const modifierConfigTriggers: CategoryConfigTrigger[] = [
  "canMakeCombo",
  "canMakeHalfSandwichSoup",
];


export function getModifierDefinitionByConfigTrigger(
  trigger: CategoryConfigTrigger
): ModifierDefinition | undefined {
  return modifierDefinitions.find(
    definition =>
      definition.configTrigger === trigger
  );
}

export function getModifierDefinitionsForCategoryConfig(
  config?: CategoryConfig
): ModifierDefinition[] {
  if (!config) {
    return [];
  }

  return modifierConfigTriggers
    .filter(
      trigger =>
        config[trigger] === true
    )
    .map(trigger =>
      getModifierDefinitionByConfigTrigger(
        trigger
      )
    )
    .filter(
      (
        definition
      ): definition is ModifierDefinition =>
        Boolean(definition)
    );
}

export function getModifierDefinitionsForCategories(
  categories: Category[]
): ModifierDefinition[] {
  const definitions =
    categories.flatMap(category =>
      getModifierDefinitionsForCategoryConfig(
        category.config
      )
    );

  return Array.from(
    new Map(
      definitions.map(definition => [
        definition.id,
        definition,
      ])
    ).values()
  );
}

export function getModifierByDefinitionId(
  id: string
): ModifierDefinition | undefined {
  return modifierDefinitions.find(
    definition => definition.id === id
  );
}