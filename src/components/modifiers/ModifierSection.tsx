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
  const modifierPriceOverride = definition.baseProduct?.config?.priceOverride;
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
      className="
        space-y-4
        rounded-2xl
        border
        p-4
      "
    >
      <label
        className="
          flex
          items-start
          gap-3
          cursor-pointer
        "
      >
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={toggleEnabled}
          className="mt-1"
        />

        <div className="space-y-1">
          <div
            className="
              font-semibold
              text-lg
            "
          >
            {modifierName}
          </div>

          {modifierDescription && (
            <div
              className="
                text-sm
                text-gray-500
              "
              dangerouslySetInnerHTML={{
                __html: modifierDescription,
              }}
            />
          )}

          {modifierPrice > 0 && (
            <div
              className="
                text-sm
                font-medium
              "
            >
                {modifierPriceOverride ? `Changes Price To: $${modifierPrice.toFixed(2)}` : `+$${modifierPrice.toFixed(2)}`}
            </div>
          )}
        </div>
      </label>

      {draft.enabled && (
        <div className="space-y-6">
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