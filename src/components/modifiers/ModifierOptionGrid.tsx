import {
  ModifierOptionDefinition,
} from "@/types/cart";

import ModifierOptionCard
  from "./ModifierOptionCard";

type Props = {
  options: ModifierOptionDefinition[];

  selectedOptionIds: number[];

  disabled?: boolean;

  onToggleOption: (
    optionId: number
  ) => void;
};

export default function ModifierOptionGrid({
  options,
  selectedOptionIds,
  disabled = false,
  onToggleOption,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-3
      "
    >
      {options.map(option => (
        <ModifierOptionCard
          key={option.id}
          option={option}
          selected={
            selectedOptionIds.includes(
              option.id
            )
          }
          disabled={disabled}
          onToggle={() =>
            onToggleOption(option.id)
          }
        />
      ))}
    </div>
  );
}