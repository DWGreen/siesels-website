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
    <div className="space-y-3">
      <div className="space-y-1">
        <h3
          className="
            text-base
            font-semibold
          "
        >
          {group.name}
        </h3>

        {group.required && (
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Required
          </p>
        )}

        {group.maxSelections && !isAutoAddGroup && (
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Choose up to{" "}
            {group.maxSelections}
          </p>
        )}

        {isAutoAddGroup && (
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Included automatically
          </p>
        )}
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