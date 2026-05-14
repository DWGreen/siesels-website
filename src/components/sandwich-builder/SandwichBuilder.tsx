"use client";

import { useMemo, useState }
  from "react";
import {
  useCart
} from "@/context/CartContext";
import { finalizeCustomSandwich } from "@/utils/sandwichFactory";

import { BuilderStep }
  from "@/types/builder";
import { CustomSandwich }
  from "@/types/builder";
import BuilderOptionGrid
  from "./BuilderOptionGrid";
import BuilderStepSection from "./BuilderStepSection";
import { customSandwichToCartItem } from "@/utils/cartItemFactory";
import {
  useRouter
} from "next/navigation";
import { Product } from "@/types/product";
import { CartItem, CartModifier, ModifierDefinition, ModifierDraft } from "@/types/cart";
import { calculateSandwichPrice } from "@/pricing/priceCalculations";
import ModifierSection from "../modifiers/ModifierSection";
import { createModifierDraft, toggleModifierOption, modifierDraftToCartModifier} from "@/utils/modifierDraftFactory";
import { modifierDefinitions } from "@/data/modifiers";

type Props = {
  steps: BuilderStep[];
  product: Product | null;
  editCartItemId?: string;
  returnTo: string;
  modifierDefinitions: ModifierDefinition[];
};

function isStepComplete(
  step: BuilderStep,
  selections: CustomSandwich["selections"]
) {

  const selected =
    selections[step.category.id] || [];

  if (
    step.category.config
      .selectionRequired
  ) {
    return selected.length > 0;
  }

  return true;
}


function handleAddToCart(
  sandwich: CustomSandwich,
  steps: BuilderStep[],
  router: ReturnType<typeof useRouter>,
  addItem: ReturnType<typeof useCart>["addItem"],
  updateItem: ReturnType<typeof useCart>["updateItem"],
    returnTo: string,
    modifiers: CartModifier[],
  editingItem?: CartItem,
  product: Product | null = null,
  

) {

    console.log(
    "handleAddToCart modifiers:",
    modifiers
  );
    const pricing =
  calculateSandwichPrice(
    sandwich,
    steps,
    product
  );
  const finalized =
finalizeCustomSandwich(
    sandwich,
    steps,
    pricing
  );
  console.log("Finalized sandwich:", finalized);
  const cartItem =
    customSandwichToCartItem(
      finalized,
      modifiers
    );
if (editingItem) {
  updateItem(
    editingItem.id,
    {
      ...cartItem,
      id: editingItem.id,
    }
  );
} else {
  addItem(
    cartItem
  );
}
    router.push(returnTo);
  
}
function handleCancel(router: ReturnType<typeof useRouter>, returnTo: string) {
  router.push(returnTo);
}

function hydrateSelectionsFromCartItem(
  editingItem?: CartItem
): CustomSandwich["selections"] {

  if (
    !editingItem?.customSandwich
  ) {
    return {};
  }

  return (
    editingItem.customSandwich
      .selections || {}
  );
}
function buildInitialModifiers(
  editingItem?: CartItem
): CartModifier[] {
  return editingItem?.modifiers ?? [];
}
function buildInitialSandwichState(
  steps: BuilderStep[],
  product: Product | null,
  editingItem?: CartItem
): CustomSandwich {

  const isEditing =
    !!editingItem?.customSandwich;

  return {

    name:
      editingItem?.customSandwich
        ?.name
      ||
      product?.name
      ||
      "Build Your Own",

    selections:
      isEditing
        ? hydrateSelectionsFromCartItem(
            editingItem
          )
        : buildInitialSelections(
            steps
          ),

    quantity:
      editingItem?.quantity || 1,

    
    baseProductId:
      editingItem?.customSandwich?.baseProductId || product?.id || 0,
  };
}
function buildInitialSelections(
  steps: BuilderStep[]
): CustomSandwich["selections"] {


  const selections:
    CustomSandwich["selections"] = {};

  steps.forEach((step) => {

    if (
      step.category.config
        .initializeAllSelected
    ) {

      selections[step.category.id] =
        step.products.map(
          product => product.id
        );
    }
  });

  return selections;
}

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


export default function SandwichBuilder({
  steps,
  product,
  editCartItemId,
  returnTo,
  modifierDefinitions,
}: Props) {
const { addItem, updateItem } =

    useCart();
      const router = useRouter();
  const { cart } = useCart();
      const editingItem =
  cart.items.find(
    item =>
      item.id === editCartItemId
  );
  const [sandwich, setSandwich] =
    useState<CustomSandwich>(
      buildInitialSandwichState(
        steps,
        product,
        editingItem
      )
    );  
  const initialModifiers =
    useMemo(
      () =>
        buildInitialModifiers(
          editingItem
        ),
      [
        editingItem,
      ]
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
  const modifiers =
    buildCartModifiers();

  console.log(
    "Sandwich builder modifiers to save:",
    modifiers
  );

  handleAddToCart(
    sandwich,
    steps,
    router,
    addItem,
    updateItem,
    returnTo,
    modifiers,
    editingItem,
    product
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
const builderComplete =
  steps.every(step =>
    isStepComplete(step, sandwich.selections)
  );

  
  function toggleProduct(
    step: BuilderStep,
    productId: number
  ) {

    setSandwich(prev => {

      const current =
        prev.selections[step.category.id] || [];

      const exists =
        current.includes(productId);
const maxSelections =
  Number(
    step.category.config.maxSelections
  ) || Infinity;
  console.log("maximum selections for category", step.category.name, "is", step.category.config.maxSelections);
      return {

        ...prev,

        selections: {
          ...prev.selections,
          [step.category.id]:
            exists
              ? current.filter(
                  id => id !== productId
                )
               : maxSelections === 1
            ? [productId]
            : current.length < maxSelections
            ? [
                ...current,
                productId,
              ]
           
            : current,
            }
        };
    });
    
  }

  return (
    <div className="space-y-12">

      {steps.map((step) => (

        <BuilderStepSection 
          key={step.category.id}
          step={step}
          selected={sandwich.selections[step.category.id] || []}
          onToggle={(productId) =>
            toggleProduct(step, productId)
          }
        />

      ))}

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
<div className="flex gap-4">

  <button onClick={() => handleCancel(router, returnTo)} className="flex-1 border rounded-xl py-4 font-semibold">
    Cancel
  </button>

  <button onClick={handleSave} disabled={!builderComplete}>
    {editingItem ? "Update Sandwich" : "Add To Cart"}
  </button>

</div>
    </div>
  );
}