"use client";

import { useState } from "react";

import ModifierSection from "@/components/modifiers/ModifierSection";

import {
  createModifierDraft,
  modifierDraftToCartModifier,
  toggleModifierOption,
} from "@/utils/modifierDraftFactory";

import { IngredientSelection } from "@/types/ingredients";

import {
  Product,
  ProductOrder,
} from "@/types/product";

import EditableIngredientList from "./EditableIngredientList";

import {
  CartModifier,
  ModifierDefinition,
  ModifierDraft,
} from "@/types/cart";

type Props = {
  product: Product;

  productOrder: ProductOrder;

  initialQuantity?: number;
  initialModifiers?: CartModifier[];
  onCancel: () => void;

  onSave: (
    productOrder: ProductOrder,
    quantity: number,
    modifiers: CartModifier[]
  ) => void;

  isEditing?: boolean;

  modifierDefinitions: ModifierDefinition[];
};

function buildInitialModifierDrafts(
  modifierDefinitions: ModifierDefinition[],
  initialModifiers: CartModifier[]
): Record<string, ModifierDraft> {
  return Object.fromEntries(
    modifierDefinitions.map(
      definition => {
        const matchingModifier =
  initialModifiers.find(
    modifier =>
      modifier.definitionId ===
      definition.id
  );

        return [
          definition.id,
          createModifierDraftFromCartModifier(
            definition,
            matchingModifier
          ),
        ];
      }
    )
  );
}
function normalizeIngredientName(
  name: string
): string {
  return name.trim().toLowerCase();
}
function getSelectedModifierDefinitions(
  modifierDefinitions: ModifierDefinition[],
  modifierDrafts: Record<string, ModifierDraft>
): ModifierDefinition[] {
  return modifierDefinitions.filter(
    definition =>
      modifierDrafts[definition.id]?.enabled
  );
}

function shouldShowIngredientOverrideSelector(
  product: Product,
  modifierDefinitions: ModifierDefinition[],
  modifierDrafts: Record<string, ModifierDraft>
): boolean {
  const hasIngredientOverrides =
    Boolean(
      product.ingredientOverrideDefinition
        ?.ingredientOptions
        ?.length
    );

  if (!hasIngredientOverrides) {
    return false;
  }

  const selectedModifierDefinitions =
    getSelectedModifierDefinitions(
      modifierDefinitions,
      modifierDrafts
    );

  return selectedModifierDefinitions.some(
    definition =>
      definition.requiresIngredientOverrideSelectionIfPresent
  );
}
function createModifierDraftFromCartModifier(
  definition: ModifierDefinition,
  cartModifier?: CartModifier
): ModifierDraft {
  if (!cartModifier) {
    return createModifierDraft(
      definition
    );
  }

  const selectionsByGroup =
    Object.fromEntries(
      cartModifier.selectedGroups.map(
        group => [
          group.groupId,
          group.selectedOptions.map(
            option => option.id
          ),
        ]
      )
    );

  return {
    enabled: true,

    definitionId:
      definition.id,

    selectionsByGroup,
  };
}
export default function ProductCustomization({
  product,
  productOrder,
  initialQuantity = 1,
  onCancel,
  onSave,
  isEditing = false,
  modifierDefinitions,
  initialModifiers = [],
}: Props) {
  const [
    draftProductOrder,
    setDraftProductOrder,
  ] = useState<ProductOrder>(
    productOrder
  );

  const [
  modifierDrafts,
  setModifierDrafts,
] = useState<Record<string, ModifierDraft>>(
  () =>
    buildInitialModifierDrafts(
      modifierDefinitions,
      initialModifiers
    )
);
const [
  selectedOverrideIngredientName,
  setSelectedOverrideIngredientName,
] = useState<string | undefined>(
  undefined
);

function applyIngredientOverride(
  selectedIngredientName: string
) {
  const overrideIngredientNames =
    new Set(
      product.ingredientOverrideDefinition
        ?.ingredientOptions
        ?.map(ingredient =>
          normalizeIngredientName(
            ingredient.name
          )
        ) ?? []
    );

  const selectedNormalized =
    normalizeIngredientName(
      selectedIngredientName
    );

  setDraftProductOrder(prev => ({
    ...prev,

    ingredientSelections:
      prev.ingredientSelections.map(
        ingredient => {
          const ingredientName =
            normalizeIngredientName(
              ingredient.name
            );

          const isOverrideIngredient =
            overrideIngredientNames.has(
              ingredientName
            );

          if (!isOverrideIngredient) {
            return ingredient;
          }

          return {
            ...ingredient,

            included:
              ingredientName ===
              selectedNormalized,
              disabled: ingredientName !==
              selectedNormalized
          };
        }
      ),
  }));
}

function handleSelectOverrideIngredient(
  ingredientName: string
) {
  setSelectedOverrideIngredientName(
    ingredientName
  );

  applyIngredientOverride(
    ingredientName
  );
}
  const [
    quantity,
    setQuantity,
  ] = useState<number>(
    initialQuantity
  );

function updateIngredient(
  updatedIngredient: IngredientSelection
) {
  setDraftProductOrder(prev => ({
    ...prev,

    ingredientSelections:
      prev.ingredientSelections.map(
        ingredient =>
          ingredient.name ===
          updatedIngredient.name
            ? updatedIngredient
            : ingredient
      ),
  }));
}
  function handleQuantityChange(
    value: number
  ) {
    setQuantity(
      Math.max(
        1,
        value || 1
      )
    );
  }

  function handleModifierDraftChange(
    definitionId: string,
    nextDraft: ModifierDraft
  ) {
    setModifierDrafts(prev => ({
      ...prev,

      [definitionId]: nextDraft,
    }));
  }

  function handleToggleModifierOption(
    definition: ModifierDefinition,
    groupId: string,
    optionId: number
  ) {
    setModifierDrafts(prev => {
      const currentDraft =
        prev[definition.id];

      if (!currentDraft) {
        return prev;
      }

      return {
        ...prev,

        [definition.id]:
          toggleModifierOption(
            currentDraft,
            groupId,
            optionId,
            definition
          ),
      };
    });
  }

  function buildCartModifiers(): CartModifier[] {
    return modifierDefinitions
      .map(definition => {
        const draft =
          modifierDrafts[
            definition.id
          ];

        if (!draft) {
          return undefined;
        }

        return modifierDraftToCartModifier(
          definition,
          draft
        );
      })
      .filter(
        (
          modifier
        ): modifier is CartModifier =>
          Boolean(modifier)
      );
  }

 function handleSave() {
  const showIngredientOverrideSelector =
    shouldShowIngredientOverrideSelector(
      product,
      modifierDefinitions,
      modifierDrafts
    );

  if (
    showIngredientOverrideSelector &&
    !selectedOverrideIngredientName
  ) {
    alert(
      "Please choose one ingredient option."
    );

    return;
  }

  const modifiers =
    buildCartModifiers();

  console.log(
    "Saving with modifiers:",
    modifiers
  );

  onSave(
    draftProductOrder,
    quantity,
    modifiers
  );
}
const showIngredientOverrideSelector =
  shouldShowIngredientOverrideSelector(
    product,
    modifierDefinitions,
    modifierDrafts
  );

const ingredientOverrideOptions =
  product.ingredientOverrideDefinition
    ?.ingredientOptions ?? [];
  return (
    <div
      className="
        max-w-2xl
        mx-auto
        px-4
        py-10
        space-y-8
      "
    >
      <div className="space-y-3">
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          {draftProductOrder.name}
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          {product.shortDescription}
        </p>
      </div>

      {product.image && (
        <img
          src={product.image.src}
          alt={product.name}
          className="
            w-full
            h-64
            object-cover
            rounded-2xl
          "
        />
      )}

      <section className="space-y-4">
        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Ingredients
        </h2>

        <EditableIngredientList
          ingredientSelection={
            draftProductOrder
              .ingredientSelections
          }
          onChangeIngredient={
            updateIngredient
          }
        />
      </section>

      <section className="space-y-3">
        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Quantity
        </h2>

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) =>
            handleQuantityChange(
              Number(e.target.value)
            )
          }
          className="
            border
            rounded-xl
            px-4
            py-3
            w-24
          "
        />
      </section>

      {modifierDefinitions.length > 0 && (
        <section className="space-y-4">
          {modifierDefinitions.map(
            definition => {
              const draft =
                modifierDrafts[
                  definition.id
                ];

              if (!draft) {
                return null;
              }

              return (
                <ModifierSection
                  key={definition.id}
                  definition={definition}
                  draft={draft}
                  onDraftChange={
                    nextDraft =>
                      handleModifierDraftChange(
                        definition.id,
                        nextDraft
                      )
                  }
                  onToggleOption={(
                    groupId,
                    optionId
                  ) =>
                    handleToggleModifierOption(
                      definition,
                      groupId,
                      optionId
                    )
                  }
                />
              );
            }
          )}
        </section>
      )}
{showIngredientOverrideSelector &&
  ingredientOverrideOptions.length > 0 && (
    <section className="space-y-4">
      <h2
        className="
          text-xl
          font-semibold
        "
      >
        Choose One
      </h2>

      <div className="space-y-3">
        {ingredientOverrideOptions.map(
          ingredient => {
            const isSelected =
              selectedOverrideIngredientName ===
              ingredient.name;

            return (
              <button
                key={ingredient.name}
                type="button"
                onClick={() =>
                  handleSelectOverrideIngredient(
                    ingredient.name
                  )
                }
                className={`
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  font-medium
                  ${
                    isSelected
                      ? "bg-black text-white"
                      : "bg-white"
                  }
                `}
              >
                {ingredient.name}
              </button>
            );
          }
        )}
      </div>
    </section>
  )}
      <div
        className="
          flex
          gap-4
          pt-4
        "
      >
        <button
          onClick={onCancel}
          className="
            flex-1
            border
            rounded-xl
            py-4
            font-semibold
          "
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="
            flex-1
            bg-black
            text-white
            rounded-xl
            py-4
            font-semibold
          "
        >
          {isEditing
            ? "Update Cart"
            : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}