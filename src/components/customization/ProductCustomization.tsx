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
function getInitialOverrideIngredientName(
  product: Product,
  productOrder: ProductOrder
): string | undefined {
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

  if (overrideIngredientNames.size === 0) {
    return undefined;
  }

  const selectedIngredient =
    productOrder.ingredientSelections.find(
      ingredient => {
        const ingredientName =
          normalizeIngredientName(
            ingredient.name
          );

        return (
          overrideIngredientNames.has(
            ingredientName
          ) &&
          ingredient.included
        );
      }
    );

  return selectedIngredient?.name;
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
function shouldShowIngredientOverrideSelectorForModifier(
  product: Product,
  definition: ModifierDefinition,
  draft?: ModifierDraft
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

  if (!draft?.enabled) {
    return false;
  }

  return Boolean(
    definition.requiresIngredientOverrideSelectionIfPresent
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
  () =>
    getInitialOverrideIngredientName(
      product,
      productOrder
    )
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


  function renderIngredientOverrideSelector() {
  if (
    ingredientOverrideOptions.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="
        mt-6
       
        pt-5
      "
    >
      <div
        className="
          mb-4
        "
      >
        <h3
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.25em]
            text-neutral-950
          "
        >
          Choose One
        </h3>

        <p
          className="
            mt-1
            text-xs
            italic
            leading-relaxed
            text-neutral-700
          "
        >
          Select the ingredient option for this modifier.
        </p>
      </div>

      <div
        className="
          space-y-3
        "
      >
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
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  text-left
                  text-sm
                  text-neutral-950
                "
              >
                <span
                  className={`
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    border
                    text-sm
                    font-black
                    leading-none
                    transition

                    ${
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300 bg-white text-transparent group-hover:border-neutral-950"
                    }
                  `}
                >
                  ✓
                </span>

                <span
                  className="
                    font-semibold
                    leading-snug
                  "
                >
                  {ingredient.name}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
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
          <span
            className="
              h-px
              w-20
              bg-neutral-700
              sm:w-28
            "
          />

          <span
            className="
              text-sm
              font-black
              uppercase
              tracking-[0.45em]
              sm:text-lg
            "
          >
            Order Online
          </span>

          <span
            className="
              h-px
              w-20
              bg-neutral-700
              sm:w-28
            "
          />
        </div>

        <h1
          className="
            text-5xl
            font-black
            uppercase
            tracking-[0.28em]
            md:text-7xl
          "
        >
          Sandwiches
        </h1>

        <p
          className="
            mt-5
            text-xs
            font-black
            uppercase
            tracking-[0.28em]
            sm:text-sm
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
            p-4
          "
        >
          {product.image ? (
            <img
              src={product.image.src}
              alt={product.name}
              className="
                h-[280px]
                w-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-[280px]
                items-center
                justify-center
                bg-neutral-200
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-neutral-500
              "
            >
              No Image
            </div>
          )}
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
              leading-tight
              tracking-[0.18em]
            "
          >
            {draftProductOrder.name}
          </h2>

          {product.price !== null &&
            product.price !== undefined &&
            product.price !== "" && (
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

          {product.shortDescription && (
            <div
              className="
                mt-7
                max-w-md
                text-xs
                italic
                leading-relaxed
                text-neutral-700
              "
              dangerouslySetInnerHTML={{
                __html: product.shortDescription,
              }}
            />
          )}

          <p
            className="
              mt-4
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
                handleQuantityChange(
                  Number(event.target.value)
                )
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
              {[
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
              ].map(value => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
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
          lg:divide-x
          lg:divide-neutral-900
        "
      >
        <section
          className="
            border-t
            border-black/70
            pt-6
            lg:border-t-0
            lg:pr-8
          "
        >
          <div
            className="
              mb-5
            "
          >
            <h2
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.28em]
              "
            >
              Ingredients
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-xs
                italic
                leading-relaxed
                text-neutral-700
              "
            >
              Choose how each ingredient should be prepared.
            </p>
          </div>

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

        {modifierDefinitions.length > 0 && (
          <>
            {modifierDefinitions.map(
              definition => {
                const draft =
                  modifierDrafts[
                    definition.id
                  ];

                if (!draft) {
                  return null;
                }

                const showOverrideForThisModifier =
  shouldShowIngredientOverrideSelectorForModifier(
    product,
    definition,
    draft
  );

return (
  <div
    key={definition.id}
    className="
      border-t
      border-black/70
      pt-6
      lg:border-t-0
      lg:px-8
    "
  >
    <ModifierSection
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

    {showOverrideForThisModifier &&
      renderIngredientOverrideSelector()}
  </div>
);
              }
            )}
          </>
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
          {isEditing
            ? "Update Item"
            : "Add Item"}
        </div>

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <button
            type="button"
            onClick={onCancel}
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
            className="
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
            "
          >
            {isEditing
              ? "Update Cart"
              : "Add To Cart >"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}