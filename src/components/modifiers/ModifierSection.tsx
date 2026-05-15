"use client";

import {
  ModifierDefinition,
  ModifierDraft,
} from "@/types/cart";

import ModifierOptionGroup
  from "./ModifierOptionGroup";

type Props = {
  definition: ModifierDefinition;

  draft: ModifierDraft;

  onDraftChange: (
    draft: ModifierDraft
  ) => void;

  onToggleOption: (
    groupId: string,
    optionId: number
  ) => void;
};

export default function ModifierSection({
  definition,
  draft,
  onDraftChange,
  onToggleOption,
}: Props) {
  const modifierName =
    definition.baseProduct?.name ??
    definition.id;

  const modifierPriceOverride =
    definition.baseProduct
      ?.config
      ?.priceOverride;

  const modifierDescription =
    definition.baseProduct
      ?.shortDescription ??
    definition.baseProduct
      ?.description;

  const modifierPrice =
    Number(
      definition.baseProduct?.price ?? 0
    );

  function toggleEnabled() {
    onDraftChange({
      ...draft,

      enabled:
        !draft.enabled,
    });
  }

  return (
    <section
     
    >
      <button
        type="button"
        onClick={toggleEnabled}
        className="
          group
          mb-5
          flex
          w-full
          items-start
          gap-3
          text-left
        "
      >
        <span
          className={`
            mt-0.5
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
              draft.enabled
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300 bg-white text-transparent group-hover:border-neutral-950"
            }
          `}
        >
          ✓
        </span>

        <span
          className="
            min-w-0
            flex-1
          "
        >
          <span
            className="
              block
              text-sm
              font-black
              uppercase
              tracking-[0.28em]
              text-neutral-950
            "
          >
            {modifierName}
          </span>

          {modifierDescription && (
            <span
              className="
                mt-2
                block
                max-w-md
                text-xs
                italic
                leading-relaxed
                text-neutral-700
              "
              dangerouslySetInnerHTML={{
                __html: modifierDescription,
              }}
            />
          )}

          {modifierPrice > 0 && (
            <span
              className="
                mt-2
                block
                text-xs
                font-semibold
                text-neutral-800
              "
            >
              {modifierPriceOverride
                ? `Changes price to $${modifierPrice.toFixed(2)}`
                : `+$${modifierPrice.toFixed(2)}`}
            </span>
          )}
        </span>
      </button>

      {draft.enabled && (
        <div
          className="
            space-y-7
          "
        >
          {definition.optionGroups.map(
            group => (
              <ModifierOptionGroup
                key={group.id}
                group={group}
                selectedOptionIds={
                  draft.selectionsByGroup[
                    group.id
                  ] ?? []
                }
                onToggleOption={
                  optionId =>
                    onToggleOption(
                      group.id,
                      optionId
                    )
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}