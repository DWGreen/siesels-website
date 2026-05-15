import {
  ModifierOptionGroupDefinition,
} from "@/types/cart";

import ModifierOptionGrid
  from "./ModifierOptionGrid";

type Props = {
  group: ModifierOptionGroupDefinition;

  selectedOptionIds: number[];

  onToggleOption: (
    optionId: number
  ) => void;
};

export default function ModifierOptionGroup({
  group,
  selectedOptionIds,
  onToggleOption,
}: Props) {
  const isAutoAddGroup =
    group.autoAddAllProducts;

  return (
    <div>
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
          {group.name}
        </h3>

        <div
          className="
            mt-1
            text-xs
            italic
            leading-relaxed
            text-neutral-700
          "
        >
          {group.required && (
            <span>
              Required.
            </span>
          )}

          {group.maxSelections && !isAutoAddGroup && (
            <span>
              {group.required ? " " : ""}
              Choose up to {group.maxSelections}.
            </span>
          )}

          {isAutoAddGroup && (
            <span>
              Included automatically.
            </span>
          )}
        </div>
      </div>

      <ModifierOptionGrid
        options={group.options}
        selectedOptionIds={
          selectedOptionIds
        }
        disabled={isAutoAddGroup}
        onToggleOption={
          onToggleOption
        }
      />
    </div>
  );
}