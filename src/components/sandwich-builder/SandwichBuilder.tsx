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
import { calculateCartItemPrice } from "@/utils/cartPricing";
import { validateModifierDrafts } from "@/utils/modifierHelpers";

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
  quantity: number = 1

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
      modifiers,
      quantity
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

  const selectionsByGroup: Record<string, number[]> =
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
    function buildInitialQuantity(
  editingItem?: CartItem
): number {
  return editingItem?.quantity ?? 1;
}
  const initialQuantity =
    useMemo(
      () =>
        buildInitialQuantity(
          editingItem
        ),
      [
        editingItem,
      ]
    );
     const [
    quantity,
    setQuantity,
  ] = useState<number>(
    initialQuantity
  );
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
  const liveModifiers =
  useMemo(
    () =>
      buildCartModifiers(),
    [
      modifierDrafts,
      modifierDefinitions,
    ]
  );

const sandwichPricing =
  useMemo(
    () =>
      calculateSandwichPrice(
        sandwich,
        steps,
        product
      ),
    [
      sandwich,
      steps,
      product,
    ]
  );

const livePrice =
  useMemo(
    () =>
      calculateCartItemPrice(
        sandwichPricing.basePrice,
        sandwichPricing.additionalPrice,
        quantity,
        liveModifiers
      ),
    [
      sandwichPricing.basePrice,
      sandwichPricing.additionalPrice,
      quantity,
      liveModifiers,
    ]
  );
  const modifierValidation =
    validateModifierDrafts({
      modifierDefinitions,
  
      modifierDrafts,
  
     

    });
    const canSave =
    modifierValidation.isValid;
    console.log(
      "Modifier validation result:",
      modifierValidation
    );
  function handleSave() {
    const validation =
    validateModifierDrafts({
      modifierDefinitions,

      modifierDrafts,

    
    });

  if (!validation.isValid) {
    alert(
      validation.errors.join("\n")
    );

    return;
  }
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
    product,
    quantity
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
  ) && canSave;

  
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
  <div
    className="
      bg-[#e6e6e6]
      text-neutral-950
    "
  >
    <div
      className="
        mx-auto
        max-w-6xl
        px-6
        py-14
      "
    >
      <header
        className="
          mb-12
          text-center
        "
      >
        <div
          className="
            mb-5
            flex
            items-center
            justify-center
            gap-5
          "
        >
          <span className="h-px w-28 bg-neutral-700" />

          <span
            className="
              text-lg
              font-black
              uppercase
              tracking-[0.45em]
            "
          >
            Order Online
          </span>

          <span className="h-px w-28 bg-neutral-700" />
        </div>

        <h1
          className="
            text-5xl
            font-black
            uppercase
            tracking-[0.35em]
            md:text-7xl
          "
        >
          Sandwiches
        </h1>

        <p
          className="
            mt-5
            text-sm
            font-black
            uppercase
            tracking-[0.28em]
          "
        >
          Available 7:00 AM - 6:30 PM Daily
        </p>
      </header>

      <section
        className="
          mb-10
          grid
          grid-cols-1
          gap-10
          md:grid-cols-[1.05fr_0.95fr]
          md:items-start
        "
      >
        <div
  className="
    border-2
    border-neutral-900
    bg-[#e6e6e6]
    p-3
  "
>
  <div
    className="
      flex
      h-[280px]
      w-full
      items-center
      justify-center
      bg-white
    "
  >
    {product?.image?.src ? (
      <img
        src={product.image.src}
        alt={product.image.alt || product.name}
        className="
          max-h-full
          max-w-full
          object-contain
        "
      />
    ) : (
      <span
        className="
          text-sm
          font-black
          uppercase
          tracking-[0.25em]
          text-neutral-500
        "
      >
        No Image
      </span>
    )}
  </div>
</div>

        <div
          className="
            pt-2
          "
        >
          <h2
            className="
              text-4xl
              font-black
              uppercase
              tracking-[0.18em]
              leading-tight
            "
          >
            {sandwich.name}
          </h2>

          {product?.price !== null &&
            product?.price !== undefined &&
            product?.price !== "" && (
              <div
                className="
                  mt-1
                  text-3xl
                  font-black
                  tracking-[0.18em]
                "
              >
                ${Number(product.price).toFixed(2)}
              </div>
            )}

          <p
            className="
              mt-7
              max-w-md
              text-xs
              italic
              leading-relaxed
              text-neutral-700
            "
          >
            Sandwiches may contain wheat, milk, egg or soy.
            Customize your selections below.
          </p>

          <div
            className="
              mt-8
              max-w-xs
            "
          >
            <label
              className="
                mb-2
                block
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
              "
            >
              Quantity
            </label>

            <select
              value={quantity}
              onChange={(event) =>
                handleQuantityChange(Number(event.target.value))
              }
              className="
                w-full
                border-0
                bg-white
                px-4
                py-2
                text-sm
                outline-none
              "
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(quantity => (
                <option
                  key={quantity}
                  value={quantity}
                >
                  {quantity}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div
        className="
          grid
          grid-cols-1
          gap-10
          lg:grid-cols-3
        "
      >
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
          <section
            className="
              border-t
              border-black/70
              pt-6
              lg:col-span-3
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-10
                lg:grid-cols-3
              "
            >
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
            </div>
          </section>
        )}
      </div>

      <div
        className="
          mt-12
          flex
          flex-col
          gap-4
          bg-neutral-950
          p-5
          text-white
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div
          className="
            text-2xl
            font-black
            uppercase
            tracking-[0.28em]
          "
        >
          Subtotal:
          <span className="ml-4">
            {`$${livePrice.totalPrice.toFixed(2)}`}
          </span>
        </div>

        <div
          className="
            flex
            gap-3
          "
        >
          <button
            type="button"
            onClick={() =>
              handleCancel(
                router,
                returnTo
              )
            }
            className="
              border
              border-white/60
              px-6
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-white
              transition
              hover:bg-white
              hover:text-neutral-950
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!builderComplete}
            className={`
              border
              border-white
              px-8
              py-3
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-white
              transition
              hover:bg-white
              hover:text-neutral-950
              disabled:cursor-not-allowed
              disabled:opacity-40
              ${
      canSave
        ? "hover:bg-white hover:text-neutral-950"
        : "cursor-not-allowed opacity-40"
    }
  `}
          >
            {editingItem ? "Update Sandwich" : "Add To Cart >"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}