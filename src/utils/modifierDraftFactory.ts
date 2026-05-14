import {
  CartModifier,
  ModifierDefinition,
  ModifierDraft,
  ModifierSelectionState,
} from "@/types/cart";

export function createModifierDraft(
  definition: ModifierDefinition
): ModifierDraft {
  const selectionsByGroup =
    definition.optionGroups.reduce<
      ModifierSelectionState
    >((acc, group) => {
      const shouldAutoSelect =
        group.autoAddAllProducts ||
        group.initializeAllSelected;

      acc[group.id] =
        shouldAutoSelect
          ? group.options.map(
              option => option.id
            )
          : [];

      return acc;
    }, {});

  return {
    enabled: false,

    definitionId: definition.id,

    selectionsByGroup,
  };
}

export function toggleModifierOption(
  draft: ModifierDraft,
  groupId: string,
  optionId: number,
  definition: ModifierDefinition
): ModifierDraft {
  const group =
    definition.optionGroups.find(
      item => item.id === groupId
    );

  if (!group) {
    return draft;
  }

  if (group.autoAddAllProducts) {
    return draft;
  }

  const currentSelections =
    draft.selectionsByGroup[groupId] ?? [];

  const isSelected =
    currentSelections.includes(optionId);

  let nextSelections: number[];

  if (isSelected) {
    nextSelections =
      currentSelections.filter(
        id => id !== optionId
      );
  } else if (group.maxSelections === 1) {
    nextSelections = [optionId];
  } else {
    const max =
      group.maxSelections ?? Infinity;

    nextSelections = [
      ...currentSelections,
      optionId,
    ].slice(0, max);
  }

  return {
    ...draft,

    selectionsByGroup: {
      ...draft.selectionsByGroup,

      [groupId]: nextSelections,
    },
  };
}

export function modifierDraftToCartModifier(
  definition: ModifierDefinition,
  draft: ModifierDraft
): CartModifier | undefined {
  if (!draft.enabled) {
    return undefined;
  }

  const selectedGroups =
    definition.optionGroups.map(group => {
      const selectedIds =
        draft.selectionsByGroup[group.id] ?? [];

      const selectedOptions =
        group.options
          .filter(option =>
            selectedIds.includes(option.id)
          )
          .map(option => ({
            id: option.id,

            name: option.name,

            price: option.price ?? 0,
          }));

      return {
        groupId: group.id,

        groupName: group.name,

        selectedOptions,
      };
    });

  const selectedOptionsTotal =
    selectedGroups.reduce(
      (groupTotal, group) =>
        groupTotal +
        group.selectedOptions.reduce(
          (optionTotal, option) =>
            optionTotal + option.price,
          0
        ),
      0
    );

  return {
    definitionId: definition.id,

    name:
      definition.baseProduct?.name ??
      definition.id,

    selectedGroups,
    priceOverride:
      definition.baseProduct
        ?.config
        ?.priceOverride ?? false,
    price:
      Number(
        definition.baseProduct?.price ?? 0
      ) + selectedOptionsTotal,
  };
}